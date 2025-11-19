import { useState } from 'react';
import { projectMemberService } from '../services/projectMemberService';
import { userService } from '../services/userService';

export const useProjectMembers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleError = (error, defaultMessage) => {
        console.error(defaultMessage, error);
        setError(error.message || defaultMessage);
        return null;
    };

    const resetError = () => setError(null);

    const getProjectMembers = async (projectId) => {
        setLoading(true);
        resetError();
        try {
            const response = await projectMemberService.getProjectMembers(projectId);
            return response.data;
        } catch (error) {
            return handleError(error, 'Erreur lors de la récupération des membres');
        } finally {
            setLoading(false);
        }
    };

    const addMember = async (projectId, userId, role) => {
        setLoading(true);
        resetError();
        try {
            const newMember = await projectMemberService.addMember(projectId, userId, role);
            return newMember;
        } catch (error) {
            return handleError(error, 'Erreur lors de l\'ajout du membre');
        } finally {
            setLoading(false);
        }
    };

    const updateMemberRole = async (memberId, role) => {
        setLoading(true);
        resetError();
        try {
            const updatedMember = await projectMemberService.updateMemberRole(memberId, role);
            return updatedMember;
        } catch (error) {
            return handleError(error, 'Erreur lors de la mise à jour du rôle');
        } finally {
            setLoading(false);
        }
    };

    const removeMember = async (memberId) => {
        setLoading(true);
        resetError();
        try {
            await projectMemberService.removeMember(memberId);
            return true;
        } catch (error) {
            return handleError(error, 'Erreur lors du retrait du membre');
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async (query = '') => {
        setLoading(true);
        resetError();
        try {
            const response = await userService.searchUsers(query);
            return response.data || [];
        } catch (error) {
            return handleError(error, 'Erreur lors de la recherche d\'utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    const getAllUsers = async () => {
        setLoading(true);
        resetError();
        try {
            const response = await userService.getAllUsers();
            return response.data || [];
        } catch (error) {
            return handleError(error, 'Erreur lors du chargement des utilisateurs');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getProjectMembers,
        addMember,
        updateMemberRole,
        removeMember,
        searchUsers,
        getAllUsers,
        resetError
    };
};