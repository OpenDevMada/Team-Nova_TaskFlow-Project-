import { apiService } from './api';
import { PROJECT_MEMBER_ENDPOINTS } from '../utils/constants';

export const projectMemberService = {
    addMember: (memberData) => apiService.post(PROJECT_MEMBER_ENDPOINTS.MEMBERS, memberData),
    getMembers: () => apiService.get(PROJECT_MEMBER_ENDPOINTS.MEMBERS),
    getMember: (id) => apiService.get(PROJECT_MEMBER_ENDPOINTS.MEMBER_BY_ID(id)),
    removeMember: (id) => apiService.delete(PROJECT_MEMBER_ENDPOINTS.MEMBER_BY_ID(id)),
};