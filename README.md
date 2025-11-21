# 🧾 Cahier des Charges – Projet TaskFlow

## 🚀 Projet : TaskFlow

**Équipe :** Nova – OpenDev Mada  
**Date de lancement :** Octobre 2025  
**Objectif :** Créer une application web collaborative de **gestion de projets et de tâches** (inspirée de Trello / Notion lite).

---

## 1. 🎯 Objectif général

**TaskFlow** est une application web permettant à une équipe de :

- Créer et gérer des **projets**.  
- Créer, assigner et suivre des **tâches**.  
- Gérer les **rôles** des utilisateurs (admin, membre, lecteur).  
- Suivre l’avancement via **statuts**, **notifications** et **commentaires**.  

Le but est d’avoir une **plateforme simple, fluide et moderne**, adaptée à la collaboration d’une petite ou moyenne équipe.

---

## 2. 👥 Équipe technique

| Nom         | Rôle               | Compétences                  |
| ----------- | ------------------ | ---------------------------- |
| **Richard** | Chef de projet / Full stack Developer  | Laravel, Node.js, SpringBoot, Django, React            |
| **Toky**    | Full stack Developer  | Symfony, Node.js, SpringBoot, React |

---

## 3. ⚙️ Stack technique

### Backend

- **Langage / Framework :** Node.js + Express.js  
- **Base de données :** PostgreSQL (ou MySQL en alternative)  
- **ORM :** Sequelize ou Prisma  
- **Auth :** JWT (JSON Web Token)  
- **Structure API :** RESTful  
- **Hébergement :** à définir (Render / Railway / VPS interne)  

### Frontend

- **Framework :** React.js (CRA ou Vite)  
- **Librairie UI :** TailwindCSS (recommandé pour rapidité)  
- **State management :** Context API ou Redux Toolkit  
- **Routing :** React Router DOM  

---

## 4. 🧩 Fonctionnalités principales

### A. Authentification & Comptes

- Inscription / Connexion (email + mot de passe)  
- Gestion du profil utilisateur (photo, nom, rôle)  
- Réinitialisation de mot de passe  
- Sécurité : hashage bcrypt + JWT  

### B. Gestion des projets

- Création d’un projet avec nom, description et couleur  
- Liste des projets disponibles  
- Possibilité d’inviter des membres  
- Rôles :  
  - **Admin :** crée, modifie, supprime projets et membres  
  - **Membre :** gère ses tâches  
  - **Lecteur :** visualisation seulement  

### C. Gestion des tâches

- Créer, éditer, supprimer des tâches  
- Attribuer une tâche à un membre  
- Statuts possibles :  
  - 🟡 À faire  
  - 🔵 En cours  
  - 🟢 Terminé  
- Ajouter un niveau de priorité : Faible / Moyenne / Haute  
- Option de **deadline** (date limite)  
- Possibilité d’ajouter une **description détaillée** ou des **commentaires**  

### D. Notifications

- Notification (ou simple alerte visuelle) lors :  
  - D’une tâche assignée  
  - D’un changement de statut  
  - D’un commentaire reçu  

### E. Tableau de bord (Dashboard)

- Vue d’ensemble : nombre de projets, tâches actives, membres  
- Graphiques de progression (simple % de tâches terminées)  

---

## 5. 🎨 Design & UX/UI

### Thème général

- **Ambiance :** moderne, épurée, collaborative  
- **Palette de couleurs recommandée :**
  - Couleur principale : `#3B82F6` (bleu clair professionnel)  
  - Secondaire : `#1E293B` (bleu foncé / gris anthracite)  
  - Accent : `#10B981` (vert réussite)  
  - Fond clair : `#F8FAFC`  
  - Texte : `#0F172A` (noir doux)  

### Style visuel

- Design **dark/light mode** (optionnel)  
- Utilisation d’**icônes** (Lucide, Heroicons)  
- Boutons arrondis (`border-radius: 10px`)  
- Espacement aéré, interface **responsive**  
- Animation légère (hover / transitions entre sections)  

### Pages principales

1. **Page de login / register**
   - Formulaire centré  
   - Logo TaskFlow  
2. **Dashboard**
   - Vue synthétique des projets et tâches  
3. **Page d’un projet**
   - Liste des tâches par statut (type “kanban” ou liste)  
   - Bouton “+ Nouvelle tâche”  
4. **Profil utilisateur**
   - Informations personnelles  
   - Photo + bouton de déconnexion  

---

## 6. 🧠 Architecture API (simplifiée)

**Endpoints principaux :**

| Méthode | Route             | Description                  |
| -------- | ----------------- | ---------------------------- |
| POST    | /auth/register    | Créer un compte              |
| POST    | /auth/login       | Se connecter                 |
| GET     | /projects         | Liste des projets            |
| POST    | /projects         | Créer un projet              |
| GET     | /projects/:id     | Détails d’un projet          |
| PUT     | /projects/:id     | Modifier un projet           |
| DELETE  | /projects/:id     | Supprimer un projet          |
| POST    | /tasks            | Créer une tâche              |
| GET     | /tasks/:projectId | Liste des tâches d’un projet |
| PUT     | /tasks/:id        | Modifier une tâche           |
| DELETE  | /tasks/:id        | Supprimer une tâche          |

---

## 7. 📅 Planning prévisionnel

| Étape                           | Durée estimée | Responsable        |
| ------------------------------- | ------------- | ------------------ |
| Phase 1 – Setup & Auth          | 1 semaine     | Toky / Gino        |
| Phase 2 – API Projets & Tâches  | 2 semaines    | Toky / Gino        |
| Phase 3 – Interface Front React | 2 semaines    | Johann             |
| Phase 4 – Tests & Intégration   | 1 semaine     | Tous               |
| Phase 5 – Déploiement           | 2-3 jours     | DevOps / Hébergeur |

---

## 8. 📁 Livrables attendus

- Code source GitHub (front + back)  
- Documentation API (Swagger ou Postman)  
- Guide d’installation et de lancement  
- Version déployée en ligne (URL publique)  
- Présentation / démo finale (optionnelle)  

---

## 9. 🧩 Bonus (si temps disponible)

- Mode sombre  
- Drag & Drop des tâches (comme Trello)  
- Mentions et commentaires entre membres  
- Intégration d’un calendrier de deadlines  
- Upload de fichiers dans les tâches  

---

## 10. ✅ Résumé rapide

| Élément              | Description                                 |
| -------------------- | ------------------------------------------- |
| Nom                  | **TaskFlow**                                |
| Type                 | Application web collaborative               |
| Frontend             | React.js + TailwindCSS                      |
| Backend              | Node.js + Express                           |
| BDD                  | PostgreSQL                                  |
| Objectif             | Gestion de projets et tâches                |
| Fonctionnalités clés | Auth, projets, tâches, rôles, notifications |
| Style                | Moderne, épuré, bleu/vert, responsive       |
