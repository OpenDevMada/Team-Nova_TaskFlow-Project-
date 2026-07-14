# Briefing d’analyse complète — TaskFlow

## 1. Vue d’ensemble du projet

**TaskFlow** est une application web collaborative de gestion de projets et de tâches, inspirée de Trello / Notion lite.  
Le projet est organisé en monorepo avec deux applications principales :

```txt
Team-Nova_TaskFlow-Project-
├── taskflow-backend/
├── taskflow-frontend/
├── README.md
└── Analyse_Fonctionnalites_Manquantes_TaskFlow.docx
```

L’objectif du cahier des charges est de fournir :

- authentification utilisateur ;
- gestion des projets ;
- gestion des membres et rôles ;
- gestion des tâches, listes, statuts et priorités ;
- commentaires ;
- notifications ;
- dashboard ;
- upload de fichiers ;
- documentation API.

---

## 2. Stack technique

### Backend

- **Framework :** Node.js + Express.js
- **ORM :** Sequelize
- **Base de données :** PostgreSQL en priorité, MySQL aussi présent dans les dépendances
- **Authentification :** JWT + refresh token en cookie HttpOnly
- **Sécurité :** bcryptjs, helmet, rate limit, validation express-validator
- **Tests :** Jest + Supertest
- **Documentation :** Swagger + documentation JSON interne
- **Upload :** Multer + Cloudinary
- **Email :** Nodemailer avec fallback simulation si SMTP non configuré

### Frontend

- **Framework :** React 19 + Vite
- **Routing :** React Router DOM v7
- **HTTP :** Axios
- **UI :** TailwindCSS v4 + composants custom inspirés shadcn/ui
- **Notifications UI :** react-toastify, SweetAlert2
- **Icônes :** lucide-react
- **State :** hooks React maison, pas de Redux

---

## 3. Architecture backend

### Entrée principale

`taskflow-backend/server.js`

Le serveur démarre avec :

```js
await syncDatabase();
app.listen(PORT, ...)
```

`syncDatabase()` est défini dans `src/app.js`.

### Application Express

`taskflow-backend/src/app.js`

Middlewares utilisés :

- `helmet()`
- `cors()`
- `cookie-parser()`
- `express-rate-limit()`
- `morgan()`
- `express.json()`
- `express.urlencoded()`

Routes principales :

```txt
/health
/docs
/api-docs

/api/auth
/api/projects
/api/project-members
/api/task-lists
/api/tasks
/api/users
/api/dashboard
/api/notifications
/api/upload
```

---

## 4. Base de données

### Modèles principaux

Le backend utilise Sequelize avec les modèles suivants :

```txt
User
Project
ProjectMember
TaskList
Task
TaskStatus
PriorityLevel
TaskComment
Notification
PasswordReset
ActivityLog
```

### Tables principales

| Table | Rôle |
|---|---|
| `users` | Utilisateurs, mot de passe hashé, rôle global |
| `projects` | Projets avec propriétaire |
| `project_members` | Membres d’un projet avec rôle projet |
| `task_lists` | Listes / colonnes d’un projet |
| `tasks` | Tâches avec statut, priorité, assigné, deadline |
| `task_statuses` | Statuts : todo, in_progress, done |
| `priority_levels` | Priorités : low, medium, high |
| `task_comments` | Commentaires sur tâches |
| `notifications` | Notifications utilisateurs |
| `password_resets` | Tokens de réinitialisation |
| `activity_logs` | Journal d’activité |

### Points positifs

- UUID utilisés pour les IDs.
- Relations bien définies.
- Index présents sur les champs fréquents.
- Migrations Sequelize présentes.
- Données de référence initialisées automatiquement pour statuts et priorités.
- `sequelize.sync({ alter: false })` en développement.

### Risques / incohérences

- Il existe un fichier `taskflow-backend/database.sql` qui décrit une conception SQL, mais les migrations Sequelize sont la source réelle.
- Le fichier `taskflow-backend/config/config.json` semble exister dans un dossier non suivi `taskflow-backend/config/`, mais le code utilise plutôt `src/config/config.js`.
- `mysql2` est installé mais la configuration active utilise PostgreSQL.
- Certaines migrations non suivies semblent avoir été ajoutées après les migrations initiales.

---

## 5. Fonctionnalités backend implémentées

### Authentification

Routes :

```txt
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh-token
GET  /api/auth/profile
PUT  /api/auth/profile
PUT  /api/auth/change-password
POST /api/auth/logout
POST /api/auth/logout-all
```

Fonctionnalités :

- inscription ;
- connexion ;
- refresh token ;
- mot de passe oublié ;
- réinitialisation ;
- profil ;
- changement de mot de passe ;
- déconnexion.

Points forts :

- bcryptjs.
- JWT access token + refresh token.
- Refresh token stocké en DB et cookie HttpOnly.
- Validation forte du mot de passe.

Points d’attention :

- Le cookie `refreshToken` utilise `sameSite: 'strict'`.
- En production, `secure: true` uniquement si `NODE_ENV=production`.
- Le refresh token n’est pas tourné avec invalidation stricte de l’ancien token.
- En développement, `forgotPassword` renvoie le token dans la réponse, ce qui est utile pour tests mais doit être désactivé en production.

---

### Gestion des projets

Routes :

```txt
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Fonctionnalités :

- création projet ;
- liste des projets accessibles ;
- détail projet ;
- modification ;
- suppression ;
- création automatique de listes par défaut ;
- ajout automatique du créateur comme admin du projet.

Listes créées par défaut :

```txt
Backlog
À faire
En cours
En révision
Terminé
```

Points forts :

- vérification propriétaire / admin projet / admin global ;
- logs d’activité ;
- inclusion membres, listes, tâches, activités.

Points d’attention :

- Seuls les utilisateurs globaux `admin` peuvent créer un projet.
- Le frontend suppose parfois un champ `project.status`, mais le backend ne possède pas ce champ dans le modèle `Project`.

---

### Gestion des membres de projet

Routes :

```txt
GET  /api/project-members/projects/:projectId/members
POST /api/project-members/projects/:projectId/members
GET  /api/project-members
GET  /api/project-members/:id
PATCH /api/project-members/:id/role
DELETE /api/project-members/:id
```

Fonctionnalités :

- ajout membre ;
- liste membres ;
- modification rôle ;
- suppression membre ;
- notification d’invitation ;
- log d’activité.

Rôles projet :

```txt
admin
member
viewer
```

Points forts :

- unicité `(projectId, userId)` ;
- notification automatique lors d’une invitation ;
- suppression protégée pour les membres non autorisés.

Point critique :

Dans `ProjectMemberService.create()` :

```js
role: user.role || 'member'
```

Or le modèle `User` n’a pas de champ `role`, il a `roleGlobal`.  
Donc le rôle envoyé dans le body peut être ignoré, et le rôle du membre devient souvent `member` au lieu de `admin` ou `viewer`.

Correction recommandée :

```js
role: data.role || 'member'
```

---

### Gestion des tâches

Routes :

```txt
POST /api/tasks
GET  /api/tasks/:taskId
PUT  /api/tasks/:taskId
DELETE /api/tasks/:taskId
PATCH /api/tasks/:taskId/complete
GET  /api/tasks/projects/:projectId/tasks
GET  /api/tasks/calendar?startDate=&endDate=
```

Fonctionnalités :

- création tâche ;
- lecture tâche ;
- modification tâche ;
- suppression tâche ;
- marquer comme terminée ;
- filtrer par projet, statut, priorité, assigné ;
- calendrier par date.

Permissions :

- `admin` et `member` peuvent créer/modifier/supprimer ;
- `viewer` peut lire ;
- assigné doit être membre du projet.

Points forts :

- notifications sur assignation ;
- notifications sur changement de statut ;
- activité log ;
- position pour tri / drag & drop.

Points d’attention :

- Le statut de tâche utilise `statusId`, pas `status`.
- Le frontend calcule parfois la progression avec `task.status === 'completed'`, ce qui ne correspond pas au backend.
- Le changement de statut envoie des libellés génériques `"précédent"` et `"nouveau"` dans certaines notifications.
- `completeTask()` force directement `statusId: 3`.

---

### Gestion des listes de tâches

Routes :

```txt
GET  /api/task-lists/projects/:projectId/lists
POST /api/task-lists/projects/:projectId/lists
PUT  /api/task-lists/lists/:listId
DELETE /api/task-lists/lists/:listId
PATCH /api/task-lists/tasks/:taskId/move
PATCH /api/task-lists/lists/:listId/reorder
```

Fonctionnalités :

- listes par défaut ;
- création liste ;
- modification liste ;
- suppression liste vide ;
- déplacement tâche ;
- réorganisation des tâches.

Points forts :

- position numérique pour réordonnancement ;
- suppression protégée si liste contient des tâches.

Point d’attention :

Le contrôleur attend `position`, mais le hook frontend envoie parfois `newPosition`.

---

### Commentaires

Routes :

```txt
GET    /api/tasks/:taskId/comments
POST   /api/tasks/:taskId/comments
PUT    /api/tasks/:taskId/comments/:commentId
DELETE /api/tasks/:taskId/comments/:commentId
```

Fonctionnalités :

- lister commentaires ;
- ajouter commentaire ;
- modifier commentaire ;
- supprimer commentaire ;
- mentions `@nom` ;
- notification aux utilisateurs mentionnés ;
- notification au propriétaire/assigné de la tâche.

Points forts :

- parsing des mentions ;
- notification automatique ;
- activité log.

Point d’attention :

Le parsing des mentions est simple et peut créer des faux positifs.

---

### Notifications

Routes :

```txt
GET  /api/notifications
GET  /api/notifications/unread-count
PATCH /api/notifications/:notificationId/read
POST /api/notifications/mark-all-read
```

Types supportés :

```txt
task_assigned
status_changed
new_comment
project_invite
due_date_reminder
mention
```

Points forts :

- compteur non lus ;
- lecture individuelle ;
- lecture globale.

Point manquant :

- pas de websocket ou polling automatique côté frontend pour afficher les notifications en temps réel.

---

### Dashboard

Routes :

```txt
GET /api/dashboard/stats
GET /api/dashboard/recent-projects
GET /api/dashboard/recent-tasks
```

Stats renvoyées :

```txt
totalProjects
totalTasks
completedTasks
completionRate
tasksByStatus
myTasks
overdueTasks
totalMembers
```

Point important :

Le dashboard backend est connecté à l’API, mais le dashboard frontend actuel utilise encore des données statiques.

---

### Upload fichiers

Routes :

```txt
POST /api/upload/avatar
POST /api/upload/tasks/:taskId/attachments
```

Technologies :

- Multer memory storage ;
- Cloudinary ;
- limite 10 Mo ;
- types MIME autorisés.

Point important :

Le backend renvoie l’URL, mais le frontend n’a pas encore d’interface complète d’upload de pièces jointes.

---

## 6. Architecture frontend

### Routing

`taskflow-frontend/src/App.jsx`

Routes principales :

```txt
/
/login
/register
/dashboard
/tasks
/projects
/projects/:id
/projects/:id/edit
/admin/*
/unauthorized
/404
```

### Protection des routes

`src/components/common/ProtectedRoute.jsx`

Le composant vérifie :

- authentification ;
- redirection si déjà connecté ;
- rôle autorisé ;
- permissions.

Problème :

`useAuth.hasAnyRole()` vérifie :

```js
user.role
```

mais le backend renvoie :

```js
user.roleGlobal
```

Donc les routes admin peuvent ne pas fonctionner correctement.

Correction recommandée :

```js
const hasAnyRole = roles =>
  user && roles.some(role => user.roleGlobal === role || user.role === role);
```

---

### Services API

`src/services/api.js`

Axios est configuré avec :

- `baseURL` depuis `.env` ;
- `withCredentials: true` ;
- token `Authorization: Bearer ...` depuis `localStorage`.

Intercepteur de réponse :

- si `401`, tente un refresh token ;
- si échec, supprime le token et redirige vers `/login`.

Points d’attention :

- le token est stocké dans `localStorage`, donc exposé au XSS.
- le refresh token est en cookie HttpOnly côté backend, ce qui est mieux, mais l’access token reste en localStorage.
- l’intercepteur suppose que `refreshResponse.data.data.accessToken` existe.

---

### Hooks frontend

#### `useAuth`

Gère :

- état utilisateur ;
- login ;
- register ;
- logout ;
- profile ;
- change password ;
- refresh token.

Point critique :

```js
hasAnyRole()` utilise `user.role`, mais le backend renvoie `roleGlobal`.
```

#### `useProjects`

Gère :

- fetch projets ;
- création ;
- détail ;
- update ;
- suppression.

Point d’attention :

- ne recharge pas toujours la liste après modification ;
- certaines erreurs retournent `null` au lieu de lever une erreur.

#### `useTasks`

Gère :

- tâches ;
- listes ;
- création ;
- update ;
- suppression ;
- complétion ;
- déplacement ;
- réorganisation.

Point d’attention :

- hook très complet mais pas utilisé dans les pages principales actuelles.

#### `useProjectMembers`

Gère :

- membres ;
- ajout ;
- suppression ;
- rôle ;
- recherche utilisateurs.

---

## 7. Pages frontend

### Login

Page fonctionnelle :

- email ;
- mot de passe ;
- lien mot de passe oublié ;
- lien inscription ;
- stockage token après login.

Point d’attention :

- utilise `window.location.replace()` au lieu de `navigate()`.
- variable `navigate` importée mais non utilisée.

### Register

Page fonctionnelle :

- prénom ;
- nom ;
- email ;
- mot de passe ;
- confirmation mot de passe ;
- conditions d’utilisation.

Point critique :

Le backend exige un mot de passe avec majuscule, minuscule et chiffre, mais le frontend vérifie seulement la longueur minimale.  
Donc une inscription peut échouer côté backend même si le frontend pense que le formulaire est valide.

### Dashboard

Actuellement statique :

- stats en dur ;
- projets fictifs ;
- tâches fictives ;
- pas de consommation réelle de `/api/dashboard`.

À améliorer :

- utiliser `GET /api/dashboard/stats` ;
- afficher les vrais projets récents ;
- afficher les vraies tâches récentes.

### Projects

Page fonctionnelle :

- liste projets ;
- création projet ;
- édition projet ;
- suppression avec SweetAlert ;
- filtres par statut ;
- vue grille / liste.

Point important :

Le backend ne renvoie pas `project.status`, donc les filtres frontend `active`, `planning`, `completed` ne correspondent pas toujours aux données réelles.

### ProjectDetail

Page riche :

- informations projet ;
- membres ;
- ajout membre ;
- modification rôle ;
- suppression membre ;
- progression ;
- activités récentes ;
- listes de tâches.

Point d’attention :

- la progression est calculée à partir de `task.status`, alors que le backend utilise `statusId`.
- la route `/projects/:id` dans `App.jsx` n’est pas protégée par `ProtectedRoute`.

### Tasks

Page actuellement statique :

- tâches fictives ;
- filtres fictifs ;
- onglets par statut ;
- bouton nouvelle tâche non fonctionnel.

À améliorer :

- utiliser `useTasks` ;
- appeler `/api/tasks/projects/:projectId/tasks` ;
- connecter création / modification / suppression.

---

## 8. Tests et qualité

### Backend

Tests présents :

```txt
auth.test.js
projects.test.js
tasks.test.js
taskLists.test.js
comments.test.js
notifications.test.js
dashboard.test.js
projectMembers.test.js
health.test.js
```

Résultat exécuté :

```txt
Test Suites: 9 passed, 9 total
Tests:       61 passed, 61 total
```

Donc le backend est testé et la suite passe.

### Frontend

Build exécuté :

```txt
npm run build
```

Résultat :

```txt
✓ built in 28.84s
```

Mais warning :

```txt
Some chunks are larger than 500 kB
```

Lint exécuté :

```txt
npm run lint
```

Résultat :

```txt
18 errors
3 warnings
```

Principaux problèmes :

- imports inutilisés ;
- variables inutilisées ;
- `__dirname` non défini dans `vite.config.js` ;
- composants inutilisés ;
- hooks avec dépendances manquantes.

---

## 9. État Git

Branche actuelle :

```txt
richard
```

Dernier commit :

```txt
f28870e feat: Add project member management functionality
```

Travaux non commités importants :

```txt
M taskflow-backend/package-lock.json
M taskflow-backend/package.json
M taskflow-backend/src/app.js
M taskflow-backend/src/config/docs.js
M taskflow-backend/src/controllers/projects/projectController.js
M taskflow-backend/src/controllers/projects/projectMemberController.js
M taskflow-backend/src/controllers/tasks/taskController.js
M taskflow-backend/src/middleware/validationMiddleware.js
M taskflow-backend/src/routes/projects/projectMemberRoutes.js
M taskflow-backend/src/routes/projects/projectRoutes.js
M taskflow-backend/src/routes/tasks/taskListRoutes.js
M taskflow-backend/src/routes/tasks/taskRoutes.js
M taskflow-backend/src/services/authService.js
M taskflow-backend/src/services/projects/projectMemberService.js
M taskflow-backend/src/services/projects/projectService.js
M taskflow-backend/src/services/tasks/taskListService.js
M taskflow-backend/src/services/tasks/taskService.js
M taskflow-backend/src/services/userService.js
```

Fichiers non suivis :

```txt
taskflow-backend/MANQUES_BACKEND.md
taskflow-backend/config/
taskflow-backend/jest.config.js
taskflow-backend/migrations/...
taskflow-backend/models/
taskflow-backend/seeders/
taskflow-backend/src/controllers/dashboardController.js
taskflow-backend/src/controllers/notificationController.js
taskflow-backend/src/controllers/tasks/taskCommentController.js
taskflow-backend/src/controllers/uploadController.js
taskflow-backend/src/middleware/uploadMiddleware.js
taskflow-backend/src/routes/dashboardRoutes.js
taskflow-backend/src/routes/notificationRoutes.js
taskflow-backend/src/routes/tasks/taskCommentRoutes.js
taskflow-backend/src/routes/uploadRoutes.js
taskflow-backend/src/services/activityLogService.js
taskflow-backend/src/services/dashboardService.js
taskflow-backend/src/services/emailService.js
taskflow-backend/src/services/notificationService.js
taskflow-backend/src/services/tasks/taskCommentService.js
taskflow-backend/src/services/uploadService.js
taskflow-backend/tests/
Analyse_Fonctionnalites_Manquantes_TaskFlow.docx
email-classer.json
```

---

## 10. Points forts du projet

- Architecture backend claire controllers / services / routes / models.
- Authentification complète.
- JWT + refresh token.
- Rôles globaux et rôles par projet.
- CRUD projets et tâches.
- Listes de tâches type Kanban.
- Commentaires.
- Mentions.
- Notifications.
- Dashboard backend.
- Upload Cloudinary.
- Migrations Sequelize.
- Tests backend complets et passants.
- Frontend moderne avec React, Vite, TailwindCSS.
- UI agréable avec modales, SweetAlert, cartes, badges, avatars.

---

## 11. Problèmes principaux à corriger

### Critique

1. **Rôle projet ignoré à l’ajout d’un membre**

Dans `ProjectMemberService.create()` :

```js
role: user.role || 'member'
```

À remplacer par :

```js
role: data.role || 'member'
```

2. **Incohérence rôle frontend/backend**

Backend renvoie :

```js
roleGlobal
```

Frontend vérifie souvent :

```js
user.role
```

À corriger dans `useAuth`.

3. **Dashboard frontend statique**

Le backend fournit des stats réelles, mais le dashboard les ignore.

4. **Page Tasks statique**

La page `/tasks` n’utilise pas encore les hooks ou API.

5. **Frontend lint en échec**

18 erreurs ESLint doivent être corrigées avant mise en production.

---

### Important

6. **Progression projet mal calculée**

Frontend utilise souvent :

```js
task.status === 'completed'
```

Backend utilise :

```js
task.statusId === 3
```

7. **Routes non protégées**

Dans `App.jsx` :

```jsx
<Route path="/projects/:id" element={<ProjectDetail />} />
<Route path="/projects/:id/edit" element={<EditProject />} />
```

Ces routes devraient être protégées.

8. **Validation mot de passe frontend incomplète**

Le backend impose majuscule, minuscule et chiffre. Le frontend ne le fait pas.

9. **Fichiers `.env` présents**

`taskflow-backend/.env` et `taskflow-frontend/.env` existent localement.  
Le backend `.env` est ignoré par Git, mais contient des secrets locaux.

10. **Fichier externe non lié**

`email-classer.json` semble être un workflow n8n indépendant du projet TaskFlow. Il ne devrait probablement pas rester dans la racine du projet.

---

## 12. Recommandations prioritaires

### Priorité 1 — Corrections fonctionnelles

- Corriger `role: data.role || 'member'` dans `ProjectMemberService`.
- Corriger `hasAnyRole()` dans `useAuth`.
- Protéger `/projects/:id` et `/projects/:id/edit`.
- Adapter le frontend aux champs backend : `statusId`, `roleGlobal`, `created_at`, `dueDate`.
- Connecter Dashboard aux endpoints backend.
- Connecter Tasks aux endpoints backend.

### Priorité 2 — Qualité frontend

- Corriger les erreurs ESLint.
- Supprimer les composants inutilisés ou les intégrer.
- Corriger `vite.config.js` pour éviter `__dirname`.
- Réduire la taille du bundle avec code splitting.

### Priorité 3 — Sécurité

- Préférer stockage token en mémoire ou cookie sécurisé plutôt que localStorage.
- Vérifier que les secrets `.env` ne sont jamais commités.
- Supprimer ou déplacer `email-classer.json`.
- Désactiver l’affichage du reset token en production.
- Renforcer la rotation et l’invalidation des refresh tokens.

### Priorité 4 — Améliorations produit

- Ajouter page profil utilisateur.
- Ajouter page paramètres.
- Ajouter page équipe.
- Ajouter interface d’upload de pièces jointes.
- Ajouter affichage temps réel des notifications.
- Ajouter drag & drop réel des tâches.
- Ajouter calendrier des deadlines.
- Ajouter pagination sur les listes longues.
- Ajouter recherche globale.

---

## 13. Commandes utiles

### Backend

```bash
cd taskflow-backend
npm run dev
npm test
npm run db:migrate
npm run db:seed
npm run db:reset
```

### Frontend

```bash
cd taskflow-frontend
npm run dev
npm run build
npm run lint
```

---

## 14. Conclusion

Le projet TaskFlow est déjà bien avancé côté backend : l’authentification, les projets, les membres, les tâches, les commentaires, les notifications, le dashboard, l’upload et les tests sont majoritairement implémentés.

Côté frontend, l’interface est moderne et agréable, mais plusieurs pages restent statiques ou partiellement connectées à l’API. Les corrections prioritaires concernent les rôles, les routes protégées, le dashboard, la page tâches, la cohérence des champs backend/frontend et les erreurs ESLint.

Le projet est donc solide techniquement, mais nécessite encore une phase de stabilisation avant une mise en production fiable.
