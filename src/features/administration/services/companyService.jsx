import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const COMPANY_API_URL = `${API_BASE_URL}/companies`;

const axiosInstance = axios.create({
  baseURL: COMPANY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const companyService = {
  getAllCompaniesForSelect: async () => {
    return axiosInstance.get("/get-all-companies-for-select");
  },
};