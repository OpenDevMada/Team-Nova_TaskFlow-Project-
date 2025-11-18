import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const projectMemberService = {
    addMember: (memberData) => apiService.post(API_ENDPOINTS.PROJECT_MEMBER.BASE, memberData),
    getMembers: () => apiService.get(API_ENDPOINTS.PROJECT_MEMBER.BASE),
    getMember: (id) => apiService.get(API_ENDPOINTS.PROJECT_MEMBER.MEMBER_BY_ID(id)),
    removeMember: (id) => apiService.delete(API_ENDPOINTS.PROJECT_MEMBER.MEMBER_BY_ID(id)),
};