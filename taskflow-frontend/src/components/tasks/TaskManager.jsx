import { useEffect } from 'react';
import { useTasks } from '../hooks/useTasks';

const TaskManager = ({ projectId }) => {
    const {
        tasks,
        lists,
        loading,
        error,
        fetchProjectTasks,
        fetchProjectLists,
        createTask,
        updateTask,
        deleteTask,
        createList,
        moveTask,
        getTasksByList,
    } = useTasks(projectId);

    // Charger les données au montage
    useEffect(() => {
        if (projectId) {
            fetchProjectTasks();
            fetchProjectLists();
        }
    }, [projectId, fetchProjectTasks, fetchProjectLists]);

    const handleCreateTask = async () => {
        const newTask = {
            title: 'Nouvelle tâche',
            description: 'Description de la tâche',
            listId: lists[0]?.id, // Première liste
            projectId: projectId,
        };

        await createTask(newTask);
    };

    const handleMoveTask = async (taskId, targetListId) => {
        await moveTask(taskId, targetListId);
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div>
            <h2>Gestionnaire de tâches</h2>

            <button onClick={handleCreateTask}>
                Créer une tâche
            </button>

            <div className="lists-container">
                {lists.map(list => (
                    <div key={list.id} className="task-list">
                        <h3>{list.name}</h3>
                        {getTasksByList(list.id).map(task => (
                            <div key={task.id} className="task-item">
                                <h4>{task.title}</h4>
                                <p>{task.description}</p>
                                <button onClick={() => deleteTask(task.id)}>
                                    Supprimer
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskManager;