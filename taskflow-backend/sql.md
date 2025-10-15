## Conception Base de Données TaskFlow

1. Table users (Utilisateurs)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
first_name      VARCHAR(100) NOT NULL
last_name       VARCHAR(100) NOT NULL
avatar_url      VARCHAR(500) NULL
role_global     VARCHAR(20) DEFAULT 'member' CHECK (role_global IN ('admin', 'member', 'viewer'))
is_active       BOOLEAN DEFAULT true
last_login_at   TIMESTAMP NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_users_email_active (email, is_active)
INDEX idx_users_role_active (role_global, is_active)

2. Table projects (Projets)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
name            VARCHAR(255) NOT NULL
description     TEXT NULL
color           VARCHAR(7) NULL  -- #FF6B6B
is_archived     BOOLEAN DEFAULT false
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_projects_owner (owner_id)
INDEX idx_projects_archived (is_archived)

3. Table project_members (Membres des projets)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE
user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
role            VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer'))
invited_by      UUID NULL REFERENCES users(id)
joined_at       TIMESTAMP DEFAULT NOW()
created_at      TIMESTAMP DEFAULT NOW()

-- Contraintes
UNIQUE (project_id, user_id)

-- Index
INDEX idx_project_members_project (project_id)
INDEX idx_project_members_user (user_id)
INDEX idx_project_members_role (role)

4. Table task_statuses (Référence des statuts)

id              SMALLINT PRIMARY KEY
name            VARCHAR(50) NOT NULL UNIQUE
description     VARCHAR(255) NULL
color           VARCHAR(7) NOT NULL
display_order   SMALLINT NOT NULL

-- Données initiales
INSERT INTO task_statuses VALUES 
(1, 'todo', 'À faire', '#FF6B6B', 1),
(2, 'in_progress', 'En cours', '#4ECDC4', 2),
(3, 'done', 'Terminé', '#45B7D1', 3);

5. Table priority_levels (Référence des priorités)

id              SMALLINT PRIMARY KEY  
name            VARCHAR(50) NOT NULL UNIQUE
weight          SMALLINT NOT NULL
color           VARCHAR(7) NOT NULL

-- Données initiales
INSERT INTO priority_levels VALUES
(1, 'low', 1, '#95E1D3'),
(2, 'medium', 2, '#FCE38A'), 
(3, 'high', 3, '#F38181');

6. Table task_lists (Colonnes/Listes)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE
name            VARCHAR(255) NOT NULL
position        DOUBLE PRECISION NOT NULL  -- Pour drag & drop
status_id       SMALLINT NULL REFERENCES task_statuses(id) -- Optionnel: lien automatique
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_task_lists_project (project_id)
INDEX idx_task_lists_position (position)

-- Données par défaut créées automatiquement pour chaque nouveau projet

7. Table tasks (Tâches)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
list_id         UUID NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE
project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE
title           VARCHAR(500) NOT NULL
description     TEXT NULL
status_id       SMALLINT NOT NULL REFERENCES task_statuses(id) DEFAULT 1
priority_id     SMALLINT NOT NULL REFERENCES priority_levels(id) DEFAULT 2
assignee_id     UUID NULL REFERENCES users(id)
due_date        DATE NULL
due_time        TIME NULL  -- Heure optionnelle
position        DOUBLE PRECISION NOT NULL
created_by      UUID NOT NULL REFERENCES users(id)
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
completed_at    TIMESTAMP NULL

-- Index
INDEX idx_tasks_project (project_id)
INDEX idx_tasks_list (list_id)
INDEX idx_tasks_assignee (assignee_id)
INDEX idx_tasks_status (status_id)
INDEX idx_tasks_priority (priority_id)
INDEX idx_tasks_due_date (due_date)
INDEX idx_tasks_position (position)
INDEX idx_tasks_created_by (created_by)

8. Table task_comments (Commentaires)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE
author_id       UUID NOT NULL REFERENCES users(id)
content         TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_task_comments_task (task_id)
INDEX idx_task_comments_author (author_id)
INDEX idx_task_comments_created (created_at)

9.  Table notifications (Notifications)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
type            VARCHAR(50) NOT NULL CHECK (type IN (
    'task_assigned', 'status_changed', 'new_comment', 
    'project_invite', 'due_date_reminder', 'mention'
))
title           VARCHAR(255) NOT NULL
message         TEXT NOT NULL
payload         JSONB NULL  -- Données supplémentaires
is_read         BOOLEAN DEFAULT false
related_entity  VARCHAR(50) NULL  -- 'task', 'project', 'comment'
related_entity_id UUID NULL  -- ID de l'entité concernée
created_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_notifications_user (user_id)
INDEX idx_notifications_read (is_read)
INDEX idx_notifications_created (created_at)
INDEX idx_notifications_type (type)

10. Table password_resets (Réinitialisation MDP)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
token           VARCHAR(255) NOT NULL
expires_at      TIMESTAMP NOT NULL
used_at         TIMESTAMP NULL
created_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_password_resets_token (token)
INDEX idx_password_resets_user (user_id)
INDEX idx_password_resets_expires (expires_at)

11. Table activity_logs (Journal d'activité)

id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
project_id      UUID NULL REFERENCES projects(id) ON DELETE SET NULL
user_id         UUID NULL REFERENCES users(id) ON DELETE SET NULL
action          VARCHAR(100) NOT NULL  -- 'task_created', 'project_updated'
description     TEXT NULL
meta            JSONB NULL  -- Données contextuelles
ip_address      INET NULL
user_agent      TEXT NULL
created_at      TIMESTAMP DEFAULT NOW()

-- Index
INDEX idx_activity_logs_project (project_id)
INDEX idx_activity_logs_user (user_id)
INDEX idx_activity_logs_action (action)
INDEX idx_activity_logs_created (created_at)



🚀 Scénarios d'Usage Optimisés

1. Dashboard Principal

-- Progression par projet
SELECT 
    p.id,
    p.name,
    p.color,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN ts.name = 'done' THEN 1 END) as completed_tasks,
    ROUND(COUNT(CASE WHEN ts.name = 'done' THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0), 2) as progress_percent
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
LEFT JOIN task_statuses ts ON t.status_id = ts.id
WHERE p.is_archived = false
GROUP BY p.id, p.name, p.color;

2. Tâches Assignées à un Utilisateur

-- Avec toutes les informations nécessaires
SELECT 
    t.*,
    p.name as project_name,
    p.color as project_color,
    tl.name as list_name,
    ts.name as status_name,
    ts.color as status_color,
    pl.name as priority_name,
    pl.color as priority_color
FROM tasks t
JOIN projects p ON t.project_id = p.id
JOIN task_lists tl ON t.list_id = tl.id
JOIN task_statuses ts ON t.status_id = ts.id
JOIN priority_levels pl ON t.priority_id = pl.id
WHERE t.assignee_id = $1
AND p.is_archived = false
ORDER BY t.due_date NULLS LAST, pl.weight DESC, t.position;

3. Notifications Non Lus

-- Avec pagination
SELECT 
    n.*,
    u.first_name,
    u.last_name,
    u.avatar_url
FROM notifications n
JOIN users u ON n.user_id = u.id
WHERE n.user_id = $1
AND n.is_read = false
ORDER BY n.created_at DESC
LIMIT 50;

4. Index pour Performance

-- Index composites pour les requêtes fréquentes
CREATE INDEX CONCURRENTLY idx_tasks_project_status ON tasks(project_id, status_id);
CREATE INDEX CONCURRENTLY idx_tasks_assignee_status ON tasks(assignee_id, status_id);
CREATE INDEX CONCURRENTLY idx_notifications_user_unread ON notifications(user_id, is_read, created_at);
CREATE INDEX CONCURRENTLY idx_project_members_user_project ON project_members(user_id, project_id);