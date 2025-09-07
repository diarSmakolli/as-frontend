import axios from "axios";
import { API_BASE_URL } from "../../commons/api";

const CUSTOMER_API_URL = `${API_BASE_URL}/customers`;
const ORDERS_API_URL = `${API_BASE_URL}/orders`;

const axiosInstance = axios.create({
  baseURL: CUSTOMER_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const orderInstance = axios.create({
  baseURL: ORDERS_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const customerAccountService = {
  // Register a new customer account
  registerAccount: async (customerData) => {
    try {
      const response = await axiosInstance.post("/register", customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Login customer account
  loginAccount: async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/login", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Add a new address for the authenticated customer
  addAddress: async (addressData) => {
    try {
      const response = await axiosInstance.post("/address", addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Delete an address for the authenticated customer
  deleteAddress: async (addressIdentifier) => {
    try {
      const response = await axiosInstance.delete("/address", {
        data: { addressIdentifier },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Edit an address for the authenticated customer
  editAddress: async (addressIdentifier, updatedAddressData) => {
    try {
      const response = await axiosInstance.put("/address", {
        addressIdentifier,
        updatedAddressData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Change password for the authenticated customer
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axiosInstance.post("/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // upload profile picture for customer
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    try {
      const response = await axiosInstance.post("/profile-picture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Set email notifications (activate/deactivate) for the authenticated customer
  setEmailNotifications: async (enabled) => {
    try {
      const response = await axiosInstance.post("/email-notifications", { enabled });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Deactivate (delete) the authenticated customer account
  deleteAccount: async () => {
    try {
      const response = await axiosInstance.delete("/delete-account");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Update customer data (only allowed fields)
  updateCustomer: async (data) => {
    try {
      const response = await axiosInstance.put("/update", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Verify email/account using token
  verifyEmail: async (token) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customers/verify-email?token=${encodeURIComponent(token)}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Request forgot password (send reset link)
  requestForgotPassword: async (email) => {
    try {
      const response = await axiosInstance.post("/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axiosInstance.post("/reset-password", { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Add a product to wishlist
  addToWishlist: async (productId) => {
    try {
      const response = await axiosInstance.post("/wishlist", { productId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Get wishlist with pagination for the authenticated customer
  getWishlist: async (page = 1, limit = 10) => {
    try {
      const response = await axiosInstance.get("/wishlist", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Remove a product from wishlist for the authenticated customer
  removeFromWishlist: async (productId) => {
    try {
      const response = await axiosInstance.delete("/wishlist", {
        data: { productId },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Get orders for the authenticated customer with pagination and filters
  getOrdersByCustomer: async (options = {}) => {
    try {
      const { page = 1, limit = 20, status, fromDate, toDate } = options;
      
      const params = {
        page,
        limit,
      };

      // Add optional filters if provided
      if (status) {
        params.status = status;
      }
      if (fromDate) {
        params.fromDate = fromDate;
      }
      if (toDate) {
        params.toDate = toDate;
      }

      const response = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
        params,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // add: request order cancellation/refund
  requestOrderCancellation: async ({ order_id, type = "cancellation", reason = "" }) => {
    try {
      const payload = { order_id, type, reason };
      const response = await orderInstance.post("/request-cancellation", payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Complete payment for an existing order (get Stripe payment link)
  completePayment: async ({ order_id }) => {
    try {
      const response = await orderInstance.post("/complete-payment", { order_id });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};