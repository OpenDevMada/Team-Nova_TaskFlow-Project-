# Analyse Backend — Fonctionnalités Manquantes vs Cahier des Charges

> Classé par priorité — 🔴 Critique > 🟠 Haute > 🟡 Moyenne > 🟢 Bonus  
> **Dernière mise à jour :** 6 juin 2026 — 17/17 items résolus ✅

---

## 🔴 Critique (résolus)

| #  | CDC § | Manque | Résolution |
|----|-------|--------|------------|
| B1 | §4C   | ~~Création de tâche cassée~~ | `taskService.js:7` — typo `taskDazta` → `taskData` corrigé |
| B2 | §4B   | ~~Projets créés sans listes~~ | `projectService.js:31` — `createDefaultLists()` appelé après création du projet |
| B3 | Stack | ~~6 tables sans migration~~ | 6 fichiers de migration créés (projets, project_members, task_comments, notifications, password_resets, activity_logs) |

---

## 🟠 Haute (résolus)

| #  | CDC § | Manque | Résolution |
|----|-------|--------|------------|
| B4 | §4C   | ~~Commentaires sur les tâches~~ | API CRUD complète : `GET/POST /api/tasks/:taskId/comments`, `PUT/DELETE .../:commentId` |
| B5 | §4D   | ~~Notifications~~ | API : `GET/PATCH /api/notifications` + déclencheurs automatiques sur assignation, changement statut, commentaire, invitation |
| B6 | §4E   | ~~Dashboard / Statistiques~~ | 3 endpoints : `GET /api/dashboard/stats`, `/recent-projects`, `/recent-tasks` |
| B7 | §4A   | ~~Envoi d'email (reset password)~~ | `emailService.js` avec Nodemailer configuré, intégré au `forgotPassword` |

---

## 🟡 Moyenne (résolus)

| #   | CDC § | Manque | Résolution |
|-----|-------|--------|------------|
| B8  | §4B   | ~~Validation des entrées incomplète~~ | `validationMiddleware.js` enrichi : 8 nouvelles règles appliquées sur toutes les routes (projets, tâches, listes, membres) |
| B9  | §4B   | ~~Rôle global vs rôle projet~~ | `projectService.js` refait : `findAll` filtre par projets du membre, `findById`/`update`/`delete` vérifient ownership + rôle dans `ProjectMember` |
| B10 | §6    | ~~Swagger/docs inexacts~~ | `docs.js` réécrit avec toutes les routes réelles + nouveaux endpoints |
| B11 | §4C   | ~~Activity Log inexistant~~ | `activityLogService.js` créé (12 méthodes) + intégré dans tous les contrôleurs |
| B12 | §4A   | ~~Réponses non standardisées~~ | `projectController` réécrit : toutes les réponses utilisent `{ success, data }` |
| B13 | §4B   | ~~Try/catch redondant~~ | `projectController` et `projectMemberController` nettoyés : tout passe par `errorHandler` centralisé |
| B14 | §4A   | ~~Seeders absents~~ | `seeders/20251019110000-demo-user.js` créé (admin + member de test) |

---

## 🟢 Bonus (résolus)

| #   | CDC § | Manque | Résolution |
|-----|-------|--------|------------|
| B15 | §9    | ~~Upload de fichiers~~ | `uploadMiddleware.js` (multer) + `uploadService.js` (Cloudinary) + routes `POST /api/upload/avatar` et `/api/upload/tasks/:taskId/attachments` |
| B16 | §9    | ~~Mentions dans commentaires~~ | Parsing automatique des `@mentions` dans `taskCommentService.createComment()` avec création de notifications pour chaque personne mentionnée |
| B17 | §9    | ~~Calendrier / deadlines~~ | `GET /api/tasks/calendar?startDate=...&endDate=...` avec regroupement par date |

---

## Nouvelles routes API ajoutées

| Méthode | Route | Description |
|---------|-------|-------------|
| GET     | `/api/dashboard/stats` | Statistiques du tableau de bord |
| GET     | `/api/dashboard/recent-projects` | Projets récents (limit=5 par défaut) |
| GET     | `/api/dashboard/recent-tasks` | Tâches récentes (limit=5 par défaut) |
| GET     | `/api/notifications` | Liste des notifications de l'utilisateur |
| GET     | `/api/notifications/unread-count` | Nombre de notifications non lues |
| PATCH   | `/api/notifications/:id/read` | Marquer une notification comme lue |
| POST    | `/api/notifications/mark-all-read` | Tout marquer comme lu |
| GET     | `/api/tasks/:taskId/comments` | Liste des commentaires d'une tâche |
| POST    | `/api/tasks/:taskId/comments` | Ajouter un commentaire |
| PUT     | `/api/tasks/:taskId/comments/:commentId` | Modifier un commentaire |
| DELETE  | `/api/tasks/:taskId/comments/:commentId` | Supprimer un commentaire |
| POST    | `/api/upload/avatar` | Upload de la photo de profil |
| POST    | `/api/upload/tasks/:taskId/attachments` | Upload d'une pièce jointe à une tâche |
| GET     | `/api/tasks/calendar?startDate=&endDate=` | Tâches par plage de dates (calendrier) |

---

## Couverture du CDC (section 6 — Architecture API)

| Méthode | Route demandée             | Statut |
|----------|----------------------------|--------|
| POST     | `/auth/register`           | ✅ OK |
| POST     | `/auth/login`              | ✅ OK |
| GET      | `/projects`                | ✅ OK |
| POST     | `/projects`                | ✅ OK |
| GET      | `/projects/:id`            | ✅ OK |
| PUT      | `/projects/:id`            | ✅ OK |
| DELETE   | `/projects/:id`            | ✅ OK |
| POST     | `/tasks`                   | ✅ OK |
| GET      | `/tasks/:projectId`        | ✅ OK |
| PUT      | `/tasks/:id`               | ✅ OK |
| DELETE   | `/tasks/:id`               | ✅ OK |

---

**Résumé :** 17 items → **17 résolus** — ✅ Backend complet.
