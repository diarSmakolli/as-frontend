import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useToast,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Badge,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertDescription,
  Container,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiSave,
  FiHome,
  FiPackage,
  FiSettings,
  FiImage,
  FiTag,
  FiDollarSign,
  FiInfo,
  FiGlobe,
} from "react-icons/fi";
import axios from 'axios';
import { productService } from '../services/productService';
import { companiesService } from '../../company/services/companiesService';
import { categoryService } from '../../category/service/categoryService';
import { useAuth } from "../../administration/authContext/authContext";
import { usePreferences } from "../../administration/authContext/preferencesProvider";
import SidebarContent from "../../administration/layouts/SidebarContent";
import MobileNav from "../../administration/layouts/MobileNav";
import SettingsModal from "../../administration/components/settings/SettingsModal";
import { handleApiError } from "../../../commons/handleApiError";
import Loader from "../../../commons/Loader";
import ImageUpload from '../create-product/components/ImageUpload';
import CategoriesSelector from '../create-product/components/CategoriesSelector';
import ProductServicesForm from '../create-product/components/ProductServicesForm';
import CustomDetailsForm from '../create-product/components/CustomDetailsForm';
import CustomOptionsForm from '../create-product/components/CustomOptionsForm';
import ExistingImageManager from './components/ExistingImageManager';
import RichTextEditor from '../create-product/components/RichTextEditor';
import { API_BASE_URL } from '../../../commons/api';

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);


const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { account, isLoading: isAuthLoading } = useAuth();
  const { currentTimezone } = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    sku: '',
    barcode: '',
    ean: '',
    weight: '',
    weight_unit: 'kg',
    measures_unit: 'cm',
    unit_type: 'pcs',
    width: '',
    height: '',
    length: '',
    thickness: '',
    depth: '',
    lead_time: 5,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    purchase_price_nett: '',
    regular_price_nett: '',
    is_discounted: false,
    discount_percentage_nett: '',
    final_price_nett: '',
    tax_id: '',
    supplier_id: '',
    company_id: '',
    is_active: true,
    is_published: false,
    is_available_on_stock: true,
    shipping_free: false,
    mark_as_top_seller: false,
    mark_as_new: false,
    mark_as_featured: false,
    is_digital: false,
    is_physical: true,
    is_delivery_only: true,
    is_special_offer: false,
    custom_options: [],
    existing_images: [],
    new_images: [],
    services: [],
    categories: [],
    custom_details: []
  });

  // Dropdown data
  const [taxes, setTaxes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  };

  const slideUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  // Fetch dropdown data - FIXED TO USE CORRECT API ENDPOINTS
  const fetchDropdownData = useCallback(async () => {
    console.log('Starting to fetch dropdown data...');
    try {
      // Fetch all required data in parallel using correct endpoints
      const [taxResponse, companiesResponse, categoriesResponse] = await Promise.all([
        // Use the correct tax endpoint that works
        axios.get(`${API_BASE_URL}/taxes/get-taxes`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }),
        companiesService.getAllCompanies(),
        categoryService.getAllCategories()
      ]);

      console.log('Raw API responses:', {
        taxes: taxResponse,
        companies: companiesResponse,
        categories: categoriesResponse
      });

      // Handle taxes response from /api/taxes/get-taxes
      let taxesData = [];
      if (taxResponse?.data?.data?.taxes) {
        taxesData = taxResponse.data.data.taxes;
      } else if (taxResponse?.data?.taxes) {
        taxesData = taxResponse.data.taxes;
      } else if (Array.isArray(taxResponse?.data)) {
        taxesData = taxResponse.data;
      }

      // Handle companies response
      let companiesData = [];
      if (companiesResponse?.data?.data?.companies) {
        companiesData = companiesResponse.data.data.companies;
      } else if (companiesResponse?.data?.data && Array.isArray(companiesResponse.data.data)) {
        companiesData = companiesResponse.data.data;
      } else if (companiesResponse?.data && Array.isArray(companiesResponse.data)) {
        companiesData = companiesResponse.data;
      }

      // Handle categories response
      let categoriesData = [];
      if (categoriesResponse?.data?.data?.categories) {
        categoriesData = categoriesResponse.data.data.categories;
      } else if (categoriesResponse?.data?.data && Array.isArray(categoriesResponse.data.data)) {
        categoriesData = categoriesResponse.data.data;
      } else if (categoriesResponse?.data && Array.isArray(categoriesResponse.data)) {
        categoriesData = categoriesResponse.data;
      }

      console.log('Processed dropdown data:', {
        taxes: taxesData,
        companies: companiesData,
        categories: categoriesData
      });

      // Set the state with fetched data
      setTaxes(Array.isArray(taxesData) ? taxesData.filter(tax => !tax.is_inactive) : []);
      setCompanies(Array.isArray(companiesData) ? companiesData.filter(company => !company.is_inactive) : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData.filter(cat => cat.is_active !== false) : []);

      console.log('Final state data:', {
        taxesCount: Array.isArray(taxesData) ? taxesData.length : 0,
        companiesCount: Array.isArray(companiesData) ? companiesData.length : 0,
        categoriesCount: Array.isArray(categoriesData) ? categoriesData.length : 0
      });

    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      handleApiError(error, toast);
      
      // Set empty arrays as fallback
      setTaxes([]);
      setCompanies([]);
      setCategories([]);
    }
  }, [toast]);

  // Fetch product details
  const fetchProductDetails = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching product details for ID:', productId);
      const response = await productService.getProductById(productId);
      
      if (response.data?.status === 'success') {
        const product = response.data.data.product;
        console.log('Product data received:', product);
        
        // Update form data with product details
        setFormData({
          title: product.title || '',
          description: product.description || '',
          short_description: product.short_description || '',
          sku: product.sku || '',
          barcode: product.barcode || '',
          ean: product.ean || '',
          weight: product.weight || '',
          weight_unit: product.weight_unit || 'kg',
          measures_unit: product.measures_unit || 'cm',
          unit_type: product.unit_type || 'pcs',
          width: product.width || '',
          height: product.height || '',
          length: product.length || '',
          thickness: product.thickness || '',
          depth: product.depth || '',
          lead_time: product.lead_time || 5,
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
          meta_keywords: product.meta_keywords || '',
          purchase_price_nett: product.purchase_price_nett || '',
          regular_price_nett: product.regular_price_nett || '',
          is_discounted: product.is_discounted || false,
          discount_percentage_nett: product.discount_percentage_nett || '',
          final_price_nett: product.final_price_nett || '',
          tax_id: product.tax_id || '',
          supplier_id: product.supplier_id || '',
          company_id: product.company_id || '',
          is_active: product.is_active !== undefined ? product.is_active : true,
          is_published: product.is_published !== undefined ? product.is_published : false,
          is_available_on_stock: product.is_available_on_stock !== undefined ? product.is_available_on_stock : true,
          shipping_free: product.shipping_free !== undefined ? product.shipping_free : false,
          mark_as_top_seller: product.mark_as_top_seller !== undefined ? product.mark_as_top_seller : false,
          mark_as_new: product.mark_as_new !== undefined ? product.mark_as_new : false,
          mark_as_featured: product.mark_as_featured !== undefined ? product.mark_as_featured : false,
          is_digital: product.is_digital !== undefined ? product.is_digital : false,
          is_physical: product.is_physical !== undefined ? product.is_physical : true,
          is_delivery_only: product.is_delivery_only !== undefined ? product.is_delivery_only : true,
          is_special_offer: product.is_special_offer !== undefined ? product.is_special_offer : false,
          custom_options: Array.isArray(product.custom_options) ? product.custom_options : [],
          existing_images: Array.isArray(product.images) ? product.images : [],
          new_images: [],
          services: Array.isArray(product.product_services) ? product.product_services : [],
          categories: Array.isArray(product.categories) ? product.categories.map(cat => cat.id) : [],
          custom_details: Array.isArray(product.custom_details) ? product.custom_details : []
        });

        setCurrentProduct(product);
        console.log('Form data updated successfully');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      handleApiError(error, toast);
      navigate('/products-console');
    } finally {
      setLoading(false);
    }
  }, [productId, navigate, toast]);

  // Initialize page data
  useEffect(() => {
    const initializePage = async () => {
      setLoading(true);
      try {
        // Fetch dropdown data first
        await fetchDropdownData();
        // Then fetch product details
        await fetchProductDetails();
      } catch (error) {
        console.error('Error initializing page:', error);
        setLoading(false);
      }
    };

    if (productId) {
      initializePage();
    } else {
      setLoading(false);
    }
  }, [productId, fetchDropdownData, fetchProductDetails]);

  // Form handlers
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCustomOptionsChange = (customOptions) => {
    console.log('Custom options changed in edit page:', customOptions);
    setFormData(prev => ({
      ...prev,
      custom_options: customOptions
    }));
  };

  // const handleCustomOptionValueImageUpload = async (
  //   optionId,
  //   valueId,
  //   file
  // ) => {
  //   try {
  //     await productService.updateCustomOptionValueImage(
  //       optionId,
  //       valueId,
  //       file
  //     );
  //     toast({
  //       title: "Image updated!",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     // Optionally, refresh product data here
  //   } catch (error) {
  //     toast({
  //       title: "Image upload failed",
  //       description: error.response?.data?.message || "Please try again.",
  //       status: "error",
  //       duration: 4000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleCustomOptionValueImageUpload = async (optionId, valueId, file) => {
  try {
    await productService.updateCustomOptionValueImage(optionId, valueId, file);
    // Fetch updated custom options
    const res = await productService.getProductCustomOptions(currentProduct.id);
    if (res.data?.data?.custom_options) {
      setFormData(prev => ({
        ...prev,
        custom_options: res.data.data.custom_options
      }));
    }
    toast({
      title: "Image updated!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  } catch (error) {
    toast({
      title: "Image upload failed",
      description: error.response?.data?.message || "Please try again.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};

  const handleImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      new_images: images
    }));
  };

  const handleExistingImagesChange = (images) => {
    setFormData(prev => ({
      ...prev,
      existing_images: images
    }));
  };

  const handleCategoriesChange = (categories) => {
    setFormData(prev => ({
      ...prev,
      categories
    }));
  };

  const handleServicesChange = (services) => {
    setFormData(prev => ({
      ...prev,
      services
    }));
  };

  const handleCustomDetailsChange = (customDetails) => {
    setFormData(prev => ({
      ...prev,
      custom_details: customDetails
    }));
  };

  // Enhanced validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.purchase_price_nett) newErrors.purchase_price_nett = 'Purchase price is required';
    if (!formData.regular_price_nett) newErrors.regular_price_nett = 'Regular price is required';
    
    if (!formData.tax_id) {
      newErrors.tax_id = 'Tax is required';
      if (taxes.length === 0) {
        newErrors.tax_id = 'No taxes available. Please create a tax rate first.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return formData.title?.trim() && 
           formData.description?.trim() && 
           formData.weight && 
           formData.purchase_price_nett && 
           formData.regular_price_nett && 
           formData.tax_id &&
           taxes.length > 0; // Ensure taxes are loaded
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setSubmitting(true);
    try {
      const formDataToSend = new FormData();

      // Add all form fields
      Object.keys(formData).forEach((key) => {
        if (key === "new_images") {
          formData.new_images.forEach((image) => {
            formDataToSend.append("images", image);
          });
        } else if (
          key === "services" ||
          key === "categories" ||
          key === "custom_details" ||
          key === "existing_images"
        ) {
          // // Handle arrays as JSON strings
          // formDataToSend.append(key, JSON.stringify(formData[key]));
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "custom_options") {
          // Clean custom_options: remove only image (File) and image_preview from option values, KEEP image_url
          const cleanedCustomOptions = (formData.custom_options || []).map(
            (option) => ({
              ...option,
              option_values: (option.option_values || []).map((val) => {
                const { image, image_preview, image_url, ...rest } = val;
                return rest;
              }),
            })
          );
          formDataToSend.append(
            "custom_options",
            JSON.stringify(cleanedCustomOptions)
          );
        } else if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log('Submitting updated custom options:', formData.custom_options);

      const response = await productService.updateProduct(productId, formDataToSend);

      toast({
        title: "Success!",
        description: response.data.message || "Product updated successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate(`/products-console/${productId}`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading states
  if (isAuthLoading) {
    return <Loader />;
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p="8">
          <Loader />
        </Box>
      </Box>
    );
  }

  if (!currentProduct) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p="8">
          <Alert status="error" borderRadius="xl" boxShadow="lg">
            <AlertIcon />
            <AlertDescription>Product not found or has been removed.</AlertDescription>
          </Alert>
          <Button
            mt={6}
            leftIcon={<FiArrowLeft />}
            onClick={() => navigate("/products-console")}
            colorScheme="blue"
            size="lg"
          >
            Back to Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
      <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <Box ml={{ base: 0, md: 60 }}>
        <Container maxW="8xl" px={{ base: 3, md: 6 }} py={6}>
          <MotionBox {...fadeIn}>
            {/* Breadcrumb */}
            <HStack spacing={1} mb={4} fontSize="xs" color="gray.500">
              <Icon as={FiHome} fontSize="xs" />
              <Text
                cursor="pointer"
                onClick={() => navigate("/")}
                _hover={{ color: "blue.500" }}
              >
                Home
              </Text>
              <Text>•</Text>
              <Text
                cursor="pointer"
                onClick={() => navigate("/products-console")}
                _hover={{ color: "blue.500" }}
              >
                Products
              </Text>
              <Text>•</Text>
              <Text
                cursor="pointer"
                onClick={() => navigate(`/products-console/${productId}`)}
                _hover={{ color: "blue.500" }}
              >
                {currentProduct.title}
              </Text>
              <Text>•</Text>
              <Text color="blue.500" fontWeight="600">
                Edit
              </Text>
            </HStack>

            {/* Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Heading size="lg" color="gray.900" fontWeight="700">
                    Edit Product
                  </Heading>
                  <Badge
                    colorScheme="blue"
                    variant="solid"
                    fontSize="xs"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    {currentProduct.sku}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  Update product information and settings
                </Text>
              </VStack>
              <HStack spacing={2}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  onClick={() => navigate(`/products-console/${productId}`)}
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  leftIcon={<FiSave />}
                  onClick={handleSubmit}
                  colorScheme="blue"
                  size="sm"
                  isLoading={submitting}
                  loadingText="Updating..."
                  isDisabled={!isFormValid()}
                >
                  Update Product
                </Button>
              </HStack>
            </Flex>

            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <MotionCard
                {...slideUp}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="blue.50" py={4}>
                  <HStack>
                    <Icon as={FiInfo} color="blue.500" />
                    <Text fontWeight="medium" color="blue.800">
                      Basic Information
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl isInvalid={!!errors.title}>
                        <FormLabel>Product Title *</FormLabel>
                        <Input
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          placeholder="Enter product title"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Short Description</FormLabel>
                        <Input
                          value={formData.short_description}
                          onChange={(e) =>
                            handleInputChange(
                              "short_description",
                              e.target.value
                            )
                          }
                          placeholder="Brief product description"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isInvalid={!!errors.description}>
                      <FormLabel>Description *</FormLabel>
                      <RichTextEditor
                        value={formData.description}
                        onChange={(value) =>
                          handleInputChange("description", value)
                        }
                        placeholder="Enter detailed product description"
                        minHeight="200px"
                      />
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <FormControl>
                        <FormLabel>SKU</FormLabel>
                        <Input
                          value={formData.sku}
                          onChange={(e) =>
                            handleInputChange("sku", e.target.value)
                          }
                          placeholder="Product SKU"
                          isReadOnly
                          bg="gray.100"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Barcode</FormLabel>
                        <Input
                          value={formData.barcode}
                          onChange={(e) =>
                            handleInputChange("barcode", e.target.value)
                          }
                          placeholder="Product barcode"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>EAN</FormLabel>
                        <Input
                          value={formData.ean}
                          onChange={(e) =>
                            handleInputChange("ean", e.target.value)
                          }
                          placeholder="EAN code"
                        />
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Existing Images */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.1 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="purple.50" py={4}>
                  <HStack>
                    <Icon as={FiImage} color="purple.500" />
                    <Text fontWeight="medium" color="purple.800">
                      Current Images
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <ExistingImageManager
                    images={formData.existing_images}
                    onImagesChange={handleExistingImagesChange}
                  />
                </CardBody>
              </MotionCard>

              {/* New Images */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.2 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="green.50" py={4}>
                  <HStack>
                    <Icon as={FiImage} color="green.500" />
                    <Text fontWeight="medium" color="green.800">
                      Add New Images
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <ImageUpload
                    images={formData.new_images}
                    onImagesChange={handleImagesChange}
                  />
                </CardBody>
              </MotionCard>

              {/* Pricing */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.3 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="green.50" py={4}>
                  <HStack>
                    <Icon as={FiDollarSign} color="green.500" />
                    <Text fontWeight="medium" color="green.800">
                      Pricing & Business Information
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {/* Pricing Row */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <FormControl isInvalid={!!errors.purchase_price_nett}>
                        <FormLabel>Purchase Price (Net) *</FormLabel>
                        <NumberInput
                          value={formData.purchase_price_nett}
                          onChange={(value) =>
                            handleInputChange("purchase_price_nett", value)
                          }
                          min={0}
                          precision={2}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl isInvalid={!!errors.regular_price_nett}>
                        <FormLabel>Regular Price (Net) *</FormLabel>
                        <NumberInput
                          value={formData.regular_price_nett}
                          onChange={(value) =>
                            handleInputChange("regular_price_nett", value)
                          }
                          min={0}
                          precision={2}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>

                      <FormControl isInvalid={!!errors.tax_id}>
                        <FormLabel>Tax Rate *</FormLabel>
                        <Select
                          value={formData.tax_id}
                          onChange={(e) =>
                            handleInputChange("tax_id", e.target.value)
                          }
                          placeholder={
                            taxes.length === 0
                              ? "Loading taxes..."
                              : "Select tax rate"
                          }
                          isDisabled={taxes.length === 0}
                        >
                          {taxes.length > 0
                            ? taxes.map((tax) => (
                                <option key={tax.id} value={tax.id}>
                                  {tax.name} ({tax.rate}%)
                                </option>
                              ))
                            : null}
                        </Select>
                        {errors.tax_id && (
                          <FormErrorMessage>{errors.tax_id}</FormErrorMessage>
                        )}
                        {taxes.length === 0 && !errors.tax_id && (
                          <FormHelperText color="orange.500">
                            No taxes found. Please create a tax rate first in
                            the Tax Console.
                          </FormHelperText>
                        )}
                      </FormControl>
                    </SimpleGrid>

                    {/* Business Information Row */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl>
                        <FormLabel>Owner Company</FormLabel>
                        <Select
                          value={formData.company_id}
                          onChange={(e) =>
                            handleInputChange("company_id", e.target.value)
                          }
                          placeholder="Select owner company"
                        >
                          {companies.length > 0 ? (
                            companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.business_name} ({company.market_name})
                              </option>
                            ))
                          ) : (
                            <option disabled>Loading companies...</option>
                          )}
                        </Select>
                        <FormHelperText>
                          Company that owns this product
                        </FormHelperText>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Supplier Company</FormLabel>
                        <Select
                          value={formData.supplier_id}
                          onChange={(e) =>
                            handleInputChange("supplier_id", e.target.value)
                          }
                          placeholder="Select supplier (optional)"
                        >
                          <option value="">No Supplier</option>
                          {companies.length > 0 ? (
                            companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.business_name} ({company.market_name})
                              </option>
                            ))
                          ) : (
                            <option disabled>Loading companies...</option>
                          )}
                        </Select>
                        <FormHelperText>
                          Company that supplies this product (optional)
                        </FormHelperText>
                      </FormControl>
                    </SimpleGrid>

                    {/* Discount Information */}
                    <Box>
                      <FormControl display="flex" alignItems="center" mb={4}>
                        <FormLabel htmlFor="is_discounted" mb="0">
                          Product has discount
                        </FormLabel>
                        <Switch
                          id="is_discounted"
                          isChecked={formData.is_discounted}
                          onChange={(e) =>
                            handleInputChange("is_discounted", e.target.checked)
                          }
                          colorScheme="green"
                        />
                      </FormControl>

                      {formData.is_discounted && (
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          <FormControl>
                            <FormLabel>Discount Percentage (Net)</FormLabel>
                            <NumberInput
                              value={formData.discount_percentage_nett}
                              onChange={(value) =>
                                handleInputChange(
                                  "discount_percentage_nett",
                                  value
                                )
                              }
                              min={0}
                              max={100}
                              precision={2}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <FormControl>
                            <FormLabel>Final Price (Net)</FormLabel>
                            <NumberInput
                              value={formData.final_price_nett}
                              onChange={(value) =>
                                handleInputChange("final_price_nett", value)
                              }
                              min={0}
                              precision={2}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        </SimpleGrid>
                      )}
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Categories */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.4 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="orange.50" py={4}>
                  <HStack>
                    <Icon as={FiTag} color="orange.500" />
                    <Text fontWeight="medium" color="orange.800">
                      Product Categories
                    </Text>
                    {formData.categories.length > 0 && (
                      <Badge colorScheme="orange" variant="solid">
                        {formData.categories.length} selected
                      </Badge>
                    )}
                  </HStack>
                </CardHeader>
                <CardBody>
                  {categories.length > 0 ? (
                    <CategoriesSelector
                      categories={categories}
                      selectedCategories={formData.categories}
                      onCategoriesChange={handleCategoriesChange}
                    />
                  ) : (
                    <Alert status="warning">
                      <AlertIcon />
                      <AlertDescription>
                        No categories found. Please create categories first in
                        the Categories Console.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardBody>
              </MotionCard>

              {/* Physical Properties */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.5 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="gray.50" py={4}>
                  <HStack>
                    <Icon as={FiPackage} color="gray.500" />
                    <Text fontWeight="medium" color="gray.800">
                      Physical Properties
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <FormControl isInvalid={!!errors.weight}>
                        <FormLabel>Weight *</FormLabel>
                        <HStack>
                          <NumberInput
                            value={formData.weight}
                            onChange={(value) =>
                              handleInputChange("weight", value)
                            }
                            min={0}
                            precision={2}
                            flex={1}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <Select
                            value={formData.weight_unit}
                            onChange={(e) =>
                              handleInputChange("weight_unit", e.target.value)
                            }
                            w="80px"
                          >
                            <option value="kg">kg</option>
                            <option value="g">g</option>
                            <option value="lbs">lbs</option>
                            <option value="oz">oz</option>
                          </Select>
                        </HStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Unit Type</FormLabel>
                        <Select
                          value={formData.unit_type}
                          onChange={(e) =>
                            handleInputChange("unit_type", e.target.value)
                          }
                        >
                          <option value="pcs">Pieces</option>
                          <option value="pack">Pack</option>
                          <option value="box">Box</option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Lead Time (days)</FormLabel>
                        <NumberInput
                          value={formData.lead_time}
                          onChange={(value) =>
                            handleInputChange("lead_time", value)
                          }
                          min={0}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    </SimpleGrid>

                    {/* Dimensions */}
                    <Box>
                      <Text fontWeight="medium" mb={4}>
                        Dimensions
                      </Text>
                      <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">Width</FormLabel>
                          <NumberInput
                            value={formData.width}
                            onChange={(value) =>
                              handleInputChange("width", value)
                            }
                            min={0}
                            precision={2}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Height</FormLabel>
                          <NumberInput
                            value={formData.height}
                            onChange={(value) =>
                              handleInputChange("height", value)
                            }
                            min={0}
                            precision={2}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Length</FormLabel>
                          <NumberInput
                            value={formData.length}
                            onChange={(value) =>
                              handleInputChange("length", value)
                            }
                            min={0}
                            precision={2}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Thickness</FormLabel>
                          <NumberInput
                            value={formData.thickness}
                            onChange={(value) =>
                              handleInputChange("thickness", value)
                            }
                            min={0}
                            precision={2}
                          >
                            <NumberInputField />
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Unit</FormLabel>
                          <Select
                            value={formData.measures_unit}
                            onChange={(e) =>
                              handleInputChange("measures_unit", e.target.value)
                            }
                          >
                            <option value="cm">cm</option>
                            <option value="mm">mm</option>
                            <option value="inches">inches</option>
                            <option value="feet">feet</option>
                          </Select>
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Product Features */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.6 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="blue.50" py={4}>
                  <HStack>
                    <Icon as={FiSettings} color="blue.500" />
                    <Text fontWeight="medium" color="blue.800">
                      Product Features & Settings
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    {/* Publishing & Status */}
                    <Box>
                      <Text fontWeight="medium" mb={4}>
                        Publishing & Status
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_active" mb="0">
                            Active Product
                          </FormLabel>
                          <Switch
                            id="is_active"
                            isChecked={formData.is_active}
                            onChange={(e) =>
                              handleInputChange("is_active", e.target.checked)
                            }
                            colorScheme="green"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_published" mb="0">
                            Published
                          </FormLabel>
                          <Switch
                            id="is_published"
                            isChecked={formData.is_published}
                            onChange={(e) =>
                              handleInputChange(
                                "is_published",
                                e.target.checked
                              )
                            }
                            colorScheme="blue"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_available_on_stock" mb="0">
                            Available in Stock
                          </FormLabel>
                          <Switch
                            id="is_available_on_stock"
                            isChecked={formData.is_available_on_stock}
                            onChange={(e) =>
                              handleInputChange(
                                "is_available_on_stock",
                                e.target.checked
                              )
                            }
                            colorScheme="teal"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>

                    {/* Marketing Features */}
                    <Box>
                      <Text fontWeight="medium" mb={4}>
                        Marketing Features
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="mark_as_featured" mb="0">
                            Featured Product
                          </FormLabel>
                          <Switch
                            id="mark_as_featured"
                            isChecked={formData.mark_as_featured}
                            onChange={(e) =>
                              handleInputChange(
                                "mark_as_featured",
                                e.target.checked
                              )
                            }
                            colorScheme="purple"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="mark_as_new" mb="0">
                            New Product
                          </FormLabel>
                          <Switch
                            id="mark_as_new"
                            isChecked={formData.mark_as_new}
                            onChange={(e) =>
                              handleInputChange("mark_as_new", e.target.checked)
                            }
                            colorScheme="orange"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="mark_as_top_seller" mb="0">
                            Top Seller
                          </FormLabel>
                          <Switch
                            id="mark_as_top_seller"
                            isChecked={formData.mark_as_top_seller}
                            onChange={(e) =>
                              handleInputChange(
                                "mark_as_top_seller",
                                e.target.checked
                              )
                            }
                            colorScheme="red"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_special_offer" mb="0">
                            Special Offer
                          </FormLabel>
                          <Switch
                            id="is_special_offer"
                            isChecked={formData.is_special_offer}
                            onChange={(e) =>
                              handleInputChange(
                                "is_special_offer",
                                e.target.checked
                              )
                            }
                            colorScheme="pink"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>

                    {/* Product Type & Delivery */}
                    <Box>
                      <Text fontWeight="medium" mb={4}>
                        Product Type & Delivery
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_physical" mb="0">
                            Physical Product
                          </FormLabel>
                          <Switch
                            id="is_physical"
                            isChecked={formData.is_physical}
                            onChange={(e) =>
                              handleInputChange("is_physical", e.target.checked)
                            }
                            colorScheme="teal"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_digital" mb="0">
                            Digital Product
                          </FormLabel>
                          <Switch
                            id="is_digital"
                            isChecked={formData.is_digital}
                            onChange={(e) =>
                              handleInputChange("is_digital", e.target.checked)
                            }
                            colorScheme="cyan"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="is_delivery_only" mb="0">
                            Delivery Only
                          </FormLabel>
                          <Switch
                            id="is_delivery_only"
                            isChecked={formData.is_delivery_only}
                            onChange={(e) =>
                              handleInputChange(
                                "is_delivery_only",
                                e.target.checked
                              )
                            }
                            colorScheme="blue"
                          />
                        </FormControl>

                        <FormControl display="flex" alignItems="center">
                          <FormLabel htmlFor="shipping_free" mb="0">
                            Free Shipping
                          </FormLabel>
                          <Switch
                            id="shipping_free"
                            isChecked={formData.shipping_free}
                            onChange={(e) =>
                              handleInputChange(
                                "shipping_free",
                                e.target.checked
                              )
                            }
                            colorScheme="green"
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* SEO Information */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.7 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="teal.50" py={4}>
                  <HStack>
                    <Icon as={FiGlobe} color="teal.500" />
                    <Text fontWeight="medium" color="teal.800">
                      SEO Information
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Meta Title</FormLabel>
                      <Input
                        value={formData.meta_title}
                        onChange={(e) =>
                          handleInputChange("meta_title", e.target.value)
                        }
                        placeholder="SEO title for search engines"
                      />
                      <FormHelperText>
                        Recommended: 50-60 characters
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Meta Description</FormLabel>
                      <Textarea
                        value={formData.meta_description}
                        onChange={(e) =>
                          handleInputChange("meta_description", e.target.value)
                        }
                        placeholder="Brief description for search engines"
                        rows={3}
                      />
                      <FormHelperText>
                        Recommended: 150-160 characters
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Meta Keywords</FormLabel>
                      <Input
                        value={formData.meta_keywords}
                        onChange={(e) =>
                          handleInputChange("meta_keywords", e.target.value)
                        }
                        placeholder="keyword1, keyword2, keyword3"
                      />
                      <FormHelperText>
                        Separate keywords with commas
                      </FormHelperText>
                    </FormControl>
                  </VStack>
                </CardBody>
              </MotionCard>

              {/* Custom Options */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.8 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="purple.50" py={4}>
                  <HStack>
                    <Icon as={FiSettings} color="purple.500" />
                    <Text fontWeight="medium" color="purple.800">
                      Custom Product Options
                    </Text>
                    {formData.custom_options.length > 0 && (
                      <Badge colorScheme="purple" variant="solid">
                        {formData.custom_options.length}
                      </Badge>
                    )}
                  </HStack>
                </CardHeader>
                <CardBody>
                  {/* <CustomOptionsForm
                    customOptions={formData.custom_options}
                    onCustomOptionsChange={handleCustomOptionsChange}
                  /> */}
                  <CustomOptionsForm
                    customOptions={formData.custom_options}
                    onCustomOptionsChange={handleCustomOptionsChange}
                    onOptionValueImageUpload={
                      handleCustomOptionValueImageUpload
                    }
                  />
                </CardBody>
              </MotionCard>

              {/* Product Services */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 0.9 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="teal.50" py={4}>
                  <HStack>
                    <Icon as={FiPackage} color="teal.500" />
                    <Text fontWeight="medium" color="teal.800">
                      Product Services
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <ProductServicesForm
                    companies={companies}
                    services={formData.services}
                    onServicesChange={handleServicesChange}
                  />
                </CardBody>
              </MotionCard>

              {/* Custom Details */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 1.0 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader bg="cyan.50" py={4}>
                  <HStack>
                    <Icon as={FiInfo} color="cyan.500" />
                    <Text fontWeight="medium" color="cyan.800">
                      Custom Details
                    </Text>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <CustomDetailsForm
                    customDetails={formData.custom_details}
                    onCustomDetailsChange={handleCustomDetailsChange}
                  />
                </CardBody>
              </MotionCard>

              {/* Submit Button */}
              <MotionCard
                {...slideUp}
                transition={{ delay: 1.1 }}
                bg={cardBg}
                borderRadius="xl"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardBody>
                  <Flex justify="center" pt={4}>
                    <Button
                      leftIcon={<FiSave />}
                      colorScheme="blue"
                      size="lg"
                      px={12}
                      py={6}
                      fontSize="md"
                      fontWeight="600"
                      borderRadius="xl"
                      onClick={handleSubmit}
                      isLoading={submitting}
                      loadingText="Updating Product..."
                      _hover={{
                        transform: "translateY(-2px)",
                        boxShadow: "xl",
                      }}
                      transition="all 0.2s"
                      isDisabled={!isFormValid()}
                    >
                      Update Product
                    </Button>
                  </Flex>
                </CardBody>
              </MotionCard>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default EditProductPage;
