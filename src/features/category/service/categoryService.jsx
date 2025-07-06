import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const CATEGORY_API_URL = `${API_BASE_URL}/categories`;

const axiosInstance = axios.create({
  baseURL: CATEGORY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      throw {
        status: errorData.status || 'error',
        statusCode: error.response.status,
        message: errorData.message || 'An error occurred',
        details: errorData.details || []
      };
    } else if (error.request) {
      // Network error
      throw {
        status: 'error',
        statusCode: 500,
        message: 'Network error. Please check your connection.'
      };
    } else {
      // Other error
      throw {
        status: 'error',
        statusCode: 500,
        message: error.message || 'An unexpected error occurred'
      };
    }
  }
);

export const categoryService = {
  /**
   * Create a new category with optional image
   * POST /categories
   */
  async createCategory(categoryData, imageFile = null) {
    try {
        const formData = new FormData();
        
        // Add category data to form, handling parent_id properly
        Object.keys(categoryData).forEach(key => {
            const value = categoryData[key];
            // Only append non-null, non-undefined, non-empty values
            if (value !== null && value !== undefined && value !== '') {
                formData.append(key, String(value));
            }
        });
        
        // Add image file if provided
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await axios.post(CATEGORY_API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
  },

  /**
   * Get all categories with hierarchical structure
   * GET /categories?includeInactive=true/false
   */
  async getAllCategories(includeInactive = false) {
    try {
      const params = {};
      if (includeInactive) {
        params.includeInactive = true;
      }
      
      const response = await axiosInstance.get('/', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get category info with nested parent/children relationships
   * GET /categories/:id/info
   */
  async getCategoryInfo(categoryId) {
    try {
      if (!categoryId) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Category ID is required'
        };
      }
      
      const response = await axiosInstance.get(`/${categoryId}/info`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get categories by level
   * GET /categories/level/:level
   */
  async getCategoriesByLevel(level) {
    try {
      if (level === undefined || level === null) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Level parameter is required'
        };
      }
      
      const response = await axiosInstance.get(`/level/${level}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Edit/Update a category
   * PUT /categories/:id
   */
  async editCategory(categoryId, categoryData) {
    try {
      if (!categoryId) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Category ID is required'
        };
      }
      
      // Clean up the data - remove empty strings and convert to appropriate types
      const cleanData = {};
      Object.keys(categoryData).forEach(key => {
        const value = categoryData[key];
        if (value !== undefined && value !== '') {
          // Handle parent_id specifically
          if (key === 'parent_id') {
            cleanData[key] = value || null;
          } else if (key === 'sort_order') {
            cleanData[key] = parseInt(value) || 0;
          } else {
            cleanData[key] = value;
          }
        }
      });
      
      const response = await axiosInstance.put(`/${categoryId}`, cleanData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change category image
   * PATCH /categories/:id/image
   */
  async changeCategoryImage(categoryId, imageFile) {
    try {
      if (!categoryId) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Category ID is required'
        };
      }
      
      if (!imageFile) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Image file is required'
        };
      }
      
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const response = await axios.patch(`${CATEGORY_API_URL}/${categoryId}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Remove category image
   * DELETE /categories/:id/image
   */
  async removeCategoryImage(categoryId) {
    try {
      if (!categoryId) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Category ID is required'
        };
      }
      
      const response = await axiosInstance.delete(`/${categoryId}/image`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete category (soft delete)
   * DELETE /categories/:id
   */
  async deleteCategory(categoryId) {
    try {
      if (!categoryId) {
        throw {
          status: 'error',
          statusCode: 400,
          message: 'Category ID is required'
        };
      }
      
      const response = await axiosInstance.delete(`/${categoryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Helper method to validate category data on client side
   */
  validateCategoryData(categoryData, isUpdate = false) {
    const errors = [];
    
    if (!categoryData || typeof categoryData !== 'object') {
      errors.push('Category data must be a valid object');
      return { isValid: false, errors };
    }

    // Name validation
    if (!isUpdate && (!categoryData.name || typeof categoryData.name !== 'string' || categoryData.name.trim().length === 0)) {
      errors.push('Category name is required and must be a non-empty string');
    }
    
    if (isUpdate && categoryData.name !== undefined && (typeof categoryData.name !== 'string' || categoryData.name.trim().length === 0)) {
      errors.push('Category name must be a non-empty string');
    }

    if (categoryData.name && categoryData.name.length > 255) {
      errors.push('Category name must not exceed 255 characters');
    }

    // Description validation
    if (categoryData.description !== undefined && categoryData.description !== null && typeof categoryData.description !== 'string') {
      errors.push('Category description must be a string');
    }

    if (categoryData.description && categoryData.description.length > 1000) {
      errors.push('Category description must not exceed 1000 characters');
    }

    // Meta title validation
    if (categoryData.meta_title !== undefined && categoryData.meta_title !== null && typeof categoryData.meta_title !== 'string') {
      errors.push('Meta title must be a string');
    }

    if (categoryData.meta_title && categoryData.meta_title.length > 255) {
      errors.push('Meta title must not exceed 255 characters');
    }

    // Sort order validation
    if (categoryData.sort_order !== undefined && categoryData.sort_order !== null) {
      const sortOrder = Number(categoryData.sort_order);
      if (isNaN(sortOrder) || !Number.isInteger(sortOrder) || sortOrder < 0) {
        errors.push('Sort order must be a non-negative integer');
      }
    }

    return { isValid: errors.length === 0, errors };
  },

  /**
   * Helper method to format error messages for display
   */
  formatErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.message) {
      let message = error.message;
      
      // Add details if available
      if (error.details && Array.isArray(error.details) && error.details.length > 0) {
        message += '\n\nDetails:\n• ' + error.details.join('\n• ');
      }
      
      return message;
    }
    
    // Handle network errors or other formats
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      let message = errorData.message || 'An error occurred';
      
      if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        message += '\n\nDetails:\n• ' + errorData.details.join('\n• ');
      }
      
      return message;
    }
    
    return 'An unexpected error occurred';
  }
};

