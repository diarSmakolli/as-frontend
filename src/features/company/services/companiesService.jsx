import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const COMPANY_API_URL = `${API_BASE_URL}/companies`;
const WAREHOUSE_API_URL = `${API_BASE_URL}/warehouses`;

const axiosInstance = axios.create({
  baseURL: COMPANY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const companiesService = {
  getAllCompanies: async () => {
    return axios.get(`${COMPANY_API_URL}/get-all-companies-for-select`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
  getCompaniesList: async (params) => {
    return axiosInstance.get("/companies-list", { params });
  },
  getCompanyInfo: async (companyId) => {
    return axiosInstance.get(`/info-company/${companyId}`);
  },
  createCompany: async (companyData) => {
    const formData = new FormData();
    Object.keys(companyData).forEach(key => {
      if (key === 'logo' && companyData[key]) {
        formData.append('logo', companyData[key]);
      } else if (companyData[key] !== undefined && companyData[key] !== null) {
        formData.append(key, companyData[key]);
      }
    });
    
    return axios.post(`${COMPANY_API_URL}/create`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateCompany: async (companyId, companyData) => {
    return axiosInstance.put(`/update/${companyId}`, companyData);
  },
  markCompanyActive: async (companyId) => {
    return axiosInstance.put(`/mark-active/${companyId}`);
  },
  markCompanyInactive: async (companyId) => {
    return axiosInstance.delete(`/mark-inactive/${companyId}`);
  },
  getAllUsersOfCompany: async (companyId) => {
    return axiosInstance.get(`/get-all-users/${companyId}`);
  },
  changeCompanyLogo: async(companyId, logoFile) => {
    const formData = new FormData();
    formData.append('logo', logoFile);

    return axiosInstance.put(`/${companyId}/change-logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  // assets
  getCompanyAssets: async (companyId, params = {}) => {
    return axiosInstance.get(`/${companyId}/assets`, { params });
  },
  createCompanyAsset: async (companyId, assetData, imageFiles = []) => {
    const formData = new FormData();
    
    Object.keys(assetData).forEach(key => {
      if (assetData[key] !== undefined && assetData[key] !== null) {
        formData.append(key, assetData[key]);
      }
    });
    
    if (imageFiles && imageFiles.length) {
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
    }
    
    return axios.post(`${COMPANY_API_URL}/${companyId}/assets`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updateCompanyAsset: async (companyId, assetId, assetData) => {
    return axiosInstance.put(`/${companyId}/assets/${assetId}`, assetData);
  },
  updateCompanyAssetStatus: async (companyId, assetId, status) => {
    return axiosInstance.put(`/${companyId}/assets/${assetId}/status`, { status });
  },
  deleteCompanyAsset: async (companyId, assetId) => {
    return axiosInstance.delete(`/${companyId}/assets/${assetId}`);
  },
  // documents
  getCompanyDocuments: async (companyId, params = {}) => {
    return axiosInstance.get(`/${companyId}/documents`, { params });
  },
  getCompanyDocumentDetails: async (companyId, documentId) => {
    return axiosInstance.get(`/${companyId}/documents/${documentId}`);
  },
  createCompanyDocument: async (companyId, documentData, documentFile, uploadConfig = {}) => {
    const formData = new FormData();
    
    formData.append('document_name', documentData.document_name);
    
    formData.append('is_confidential', documentData.is_confidential ? 'true' : 'false');
    
    if (documentData.tags && Array.isArray(JSON.parse(documentData.tags))) {
      const tags = JSON.parse(documentData.tags);
      tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
    }

    if (documentData.version !== undefined && documentData.version !== null && documentData.version !== '') {
      formData.append('version', documentData.version);
    }

    if (documentData.expiration_date) {
      formData.append('expiration_date', documentData.expiration_date);
    }
    
    if (documentFile) {
      formData.append('documentFile', documentFile);
    }
    
    return axios.post(`${COMPANY_API_URL}/${companyId}/documents`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...uploadConfig
    });
  },
  updateCompanyDocument: async (companyId, documentId, documentData, newDocumentFile = null, uploadConfig = {}) => {
    const formData = new FormData();
    
    formData.append('document_name', documentData.document_name);
    
    formData.append('is_confidential', documentData.is_confidential ? 'true' : 'false');
    
    if (documentData.tags && Array.isArray(JSON.parse(documentData.tags))) {
      const tags = JSON.parse(documentData.tags);
      tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
    }
    
    if (documentData.version !== undefined && documentData.version !== null && documentData.version !== '') {
      formData.append('version', documentData.version);
    }

    if (documentData.expiration_date) {
      formData.append('expiration_date', documentData.expiration_date);
    }
    
    if (newDocumentFile) {
      formData.append('documentFile', newDocumentFile);
    }
    
    return axios.put(`${COMPANY_API_URL}/${companyId}/documents/${documentId}`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...uploadConfig
    });
  },
  deleteCompanyDocument: async (companyId, documentId) => {
    return axiosInstance.delete(`/${companyId}/documents/${documentId}`);
  },
  // downloadCompanyDocument: async (companyId, documentId) => {
  //   return axios.get(`${API_BASE_URL}/companies/${companyId}/documents/${documentId}/download`, {
  //     responseType: 'blob',
  //     withCredentials: true
  //   });
  // },
  downloadCompanyDocument: async (companyId, documentId) => {
    return axios.get(`${API_BASE_URL}/companies/${companyId}/documents/${documentId}/download`, {
      responseType: 'blob',
      withCredentials: true,
      headers: {
        'Accept': 'application/octet-stream'
      }
    });
  },
  // warehouses API
  getCompanyWarehouses: async (companyId, params = {}) => {
    return axios.get(`${WAREHOUSE_API_URL}/get-warehouses/${companyId}`, { 
      params, 
      withCredentials: true 
    });
  },
  createWarehouseMain: async (companyId, warehouseData) => {
    return axios.post(`${WAREHOUSE_API_URL}/create-warehouse/${companyId}`, warehouseData, { 
      withCredentials: true 
    });
  },
  updateCompanyWarehouse: async (companyId, warehouseId, warehouseData) => {
    return axios.post(`${WAREHOUSE_API_URL}/company/${companyId}/update-warehouse/${warehouseId}`, warehouseData, { 
      withCredentials: true 
    });
  },
  duplicateCompanyWarehouse: async (warehouseId) => {
    return axios.post(`${WAREHOUSE_API_URL}/duplicate-warehouse/${warehouseId}`, {}, { 
      withCredentials: true 
    });
  },
  makeWarehouseInactive: async (warehouseId) => {
    return axios.post(`${WAREHOUSE_API_URL}/inactive-warehouse/${warehouseId}`, {}, { 
      withCredentials: true 
    });
  }
};