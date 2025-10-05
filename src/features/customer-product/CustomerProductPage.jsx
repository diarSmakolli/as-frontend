import React from "react";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { homeService } from "../home/services/homeService";
import { useState } from "react";
import { useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Card,
  CardBody,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  GridItem,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Select,
  Textarea,
  Switch,
  FormControl,
  FormLabel,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AspectRatio,
  useToast,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Alert,
  AlertIcon,
  Spinner,
  FormHelperText,
} from "@chakra-ui/react";
import Logo from "../../assets/logo-as.png";
import {
  FaStar,
  FaShare,
  FaShippingFast,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaBox,
  FaChevronDown,
  FaChevronRight as FaChevronRightIcon,
  FaTags,
  FaClock,
  FaFire,
  FaBell,
  FaPercent,
  FaHotjar,
  FaGift,
  FaCube,
  FaImage,
  FaGamepad,
  FaHome,
  FaTshirt,
  FaBaby,
  FaLaptop,
  FaCar,
  FaCheck,
  FaUtensils,
  FaCamera,
  FaDumbbell,
  FaMusic,
  FaPalette,
  FaHandsHelping,
  FaBoxTissue,
  FaComments,
  FaUser,
  FaChevronUp,
  FaTimes,
  FaPlus,
  FaMinus,
  FaExpand,
} from "react-icons/fa";
import Footer from "../../shared-customer/components/Footer";
import MobileCategoryNavigation from "../../shared-customer/components/MobileCategoryNavigation";
import ExploreAll from "../../shared-customer/components/ExploreAll";
import { useRef } from "react";
import RecommendedProducts from "./RecommendedProducts";
import Navbar from "../../shared-customer/components/Navbar";
import { customToastContainerStyle } from "../../commons/toastStyles";
import { useCustomerAuth } from "../customer-account/auth-context/customerAuthContext";
// import CuisineConfigurator from "./CuisineConfigurator";

function CustomerProductPage() {
  const { slug } = useParams();
  const { customer } = useCustomerAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [productServices, setProductServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [topCategories, setTopCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedCustomOptions, setSelectedCustomOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredNestedPath, setHoveredNestedPath] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const DESCRIPTION_LINE_LIMIT = 5;
  const descriptionRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isCustomDetailsModalOpen, setIsCustomDetailsModalOpen] =
    useState(false);
  const aboutRef = useRef(null);
  const imageBoxRef = useRef(null);
  const [imageBoxOffset, setImageBoxOffset] = useState(24);
  const [is360Mode, setIs360Mode] = useState(false);
  const [customDimensions, setCustomDimensions] = useState({
    width: null,
    height: null,
    depth: null,
    length: null,
  });
  const [pricingData, setPricingData] = useState(null);
  const [pricingConfig, setPricingConfig] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationError, setCalculationError] = useState(null);
  const debounceTimeoutRef = useRef(null);
  const lastCalculationRef = useRef(null);
  const [localDimensions, setLocalDimensions] = useState({
    width: null,
    height: null,
    depth: null,
    length: null,
  });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });
  const BIGBUY_SUPPLIER_ID = "a61270fa-aca5-43e0-9be0-9cb0a7065f1d";

  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
  }, [slug]);

  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = Math.abs(touchStart.y - touchEnd.y);

    if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > 50) {
      if (distanceX > 0) {
        handleCarouselSwipe("right");
      } else {
        handleCarouselSwipe("left");
      }
    }

    setTouchStart({ x: 0, y: 0 });
    setTouchEnd({ x: 0, y: 0 });
  };

  const debouncedCalculatePricing = useCallback(
    (dimensions, options, qty) => {
      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout for 800ms (adjust as needed)
      debounceTimeoutRef.current = setTimeout(() => {
        const calculationId = Date.now();
        lastCalculationRef.current = calculationId;

        calculatePricing(dimensions, options, qty, calculationId);
      }, 800); // Wait 800ms after user stops typing
    },
    [product?.id, pricingConfig]
  );

  const calculatePricing = async (
    dimensions = customDimensions,
    options = selectedCustomOptions,
    qty = quantity,
    calculationId = null
  ) => {
    if (!product?.id) return;

    setIsCalculating(true);
    setCalculationError("");

    try {
      const config = {
        dimensions,
        selectedOptions: homeService.formatSelectedOptionsForAPI(options),
        quantity: qty,
      };


      const response = await homeService.calculateProductPricing(
        product.id,
        config
      );

      // ✅ RACE CONDITION CHECK: Only update if this is the latest calculation
      if (calculationId && lastCalculationRef.current !== calculationId) {
        return;
      }

      if (response.success) {
        setPricingData(response);
      }
    } catch (error) {
      // ✅ Only show error for latest calculation
      if (!calculationId || lastCalculationRef.current === calculationId) {
        setPricingConfig(null);
        setPricingData(null);
        setCalculationError("Failed to calculate pricing. Please try again.");
      }
    } finally {
      // ✅ Only update loading state for latest calculation
      if (!calculationId || lastCalculationRef.current === calculationId) {
        setIsCalculating(false);
      }
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numericValue = parseFloat(value) || null;

    // Update local state immediately for UI responsiveness
    setLocalDimensions((prev) => ({
      ...prev,
      [dimension]: numericValue,
    }));

    // Update actual state for calculations
    setCustomDimensions((prev) => {
      const newDimensions = {
        ...prev,
        [dimension]: numericValue,
      };

      // Trigger debounced calculation
      debouncedCalculatePricing(newDimensions, selectedCustomOptions, quantity);

      return newDimensions;
    });
  };

  // ✅ CLEANUP: Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // ✅ SYNC: Initialize local dimensions when customDimensions changes from other sources
  useEffect(() => {
    setLocalDimensions(customDimensions);
  }, [customDimensions]);

  useEffect(() => {
    if (descriptionRef.current) {
      const el = descriptionRef.current;
      setIsTruncated(el.scrollHeight > el.clientHeight);
    }
  }, [product?.description, showFullDescription]);

  const {
    isOpen: isCategoryOpen,
    onOpen: onCategoryOpen,
    onClose: onCategoryClose,
  } = useDisclosure();

  const {
    isOpen: isMobileCategoryOpen,
    onOpen: onMobileCategoryOpen,
    onClose: onMobileCategoryClose,
  } = useDisclosure();

  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure();

  function normalizeProduct(raw) {
    if (!raw) return null;
    const images = {
      main_image: {
        url: raw.main_image_url || (raw.images?.[0]?.url ?? ""),
        alt_text: raw.title,
      },
      gallery: (raw.images || []).map((img) => ({
        url: img.url,
        alt_text: img.alt_text || raw.title,
      })),
    };
    const categories = raw.categories || [];
    const custom_details = raw.custom_details || [];
    const custom_options = raw.custom_options || [];
    const product_services = raw.product_services || [];
    const company = raw.company || {};
    const supplier = raw.supplier || {};
    const tax = raw.tax || {};
    const pricing = {
      regular_price: {
        gross: raw.regular_price_gross,
        nett: raw.regular_price_nett,
      },
      final_price: { gross: raw.final_price_gross, nett: raw.final_price_nett },
      purchase_price: {
        gross: raw.purchase_price_gross,
        nett: raw.purchase_price_nett,
      },
      is_discounted: raw.is_discounted,
      discount: {
        percentage_nett: raw.discount_percentage_nett,
        percentage_gross: raw.discount_percentage_gross,
        amount_gross:
          raw.regular_price_gross && raw.final_price_gross
            ? raw.regular_price_gross - raw.final_price_gross
            : 0,
        is_discounted: raw.is_discounted,
      },
      tax_info: { tax_rate: tax.rate },
    };

    // Physical
    const physical_specifications = {
      weight: { value: raw.weight, unit: raw.weight_unit },
      dimensions: {
        width: raw.width,
        height: raw.height,
        length: raw.length,
        thickness: raw.thickness,
        depth: raw.depth,
        unit: raw.measures_unit,
      },
    };

    // Availability
    const availability = { lead_time: raw.lead_time };
    // Analytics (dummy for now)
    const analytics = { rating: 0, reviews_count: 0 };
    // Badges
    const badges = {
      is_new: raw.mark_as_new,
      is_on_sale: raw.is_on_sale,
      free_shipping: raw.shipping_free,
    };
    // Seller (use company as fallback)
    const seller = raw.company || {};
    return {
      ...raw,
      images,
      categories,
      custom_details,
      custom_options,
      product_services,
      company,
      supplier,
      tax,
      pricing,
      physical_specifications,
      availability,
      analytics,
      badges,
      seller,
    };
  }

  const fetchPricingConfig = async (productId) => {
    try {
      const response = await homeService.getProductPricingConfig(productId);
      if (response.status === "success") {
        setPricingConfig(response.data);
      }
    } catch (error) {
      setPricingConfig(null);
    }
  };

  const fetchProductDetails = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await homeService.getProductBySlug(slug);

      const normalizedProduct = normalizeProduct(response.data.data);
      setProduct(normalizedProduct);
      setProductServices(response.data.data.product_services || []);

      if (normalizedProduct?.id) {
        await fetchPricingConfig(normalizedProduct.id);
      }
    } catch (error) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  const fetchCategories = async () => {
    try {
      const response = await homeService.getAllCategories();
      const categoriesData = response.data || [];
      setCategories(categoriesData);

      const rootCategories = categoriesData.filter(
        (cat) => !cat.parent_id || cat.parent_id === null
      );
      setTopCategories(rootCategories);
    } catch (error) {
      setTopCategories([]);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchCategories();
  }, [fetchProductDetails]);

  useEffect(() => {
    if (product?.custom_options) {
      const defaultSelections = {};

      product.custom_options.forEach((option) => {
        const defaultValue = option.option_values?.find(
          (value) => value.is_default === true
        );

        if (defaultValue) {
          defaultSelections[option.id] = {
            valueId: defaultValue.id,
            value: defaultValue.option_value,
            price_modifier: defaultValue.price_modifier,
            price_modifier_type: defaultValue.price_modifier_type,
          };
        }
      });

      if (
        Object.keys(defaultSelections).length > 0 &&
        Object.keys(selectedCustomOptions).length === 0
      ) {
        setSelectedCustomOptions(defaultSelections);
      }
    }
  }, [product?.custom_options]);

  useEffect(() => {
    if (product?.id && pricingConfig) {
      // Only calculate if we have meaningful changes
      const hasValidDimensions = pricingConfig?.required_dimensions?.some(
        (dim) => customDimensions[dim] != null && customDimensions[dim] > 0
      );

      const hasSelectedOptions = Object.keys(selectedCustomOptions).length > 0;

      // Trigger immediate calculation for non-dimensional changes
      if (!product?.is_dimensional_pricing || hasValidDimensions) {
        debouncedCalculatePricing(
          customDimensions,
          selectedCustomOptions,
          quantity
        );
      }
    }
  }, [
    product?.id,
    pricingConfig,
    selectedCustomOptions, // Options changes should trigger calculation
    quantity, // Quantity changes should trigger calculation
  ]);

  const calculateTotalPrice = () => {
    if (!product) return 0;

    let totalPrice = 0;

    if (pricingData?.pricing?.final?.gross) {
      totalPrice = pricingData.pricing.final.gross;
    } else {
      totalPrice = (product.pricing?.final_price?.gross || 0) * quantity;
    }

    const servicesPrice = selectedServices.reduce((sum, serviceId) => {
      const service = productServices.find((s) => s.id === serviceId);
      return sum + (service ? parseFloat(service.price || 0) : 0);
    }, 0);

    return totalPrice + servicesPrice;
  };

  const handleCustomOptionChange = (
    optionId,
    valueId,
    value,
    priceModifier = 0,
    priceModifierType = "fixed"
  ) => {
    setSelectedCustomOptions((prev) => ({
      ...prev,
      [optionId]: {
        valueId,
        value,
        price_modifier: priceModifier,
        price_modifier_type: priceModifierType,
      },
    }));
  };

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };


  const handleQuantityChange = (newQuantity) => {
    const parsedQuantity = parseInt(newQuantity) || 1;

    // Get constraints from pricing config
    const minOrderQty =
      pricingConfig?.quantity_constraints?.min_order_quantity || 1;
    const maxOrderQty =
      pricingConfig?.quantity_constraints?.max_order_quantity || 9999;

    if (parsedQuantity < minOrderQty) {
      setCalculationError(`La quantité minimum de commande est ${minOrderQty}`);
      return;
    }

    if (parsedQuantity > maxOrderQty) {
      setCalculationError(
        `La quantité maximale de commande est ${maxOrderQty}`
      );
      return;
    }

    setCalculationError("");
    setQuantity(parsedQuantity);

    // ✅ DEBOUNCED: Trigger calculation after quantity change
    debouncedCalculatePricing(
      customDimensions,
      selectedCustomOptions,
      parsedQuantity
    );
  };

  const handleQuantityIncrement = () => {
    const maxOrderQty =
      pricingConfig?.quantity_constraints?.max_order_quantity || 9999;
    if (quantity < maxOrderQty) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    const minOrderQty =
      pricingConfig?.quantity_constraints?.min_order_quantity || 1;
    if (quantity > minOrderQty) {
      setQuantity(quantity - 1);
    }
  };

  // Handle image zoom on mouse move
  const handleImageMouseMove = (e) => {
    if (!isImageZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  // build product view event payload
  const buildProductViewEvent = (product) => {
    return {
      event_type: "view",
      session_id: null,
      customer_id: null,
      product_id: product.id,
      category_id: product.categories?.[0]?.id || null,
      page_type: "product_detail",
      page_url: window.location.href,
      referrer_url: document.referrer,
      category_path: product.categories?.[0].slug
        ? `/category/${product.categories[0].slug}`
        : null,
      position_in_list: null,
      total_results: null,
      page_number: 1,
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  };

  // Track page view when product is loaded
  useEffect(() => {
    if (product && !loading) {
      const viewEvent = buildProductViewEvent(product);

      homeService.createProductEvent(viewEvent);
    }
  }, [product, loading]);

  // Carousel state for mobile
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef();

  // Handle swipe for mobile carousel
  function handleCarouselSwipe(direction) {
    if (!product?.images?.gallery?.length) return;
    const total = product.images.gallery.length;
    setCarouselIndex((prev) => {
      if (direction === "left") return prev === 0 ? total - 1 : prev - 1;
      if (direction === "right") return prev === total - 1 ? 0 : prev + 1;
      return prev;
    });
    setSelectedImage((prev) => {
      if (direction === "left") return prev === 0 ? total - 1 : prev - 1;
      if (direction === "right") return prev === total - 1 ? 0 : prev + 1;
      return prev;
    });
  }

  if (loading) {
    return (
      <Box minH="100vh" bg="white">
        <Navbar />

        {/* Breadcrumb Skeleton */}
        <Box
          bg="white"
          borderBottom="1px"
          borderColor="gray.200"
          py={4}
          display={{ base: "none", md: "flex" }}
        >
          <Container maxW="1400px">
            <HStack spacing={3} fontSize="sm">
              <Skeleton height="16px" width="60px" />
              <Skeleton height="8px" width="8px" />
              <Skeleton height="16px" width="100px" />
              <Skeleton height="8px" width="8px" />
              <Skeleton height="16px" width="120px" />
            </HStack>
          </Container>
        </Box>

        {/* Desktop View Skeleton */}
        <Container maxW="1600px" py={4} display={{ base: "none", md: "block" }}>
          <Grid
            templateColumns={{ base: "1fr", lg: "1.25fr 0.9fr 0.70fr" }}
            gap={6}
            minH="100vh"
            alignItems="start"
          >
            {/* Left Column - Image Gallery Skeleton */}
            <Box>
              <Card
                shadow="none"
                borderRadius="md"
                overflow="hidden"
                bg="white"
              >
                <CardBody p={0}>
                  <Grid templateColumns="120px 1fr" gap={4}>
                    {/* Thumbnail Skeletons */}
                    <VStack spacing={3} py={4}>
                      {[...Array(4)].map((_, i) => (
                        <Skeleton
                          key={i}
                          height="50px"
                          width="50px"
                          borderRadius="xl"
                        />
                      ))}
                    </VStack>

                    {/* Main Image Skeleton */}
                    <Box>
                      <Skeleton
                        height={{ base: "300px", md: "400px", lg: "500px" }}
                        width="100%"
                        borderRadius="md"
                      />
                    </Box>
                  </Grid>
                </CardBody>
              </Card>

              {/* About Section Skeleton */}
              <Box mt={10}>
                <Skeleton height="24px" width="150px" mb={6} />
                <VStack spacing={4} align="stretch">
                  <Card p={4} borderRadius="lg">
                    <Skeleton height="20px" width="120px" mb={3} />
                    <SkeletonText mt={4} noOfLines={4} spacing={4} />
                  </Card>
                  <Card p={4} borderRadius="lg">
                    <Skeleton height="20px" width="100px" mb={3} />
                    <VStack spacing={2} align="stretch">
                      {[...Array(5)].map((_, i) => (
                        <HStack key={i} justify="space-between">
                          <Skeleton height="16px" width="100px" />
                          <Skeleton height="16px" width="80px" />
                        </HStack>
                      ))}
                    </VStack>
                  </Card>
                </VStack>
              </Box>
            </Box>

            {/* Middle Column - Product Details Skeleton */}
            <Box>
              <Card shadow="none" borderRadius="2xl" overflow="hidden">
                <CardBody py={4} bg="white">
                  <VStack align="stretch" spacing={6}>
                    {/* Product Badges Skeleton */}
                    <HStack spacing={2}>
                      <Skeleton
                        height="24px"
                        width="80px"
                        borderRadius="full"
                      />
                      <Skeleton
                        height="24px"
                        width="90px"
                        borderRadius="full"
                      />
                      <Skeleton
                        height="24px"
                        width="70px"
                        borderRadius="full"
                      />
                    </HStack>

                    {/* Product Title Skeleton */}
                    <Skeleton height="28px" width="90%" />

                    {/* Custom Options Skeleton */}
                    <Box>
                      <Skeleton height="20px" width="150px" mb={4} />
                      <VStack align="stretch" spacing={4}>
                        {[...Array(2)].map((_, i) => (
                          <Box key={i}>
                            <Skeleton height="16px" width="100px" mb={3} />
                            <SimpleGrid columns={4} spacing={3}>
                              {[...Array(4)].map((_, j) => (
                                <Box key={j}>
                                  <Skeleton height="80px" borderRadius="md" />
                                  <Skeleton height="12px" width="60px" mt={2} />
                                </Box>
                              ))}
                            </SimpleGrid>
                          </Box>
                        ))}
                      </VStack>
                    </Box>

                    {/* Description Skeleton */}
                    <Box>
                      <Skeleton height="16px" width="140px" mb={2} />
                      <SkeletonText mt={4} noOfLines={3} spacing={4} />
                    </Box>

                    {/* At a glance Skeleton */}
                    <Box>
                      <Skeleton height="16px" width="90px" mb={4} />
                      <SimpleGrid
                        columns={{ base: 1, sm: 2, md: 3 }}
                        spacing={4}
                      >
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} p={3} bg="gray.50" borderRadius="lg">
                            <Skeleton height="12px" width="60px" mb={2} />
                            <Skeleton height="16px" width="80px" />
                          </Card>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Box>

            {/* Right Column - Pricing & Purchase Skeleton */}
            <Box>
              <Card
                shadow="none"
                borderRadius="2xl"
                overflow="hidden"
                bg="gray.100"
              >
                <CardBody p={6}>
                  <VStack align="stretch" spacing={6}>
                    {/* Price Skeleton */}
                    <Box>
                      <Skeleton height="32px" width="180px" mb={3} />
                      <VStack align="start" spacing={2}>
                        <Skeleton height="16px" width="150px" />
                        <Skeleton height="16px" width="120px" />
                        <Skeleton height="16px" width="100px" />
                      </VStack>
                    </Box>

                    {/* VAT Info Skeleton */}
                    <HStack spacing={2}>
                      <Skeleton height="14px" width="120px" />
                      <Skeleton height="14px" width="80px" />
                    </HStack>

                    {/* Product Info Skeleton */}
                    <VStack spacing={3}>
                      {[...Array(4)].map((_, i) => (
                        <HStack key={i} justify="space-between" w="full">
                          <Skeleton height="16px" width="80px" />
                          <Skeleton height="16px" width="60px" />
                        </HStack>
                      ))}
                    </VStack>

                    {/* Quantity & Add to Cart Skeleton */}
                    <Box>
                      <Skeleton height="16px" width="60px" mb={2} />
                      <HStack spacing={2}>
                        <Skeleton
                          height="40px"
                          width="120px"
                          borderRadius="lg"
                        />
                      </HStack>
                      <Skeleton
                        height="40px"
                        width="100%"
                        borderRadius="lg"
                        mt={4}
                      />
                    </Box>

                    {/* Services Skeleton */}
                    <Box>
                      <Skeleton height="20px" width="180px" mb={4} />
                      <VStack spacing={3}>
                        {[...Array(3)].map((_, i) => (
                          <Card
                            key={i}
                            p={3}
                            bg="white"
                            borderRadius="lg"
                            w="full"
                          >
                            <HStack justify="space-between">
                              <HStack>
                                <Skeleton height="16px" width="16px" />
                                <Skeleton height="16px" width="120px" />
                              </HStack>
                              <Skeleton height="16px" width="50px" />
                            </HStack>
                          </Card>
                        ))}
                      </VStack>
                    </Box>

                    {/* Wishlist Button Skeleton */}
                    <Skeleton height="32px" width="100px" />
                  </VStack>
                </CardBody>
              </Card>
            </Box>
          </Grid>
        </Container>

        {/* Mobile View Skeleton */}
        <Container maxW="1600px" py={4} display={{ base: "block", md: "none" }}>
          <VStack spacing={6} align="stretch">
            {/* Mobile Product Info */}
            <Box>
              <HStack spacing={2} mb={4}>
                <Skeleton height="20px" width="70px" borderRadius="full" />
                <Skeleton height="20px" width="80px" borderRadius="full" />
              </HStack>
              <Skeleton height="24px" width="90%" mb={4} />
            </Box>

            {/* Mobile Image Skeleton */}
            <Box>
              <Skeleton height="300px" width="100%" borderRadius="xl" />
            </Box>

            {/* Mobile Product Details */}
            <Box p={4}>
              <VStack spacing={4} align="stretch">
                {[...Array(4)].map((_, i) => (
                  <HStack key={i} justify="space-between">
                    <Skeleton height="16px" width="80px" />
                    <Skeleton height="16px" width="60px" />
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Mobile Custom Options */}
            <Box p={4}>
              <Skeleton height="20px" width="150px" mb={4} />
              <SimpleGrid columns={3} spacing={3}>
                {[...Array(6)].map((_, i) => (
                  <Box key={i}>
                    <Skeleton height="100px" borderRadius="md" />
                    <Skeleton height="12px" width="60px" mt={2} />
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Mobile Price & Purchase */}
            <Box p={4}>
              <Skeleton height="32px" width="150px" mb={4} />
              <VStack spacing={3} align="stretch">
                <HStack spacing={2}>
                  <Skeleton height="16px" width="100px" />
                  <Skeleton height="16px" width="80px" />
                </HStack>
                <Skeleton height="40px" width="100%" />
              </VStack>
            </Box>

            {/* Mobile Services */}
            <Box p={4}>
              <Skeleton height="20px" width="180px" mb={4} />
              <VStack spacing={3}>
                {[...Array(3)].map((_, i) => (
                  <Card key={i} p={3} bg="white" borderRadius="lg" w="full">
                    <HStack justify="space-between">
                      <HStack>
                        <Skeleton height="16px" width="16px" />
                        <Skeleton height="16px" width="120px" />
                      </HStack>
                      <Skeleton height="16px" width="50px" />
                    </HStack>
                  </Card>
                ))}
              </VStack>
            </Box>

            {/* Mobile Quantity & Add to Cart */}
            <Box p={4}>
              <HStack spacing={2} w="full">
                <Box w="30%">
                  <Skeleton height="16px" width="60px" mb={2} />
                  <Skeleton height="40px" width="100%" borderRadius="lg" />
                </Box>
                <Box w="70%">
                  <Skeleton height="40px" width="100%" borderRadius="lg" />
                </Box>
              </HStack>
            </Box>

            {/* Mobile At a glance */}
            <Box p={4}>
              <Skeleton height="20px" width="100px" mb={4} />
              <SimpleGrid columns={2} spacing={4}>
                {[...Array(6)].map((_, i) => (
                  <Card key={i} p={3} bg="gray.100" borderRadius="lg">
                    <Skeleton height="12px" width="60px" mb={2} />
                    <Skeleton height="16px" width="80px" />
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>

        <Footer />
      </Box>
    );
  }

  // ADD TO CART START
  // Helper: Check if all required custom options are selected
  function areAllRequiredOptionsSelected(product, selectedCustomOptions) {
    if (!product?.custom_options) return true;
    return product.custom_options.every((option) => {
      if (!option.is_required) return true;
      return !!selectedCustomOptions[option.id]?.valueId;
    });
  }

  // Helper: Check if all required dimensions are filled
  function areAllRequiredDimensionsFilled(pricingConfig, customDimensions) {
    if (!pricingConfig?.required_dimensions) return true;
    return pricingConfig.required_dimensions.every((dim) => {
      const val = customDimensions[dim];
      return val !== null && val !== undefined && val !== "";
    });
  }

  // ADD TO CART START
  const handleAddToCart = async () => {
    const minOrderQty =
      pricingConfig?.quantity_constraints?.min_order_quantity || 1;
    const maxOrderQty =
      pricingConfig?.quantity_constraints?.max_order_quantity || 999;

    // Validate quantity limits before add to cart
    if (quantity < minOrderQty) {
      toast({
        title: "Quantité trop basse",
        description: `La quantité minimum de commande est ${minOrderQty}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }
    if (quantity > maxOrderQty) {
      toast({
        title: "Quantité trop élevée",
        description: `La quantité maximale de commande est ${maxOrderQty}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    // Block if calculationError is set (from input validation)
    if (calculationError) {
      toast({
        title: "Quantité invalide",
        description: calculationError,
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    // Validate required custom options
    if (!areAllRequiredOptionsSelected(product, selectedCustomOptions)) {
      toast({
        title: "Veuillez sélectionner toutes les options requises.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }
    // Validate required dimensions
    if (!areAllRequiredDimensionsFilled(pricingConfig, customDimensions)) {
      toast({
        title: "Veuillez remplir toutes les dimensions requises.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }
    // Validate pricing data
    if (!pricingData?.pricing?.final?.gross) {
      toast({
        title: "Quelque chose n'a pas fonctionné, veuillez réessayer",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (!product?.is_available_on_stock) {
      toast({
        title: "Produit indisponible",
        description: "Ce produit n'est pas en stock.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    // Prepare selected options for backend
    // const selectedOptions = product.custom_options.map((option) => {
    //   const selected = selectedCustomOptions[option.id];
    //   const valueObj = option.option_values?.find(
    //     (v) => v.id === selected?.valueId
    //   );
    //   return {
    //     option_id: option.id,
    //     option_name: option.option_name,
    //     value_id: selected?.valueId,
    //     value_name: valueObj?.option_value || "",
    //     price_modifier: valueObj?.price_modifier || 0,
    //     price_modifier_type: valueObj?.price_modifier_type || "fixed",
    //   };
    // });

    //v2 - include image_url too.
    const selectedOptions = product.custom_options.map((option) => {
      const selected = selectedCustomOptions[option.id];
      const valueObj = option.option_values?.find(
        (v) => v.id === selected?.valueId
      );
      return {
        option_id: option.id,
        option_name: option.option_name,
        value_id: selected?.valueId,
        value_name: valueObj?.option_value || "",
        price_modifier: valueObj?.price_modifier || 0,
        price_modifier_type: valueObj?.price_modifier_type || "fixed",
        image_url: valueObj?.image_url || "",
        image_alt_text:
          valueObj?.image_alt_text || valueObj?.option_value || "",
      };
    });

    // Prepare selected services for backend
    const selectedServicesArr = (productServices || [])
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => ({
        service_id: service.id,
        title: service.title,
        price: service.price,
      }));

    // Prepare dimensions for backend
    const dimensions = {};
    if (pricingConfig?.required_dimensions) {
      pricingConfig.required_dimensions.forEach((dim) => {
        dimensions[dim] = customDimensions[dim] || 0;
      });
    }

    // Prepare product snapshot
    const productSnapshot = {
      title: product.title,
      slug: product.slug,
      main_image_url: product.images?.main_image?.url || "",
      sku: product.sku,
    };

    // Prepare pricing breakdown
    const pricingBreakdown = pricingData.pricing;

    // Prepare payload for add to cart
    const payload = {
      product_id: product.id,
      quantity,
      selected_options: selectedOptions,
      selected_services: selectedServicesArr,
      dimensions,
      pricing_breakdown: pricingBreakdown,
      unit_price: pricingData.pricing.final.unit_price_gross,
      total_price: pricingData.pricing.final.gross,
      product_snapshot: productSnapshot,
    };

    if (!customer || !customer.id) {
      navigate("/account/signin");
      return;
    }

    try {
      await homeService.addToCart(payload);
      toast({
        title: "Ajouté au panier!",
        status: "success",
        duration: 2500,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      const eventPayload = {
        event_type: "add_to_cart",
        session_id: customer?.id || null,
        customer_id: customer?.id || null,
        product_id: product?.id || null,
        category_id: product?.categories?.[0]?.id || null,
        page_type: "product_detail",
        page_url: typeof window !== "undefined" ? window.location.href : null,
        referrer_url:
          typeof document !== "undefined" ? document.referrer : null,
        quantity,
        price_add_to_cart:
          pricingData?.pricing?.final?.unit_price_gross ?? null,
        total_price: pricingData?.pricing?.final?.gross ?? null,
        product_snapshot: productSnapshot,
        timestamp: new Date().toISOString(),
      };

      if (homeService?.createProductEvent) {
        homeService.createProductEvent(eventPayload).catch(() => {});
      }
    } catch (error) {
      toast({
        title: "Échec de l'ajout au panier",
        description: error?.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };



  function getAllowedOptionValueIds(selectedCustomOptions, product, option) {

    // Handle "Imposte/allège" filtering based on "Type de fenêtre"
    if (option.option_name === "Imposte/allège") {
      const typeDeFenetre = product.custom_options.find(
        (opt) => opt.option_name === "Type de fenêtre"
      );
      if (!typeDeFenetre) {
        return null;
      }

      const selectedTypeValueId =
        selectedCustomOptions[typeDeFenetre.id]?.valueId;
      const selectedTypeValue = typeDeFenetre.option_values.find(
        (v) => v.id === selectedTypeValueId
      );


      if (!selectedTypeValue) {
        return null;
      }

      const allowed = selectedTypeValue.additional_data?.show_option_values;

      return Array.isArray(allowed) ? allowed : null;
    }

    // Handle "Type d'ouverture" filtering based on "Imposte/allège"
    // 🚀 FIX: Use the exact apostrophe character from your JSON data
    if (
      option.id === "8d7dbef3-3058-4993-b0be-bcc545e8a095" ||
      option.id === "e62e6e0b-aea1-4bf3-8b00-fe5075f69fb4"
      // option.display_name === "Type d’ouverture"
    ) {
      // ← Changed apostrophe

      const imposteAllege = product.custom_options.find(
        (opt) => opt.option_name === "Imposte/allège"
      );

      

      if (!imposteAllege) {
        return null;
      }

      

      const selectedImposteValueId =
        selectedCustomOptions[imposteAllege.id]?.valueId;

      

      const selectedImposteValue = imposteAllege.option_values.find(
        (v) => v.id === selectedImposteValueId
      );

      

      if (!selectedImposteValue) {
        return null;
      }

      const allowed = selectedImposteValue.additional_data?.show_option_values;

      

      return Array.isArray(allowed) ? allowed : null;
    }

    return null;
  }

  if (!product) {
    navigate("/product-not-found");
  }

  return (
    <Box minH="100vh" bg="rgba(252, 252, 253, 1)">
      <Navbar />

      <Box
        bg="transparent"
        borderBottom="0px"
        borderColor="gray.200"
        py={4}
        display={{ base: "none", md: "flex" }}
      >
        <Container maxW="1400px">
          <HStack spacing={3} fontSize="sm" color="gray.600">
            <Button
              variant="link"
              size="xs"
              onClick={() => navigate("/")}
              color="gray.600"
              _hover={{ color: "blue.600" }}
              fontWeight="medium"
              fontFamily={"Airbnb Cereal VF"}
            >
              Home
            </Button>
            <Icon as={FaChevronRight} fontSize="xs" color="gray.400" />
            {product?.categories?.map((category, index) => (
              <React.Fragment key={category.id}>
                <Button
                  variant="link"
                  size="xs"
                  color="gray.600"
                  _hover={{ color: "blue.600" }}
                  fontWeight="medium"
                  onClick={() => {
                    navigate(`/category/${category.slug}`);
                  }}
                >
                  {category?.name}
                </Button>
                {index < product.categories.length - 1 && (
                  <Icon as={FaChevronRight} fontSize="xs" color="gray.400" />
                )}
              </React.Fragment>
            ))}
          </HStack>
        </Container>
      </Box>

      <Container maxW="1600px" py={4} display={{ base: "none", md: "block" }}>
        <Grid
          templateColumns={{ base: "1fr", lg: "1.25fr 0.9fr 0.70fr" }}
          gap={0}
          minH="100vh"
          alignItems={"start"}
        >
          {/* Left Column */}
          <Box
            top="20px"
            alignSelf="flex-start"
            zIndex={100} // Higher z-index
            h="fit-content"
            maxH="calc(100vh - 40px)"
            overflowY="auto"
            bg="transparent"
            borderRadius="md"
            boxShadow="none"
          >
            <Card
              shadow="none"
              borderRadius="md"
              overflow="hidden"
              mb={0}
              border="0px solid"
              borderColor="gray.200"
              bg="white"
            >
              <CardBody p={0}>
                <Grid
                  templateColumns={{ base: "1fr", md: "120px 1fr" }}
                  gap={0}
                >
                  {isMobile ? (
                    <Box w="full" position="relative">
                      <AspectRatio ratio={4 / 3}>
                        <Box
                          borderRadius="xl"
                          overflow="hidden"
                          position="relative"
                          bg="transparent"
                          border="0px"
                          borderColor="gray.200"
                        >
                          <Image
                            src={
                              product?.images?.gallery?.[carouselIndex]?.url ||
                              product?.images?.main_image?.url
                            }
                            alt={product?.title}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                          {/* Carousel navigation arrows */}
                          {product?.images?.gallery?.length > 1 && (
                            <>
                              <IconButton
                                aria-label="Previous image"
                                icon={<FaChevronLeft />}
                                position="absolute"
                                top="50%"
                                left="2"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={() => handleCarouselSwipe("left")}
                                bg="whiteAlpha.800"
                                _hover={{ bg: "whiteAlpha.900" }}
                                borderRadius="full"
                                size="sm"
                              />
                              <IconButton
                                aria-label="Next image"
                                icon={<FaChevronRight />}
                                position="absolute"
                                top="50%"
                                right="2"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={() => handleCarouselSwipe("right")}
                                bg="whiteAlpha.800"
                                _hover={{ bg: "whiteAlpha.900" }}
                                borderRadius="full"
                                size="sm"
                              />
                            </>
                          )}
                          {/* Dots indicator */}
                          {product?.images?.gallery?.length > 1 && (
                            <HStack
                              position="absolute"
                              bottom="2"
                              left="50%"
                              transform="translateX(-50%)"
                              spacing={1}
                              zIndex={2}
                            >
                              {product?.images.gallery.map((_, idx) => (
                                <Box
                                  key={idx}
                                  w={carouselIndex === idx ? "16px" : "8px"}
                                  h="8px"
                                  borderRadius="full"
                                  bg={
                                    carouselIndex === idx
                                      ? "blue.500"
                                      : "gray.300"
                                  }
                                  transition="all 0.2s"
                                />
                              ))}
                            </HStack>
                          )}
                        </Box>
                      </AspectRatio>
                    </Box>
                  ) : (
                    <>
                      <VStack spacing={3} order={{ base: 2, md: 1 }} py={1}>
                        {product?.images?.gallery?.map((image, index) => (
                          <Box
                            key={index}
                            w="50px"
                            h="50px"
                            borderRadius="xl"
                            overflow="hidden"
                            borderWidth="0px"
                            cursor="pointer"
                            onClick={() => {
                              setSelectedImage(index);
                              setCarouselIndex(index);
                            }}
                            transition="all 0.3s ease"
                            position="relative"
                            bg="transparent"
                          >
                            <Image
                              src={image?.url}
                              alt={image?.alt_text}
                              w="full"
                              h="full"
                              objectFit="fill"
                            />
                            {selectedImage === index && (
                              <Box
                                position="absolute"
                                top="2"
                                right="2"
                                w="3"
                                h="3"
                                bg="blue.500"
                                borderRadius="full"
                                border="0px"
                                borderColor="white"
                              />
                            )}
                          </Box>
                        ))}
                      </VStack>

                      <Box position="relative" order={{ base: 1, md: 2 }}>
                        <Box
                          borderRadius="md"
                          overflow="hidden"
                          onMouseEnter={() => setIsImageZoomed(true)}
                          onMouseLeave={() => setIsImageZoomed(false)}
                          onMouseMove={handleImageMouseMove}
                          position="relative"
                          bg="white"
                          border="0px solid"
                          borderColor="gray.200"
                          cursor="zoom-in"
                          width="100%"
                          minHeight={{
                            base: "260px",
                            md: "400px",
                            lg: "600px",
                          }}
                          maxHeight={{
                            base: "320px",
                            md: "500px",
                            lg: "600px",
                          }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          transition="box-shadow 0.2s"
                          boxShadow="none"
                        >
                          <Image
                            src={
                              product?.images?.gallery?.[selectedImage]?.url ||
                              product?.images?.main_image?.url
                            }
                            alt={product?.title}
                            w="100%"
                            h="100%"
                            maxW="100%"
                            maxH="100%"
                            minH={{ base: "260px", md: "400px", lg: "600px" }}
                            objectFit="100%"
                            borderRadius="md"
                            transition="transform 0.4s"
                            transform={
                              isImageZoomed ? "scale(1.5)" : "scale(1)"
                            }
                            transformOrigin={`${mousePosition.x}% ${mousePosition.y}%`}
                            bg="gray.100"
                          />

                          {/* Overlay buttons */}
                          <Box position="absolute" top={4} right={4}>
                            <HStack spacing={2}>
                              <IconButton
                                icon={<FaExpand />}
                                onClick={onImageModalOpen}
                                size="md"
                                bg="blackAlpha.700"
                                color="white"
                                _hover={{ bg: "blackAlpha.800" }}
                                borderRadius="full"
                                shadow="lg"
                                aria-label="Expand image"
                              />
                            </HStack>
                          </Box>

                          {/* Badges overlay */}
                          <Box position="absolute" top={4} left={4}>
                            <VStack spacing={2} align="flex-start">
                              {product?.badges?.is_new && (
                                <Badge
                                  colorScheme="green"
                                  variant="solid"
                                  fontSize="xs"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  textTransform="uppercase"
                                  fontWeight="bold"
                                  shadow="sm"
                                >
                                  NOUVELLE
                                </Badge>
                              )}
                              {product?.badges?.is_on_sale && (
                                <Badge
                                  colorScheme="red"
                                  variant="solid"
                                  fontSize="xs"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  textTransform="uppercase"
                                  fontWeight="bold"
                                  shadow="sm"
                                >
                                  VENTE
                                </Badge>
                              )}
                              {product?.badges?.free_shipping && (
                                <Badge
                                  colorScheme="blue"
                                  variant="solid"
                                  fontSize="xs"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  textTransform="uppercase"
                                  fontWeight="bold"
                                  shadow="sm"
                                >
                                  LIVRAISON GRATUITE
                                </Badge>
                              )}
                            </VStack>
                          </Box>

                          {/* Zoom indicator */}
                          {isImageZoomed && !is360Mode && (
                            <Box
                              position="absolute"
                              bottom={4}
                              left={4}
                              bg="blackAlpha.700"
                              color="white"
                              px={3}
                              py={2}
                              borderRadius="full"
                              fontSize="sm"
                              fontWeight="medium"
                              shadow="md"
                            >
                              <HStack spacing={2}>
                                <Icon as={FaExpand} fontSize="xs" />
                                <Text>Zoomed</Text>
                              </HStack>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </>
                  )}
                </Grid>
              </CardBody>
            </Card>

            {/* About this item only if product does have custom options */}
            <Box>
              <Text
                fontSize={"md"}
                fontFamily="Airbnb Cereal VF"
                fontWeight={"500"}
                color="black"
                mt={10}
                ml={3}
              >
                À propos de cet article
              </Text>

              <Accordion
                allowMultiple
                maxW={{ base: "100%", md: "100%" }}
                mt={5}
              >
                {/* Product Details Accordion */}
                <AccordionItem
                  borderTopWidth={"1px"}
                  borderTopColor={"gray.200"}
                  mb={1}
                >
                  <h2>
                    <AccordionButton
                      py={4}
                      px={6}
                      _hover={{ bg: "gray.50" }}
                      borderRadius="lg"
                    >
                      <Box flex="1" textAlign="left">
                        <Text
                          fontSize="md"
                          fontWeight="500"
                          fontFamily="Airbnb Cereal VF"
                          color="gray.800"
                        >
                          Détails du produit
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={6} px={6}>
                    <Box
                      fontSize="sm"
                      color="gray.700"
                      lineHeight="1.6"
                      border="none"
                      fontFamily={"Airbnb Cereal VF"}
                      sx={{
                        p: { margin: 0, marginBottom: "1em" },
                        br: { display: "block", marginBottom: "0.5em" },
                        strong: { fontWeight: "600" },
                        em: { fontStyle: "italic" },
                        ul: { paddingLeft: "1.5em", marginBottom: "1em" },
                        ol: { paddingLeft: "1.5em", marginBottom: "1em" },
                        li: { marginBottom: "0.25em" },
                      }}
                      dangerouslySetInnerHTML={{
                        __html: product?.description
                          ? product.description.replace(/ style="[^"]*"/g, "")
                          : "No product description available.",
                      }}
                    />
                  </AccordionPanel>
                </AccordionItem>

                {/* Specifications Accordion */}
                <AccordionItem
                  borderTopWidth={"1px"}
                  borderTopColor={"gray.200"}
                  mb={1}
                >
                  <h2>
                    <AccordionButton
                      py={4}
                      px={6}
                      _hover={{ bg: "gray.50" }}
                      borderRadius="lg"
                    >
                      <Box flex="1" textAlign="left">
                        <Text
                          fontSize="md"
                          fontWeight="500"
                          fontFamily="Airbnb Cereal VF"
                          color="gray.800"
                        >
                          Caractéristiques
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={6} px={6}>
                    {product?.custom_details &&
                    product.custom_details.length > 0 ? (
                      <Box overflowX="auto">
                        <VStack spacing={0} align="stretch">
                          {product.custom_details.map((detail, index) => (
                            <HStack
                              key={detail.key}
                              py={3}
                              px={0}
                              borderBottom={
                                index < product.custom_details.length - 1
                                  ? "1px solid"
                                  : "none"
                              }
                              borderColor="gray.100"
                              justify="space-between"
                              align="flex-start"
                            >
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="gray.600"
                                fontFamily="Bogle"
                                minW="120px"
                                maxW="200px"
                              >
                                {detail.label}
                              </Text>
                              <Text
                                fontSize="sm"
                                color="gray.800"
                                fontFamily="Bogle"
                                textAlign="right"
                                flex="1"
                                wordBreak="break-word"
                              >
                                {detail.value}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    ) : (
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        fontStyle="italic"
                        fontFamily="Bogle"
                      >
                        Aucune spécification disponible pour ce produit.
                      </Text>
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Box>
          </Box>

          {/* Right Column - Enhanced Purchase Card */}
          <Box bg="white">
            <Card shadow="none" borderRadius="2xl" overflow="hidden">
              <CardBody py={1} bg="white">
                <VStack align="stretch" spacing={0}>
                  <Box>
                    {product?.is_available_on_stock ? (
                      <Button
                        size="xs"
                        bg="black"
                        _hover={{ bg: "black" }}
                        _focus={{ bg: "black" }}
                        _active={{ bg: "black" }}
                        color="white"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        Disponible
                      </Button>
                    ) : null}

                    {product?.is_discounted ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="black"
                        _hover={{ bg: "black" }}
                        _focus={{ bg: "black" }}
                        _active={{ bg: "black" }}
                        color="white"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        Offres Flash
                      </Button>
                    ) : null}

                    {product?.mark_as_new ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="black"
                        _hover={{ bg: "black" }}
                        _focus={{ bg: "black" }}
                        _active={{ bg: "black" }}
                        color="white"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        Nouvelle
                      </Button>
                    ) : null}

                    {product?.discount_percentage_nett >= 25 ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="black"
                        _hover={{ bg: "black" }}
                        _focus={{ bg: "black" }}
                        _active={{ bg: "black" }}
                        color="white"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        Grande vente
                      </Button>
                    ) : null}

                    {product?.categories.length >= 1
                      ? product.categories.map((category) => (
                          <Button
                            key={category.id}
                            ml={1}
                            size="xs"
                            bg="black"
                            _hover={{ bg: "black" }}
                            _focus={{ bg: "black" }}
                            _active={{ bg: "black" }}
                            color="white"
                            fontFamily={"Airbnb Cereal VF"}
                          >
                            {category.name}
                          </Button>
                        ))
                      : null}

                    <Heading
                      mt={2}
                      fontSize="18px"
                      mb={4}
                      color="gray.800"
                      lineHeight="1.2"
                      fontFamily="Airbnb Cereal VF"
                    >
                      {product?.title}
                    </Heading>
                  </Box>

                  {Array.isArray(product?.custom_options) &&
                    product?.custom_options.length > 0 && (
                      <Box mb={6}>
                        <Heading
                          size="sm"
                          mb={4}
                          color="gray.800"
                          fontWeight="500"
                          letterSpacing="tight"
                          fontFamily="Airbnb Cereal VF"
                        >
                          Options configurables
                        </Heading>

                        {/* Global scrollable container for all custom options */}
                        <Box
                          maxH="600px" // Maximum height for entire options section
                          overflowY="auto"
                          overflowX="hidden"
                          borderRadius="lg"
                          border="1px"
                          borderColor="gray.100"
                          bg="white"
                          p={3}
                          css={{
                            "&::-webkit-scrollbar": {
                              width: "8px",
                            },
                            "&::-webkit-scrollbar-track": {
                              background: "#f1f1f1",
                              borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                              background: "#cbd5e0",
                              borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                              background: "#a0aec0",
                            },
                          }}
                        >
                          <VStack align="stretch" spacing={5}>
                            {product?.is_dimensional_pricing &&
                              pricingConfig && (
                                <Box
                                  mb={6}
                                  p={4}
                                  borderWidth={0}
                                  borderRadius="md"
                                  bg="white"
                                  shadow="none"
                                >
                                  <Text
                                    fontSize="lg"
                                    fontWeight="semibold"
                                    mb={3}
                                    fontFamily="Bogle"
                                  >
                                    Personnaliser les dimensions
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="gray.600"
                                    mb={4}
                                    fontFamily="Bogle"
                                  >
                                    Type de calcul:{" "}
                                    {
                                      pricingConfig?.dimensional_calculation_type
                                    }
                                  </Text>

                                  <VStack spacing={4}>
                                    {pricingConfig?.required_dimensions.map(
                                      (dimension) => (
                                        <FormControl key={dimension}>
                                          <FormLabel
                                            textTransform="capitalize"
                                            fontSize="sm"
                                            fontWeight="medium"
                                            fontFamily={"Bogle"}
                                          >
                                            {dimension} (cm)
                                          </FormLabel>
                                          <Input
                                            type="number"
                                            placeholder={`Enter ${dimension}`}
                                            value={
                                              customDimensions[dimension] || ""
                                            }
                                            onChange={(e) =>
                                              handleDimensionChange(
                                                dimension,
                                                e.target.value
                                              )
                                            }
                                            min={
                                              pricingConfig
                                                .dimension_constraints[
                                                dimension
                                              ]?.min || 0
                                            }
                                            max={
                                              pricingConfig
                                                .dimension_constraints[
                                                dimension
                                              ]?.max || undefined
                                            }
                                            size="md"
                                          />
                                          {pricingConfig.dimension_constraints[
                                            dimension
                                          ] && (
                                            <FormHelperText fontSize="xs">
                                              Min:{" "}
                                              {
                                                pricingConfig
                                                  .dimension_constraints[
                                                  dimension
                                                ].min
                                              }{" "}
                                              - Max:{" "}
                                              {pricingConfig
                                                .dimension_constraints[
                                                dimension
                                              ].max || "No limit"}
                                            </FormHelperText>
                                          )}
                                        </FormControl>
                                      )
                                    )}
                                  </VStack>

                                  {calculationError && (
                                    <Alert status="error" mt={4}>
                                      <AlertIcon />
                                      {calculationError}
                                    </Alert>
                                  )}
                                </Box>
                              )}

                            {/* Sort custom options by sort_order before mapping */}
                            {product.custom_options
                              .sort(
                                (a, b) =>
                                  (a.sort_order || 0) - (b.sort_order || 0)
                              )
                              .map((option) => {
                                // Filter option values for "Imposte/allège" if needed
                                let filteredOptionValues = option.option_values;
                                const allowedIds = getAllowedOptionValueIds(
                                  selectedCustomOptions,
                                  product,
                                  option
                                );
                                if (allowedIds) {
                                  filteredOptionValues =
                                    filteredOptionValues.filter((v) =>
                                      allowedIds.includes(v.id)
                                    );
                                }

                                // Sort filtered option values by sort_order
                                filteredOptionValues =
                                  filteredOptionValues.sort(
                                    (a, b) =>
                                      (a.sort_order || 0) - (b.sort_order || 0)
                                  );

                                return (
                                  <Box
                                    key={option.id}
                                    p={1}
                                    borderRadius="md"
                                    bg="white"
                                    shadow="none"
                                    border="0px"
                                    borderColor="gray.200"
                                  >
                                    <Text
                                      fontWeight="400"
                                      fontSize="sm"
                                      fontFamily={"Bogle"}
                                      mb={3}
                                      color="gray.900"
                                    >
                                      {option.option_name}
                                      {option.is_required && (
                                        <Text as="span" color="red.500" ml={1}>
                                          *
                                        </Text>
                                      )}
                                    </Text>

                                    {option.option_type === "radio" && (
                                      <RadioGroup
                                        value={
                                          selectedCustomOptions[option.id]
                                            ?.valueId || ""
                                        }
                                        onChange={(valueId) => {
                                          const selectedValue =
                                            filteredOptionValues.find(
                                              (v) => v.id === valueId
                                            );
                                          if (selectedValue) {
                                            handleCustomOptionChange(
                                              option.id,
                                              valueId,
                                              selectedValue.option_value,
                                              selectedValue.price_modifier,
                                              selectedValue.price_modifier_type
                                            );
                                          }
                                        }}
                                      >
                                        <Box
                                          maxH="300px"
                                          overflowY="auto"
                                          overflowX="hidden"
                                          borderRadius="md"
                                          css={{
                                            "&::-webkit-scrollbar": {
                                              width: "6px",
                                            },
                                            "&::-webkit-scrollbar-track": {
                                              background: "#f7fafc",
                                              borderRadius: "3px",
                                            },
                                            "&::-webkit-scrollbar-thumb": {
                                              background: "#e2e8f0",
                                              borderRadius: "3px",
                                            },
                                            "&::-webkit-scrollbar-thumb:hover":
                                              {
                                                background: "#cbd5e0",
                                              },
                                          }}
                                        >
                                          <SimpleGrid
                                            columns={4}
                                            spacing={2}
                                            p={1}
                                          >
                                            {filteredOptionValues.map(
                                              (value) => (
                                                <Box
                                                  key={value.id}
                                                  as="label"
                                                  cursor="pointer"
                                                >
                                                  <Card
                                                    p={0}
                                                    borderRadius="2.5px"
                                                    border="0px"
                                                    borderColor={
                                                      selectedCustomOptions[
                                                        option.id
                                                      ]?.valueId === value.id
                                                        ? "gray.400"
                                                        : "gray.400"
                                                    }
                                                    _hover={{
                                                      borderColor: "red.600",
                                                    }}
                                                    transition="all 0.2s"
                                                    bg="transparent"
                                                    position="relative"
                                                    minH="100px"
                                                    maxH="200px"
                                                    display="flex"
                                                    shadow="none"
                                                    flexDirection="column"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                  >
                                                    {value.image_url && (
                                                      <Box
                                                        w="full"
                                                        h="auto"
                                                        borderRadius="0px"
                                                        overflow="hidden"
                                                        bg="transparent"
                                                        mb={0}
                                                      >
                                                        <Image
                                                          src={value.image_url}
                                                          alt={
                                                            value.display_name ||
                                                            value.option_value
                                                          }
                                                          w="full"
                                                          h="100px"
                                                          maxH="100px"
                                                          objectFit="100%"
                                                        />
                                                      </Box>
                                                    )}
                                                    <Text
                                                      fontSize="xs"
                                                      fontWeight="medium"
                                                      textAlign="center"
                                                      noOfLines={2}
                                                      fontFamily={"Bogle"}
                                                      mb={1}
                                                    >
                                                      {value.display_name ||
                                                        value.option_value}
                                                    </Text>
                                                    {(() => {
                                                      const priceModifier =
                                                        parseFloat(
                                                          value.price_modifier ||
                                                            0
                                                        );
                                                      const pricePerM2 =
                                                        parseFloat(
                                                          value.price_per_m2 ||
                                                            0
                                                        );
                                                      const pricePerM3 =
                                                        parseFloat(
                                                          value.price_per_m3 ||
                                                            0
                                                        );
                                                      const pricePerLinearMeter =
                                                        parseFloat(
                                                          value.price_per_linear_meter ||
                                                            0
                                                        );
                                                      const pricePerMeter =
                                                        parseFloat(
                                                          value.price_per_meter ||
                                                            0
                                                        );

                                                      let displayPrice = 0;
                                                      let displayUnit = "";

                                                      switch (
                                                        value.price_modifier_type
                                                      ) {
                                                        case "m2":
                                                          displayPrice =
                                                            pricePerM2;
                                                          displayUnit = "€/m²";
                                                          break;
                                                        case "m3":
                                                          displayPrice =
                                                            pricePerM3;
                                                          displayUnit = "€/m³";
                                                          break;
                                                        case "linear-meter":
                                                          displayPrice =
                                                            pricePerLinearMeter;
                                                          displayUnit = "€/m";
                                                          break;
                                                        case "meter":
                                                          displayPrice =
                                                            pricePerMeter;
                                                          displayUnit = "€/m";
                                                          break;
                                                        case "percentage":
                                                          displayPrice =
                                                            priceModifier;
                                                          displayUnit = "%";
                                                          break;
                                                        case "fixed":
                                                        default:
                                                          displayPrice =
                                                            priceModifier;
                                                          displayUnit = "€";
                                                      }

                                                      if (displayPrice > 0) {
                                                        return (
                                                          <Text
                                                            fontSize="xs"
                                                            fontWeight="bold"
                                                            color="green.600"
                                                            fontFamily={
                                                              "Bricolage Grotesque"
                                                            }
                                                          >
                                                            {/* +{displayPrice.toFixed(2)}
                                        {displayUnit} */}
                                                          </Text>
                                                        );
                                                      } else if (
                                                        displayPrice < 0
                                                      ) {
                                                        return (
                                                          <Text
                                                            fontSize="xs"
                                                            fontWeight="bold"
                                                            color="red.600"
                                                            fontFamily={
                                                              "Bricolage Grotesque"
                                                            }
                                                          >
                                                            {/* {displayPrice.toFixed(2)}
                                        {displayUnit} */}
                                                          </Text>
                                                        );
                                                      } else {
                                                        return (
                                                          <Text
                                                            fontSize="xs"
                                                            color="gray.500"
                                                            fontFamily={
                                                              "Bricolage Grotesque"
                                                            }
                                                          >
                                                            Included
                                                          </Text>
                                                        );
                                                      }
                                                    })()}
                                                    <Radio
                                                      value={value.id}
                                                      colorScheme="blue"
                                                      position="absolute"
                                                      top={2}
                                                      right={2}
                                                      size="sm"
                                                    />
                                                  </Card>
                                                </Box>
                                              )
                                            )}
                                          </SimpleGrid>
                                        </Box>
                                      </RadioGroup>
                                    )}

                                    {option.option_type === "select" && (
                                      <Select
                                        placeholder={`Choose ${option.option_name}`}
                                        size="lg"
                                        borderRadius="lg"
                                        value={
                                          selectedCustomOptions[option.id]
                                            ?.valueId || ""
                                        }
                                        onChange={(e) => {
                                          const selectedValue =
                                            filteredOptionValues.find(
                                              (v) => v.id === e.target.value
                                            );
                                          if (selectedValue) {
                                            handleCustomOptionChange(
                                              option.id,
                                              e.target.value,
                                              selectedValue.option_value,
                                              selectedValue.price_modifier,
                                              selectedValue.price_modifier_type
                                            );
                                          }
                                        }}
                                      >
                                        {filteredOptionValues.map((value) => (
                                          <option
                                            key={value.id}
                                            value={value.id}
                                          >
                                            {value.display_name ||
                                              value.option_value}
                                            {parseFloat(value.price_modifier) >
                                              0 &&
                                              (value.price_modifier_type ===
                                              "percentage"
                                                ? ` (+${value.price_modifier}%)`
                                                : ` (+${value.price_modifier}€)`)}
                                          </option>
                                        ))}
                                      </Select>
                                    )}
                                  </Box>
                                );
                              })}
                          </VStack>
                        </Box>
                      </Box>
                    )}
                  <Divider />
                  <br />

                  {product?.description && (
                    <Box>
                      <Text
                        fontWeight="500"
                        fontSize="sm"
                        color="black"
                        fontFamily="Bricolage Grotesque"
                        mb={2}
                      >
                        À propos de ce produit:
                      </Text>
                      <Box
                        fontWeight="500"
                        fontSize="sm"
                        color="black"
                        fontFamily="Bricolage Grotesque"
                        sx={{
                          p: { margin: 0, marginBottom: "0.6em" },
                          br: { display: "block", marginBottom: "0.6em" },
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 5,
                          maxHeight: "7.5em", // ~5 lines
                          transition: "max-height 0.3s",
                        }}
                        dangerouslySetInnerHTML={{
                          __html: product.description
                            ? product.description.replace(/ style="[^"]*"/g, "")
                            : "",
                        }}
                      />
                    </Box>
                  )}

                  <br />
                  <Divider />

                  <br />

                  {product?.custom_details.length >= 1 && (
                    <Text
                      fontSize={"sm"}
                      fontWeight={"bold"}
                      fontFamily={"Bricolage Grotesque"}
                    >
                      En un coup d'oeil
                    </Text>
                  )}

                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3 }}
                    spacing={4}
                    mb={2}
                    mt={5}
                  >
                    {product?.custom_details?.slice(0, 6).map((detail) => (
                      <Card
                        key={detail.key}
                        p={3}
                        borderRadius="lg"
                        border="0px"
                        borderColor="gray.200"
                        bg="gray.100"
                        shadow="sm"
                      >
                        <Text
                          fontSize="xs"
                          color="gray.500"
                          fontWeight="semibold"
                          mb={1}
                          textAlign={"center"}
                          fontFamily={"Bricolage Grotesque"}
                        >
                          {detail.label}
                        </Text>
                        <Text
                          fontSize="sm"
                          color="gray.800"
                          fontWeight="bold"
                          noOfLines={2}
                          textAlign={"center"}
                          fontFamily={"Bricolage Grotesque"}
                        >
                          {detail.value}
                        </Text>
                      </Card>
                    ))}
                  </SimpleGrid>

                  {product?.custom_details &&
                    product.custom_details.length > 6 && (
                      <Button
                        size="sm"
                        variant="link"
                        color="blue.600"
                        fontWeight="semibold"
                        align="start"
                        onClick={() => setIsCustomDetailsModalOpen(true)}
                        mb={4}
                      >
                        Tout voir
                      </Button>
                    )}
                </VStack>
              </CardBody>
            </Card>
          </Box>

          {/* 3 Column */}
          <Box>
            <Card
              shadow="none"
              borderRadius="2xl"
              overflow="hidden"
              border="1px solid rgba(145, 158, 171, 0.2)"
              bg="rgb(255,255,255)"
            >
              <CardBody p={2}>
                <VStack align="stretch" spacing={8}>
                  <Box>
                    <Heading
                      fontSize="25px"
                      mb={0}
                      color="gray.800"
                      lineHeight="1.2"
                      fontFamily="Bogle"
                    >
                      <Box mb={0}>
                        <Box
                          p={3}
                          borderRadius="xl"
                          bg="transparent"
                          boxShadow="none"
                          border="0px solid"
                          borderColor="gray.200"
                        >
                          <VStack align="stretch" spacing={3}>
                            <HStack justify="space-between" align="center">
                              <VStack align="start" spacing={1}>
                                <Text
                                  fontSize="lg"
                                  fontWeight="600"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  Prix total: €
                                  {calculateTotalPrice().toFixed(2)}
                                </Text>
                                {isCalculating && (
                                  <HStack>
                                    <Spinner size="sm" />
                                    <Text
                                      fontSize="sm"
                                      color="gray.600"
                                      fontFamily="Airbnb Cereal VF"
                                    >
                                      Calculatrice...
                                    </Text>
                                  </HStack>
                                )}
                              </VStack>
                            </HStack>

                            <Divider my={0} />
                            <HStack spacing={2}>
                              <Text fontSize="sm" color="gray.600">
                                TVA incluse ({product?.tax.rate}%)
                              </Text>
                            </HStack>

                            <Box>
                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  SKU:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product?.sku}
                                </Text>
                              </HStack>

                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  EAN numéro:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product?.ean}
                                </Text>
                              </HStack>

                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  Disponibilité
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product?.is_available_on_stock ? "🟢" : "🔴"}
                                </Text>
                              </HStack>

                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  Taux d'imposition
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product?.tax.rate}%
                                </Text>
                              </HStack>
                            </Box>

                            <Box>
                              <Text
                                fontWeight="500"
                                mb={0}
                                mt={5}
                                fontSize="sm"
                                color="gray.900"
                                fontFamily="Airbnb Cereal VF"
                              >
                                Quantité
                              </Text>
                              <HStack
                                maxW="200px"
                                bg="transparent"
                                borderRadius="xl"
                                p={2}
                                mt={1}
                              >
                                <IconButton
                                  icon={<FaMinus />}
                                  size="sm"
                                  onClick={handleQuantityDecrement}
                                  isDisabled={
                                    quantity <=
                                    (pricingConfig?.quantity_constraints
                                      ?.min_order_quantity || 1)
                                  }
                                  variant="ghost"
                                  borderRadius="lg"
                                  aria-label="Decrease quantity"
                                />

                                <Input
                                  type="number"
                                  min={
                                    pricingConfig?.quantity_constraints
                                      ?.min_order_quantity || 1
                                  }
                                  max={
                                    pricingConfig?.quantity_constraints
                                      ?.max_order_quantity || 9999
                                  }
                                  value={quantity}
                                  onChange={(e) =>
                                    handleQuantityChange(e.target.value)
                                  }
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="gray.800"
                                  textAlign="center"
                                  border="none"
                                  bg="transparent"
                                  p={0}
                                  _focus={{ boxShadow: "none" }}
                                />

                                <IconButton
                                  icon={<FaPlus />}
                                  size="sm"
                                  onClick={handleQuantityIncrement}
                                  isDisabled={
                                    quantity >=
                                    (pricingConfig?.quantity_constraints
                                      ?.max_order_quantity || 9999)
                                  }
                                  variant="ghost"
                                  borderRadius="lg"
                                  aria-label="Increase quantity"
                                />
                              </HStack>
                            </Box>

                            <Button
                              color="white"
                              fontFamily="Airbnb Cereal VF"
                              size="sm"
                              bg="#000000ff"
                              _hover={{ bg: "#df0000" }}
                              _focus={{ bg: "#df0000" }}
                              _active={{ bg: "#df0000" }}
                              onClick={handleAddToCart}
                              isDisabled={!product?.is_available_on_stock}
                            >
                              Ajouter au panier
                            </Button>
                          </VStack>
                        </Box>
                      </Box>
                    </Heading>
                  </Box>

                  {Array.isArray(product?.product_services) &&
                    product?.product_services.length > 0 && (
                      <Box mb={0} p="3">
                        <Heading
                          size="sm"
                          mb={4}
                          color="gray.800"
                          fontWeight="500"
                          letterSpacing="tight"
                          fontFamily="Bogle"
                        >
                          Services optionnels du produit
                        </Heading>

                        <VStack
                          align="stretch"
                          spacing={3}
                          bg="#fff"
                          p="2"
                          rounded="lg"
                        >
                          {product.product_services
                            .filter((service) => !service.is_required)
                            .map((service) => (
                              <Card
                                key={service.id}
                                p={0}
                                borderRadius="lg"
                                border="1px"
                                borderColor={
                                  selectedServices.includes(service.id)
                                    ? "gray.50"
                                    : "gray.50"
                                }
                                bg={"transparent"}
                                shadow="none"
                                transition="all 0.2s"
                                cursor="pointer"
                                onClick={() => handleServiceToggle(service.id)}
                              >
                                <HStack justify="space-between" align="center">
                                  <HStack>
                                    <Checkbox
                                      isChecked={selectedServices.includes(
                                        service.id
                                      )}
                                      onChange={() =>
                                        handleServiceToggle(service.id)
                                      }
                                      colorScheme="blue"
                                    />
                                    <VStack align="start" spacing={0}>
                                      <Text
                                        fontWeight="500"
                                        fontSize="xs"
                                        fontFamily="Bogle"
                                      >
                                        {service.title}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Text
                                    fontWeight="600"
                                    color="gray.700"
                                    fontSize="xs"
                                    fontFamily="Bogle"
                                  >
                                    +{parseFloat(service.price).toFixed(2)} €
                                  </Text>
                                </HStack>
                              </Card>
                            ))}
                        </VStack>
                      </Box>
                    )}
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Grid>
      </Container>

      <Box bg="white" pl={2} pr={2} display={{ base: "block", md: "none" }}>
        <Card
          shadow="none"
          borderRadius="none"
          overflow="hidden"
          bg="gray"
          sx={{
            padding: "0 !important",
          }}
        >
          <CardBody
            bg="white"
            sx={{
              padding: "0 !important",
            }}
          >
            <VStack
              align="stretch"
              spacing={0}
              sx={{
                padding: "0 !important",
              }}
            >
              <Box p={2}>
                {product?.is_available_on_stock ? (
                  <Button
                    size="xs"
                    bg="black"
                    _hover={{ bg: "black" }}
                    _focus={{ bg: "black" }}
                    _active={{ bg: "black" }}
                    color="white"
                    fontFamily="Airbnb Cereal VF"
                  >
                    Available
                  </Button>
                ) : null}

                {product?.is_discounted ? (
                  <Button
                    ml={2}
                    size="xs"
                    bg="black"
                    _hover={{ bg: "black" }}
                    _focus={{ bg: "black" }}
                    _active={{ bg: "black" }}
                    color="white"
                    fontFamily="Airbnb Cereal VF"
                  >
                    Flash Deals
                  </Button>
                ) : null}

                {product?.mark_as_new ? (
                  <Button
                    ml={2}
                    size="xs"
                    bg="black"
                    _hover={{ bg: "black" }}
                    _focus={{ bg: "black" }}
                    _active={{ bg: "black" }}
                    color="white"
                    fontFamily="Airbnb Cereal VF"
                  >
                    New
                  </Button>
                ) : null}

                {product?.discount_percentage_nett >= 25 ? (
                  <Button
                    ml={2}
                    size="xs"
                    bg="black"
                    _hover={{ bg: "black" }}
                    _focus={{ bg: "black" }}
                    _active={{ bg: "black" }}
                    color="white"
                    fontFamily="Airbnb Cereal VF"
                  >
                    Big Sale
                  </Button>
                ) : null}

                <Heading
                  mt={2}
                  fontSize="18px"
                  mb={4}
                  color="gray.800"
                  lineHeight="1.2"
                  fontFamily={"Airbnb Cereal VF"}
                >
                  {product?.title}
                </Heading>
              </Box>

              <Card
                shadow="none"
                borderRadius="5px"
                overflow="hidden"
                mb={0}
                border="0px solid"
                borderColor="gray.200"
                bg="white"
              >
                <CardBody p={0}>
                  <Grid
                    templateColumns={{ base: "1fr", md: "120px 1fr" }}
                    gap={0}
                  >
                    {isMobile ? (
                      <Box w="full" position="relative">
                        <Box
                          borderRadius="none"
                          overflow="hidden"
                          position="relative"
                          bg="transparent"
                          border="0px"
                          borderColor="gray.200"
                          w="100%"
                          h="100%"
                          maxH="600px"
                          minH="300px"
                          p={0}
                          onTouchStart={handleTouchStart}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          <Image
                            src={
                              product?.images?.gallery?.[carouselIndex]?.url ||
                              product?.images?.main_image?.url
                            }
                            alt={product?.title}
                            w="full"
                            h="full"
                            objectFit="100%"
                            minH="300px"
                            maxH="600px"
                          />
                          {/* Carousel navigation arrows */}
                          {product?.images?.gallery?.length > 1 && (
                            <>
                              <IconButton
                                aria-label="Previous image"
                                icon={<FaChevronLeft />}
                                position="absolute"
                                top="50%"
                                left="2"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={() => handleCarouselSwipe("left")}
                                bg="gray.900"
                                _hover={{ bg: "red.600" }}
                                borderRadius="full"
                                size="sm"
                                color="white"
                              />
                              <IconButton
                                aria-label="Next image"
                                icon={<FaChevronRight />}
                                position="absolute"
                                top="50%"
                                right="2"
                                transform="translateY(-50%)"
                                zIndex={2}
                                onClick={() => handleCarouselSwipe("right")}
                                bg="gray.900"
                                _hover={{ bg: "red.600" }}
                                borderRadius="full"
                                size="sm"
                                color="white"
                              />
                            </>
                          )}
                          {/* Dots indicator */}
                          {product?.images?.gallery?.length > 1 && (
                            <HStack
                              position="absolute"
                              bottom="2"
                              left="50%"
                              transform="translateX(-50%)"
                              spacing={1}
                              zIndex={2}
                            >
                              {product?.images.gallery.map((_, idx) => (
                                <Box
                                  key={idx}
                                  w={carouselIndex === idx ? "16px" : "8px"}
                                  h="8px"
                                  borderRadius="full"
                                  bg={
                                    carouselIndex === idx
                                      ? "blue.500"
                                      : "gray.300"
                                  }
                                  transition="all 0.2s"
                                />
                              ))}
                            </HStack>
                          )}
                        </Box>
                      </Box>
                    ) : (
                      <>
                        <VStack spacing={3} order={{ base: 2, md: 1 }} py={1}>
                          {product?.images?.gallery?.map((image, index) => (
                            <Box
                              key={index}
                              w="50px"
                              h="50px"
                              borderRadius="xl"
                              overflow="hidden"
                              borderWidth="0px"
                              cursor="pointer"
                              onClick={() => {
                                setSelectedImage(index);
                                setCarouselIndex(index);
                              }}
                              transition="all 0.3s ease"
                              position="relative"
                              bg="transparent"
                            >
                              <Image
                                src={image.url}
                                alt={image.alt_text}
                                w="full"
                                h="full"
                                objectFit="cover"
                              />
                              {selectedImage === index && (
                                <Box
                                  position="absolute"
                                  top="2"
                                  right="2"
                                  w="3"
                                  h="3"
                                  bg="blue.500"
                                  borderRadius="full"
                                  border="0px"
                                  borderColor="white"
                                />
                              )}
                            </Box>
                          ))}
                        </VStack>

                        <Box position="relative" order={{ base: 1, md: 2 }}>
                          <Box
                            borderRadius="md"
                            overflow="hidden"
                            onMouseEnter={() => setIsImageZoomed(true)}
                            onMouseLeave={() => setIsImageZoomed(false)}
                            onMouseMove={handleImageMouseMove}
                            position="relative"
                            bg="white"
                            border="0px solid"
                            borderColor="gray.200"
                            cursor="zoom-in"
                            width="100%"
                            minHeight={{
                              base: "260px",
                              md: "400px",
                              lg: "600px",
                            }}
                            maxHeight={{
                              base: "320px",
                              md: "500px",
                              lg: "600px",
                            }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            transition="box-shadow 0.2s"
                            boxShadow="none"
                          >
                            <Image
                              src={
                                product?.images?.gallery?.[selectedImage]
                                  ?.url || product?.images?.main_image?.url
                              }
                              alt={product?.title}
                              w="100%"
                              h="100%"
                              maxW="100%"
                              maxH="100%"
                              minH={{
                                base: "260px",
                                md: "400px",
                                lg: "600px",
                              }}
                              objectFit="100%"
                              borderRadius="md"
                              transition="transform 0.4s"
                              transform={
                                isImageZoomed ? "scale(1.5)" : "scale(1)"
                              }
                              transformOrigin={`${mousePosition.x}% ${mousePosition.y}%`}
                              bg="gray.100"
                            />

                            {/* Overlay buttons */}
                            <Box position="absolute" top={4} right={4}>
                              <HStack spacing={2}>
                                <IconButton
                                  icon={<FaExpand />}
                                  onClick={onImageModalOpen}
                                  size="md"
                                  bg="blackAlpha.700"
                                  color="white"
                                  _hover={{ bg: "blackAlpha.800" }}
                                  borderRadius="full"
                                  shadow="lg"
                                  aria-label="Expand image"
                                />
                              </HStack>
                            </Box>

                            {/* Badges overlay */}
                            <Box position="absolute" top={4} left={4}>
                              <VStack spacing={2} align="flex-start">
                                {product?.badges?.is_new && (
                                  <Badge
                                    colorScheme="green"
                                    variant="solid"
                                    fontSize="xs"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    textTransform="uppercase"
                                    fontWeight="bold"
                                    shadow="sm"
                                  >
                                    NEW
                                  </Badge>
                                )}
                                {product?.badges?.is_on_sale && (
                                  <Badge
                                    colorScheme="red"
                                    variant="solid"
                                    fontSize="xs"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    textTransform="uppercase"
                                    fontWeight="bold"
                                    shadow="sm"
                                  >
                                    SALE
                                  </Badge>
                                )}
                                {product?.badges?.free_shipping && (
                                  <Badge
                                    colorScheme="blue"
                                    variant="solid"
                                    fontSize="xs"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    textTransform="uppercase"
                                    fontWeight="bold"
                                    shadow="sm"
                                  >
                                    FREE SHIPPING
                                  </Badge>
                                )}
                              </VStack>
                            </Box>

                            {/* Zoom indicator */}
                            {isImageZoomed && !is360Mode && (
                              <Box
                                position="absolute"
                                bottom={4}
                                left={4}
                                bg="blackAlpha.700"
                                color="white"
                                px={3}
                                py={2}
                                borderRadius="full"
                                fontSize="sm"
                                fontWeight="medium"
                                shadow="md"
                              >
                                <HStack spacing={2}>
                                  <Icon as={FaExpand} fontSize="xs" />
                                  <Text>Zoomed</Text>
                                </HStack>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </>
                    )}
                  </Grid>
                </CardBody>
              </Card>
            </VStack>
          </CardBody>
        </Card>

        <Box p={5}>
          <HStack justify="space-between" mb={2}>
            <Text
              fontWeight="500"
              fontSize="sm"
              color="black"
              fontFamily={"Airbnb Cereal VF"}
            >
              SKU:
            </Text>
            <Text fontSize="sm" fontWeight="500" color="black">
              {product?.sku}
            </Text>
          </HStack>

          <HStack justify="space-between" mb={2}>
            <Text
              fontWeight="500"
              fontSize="sm"
              color="black"
              fontFamily={"Airbnb Cereal VF"}
            >
              EAN number:
            </Text>
            <Text fontSize="sm" fontWeight="500" color="black">
              {product?.ean}
            </Text>
          </HStack>

          <HStack justify="space-between" mb={2}>
            <Text
              fontWeight="500"
              fontSize="sm"
              color="black"
              fontFamily={"Airbnb Cereal VF"}
            >
              Availability
            </Text>

            {/* <Text fontSize="sm" fontWeight="500" color="black">
                  {product.is_available_on_stock ? "🟢" : "🔴"}
                </Text> */}

            <Image
              src={
                product?.is_available_on_stock
                  ? "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/icons/3dicons-tick-dynamic-color.png"
                  : "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/icons/no-stock.png"
              }
              alt="Availability Icon"
              boxSize="20px"
              objectFit="contain"
              filter={
                product?.is_available_on_stock ? "grayscale(0)" : "grayscale(1)"
              }
            />
          </HStack>

          <HStack justify="space-between" mb={2}>
            <Text
              fontWeight="500"
              fontSize="sm"
              color="black"
              fontFamily={"Airbnb Cereal VF"}
            >
              Tax Rate
            </Text>
            <Text fontSize="sm" fontWeight="500" color="black">
              {product?.tax.rate}%
            </Text>
          </HStack>
        </Box>

        <Box p={4}>
          {Array.isArray(product?.custom_options) &&
            product?.custom_options.length > 0 && (
              <Box mb={6}>
                <Heading
                  size="md"
                  mb={4}
                  color="gray.800"
                  fontWeight="500"
                  letterSpacing="tight"
                  fontFamily={"Airbnb Cereal VF"}
                >
                  Options configurables
                </Heading>
                <VStack align="stretch" spacing={5}>
                  {product?.is_dimensional_pricing && pricingConfig && (
                    <Box
                      mb={6}
                      p={4}
                      borderWidth={0}
                      borderRadius="md"
                      bg="transparent"
                    >
                      <Text
                        fontSize="md"
                        fontWeight="500"
                        mb={3}
                        fontFamily={"Bogle"}
                      >
                        Personnaliser les dimensions
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        mb={4}
                        fontFamily={"Bogle"}
                      >
                        Calculation Type:{" "}
                        {pricingConfig?.dimensional_calculation_type}
                      </Text>

                      <VStack spacing={4}>
                        {pricingConfig?.required_dimensions.map((dimension) => (
                          <FormControl key={dimension}>
                            <FormLabel
                              textTransform="capitalize"
                              fontSize="sm"
                              fontWeight="medium"
                              fontFamily={"Bogle"}
                            >
                              {dimension} (cm)
                            </FormLabel>
                            <Input
                              type="number"
                              placeholder={`Enter ${dimension}`}
                              value={customDimensions[dimension] || ""}
                              onChange={(e) =>
                                handleDimensionChange(dimension, e.target.value)
                              }
                              min={
                                pricingConfig.dimension_constraints[dimension]
                                  ?.min || 0
                              }
                              max={
                                pricingConfig.dimension_constraints[dimension]
                                  ?.max || undefined
                              }
                              size="md"
                            />
                            {pricingConfig.dimension_constraints[dimension] && (
                              <FormHelperText fontSize="xs">
                                Min:{" "}
                                {
                                  pricingConfig.dimension_constraints[dimension]
                                    .min
                                }{" "}
                                - Max:{" "}
                                {pricingConfig.dimension_constraints[dimension]
                                  .max || "No limit"}
                              </FormHelperText>
                            )}
                          </FormControl>
                        ))}
                      </VStack>

                      {calculationError && (
                        <Alert status="error" mt={4}>
                          <AlertIcon />
                          {calculationError}
                        </Alert>
                      )}
                    </Box>
                  )}

                  {product.custom_options
                    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                    .map((option) => {
                      let filteredOptionValues = option.option_values;
                      const allowedIds = getAllowedOptionValueIds(
                        selectedCustomOptions,
                        product,
                        option
                      );
                      if (allowedIds) {
                        filteredOptionValues = filteredOptionValues.filter(
                          (v) => allowedIds.includes(v.id)
                        );
                      }

                      // Sort filtered option values by sort_order
                      filteredOptionValues = filteredOptionValues.sort(
                        (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
                      );
                      return (
                        <Box key={option.id}>
                          <Text
                            fontWeight="500"
                            fontSize="sm"
                            fontFamily={"Airbnb Cereal VF"}
                            mb={3}
                            color="gray.900"
                          >
                            {option?.option_name}
                            {option?.is_required && (
                              <Text as="span" color="red.500" ml={1}>
                                *
                              </Text>
                            )}
                          </Text>

                          {option?.option_type === "radio" && (
                            <RadioGroup
                              value={
                                selectedCustomOptions[option.id]?.valueId || ""
                              }
                              onChange={(valueId) => {
                                const selectedValue = filteredOptionValues.find(
                                  (v) => v.id === valueId
                                );
                                if (selectedValue) {
                                  handleCustomOptionChange(
                                    option.id,
                                    valueId,
                                    selectedValue.option_value,
                                    selectedValue.price_modifier,
                                    selectedValue.price_modifier_type
                                  );
                                }
                              }}
                            >
                              <Box
                                overflowX="auto"
                                overflowY="hidden"
                                pb={2}
                                css={{
                                  "&::-webkit-scrollbar": {
                                    height: "6px",
                                  },
                                  "&::-webkit-scrollbar-track": {
                                    background: "#f7fafc",
                                    borderRadius: "3px",
                                  },
                                  "&::-webkit-scrollbar-thumb": {
                                    background: "#e2e8f0",
                                    borderRadius: "3px",
                                  },
                                  "&::-webkit-scrollbar-thumb:hover": {
                                    background: "#cbd5e0",
                                  },
                                }}
                              >
                                <HStack spacing={3} align="stretch">
                                  {filteredOptionValues.map((value) => (
                                    <Box
                                      key={value.id}
                                      as="label"
                                      cursor="pointer"
                                      minW="110px"
                                      maxW="110px"
                                      flexShrink={0}
                                    >
                                      <Card
                                        p={0}
                                        borderRadius="2.5px"
                                        border="0px"
                                        borderColor={
                                          selectedCustomOptions[option.id]
                                            ?.valueId === value.id
                                            ? "gray.400"
                                            : "gray.400"
                                        }
                                        _hover={{
                                          borderColor: "red.600",
                                        }}
                                        transition="all 0.2s"
                                        bg="transparent"
                                        position="relative"
                                        minH="100px"
                                        maxH="200px"
                                        display="flex"
                                        shadow="none"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                      >
                                        {value.image_url && (
                                          <Box
                                            w="full"
                                            h="auto"
                                            borderRadius="0px"
                                            overflow="hidden"
                                            bg="transparent"
                                            mb={0}
                                          >
                                            <Image
                                              src={value.image_url}
                                              alt={
                                                value.display_name ||
                                                value.option_value
                                              }
                                              w="full"
                                              h="100px"
                                              maxH="100px"
                                              objectFit="100%"
                                            />
                                          </Box>
                                        )}
                                        <Text
                                          fontSize="xs"
                                          fontWeight="medium"
                                          textAlign="center"
                                          noOfLines={2}
                                          fontFamily={"Airbnb Cereal VF"}
                                          mb={1}
                                        >
                                          {value.display_name ||
                                            value.option_value}
                                        </Text>
                                        {(() => {
                                          const priceModifier = parseFloat(
                                            value.price_modifier || 0
                                          );
                                          const pricePerM2 = parseFloat(
                                            value.price_per_m2 || 0
                                          );
                                          const pricePerM3 = parseFloat(
                                            value.price_per_m3 || 0
                                          );
                                          const pricePerLinearMeter =
                                            parseFloat(
                                              value.price_per_linear_meter || 0
                                            );
                                          const pricePerMeter = parseFloat(
                                            value.price_per_meter || 0
                                          );

                                          let displayPrice = 0;
                                          let displayUnit = "";

                                          switch (value.price_modifier_type) {
                                            case "m2":
                                              displayPrice = pricePerM2;
                                              displayUnit = "€/m²";
                                              break;
                                            case "m3":
                                              displayPrice = pricePerM3;
                                              displayUnit = "€/m³";
                                              break;
                                            case "linear-meter":
                                              displayPrice =
                                                pricePerLinearMeter;
                                              displayUnit = "€/m";
                                              break;
                                            case "meter":
                                              displayPrice = pricePerMeter;
                                              displayUnit = "€/m";
                                              break;
                                            case "percentage":
                                              displayPrice = priceModifier;
                                              displayUnit = "%";
                                              break;
                                            case "fixed":
                                            default:
                                              displayPrice = priceModifier;
                                              displayUnit = "€";
                                          }

                                          if (displayPrice > 0) {
                                            return (
                                              <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                color="green.600"
                                                fontFamily="Bogle"
                                              >
                                                {/* +{displayPrice.toFixed(2)}
                                            {displayUnit} */}
                                              </Text>
                                            );
                                          } else if (displayPrice < 0) {
                                            return (
                                              <Text
                                                fontSize="xs"
                                                fontWeight="bold"
                                                color="red.600"
                                                fontFamily="Bogle"
                                              >
                                                {/* {displayPrice.toFixed(2)}
                                            {displayUnit} */}
                                              </Text>
                                            );
                                          } else {
                                            return (
                                              <Text
                                                fontSize="xs"
                                                color="gray.500"
                                                fontFamily="Bogle"
                                              >
                                                Included
                                              </Text>
                                            );
                                          }
                                        })()}
                                        <Radio
                                          value={value.id}
                                          colorScheme="blue"
                                          position="absolute"
                                          top={2}
                                          right={2}
                                          size="sm"
                                        />
                                      </Card>
                                    </Box>
                                  ))}
                                </HStack>
                              </Box>
                            </RadioGroup>
                          )}

                          {option.option_type === "select" && (
                            <Select
                              placeholder={`Choose ${option.option_name}`}
                              size="md"
                              borderRadius="md"
                              value={
                                selectedCustomOptions[option.id]?.valueId || ""
                              }
                              onChange={(e) => {
                                const selectedValue =
                                  option.option_values?.find(
                                    (v) => v.id === e.target.value
                                  );
                                if (selectedValue) {
                                  handleCustomOptionChange(
                                    option.id,
                                    e.target.value,
                                    selectedValue.option_value,
                                    selectedValue.price_modifier,
                                    selectedValue.price_modifier_type
                                  );
                                }
                              }}
                            >
                              {option.option_values?.map((value) => (
                                <option key={value.id} value={value.id}>
                                  {value.display_name || value.option_value}
                                  {parseFloat(value.price_modifier) > 0 &&
                                    (value.price_modifier_type === "percentage"
                                      ? ` (+${value.price_modifier}%)`
                                      : ` (+${value.price_modifier}€)`)}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Box>
                      );
                  })}
                </VStack>
              </Box>
            )}
        </Box>

        <Divider />

        <Box>
          <Box p={4}>
            <Divider mb={4} />

            {/* Mobile Total Price Display */}
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between" align="center">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.800"
                  fontFamily="Airbnb Cereal VF"
                >
                  Total Price:
                </Text>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="gray.700"
                  fontFamily="Airbnb Cereal VF"
                >
                  {calculateTotalPrice().toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </HStack>

              {/* Mobile Calculation Loading */}
              {isCalculating && (
                <HStack justify="center">
                  <Spinner size="sm" />
                  <Text fontSize="sm" color="gray.600">
                    Calculating...
                  </Text>
                </HStack>
              )}

              {/* Mobile Pricing Breakdown */}
              {/* {pricingData?.pricing && (
                <VStack
                  align="stretch"
                  spacing={2}
                  fontSize="sm"
                  color="gray.600"
                >
                  <HStack justify="space-between">
                    <Text>Base Product:</Text>
                    <Text>
                      €{pricingData.pricing.base_product.gross.toFixed(2)}
                    </Text>
                  </HStack>
                  {pricingData.pricing.custom_options.gross > 0 && (
                    <HStack justify="space-between">
                      <Text>Options:</Text>
                      <Text>
                        €{pricingData.pricing.custom_options.gross.toFixed(2)}
                      </Text>
                    </HStack>
                  )}
                  {selectedServices.length > 0 && (
                    <HStack justify="space-between">
                      <Text>Services:</Text>
                      <Text>
                        €
                        {selectedServices
                          .reduce((sum, serviceId) => {
                            const service = productServices.find(
                              (s) => s.id === serviceId
                            );
                            return (
                              sum +
                              (service ? parseFloat(service.price || 0) : 0)
                            );
                          }, 0)
                          .toFixed(2)}
                      </Text>
                    </HStack>
                  )}
                  {pricingData.pricing.percentage_adjustments.amount !== 0 && (
                    <HStack justify="space-between">
                      <Text>Adjustments:</Text>
                      <Text>
                        €
                        {pricingData.pricing.percentage_adjustments.amount.toFixed(
                          2
                        )}
                      </Text>
                    </HStack>
                  )}
                  <Text fontSize="xs" color="gray.500">
                    Unit Price: €
                    {pricingData.pricing.final.unit_price_gross.toFixed(2)} ×{" "}
                    {quantity}
                  </Text>
                </VStack>
              )} */}

              {/* Mobile Discount Display */}
              {product?.pricing.is_discounted && (
                <VStack align="stretch" spacing={2}>
                  {/* <HStack justify="space-between">
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      textDecoration="line-through"
                    >
                      Original Price:
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      textDecoration="line-through"
                    >
                      {(
                        product.pricing.regular_price.gross * quantity
                      ).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                      })}
                    </Text>
                  </HStack> */}

                  <Badge
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="full"
                    fontWeight="bold"
                    bg="red.500"
                    color="white"
                    alignSelf="flex-start"
                  >
                    -
                    {product?.pricing.discount.percentage_nett ||
                      product?.pricing.discount.percentage_gross}
                    % OFF
                  </Badge>
                </VStack>
              )}

              {/* Mobile VAT Info */}
              <VStack align="stretch" spacing={1}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Including VAT ({product?.tax.rate}%)
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Services of Product */}
          <br />
          {Array.isArray(product?.product_services) &&
            product?.product_services.length > 0 && (
              <Box mb={0} p="0">
                <Heading
                  size="sm"
                  mb={4}
                  color="gray.800"
                  fontWeight="500"
                  letterSpacing="tight"
                  fontFamily="Airbnb Cereal VF"
                >
                  Optional Services of Product
                </Heading>

                <VStack
                  align="stretch"
                  spacing={3}
                  bg="#fff"
                  p="2"
                  rounded="lg"
                >
                  {product.product_services
                    .filter((service) => !service.is_required)
                    .map((service) => (
                      <Card
                        key={service.id}
                        p={0}
                        borderRadius="lg"
                        border="1px"
                        borderColor={
                          selectedServices.includes(service.id)
                            ? "gray.50"
                            : "gray.50"
                        }
                        bg={"transparent"}
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <HStack justify="space-between" align="center">
                          <HStack>
                            <Checkbox
                              isChecked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                              colorScheme="blue"
                            />
                            <VStack align="start" spacing={0}>
                              <Text
                                fontWeight="500"
                                fontSize="xs"
                                fontFamily="Airbnb Cereal VF"
                              >
                                {service.title}
                              </Text>
                            </VStack>
                          </HStack>
                          <Text
                            fontWeight="600"
                            color="gray.700"
                            fontSize="xs"
                            fontFamily="Airbnb Cereal VF"
                          >
                            +{parseFloat(service.price).toFixed(2)} €
                          </Text>
                        </HStack>
                      </Card>
                    ))}
                </VStack>
              </Box>
            )}

          {/* Add to Cart and Quantity */}
          <HStack spacing={2} w="full" align="stretch" mt={5}>
            <Box w="30%">
              <Text fontWeight="semibold" mb={2} fontSize="sm" color="gray.900">
                Quantity
              </Text>
              <VStack spacing={0} align="stretch">
                <HStack
                  w="full"
                  bg="gray.50"
                  borderRadius="lg"
                  py={1}
                  border="1px"
                  borderColor="gray.200"
                >
                  <IconButton
                    icon={<FaMinus />}
                    size="xs"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    isDisabled={quantity <= 1}
                    variant="ghost"
                    borderRadius="md"
                    aria-label="Decrease quantity"
                    minW="25px"
                    h="25px"
                  />
                  <Box
                    flex={1}
                    textAlign="center"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg="transparent"
                  >
                    <Input
                      type="number"
                      min={1}
                      max={999}
                      value={quantity}
                      onChange={(e) => {
                        const val = Math.max(
                          1,
                          Math.min(999, parseInt(e.target.value) || 1)
                        );
                        setQuantity(val);
                      }}
                      fontSize="lg"
                      fontWeight="bold"
                      color="gray.800"
                      textAlign="center"
                      border="none"
                      bg="transparent"
                      p={1}
                      h="32px"
                      w="full"
                      _focus={{
                        boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                        bg: "white",
                        borderRadius: "md",
                      }}
                      _hover={{
                        bg: "white",
                        borderRadius: "md",
                      }}
                      fontFamily="Bogle"
                    />
                  </Box>
                  <IconButton
                    icon={<FaPlus />}
                    size="xs"
                    onClick={() => setQuantity(quantity + 1)}
                    variant="ghost"
                    borderRadius="md"
                    aria-label="Increase quantity"
                    minW="25px"
                    h="25px"
                  />
                </HStack>
              </VStack>
            </Box>

            <Box w="70%" alignSelf="flex-end">
              <Button
                color="white"
                fontFamily="Airbnb Cereal VF"
                size="md"
                bg="#000000ff"
                _hover={{ bg: "#000000ff" }}
                _focus={{ bg: "#000000ff" }}
                _active={{ bg: "#000000ff" }}
                w="full"
                h="auto"
                py={3}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </Box>
          </HStack>

          {/* At a glance */}
          {product?.custom_details.length >= 1 && (
            <Text
              fontSize={"md"}
              fontWeight={"600"}
              fontFamily="Airbnb Cereal VF"
              mt={5}
            >
              At a glance
            </Text>
          )}

          <SimpleGrid columns={{ base: 2 }} spacing={4} mb={2} mt={5}>
            {product?.custom_details?.slice(0, 6).map((detail) => (
              <Card
                key={detail.key}
                p={3}
                borderRadius="lg"
                border="0px"
                borderColor="gray.200"
                bg="gray.100"
                shadow="sm"
              >
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontWeight="500"
                  mb={1}
                  textAlign={"center"}
                  fontFamily="Airbnb Cereal VF"
                >
                  {detail.label}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.800"
                  fontWeight="500s"
                  noOfLines={2}
                  textAlign={"center"}
                  fontFamily="Airbnb Cereal VF"
                >
                  {detail.value}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          {product?.custom_details && product.custom_details.length > 6 && (
            <Button
              size="sm"
              variant="link"
              color="blue.600"
              fontWeight="500"
              align="center"
              fontFamily="Airbnb Cereal VF"
              justifyContent="center"
              display="flex"
              onClick={() => setIsCustomDetailsModalOpen(true)}
              mb={4}
            >
              View all
            </Button>
          )}

          {/* About this item. */}
          <Box>
            <Text
              fontSize="md"
              fontFamily="Airbnb Cereal VF"
              fontWeight="600"
              color="black"
              mt={10}
              ml={3}
            >
              About this item
            </Text>

            <Accordion allowMultiple maxW={{ base: "100%", md: "100%" }} mt={5}>
              {/* Product Details Accordion */}
              <AccordionItem
                borderTopWidth={"1px"}
                borderTopColor={"gray.200"}
                mb={1}
              >
                <h2>
                  <AccordionButton
                    py={4}
                    px={6}
                    _hover={{ bg: "gray.50" }}
                    borderRadius="lg"
                  >
                    <Box flex="1" textAlign="left">
                      <Text
                        fontSize="md"
                        fontWeight="500"
                        fontFamily="Airbnb Cereal VF"
                        color="gray.800"
                      >
                        Product Details
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={6} px={6}>
                  <Box
                    fontSize="sm"
                    color="gray.700"
                    lineHeight="1.6"
                    border="none"
                    fontFamily="Bogle"
                    sx={{
                      p: { margin: 0, marginBottom: "1em" },
                      br: { display: "block", marginBottom: "0.5em" },
                      strong: { fontWeight: "600" },
                      em: { fontStyle: "italic" },
                      ul: { paddingLeft: "1.5em", marginBottom: "1em" },
                      ol: { paddingLeft: "1.5em", marginBottom: "1em" },
                      li: { marginBottom: "0.25em" },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: product?.description
                        ? product.description.replace(/ style="[^"]*"/g, "")
                        : "No product description available.",
                    }}
                  />
                </AccordionPanel>
              </AccordionItem>

              {/* Specifications Accordion */}
              <AccordionItem
                borderTopWidth={"1px"}
                borderTopColor={"gray.200"}
                mb={1}
              >
                <h2>
                  <AccordionButton
                    py={4}
                    px={6}
                    _hover={{ bg: "gray.50" }}
                    borderRadius="lg"
                  >
                    <Box flex="1" textAlign="left">
                      <Text
                        fontSize="md"
                        fontWeight="500"
                        fontFamily="Airbnb Cereal VF"
                        color="gray.800"
                      >
                        Specifications
                      </Text>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={6} px={6}>
                  {product?.custom_details &&
                  product?.custom_details.length > 0 ? (
                    <Box overflowX="auto">
                      <VStack spacing={0} align="stretch">
                        {product?.custom_details?.map((detail, index) => (
                          <HStack
                            key={detail.key}
                            py={3}
                            px={0}
                            borderBottom={
                              index < product.custom_details.length - 1
                                ? "1px solid"
                                : "none"
                            }
                            borderColor="gray.100"
                            justify="space-between"
                            align="flex-start"
                          >
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.600"
                              fontFamily="Bogle"
                              minW="120px"
                              maxW="200px"
                            >
                              {detail.label}
                            </Text>
                            <Text
                              fontSize="sm"
                              color="gray.800"
                              fontFamily="Bogle"
                              textAlign="right"
                              flex="1"
                              wordBreak="break-word"
                            >
                              {detail.value}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  ) : (
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      fontStyle="italic"
                      fontFamily="Bogle"
                    >
                      No specifications available for this product.
                    </Text>
                  )}
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Box>
        </Box>
      </Box>

      {/* Recommended products */}
      {product?.slug && (
        <RecommendedProducts
          productSlug={product.slug}
          title="Vous aimerez peut-être aussi"
        />
      )}

      <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} size="full">
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" shadow="none" m={0}>
          <ModalCloseButton
            color="white"
            size="lg"
            top={8}
            right={8}
            bg="blackAlpha.600"
            borderRadius="full"
            _hover={{ bg: "blackAlpha.800" }}
          />
          <ModalBody
            p={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box maxW="90vw" maxH="90vh">
              <Image
                src={
                  product?.images?.gallery?.[selectedImage]?.url ||
                  product?.images?.main_image?.url
                }
                alt={product?.title}
                objectFit="contain"
                borderRadius="lg"
                maxW="full"
                maxH="full"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Open Details Of Product Modal */}
      <Modal
        isOpen={isCustomDetailsModalOpen}
        onClose={() => setIsCustomDetailsModalOpen(false)}
        size={{ base: "sm", md: "4xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="Bricolage Grotesque">
            Specification Details
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box overflowX="auto">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        borderBottom: "1px solid #e2e8f0",
                        fontFamily: "Bricolage Grotesque",
                        fontSize: "14px",
                        color: "#4A5568",
                      }}
                    >
                      Label
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "8px",
                        borderBottom: "1px solid #e2e8f0",
                        fontFamily: "Bricolage Grotesque",
                        fontSize: "14px",
                        color: "#4A5568",
                      }}
                    >
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product?.custom_details?.map((detail) => (
                    <tr key={detail.key}>
                      <td
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid #f1f1f1",
                          fontFamily: "Bricolage Grotesque",
                          fontSize: "14px",
                          color: "#2D3748",
                          fontWeight: 500,
                        }}
                      >
                        {detail?.label}
                      </td>
                      <td
                        style={{
                          padding: "8px",
                          borderBottom: "1px solid #f1f1f1",
                          fontFamily: "Bricolage Grotesque",
                          fontSize: "14px",
                          color: "#2D3748",
                        }}
                      >
                        {detail?.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Footer />
    </Box>
  );
}

export default CustomerProductPage;
