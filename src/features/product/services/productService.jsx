import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const PRODUCT_API_URL = `${API_BASE_URL}/products`;
const COMPANY_API_URL = `${API_BASE_URL}/companies`;
const TAX_API_URL = `${API_BASE_URL}/taxes`;
const CATEGORY_API_URL = `${API_BASE_URL}/categories`;

const axiosInstance = axios.create({
  baseURL: PRODUCT_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productService = {
  // Create a new product
  createProduct: async (formData) => {
    return axios.post(`${PRODUCT_API_URL}/create`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Get all products
  getAllProducts: async (params = {}) => {
    return axiosInstance.get("/list", { params });
  },

  // Get product by ID
  getProductById: async (id) => {
    return axiosInstance.get(`/${id}`);
  },

  // Update product by ID
  updateProduct: async (id, formData) => {
    return axios.put(`${PRODUCT_API_URL}/${id}/edit`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Duplicate product by ID
  async duplicateProduct(productId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/products/${productId}/duplicate`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Custom Options Management
  createCustomOption: async (productId, optionData) => {
    return axios.post(`${PRODUCT_API_URL}/${productId}/custom-options`, optionData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  getProductCustomOptions: async (productId) => {
    return axios.get(`${PRODUCT_API_URL}/${productId}/custom-options`, {
      withCredentials: true,
    });
  },

  updateCustomOption: async (optionId, optionData) => {
    return axios.put(`${PRODUCT_API_URL}/custom-options/${optionId}`, optionData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  deleteCustomOption: async (optionId) => {
    return axios.delete(`${PRODUCT_API_URL}/custom-options/${optionId}`, {
      withCredentials: true,
    });
  },

  publishProduct: async (productId) => {
    try {
      const response = await axios.post(`${PRODUCT_API_URL}/${productId}/publish`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  archiveProduct: async (productId) => {
    try {
      const response = await axios.post(`${PRODUCT_API_URL}/${productId}/archive`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  unarchiveProduct: async (productId) => {
    try {
      const response = await axios.post(`${PRODUCT_API_URL}/${productId}/unarchive`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  unpublishProduct: async (productId) => {
    try {
      const response = await axios.post(`${PRODUCT_API_URL}/${productId}/unpublish`, {}, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" }
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCustomOptionValueImage: async (optionId, valueId, file) => {
  const formData = new FormData();
  formData.append('image', file);
  return axios.put(
    `${PRODUCT_API_URL}/custom-options/${optionId}/values/${valueId}/image`,
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );
},

};

// Services for related entities
export const taxService = {
  getAllTaxes: async () => {
    return axios.get(`${TAX_API_URL}/get-taxes`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const companyService = {
  getAllCompanies: async () => {
    return axios.get(`${COMPANY_API_URL}/get-all-companies-for-select`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const categoryService = {
  getAllCategories: async () => {
    return axios.get(CATEGORY_API_URL, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
