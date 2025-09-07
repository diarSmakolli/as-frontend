import React, { useState, useEffect, useRef } from "react";
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
} from "@chakra-ui/react";
import {
  FaStar,
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
  FaGamepad,
  FaHome,
  FaTshirt,
  FaBaby,
  FaLaptop,
  FaCar,
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
  FaRegHeart,
} from "react-icons/fa";
import Logo from "../../assets/logo-as.png";
import AsSolutionsPhoto from "../../assets/welcome-as.png";
import FlashSalePromo from "../../assets/flash-sale-4.png";
import BabySalePromo from "../../assets/baby-3.png";
import FournitureSalePromo from "../../assets/fourniture-2.png";
import FourniturePromoSlide from "../../assets/fourniture-g.png";
import GaragePromoSlide from "../../assets/garage.png";
import JasquaMobile from "../../assets/jasqua-mobile.png";
import GarageSliderMobile from "../../assets/garage-slider-mobile.png";
import { homeService } from "./services/homeService";
import Footer from "../../shared-customer/components/Footer";
import MobileCategoryNavigation from "../../shared-customer/components/MobileCategoryNavigation";
import { useSwipeable } from "react-swipeable";
import ExploreAll from "../../shared-customer/components/ExploreAll";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared-customer/components/Navbar";
import { customerAccountService } from "../customer-account/customerAccountService";
import { useToast } from "@chakra-ui/react";
import { useCustomerAuth } from "../customer-account/auth-context/customerAuthContext";
import { customToastContainerStyle } from "../../commons/toastStyles";

function Home() {
  let toast = useToast();
  const { customer, isLoading } = useCustomerAuth();
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(false);
  const [flashDeals, setFlashDeals] = useState([]);
  const [flashDealsLoading, setFlashDealsLoading] = useState(false);
  const [flashDealsFurniture, setFlashDealsFurniture] = useState([]);
  const [flashDealsFurnitureLoading, setFlashDealsFurnitureLoading] =
    useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [topDoorsProducts, setTopDoorsProducts] = useState([]);
  const [topDoorsLoading, setTopDoorsLoading] = useState(false);
  const [topFetresLoading, setTopFetresLoading] = useState(false);
  const [topFetresProducts, setTopFetresProducts] = useState([]);
  const [topAutoMotoProducts, setTopAutoMotoProducts] = useState([]);
  const [topAutoMotoLoading, setTopAutoMotoLoading] = useState(false);
  const [topBabyProducts, setTopBabyProducts] = useState([]);
  const [topBabyLoading, setTopBabyLoading] = useState(false);
  const [constructionProducts, setConstructionProducts] = useState(false);
  const [constructionProductsLoading, setConstructionProductsLoading] =
    useState(false);
  const [sanitaryProducts, setSanitaryProducts] = useState([]);
  const [sanitaryProductsLoading, setSanitaryProductsLoading] = useState(false);

  const carouselImage = useBreakpointValue({
    base: GarageSliderMobile, // mobile image
    lg: GaragePromoSlide, // desktop image
  });

  // Promotional carousel data
  const promoSlides = [
    {
      id: 1,
      title: "",
      subtitle: "",
      buttonText: "",
      bgGradient: "transparent",
      image: carouselImage,
      textColor: "transparent",
      subtitleColor: "transparent",
      buttonBg: "transparent",
      buttonHoverBg: "transparent",
      link: "/category/automoto",
    },
  ];

  const handleAddToWishlist = async (productId) => {
    if (!customer || !customer.id) {
      navigate("/account/signin");
      return;
    }
    try {
      await customerAccountService.addToWishlist(productId);
      toast({
        title: "Ajouté à la liste de souhaits",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      const eventPayload = {
        event_type: "wishlist_add",
        session_id: customer?.id || null,
        customer_id: customer?.id || null,
        product_id: productId,
        page_type: "homepage",
        page_url: typeof window !== "undefined" ? window.location.href : null,
        referrer_url:
          typeof document !== "undefined" ? document.referrer : null,
        timestamp: new Date().toISOString(),
      };

      await homeService.createProductEvent(eventPayload);
    } catch (error) {
      toast({
        title:
          error?.message || "Erreur lors de l'ajout à la liste de souhaits",
        status: "error",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });
  const columns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5, xl: 6 });

  useEffect(() => {
    fetchNewArrivals();
    fetchFlashDeals();
    fetchFurnitureFlashDeals();
    fetchTopDoorsProducts();
    fetchTopWindowssProducts();
    fetchTopAutoMotoProducts();
    fetchTopBabyProducts();
    fetchTopConstructionProducts();
    fetchTopSanitaryProducts();

    // Auto-slide banner every 4 seconds
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [promoSlides.length]);

  // Promotional carousel auto-rotation
  useEffect(() => {
    const promoInterval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % promoSlides.length);
    }, 5000);

    return () => clearInterval(promoInterval);
  }, [promoSlides.length]);

  // New function to fetch new arrivals
  const fetchNewArrivals = async () => {
    try {
      setNewArrivalsLoading(true);
      const response = await homeService.getNewArrivals({
        limit: 24,
      });

      if (response.status === "success" && response.data?.products) {
        setNewArrivals(response.data.products);
      } else {
        setNewArrivals([]);
      }
    } catch (error) {
      setNewArrivals([]);
    } finally {
      setNewArrivalsLoading(false);
    }
  };

  // New function to fetch flash deals
  const fetchFlashDeals = async () => {
    try {
      setFlashDealsLoading(true);
      const response = await homeService.getFlashDeals({
        limit: 24, // Fetch 24 products for horizontal scroll
        min_discount: 5, // Minimum 15% discount for flash deals
      });

      if (response.status === "success" && response.data?.products) {
        setFlashDeals(response.data.products);
      } else {
        setFlashDeals([]);
      }
    } catch (error) {
      setFlashDeals([]);
    } finally {
      setFlashDealsLoading(false);
    }
  };

  // New function to fetch furniture flash deals specifically
  const fetchFurnitureFlashDeals = async () => {
    try {
      setFlashDealsFurnitureLoading(true);

      const response = await homeService.getFurnitureFlashDeals({
        limit: 24,
        min_discount: 15,
        category_id: "91f52fda-b2a9-4330-b922-7039c7e764c6", // furniture id
      });

      if (response.status === "success" && response.data?.products) {
        setFlashDealsFurniture(response.data.products);
      } else {
        setFlashDealsFurniture([]);
      }
    } catch (error) {
      setFlashDealsFurniture([]);
    } finally {
      setFlashDealsFurnitureLoading(false);
    }
  };

  const transformProductData = (apiProduct) => {
    return {
      id: apiProduct.id,
      title: apiProduct.title,
      image:
        apiProduct.main_image_url ||
        (apiProduct.images && apiProduct.images.length > 0
          ? apiProduct.images[0].url
          : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"),
      price:
        apiProduct.pricing?.final_price_gross ||
        apiProduct.pricing?.regular_price_gross ||
        0,
      originalPrice: apiProduct.pricing?.regular_price_gross,
      discount: apiProduct.pricing?.savings_percentage || 0,
      tag: apiProduct.badges?.is_on_sale
        ? `${Math.round(apiProduct.pricing?.discount_percentage || 0)}% OFF`
        : apiProduct.badges?.is_new
        ? "NEW"
        : null,
      sku: apiProduct.sku,
      slug: apiProduct.slug,
      badges: apiProduct.badges,
      company: apiProduct.company,
      category: apiProduct.primary_category,
      is_recently_added: apiProduct.is_recently_added,
    };
  };

  // Transform flash deal data specifically
  const transformFlashDealData = (apiProduct) => {
    const baseProduct = transformProductData(apiProduct);

    return {
      ...baseProduct,
      // Flash deal specific enhancements
      savingsAmount: apiProduct.pricing?.savings_nett || 0,
      dealUrgency: apiProduct.flash_deal?.deal_urgency || "low",
      dealType: apiProduct.flash_deal?.deal_type || "discount",
      isHotDeal: apiProduct.badges?.hot_deal || false,
      isMegaDeal: apiProduct.badges?.mega_deal || false,
      isSpecialOffer: apiProduct.flash_deal?.is_special_offer || false,
      discountPercentage: apiProduct.flash_deal?.discount_percentage || 0,
      isLimitedStock:
        apiProduct.flash_deal?.availability?.is_available || false,
    };
  };

  // FETCH BY CATEGORY TOP PRODUCTS
  const fetchTopDoorsProducts = async () => {
    try {
      setTopDoorsLoading(true);
      const response = await homeService.getTopProductsByCategorySlug(
        "portes",
        {
          limit: 20,
        }
      );

      const products = response.data || [];

      setTopDoorsProducts(products);
    } catch (error) {
      setTopDoorsProducts([]);
    } finally {
      setTopDoorsLoading(false);
    }
  };

  const fetchTopWindowssProducts = async () => {
    try {
      setTopFetresLoading(true);
      const response = await homeService.getTopProductsByCategorySlug(
        "fentres",
        {
          limit: 20,
        }
      );

      const products = response.data || [];

      setTopFetresProducts(products);
    } catch (error) {
      setTopFetresProducts([]);
    } finally {
      setTopFetresLoading(false);
    }
  };

  const fetchTopAutoMotoProducts = async () => {
    try {
      setTopAutoMotoLoading(true);
      const response = await homeService.getTopProductsByCategorySlug(
        "automoto",
        {
          limit: 20,
        }
      );

      const products = response.data || [];

      setTopAutoMotoProducts(products);
    } catch (error) {
      setTopAutoMotoProducts([]);
    } finally {
      setTopAutoMotoLoading(false);
    }
  };

  const fetchTopBabyProducts = async () => {
    try {
      setTopBabyLoading(true);
      const response = await homeService.getTopProductsByCategorySlug(
        "enfants-bb",
        {
          limit: 20,
        }
      );

      const products = response.data || [];

      setTopBabyProducts(products);
    } catch (error) {
      setTopBabyProducts([]);
    } finally {
      setTopBabyLoading(false);
    }
  };

  const fetchTopConstructionProducts = async () => {
    try {
      setConstructionProductsLoading(true);
      const response = await homeService.getTopProductsByCategorySlug(
        "mtallerie-matriaux-construction",
        {
          limit: 20,
        }
      );

      const products = response.data || [];

      setConstructionProducts(products);
    } catch (error) {
      setConstructionProducts([]);
    } finally {
      setConstructionProductsLoading(false);
    }
  };

  const fetchTopSanitaryProducts = async () => {
    try {
      setSanitaryProductsLoading(true);
      const response = await homeService.getTopProductsByCategorySlug(
        "salle-de-bain-sanitaires",
        {
          limit: 20,
        }
      );

      const products = response.data || [];

      setSanitaryProducts(products);
    } catch (error) {
      setSanitaryProducts([]);
    } finally {
      setSanitaryProductsLoading(false);
    }
  };

  // USER BEHAVIOR EVENTS
  // ======================
  // Build product impression event payload
  function buildProductImpressionEvent({
    product,
    index,
    section = "homepage",
  }) {
    return {
      event_type: "impression",
      session_id: customer?.id || null,
      customer_id: customer?.id || null,
      product_id: product.id,
      category_id: product.category?.id,
      page_type: section,
      page_url: window.location.href,
      referrer_url: document.referrer,
      category_path: "/category/" + (product.category?.slug || "unknown"),
      position_in_list: index + 1,
      total_results: null,
      page_number: 1,
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timestamp: new Date(),
      created_at: new Date(),
    };
  }

  // Intersection Observer hook for impressions (BATCHED)
  function useImpressionObserver(products, section, transformFn) {
    const observedRef = useRef([]);
    const sentImpressions = useRef(new Set());

    useEffect(() => {
      if (!products || products.length === 0) return;
      const observer = new window.IntersectionObserver(
        (entries) => {
          const batchEvents = [];
          entries.forEach((entry) => {
            if (
              entry.isIntersecting &&
              entry.target.dataset.impression !== "sent"
            ) {
              const index = Number(entry.target.dataset.index);
              const product = transformFn(products[index]);
              const uniqueKey = `${section}-${product.id}-${index}`;
              if (!sentImpressions.current.has(uniqueKey)) {
                const eventPayload = buildProductImpressionEvent({
                  product,
                  index,
                  section,
                });
                batchEvents.push(eventPayload);
                sentImpressions.current.add(uniqueKey);
                entry.target.dataset.impression = "sent";
              }
            }
          });
          if (batchEvents.length > 0) {
            homeService.createProductEventsBatch(batchEvents).catch(() => {});
          }
        },
        { threshold: 0.5 }
      );
      observedRef.current.forEach((el) => {
        if (el) observer.observe(el);
      });
      return () => {
        observedRef.current.forEach((el) => {
          if (el) observer.unobserve(el);
        });
      };
    }, [products, section, transformFn]);
    return observedRef;
  }

  // Product Click Event Payload
  function buildProductClickEvent({ product, index, section = "homepage" }) {
    return {
      event_type: "click",
      session_id: localStorage.getItem("session_id") || null,
      customer_id: window.user?.id || null,
      product_id: product.id,
      category_id: product.category?.id,
      page_type: section,
      page_url: window.location.href,
      referrer_url: document.referrer,
      category_path: "/category/" + (product.category?.slug || "unknown"),
      position_in_list: index + 1,
      total_results: null,
      page_number: 1,
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timestamp: new Date(),
      created_at: new Date(),
    };
  }

  // New arrivals section (Impression tracking)
  const newArrivalsImpressionRefs = useImpressionObserver(
    newArrivals,
    "homepage",
    transformProductData
  );

  const flashDealsImpressionRefs = useImpressionObserver(
    flashDeals,
    "homepage",
    transformProductData
  );

  const bigSaveOnFurnitureImpressionRefs = useImpressionObserver(
    flashDeals,
    "homepage",
    transformFlashDealData
  );

  // Portes
  const topDoorsImpressionRefs = useImpressionObserver(
    topDoorsProducts,
    "homepage",
    transformProductData
  );

  // Fenetres
  const topWindowsImpressionRefs = useImpressionObserver(
    topFetresProducts,
    "homepage",
    transformProductData
  );

  // Auto Moto
  const topAutoMotoImpressionRefs = useImpressionObserver(
    topAutoMotoProducts,
    "homepage",
    transformProductData
  );

  // Baby
  const topBabyImpressionRefs = useImpressionObserver(
    topBabyProducts,
    "homepage",
    transformProductData
  );

  // Construction
  const topConstructionImpressionRefs = useImpressionObserver(
    constructionProducts,
    "homepage",
    transformProductData
  );

  // Sanitary
  const topSanitaryImpressionRefs = useImpressionObserver(
    sanitaryProducts,
    "homepage",
    transformProductData
  );

  // Handle click
  const handleProductClick = (product, index, section = "homepage") => {
    return (e) => {
      // Send click event
      const eventPayload = buildProductClickEvent({ product, index, section });
      homeService.createProductEvent(eventPayload);

      // Navigate to product page
      navigate(`/product/${product.slug}`);
    };
  };

  // product hove event payload
  function buildProductHoverEvent({ product, index, section = "homepage" }) {
    return {
      event_type: "hover",
      session_id: localStorage.getItem("session_id") || null,
      customer_id: window.user?.id || null,
      product_id: product.id,
      category_id: product.category?.id,
      page_type: section,
      page_url: window.location.href,
      referrer_url: document.referrer,
      category_path: "/category/" + (product.category?.slug || "unknown"),
      position_in_list: index + 1,
      total_results: null,
      page_number: 1,
      viewport_size: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      timestamp: new Date(),
      created_at: new Date(),
    };
  }

  // handle hover
  const handleProductHover = (product, index, section = "homepage") => {
    // Send hover event
    const eventPayload = buildProductHoverEvent({ product, index, section });
    homeService.createProductEvent(eventPayload);
  };

  return (
    <Box minH="100vh" bg="rgba(252, 252, 253, 1)">
      {/* Header matching Wish design but with AS Solutions branding */}
      <Navbar />

      {/* Main Content with Container */}
      <Container maxW="8xl" py={6} px={4}>
        {/* Hero Promotional Section - Walmart Style */}
        <Grid
          templateColumns={{ base: "1fr", lg: "300px 1fr 300px" }}
          templateRows={{ base: "auto auto auto", lg: "320px 200px" }}
          gap={4}
          mb={8}
          h={{ base: "auto", lg: "540px" }}
        >
          {/* Left Column - Everything for July 4th */}
          <GridItem
            rowSpan={{ base: 1, lg: 2 }}
            bg="#F8E7A1"
            borderRadius="12px"
            p={0}
            position="relative"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            as="a"
            href="/flash-deals"
          >
            <Image
              src={useBreakpointValue({
                base: JasquaMobile,
                lg: FlashSalePromo,
              })}
              h="full"
              w="full"
              objectFit="fill"
            />
          </GridItem>

          {/* Center Column - Carousel */}
          <GridItem
            rowSpan={{ base: 1, lg: 1 }}
            bg="white"
            borderRadius="12px"
            overflow="hidden"
            position="relative"
            border="1px"
            borderColor="gray.200"
          >
            <Box position="relative" h="full">
              {/* Carousel content */}
              <Box
                position="relative"
                h="full"
                bg={promoSlides[currentPromoSlide].bgGradient}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={0}
                transition="all 0.5s ease-in-out"
                as="a"
                href={promoSlides[currentPromoSlide].link}
              >
                <Image
                  src={promoSlides[currentPromoSlide].image}
                  alt={`Promotional slide ${currentPromoSlide + 1}`}
                  w="full"
                  h="full"
                  objectFit="cover" // Changed from "contain" to "cover" for full coverage
                  transition="all 0.5s ease-in-out"
                  _hover={{
                    transform: "scale(1.02)",
                  }}
                />
              </Box>

              {/* Carousel indicators */}
              <HStack
                position="absolute"
                bottom="4"
                left="50%"
                transform="translateX(-50%)"
                spacing={2}
              >
                {promoSlides.map((_, index) => (
                  <Box
                    key={index}
                    w="8px"
                    h="8px"
                    bg={
                      currentPromoSlide === index
                        ? promoSlides[currentPromoSlide].buttonBg
                        : "gray.300"
                    }
                    borderRadius="full"
                    cursor="pointer"
                    transition="all 0.2s"
                    onClick={() => setCurrentPromoSlide(index)}
                    _hover={{
                      transform: "scale(1.2)",
                    }}
                  />
                ))}
              </HStack>

              {/* Navigation arrows */}
              <IconButton
                position="absolute"
                left="2"
                top="50%"
                transform="translateY(-50%)"
                icon={<FaChevronLeft />}
                size="sm"
                bg="white"
                color="gray.600"
                _hover={{ bg: "gray.100" }}
                borderRadius="full"
                shadow="md"
                onClick={() =>
                  setCurrentPromoSlide((prev) =>
                    prev === 0 ? promoSlides.length - 1 : prev - 1
                  )
                }
                aria-label="Previous slide"
              />
              <IconButton
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                icon={<FaChevronRight />}
                size="sm"
                bg="white"
                color="gray.600"
                _hover={{ bg: "gray.100" }}
                borderRadius="full"
                shadow="md"
                onClick={() =>
                  setCurrentPromoSlide(
                    (prev) => (prev + 1) % promoSlides.length
                  )
                }
                aria-label="Next slide"
              />
            </Box>
          </GridItem>

          {/* Right Column - Only at AS Solutions */}
          <GridItem
            rowSpan={{ base: 1, lg: 1 }}
            bg="#fdd844"
            borderRadius="12px"
            p={0}
            position="relative"
            overflow="hidden"
            as="a"
            href="/category/enfants-bb"
          >
            <Image src={BabySalePromo} h="full" w="full" objectFit="fill" />
          </GridItem>

          {/* Bottom Left - Summer home trends */}
          <GridItem
            colSpan={{ base: 1, lg: 1 }}
            bg="#FDE68A"
            borderRadius="12px"
            p={0}
            position="relative"
            overflow="hidden"
            display={{ base: "none", md: "block" }}
            as="a"
            href="/category/mobilier"
          >
            <Image
              src={FournitureSalePromo}
              h="full"
              w="full"
              objectFit="fill"
            />
          </GridItem>

          {/* Bottom Right - Scoop exclusive */}
          <GridItem
            colSpan={{ base: 1, lg: 1 }}
            bg="white"
            borderRadius="12px"
            p={0}
            position="relative"
            overflow="hidden"
            border="2px"
            borderColor="gray.200"
            as="a"
            href="/category/mobilier"
          >
            <Image
              src={FourniturePromoSlide}
              h="full"
              w="full"
              objectFit="fill"
            />
          </GridItem>
        </Grid>

        {/* Flash Deals Section - Updated to use real data */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={4}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Forfait offres flash
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/flash-deals");
              }}
            >
              Voir tout
            </Button>
          </Flex>

          {/* Horizontal Scrollable Flash Deals Row */}
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {/* Display real flash deals or loading skeleton */}
                {flashDealsLoading ? (
                  // Loading skeleton
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`flash-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <HStack spacing={2} w="full">
                            <Skeleton h="6" w="16" />
                            <Skeleton h="4" w="12" />
                          </HStack>
                          <Skeleton h="6" w="20" borderRadius="full" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : flashDeals && flashDeals.length > 0 ? (
                  // Real flash deals data
                  flashDeals.map((apiProduct, index) => {
                    const product = transformFlashDealData(apiProduct);
                    const productId = `flash-${index}-${product.id}`;

                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (flashDealsImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={product.image}
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          {product.isLimitedStock && (
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              bg="blackAlpha.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="12px"
                              zIndex={2}
                            >
                              <VStack spacing={2}>
                                <Text
                                  color="white"
                                  fontSize="xs"
                                  textAlign="center"
                                  fontWeight="medium"
                                  bg="blackAlpha.700"
                                  px={2}
                                  py={1}
                                  borderRadius="sm"
                                  maxW="70%"
                                >
                                  Actuellement indisponible (Rupture de stock)
                                </Text>
                              </VStack>
                            </Box>
                          )}

                          {/* Heart Icon */}
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>

                        <CardBody p={3} position="relative" zIndex={1}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="md"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              {/* Pricing Section */}
                              <HStack
                                spacing={1}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl", md: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product.price.toFixed(2)} €
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <>
                                      {/* Responsive discount badge */}
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.originalPrice -
                                            product.price) /
                                            product.originalPrice) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €{product.originalPrice.toFixed(2)}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  // Empty state
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* New Arrivals Section */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={4}>
            <Heading
              color="black"
              fontSize={{ base: "xl", md: "20px" }}
              fontFamily={"Airbnb Cereal VF"}
              fontWeight="600"
            >
              Nouveaux arrivages
            </Heading>
          </Flex>

          {/* Horizontal Scrollable Product Row */}
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {/* Display real new arrivals or loading skeleton */}
                {newArrivalsLoading ? (
                  // Loading skeleton
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      border="1px"
                      borderColor="gray.100"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : newArrivals && newArrivals.length > 0 ? (
                  // Real new arrivals data
                  newArrivals.map((apiProduct, index) => {
                    const product = transformProductData(apiProduct);
                    const productId = `new-${index}-${product.id}`;

                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (newArrivalsImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={product.image}
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          {product.isLimitedStock && (
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              bg="blackAlpha.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="12px"
                              zIndex={2}
                            >
                              <VStack spacing={2}>
                                <Text
                                  color="white"
                                  fontSize="xs"
                                  textAlign="center"
                                  fontWeight="medium"
                                  bg="blackAlpha.700"
                                  px={2}
                                  py={1}
                                  borderRadius="sm"
                                  maxW="70%"
                                >
                                  Actuellement indisponible (Rupture de stock)
                                </Text>
                              </VStack>
                            </Box>
                          )}

                          {/* Heart Icon */}
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>

                        <CardBody p={3} position="relative" zIndex={1}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="md"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              {/* Pricing Section */}
                              <HStack
                                spacing={1}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl", md: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product.price.toFixed(2)} €
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <>
                                      {/* Responsive discount badge */}
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.originalPrice -
                                            product.price) /
                                            product.originalPrice) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €{product.originalPrice.toFixed(2)}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  // No products found - Empty state
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Furniture Flash Deals Section Save */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={4}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontWeight="600"
                fontFamily={"Airbnb Cereal VF"}
                fontSize={{ base: "xl", md: "20px" }}
              >
                Offres flash de meubles
              </Heading>
            </HStack>
          </Flex>

          {/* Horizontal Scrollable Flash Deals Row */}
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {/* Display furniture flash deals or loading skeleton */}
                {flashDealsFurnitureLoading ? (
                  // Loading skeleton with furniture theme
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`furniture-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <HStack spacing={2} w="full">
                            <Skeleton h="6" w="16" />
                            <Skeleton h="4" w="12" />
                          </HStack>
                          <Skeleton h="6" w="20" borderRadius="full" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : flashDealsFurniture && flashDealsFurniture.length > 0 ? (
                  // Real furniture flash deals data
                  flashDealsFurniture.map((apiProduct, index) => {
                    const product = transformFlashDealData(apiProduct);
                    const productId = `furniture-flash-${index}-${product.id}`;

                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (bigSaveOnFurnitureImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                          rounded="lg"
                        >
                          <ProductImage
                            src={product.image}
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          {product.isLimitedStock && (
                            <Box
                              position="absolute"
                              top="0"
                              left="0"
                              right="0"
                              bottom="0"
                              bg="blackAlpha.600"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              borderRadius="12px"
                              zIndex={2}
                            >
                              <VStack spacing={2}>
                                <Text
                                  color="white"
                                  fontSize="xs"
                                  textAlign="center"
                                  fontWeight="medium"
                                  bg="blackAlpha.700"
                                  px={2}
                                  py={1}
                                  borderRadius="sm"
                                  maxW="70%"
                                >
                                  Actuellement indisponible (Rupture de stock)
                                </Text>
                              </VStack>
                            </Box>
                          )}

                          {/* Heart Icon */}
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>

                        <CardBody p={3} position="relative" zIndex={1}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="md"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              {/* Pricing Section */}
                              <HStack
                                spacing={1}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product.price.toFixed(2)} €
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <>
                                      {/* Responsive discount badge */}
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.originalPrice -
                                            product.price) /
                                            product.originalPrice) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €{product.originalPrice.toFixed(2)}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  // No furniture flash deals found - Empty state
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Categories TOP Products */}
        {/* Portes */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Portes
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/category/portes");
              }}
            >
              Voir tout
            </Button>
          </Flex>

          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {topDoorsLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-doors-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : topDoorsProducts && topDoorsProducts?.length > 0 ? (
                  topDoorsProducts?.map((product, index) => {
                    const productId = `top-doors-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (topDoorsImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={
                              product.main_image_url ||
                              (product.images?.[0].url ?? "")
                            }
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="sm"
                                color="black"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="black"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product?.final_price_gross.toFixed(2) ??
                                    product?.regular_price_gross.toFixed(2) ??
                                    0}{" "}
                                  €
                                </Text>

                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.regular_price_gross -
                                            product.final_price_gross) /
                                            product.regular_price_gross) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €
                                        {product.regular_price_gross.toFixed(2)}{" "}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Fenetres */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Fenetres
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/category/fentres");
              }}
            >
              Voir tout
            </Button>
          </Flex>
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {topFetresLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-fetres-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : topFetresProducts && topFetresProducts?.length > 0 ? (
                  topFetresProducts?.map((product, index) => {
                    const productId = `top-fetres-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (topWindowsImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>

                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="sm"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product?.final_price_gross.toFixed(2) ??
                                    product?.regular_price_gross.toFixed(2) ??
                                    0}{" "}
                                  €
                                </Text>

                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.regular_price_gross -
                                            product.final_price_gross) /
                                            product.regular_price_gross) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €
                                        {product.regular_price_gross.toFixed(2)}{" "}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Auto moto */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Auto moto
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/category/automoto");
              }}
            >
              Voir tout
            </Button>
          </Flex>
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {topAutoMotoLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-auto-moto-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : topAutoMotoProducts && topAutoMotoProducts?.length > 0 ? (
                  topAutoMotoProducts?.map((product, index) => {
                    const productId = `top-auto-moto-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (topAutoMotoImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="sm"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product?.final_price_gross.toFixed(2) ??
                                    product?.regular_price_gross.toFixed(2) ??
                                    0}{" "}
                                  €
                                </Text>

                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.regular_price_gross -
                                            product.final_price_gross) /
                                            product.regular_price_gross) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €
                                        {product.regular_price_gross.toFixed(2)}{" "}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Baby */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Bébé
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/category/enfants-bb");
              }}
            >
              Voir tout
            </Button>
          </Flex>
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {topBabyLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-baby-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : topBabyProducts && topBabyProducts?.length > 0 ? (
                  topBabyProducts?.map((product, index) => {
                    const productId = `top-baby-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (topBabyImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="md"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product?.final_price_gross.toFixed(2) ??
                                    product?.regular_price_gross.toFixed(2) ??
                                    0}{" "}
                                  €
                                </Text>

                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.regular_price_gross -
                                            product.final_price_gross) /
                                            product.regular_price_gross) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €
                                        {product.regular_price_gross.toFixed(2)}{" "}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Constructions */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Construction
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/category/enfants-bb");
              }}
            >
              Voir tout
            </Button>
          </Flex>
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {constructionProductsLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-baby-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : constructionProducts && constructionProducts?.length > 0 ? (
                  constructionProducts?.map((product, index) => {
                    const productId = `top-construction-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (topConstructionImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="sm"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product?.final_price_gross.toFixed(2) ??
                                    product?.regular_price_gross.toFixed(2) ??
                                    0}{" "}
                                  €
                                </Text>

                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.regular_price_gross -
                                            product.final_price_gross) /
                                            product.regular_price_gross) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €
                                        {product.regular_price_gross.toFixed(2)}{" "}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Sanitaires */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "20px" }}
                fontFamily={"Airbnb Cereal VF"}
                fontWeight="600"
              >
                Sanitaires
              </Heading>
            </HStack>
            <Button
              bg="transparent"
              size="sm"
              borderColor="none"
              borderWidth={"0px"}
              color="black"
              _hover={{
                bg: "transparent",
                color: "gray.400",
                borderColor: "none",
              }}
              fontFamily={"Airbnb Cereal VF"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/category/enfants-bb");
              }}
            >
              Voir tout
            </Button>
          </Flex>
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40px",
              zIndex: 1,
              pointerEvents: "none",
              display: { base: "block", md: "none" },
            }}
          >
            <Box
              overflowX="auto"
              overflowY="hidden"
              pb={2}
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollBehavior: "smooth",
              }}
            >
              <HStack
                spacing={4}
                align="stretch"
                minW="max-content"
                px={{ base: 2, md: 0 }}
              >
                {sanitaryProductsLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-baby-skeleton-${index}`}
                      bg="white"
                      borderRadius="12px"
                      overflow="hidden"
                      shadow="sm"
                      minW={{ base: "150px", sm: "180px", md: "200px" }}
                      maxW={{ base: "150px", sm: "180px", md: "200px" }}
                      flexShrink={0}
                    >
                      <Skeleton
                        h={{ base: "150px", sm: "180px", md: "200px" }}
                        w="full"
                      />
                      <CardBody p={3}>
                        <VStack align="start" spacing={2}>
                          <SkeletonText noOfLines={2} spacing={2} w="full" />
                          <Skeleton h="6" w="20" />
                          <SkeletonText noOfLines={1} w="60%" />
                        </VStack>
                      </CardBody>
                    </Card>
                  ))
                ) : sanitaryProducts && sanitaryProducts?.length > 0 ? (
                  sanitaryProducts?.map((product, index) => {
                    const productId = `top-sanitary-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="rgba(255,255,255,1)"
                        overflow="hidden"
                        shadow="sm"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-6px)",
                        }}
                        flexShrink={0}
                        _before={{
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          opacity: 0.3,
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                        ref={(el) =>
                          (topSanitaryImpressionRefs.current[index] = el)
                        }
                        data-index={index}
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                          bg="white"
                        >
                          <ProductImage
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            height={{ base: "150px", sm: "180px", md: "200px" }}
                            bg="rgba(255,255,255,1)"
                          />

                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaRegHeart size="20px" />}
                            bg="white"
                            color="black"
                            _hover={{
                              color: "white",
                              bg: "rgba(255, 0, 0, 1)",
                              fontWeight: "bold",
                            }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleAddToWishlist(product.id);
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <Text
                                fontSize="sm"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="500"
                                as="a"
                                href={`/product/${product.slug}`}
                                fontFamily="Airbnb Cereal VF"
                              >
                                {product.title}
                              </Text>

                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="600"
                                  color="gray.800"
                                  fontFamily="Airbnb Cereal VF"
                                >
                                  {product?.final_price_gross.toFixed(2) ??
                                    product?.regular_price_gross.toFixed(2) ??
                                    0}{" "}
                                  €
                                </Text>

                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Badge
                                        bg="rgba(255, 0, 0, 1)"
                                        fontFamily="Airbnb Cereal VF"
                                        color="gray.200"
                                        border="1px solid rgba(33, 1, 1, 0.43)"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="500"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="lg"
                                        textTransform="uppercase"
                                        flexShrink={0}
                                      >
                                        -
                                        {Math.round(
                                          ((product.regular_price_gross -
                                            product.final_price_gross) /
                                            product.regular_price_gross) *
                                            100
                                        )}
                                        %
                                      </Badge>

                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.700"
                                        textDecoration="line-through"
                                        fontFamily="Airbnb Cereal VF"
                                        fontWeight="500"
                                      >
                                        €
                                        {product.regular_price_gross.toFixed(2)}{" "}
                                      </Text>
                                    </>
                                  )}
                              </HStack>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <></>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}

function ProductImage({
  src,
  alt,
  height = { base: "150px", sm: "180px", md: "200px" },
  bg = "transparent",
  ...props
}) {
  return (
    <Box
      w="full"
      h={height}
      bg={bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      pl={2}
      pr={2}
      pt={2}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        w="full"
        h="full"
        objectFit="contain"
        objectPosition="center"
        fallback={
          <Box
            w="full"
            h={height}
            bg="#fff"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
        }
      />
    </Box>
  );
}

export default Home;
