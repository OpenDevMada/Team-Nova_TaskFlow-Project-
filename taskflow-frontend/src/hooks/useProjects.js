import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (error, defaultMessage) => {
        console.error(defaultMessage, error);
        setError(error.message || defaultMessage);
        return null;
    };

    const resetError = () => setError(null);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        resetError();
        try {
            const response = await projectService.getProjects();
            console.log("Response:", response);
            console.log("Response data:", response.data);

            // S'assurer que data est un tableau
            const projectsArray = Array.isArray(response.data) ? response.data : [];
            console.log("Projects array:", projectsArray);

            setProjects(projectsArray);
            return projectsArray;
        } catch (error) {
            console.error("Fetch error:", error);
            setProjects([]);
            return handleError(error, 'Erreur lors de la récupération des projets');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (projectData) => {
        setLoading(true);
        resetError();
        try {
            const newProject = await projectService.createProject(projectData);
            setProjects(prev => [...prev, newProject]);
            return newProject;
        } catch (error) {
            return handleError(error, 'Erreur lors de la création du projet');
        } finally {
            setLoading(false);
        }
    };

    const getProject = async (id) => {
        setLoading(true);
        resetError();
        try {
            const project = await projectService.getProject(id);
            return project;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération du projet');
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (id, projectData) => {
        setLoading(true);
        resetError();
        try {
            const updatedProject = await projectService.updateProject(id, projectData);
            setProjects(prev => prev.map(project =>
                project.id === id ? updatedProject : project
            ));
            return updatedProject;
        } catch (error) {
            return handleError(error, 'Erreur lors de la mise à jour du projet');
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id) => {
        setLoading(true);
        resetError();
        try {
            await projectService.deleteProject(id);
            setProjects(prev => prev.filter(project => project.id !== id));
            return true;
        } catch (error) {
            return handleError(error, 'Erreur lors de la suppression du projet');
        } finally {
            setLoading(false);
        }
    };

    return {
        projects,
        loading,
        error,
        fetchProjects,
        createProject,
        getProject,
        updateProject,
        deleteProject,
        resetError,
    };
};