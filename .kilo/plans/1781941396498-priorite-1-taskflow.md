# Plan d’implémentation — Priorité 1 TaskFlow

## Objectif

Corriger les incohérences critiques identifiées dans l’analyse sans refonte UI :

1. rôle projet ignoré à l’ajout d’un membre ;
2. incohérence rôle frontend/backend ;
3. routes projet non protégées ;
4. adaptation frontend aux champs backend ;
5. connexion minimale du dashboard à l’API ;
6. connexion minimale de la page tâches à l’API.

---

## Tâches backend

### 1. Corriger le rôle projet à l’ajout d’un membre

Fichier : `taskflow-backend/src/services/projects/projectMemberService.js`

Remplacer :

```js
role: user.role || 'member'
```

par :

```js
role: data.role || 'member'
```

Validation attendue :

- créer un membre avec `role: 'viewer'` ;
- vérifier que le membre est bien créé avec le rôle demandé ;
- vérifier que l’absence de rôle donne `member` par défaut.

---

## Tâches frontend — authentification et routes

### 2. Corriger la vérification des rôles

Fichier : `taskflow-frontend/src/hooks/useAuth.js`

Remplacer :

```js
const hasAnyRole = (roles) =>
    user && roles.some((role) => user.role === role)
```

par une logique compatible avec les deux formats :

```js
const hasAnyRole = (roles) =>
    user && roles.some((role) => user.roleGlobal === role || user.role === role)
```

Validation attendue :

- un utilisateur admin peut accéder à `/admin/*` ;
- un utilisateur non admin est redirigé vers `/unauthorized`.

---

### 3. Protéger les routes projet détaillées

Fichier : `taskflow-frontend/src/App.jsx`

Remplacer :

```jsx
<Route path="/projects/:id" element={<ProjectDetail />} />
<Route path="/projects/:id/edit" element={<EditProject />} />
```

par :

```jsx
<Route
  path="/projects/:id"
  element={
    <ProtectedRoute>
      <ProjectDetail />
    </ProtectedRoute>
  }
/>
<Route
  path="/projects/:id/edit"
  element={
    <ProtectedRoute>
      <EditProject />
    </ProtectedRoute>
  }
/>
```

Validation attendue :

- `/projects/:id` sans token redirige vers `/login` ;
- `/projects/:id/edit` sans token redirige vers `/login`.

---

## Tâches frontend — cohérence des champs backend

### 4. Créer un helper de normalisation des statuts

Fichier recommandé : `taskflow-frontend/src/utils/constants.js` ou nouveau fichier utilitaire léger.

Objectif : mapper les statuts backend vers les valeurs frontend.

Exemple :

```js
export const STATUS_MAP = {
  1: 'todo',
  2: 'in-progress',
  3: 'done',
};

export const getStatusFromTask = (task) =>
  task?.status?.name === 'done' || task?.statusId === 3
    ? 'done'
    : task?.status?.name === 'in_progress' || task?.statusId === 2
      ? 'in-progress'
      : 'todo';
```

Validation attendue :

- les tâches backend avec `statusId: 3` sont affichées comme terminées ;
- les tâches backend avec `statusId: 1` sont affichées comme à faire ;
- les tâches backend avec `statusId: 2` sont affichées comme en cours.

---

### 5. Adapter les calculs de progression projet

Fichiers concernés :

- `taskflow-frontend/src/pages/Projects/Projects.jsx`
- `taskflow-frontend/src/pages/Projects/ProjectDetail.jsx`
- éventuellement `taskflow-frontend/src/components/projects/ProjectCard.jsx`

Remplacer les calculs basés sur :

```js
task.status === 'completed'
```

par une logique basée sur :

```js
task.statusId === 3
```

ou :

```js
task.status?.name === 'done'
```

Validation attendue :

- un projet avec des tâches terminées affiche une progression correcte ;
- un projet sans tâches affiche `0%`.

---

## Tâches frontend — dashboard API

### 6. Connecter le dashboard aux endpoints backend

Fichier : `taskflow-frontend/src/pages/Dashboard.jsx`

Ajouter les appels API nécessaires :

```txt
GET /api/dashboard/stats
GET /api/dashboard/recent-projects?limit=4
GET /api/dashboard/recent-tasks?limit=4
```

Implémentation recommandée :

- utiliser `useState`, `useEffect`, `useCallback` ;
- afficher un loader pendant le chargement ;
- afficher un message si aucune donnée ;
- mapper `stats.totalProjects` vers « Projets actifs » ;
- mapper `stats.myTasks` vers « Tâches en cours » ;
- mapper `stats.totalMembers` vers « Membres d’équipe » ;
- mapper `stats.completionRate` vers « Taux de complétion ».

Mapping projets :

```js
{
  title: project.name,
  description: project.description,
  progress: calculerProgression(project),
  members: project.members?.length || 0,
  status: project.isArchived ? 'completed' : 'active',
  color: project.color || '#33C1FF',
  createdAt: project.created_at,
}
```

Mapping tâches :

```js
{
  title: task.title,
  priority: task.priority?.name || 'medium',
  dueDate: formaterDate(task.dueDate),
  assignee: {
    name: `${task.assignee?.firstName || ''} ${task.assignee?.lastName || ''}`.trim() || 'Non assigné',
    avatar: task.assignee?.avatarUrl || '/placeholder.svg',
  },
  comments: task.comments?.length || 0,
  project: task.project?.name || '',
  status: getStatusFromTask(task),
}
```

Validation attendue :

- le dashboard affiche les vraies stats ;
- le dashboard affiche les vrais projets récents ;
- le dashboard affiche les vraies tâches récentes ;
- si aucune donnée, l’interface reste lisible.

---

## Tâches frontend — page tâches API

### 7. Connecter la page `/tasks` aux tâches de l’utilisateur

Fichier : `taskflow-frontend/src/pages/Tasks/Tasks.jsx`

Option recommandée : utiliser le backend existant via `/api/tasks/projects/:projectId/tasks` pour chaque projet, ou ajouter un endpoint dédié `GET /api/tasks/me` si nécessaire.

Pour éviter une modification backend supplémentaire, utiliser :

```txt
GET /api/projects
GET /api/tasks/projects/:projectId/tasks?assignee=:userId
```

Flux recommandé :

1. charger les projets via `projectService.getProjects()` ;
2. charger les tâches assignées à l’utilisateur courant pour chaque projet ;
3. fusionner les tâches ;
4. filtrer par statut, projet et priorité côté frontend ;
5. afficher les cartes via `TaskCard`.

Mapping tâche :

```js
{
  title: task.title,
  priority: task.priority?.name || 'medium',
  dueDate: formaterDate(task.dueDate),
  assignee: {
    name: `${task.assignee?.firstName || ''} ${task.assignee?.lastName || ''}`.trim() || 'Non assigné',
    avatar: task.assignee?.avatarUrl || '/placeholder.svg',
  },
  comments: task.comments?.length || 0,
  project: task.project?.name || '',
  status: getStatusFromTask(task),
}
```

Validation attendue :

- la page affiche les vraies tâches assignées ;
- les onglets À faire / En cours / Terminé reflètent les statuts backend ;
- le filtre par projet fonctionne ;
- le filtre par priorité fonctionne ;
- si aucune tâche, afficher un message clair.

---

## Validation globale

### Backend

Exécuter :

```bash
cd taskflow-backend
npm test -- --runInBand
```

Critères :

- tous les tests passent ;
- les tests existants ne régressent pas.

### Frontend

Exécuter :

```bash
cd taskflow-frontend
npm run build
npm run lint
```

Critères :

- le build passe ;
- les erreurs ESLint liées aux modifications de priorité 1 sont corrigées ;
- les warnings restants éventuels sont listés mais ne bloquent pas la priorité 1.

### Manuel

Scénarios à tester :

1. créer un utilisateur membre ;
2. créer un projet avec un admin ;
3. ajouter un membre avec rôle `viewer` ;
4. vérifier que le rôle affiché est bien `viewer` ;
5. se connecter avec un utilisateur non admin ;
6. accéder à `/projects/:id` sans être connecté : redirection login ;
7. accéder à `/projects/:id/edit` sans être connecté : redirection login ;
8. vérifier que le dashboard affiche les vraies données ;
9. vérifier que la page tâches affiche les vraies tâches assignées.

---

## Risques connus

- La page tâches peut nécessiter plusieurs appels API si aucun endpoint `GET /api/tasks/me` n’existe.
- Le composant `TaskCard` attend `status` mais ne l’utilise pas encore visuellement.
- Le dashboard doit gérer les cas vides pour éviter les erreurs d’affichage.
- Les routes protégées ne règlent pas encore l’autorisation côté backend pour les rôles projet sur toutes les actions.

---

## Hors scope pour cette priorité

- refonte UI complète ;
- websocket ou notifications temps réel ;
- drag & drop ;
- upload de pièces jointes côté UI ;
- page profil ;
- page paramètres ;
- correction complète de tous les warnings ESLint ;
- changement de stratégie de stockage des tokens.
