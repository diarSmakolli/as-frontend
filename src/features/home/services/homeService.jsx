import axios from "axios";
import { API_BASE_URL } from "../../../commons/api";

const CATEGORY_API_URL = `${API_BASE_URL}/categories`;
const PRODUCT_API_URL = `${API_BASE_URL}/products`;
const BASKET_API_URL = `${API_BASE_URL}/basket`;
const ORDER_API_URL = `${API_BASE_URL}/orders`;

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

const basketAxiosInstance = axios.create({
  baseURL: BASKET_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const orderAxiosInstance = axios.create({
  baseURL: ORDER_API_URL,
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

      // --- SIMPLIFIED: Always send filters as JSON string if present ---
      if (params.filters && Object.keys(params.filters).length > 0) {
        queryParams.append("filters", JSON.stringify(params.filters));
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

      // --- SIMPLIFIED: Always send filters as JSON string if present ---
      if (params.filters && Object.keys(params.filters).length > 0) {
        queryParams.append("filters", JSON.stringify(params.filters));
      }

      const response = await productAxiosInstance.get(
        `/category/${categoryId}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAdvancedFlashDeals: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Pagination parameters
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.offset) queryParams.append("offset", params.offset);

      // Sorting parameters
      if (params.sort_by) queryParams.append("sort_by", params.sort_by);
      if (params.sort_order)
        queryParams.append("sort_order", params.sort_order);

      // Price filters
      if (params.min_price !== undefined && params.min_price !== "") {
        queryParams.append("min_price", params.min_price);
      }
      if (params.max_price !== undefined && params.max_price !== "") {
        queryParams.append("max_price", params.max_price);
      }

      // Discount filters
      if (params.min_discount !== undefined) {
        queryParams.append("min_discount", params.min_discount);
      }
      if (params.max_discount !== undefined && params.max_discount !== "") {
        queryParams.append("max_discount", params.max_discount);
      }

      // Availability filter
      if (params.include_out_of_stock !== undefined) {
        queryParams.append("include_out_of_stock", params.include_out_of_stock);
      }

      // Category filter
      if (params.category_id) {
        queryParams.append("category_id", params.category_id);
      }

      // Advanced filters (JSON string)
      if (params.filters && Object.keys(params.filters).length > 0) {
        // Clean and format filters
        const cleanFilters = {};

        // Handle different filter types
        if (
          params.filters.specifications &&
          Object.keys(params.filters.specifications).length > 0
        ) {
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

        if (
          params.filters.discount_ranges &&
          params.filters.discount_ranges.length > 0
        ) {
          cleanFilters.discount_ranges = params.filters.discount_ranges;
        }

        if (params.filters.deal_types && params.filters.deal_types.length > 0) {
          cleanFilters.deal_types = params.filters.deal_types;
        }

        // Add custom attributes if present
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
        is_special_offer:
          product.badges?.is_special_offer || product.is_special_offer,
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

  // calculations
  calculateProductPricing: async (productId, config) => {
    try {
      const response = await productAxiosInstance.post(
        `/${productId}/calculate-pricing`,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProductPricingConfig: async (productId) => {
    try {
      const response = await productAxiosInstance.get(
        `/${productId}/pricing-config`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Helper method to format pricing calculation request
  formatPricingRequest: (dimensions, selectedOptions, quantity, taxRate) => {
    return {
      dimensions: dimensions || {},
      selectedOptions: selectedOptions || [],
      quantity: quantity || 1,
      taxRate: taxRate,
    };
  },

  // Helper method to validate dimensions based on product constraints
  validateDimensions: (dimensions, constraints) => {
    const errors = [];

    if (!constraints) return { valid: true, errors: [] };

    Object.entries(dimensions).forEach(([key, value]) => {
      if (value && constraints[key]) {
        const constraint = constraints[key];
        if (constraint.min && value < constraint.min) {
          errors.push(
            `${key} must be at least ${constraint.min}${constraint.unit}`
          );
        }
        if (constraint.max && value > constraint.max) {
          errors.push(
            `${key} cannot exceed ${constraint.max}${constraint.unit}`
          );
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  // Helper method to format selected options for API
  formatSelectedOptionsForAPI: (selectedCustomOptions) => {
    return Object.entries(selectedCustomOptions).map(
      ([optionId, valueData]) => ({
        optionId,
        valueId: valueData.valueId,
      })
    );
  },

  // Method to get required dimensions based on product type
  getRequiredDimensionsForProduct: (product) => {
    if (!product?.is_dimensional_pricing) {
      return [];
    }

    const calculationType = product.dimensional_calculation_type;

    switch (calculationType) {
      case "m2":
        return ["width", "height"];
      case "m3":
        return ["width", "height", "depth"];
      case "linear-meter":
        return ["width", "height"];
      case "meter":
        return ["length"];
      default:
        return [];
    }
  },

  getTopProductsByCategorySlug: async (categorySlug, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);

      const response = await productAxiosInstance.get(
        `/category-slug/${categorySlug}/top-products?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // create product event
  createProductEvent: async (eventData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-events`,
        eventData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // create multiple product events (batch)
  createProductEventsBatch: async (eventsArray) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/product-events/batch`,
        eventsArray
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add product to cart
  addToCart: async (cartItemData) => {
    try {
      const response = await basketAxiosInstance.post("/add", cartItemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active cart for the current customer
  getActiveCart: async (country, postalCode) => {
    try {
      const response = await basketAxiosInstance.get("/active", {
        params: {
          country: country,
          postalCode: postalCode,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get the count of items in the active cart
  getCartItemCount: async () => {
    try {
      const response = await basketAxiosInstance.get("/count");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Remove an item from the cart
  removeFromCart: async (cart_item_id) => {
    try {
      const response = await basketAxiosInstance.delete("/remove", {
        data: { cart_item_id },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update quantity of a cart item
  updateCartItemQuantity: async (cart_item_id, quantity) => {
    try {
      const response = await basketAxiosInstance.put("/update-quantity", {
        cart_item_id,
        quantity,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  applyPromotionCode: async (promotion_code) => {
    try {
      const response = await basketAxiosInstance.post("/apply-promotion", {
        promotion_code,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removePromotion: async () => {
    try {
      const response = await basketAxiosInstance.delete("/remove-promotion");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  applyGiftCard: async (gift_card_code) => {
    try {
      const response = await basketAxiosInstance.post("/apply-gift-card", {
        gift_card_code,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeGiftCard: async () => {
    try {
      const response = await basketAxiosInstance.delete("/remove-gift-card");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ORDERS START
  checkout: async (checkoutData) => {
    try {
      const response = await orderAxiosInstance.post("/checkout", checkoutData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // ORDERS END
  // create a promotion
  createPromotion: async (promotionData) => {
    try {
      const response = await basketAxiosInstance.post(
        `/admin/promotions`,
        promotionData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // get all promotions
  getAllPromotions: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (typeof params.is_active !== "undefined")
        queryParams.append("is_active", params.is_active);
      if (params.type) queryParams.append("type", params.type);
      if (params.valid_from)
        queryParams.append("valid_from", params.valid_from);
      if (params.valid_until)
        queryParams.append("valid_until", params.valid_until);
      if (params.applicable_to)
        queryParams.append("applicable_to", params.applicable_to);

      const response = await basketAxiosInstance.get(
        `/admin/promotions?${queryParams.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // update a promotion
  updatePromotion: async (promotionId, updateData) => {
    try {
      const response = await basketAxiosInstance.put(
        `/admin/promotions/${promotionId}`,
        updateData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // create giftcard
  createGiftCard: async (giftCardData) => {
    try {
      const response = await basketAxiosInstance.post(
        `/admin/gift-cards`,
        giftCardData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Get all gift cards (admin) with pagination, search, and filters
  getAllGiftCards: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (typeof params.is_active !== "undefined")
        queryParams.append("is_active", params.is_active);
      if (params.valid_from)
        queryParams.append("valid_from", params.valid_from);
      if (params.valid_until)
        queryParams.append("valid_until", params.valid_until);
      if (params.recipient_email)
        queryParams.append("recipient_email", params.recipient_email);

      const response = await basketAxiosInstance.get(
        `/admin/gift-cards?${queryParams.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Update a gift card (admin only)
  updateGiftCard: async (giftCardId, updateData) => {
    try {
      const response = await basketAxiosInstance.put(
        `/admin/gift-cards/${giftCardId}`,
        updateData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ADMIN CUSTOMERS ROUTES
  // Get all customers (admin) with pagination, search, and filters
  getAllCustomers: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search) queryParams.append("search", params.search);
      if (params.is_active !== undefined && params.is_active !== "")
        queryParams.append("is_active", params.is_active);
      if (params.customer_type)
        queryParams.append("customer_type", params.customer_type);
      if (params.email_verified !== undefined && params.email_verified !== "")
        queryParams.append("email_verified", params.email_verified);
      if (params.customer_group)
        queryParams.append("customer_group", params.customer_group);
      if (params.preferred_language)
        queryParams.append("preferred_language", params.preferred_language);
      if (params.preferred_currency)
        queryParams.append("preferred_currency", params.preferred_currency);
      if (params.created_from)
        queryParams.append("created_from", params.created_from);
      if (params.created_until)
        queryParams.append("created_until", params.created_until);

      const response = await axios.get(
        `${API_BASE_URL}/customers/admin/customers?${queryParams.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Get customer details by id (admin)
  getCustomerById: async (customerId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customers/admin/customers/${customerId}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Get all orders for a customer (admin)
  getOrdersByCustomerId: async (customerId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);
      if (params.search) queryParams.append("search", params.search);

      const response = await axios.get(
        `${API_BASE_URL}/customers/admin/customers/${customerId}/orders?${queryParams.toString()}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // END ADMIN CUSTOMER ROUTES
  // ORDER ADMIN
  // Get very detailed order info for admins
  getOrderDetailsAdmin: async (orderId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/orders/admin/orders/${orderId}/details`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  handleCancellationRequest: async (requestData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/admin/handle-cancellation-request`,
        requestData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  addStaffNoteToOrder: async ({ order_id, note }) => {
    try {
      const response = await orderAxiosInstance.post(
        "/admin/orders/add-staff-note",
        { order_id, note }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateOrderStatus: async ({ order_id, new_status, note }) => {
    try {
      const response = await orderAxiosInstance.post(
        "/admin/orders/update-status",
        { order_id, new_status, note }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Generate delivery note for an order (Admin only)
  generateDeliveryNote: async (order_id) => {
    try {
      const response = await orderAxiosInstance.get(
        `/admin/orders/${order_id}/delivery-note`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // ADMIN: Cancel an order
  cancelOrderByAdmin: async ({
    order_id,
    admin_id,
    admin_name,
    admin_note,
  }) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/cancel`,
        { admin_id, admin_name, admin_note }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  // Generate Proforma Invoice (Admin)
  generateProInvoice: async (order_id) => {
    try {
      const response = await orderAxiosInstance.get(
        `/admin/orders/${order_id}/pro-invoice`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate Credit Note (Admin)
  generateCreditNote: async (order_id) => {
    try {
      const response = await orderAxiosInstance.get(
        `/admin/orders/${order_id}/credit-note`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate Storno Bill (Admin)
  generateStornoBill: async (order_id) => {
    try {
      const response = await orderAxiosInstance.get(
        `/admin/orders/${order_id}/storno-bill`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate Invoice (Admin)
  generateInvoice: async (order_id) => {
    try {
      const response = await orderAxiosInstance.get(
        `/admin/orders/${order_id}/invoice`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send Paid Invoice Email (Admin)
  sendPaidInvoiceEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-paid-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send Processing Email (Admin)
  sendProcessingEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-processing-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send Shipped Email (Admin)
  sendShippedEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-shipped-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send In Customs Email (Admin)
  sendInCustomsEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-in-customs-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send On Delivery Email (Admin)
  sendOnDeliveryEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-on-delivery-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send Delivered Email (Admin)
  sendDeliveredEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-delivered-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send Cancelled Email (Admin)
  sendCancelledEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-cancelled-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send Refunded Email (Admin)
  sendRefundedEmail: async (order_id) => {
    try {
      const response = await orderAxiosInstance.post(
        `/admin/orders/${order_id}/send-refunded-email`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getAllOrders: async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.payment_status) queryParams.append("payment_status", params.payment_status);
    if (params.payment_method) queryParams.append("payment_method", params.payment_method);
    if (params.customer_email) queryParams.append("customer_email", params.customer_email);
    if (params.customer_name) queryParams.append("customer_name", params.customer_name);
    if (params.order_number) queryParams.append("order_number", params.order_number);
    if (params.fromDate) queryParams.append("fromDate", params.fromDate);
    if (params.toDate) queryParams.append("toDate", params.toDate);
    if (params.min_total) queryParams.append("min_total", params.min_total);
    if (params.max_total) queryParams.append("max_total", params.max_total);
    if (params.search) queryParams.append("search", params.search);

    const response = await orderAxiosInstance.get(
      `/admin/orders?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},
createOrderByAdmin: async (orderData) => {
  try {
    const response = await orderAxiosInstance.post(
      "/admin/orders",
      orderData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
},
  // ORDER ADMIN
};
