import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const TAX_API_URL = `${API_BASE_URL}/taxes`;

const axiosInstance = axios.create({
  baseURL: TAX_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const taxService = {
  // Get all taxes with pagination and filters
  async getAllTaxes(params = {}) {
    const response = await axiosInstance.get('/get-taxes', { params });
    return response.data;
  },

  // Create a new tax
  async createTax(taxData) {
    const response = await axiosInstance.post('/create-tax', taxData);
    return response.data;
  },

  // Edit an existing tax
  async editTax(taxId, taxData) {
    const response = await axiosInstance.put(`/edit-tax/${taxId}`, taxData);
    return response.data;
  },

  // Delete a tax (soft delete)
  async deleteTax(taxId) {
    const response = await axiosInstance.delete(`/delete-tax/${taxId}`);
    return response.data;
  },
};

