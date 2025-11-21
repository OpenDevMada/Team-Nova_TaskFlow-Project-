import { useState, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = (projectId = null) => {
    const [tasks, setTasks] = useState([]);
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (error, defaultMessage) => {
        console.error(defaultMessage, error);
        setError(error.message || defaultMessage);
        return null;
    };

    const resetError = () => setError(null);

    // === OPÉRATIONS SUR LES TÂCHES ===

    const fetchProjectTasks = useCallback(async (targetProjectId = projectId) => {
        if (!targetProjectId) return;

        setLoading(true);
        resetError();
        try {
            const response = await taskService.getProjectTasks(targetProjectId);
            let tasksData = [];

            if (Array.isArray(response)) {
                tasksData = response;
            } else if (response && Array.isArray(response.data)) {
                tasksData = response.data;
            } else if (response && response.success && Array.isArray(response.data)) {
                tasksData = response.data;
            }

            setTasks(tasksData);
            return tasksData;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération des tâches');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

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

    // === OPÉRATIONS SUR LES LISTES ===

    const fetchProjectLists = useCallback(async (targetProjectId = projectId) => {
        if (!targetProjectId) return;

        setLoading(true);
        resetError();
        try {
            const response = await taskService.getProjectLists(targetProjectId);
            let listsData = [];

            if (Array.isArray(response)) {
                listsData = response;
            } else if (response && Array.isArray(response.data)) {
                listsData = response.data;
            } else if (response && response.success && Array.isArray(response.data)) {
                listsData = response.data;
            }

            setLists(listsData);
            return listsData;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération des listes');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

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

    const deleteList = async (listId) => {
        setLoading(true);
        resetError();
        try {
            await taskService.deleteList(listId);
            setLists(prev => prev.filter(list => list.id !== listId));
            setTasks(prev => prev.filter(task => task.listId !== listId));
            return true;
        } catch (error) {
            return handleError(error, 'Erreur lors de la suppression de la liste');
        } finally {
            setLoading(false);
        }
    };

    // === OPÉRATIONS DE DÉPLACEMENT ===

    const moveTask = async (taskId, targetListId, newPosition = null) => {
        setLoading(true);
        resetError();
        try {
            const moveData = { targetListId };
            if (newPosition !== null) {
                moveData.position = newPosition; // ✅ CORRIGÉ: "position" pas "newPosition"
            }

            const movedTask = await taskService.moveTask(taskId, moveData);

            setTasks(prev => prev.map(task =>
                task.id === taskId ? { ...task, listId: targetListId, ...movedTask } : task
            ));

            return movedTask;
        } catch (error) {
            return handleError(error, 'Erreur lors du déplacement de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const reorderTasks = async (listId, taskOrders) => { // ✅ CORRIGÉ: "taskOrders" avec "s"
        setLoading(true);
        resetError();
        try {
            const reorderData = { taskOrders }; // ✅ CORRIGÉ: "taskOrders" avec "s"
            const result = await taskService.reorderTasks(listId, reorderData);

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

    const getTasksByList = (listId) => tasks.filter(task => task.listId === listId);
    const getListById = (listId) => lists.find(list => list.id === listId);

    const reset = () => {
        setTasks([]);
        setLists([]);
        setError(null);
        setLoading(false);
    };

    return {
        tasks, lists, loading, error,
        fetchProjectTasks, createTask, fetchTask, updateTask, deleteTask, completeTask,
        fetchProjectLists, createList, updateList, deleteList,
        moveTask, reorderTasks,
        getTasksByList, getListById, resetError, reset,
    };
};

// Hook pour une tâche unique
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
        } catch (err) {
            setError(err.message || 'Erreur lors de la récupération');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateTask = async (taskData) => {
        if (!taskId) return;
        setLoading(true);
        try {
            const updatedTask = await taskService.updateTask(taskId, taskData);
            setTask(updatedTask);
            return updatedTask;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const completeTask = async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            const completedTask = await taskService.completeTask(taskId);
            setTask(completedTask);
            return completedTask;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteTask = async () => {
        if (!taskId) return;
        setLoading(true);
        try {
            await taskService.deleteTask(taskId);
            setTask(null);
            return true;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { task, loading, error, fetchTask, updateTask, completeTask, deleteTask };
};