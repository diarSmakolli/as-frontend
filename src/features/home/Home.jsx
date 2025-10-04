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
  Spacer,
  textDecoration,
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
import KidsImage from "../../assets/kids.png";
import FashionImage from "../../assets/fashion.png";
import HotNewArrivals from "../../assets/hot-new-arrivals.png";
import TopTechImage from "../../assets/top-tech.png";
import SliderNoOne from "../../assets/home/as1/maison-new.png";
import SliderNoOneMobile from "../../assets/home/as1/maison-new.png";
import BagageImage from "../../assets/bagages.png";
import GardenImage from "../../assets/home/as1/garden.png";
import SanitaryImage from "../../assets/home/as1/sanitary.png";
import BebeImage from "../../assets/home/as1/bebe.png";
import PorteImage from "../../assets/porte.png";
import FurnitureImage from "../../assets/furniture.png";
import FenetreImage from "../../assets/fenetre.png";
import BricolageImage from "../../assets/bricolage.png";
import AutoImage from "../../assets/auto.png";
import FurnitureII from "../../assets/furnitureii.png";
import CarToolsImage from "../../assets/car-tools.png";
import CarAccessories from "../../assets/auto-accessories.png";
import CarPaintsImage from "../../assets/car-paints.png";
import CarOilsImage from "../../assets/car-fluids.png";
import MaisonVideoOne from "../../assets/video-1.mp4";
import FlashDealsImg from "../../assets/flash-sale.png";
import BricolageMobile from "../../assets/bricolage-mobile.png";
import FlashSaleMobileImage from "../../assets/flash-sale-mobile.png";
import BebeMobileImage from "../../assets/bebe-mobile.png";
import BeautyMobile from "../../assets/beauty-mobile.jpg";
import LightsMobile from "../../assets/lights-mobile.jpg";
import { homeService } from "./services/homeService";
import Footer from "../../shared-customer/components/Footer";
import MobileCategoryNavigation from "../../shared-customer/components/MobileCategoryNavigation";
import { useSwipeable } from "react-swipeable";
import ExploreAll from "../../shared-customer/components/ExploreAll";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../shared-customer/components/Navbar";
import { customerAccountService } from "../customer-account/customerAccountService";
import { useToast } from "@chakra-ui/react";
import { useCustomerAuth } from "../customer-account/auth-context/customerAuthContext";
import { customToastContainerStyle } from "../../commons/toastStyles";

function Home() {
  let toast = useToast();
  const { customer, isLoading } = useCustomerAuth();
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [currentMobilePromoSlide, setCurrentMobilePromoSlide] = useState(0);
  const promoSwiperRef = useRef(null);
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
  const [beautyProducts, setBeautyProducts] = useState([]);
  const [beautyProductsLoading, setBeautyProductsLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);
  const [parentCategoriesLoading, setParentCategoriesLoading] = useState(false);

  const carouselImage = useBreakpointValue({
    base: GarageSliderMobile, // mobile image
    lg: FashionImage, // desktop image
  });

  // Promotional carousel data
  const promoSlides = [
    {
      id: 1,
      title: "",
      subtitle: "",
      buttonText: "",
      image: SliderNoOne,
      textColor: "transparent",
      subtitleColor: "transparent",
      buttonBg: "transparent",
      buttonHoverBg: "transparent",
      link: "/category/automoto",
    },

    // {
    //   id: 2,
    //   title: "",
    //   subtitle: "",
    //   buttonText: "",
    //   bgGradient: "transparent",
    //   image: "",
    //   textColor: "transparent",
    //   subtitleColor: "transparent",
    //   buttonBg: "transparent",
    //   buttonHoverBg: "transparent",
    //   link: "/category/automoto",
    // },
  ];

  const promoSlidesMobile = [
    {
      id: 1,
      title: "",
      subtitle: "",
      buttonText: "",
      image: SliderNoOne,
      textColor: "transparent",
      subtitleColor: "transparent",
      buttonBg: "transparent",
      buttonHoverBg: "transparent",
      link: "/category/automoto",
    },
    {
      id: 2,
      title: "",
      subtitle: "",
      buttonText: "",
      image: GarageSliderMobile,
      textColor: "transparent",
      subtitleColor: "transparent",
      buttonBg: "transparent",
      buttonHoverBg: "transparent",
      link: "/category/garage",
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
    fetchTopBeautyProducts();

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

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      setParentCategoriesLoading(true);
      try {
        const response = await homeService.getAllCategories();
        // Filter only parent categories if needed (e.g., those with no parent_id)
        const parents = response.data
          ? response.data.filter((cat) => !cat.parent_id)
          : [];
        setParentCategories(parents);
      } catch (error) {
        setParentCategories([]);
      } finally {
        setParentCategoriesLoading(false);
      }
    }
    fetchCategories();
  }, []);

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
        min_discount: 5, // Minimum 5% discount for flash deals
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

  const fetchTopBeautyProducts = async () => {
    try {
      setBeautyProductsLoading(true);
      const response = await homeService.getTopProductsByCategorySlug("beaut", {
        limit: 20,
      });

      const products = response.data || [];

      setBeautyProducts(products);
    } catch (error) {
      setBeautyProducts([]);
    } finally {
      setBeautyProductsLoading(false);
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

  // Beauty
  const topBeautyImpressionRefs = useImpressionObserver(
    beautyProducts,
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
    <Box minH="100vh" bg="rgba(255, 255, 255, 1)">
      {/* Header matching Wish design but with AS Solutions branding */}
      <Navbar />

      {/* Main Content with Container */}
      <Container maxW="8xl" py={6} px={4}>
        <Flex gap={4} display={{ base: "none", md: "flex" }}>
          <Box bg="white" h="100%" mb={8} width="370px">
            <Link to="/category/salle-de-bain-sanitaires">
              <Box
                bg="white"
                h="240.03px"
                rounded="xl"
                bgImage={SanitaryImage}
                bgSize="100%"
              >
                <Text
                  color="rgb(255, 255, 255)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={6}
                  fontSize="24px"
                  lineHeight={"1.1"}
                >
                  L’alliance du style et <br />
                  de la pureté.
                </Text>

                <Text
                  color="rgb(255, 255, 255)"
                  fontWeight="400"
                  pl={4}
                  pt={6}
                  fontSize="16px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>
            </Link>

            <Link to="/category/fentres">
              <Box
                bg="white"
                h="555.49px"
                rounded="xl"
                mt={2}
                bgImage={FenetreImage}
                bgSize="100%"
              >
                <Text
                  color="rgb(0, 30, 96)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={6}
                  fontSize="28px"
                  lineHeight={"1.1"}
                >
                  Lumière, confort, élégance.
                </Text>

                <Text
                  color="rgb(0, 30, 96)"
                  fontWeight="400"
                  pl={4}
                  pt={4}
                  fontSize="16px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>
            </Link>

            <Link to="/category/bricolage-et-outils">
              <Box
                bg="white"
                h="208.13px"
                rounded="xl"
                mt={2}
                bgImage={BricolageImage}
                bgSize="101%"
              >
                <Text
                  color="rgb(0, 30, 96)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={4}
                  fontSize="25px"
                  lineHeight={"1.1"}
                >
                  Vos projets, <br /> nos outils.
                </Text>

                <Text
                  color="rgb(0, 30, 96)"
                  fontWeight="400"
                  textDecoration={"underline"}
                  pl={4}
                  pt={4}
                  fontSize="16px"
                >
                  Shop now
                </Text>
              </Box>
            </Link>
          </Box>

          <Box bg="white" h="600px" width="764.01px">
            <Box bg="white" h="384.75px" rounded="xl">
              <Box position="relative" h="full">
                {/* Carousel content */}
                <Box position="relative" h="full">
                  {/* Carousel content - individual boxes (no mapping) */}
                  <Box position="relative" h="full" overflow="hidden">
                    {/* Slide 1 */}
                    <Box
                      as="a"
                      href="/category/maisons-prfabriques-en-bois"
                      position="absolute"
                      inset={0}
                      display={currentPromoSlide === 0 ? "flex" : "none"}
                      alignItems="center"
                      justifyContent="space-between"
                      p={0}
                      transition="all 0.4s ease-in-out"
                    >
                      <Image
                        src={SliderNoOne}
                        alt="La maison de vos rêves"
                        w="full"
                        h="full"
                        rounded="xl"
                        objectFit="cover"
                        transition="transform 0.3s"
                        _hover={{ transform: "scale(1.02)" }}
                        zIndex={1}
                      />
                      {/* Text overlay above image */}
                      <VStack
                        position="absolute"
                        left={{ base: 4, md: 8 }}
                        top={{ base: 6, md: 10 }}
                        zIndex={2}
                        align="start"
                        spacing={1}
                        maxW={{ base: "60%", md: "50%" }}
                      >
                        <Text
                          fontSize={{ base: "lg", md: "4xl" }}
                          fontWeight="700"
                          color="rgb(0, 30, 96)"
                          fontFamily="Bogle"
                        >
                          La maison de vos rêves
                        </Text>
                        <Text
                          fontSize={{ base: "sm", md: "md" }}
                          color="rgb(0, 30, 96)"
                        >
                          Livraison rapide et fiable
                        </Text>
                      </VStack>
                    </Box>
                  </Box>

                  {/* Carousel indicators (keeps existing behaviour) */}
                  <HStack
                    position="absolute"
                    bottom="4"
                    left="50%"
                    transform="translateX(-50%)"
                    spacing={2}
                    zIndex={3}
                  >
                    {[0].map((index) => (
                      <Box
                        key={index}
                        w="8px"
                        h="8px"
                        bg={currentPromoSlide === index ? "white" : "gray.300"}
                        borderRadius="full"
                        cursor="pointer"
                        transition="all 0.2s"
                        onClick={() => setCurrentPromoSlide(index)}
                        _hover={{ transform: "scale(1.2)" }}
                      />
                    ))}
                  </HStack>
                </Box>

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
            </Box>

            <Box mt={6}>
              <SimpleGrid columns={2} spacing={2} mt={2}>
                <Link to="/category/jardin-quipement-extrieur">
                  <Box
                    bg="white"
                    h="367.87px"
                    rounded="lg"
                    bgImage={GardenImage}
                    bgSize="100%"
                  >
                    <Text
                      color="rgb(255, 255, 255)"
                      fontFamily="Bogle"
                      fontWeight="700"
                      pl={4}
                      pt={6}
                      fontSize="28px"
                      lineHeight={"1.1"}
                    >
                      L’art de <br />
                      vivre en plein air.
                    </Text>

                    <Text
                      color="rgba(237, 231, 231, 1)"
                      fontWeight="400"
                      pl={4}
                      pt={6}
                      fontSize="16px"
                      lineHeight={"1.1"}
                      textDecor={"underline"}
                    >
                      Shop now
                    </Text>
                  </Box>
                </Link>

                <Link to="/flash-deals">
                  <Box
                    bg="white"
                    h="367.87px"
                    rounded="lg"
                    bgImage={FlashDealsImg}
                    bgSize="100%"
                  >
                    <Text
                      color="rgb(0, 30, 96)"
                      fontFamily="Bogle"
                      fontWeight="700"
                      pl={4}
                      pt={6}
                      fontSize="28px"
                      lineHeight={"1.1"}
                    >
                      Up to 30% off.
                    </Text>

                    <Text
                      color="rgb(0, 30, 96)"
                      fontWeight="400"
                      pl={4}
                      pt={6}
                      fontSize="16px"
                      lineHeight={"1.1"}
                      textDecor={"underline"}
                    >
                      Shop now
                    </Text>
                  </Box>
                </Link>
              </SimpleGrid>
            </Box>

            <Box
              bg="white"
              h="207.8px"
              rounded="lg"
              mt={9}
              bgImage={FurnitureImage}
              bgSize="101%"
            >
              <Text
                color="#fff"
                fontFamily="Bogle"
                fontWeight="600"
                pl={4}
                pt={8}
                fontSize="18px"
              >
                ✨ Nouveau
              </Text>

              <Text
                color="#fff"
                fontFamily="Bogle"
                fontWeight="700"
                pl={4}
                pt={1}
                fontSize="30px"
                lineHeight={"1.1"}
              >
                Les membres profitent <br /> d’avantages exclusifs
              </Text>
            </Box>
          </Box>

          <Box bg="white" h="600px" width="370.01px">
            <Link to="/category/bagages">
              <Box
                bg="white"
                h="208.13px"
                rounded="lg"
                bgImage={BagageImage}
                bgSize="100%"
              >
                <Text
                  color="rgb(0, 30, 96)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={6}
                  fontSize="24px"
                  lineHeight={"1.1"}
                >
                  L’élégance qui vous <br /> suit partout.
                </Text>

                <Text
                  color="rgb(0, 30, 96)"
                  fontWeight="400"
                  pl={4}
                  pt={6}
                  fontSize="16px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>
            </Link>

            <Link to="/category/enfants-bb">
              <Box
                bg="white"
                h="246.02px"
                rounded="lg"
                mt={2}
                bgImage={BebeImage}
                bgSize="100%"
              >
                <Text
                  color="rgb(0, 30, 96)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={6}
                  fontSize="24px"
                  lineHeight={"1.1"}
                >
                  Grandir en douceur, <br /> jouer en sécurité.
                </Text>

                <Text
                  color="rgb(0, 30, 96)"
                  fontWeight="400"
                  pl={4}
                  pt={6}
                  fontSize="16px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>
            </Link>

            <Link to="/category/portes">
              <Box
                bg="white"
                h="555.49px"
                rounded="lg"
                mt={2}
                bgImage={PorteImage}
                bgSize="100%"
              >
                <Text
                  color="rgb(0, 30, 96)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={10}
                  pt={6}
                  fontSize="24px"
                  lineHeight={"1.1"}
                >
                  L’élégance qui vous <br /> suit partout.
                </Text>

                <Text
                  color="rgb(0, 30, 96)"
                  fontWeight="400"
                  pl={10}
                  pt={4}
                  fontSize="16px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>
            </Link>
          </Box>
        </Flex>

        {/* Mobile Version */}
        <Box display={{ base: "inline", md: "none" }}>
          <HStack>
            <Box bg="blue.300" h="200px" rounded="xl" w="full">
              <Box
                bg="blue.300"
                h="200px"
                rounded="xl"
                w="full"
                position="relative"
                overflow="hidden"
              >
                {/* Manual mobile carousel slides */}
                {currentMobilePromoSlide === 0 && (
                  <Box
                    as="a"
                    href="/category/maisons-prfabriques-en-bois"
                    position="relative"
                    h="full"
                    w="full"
                    display="block"
                  >
                    <Image
                      src={SliderNoOneMobile}
                      alt="Jasqua mobile promo"
                      w="full"
                      h="full"
                      objectFit="cover"
                      rounded="xl"
                    />
                    {/* Overlay text for mobile slide 1 */}
                    <Box
                      position="absolute"
                      top="15%"
                      left="8%"
                      zIndex={2}
                      color="white"
                      textAlign="left"
                    >
                      <Text
                        color="rgb(0, 30, 96)"
                        fontFamily="Bogle"
                        fontWeight="700"
                        pl={0}
                        pt={0}
                        fontSize="24px"
                        lineHeight={"1.1"}
                      >
                        La maison de vos <br />
                        rêves, livrée.
                      </Text>

                      <Text
                        color="rgb(0, 30, 96)"
                        fontWeight="400"
                        pl={0}
                        pt={2}
                        fontSize="13px"
                        lineHeight={"1.1"}
                        textDecor={"underline"}
                      >
                        Shop now
                      </Text>
                    </Box>
                  </Box>
                )}

                {/* Carousel indicators */}
                <HStack
                  position="absolute"
                  bottom="4"
                  left="50%"
                  transform="translateX(-50%)"
                  spacing={2}
                  zIndex={3}
                >
                  {[0].map((index) => (
                    <Box
                      key={index}
                      w="8px"
                      h="8px"
                      bg={
                        currentMobilePromoSlide === index ? "white" : "gray.300"
                      }
                      borderRadius="full"
                      cursor="pointer"
                      transition="all 0.2s"
                      onClick={() => setCurrentMobilePromoSlide(index)}
                      _hover={{
                        transform: "scale(1.2)",
                      }}
                    />
                  ))}
                </HStack>

                {/* Navigation arrows */}
                {/* <IconButton
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
                    setCurrentMobilePromoSlide((prev) =>
                      prev === 0 ? 1 : prev - 1
                    )
                  }
                  aria-label="Previous slide"
                  zIndex={3}
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
                    setCurrentMobilePromoSlide((prev) => (prev + 1) % 2)
                  }
                  aria-label="Next slide"
                  zIndex={3}
                /> */}
              </Box>
            </Box>
          </HStack>

          <HStack mt={4} maxH="500px">
            <SimpleGrid columns={2} spacing={5}>
              <VStack>
                <Box
                  bg="blue.300"
                  h="120px"
                  rounded="lg"
                  bgImage={BricolageMobile}
                  bgSize="100%"
                  width="full"
                  as="a"
                  href="/category/bricolage-et-outils"
                >
                  <Text
                    color="rgb(0, 30, 96)"
                    fontFamily="Bogle"
                    fontWeight="700"
                    pl={4}
                    pt={2}
                    fontSize="15px"
                    lineHeight={"1.1"}
                  >
                    Vos projets, <br /> nos outils.
                  </Text>

                  <Text
                    color="rgb(0, 30, 96)"
                    fontWeight="400"
                    pl={4}
                    pt={3}
                    fontSize="10px"
                    lineHeight={"1.1"}
                    textDecor={"underline"}
                  >
                    Shop now
                  </Text>
                </Box>

                <Box
                  bg="blue.300"
                  h="190px"
                  rounded="lg"
                  bgImage={FlashSaleMobileImage}
                  bgSize="100%"
                  width="full"
                >
                  <Text
                    color="rgb(0, 30, 96)"
                    fontFamily="Bogle"
                    fontWeight="700"
                    pl={4}
                    pt={4}
                    fontSize="20px"
                    lineHeight={"1.1"}
                  >
                    Up to 30% off.
                  </Text>

                  <Text
                    color="rgb(0, 30, 96)"
                    fontWeight="400"
                    pl={4}
                    pt={3}
                    fontSize="10px"
                    lineHeight={"1.1"}
                    textDecor={"underline"}
                  >
                    Shop now
                  </Text>
                </Box>
              </VStack>

              <VStack>
                <Box
                  bg="blue.300"
                  h="320px"
                  rounded="lg"
                  bgImage={BebeMobileImage}
                  bgSize="100%"
                  width="189px"
                  as="a"
                  href="/category/enfants-bb"
                >
                  <Text
                    color="rgb(0, 30, 96)"
                    fontFamily="Bogle"
                    fontWeight="700"
                    pl={4}
                    pt={4}
                    fontSize="15px"
                    lineHeight={"1.1"}
                  >
                    Grandir en douceur,
                    <br />
                    jouer en sécurité.
                  </Text>

                  <Text
                    color="rgb(0, 30, 96)"
                    fontWeight="400"
                    pl={4}
                    pt={3}
                    fontSize="10px"
                    lineHeight={"1.1"}
                    textDecor={"underline"}
                  >
                    Shop now
                  </Text>
                </Box>
              </VStack>
            </SimpleGrid>
          </HStack>

          <HStack mt={4}>
            <Box
              bg="blue.300"
              h="200px"
              rounded="lg"
              width="100%"
              bgImage={FurnitureImage}
            >
              <Text
                color="#fff"
                fontFamily="Bogle"
                fontWeight="600"
                pl={4}
                pt={8}
                fontSize="15px"
              >
                ✨ Nouveau
              </Text>

              <Text
                color="#fff"
                fontFamily="Bogle"
                fontWeight="700"
                pl={4}
                pt={1}
                fontSize="26px"
                lineHeight={"1.1"}
              >
                Les membres profitent <br /> d’avantages <br /> exclusifs
              </Text>
            </Box>
          </HStack>

          <HStack mt={4}>
            <Box
              bg="blue.300"
              h="200px"
              rounded="lg"
              bgImage={BagageImage}
              bgSize="100%"
              width="100%"
              as="a"
              href="/category/bagages"
            >
              <Text
                color="rgb(0, 30, 96)"
                fontFamily="Bogle"
                fontWeight="700"
                pl={4}
                pt={6}
                fontSize="24px"
                lineHeight={"1.1"}
              >
                L’élégance qui vous <br /> suit partout.
              </Text>

              <Text
                color="rgb(0, 30, 96)"
                fontWeight="400"
                pl={4}
                pt={4}
                fontSize="16px"
                lineHeight={"1.1"}
                textDecor={"underline"}
              >
                Shop now
              </Text>
            </Box>
          </HStack>

          {/* Beauty */}
          <HStack mt={4}>
            <Box
              bg="blue.300"
              h="200px"
              rounded="lg"
              bgImage={BeautyMobile}
              bgSize="100%"
              width="100%"
              as="a"
              href="/category/beaut"
            >
              <Text
                color="rgba(255, 255, 255, 1)"
                fontFamily="Bogle"
                fontWeight="700"
                pl={4}
                pt={6}
                fontSize="24px"
                lineHeight={"1.1"}
              >
                L’élégance qui vous <br /> suit partout.
              </Text>

              <Text
                color="rgba(255, 255, 255, 1)"
                fontWeight="400"
                pl={4}
                pt={4}
                fontSize="16px"
                lineHeight={"1.1"}
                textDecor={"underline"}
              >
                Shop now
              </Text>
            </Box>
          </HStack>

          <Box mt={4}>
            <SimpleGrid columns={2} spacing={3}>
              <Box
                bg="blue.300"
                h="300px"
                rounded="lg"
                bgImage={LightsMobile}
                bgSize="cover"
                width="full"
                as="a"
                href="/category/clairagee"
              >
                <Text
                  color="rgba(255, 255, 255, 1)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={6}
                  fontSize="18px"
                  lineHeight={"1.1"}
                >
                  L’élégance qui vous <br /> suit partout.
                </Text>

                <Text
                  color="rgba(255, 255, 255, 1)"
                  fontWeight="400"
                  pl={4}
                  pt={4}
                  fontSize="14px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>

              <Box
                bg="blue.300"
                h="300px"
                rounded="lg"
                width="full"
                bgImage={GardenImage}
                bgSize="cover"
                as="a"
                href="/category/jardin-quipement-extrieur"
              >
                <Text
                  color="rgba(255, 255, 255, 1)"
                  fontFamily="Bogle"
                  fontWeight="700"
                  pl={4}
                  pt={6}
                  fontSize="18px"
                  lineHeight={"1.1"}
                >
                  L’élégance qui vous <br /> suit partout.
                </Text>

                <Text
                  color="rgba(255, 255, 255, 1)"
                  fontWeight="400"
                  pl={4}
                  pt={4}
                  fontSize="14px"
                  lineHeight={"1.1"}
                  textDecor={"underline"}
                >
                  Shop now
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>

        {/* Categories TOP Products */}
        {/* Portes */}
        <Box mb={8} mt={2}>
          <Flex align="center" justify="space-between" mb={4}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="black"
                fontSize={{ base: "xl", md: "18px" }}
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
                        bg="transparent"
                        overflow="hidden"
                        shadow="none"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        // _hover={{
                        //   shadow: "md",
                        //   transform: "translateY(-6px)",
                        // }}
                        flexShrink={0}
                        // _before={{
                        //   content: '""',
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   opacity: 0.3,
                        //   pointerEvents: "none",
                        //   zIndex: 0,
                        // }}
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
                                fontWeight="400"
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
                                  fontSize={{ base: "lg", sm: "lg" }}
                                  fontWeight="700"
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
          <Flex align="center" justify="space-between" mb={4}>
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
                        bg="transparent"
                        overflow="hidden"
                        shadow="none"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        // _hover={{
                        //   shadow: "md",
                        //   transform: "translateY(-6px)",
                        // }}
                        flexShrink={0}
                        // _before={{
                        //   content: '""',
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   opacity: 0.3,
                        //   pointerEvents: "none",
                        //   zIndex: 0,
                        // }}
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
                                fontWeight="400"
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
                                  fontSize={{ base: "lg", sm: "lg" }}
                                  fontWeight="700"
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

        <Flex gap={6} mt={5} display={{ base: "none", md: "flex" }}>
          <Box bg="white" h="100%" mb={8} width="566px">
            <Box bg="blue.300" h="566px" rounded="xl">
              <Image
                src={AutoImage}
                h="full"
                w="full"
                objectFit="fill"
                rounded="xl"
              />
            </Box>
          </Box>

          <Box bg="white" h="600px" width="448.01px">
            <Box bg="blue.300" h="251.1px" rounded="xl">
              <Image
                src={CarAccessories}
                h="full"
                w="full"
                objectFit="fill"
                rounded="xl"
              />
            </Box>

            <Box>
              <SimpleGrid columns={2} spacing={2} mt={6}>
                <Box
                  bg="blue.300"
                  h="291.18px"
                  rounded="lg"
                  bgImage={CarPaintsImage}
                  bgSize="100%"
                ></Box>
                <Box
                  bg="blue.300"
                  h="291.18px"
                  rounded="lg"
                  bgImage={CarOilsImage}
                  bgSize="100%"
                ></Box>
              </SimpleGrid>
            </Box>
          </Box>

          <Box bg="white" h="600px" width="auto" maxW="340px">
            <Box h="563.97px" rounded="lg">
              <Image
                src={CarToolsImage}
                h="full"
                w="full"
                objectFit="fill"
                rounded="xl"
              />
            </Box>
          </Box>
        </Flex>

        {/* Auto moto */}
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
                        bg="transparent"
                        overflow="hidden"
                        shadow="none"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        // _hover={{
                        //   shadow: "md",
                        //   transform: "translateY(-6px)",
                        // }}
                        flexShrink={0}
                        // _before={{
                        //   content: '""',
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   opacity: 0.3,
                        //   pointerEvents: "none",
                        //   zIndex: 0,
                        // }}
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
                                fontWeight="400"
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
                                  fontSize={{ base: "lg", sm: "lg" }}
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
          <Flex align="center" justify="space-between" mb={4}>
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
                        bg="transparent"
                        overflow="hidden"
                        shadow="none"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        // _hover={{
                        //   shadow: "md",
                        //   transform: "translateY(-6px)",
                        // }}
                        flexShrink={0}
                        // _before={{
                        //   content: '""',
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   opacity: 0.3,
                        //   pointerEvents: "none",
                        //   zIndex: 0,
                        // }}
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
                                fontSize="sm"
                                color="rgba(42, 42, 42, 1)"
                                noOfLines={2}
                                lineHeight="short"
                                minH="40px"
                                title={product.title}
                                fontWeight="400"
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
                                  fontSize={{ base: "lg", sm: "lg" }}
                                  fontWeight="700"
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
          <Flex align="center" justify="space-between" mb={4}>
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
                        bg="transparent"
                        overflow="hidden"
                        shadow="none"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        // _hover={{
                        //   shadow: "md",
                        //   transform: "translateY(-6px)",
                        // }}
                        flexShrink={0}
                        // _before={{
                        //   content: '""',
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   opacity: 0.3,
                        //   pointerEvents: "none",
                        //   zIndex: 0,
                        // }}
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
                                fontWeight="400"
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
                                  fontSize={{ base: "lg", sm: "lg" }}
                                  fontWeight="700"
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
                Beauty
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
                navigate("/category/beaut");
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
                {beautyProductsLoading ? (
                  [...Array(6)].map((_, index) => (
                    <Card
                      key={`top-beauty-skeleton-${index}`}
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
                ) : beautyProducts && beautyProducts?.length > 0 ? (
                  beautyProducts?.map((product, index) => {
                    const productId = `top-beauty-${index}-${product?.id}`;
                    return (
                      <Card
                        key={productId}
                        bg="transparent"
                        overflow="hidden"
                        shadow="none"
                        // transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px solid rgba(145, 158, 171, 0.2)"
                        position="relative"
                        rounded="12px"
                        minW={{ base: "200px", sm: "240px", md: "240px" }}
                        maxW={{ base: "200px", sm: "240px", md: "240px" }}
                        // _hover={{
                        //   shadow: "md",
                        //   transform: "translateY(-6px)",
                        // }}
                        flexShrink={0}
                        // _before={{
                        //   content: '""',
                        //   position: "absolute",
                        //   top: 0,
                        //   left: 0,
                        //   right: 0,
                        //   bottom: 0,
                        //   opacity: 0.3,
                        //   pointerEvents: "none",
                        //   zIndex: 0,
                        // }}
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
                                fontWeight="400"
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
                                  fontSize={{ base: "lg", sm: "lg" }}
                                  fontWeight="700"
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

        {/* Show videos here */}
        <Box mb={8}>
          <Heading fontSize="lg" mb={4} fontWeight="600">
            Nos vidéos
          </Heading>
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
            <HStack spacing={6} minW="max-content" px={2}>
              {/* Example videos - replace src with your own video URLs */}
              <Box w="320px" h="500px" overflow="hidden" borderRadius="md">
                <video
                  src={MaisonVideoOne}
                  controls
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    display: "block",
                  }}
                  playsInline
                />
              </Box>
            </HStack>
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
