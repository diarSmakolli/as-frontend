import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const NOTIFICATIONS_API_URL = `${API_BASE_URL}/administrations/notifications`;

const axiosInstance = axios.create({
  baseURL: NOTIFICATIONS_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const notificationService = {
  getAllNotifications: async (page = 1, limit = 10) => {
    return axiosInstance.get(
      `/self/get-all-notifications?page=${page}&limit=${limit}`
    );
  },
  getUnreadCount: async () => {
    return axiosInstance.get("/self/unread-count");
  },
  markAsRead: async (notificationId) => {
    return axiosInstance.put(`/self/read-notification/${notificationId}`);
  },
  markAllAsRead: async () => {
    return axiosInstance.put("/self/read-all-notifications");
  },
  deleteNotification: async (notificationId) => {
    return axiosInstance.delete(`/self/delete-notification/${notificationId}`);
  },
};
