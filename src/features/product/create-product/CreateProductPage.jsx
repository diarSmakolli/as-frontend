import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Checkbox,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Divider,
  Badge,
  useDisclosure,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  FormHelperText,
  FormErrorMessage,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiSave,
  FiHome,
  FiPackage,
  FiImage,
  FiDollarSign,
  FiSettings,
  FiTag,
  FiTool,
  FiInfo,
  FiGlobe,
  FiCheckCircle,
  FiShoppingCart,
} from "react-icons/fi";
import {
  productService,
  taxService,
  companyService,
  categoryService,
} from "../services/productService";
import { useAuth } from "../../administration/authContext/authContext";
import { usePreferences } from "../../administration/authContext/preferencesProvider";
import SidebarContent from "../../administration/layouts/SidebarContent";
import MobileNav from "../../administration/layouts/MobileNav";
import SettingsModal from "../../administration/components/settings/SettingsModal";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";
import Loader from "../../../commons/Loader";
import ImageUpload from "./components/ImageUpload";
import ProductServicesForm from "./components/ProductServicesForm";
import CategoriesSelector from "./components/CategoriesSelector";
import CustomDetailsForm from "./components/CustomDetailsForm";
import RichTextEditor from "./components/RichTextEditor";
import CustomOptionsForm from "./components/CustomOptionsForm";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const CreateProductPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { account, isLoading: isAuthLoading } = useAuth();
  const { currentTimezone } = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    short_description: "",
    weight: "",
    weight_unit: "kg",
    measures_unit: "cm",
    unit_type: "pcs",
    width: "",
    height: "",
    depth: "",
    thickness: "",
    length: "",
    lead_time: 5,
    purchase_price_nett: "",
    regular_price_nett: "",
    discount_percentage_nett: 0,
    tax_id: "",
    company_id: "",
    supplier_id: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    is_published: false,
    is_active: true,
    mark_as_featured: false,
    mark_as_new: false,
    mark_as_top_seller: false,
    shipping_free: false,
    is_physical: true,
    is_digital: false,
    is_on_sale: false,
    is_special_offer: false,
    is_available_on_stock: false,
    is_delivery_only: false,
    images: [],
    services: [],
    categories: [],
    custom_details: [],
    custom_options: [],

    min_order_quantity: 1,
    max_order_quantity: 9999,

    // ADD THESE NEW FIELDS:
    // Dimensional pricing configuration
    is_dimensional_pricing: false,
    dimensional_calculation_type: null,
    base_price_per_m2: 0,
    base_price_per_m3: 0,
    base_price_per_linear_meter: 0,
    base_price_per_meter: 0,
    premium_price_per_m2: 0,
    premium_price_per_m3: 0,
    premium_price_per_linear_meter: 0,
    premium_price_per_meter: 0,

    // Dimension constraints
    min_width: 0,
    max_width: 0,
    min_height: 0,
    max_height: 0,
    min_depth: 0,
    max_depth: 0,
    min_length: 0,
    max_length: 0,

    // Premium thresholds
    premium_width_from: 0,
    premium_width_to: 0,
    premium_height_from: 0,
    premium_height_to: 0,
    premium_depth_from: 0,
    premium_depth_to: 0,
    premium_length_from: 0,
    premium_length_to: 0,

    // Standard dimensions
    standard_width: 0,
    standard_height: 0,
    standard_depth: 0,
    standard_length: 0,
  });

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  };

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const [taxesResponse, companiesResponse, categoriesResponse] =
        await Promise.all([
          taxService.getAllTaxes(),
          companyService.getAllCompanies(),
          categoryService.getAllCategories(),
        ]);

      setTaxes(taxesResponse.data?.data?.taxes || []);
      setCompanies(companiesResponse.data?.data || []);

      const categoriesData =
        categoriesResponse.data?.data?.categories ||
        categoriesResponse.data?.categories ||
        categoriesResponse.data?.data ||
        [];

      setCategories(categoriesData);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({ ...prev, images }));
    if (errors.images) {
      setErrors((prev) => ({ ...prev, images: null }));
    }
  };

  const handleCustomOptionsChange = (customOptions) => {
    setFormData((prev) => ({
      ...prev,
      custom_options: customOptions,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title?.trim()) newErrors.title = "Product title is required";
    if (!formData.description?.trim())
      newErrors.description = "Product description is required";
    if (!formData.weight || formData.weight <= 0)
      newErrors.weight = "Valid weight is required";
    if (!formData.purchase_price_nett || formData.purchase_price_nett <= 0)
      newErrors.purchase_price_nett = "Valid purchase price is required";

    if (formData.min_order_quantity < 1) {
      newErrors.min_order_quantity =
        "Minimum order quantity must be at least 1";
    }
    if (formData.max_order_quantity < 1) {
      newErrors.max_order_quantity =
        "Maximum order quantity must be at least 1";
    }
    if (formData.min_order_quantity > formData.max_order_quantity) {
      newErrors.max_order_quantity =
        "Maximum order quantity must be greater than or equal to minimum order quantity";
    }

    if (!formData.tax_id) newErrors.tax_id = "Tax selection is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one product image is required";

    if (formData.is_dimensional_pricing) {
      if (!formData.dimensional_calculation_type) {
        newErrors.dimensional_calculation_type =
          "Calculation type is required when dimensional pricing is enabled";
      }

      // Check if at least one base price is set
      const hasPricing =
        formData.base_price_per_m2 > 0 ||
        formData.base_price_per_m3 > 0 ||
        formData.base_price_per_linear_meter > 0 ||
        formData.base_price_per_meter > 0;

      if (!hasPricing) {
        newErrors.dimensional_pricing =
          "At least one base price must be set for dimensional pricing";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        description: "Please fix the form errors before submitting",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => {
            formDataToSend.append("images", image);
          });
        } else if (
          key === "services" ||
          key === "categories" ||
          key === "custom_details" ||
          key === "custom_options"
        ) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (
          formData[key] !== "" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await productService.createProduct(formDataToSend);

      if (response.data?.status === "success") {
        toast({
          description: "Product created successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
        navigate("/products-console");
      }
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthLoading || loadingData) {
    return <Loader />;
  }

  return (
    <Box minH="100vh" bg="rgb(241,241,241)">
      <Box display={{ base: "none", md: "block" }}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
      </Box>
      {/* Mobile Sidebar: shown when menu is open */}
      <Box
        display={{ base: isSidebarOpen ? "block" : "none", md: "none" }}
        position="fixed"
        zIndex={999}
      >
        <SidebarContent
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Box>
      {/* MobileNav: always visible, passes menu toggle */}
      <MobileNav
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onOpen={() => setIsSidebarOpen(true)}
      />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <MotionBox ml={{ base: 0, md: 60 }} p={{ base: 4, md: 6 }} {...fadeIn}>
        <Breadcrumb fontSize="sm" color="gray.900" mb={6}>
          <BreadcrumbItem>
            <BreadcrumbLink as={Box} onClick={() => navigate("/")}>
              <Icon as={FiHome} mr={1} />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink as={Box} onClick={() => navigate("/products")}>
              <Icon as={FiPackage} mr={1} />
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="blue.400" fontWeight="medium">
              Create Product
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          mb={6}
          gap={{ base: 4, md: 0 }}
        >
          <VStack align="start" spacing={1}>
            <Heading
              size="lg"
              color="gray.900"
              fontWeight="600"
              fontSize={{ base: "md", md: "lg" }}
              noOfLines={1}
              maxW={{ base: "90vw", md: "unset" }}
            >
              Create New Product
            </Heading>
            <Text color="gray.600" fontSize={{ base: "xs", md: "md" }}>
              Add a new product to your inventory with all necessary details
            </Text>
          </VStack>
          <HStack spacing={3} w={{ base: "100%", md: "auto" }}>
            <Button
              leftIcon={<FiArrowLeft />}
              onClick={() => navigate("/products")}
              bg="gray.100"
              color="gray.700"
              _hover={{ bg: "gray.200" }}
              size="md"
              width={{ base: "50%", md: "auto" }}
              minW={0}
            >
              Back to Products
            </Button>
            <Button
              leftIcon={<FiSave />}
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="Creating Product..."
              bg="blue.500"
              color="white"
              _hover={{ bg: "blue.600" }}
              size="md"
              width={{ base: "50%", md: "auto" }}
              minW={0}
            >
              Create Product
            </Button>
          </HStack>
        </Flex>

        <VStack spacing={6} align="stretch">
          <MotionCard
            bg="white"
            borderColor="gray.200"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
            {...slideUp}
          >
            <CardHeader bg="gray.50" py={4}>
              <HStack>
                <Icon as={FiInfo} color="blue.500" />
                <Heading size="md" color="gray.900" fontWeight="500">
                  Basic Information
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Product Title *
                  </FormLabel>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter product title"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.tax_id}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Tax Rate *
                  </FormLabel>
                  <Select
                    value={formData.tax_id}
                    onChange={(e) =>
                      handleInputChange("tax_id", e.target.value)
                    }
                    placeholder="Select tax rate"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  >
                    {taxes.map((tax) => (
                      <option key={tax.id} value={tax.id}>
                        {tax.name} ({tax.rate}%)
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.tax_id}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6}>
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Company (Optional)
                  </FormLabel>
                  <Select
                    value={formData.company_id}
                    onChange={(e) =>
                      handleInputChange("company_id", e.target.value)
                    }
                    placeholder="Select company"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.business_name || company.name}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>
                    Company that owns this product
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Supplier (Optional)
                  </FormLabel>
                  <Select
                    value={formData.supplier_id}
                    onChange={(e) =>
                      handleInputChange("supplier_id", e.target.value)
                    }
                    placeholder="Select supplier"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.business_name || company.name}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>
                    Company that supplies this product
                  </FormHelperText>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={6} isInvalid={!!errors.description}>
                <FormLabel color="gray.700" fontWeight="500">
                  Product Description *
                </FormLabel>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Enter detailed product description with formatting..."
                  minHeight="250px"
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
                <FormHelperText>
                  Use the toolbar to format your description with headings,
                  lists, links, and more
                </FormHelperText>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel color="gray.700" fontWeight="500">
                  Short Description
                </FormLabel>
                <Textarea
                  value={formData.short_description}
                  onChange={(e) =>
                    handleInputChange("short_description", e.target.value)
                  }
                  placeholder="Enter brief product description (plain text)"
                  rows={2}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px #3182ce",
                  }}
                />
                <FormHelperText>
                  Plain text summary used for previews and search results
                </FormHelperText>
              </FormControl>
            </CardBody>
          </MotionCard>

          <MotionCard
            bg="white"
            borderColor="gray.200"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
            {...slideUp}
            transition={{ delay: 0.1 }}
          >
            <CardHeader bg="gray.50" py={4}>
              <HStack>
                <Icon as={FiImage} color="blue.500" />
                <Heading size="md" color="gray.900" fontWeight="500">
                  Product Images *
                </Heading>
                <Badge colorScheme="red" variant="subtle">
                  Required
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <ImageUpload onImagesChange={handleImagesChange} />
              {errors.images && (
                <Alert status="error" mt={4} borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>{errors.images}</AlertDescription>
                </Alert>
              )}
            </CardBody>
          </MotionCard>

          <MotionCard
            bg="white"
            borderColor="gray.200"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
            {...slideUp}
            transition={{ delay: 0.2 }}
          >
            <Accordion allowMultiple defaultIndex={[0, 1]}>
              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiPackage} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Physical Properties & Dimensions
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
                    <FormControl isInvalid={!!errors.weight}>
                      <FormLabel color="gray.700" fontWeight="500">
                        Weight *
                      </FormLabel>
                      <NumberInput
                        value={formData.weight}
                        onChange={(value) => handleInputChange("weight", value)}
                        min={0}
                        precision={2}
                      >
                        <NumberInputField
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>{errors.weight}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="500">
                        Weight Unit
                      </FormLabel>
                      <Select
                        value={formData.weight_unit}
                        onChange={(e) =>
                          handleInputChange("weight_unit", e.target.value)
                        }
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      >
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="oz">Ounces (oz)</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="500">
                        Unit Type
                      </FormLabel>
                      <Select
                        value={formData.unit_type}
                        onChange={(e) =>
                          handleInputChange("unit_type", e.target.value)
                        }
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      >
                        <option value="pcs">Pieces</option>
                        <option value="pack">Pack</option>
                        <option value="box">Box</option>
                        <option value="m2">Square Meter (m²)</option>
                        <option value="m3">Cubic Meter (m³)</option>
                        <option value="linear-meter">Linear Meter</option>
                        <option value="meter">Meter</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>

                  <FormControl mb={6}>
                    <FormLabel color="gray.700" fontWeight="500">
                      Measures Unit
                    </FormLabel>
                    <Select
                      value={formData.measures_unit}
                      onChange={(e) =>
                        handleInputChange("measures_unit", e.target.value)
                      }
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px #3182ce",
                      }}
                      maxW="200px"
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="mm">Millimeters (mm)</option>
                      <option value="inches">Inches</option>
                      <option value="feet">Feet</option>
                    </Select>
                    <FormHelperText>
                      Unit for all dimension measurements
                    </FormHelperText>
                  </FormControl>

                  <Text color="gray.700" fontWeight="500" mb={4}>
                    Dimensions (Optional)
                  </Text>
                  <SimpleGrid columns={{ base: 2, md: 5 }} spacing={4}>
                    {["width", "height", "depth", "length", "thickness"].map(
                      (dimension) => (
                        <FormControl key={dimension}>
                          <FormLabel
                            color="gray.600"
                            fontSize="sm"
                            textTransform="capitalize"
                          >
                            {dimension} ({formData.measures_unit})
                          </FormLabel>
                          <NumberInput
                            value={formData[dimension]}
                            onChange={(value) =>
                              handleInputChange(dimension, value)
                            }
                            min={0}
                            precision={2}
                          >
                            <NumberInputField
                              bg="gray.50"
                              border="1px"
                              borderColor="gray.200"
                              _hover={{ borderColor: "gray.300" }}
                              _focus={{
                                borderColor: "blue.400",
                                boxShadow: "0 0 0 1px #3182ce",
                              }}
                            />
                          </NumberInput>
                        </FormControl>
                      )
                    )}
                  </SimpleGrid>

                  <FormControl mt={4}>
                    <FormLabel color="gray.700" fontWeight="500">
                      Lead Time (days)
                    </FormLabel>
                    <NumberInput
                      value={formData.lead_time}
                      onChange={(value) =>
                        handleInputChange("lead_time", value)
                      }
                      min={0}
                      max={365}
                    >
                      <NumberInputField
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                      Number of days required to fulfill orders
                    </FormHelperText>
                  </FormControl>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiDollarSign} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Pricing & Discounts
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <FormControl isInvalid={!!errors.purchase_price_nett}>
                      <FormLabel color="gray.700" fontWeight="500">
                        Purchase Price (Net) *
                      </FormLabel>
                      <NumberInput
                        value={formData.purchase_price_nett}
                        onChange={(value) =>
                          handleInputChange("purchase_price_nett", value)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.purchase_price_nett}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.regular_price_nett}>
                      <FormLabel color="gray.700" fontWeight="500">
                        Regular Price (Net) *
                      </FormLabel>
                      <NumberInput
                        value={formData.regular_price_nett}
                        onChange={(value) =>
                          handleInputChange("regular_price_nett", value)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.regular_price_nett}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="500">
                        Discount (%)
                      </FormLabel>
                      <NumberInput
                        value={formData.discount_percentage_nett}
                        onChange={(value) =>
                          handleInputChange("discount_percentage_nett", value)
                        }
                        min={0}
                        max={100}
                        precision={2}
                      >
                        <NumberInputField
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>
                        Percentage discount from regular price
                      </FormHelperText>
                    </FormControl>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiShoppingCart} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Inventory & Order Management
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isInvalid={!!errors.min_order_quantity}>
                      <FormLabel color="gray.700" fontWeight="500">
                        Minimum Order Quantity *
                      </FormLabel>
                      <NumberInput
                        value={formData.min_order_quantity}
                        onChange={(value) =>
                          handleInputChange(
                            "min_order_quantity",
                            parseInt(value) || 1
                          )
                        }
                        min={1}
                        max={9999}
                      >
                        <NumberInputField
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.min_order_quantity}
                      </FormErrorMessage>
                      <FormHelperText>
                        Minimum number of units customers can order
                      </FormHelperText>
                    </FormControl>

                    <FormControl isInvalid={!!errors.max_order_quantity}>
                      <FormLabel color="gray.700" fontWeight="500">
                        Maximum Order Quantity *
                      </FormLabel>
                      <NumberInput
                        value={formData.max_order_quantity}
                        onChange={(value) =>
                          handleInputChange(
                            "max_order_quantity",
                            parseInt(value) || 9999
                          )
                        }
                        min={1}
                        max={999999}
                      >
                        <NumberInputField
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{
                            borderColor: "blue.400",
                            boxShadow: "0 0 0 1px #3182ce",
                          }}
                        />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {errors.max_order_quantity}
                      </FormErrorMessage>
                      <FormHelperText>
                        Maximum number of units customers can order
                      </FormHelperText>
                    </FormControl>
                  </SimpleGrid>

                  <Alert status="info" mt={4} size="sm">
                    <AlertIcon />
                    <AlertDescription>
                      Order quantity limits help manage inventory and shipping
                      constraints. Maximum quantity must be greater than or
                      equal to minimum quantity.
                    </AlertDescription>
                  </Alert>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiSettings} color="green.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Dimensional Pricing Configuration
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <VStack spacing={6} align="stretch">
                    {/* Enable Dimensional Pricing */}
                    <FormControl display="flex" alignItems="center">
                      <FormLabel
                        htmlFor="is_dimensional_pricing"
                        mb="0"
                        mr={3}
                        color="gray.700"
                      >
                        Enable Dimensional Pricing
                      </FormLabel>
                      <Switch
                        id="is_dimensional_pricing"
                        colorScheme="green"
                        isChecked={formData.is_dimensional_pricing}
                        onChange={(e) =>
                          handleInputChange(
                            "is_dimensional_pricing",
                            e.target.checked
                          )
                        }
                      />
                    </FormControl>

                    {formData.is_dimensional_pricing && (
                      <>
                        <FormControl>
                          <FormLabel color="gray.700" fontWeight="500">
                            Calculation Type
                          </FormLabel>
                          <Select
                            value={formData.dimensional_calculation_type || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "dimensional_calculation_type",
                                e.target.value || null
                              )
                            }
                            placeholder="Select calculation method"
                            bg="gray.50"
                            border="1px"
                            borderColor="gray.200"
                          >
                            <option value="m2">Per Square Meter (m²)</option>
                            <option value="m3">Per Cubic Meter (m³)</option>
                            <option value="linear-meter">
                              Per Linear Meter
                            </option>
                            <option value="meter">Per Meter</option>
                          </Select>
                          <FormHelperText>
                            How the price should be calculated based on
                            dimensions
                          </FormHelperText>
                        </FormControl>

                        <Box>
                          <Text fontWeight="500" color="gray.700" mb={3}>
                            Base Pricing *
                          </Text>

                          {formData.dimensional_calculation_type === "m2" && (
                            <FormControl isRequired>
                              <FormLabel fontSize="sm" color="red.500">
                                Base Price per m² *
                              </FormLabel>
                              <NumberInput
                                value={formData.base_price_per_m2}
                                onChange={(value) =>
                                  handleInputChange(
                                    "base_price_per_m2",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Price per square meter
                              </FormHelperText>
                            </FormControl>
                          )}

                          {formData.dimensional_calculation_type === "m3" && (
                            <FormControl isRequired>
                              <FormLabel fontSize="sm" color="red.500">
                                Base Price per m³ *
                              </FormLabel>
                              <NumberInput
                                value={formData.base_price_per_m3}
                                onChange={(value) =>
                                  handleInputChange(
                                    "base_price_per_m3",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Price per cubic meter
                              </FormHelperText>
                            </FormControl>
                          )}

                          {formData.dimensional_calculation_type ===
                            "linear-meter" && (
                            <FormControl isRequired>
                              <FormLabel fontSize="sm" color="red.500">
                                Base Price per Linear Meter *
                              </FormLabel>
                              <NumberInput
                                value={formData.base_price_per_linear_meter}
                                onChange={(value) =>
                                  handleInputChange(
                                    "base_price_per_linear_meter",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Price per linear meter (perimeter)
                              </FormHelperText>
                            </FormControl>
                          )}

                          {formData.dimensional_calculation_type ===
                            "meter" && (
                            <FormControl isRequired>
                              <FormLabel fontSize="sm" color="red.500">
                                Base Price per Meter *
                              </FormLabel>
                              <NumberInput
                                value={formData.base_price_per_meter}
                                onChange={(value) =>
                                  handleInputChange(
                                    "base_price_per_meter",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Price per meter (length)
                              </FormHelperText>
                            </FormControl>
                          )}

                          {!formData.dimensional_calculation_type && (
                            <Alert status="info" size="sm">
                              <AlertIcon />
                              <AlertDescription>
                                Select a calculation type above to set base
                                pricing.
                              </AlertDescription>
                            </Alert>
                          )}
                        </Box>

                        <Box>
                          <Text fontWeight="500" color="gray.700" mb={3}>
                            Premium Pricing (Optional)
                          </Text>

                          {formData.dimensional_calculation_type === "m2" && (
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.700">
                                Premium Price per m²
                              </FormLabel>
                              <NumberInput
                                value={formData.premium_price_per_m2}
                                onChange={(value) =>
                                  handleInputChange(
                                    "premium_price_per_m2",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Additional premium charge per square meter
                              </FormHelperText>
                            </FormControl>
                          )}

                          {formData.dimensional_calculation_type === "m3" && (
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.700">
                                Premium Price per m³
                              </FormLabel>
                              <NumberInput
                                value={formData.premium_price_per_m3}
                                onChange={(value) =>
                                  handleInputChange(
                                    "premium_price_per_m3",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Additional premium charge per cubic meter
                              </FormHelperText>
                            </FormControl>
                          )}

                          {formData.dimensional_calculation_type ===
                            "linear-meter" && (
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.700">
                                Premium Price per Linear Meter
                              </FormLabel>
                              <NumberInput
                                value={formData.premium_price_per_linear_meter}
                                onChange={(value) =>
                                  handleInputChange(
                                    "premium_price_per_linear_meter",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Additional premium charge per linear meter
                                (perimeter)
                              </FormHelperText>
                            </FormControl>
                          )}

                          {formData.dimensional_calculation_type ===
                            "meter" && (
                            <FormControl>
                              <FormLabel fontSize="sm" color="gray.700">
                                Premium Price per Meter
                              </FormLabel>
                              <NumberInput
                                value={formData.premium_price_per_meter}
                                onChange={(value) =>
                                  handleInputChange(
                                    "premium_price_per_meter",
                                    parseFloat(value) || 0
                                  )
                                }
                                min={0}
                                precision={2}
                              >
                                <NumberInputField bg="gray.50" />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormHelperText>
                                Additional premium charge per meter (length)
                              </FormHelperText>
                            </FormControl>
                          )}

                          {!formData.dimensional_calculation_type && (
                            <Alert status="info" size="sm">
                              <AlertIcon />
                              <AlertDescription>
                                Select a calculation type above to set premium
                                pricing.
                              </AlertDescription>
                            </Alert>
                          )}
                        </Box>

                        <Box>
                          <Text fontWeight="500" color="gray.700" mb={3}>
                            Premium Pricing Thresholds (Optional)
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={4}>
                            Define dimension ranges that trigger premium
                            pricing. When customer dimensions fall within these
                            ranges, premium pricing will be applied.
                          </Text>

                          {/* For m² calculation - show width and height */}
                          {formData.dimensional_calculation_type === "m2" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={6}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Width Premium Range ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_width_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_width_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_width_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_width_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Height Premium Range ({formData.measures_unit}
                                  )
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_height_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_height_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_height_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_height_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {/* For m³ calculation - show width, height, and depth */}
                          {formData.dimensional_calculation_type === "m3" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 3 }}
                              spacing={6}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Width Premium Range ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_width_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_width_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_width_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_width_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Height Premium Range ({formData.measures_unit}
                                  )
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_height_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_height_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_height_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_height_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Depth Premium Range ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_depth_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_depth_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_depth_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_depth_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {/* For linear-meter calculation - show width and height */}
                          {formData.dimensional_calculation_type ===
                            "linear-meter" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={6}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Width Premium Range ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_width_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_width_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_width_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_width_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Height Premium Range ({formData.measures_unit}
                                  )
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_height_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_height_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_height_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_height_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {/* For meter calculation - show only length */}
                          {formData.dimensional_calculation_type ===
                            "meter" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 1 }}
                              spacing={6}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.600"
                                  fontWeight="500"
                                >
                                  Length Premium Range ({formData.measures_unit}
                                  )
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.premium_length_from}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_length_from",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="From"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.premium_length_to}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "premium_length_to",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="To"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {!formData.dimensional_calculation_type && (
                            <Alert status="info" size="sm">
                              <AlertIcon />
                              <AlertDescription>
                                Select a calculation type above to set premium
                                pricing thresholds for relevant dimensions.
                              </AlertDescription>
                            </Alert>
                          )}

                          <Alert status="info" mt={4} size="sm">
                            <AlertIcon />
                            <AlertDescription>
                              Premium pricing will be applied when customer
                              dimensions fall within these ranges. Leave empty
                              to disable premium pricing for that dimension.
                            </AlertDescription>
                          </Alert>
                        </Box>

                        <Box>
                          <Text fontWeight="500" color="gray.700" mb={3}>
                            Dimension Constraints
                          </Text>
                          <Text fontSize="sm" color="gray.600" mb={4}>
                            Set minimum and maximum dimension limits for
                            customer orders based on your calculation type.
                          </Text>

                          {/* For m² calculation - show width and height */}
                          {formData.dimensional_calculation_type === "m2" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Width Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_width}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_width",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_width}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_width",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Height Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_height}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_height",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_height}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_height",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {/* For m³ calculation - show width, height, and depth */}
                          {formData.dimensional_calculation_type === "m3" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 3 }}
                              spacing={4}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Width Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_width}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_width",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_width}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_width",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Height Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_height}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_height",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_height}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_height",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Depth Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_depth}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_depth",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_depth}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_depth",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {/* For linear-meter calculation - show width and height */}
                          {formData.dimensional_calculation_type ===
                            "linear-meter" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Width Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_width}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_width",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_width}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_width",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>

                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Height Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_height}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_height",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_height}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_height",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {/* For meter calculation - show only length */}
                          {formData.dimensional_calculation_type ===
                            "meter" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 1 }}
                              spacing={4}
                            >
                              <VStack align="stretch" spacing={2}>
                                <Text fontSize="sm" color="gray.600">
                                  Length Limits ({formData.measures_unit})
                                </Text>
                                <HStack>
                                  <NumberInput
                                    value={formData.min_length}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "min_length",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Min"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                  <Text>to</Text>
                                  <NumberInput
                                    value={formData.max_length}
                                    onChange={(value) =>
                                      handleInputChange(
                                        "max_length",
                                        parseFloat(value) || 0
                                      )
                                    }
                                    min={0}
                                    precision={2}
                                    size="sm"
                                  >
                                    <NumberInputField
                                      placeholder="Max"
                                      bg="gray.50"
                                    />
                                  </NumberInput>
                                </HStack>
                              </VStack>
                            </SimpleGrid>
                          )}

                          {!formData.dimensional_calculation_type && (
                            <Alert status="info" size="sm">
                              <AlertIcon />
                              <AlertDescription>
                                Select a calculation type above to set dimension
                                constraints for relevant dimensions.
                              </AlertDescription>
                            </Alert>
                          )}

                          <Alert status="info" mt={4} size="sm">
                            <AlertIcon />
                            <AlertDescription>
                              Set limits to prevent customers from ordering
                              dimensions outside your production capabilities.
                            </AlertDescription>
                          </Alert>
                        </Box>

                        <Box>
                          <Text fontWeight="500" color="gray.700" mb={3}>
                            Standard Dimensions (Required for Price Calculation)
                          </Text>

                          {formData.dimensional_calculation_type === "m2" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                            >
                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Width ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_width}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_width",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                                <FormHelperText>
                                  Required for m² calculation
                                </FormHelperText>
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Height ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_height}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_height",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                                <FormHelperText>
                                  Required for m² calculation
                                </FormHelperText>
                              </FormControl>
                            </SimpleGrid>
                          )}

                          {formData.dimensional_calculation_type === "m3" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 3 }}
                              spacing={4}
                            >
                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Width ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_width}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_width",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Height ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_height}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_height",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Depth ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_depth}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_depth",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                              </FormControl>
                            </SimpleGrid>
                          )}

                          {formData.dimensional_calculation_type ===
                            "linear-meter" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                            >
                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Width ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_width}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_width",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                                <FormHelperText>
                                  Used for perimeter calculation
                                </FormHelperText>
                              </FormControl>

                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Height ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_height}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_height",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                                <FormHelperText>
                                  Used for perimeter calculation
                                </FormHelperText>
                              </FormControl>
                            </SimpleGrid>
                          )}

                          {formData.dimensional_calculation_type ===
                            "meter" && (
                            <SimpleGrid
                              columns={{ base: 1, md: 1 }}
                              spacing={4}
                            >
                              <FormControl isRequired>
                                <FormLabel fontSize="sm" color="red.500">
                                  Standard Length ({formData.measures_unit}) *
                                </FormLabel>
                                <NumberInput
                                  value={formData.standard_length}
                                  onChange={(value) =>
                                    handleInputChange(
                                      "standard_length",
                                      parseFloat(value) || 0
                                    )
                                  }
                                  min={0}
                                  precision={2}
                                >
                                  <NumberInputField bg="gray.50" />
                                </NumberInput>
                                <FormHelperText>
                                  Required for meter calculation
                                </FormHelperText>
                              </FormControl>
                            </SimpleGrid>
                          )}

                          {!formData.dimensional_calculation_type && (
                            <Alert status="info" size="sm">
                              <AlertIcon />
                              <AlertDescription>
                                Select a calculation type above to see required
                                standard dimensions.
                              </AlertDescription>
                            </Alert>
                          )}
                        </Box>
                      </>
                    )}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiGlobe} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      SEO & Meta Information
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="500">
                        Meta Title
                      </FormLabel>
                      <Input
                        value={formData.meta_title}
                        onChange={(e) =>
                          handleInputChange("meta_title", e.target.value)
                        }
                        placeholder="SEO title for search engines"
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      />
                      <FormHelperText>
                        Recommended: 50-60 characters
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="500">
                        Meta Description
                      </FormLabel>
                      <Textarea
                        value={formData.meta_description}
                        onChange={(e) =>
                          handleInputChange("meta_description", e.target.value)
                        }
                        placeholder="Brief description for search engine results"
                        rows={3}
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      />
                      <FormHelperText>
                        Recommended: 150-160 characters
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel color="gray.700" fontWeight="500">
                        Meta Keywords
                      </FormLabel>
                      <Input
                        value={formData.meta_keywords}
                        onChange={(e) =>
                          handleInputChange("meta_keywords", e.target.value)
                        }
                        placeholder="keyword1, keyword2, keyword3"
                        bg="gray.50"
                        border="1px"
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.300" }}
                        _focus={{
                          borderColor: "blue.400",
                          boxShadow: "0 0 0 1px #3182ce",
                        }}
                      />
                      <FormHelperText>
                        Separate keywords with commas
                      </FormHelperText>
                    </FormControl>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiTag} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Categories
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <CategoriesSelector
                    categories={categories}
                    selectedCategories={formData.categories}
                    onCategoriesChange={(categories) =>
                      handleInputChange("categories", categories)
                    }
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiTool} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Product Services
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <ProductServicesForm
                    companies={companies}
                    services={formData.services}
                    onServicesChange={(services) =>
                      handleInputChange("services", services)
                    }
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiSettings} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Custom Details
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <CustomDetailsForm
                    customDetails={formData.custom_details}
                    onCustomDetailsChange={(details) =>
                      handleInputChange("custom_details", details)
                    }
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiSettings} color="purple.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Custom Options
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <CustomOptionsForm
                    customOptions={formData.custom_options}
                    onCustomOptionsChange={handleCustomOptionsChange}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                  <HStack flex="1" textAlign="left">
                    <Icon as={FiSettings} color="blue.500" />
                    <Heading size="md" color="gray.900" fontWeight="500">
                      Publication & Settings
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={6}>
                  <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                    <VStack align="stretch" spacing={4}>
                      <Text color="gray.700" fontWeight="500">
                        Publication Settings
                      </Text>
                      <HStack justify="space-between">
                        <Text color="gray.600">Published</Text>
                        <Switch
                          isChecked={formData.is_published}
                          onChange={(e) =>
                            handleInputChange("is_published", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Active</Text>
                        <Switch
                          isChecked={formData.is_active}
                          onChange={(e) =>
                            handleInputChange("is_active", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Available in Stock</Text>
                        <Switch
                          isChecked={formData.is_available_on_stock}
                          onChange={(e) =>
                            handleInputChange(
                              "is_available_on_stock",
                              e.target.checked
                            )
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <Text color="gray.700" fontWeight="500">
                        Marketing Flags
                      </Text>
                      <HStack justify="space-between">
                        <Text color="gray.600">Featured Product</Text>
                        <Switch
                          isChecked={formData.mark_as_featured}
                          onChange={(e) =>
                            handleInputChange(
                              "mark_as_featured",
                              e.target.checked
                            )
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">New Product</Text>
                        <Switch
                          isChecked={formData.mark_as_new}
                          onChange={(e) =>
                            handleInputChange("mark_as_new", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Top Seller</Text>
                        <Switch
                          isChecked={formData.mark_as_top_seller}
                          onChange={(e) =>
                            handleInputChange(
                              "mark_as_top_seller",
                              e.target.checked
                            )
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">On Sale</Text>
                        <Switch
                          isChecked={formData.is_on_sale}
                          onChange={(e) =>
                            handleInputChange("is_on_sale", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>

                    <VStack align="stretch" spacing={4}>
                      <Text color="gray.700" fontWeight="500">
                        Product Type & Shipping
                      </Text>
                      <HStack justify="space-between">
                        <Text color="gray.600">Physical Product</Text>
                        <Switch
                          isChecked={formData.is_physical}
                          onChange={(e) =>
                            handleInputChange("is_physical", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Digital Product</Text>
                        <Switch
                          isChecked={formData.is_digital}
                          onChange={(e) =>
                            handleInputChange("is_digital", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Free Shipping</Text>
                        <Switch
                          isChecked={formData.shipping_free}
                          onChange={(e) =>
                            handleInputChange("shipping_free", e.target.checked)
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Delivery Only</Text>
                        <Switch
                          isChecked={formData.is_delivery_only}
                          onChange={(e) =>
                            handleInputChange(
                              "is_delivery_only",
                              e.target.checked
                            )
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                      <HStack justify="space-between">
                        <Text color="gray.600">Special Offer</Text>
                        <Switch
                          isChecked={formData.is_special_offer}
                          onChange={(e) =>
                            handleInputChange(
                              "is_special_offer",
                              e.target.checked
                            )
                          }
                          colorScheme="blue"
                        />
                      </HStack>
                    </VStack>
                  </SimpleGrid>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </MotionCard>
        </VStack>

        <Box
          position="fixed"
          bottom={0}
          left={{ base: 0, md: 60 }}
          right={0}
          bg="white"
          borderTop="1px"
          borderColor="gray.200"
          p={4}
          zIndex={10}
          boxShadow="0 -2px 10px rgba(0,0,0,0.1)"
        >
          <Flex justify="space-between" align="center" maxW="6xl" mx="auto">
            <HStack spacing={2}>
              <Icon as={FiCheckCircle} color="gray.400" />
              <Text color="gray.600" fontSize="sm">
                {Object.keys(errors).length === 0
                  ? "Form is valid"
                  : `${Object.keys(errors).length} errors to fix`}
              </Text>
            </HStack>
            <HStack spacing={3}>
              <Button
                onClick={() => navigate("/products")}
                variant="ghost"
                color="gray.600"
                _hover={{ bg: "gray.100" }}
              >
                Cancel
              </Button>
              <Button
                leftIcon={<FiSave />}
                onClick={handleSubmit}
                isLoading={loading}
                loadingText="Creating..."
                bg="blue.500"
                color="white"
                _hover={{ bg: "blue.600" }}
                _disabled={{ opacity: 0.6 }}
              >
                Create Product
              </Button>
            </HStack>
          </Flex>
        </Box>

        <Box pb={20} />
      </MotionBox>
    </Box>
  );
};

export default CreateProductPage;
