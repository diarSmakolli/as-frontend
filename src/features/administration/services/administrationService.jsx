import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const ADMINISTRATION_API_URL = `${API_BASE_URL}/administrations`;

const axiosInstance = axios.create({
  baseURL: ADMINISTRATION_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const administrationService = {
  changePassword: async (passwordData) => {
    return axiosInstance.put("/change-password", passwordData);
  },
  updatePreferredName: async (newPreferredName) => {
    return axiosInstance.put("/update-preferred-name", { newPreferredName });
  },
  getActiveSessions: async () => {
    return axiosInstance.get("/self-active-sessions");
  },
  terminateSession: async (sessionId) => {
    return axiosInstance.delete(`/terminate-session/${sessionId}`);
  },
  getAllUsers: async (params = {}) => {
    return axiosInstance.get("/all-accounts", { params });
  },
  updateUserDetails: async (accountId, userData) => {
    return axiosInstance.put(`/update-account-details/${accountId}`, userData);
  },
  lockAccount: async (accountId) => {
    return axiosInstance.post(`/lock-account/${accountId}`);
  },
  unlockAccount: async (accountId) => {
    return axiosInstance.post(`/unlock-account/${accountId}`);
  },
  verifyAccount: async (accountId) => {
    return axiosInstance.post(`/verify-account/${accountId}`);
  },
  resetPassword: async (accountId, passwordData) => {
    return axiosInstance.put(`/reset-password/${accountId}`, passwordData);
  },
  unverifyAccount: async (accountId) => {
    return axiosInstance.post(`/unverify-account/${accountId}`);
  },
  createAccount: async (accountData) => {
    return axiosInstance.post(`/create-account`, accountData);
  },
  markAsSuspicious: async (accountId) => {
    return axiosInstance.post(`/mark-suspicious/${accountId}`);
  },
  clearSuspiciousMark: async (accountId) => {
    return axiosInstance.post(`/clear-suspicious/${accountId}`);
  },
  deactivateAccount: async (accountId) => {
    return axiosInstance.post(`/deactivate-account/${accountId}`);
  },
  activateAccount: async (accountId) => {
    return axiosInstance.post(`/activate-account/${accountId}`);
  },
  getUserDetails: async (accountId) => {
    return axiosInstance.get(`/user-details/${accountId}`);
  },
  getUserSessions: async (accountId, params) => {
    return axiosInstance.get(`/user-sessions/${accountId}`, { params });
  },
  getUserActivities: async (accountId, params) => {
    return axiosInstance.get(`/user-activities/${accountId}`, { params });
  },
  assignCompanyToUser: async (accountId, companyId) => {
    if (!companyId) {
        return axiosInstance.put(`/update-account-details/${accountId}`, { company_id: null });
    }
    return axiosInstance.put(`/user-details/${accountId}/assign-company/${companyId}`);
  },
  editPercentageCommission: async (accountId, percentage) => {
    return axiosInstance.put(`/user-details/${accountId}/update-commission`, { percentage });
  },
  processRewardPaymentsForAllAgents: async () => {
    return axiosInstance.post("/process-reward-payments");
  },
};
