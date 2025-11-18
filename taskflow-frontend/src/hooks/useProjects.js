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
            console.log("Données envoyées au service:", projectData);
            const response = await projectService.createProject(projectData);
            console.log("Projet créé:", response);

            // Extraire le projet des données de réponse
            const newProject = response.data?.data || response.data;
            console.log("Nouveau projet à ajouter:", newProject);

            // Vérifier que le projet a un ID avant de l'ajouter
            if (newProject && newProject.id) {
                setProjects(prev => [...prev, newProject]);
                return newProject;
            } else {
                throw new Error("Le projet créé n'a pas d'ID");
            }
        } catch (error) {
            console.error("Erreur détaillée:", error.response?.data || error);
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
            handleError(error, 'Erreur lors de la récupération du projet');
            return null;
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
            return true; // ← Retourner true pour indiquer le succès
        } catch (error) {
            handleError(error, 'Erreur lors de la suppression du projet');
            return false; // ← Retourner false en cas d'erreur
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