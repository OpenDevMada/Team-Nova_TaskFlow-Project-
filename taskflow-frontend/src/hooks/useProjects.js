import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';

export const useProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await projectService.getProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const createProject = async (projectData) => {
        try {
            const newProject = await projectService.createProject(projectData);
            setProjects(prev => [...prev, newProject]);
            return newProject;
        } catch (error) {
            console.error('Failed to create project:', error);
            throw error;
        }
    };

    return {
        projects,
        loading,
        fetchProjects,
        createProject,
    };
};