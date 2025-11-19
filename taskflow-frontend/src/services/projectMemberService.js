import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const projectMemberService = {

    // Récupérer tous les membres d'un projet
    getProjectMembers: async (projectId) => {
        const response = await apiService.get(API_ENDPOINTS.PROJECT_MEMBER.PROJECT_MEMBERS(projectId));
        return response.data;
    },

    // Ajouter un membre à un projet
    addMember: async (projectId, userId, role = 'member') => {
        const response = await apiService.post(API_ENDPOINTS.PROJECT_MEMBER.ADD_MEMBER(projectId), {
            userId,
            role
        });
        return response.data;
    },

    // Mettre à jour le rôle d'un membre
    updateMemberRole: async (memberId, role) => {
        const response = await apiService.patch(API_ENDPOINTS.PROJECT_MEMBER.UPDATE_ROLE(memberId), {
            role
        });
        return response.data;
    },

    // Retirer un membre d'un projet
    removeMember: async (memberId) => {
        const response = await apiService.delete(API_ENDPOINTS.PROJECT_MEMBER.REMOVE_MEMBER(memberId));
        return response.data;
    },
};