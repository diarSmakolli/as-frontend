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

function CustomerProductPage() {
  const { slug } = useParams();
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

  // Product details state
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

  // 3d
  const [is360Mode, setIs360Mode] = useState(false);

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
    // Images
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
    // Categories
    const categories = raw.categories || [];
    // Custom details
    const custom_details = raw.custom_details || [];
    // Custom options
    const custom_options = raw.custom_options || [];
    // Services
    const product_services = raw.product_services || [];
    // Company/Supplier/Tax
    const company = raw.company || {};
    const supplier = raw.supplier || {};
    const tax = raw.tax || {};
    // Pricing
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

  const fetchProductDetails = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await homeService.getProductBySlug(slug);
      if (response.data?.status === "success") {
        setProduct(normalizeProduct(response.data.data));
        setProductServices(response.data.data.product_services || []);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load product details",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setLoading(false);
    }
  }, [slug, toast]);

  const fetchCategories = async () => {
    try {
      const response = await homeService.getAllCategories();
      const categoriesData = response.data || [];
      setCategories(categoriesData);

      // Extract top-level categories for navigation
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

  // Calculate total price including services and custom options
  const calculateTotalPrice = () => {
    if (!product) return 0;

    // Start from the base price (final_price.gross)
    let basePrice = product.pricing.final_price.gross || 0;

    // Add selected services price
    let servicesPrice = selectedServices.reduce((sum, serviceId) => {
      const service = productServices.find((s) => s.id === serviceId);
      return sum + (service ? parseFloat(service.price || 0) : 0);
    }, 0);

    // Add custom options price
    let customOptionsPrice = Object.entries(selectedCustomOptions).reduce(
      (sum, [optionId, valueData]) => {
        if (valueData && valueData.price_modifier) {
          if (valueData.price_modifier_type === "percentage") {
            return (
              sum + (basePrice * parseFloat(valueData.price_modifier)) / 100
            );
          } else {
            return sum + parseFloat(valueData.price_modifier);
          }
        }
        return sum;
      },
      0
    );

    // Total for one quantity
    const totalOne = basePrice + servicesPrice + customOptionsPrice;

    // Multiply by quantity
    return totalOne * quantity;
  };

  // Handle service selection
  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Handle custom option selection
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

  // Handle image zoom on mouse move
  const handleImageMouseMove = (e) => {
    if (!isImageZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

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
      <Box minH="100vh" bg="gray.50">
        <Container maxW="1400px" py={8}>
          <Skeleton height="400px" borderRadius="xl" mb={6} />
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <VStack spacing={4}>
              <Skeleton height="20px" />
              <Skeleton height="40px" />
              <Skeleton height="60px" />
            </VStack>
            <VStack spacing={4}>
              <Skeleton height="300px" />
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box
        minH="100vh"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={6}>
          <Icon as={FaBox} fontSize="6xl" color="gray.300" />
          <VStack spacing={3}>
            <Heading size="lg" color="gray.600">
              Product not found
            </Heading>
            <Text color="gray.500" textAlign="center">
              The product you're looking for doesn't exist or has been removed.
            </Text>
          </VStack>
          <Button onClick={() => navigate("/")} colorScheme="blue" size="lg">
            Return Home
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="white">
      <Navbar />

      <Box
        bg="white"
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
            >
              Home
            </Button>
            <Icon as={FaChevronRight} fontSize="xs" color="gray.400" />
            {product.categories?.map((category, index) => (
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
                  {category.name}
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
                              product.images?.gallery?.[carouselIndex]?.url ||
                              product.images?.main_image?.url
                            }
                            alt={product.title}
                            w="full"
                            h="full"
                            objectFit="cover"
                          />
                          {/* Carousel navigation arrows */}
                          {product.images?.gallery?.length > 1 && (
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
                          {product.images?.gallery?.length > 1 && (
                            <HStack
                              position="absolute"
                              bottom="2"
                              left="50%"
                              transform="translateX(-50%)"
                              spacing={1}
                              zIndex={2}
                            >
                              {product.images.gallery.map((_, idx) => (
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
                        {product.images?.gallery?.map((image, index) => (
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
                              product.images?.gallery?.[selectedImage]?.url ||
                              product.images?.main_image?.url
                            }
                            alt={product.title}
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
                              {product.badges?.is_new && (
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
                              {product.badges?.is_on_sale && (
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
                              {product.badges?.free_shipping && (
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

            {/* About this item only if product does have custom options */}
            <Box>
              <Text
                fontSize={"md"}
                fontFamily={"Bricolage Grotesque"}
                fontWeight={"bold"}
                color="black"
                mt={10}
                ml={3}
              >
                About this item
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
                          fontWeight="semibold"
                          fontFamily="Bricolage Grotesque"
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
                      fontFamily="Bricolage Grotesque"
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
                          fontWeight="semibold"
                          fontFamily="Bricolage Grotesque"
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
                                fontFamily="Bricolage Grotesque"
                                minW="120px"
                                maxW="200px"
                              >
                                {detail.label}
                              </Text>
                              <Text
                                fontSize="sm"
                                color="gray.800"
                                fontFamily="Bricolage Grotesque"
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
                        fontFamily="Bricolage Grotesque"
                      >
                        No specifications available for this product.
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
                    {product.is_available_on_stock ? (
                      <Button
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        Available
                      </Button>
                    ) : null}

                    {product.is_discounted ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        Flash Deals
                      </Button>
                    ) : null}

                    {product.mark_as_new ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        New
                      </Button>
                    ) : null}

                    {product.discount_percentage_nett >= 25 ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        Big Sale
                      </Button>
                    ) : null}

                    {product.categories.length >= 1
                      ? product.categories.map((category) => (
                          <Button
                            key={category.id}
                            ml={1}
                            size="xs"
                            bg="navy"
                            _hover={{ bg: "navy.200" }}
                            _focus={{ bg: "navy.200" }}
                            _active={{ bg: "navy.200" }}
                            color="white"
                            fontFamily={"Bricolage Grotesque"}
                          >
                            {category.name}
                          </Button>
                        ))
                      : null}

                    <Heading
                      mt={2}
                      fontSize="20px"
                      mb={4}
                      color="gray.800"
                      lineHeight="1.2"
                      fontFamily={"Bricolage Grotesque"}
                    >
                      {product.title}
                    </Heading>
                  </Box>
                  {Array.isArray(product.custom_options) &&
                    product.custom_options.length > 0 && (
                      <Box mb={6}>
                        <Heading
                          size="sm"
                          mb={4}
                          color="gray.800"
                          fontWeight="500"
                          letterSpacing="tight"
                          fontFamily={"Bricolage Grotesque"}
                        >
                          {/* <Icon as={FaPalette} mr={2} color="purple.500" />{" "} */}
                          Configurable Options
                        </Heading>
                        <VStack align="stretch" spacing={5}>
                          {product.custom_options.map((option) => (
                            <Box key={option.id}>
                              <Text
                                fontWeight="400"
                                fontSize="sm"
                                fontFamily={"Bricolage Grotesque"}
                                mb={2}
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
                                    selectedCustomOptions[option.id]?.valueId ||
                                    ""
                                  }
                                  onChange={(valueId) => {
                                    const selectedValue =
                                      option.option_values?.find(
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
                                  <SimpleGrid
                                    columns={{ base: 2, sm: 3, md: 4 }}
                                    spacing={5}
                                  >
                                    {option.option_values?.map((value) => (
                                      <Box
                                        key={value.id}
                                        as="label"
                                        cursor="pointer"
                                      >
                                        <Card
                                          p={0}
                                          borderRadius="0"
                                          border="0px"
                                          borderColor={
                                            selectedCustomOptions[option.id]
                                              ?.valueId === value.id
                                              ? "gray.100"
                                              : "gray.200"
                                          }
                                          _hover={{
                                            borderColor:
                                              selectedCustomOptions[option.id]
                                                ?.valueId === value.id
                                                ? "purple.300"
                                                : "purple.300",
                                          }}
                                          transition="all 0.2s"
                                          bg="#fff"
                                          position="relative"
                                          minW="100px"
                                          minH="110px"
                                          display="flex"
                                          flexDirection="column"
                                          alignItems="center"
                                          justifyContent="center"
                                        >
                                          {value.image_url && (
                                            <Box
                                              w="full"
                                              h="70px"
                                              borderRadius="0"
                                              overflow="hidden"
                                              bg="gray.100"
                                              mb={2}
                                            >
                                              <Image
                                                src={value.image_url}
                                                alt={
                                                  value.display_name ||
                                                  value.option_value
                                                }
                                                w="full"
                                                h="full"
                                                objectFit="cover"
                                              />
                                            </Box>
                                          )}
                                          <Text
                                            fontSize="sm"
                                            fontWeight="medium"
                                            textAlign="center"
                                            noOfLines={2}
                                            fontFamily={"Bricolage Grotesque"}
                                          >
                                            {value.display_name ||
                                              value.option_value}
                                          </Text>
                                          {parseFloat(value.price_modifier) >
                                          0 ? (
                                            <Text
                                              fontSize="xs"
                                              fontWeight="bold"
                                              color="black"
                                              fontFamily={"Bricolage Grotesque"}
                                            >
                                              {parseFloat(
                                                value.price_modifier
                                              ).toFixed(2)}
                                              €
                                            </Text>
                                          ) : parseFloat(value.price_modifier) <
                                            0 ? (
                                            <Text
                                              fontSize="xs"
                                              fontWeight="bold"
                                              color="red.600"
                                              fontFamily={"Bricolage Grotesque"}
                                            >
                                              {parseFloat(
                                                value.price_modifier
                                              ).toFixed(2)}
                                              €
                                            </Text>
                                          ) : (
                                            <Text
                                              fontSize="xs"
                                              color="gray.500"
                                              fontFamily={"Bricolage Grotesque"}
                                            >
                                              Included
                                            </Text>
                                          )}
                                          <Radio
                                            value={value.id}
                                            colorScheme="purple"
                                            position="absolute"
                                            top={2}
                                            right={2}
                                            size="sm"
                                          />
                                        </Card>
                                      </Box>
                                    ))}
                                  </SimpleGrid>
                                </RadioGroup>
                              )}

                              {option.option_type === "select" && (
                                <Select
                                  placeholder={`Choose ${option.option_name}`}
                                  size="lg"
                                  borderRadius="lg"
                                  value={
                                    selectedCustomOptions[option.id]?.valueId ||
                                    ""
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
                                        ` (+${value.price_modifier}€)`}
                                    </option>
                                  ))}
                                </Select>
                              )}
                            </Box>
                          ))}
                        </VStack>
                      </Box>
                    )}
                  <Divider />
                  <br />

                  {product.description && (
                    <Box>
                      <Text
                        fontWeight="500"
                        fontSize="sm"
                        color="black"
                        fontFamily="Bricolage Grotesque"
                        mb={2}
                      >
                        About this product:
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

                  {/* Display a promotion Card if this does not have custom options  Sponsored */}
                  {/* {!product.custom_options ||
                  product.custom_options.length === 0 ? (
                    <>
                      <Box
                        bg="transparent"
                        borderRadius="lg"
                        overflow="hidden"
                        mb={4}
                        mt={5}
                      >
                        <Text textAlign={'end'} fontSize={'xs'} color='gray.400'>Sponsored</Text>
                        <Image
                          src="https://img.freepik.com/free-vector/big-sale-banner-design-vector-illustration_157027-501.jpg?semt=ais_hybrid&w=740"
                          alt="Promotion Banner"
                          width="full"
                          height="auto"
                          maxH='370px'
                          objectFit="fill"
                          borderRadius="lg"
                          cursor="pointer"
                          transition="transform 0.2s"
                          _hover={{
                            transform: "scale(1.02)",
                          }}
                          mt={2}
                          onClick={() => {
                            // Handle promotion click - navigate to promotion page or open modal
                          }}
                        />
                      </Box>
                    </>
                  ) : null} */}

                  <br />

                  {product.custom_details.length >= 1 && (
                    <Text
                      fontSize={"sm"}
                      fontWeight={"bold"}
                      fontFamily={"Bricolage Grotesque"}
                    >
                      At a glance
                    </Text>
                  )}

                  <SimpleGrid
                    columns={{ base: 1, sm: 2, md: 3 }}
                    spacing={4}
                    mb={2}
                    mt={5}
                  >
                    {product.custom_details?.slice(0, 6).map((detail) => (
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

                  {product.custom_details &&
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
                        View all
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
              bg="gray.100"
            >
              <CardBody p={2}>
                <VStack align="stretch" spacing={8}>
                  {/* Enhanced Product Title & Seller */}
                  <Box>
                    <Heading
                      fontSize="25px"
                      mb={0}
                      color="gray.800"
                      lineHeight="1.2"
                      fontFamily={"Bricolage Grotesque"}
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
                            {/* Main price row */}
                            <HStack align="center" spacing={4}>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="gray.700"
                                fontFamily="Bricolage Grotesque"
                              >
                                {calculateTotalPrice().toLocaleString("fr-FR", {
                                  style: "currency",
                                  currency: "EUR",
                                  minimumFractionDigits: 2,
                                })}
                              </Text>
                              {product.pricing.is_discounted && (
                                <Badge
                                  fontSize="md"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                  fontWeight="bold"
                                  letterSpacing="wide"
                                  bg="red"
                                  fontFamily={"Bricolage Grotesque"}
                                  color="white"
                                >
                                  -
                                  {product.pricing.discount.percentage_nett ||
                                    product.pricing.discount.percentage_gross}
                                  %
                                </Badge>
                              )}
                            </HStack>
                            {/* Old price and savings */}
                            {product.pricing.is_discounted && (
                              <HStack spacing={3}>
                                <Text
                                  as="span"
                                  fontSize="md"
                                  color="gray.500"
                                  textDecoration="line-through"
                                  fontWeight="medium"
                                >
                                  {(
                                    product.pricing.regular_price.gross *
                                    quantity
                                  ).toLocaleString("fr-FR", {
                                    style: "currency",
                                    currency: "EUR",
                                    minimumFractionDigits: 2,
                                  })}
                                </Text>
                              </HStack>
                            )}

                            <Divider my={2} />
                            {/* VAT info */}
                            <HStack spacing={2}>
                              <Text fontSize="sm" color="gray.600">
                                Including VAT ({product.tax.rate}%)
                              </Text>
                              <Text fontSize="sm" color="gray.400">
                                |
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                Price without VAT:{" "}
                                <b>
                                  {/* Calculate net price for all quantities and options */}
                                  {(() => {
                                    // Base net price
                                    let baseNet =
                                      product.pricing.final_price.nett || 0;
                                    return (baseNet * quantity).toLocaleString(
                                      "fr-FR",
                                      {
                                        style: "currency",
                                        currency: "EUR",
                                        minimumFractionDigits: 2,
                                      }
                                    );
                                  })()}
                                </b>
                              </Text>
                            </HStack>

                            <Box>
                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily={"Bricolage Grotesque"}
                                >
                                  SKU:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product.sku}
                                </Text>
                              </HStack>

                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily={"Bricolage Grotesque"}
                                >
                                  EAN number:
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product.ean}
                                </Text>
                              </HStack>

                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily={"Bricolage Grotesque"}
                                >
                                  Availability
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product.is_available_on_stock ? "🟢" : "🔴"}
                                </Text>
                              </HStack>

                              <HStack justify="space-between" mb={2}>
                                <Text
                                  fontWeight="500"
                                  fontSize="sm"
                                  color="black"
                                  fontFamily={"Bricolage Grotesque"}
                                >
                                  Tax Rate
                                </Text>
                                <Text
                                  fontSize="sm"
                                  fontWeight="500"
                                  color="black"
                                >
                                  {product.tax.rate}%
                                </Text>
                              </HStack>
                            </Box>

                            <Box>
                              <Text
                                fontWeight="semibold"
                                mb={0}
                                mt={5}
                                fontSize="sm"
                                color="gray.900"
                              >
                                Quantity
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
                                  onClick={() =>
                                    setQuantity(Math.max(1, quantity - 1))
                                  }
                                  isDisabled={quantity <= 1}
                                  variant="ghost"
                                  borderRadius="lg"
                                  aria-label="Decrease quantity"
                                />
                                <Box flex={1} textAlign="center">
                                  <Input
                                    type="number"
                                    min={1}
                                    value={quantity}
                                    onChange={(e) => {
                                      const val = Math.max(
                                        1,
                                        parseInt(e.target.value) || 1
                                      );
                                      setQuantity(val);
                                    }}
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="gray.800"
                                    textAlign="center"
                                    border="none"
                                    bg="transparent"
                                    p={0}
                                    _focus={{ boxShadow: "none" }}
                                  />
                                </Box>
                                <IconButton
                                  icon={<FaPlus />}
                                  size="sm"
                                  onClick={() => setQuantity(quantity + 1)}
                                  variant="ghost"
                                  borderRadius="lg"
                                  aria-label="Increase quantity"
                                />
                              </HStack>
                            </Box>
                            <Button
                              color="white"
                              fontFamily={"Bricolage Grotesque"}
                              size="sm"
                              bg="navy"
                              _hover={{ bg: "navy" }}
                              _focus={{ bg: "navy" }}
                              _active={{ bg: "navy" }}
                            >
                              Add to Cart
                            </Button>
                          </VStack>
                        </Box>
                      </Box>
                    </Heading>
                  </Box>

                  {/* Display active services for this product */}
                  {Array.isArray(product.product_services) &&
                    product.product_services.length > 0 && (
                      <Box mb={0} p="3">
                        <Heading
                          size="sm"
                          mb={4}
                          color="gray.800"
                          fontWeight="500"
                          letterSpacing="tight"
                          fontFamily={"Bricolage Grotesque"}
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
                                        fontFamily={"Bricolage Grotesque"}
                                      >
                                        {service.title}
                                      </Text>
                                    </VStack>
                                  </HStack>
                                  <Text
                                    fontWeight="600"
                                    color="gray.700"
                                    fontSize="xs"
                                    fontFamily={"Bricolage Grotesque"}
                                  >
                                    +{parseFloat(service.price).toFixed(2)} €
                                  </Text>
                                </HStack>
                              </Card>
                            ))}
                        </VStack>
                      </Box>
                    )}
                  <Button
                    fontSize={"sm"}
                    size="sm"
                    bg="transparent"
                    color="black"
                    fontWeight="400"
                    _focus={{ bg: "transparent" }}
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                  >
                    <FaHeart />{" "}
                    <Text as="span" ml={2}>
                      Add to List
                    </Text>
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </Box>
        </Grid>
      </Container>

      {/* Mobile View */}
      <Container maxW="1600px" py={4} display={{ base: "block", md: "none" }}>
        <Grid
          templateColumns={{ base: "1fr" }}
          gap={0}
          minH="auto"
          alignItems={"start"}
        >
          {/* Right Column - Enhanced Purchase Card */}
          <Box bg="white">
            <Card shadow="none" borderRadius="2xl" overflow="hidden">
              <CardBody py={1} bg="white">
                <VStack align="stretch" spacing={0}>
                  <Box>
                    {product.is_available_on_stock ? (
                      <Button
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        Available
                      </Button>
                    ) : null}

                    {product.is_discounted ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        Flash Deals
                      </Button>
                    ) : null}

                    {product.mark_as_new ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        New
                      </Button>
                    ) : null}

                    {product.discount_percentage_nett >= 25 ? (
                      <Button
                        ml={2}
                        size="xs"
                        bg="navy"
                        _hover={{ bg: "navy.200" }}
                        _focus={{ bg: "navy.200" }}
                        _active={{ bg: "navy.200" }}
                        color="white"
                        fontFamily={"Bricolage Grotesque"}
                      >
                        Big Sale
                      </Button>
                    ) : null}

                    <Heading
                      mt={2}
                      fontSize="20px"
                      mb={4}
                      color="gray.800"
                      lineHeight="1.2"
                      fontFamily={"Bricolage Grotesque"}
                    >
                      {product.title}
                    </Heading>
                  </Box>

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
                                    product.images?.gallery?.[carouselIndex]
                                      ?.url || product.images?.main_image?.url
                                  }
                                  alt={product.title}
                                  w="full"
                                  h="full"
                                  objectFit="cover"
                                />
                                {/* Carousel navigation arrows */}
                                {product.images?.gallery?.length > 1 && (
                                  <>
                                    <IconButton
                                      aria-label="Previous image"
                                      icon={<FaChevronLeft />}
                                      position="absolute"
                                      top="50%"
                                      left="2"
                                      transform="translateY(-50%)"
                                      zIndex={2}
                                      onClick={() =>
                                        handleCarouselSwipe("left")
                                      }
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
                                      onClick={() =>
                                        handleCarouselSwipe("right")
                                      }
                                      bg="whiteAlpha.800"
                                      _hover={{ bg: "whiteAlpha.900" }}
                                      borderRadius="full"
                                      size="sm"
                                    />
                                  </>
                                )}
                                {/* Dots indicator */}
                                {product.images?.gallery?.length > 1 && (
                                  <HStack
                                    position="absolute"
                                    bottom="2"
                                    left="50%"
                                    transform="translateX(-50%)"
                                    spacing={1}
                                    zIndex={2}
                                  >
                                    {product.images.gallery.map((_, idx) => (
                                      <Box
                                        key={idx}
                                        w={
                                          carouselIndex === idx ? "16px" : "8px"
                                        }
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
                            <VStack
                              spacing={3}
                              order={{ base: 2, md: 1 }}
                              py={1}
                            >
                              {product.images?.gallery?.map((image, index) => (
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
                                    product.images?.gallery?.[selectedImage]
                                      ?.url || product.images?.main_image?.url
                                  }
                                  alt={product.title}
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
                                    {product.badges?.is_new && (
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
                                    {product.badges?.is_on_sale && (
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
                                    {product.badges?.free_shipping && (
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
                  fontFamily={"Bricolage Grotesque"}
                >
                  SKU:
                </Text>
                <Text fontSize="sm" fontWeight="500" color="black">
                  {product.sku}
                </Text>
              </HStack>

              <HStack justify="space-between" mb={2}>
                <Text
                  fontWeight="500"
                  fontSize="sm"
                  color="black"
                  fontFamily={"Bricolage Grotesque"}
                >
                  EAN number:
                </Text>
                <Text fontSize="sm" fontWeight="500" color="black">
                  {product.ean}
                </Text>
              </HStack>

              <HStack justify="space-between" mb={2}>
                <Text
                  fontWeight="500"
                  fontSize="sm"
                  color="black"
                  fontFamily={"Bricolage Grotesque"}
                >
                  Availability
                </Text>

                {/* <Text fontSize="sm" fontWeight="500" color="black">
                  {product.is_available_on_stock ? "🟢" : "🔴"}
                </Text> */}

                <Image
                  src={
                    product.is_available_on_stock
                      ? "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/icons/3dicons-tick-dynamic-color.png"
                      : "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/icons/no-stock.png"
                  }
                  alt="Availability Icon"
                  boxSize="20px"
                  objectFit="contain"
                  filter={
                    product.is_available_on_stock
                      ? "grayscale(0)"
                      : "grayscale(1)"
                  }
                />
              </HStack>

              <HStack justify="space-between" mb={2}>
                <Text
                  fontWeight="500"
                  fontSize="sm"
                  color="black"
                  fontFamily={"Bricolage Grotesque"}
                >
                  Tax Rate
                </Text>
                <Text fontSize="sm" fontWeight="500" color="black">
                  {product.tax.rate}%
                </Text>
              </HStack>
            </Box>

            <Box>
              {Array.isArray(product.custom_options) &&
                product.custom_options.length > 0 && (
                  <Box mb={0}>
                    <Heading
                      size="md"
                      mb={0}
                      mt={2}
                      color="gray.800"
                      fontWeight="500"
                      letterSpacing="tight"
                      fontFamily={"Bricolage Grotesque"}
                    >
                      {/* <Icon as={FaPalette} mr={2} color="purple.500" />{" "} */}
                      Configurable Options
                    </Heading>
                    <VStack align="stretch" spacing={5}>
                      {product.custom_options.map((option) => (
                        <Box key={option.id}>
                          <Text
                            fontWeight="400"
                            fontSize="sm"
                            fontFamily={"Bricolage Grotesque"}
                            mb={2}
                            mt={5}
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
                                selectedCustomOptions[option.id]?.valueId || ""
                              }
                              onChange={(valueId) => {
                                const selectedValue =
                                  option.option_values?.find(
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
                              <SimpleGrid
                                columns={{ base: 3, sm: 3, md: 4 }}
                                spacing={5}
                              >
                                {option.option_values?.map((value) => (
                                  <Box
                                    key={value.id}
                                    as="label"
                                    cursor="pointer"
                                  >
                                    <Card
                                      p={0}
                                      borderRadius="0"
                                      border="0px"
                                      borderColor={
                                        selectedCustomOptions[option.id]
                                          ?.valueId === value.id
                                          ? "gray.100"
                                          : "gray.200"
                                      }
                                      _hover={{
                                        borderColor:
                                          selectedCustomOptions[option.id]
                                            ?.valueId === value.id
                                            ? "purple.300"
                                            : "purple.300",
                                      }}
                                      transition="all 0.2s"
                                      bg="#fff"
                                      position="relative"
                                      minW="100px"
                                      minH="110px"
                                      display="flex"
                                      flexDirection="column"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      {value.image_url && (
                                        <Box
                                          w="full"
                                          h="70px"
                                          borderRadius="0"
                                          overflow="hidden"
                                          bg="gray.100"
                                          mb={2}
                                        >
                                          <Image
                                            src={value.image_url}
                                            alt={
                                              value.display_name ||
                                              value.option_value
                                            }
                                            w="full"
                                            h="full"
                                            objectFit="cover"
                                          />
                                        </Box>
                                      )}
                                      <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        textAlign="center"
                                        noOfLines={2}
                                        fontFamily={"Bricolage Grotesque"}
                                      >
                                        {value.display_name ||
                                          value.option_value}
                                      </Text>
                                      {parseFloat(value.price_modifier) > 0 ? (
                                        <Text
                                          fontSize="xs"
                                          fontWeight="bold"
                                          color="black"
                                          fontFamily={"Bricolage Grotesque"}
                                        >
                                          {parseFloat(
                                            value.price_modifier
                                          ).toFixed(2)}
                                          €
                                        </Text>
                                      ) : parseFloat(value.price_modifier) <
                                        0 ? (
                                        <Text
                                          fontSize="xs"
                                          fontWeight="bold"
                                          color="red.600"
                                          fontFamily={"Bricolage Grotesque"}
                                        >
                                          {parseFloat(
                                            value.price_modifier
                                          ).toFixed(2)}
                                          €
                                        </Text>
                                      ) : (
                                        <Text
                                          fontSize="xs"
                                          color="gray.500"
                                          fontFamily={"Bricolage Grotesque"}
                                        >
                                          Included
                                        </Text>
                                      )}
                                      <Radio
                                        value={value.id}
                                        colorScheme="purple"
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        size="sm"
                                      />
                                    </Card>
                                  </Box>
                                ))}
                              </SimpleGrid>
                            </RadioGroup>
                          )}

                          {option.option_type === "select" && (
                            <Select
                              placeholder={`Choose ${option.option_name}`}
                              size="lg"
                              borderRadius="lg"
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
                                    ` (+${value.price_modifier}€)`}
                                </option>
                              ))}
                            </Select>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

              {product.custom_options.length > 0 && (
                <>
                  <Divider />
                  <br />
                </>
              )}
            </Box>

            <Divider />

            <Box>
              <HStack align="center" spacing={4} mt={8}>
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color="gray.700"
                  fontFamily="Bricolage Grotesque"
                >
                  {calculateTotalPrice().toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    minimumFractionDigits: 2,
                  })}
                </Text>
                {product.pricing.is_discounted && (
                  <Badge
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontWeight="bold"
                    letterSpacing="wide"
                    bg="red"
                    fontFamily={"Bricolage Grotesque"}
                    color="white"
                  >
                    -
                    {product.pricing.discount.percentage_nett ||
                      product.pricing.discount.percentage_gross}
                    %
                  </Badge>
                )}
              </HStack>

              {/* Old price and savings */}
              {product.pricing.is_discounted && (
                <HStack spacing={3}>
                  <Text
                    as="span"
                    fontSize="md"
                    color="gray.500"
                    textDecoration="line-through"
                    fontWeight="medium"
                  >
                    {(
                      product.pricing.regular_price.gross * quantity
                    ).toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </HStack>
              )}

              {/* VAT info */}
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Including VAT ({product.tax.rate}%)
                </Text>
                <Text fontSize="sm" color="gray.400">
                  |
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Price without VAT:{" "}
                  <b>
                    {/* Calculate net price for all quantities and options */}
                    {(() => {
                      // Base net price
                      let baseNet = product.pricing.final_price.nett || 0;
                      return (baseNet * quantity).toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                        minimumFractionDigits: 2,
                      });
                    })()}
                  </b>
                </Text>
              </HStack>
              <br />
              <br />
              <Divider />

              {/* Services of Product */}
              <br />
              {Array.isArray(product.product_services) &&
                product.product_services.length > 0 && (
                  <Box mb={0} p="0">
                    <Heading
                      size="sm"
                      mb={4}
                      color="gray.800"
                      fontWeight="500"
                      letterSpacing="tight"
                      fontFamily={"Bricolage Grotesque"}
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
                                    fontFamily={"Bricolage Grotesque"}
                                  >
                                    {service.title}
                                  </Text>
                                </VStack>
                              </HStack>
                              <Text
                                fontWeight="600"
                                color="gray.700"
                                fontSize="xs"
                                fontFamily={"Bricolage Grotesque"}
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
                  <Text
                    fontWeight="semibold"
                    mb={2}
                    fontSize="sm"
                    color="gray.900"
                  >
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
                          fontFamily="Bricolage Grotesque"
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
                    fontFamily={"Bricolage Grotesque"}
                    size="md"
                    bg="navy"
                    _hover={{ bg: "navy" }}
                    _focus={{ bg: "navy" }}
                    _active={{ bg: "navy" }}
                    w="full"
                    h="auto"
                    py={3}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </HStack>

              {/* At a glance */}
              {product.custom_details.length >= 1 && (
                <Text
                  fontSize={"md"}
                  fontWeight={"bold"}
                  fontFamily={"Bricolage Grotesque"}
                  mt={5}
                >
                  At a glance
                </Text>
              )}

              <SimpleGrid columns={{ base: 2 }} spacing={4} mb={2} mt={5}>
                {product.custom_details?.slice(0, 6).map((detail) => (
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

              {product.custom_details && product.custom_details.length > 6 && (
                <Button
                  size="sm"
                  variant="link"
                  color="blue.600"
                  fontWeight="semibold"
                  align="center"
                  fontFamily={"Bricolage Grotesque"}
                  justifyContent={"center"}
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
                  fontSize={"md"}
                  fontFamily={"Bricolage Grotesque"}
                  fontWeight={"bold"}
                  color="black"
                  mt={10}
                  ml={3}
                >
                  About this item
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
                            fontWeight="semibold"
                            fontFamily="Bricolage Grotesque"
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
                        fontFamily="Bricolage Grotesque"
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
                            fontWeight="semibold"
                            fontFamily="Bricolage Grotesque"
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
                                  fontFamily="Bricolage Grotesque"
                                  minW="120px"
                                  maxW="200px"
                                >
                                  {detail.label}
                                </Text>
                                <Text
                                  fontSize="sm"
                                  color="gray.800"
                                  fontFamily="Bricolage Grotesque"
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
                          fontFamily="Bricolage Grotesque"
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
        </Grid>
      </Container>

      {/* Recommended products */}
      {product?.slug && (
        <RecommendedProducts
          productSlug={product.slug}
          title="You may also like"
        />
      )}

      {/* Enhanced Image Modal */}
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
                  product.images?.gallery?.[selectedImage]?.url ||
                  product.images?.main_image?.url
                }
                alt={product.title}
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
                  {product.custom_details?.map((detail) => (
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
                        {detail.label}
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
                        {detail.value}
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
