import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const CATEGORY_API_URL = `${API_BASE_URL}/categories`;
const PRODUCT_API_URL = `${API_BASE_URL}/products`;

const axiosInstance = axios.create({
  baseURL: CATEGORY_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const productAxiosInstance = axios.create({
  baseURL: PRODUCT_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const homeService = {
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Keep this for compatibility but we'll use getAllCategories instead
  getParentCategories: async () => {
    try {
      const response = await axiosInstance.get("/");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getSubCategories: async (parentId) => {
    try {
      const response = await axiosInstance.get(`?parent_id=${parentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // New method to get new arrivals
  getNewArrivals: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.limit) queryParams.append("limit", params.limit);
      if (params.category_id)
        queryParams.append("category_id", params.category_id);
      if (params.company_id)
        queryParams.append("company_id", params.company_id);

      const response = await productAxiosInstance.get(
        `/new-arrivals?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get top flash deals - top 12 products with highest discount percentage
  getFlashDeals: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Set default limit to 12 for flash deals
      const limit = params.limit || 12;
      const min_discount = params.min_discount || 10; // Minimum 10% discount

      // Add supported parameters
      queryParams.append("limit", limit);
      queryParams.append("min_discount", min_discount);

      if (params.include_expired !== undefined) {
        queryParams.append("include_expired", params.include_expired);
      }
      if (params.category_id) {
        queryParams.append("category_id", params.category_id);
      }

      const response = await productAxiosInstance.get(
        `/flash-deals?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getFurnitureFlashDeals: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Set default limit to 12 for flash deals
      const limit = params.limit || 12;
      const min_discount = params.min_discount || 10; // Minimum 10% discount

      // Add supported parameters
      queryParams.append("limit", limit);
      queryParams.append("min_discount", min_discount);

      if (params.include_expired !== undefined) {
        queryParams.append("include_expired", params.include_expired);
      }
      if (params.category_id) {
        queryParams.append("category_id", params.category_id);
      }

      const response = await productAxiosInstance.get(
        `/flash-deals?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getExploreAllProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Default parameters for explore all - 30 items per page as requested
      const limit = params.limit || 30;
      const offset = params.offset || 0;

      // Add supported parameters
      queryParams.append("limit", limit);
      queryParams.append("offset", offset);

      if (params.search) {
        queryParams.append("search", params.search);
      }
      if (params.category_id) {
        queryParams.append("category_id", params.category_id);
      }
      if (params.company_id) {
        queryParams.append("company_id", params.company_id);
      }
      if (params.min_price) {
        queryParams.append("min_price", params.min_price);
      }
      if (params.max_price) {
        queryParams.append("max_price", params.max_price);
      }
      if (params.sort_by) {
        queryParams.append("sort_by", params.sort_by);
      }
      if (params.sort_order) {
        queryParams.append("sort_order", params.sort_order);
      }
      if (params.is_on_sale !== undefined && params.is_on_sale !== "") {
        queryParams.append("is_on_sale", params.is_on_sale);
      }
      if (params.free_shipping !== undefined && params.free_shipping !== "") {
        queryParams.append("free_shipping", params.free_shipping);
      }
      if (params.is_featured !== undefined && params.is_featured !== "") {
        queryParams.append("is_featured", params.is_featured);
      }
      if (params.is_new !== undefined && params.is_new !== "") {
        queryParams.append("is_new", params.is_new);
      }

      const response = await productAxiosInstance.get(
        `/explore-all?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductBySlug: async (slug) => {
    return productAxiosInstance.get(`/details/${slug}`);
  },

  getRecommendedProducts: async (slug, params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Set default limit to 8 for recommendations
      const limit = params.limit || 8;
      const exclude_out_of_stock = params.exclude_out_of_stock !== false; // Default to true

      // Add supported parameters
      queryParams.append("limit", limit);
      queryParams.append("exclude_out_of_stock", exclude_out_of_stock);


      const response = await productAxiosInstance.get(
        `/details/${slug}/recommendations?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchProducts: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Default parameters for search
      const limit = params.limit || 25;
      const offset = params.offset || 0;
      const query = params.query || params.q || "";

      // Add basic parameters
      queryParams.append("limit", limit);
      queryParams.append("offset", offset);

      if (query) {
        queryParams.append("q", query);
      }

      // Add sorting parameters
      if (params.sort_by) {
        queryParams.append("sort_by", params.sort_by);
      }
      if (params.sort_order) {
        queryParams.append("sort_order", params.sort_order);
      }

      // Add price filters (now enhanced with range support)
      if (params.min_price !== undefined && params.min_price !== "") {
        queryParams.append("min_price", params.min_price);
      }
      if (params.max_price !== undefined && params.max_price !== "") {
        queryParams.append("max_price", params.max_price);
      }

      // Add availability filter
      if (params.include_out_of_stock !== undefined) {
        queryParams.append("include_out_of_stock", params.include_out_of_stock);
      }

      // ENHANCED: Add all supported filters as JSON string
      if (params.filters && Object.keys(params.filters).length > 0) {
        // Filter out empty arrays and objects
        const cleanFilters = {};

        // Price range filters (new)
        if (params.filters.price_range) {
          cleanFilters.price_range = params.filters.price_range;
        }

        // Availability filters (new)
        if (
          params.filters.availability &&
          params.filters.availability.length > 0
        ) {
          cleanFilters.availability = params.filters.availability;
        }

        // Custom details filters (enhanced)
        if (params.filters.materials && params.filters.materials.length > 0) {
          cleanFilters.materials = params.filters.materials;
        }
        if (params.filters.colors && params.filters.colors.length > 0) {
          cleanFilters.colors = params.filters.colors;
        }
        if (params.filters.sizes && params.filters.sizes.length > 0) {
          cleanFilters.sizes = params.filters.sizes;
        }
        if (params.filters.features && params.filters.features.length > 0) {
          cleanFilters.features = params.filters.features;
        }

        // General custom attributes (enhanced)
        if (
          params.filters.custom_attributes &&
          Object.keys(params.filters.custom_attributes).length > 0
        ) {
          cleanFilters.custom_attributes = params.filters.custom_attributes;
        }

        // Only add filters parameter if we have actual filters
        if (Object.keys(cleanFilters).length > 0) {
          queryParams.append("filters", JSON.stringify(cleanFilters));
        }
      }

      const response = await productAxiosInstance.get(
        `/search?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  extractPriceRanges: (facets) => {
    if (!facets || !facets.price_range || !facets.price_range.ranges) {
      return [];
    }
    return facets.price_range.ranges.map((range) => ({
      label: range.label,
      min: range.min,
      max: range.max,
      count: range.count,
      value: `${range.min}-${range.max}`,
    }));
  },

  extractAvailabilityOptions: (facets) => {
    if (!facets || !facets.availability || !facets.availability.options) {
      return [];
    }
    return facets.availability.options.map((option) => ({
      label: option.label,
      value: option.value,
      count: option.count,
    }));
  },

  extractMaterials: (facets) => {
    if (!facets || !facets.materials || !facets.materials.values) {
      return [];
    }
    return facets.materials.values.map((material) => ({
      label: material.value,
      value: material.value,
      count: material.count,
    }));
  },

  extractColors: (facets) => {
    if (!facets || !facets.colors || !facets.colors.values) {
      return [];
    }
    return facets.colors.values.map((color) => ({
      label: color.value,
      value: color.value,
      count: color.count,
    }));
  },

  extractSizes: (facets) => {
    if (!facets || !facets.sizes || !facets.sizes.values) {
      return [];
    }
    return facets.sizes.values.map((size) => ({
      label: size.value,
      value: size.value,
      count: size.count,
    }));
  },

  extractFeatures: (facets) => {
    if (!facets || !facets.features || !facets.features.values) {
      return [];
    }
    return facets.features.values.map((feature) => ({
      label: feature.value,
      value: feature.value,
      count: feature.count,
    }));
  },

  extractCustomAttributes: (facets) => {
    if (!facets || !facets.attributes) {
      return {};
    }

    const customAttributes = {};
    Object.entries(facets.attributes).forEach(
      ([attributeName, attributeData]) => {
        customAttributes[attributeName] = {
          label: attributeData.label || attributeName, // Use backend-generated user-friendly label
          values: attributeData.values.map((value) => ({
            label: value.value,
            value: value.value,
            count: value.count,
          })),
        };
      }
    );

    return customAttributes;
  },

  buildFilterSummary: (appliedFilters) => {
    const summary = {
      total_filters: 0,
      price_range_active: false,
      availability_active: false,
      materials_count: 0,
      colors_count: 0,
      sizes_count: 0,
      features_count: 0,
      custom_attributes_count: 0,
    };

    if (appliedFilters) {
      if (appliedFilters.price_range) {
        summary.price_range_active = true;
        summary.total_filters++;
      }

      if (
        appliedFilters.availability &&
        appliedFilters.availability.length > 0
      ) {
        summary.availability_active = true;
        summary.total_filters++;
      }

      if (appliedFilters.materials && appliedFilters.materials.length > 0) {
        summary.materials_count = appliedFilters.materials.length;
        summary.total_filters += appliedFilters.materials.length;
      }

      if (appliedFilters.colors && appliedFilters.colors.length > 0) {
        summary.colors_count = appliedFilters.colors.length;
        summary.total_filters += appliedFilters.colors.length;
      }

      if (appliedFilters.sizes && appliedFilters.sizes.length > 0) {
        summary.sizes_count = appliedFilters.sizes.length;
        summary.total_filters += appliedFilters.sizes.length;
      }

      if (appliedFilters.features && appliedFilters.features.length > 0) {
        summary.features_count = appliedFilters.features.length;
        summary.total_filters += appliedFilters.features.length;
      }

      if (appliedFilters.custom_attributes) {
        const customCount = Object.values(
          appliedFilters.custom_attributes
        ).flat().length;
        summary.custom_attributes_count = customCount;
        summary.total_filters += customCount;
      }
    }

    return summary;
  },

  formatProductData: (product) => {
    return {
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      title: product.title,
      description: product.description,
      short_description: product.short_description,
      main_image_url: product.main_image_url,
      images: product.images || [],

      // Enhanced pricing with savings
      pricing: {
        regular_price_nett:
          product.pricing?.regular_price_nett || product.regular_price_nett,
        regular_price_gross:
          product.pricing?.regular_price_gross || product.regular_price_gross,
        final_price_nett:
          product.pricing?.final_price_nett || product.final_price_nett,
        final_price_gross:
          product.pricing?.final_price_gross || product.final_price_gross,
        is_discounted: product.pricing?.is_discounted || product.is_discounted,
        discount_percentage:
          product.pricing?.discount_percentage ||
          product.discount_percentage_nett,
        savings: product.pricing?.savings || null,
        currency: "EUR",
      },

      // Enhanced badges
      badges: {
        is_new: product.badges?.is_new || product.mark_as_new,
        is_featured: product.badges?.is_featured || product.mark_as_featured,
        is_top_seller:
          product.badges?.is_top_seller || product.mark_as_top_seller,
        is_on_sale: product.badges?.is_on_sale || product.is_on_sale,
        free_shipping: product.badges?.free_shipping || product.shipping_free,
      },

      // Enhanced availability
      availability: {
        is_available:
          product.availability?.is_available || product.is_available_on_stock,
        status:
          product.availability?.status ||
          (product.is_available_on_stock ? "In Stock" : "Out of Stock"),
      },

      // Physical information
      physical_info: product.physical_info || {
        weight: product.weight,
        weight_unit: product.weight_unit,
        dimensions: product.dimensions || {},
      },

      // Product type
      product_type: product.product_type || {
        is_digital: product.is_digital,
        is_physical: product.is_physical,
        unit_type: product.unit_type,
      },

      // Enhanced custom details
      custom_details: product.custom_details || [],

      // Tax and company info
      tax_info: product.tax_info || null,
      company: product.company || null,

      timestamps: {
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
    };
  },

  getCategoryBySlug: async (slug) => {
    try {
      const response = await axiosInstance.get(`/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Default parameters
      const limit = params.limit || 25;
      const offset = params.offset || 0;

      // Add basic parameters
      queryParams.append("limit", limit);
      queryParams.append("offset", offset);

      // Add sorting parameters
      if (params.sort_by) {
        queryParams.append("sort_by", params.sort_by);
      }
      if (params.sort_order) {
        queryParams.append("sort_order", params.sort_order);
      }

      // Add price filters
      if (params.min_price !== undefined && params.min_price !== "") {
        queryParams.append("min_price", params.min_price);
      }
      if (params.max_price !== undefined && params.max_price !== "") {
        queryParams.append("max_price", params.max_price);
      }

      // Add availability filter
      if (params.include_out_of_stock !== undefined) {
        queryParams.append("include_out_of_stock", params.include_out_of_stock);
      }

      // Add all supported filters as JSON string
      if (params.filters && Object.keys(params.filters).length > 0) {
        // Filter out empty arrays and objects
        const cleanFilters = {};

        // Price range filters
        if (params.filters.price_range) {
          cleanFilters.price_range = params.filters.price_range;
        }

        // Availability filters
        if (
          params.filters.availability &&
          params.filters.availability.length > 0
        ) {
          cleanFilters.availability = params.filters.availability;
        }

        // Custom details filters
        if (params.filters.materials && params.filters.materials.length > 0) {
          cleanFilters.materials = params.filters.materials;
        }
        if (params.filters.colors && params.filters.colors.length > 0) {
          cleanFilters.colors = params.filters.colors;
        }
        if (params.filters.sizes && params.filters.sizes.length > 0) {
          cleanFilters.sizes = params.filters.sizes;
        }
        if (params.filters.features && params.filters.features.length > 0) {
          cleanFilters.features = params.filters.features;
        }

        // General custom attributes
        if (
          params.filters.custom_attributes &&
          Object.keys(params.filters.custom_attributes).length > 0
        ) {
          cleanFilters.custom_attributes = params.filters.custom_attributes;
        }

        // Only add filters parameter if we have actual filters
        if (Object.keys(cleanFilters).length > 0) {
          queryParams.append("filters", JSON.stringify(cleanFilters));
        }
      }

      const response = await productAxiosInstance.get(
        `/category/${categoryId}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // IMPLEMENT HERE THE FLASH DEALS /flash-deals/advanced
  // NEW: Advanced Flash Deals - Enhanced version with full filtering capabilities
  getAdvancedFlashDeals: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Pagination parameters
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.offset) queryParams.append('offset', params.offset);
      
      // Sorting parameters
      if (params.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params.sort_order) queryParams.append('sort_order', params.sort_order);
      
      // Price filters
      if (params.min_price !== undefined && params.min_price !== '') {
        queryParams.append('min_price', params.min_price);
      }
      if (params.max_price !== undefined && params.max_price !== '') {
        queryParams.append('max_price', params.max_price);
      }
      
      // Discount filters
      if (params.min_discount !== undefined) {
        queryParams.append('min_discount', params.min_discount);
      }
      if (params.max_discount !== undefined && params.max_discount !== '') {
        queryParams.append('max_discount', params.max_discount);
      }
      
      // Availability filter
      if (params.include_out_of_stock !== undefined) {
        queryParams.append('include_out_of_stock', params.include_out_of_stock);
      }
      
      // Category filter
      if (params.category_id) {
        queryParams.append('category_id', params.category_id);
      }
      
      // Advanced filters (JSON string)
      if (params.filters && Object.keys(params.filters).length > 0) {
        // Clean and format filters
        const cleanFilters = {};
        
        // Handle different filter types
        if (params.filters.specifications && Object.keys(params.filters.specifications).length > 0) {
          cleanFilters.specifications = params.filters.specifications;
        }
        
        if (params.filters.materials && params.filters.materials.length > 0) {
          cleanFilters.materials = params.filters.materials;
        }
        
        if (params.filters.colors && params.filters.colors.length > 0) {
          cleanFilters.colors = params.filters.colors;
        }
        
        if (params.filters.sizes && params.filters.sizes.length > 0) {
          cleanFilters.sizes = params.filters.sizes;
        }
        
        if (params.filters.features && params.filters.features.length > 0) {
          cleanFilters.features = params.filters.features;
        }
        
        if (params.filters.discount_ranges && params.filters.discount_ranges.length > 0) {
          cleanFilters.discount_ranges = params.filters.discount_ranges;
        }
        
        if (params.filters.deal_types && params.filters.deal_types.length > 0) {
          cleanFilters.deal_types = params.filters.deal_types;
        }
        
        // Add custom attributes if present
        if (params.filters.custom_attributes && Object.keys(params.filters.custom_attributes).length > 0) {
          cleanFilters.custom_attributes = params.filters.custom_attributes;
        }
        
        // Only add filters parameter if we have actual filters
        if (Object.keys(cleanFilters).length > 0) {
          queryParams.append('filters', JSON.stringify(cleanFilters));
        }
      }

      const response = await productAxiosInstance.get(
        `/flash-deals/advanced?${queryParams.toString()}`
      );


      return response.data;
    } catch (error) {
      throw error;
    }
  },

  extractFlashDealFilters: (availableFilters) => {
    const flashDealFilters = {};

    // Extract discount ranges
    if (availableFilters.discount_ranges) {
      flashDealFilters.discount_ranges = {
        type: "checkbox",
        label: "Discount Ranges",
        options: availableFilters.discount_ranges.options || [],
      };
    }

    // Extract deal types
    if (availableFilters.deal_types) {
      flashDealFilters.deal_types = {
        type: "checkbox",
        label: "Deal Types",
        options: availableFilters.deal_types.options || [],
      };
    }

    // Extract urgency levels if available
    if (availableFilters.urgency_levels) {
      flashDealFilters.urgency_levels = {
        type: "checkbox",
        label: "Deal Urgency",
        options: availableFilters.urgency_levels.options || [],
      };
    }

    return flashDealFilters;
  },

  formatFlashDealProductData: (product) => {
    return {
      id: product.id,
      sku: product.sku,
      slug: product.slug,
      title: product.title,
      description: product.description,
      short_description: product.short_description,
      main_image_url: product.main_image_url,
      images: product.images || [],

      // Enhanced pricing with flash deal information
      pricing: {
        regular_price_nett:
          product.pricing?.regular_price_nett || product.regular_price_nett,
        regular_price_gross:
          product.pricing?.regular_price_gross || product.regular_price_gross,
        final_price_nett:
          product.pricing?.final_price_nett || product.final_price_nett,
        final_price_gross:
          product.pricing?.final_price_gross || product.final_price_gross,
        is_discounted: product.pricing?.is_discounted || product.is_discounted,
        discount_percentage:
          product.pricing?.discount_percentage_nett ||
          product.pricing?.discount_percentage ||
          product.discount_percentage_nett,
        savings: product.pricing?.savings || null,
        currency: "EUR",
      },

      // Enhanced flash deal information
      flash_deal: product.flash_deal || null,

      // Enhanced badges including flash deal specific ones
      badges: {
        is_new: product.badges?.is_new || product.mark_as_new,
        is_featured: product.badges?.is_featured || product.mark_as_featured,
        is_top_seller:
          product.badges?.is_top_seller || product.mark_as_top_seller,
        is_on_sale: product.badges?.is_on_sale || product.is_on_sale,
        is_special_offer: product.badges?.is_special_offer || product.is_special_offer,
        free_shipping: product.badges?.free_shipping || product.shipping_free,
        // Flash deal specific badges
        hot_deal: product.badges?.hot_deal || false,
        mega_deal: product.badges?.mega_deal || false,
        super_deal: product.badges?.super_deal || false,
        limited_time: product.badges?.limited_time || false,
        best_value: product.badges?.best_value || false,
      },

      // Enhanced availability
      availability: {
        is_available:
          product.availability?.is_available || product.is_available_on_stock,
        status:
          product.availability?.status ||
          (product.is_available_on_stock ? "In Stock" : "Out of Stock"),
      },

      // Physical information
      physical_info: product.physical_info || {
        weight: product.weight,
        weight_unit: product.weight_unit,
        dimensions: product.dimensions || {},
      },

      // Product type
      product_type: product.product_type || {
        is_digital: product.is_digital,
        is_physical: product.is_physical,
        unit_type: product.unit_type,
      },

      // Enhanced custom details
      custom_details: product.custom_details || [],

      // Category and business information
      primary_category: product.primary_category,
      categories: product.categories || [],
      company_info: product.company_info,
      tax_info: product.tax_info,

      // Deal metadata for flash deals
      deal_metadata: product.deal_metadata || null,

      // Timestamps
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  },
};
