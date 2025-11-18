import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = (projectId = null) => {
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Gestion des erreurs
    const handleError = (error, defaultMessage) => {
        console.error(defaultMessage, error);
        setError(error.message || defaultMessage);
        return null;
    };

    // Réinitialiser les erreurs
    const resetError = () => setError(null);

    // === OPÉRATIONS SUR LES TÂCHES ===

    // Récupérer toutes les tâches d'un projet
    const fetchProjectTasks = useCallback(async (targetProjectId = projectId) => {
        if (!targetProjectId) return;

        setLoading(true);
        resetError();
        try {
            const tasksData = await taskService.getProjectTasks(targetProjectId);
            setTasks(tasksData);
            return tasksData;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération des tâches');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    // Créer une nouvelle tâche
    const createTask = async (taskData) => {
        setLoading(true);
        resetError();
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (error) {
            return handleError(error, 'Erreur lors de la création de la tâche');
        } finally {
            setLoading(false);
        }
    };

    // Récupérer une tâche spécifique
    const fetchTask = async (taskId) => {
        setLoading(true);
        resetError();
        try {
            const task = await taskService.getTask(taskId);
            return task;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération de la tâche');
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour une tâche
    const updateTask = async (taskId, taskData) => {
        setLoading(true);
        resetError();
        try {
            const updatedTask = await taskService.updateTask(taskId, taskData);
            setTasks(prev => prev.map(task =>
                task.id === taskId ? updatedTask : task
            ));
            return updatedTask;
        } catch (error) {
            return handleError(error, 'Erreur lors de la mise à jour de la tâche');
        } finally {
            setLoading(false);
        }
    };

    // Supprimer une tâche
    const deleteTask = async (taskId) => {
        setLoading(true);
        resetError();
        try {
            await taskService.deleteTask(taskId);
            setTasks(prev => prev.filter(task => task.id !== taskId));
            return true;
        } catch (error) {
            return handleError(error, 'Erreur lors de la suppression de la tâche');
        } finally {
            setLoading(false);
        }
    };

    // Marquer une tâche comme complétée
    const completeTask = async (taskId) => {
        setLoading(true);
        resetError();
        try {
            const completedTask = await taskService.completeTask(taskId);
            setTasks(prev => prev.map(task =>
                task.id === taskId ? completedTask : task
            ));
            return completedTask;
        } catch (error) {
            return handleError(error, 'Erreur lors de la complétion de la tâche');
        } finally {
            setLoading(false);
        }
    };

    // === OPÉRATIONS SUR LES LISTES DE TÂCHES ===

    // Récupérer les listes d'un projet
    const fetchProjectLists = useCallback(async (targetProjectId = projectId) => {
        if (!targetProjectId) return;

        setLoading(true);
        resetError();
        try {
            const listsData = await taskService.getProjectLists(targetProjectId);
            setLists(listsData);
            return listsData;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération des listes');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    // Créer une nouvelle liste
    const createList = async (listData, targetProjectId = projectId) => {
        if (!targetProjectId) {
            setError('ID de projet manquant');
            return null;
        }

        setLoading(true);
        resetError();
        try {
            const newList = await taskService.createList(targetProjectId, listData);
            setLists(prev => [...prev, newList]);
            return newList;
        } catch (error) {
            return handleError(error, 'Erreur lors de la création de la liste');
        } finally {
            setLoading(false);
        }
    };

    // Mettre à jour une liste
    const updateList = async (listId, listData) => {
        setLoading(true);
        resetError();
        try {
            const updatedList = await taskService.updateList(listId, listData);
            setLists(prev => prev.map(list =>
                list.id === listId ? updatedList : list
            ));
            return updatedList;
        } catch (error) {
            return handleError(error, 'Erreur lors de la mise à jour de la liste');
        } finally {
            setLoading(false);
        }
    };

    // Supprimer une liste
    const deleteList = async (listId) => {
        setLoading(true);
        resetError();
        try {
            await taskService.deleteList(listId);
            setLists(prev => prev.filter(list => list.id !== listId));
            // Supprimer également les tâches de cette liste
            setTasks(prev => prev.filter(task => task.listId !== listId));
            return true;
        } catch (error) {
            return handleError(error, 'Erreur lors de la suppression de la liste');
        } finally {
            setLoading(false);
        }
    };

    // === OPÉRATIONS DE DÉPLACEMENT ET RÉORGANISATION ===

    // Déplacer une tâche entre les listes
    const moveTask = async (taskId, targetListId, newPosition = null) => {
        setLoading(true);
        resetError();
        try {
            const moveData = { targetListId };
            if (newPosition !== null) {
                moveData.newPosition = newPosition;
            }

            const movedTask = await taskService.moveTask(taskId, moveData);

            // Mettre à jour l'état local
            setTasks(prev => prev.map(task =>
                task.id === taskId ? movedTask : task
            ));

            return movedTask;
        } catch (error) {
            return handleError(error, 'Erreur lors du déplacement de la tâche');
        } finally {
            setLoading(false);
        }
    };

    // Réorganiser les tâches dans une liste
    const reorderTasks = async (listId, taskOrder) => {
        setLoading(true);
        resetError();
        try {
            const reorderData = { taskOrder };
            const result = await taskService.reorderTasks(listId, reorderData);

            // Mettre à jour l'ordre local si nécessaire
            if (result.tasks) {
                setTasks(prev => {
                    const otherTasks = prev.filter(task => task.listId !== listId);
                    return [...otherTasks, ...result.tasks];
                });
            }

            return result;
        } catch (error) {
            return handleError(error, 'Erreur lors de la réorganisation des tâches');
        } finally {
            setLoading(false);
        }
    };

    // === MÉTHODES UTILITAIRES ===

    // Récupérer les tâches d'une liste spécifique
    const getTasksByList = (listId) => {
        return tasks.filter(task => task.listId === listId);
    };

    // Récupérer une liste par son ID
    const getListById = (listId) => {
        return lists.find(list => list.id === listId);
    };

    // Réinitialiser l'état
    const reset = () => {
        setTasks([]);
        setLists([]);
        setError(null);
        setLoading(false);
    };

    return {
        // État
        tasks,
        lists,
        loading,
        error,

        // Méthodes des tâches
        fetchProjectTasks,
        createTask,
        fetchTask,
        updateTask,
        deleteTask,
        completeTask,

        // Méthodes des listes
        fetchProjectLists,
        createList,
        updateList,
        deleteList,

        // Méthodes de déplacement
        moveTask,
        reorderTasks,

        // Méthodes utilitaires
        getTasksByList,
        getListById,
        resetError,
        reset,
    };
};

// Hook spécialisé pour une tâche unique
export const useTask = (taskId) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTask = async () => {
        if (!taskId) return;

        setLoading(true);
        setError(null);
        try {
            const taskData = await taskService.getTask(taskId);
            setTask(taskData);
            return taskData;
        } catch (error) {
            const errorMsg = 'Erreur lors de la récupération de la tâche';
            console.error(errorMsg, error);
            setError(error.message || errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (taskData) => {
        if (!taskId) return;

        setLoading(true);
        setError(null);
        try {
            const updatedTask = await taskService.updateTask(taskId, taskData);
            setTask(updatedTask);
            return updatedTask;
        } catch (error) {
            const errorMsg = 'Erreur lors de la mise à jour de la tâche';
            console.error(errorMsg, error);
            setError(error.message || errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const completeTask = async () => {
        if (!taskId) return;

        setLoading(true);
        setError(null);
        try {
            const completedTask = await taskService.completeTask(taskId);
            setTask(completedTask);
            return completedTask;
        } catch (error) {
            const errorMsg = 'Erreur lors de la complétion de la tâche';
            console.error(errorMsg, error);
            setError(error.message || errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async () => {
        if (!taskId) return;

        setLoading(true);
        setError(null);
        try {
            await taskService.deleteTask(taskId);
            setTask(null);
            return true;
        } catch (error) {
            const errorMsg = 'Erreur lors de la suppression de la tâche';
            console.error(errorMsg, error);
            setError(error.message || errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        task,
        loading,
        error,
        fetchTask,
        updateTask,
        completeTask,
        deleteTask,
    };
};