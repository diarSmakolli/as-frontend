import React, { memo, useMemo, useCallback, lazy, Suspense, useState, useRef, useEffect } from 'react';
import { 
  Box, Container, Flex, HStack, VStack, SimpleGrid, Text, Heading, Button, 
  Card, CardBody, Badge, IconButton, Image, Spinner, Skeleton, SkeletonText,
  Icon, useBreakpointValue, useToast 
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
// Use optimized icon imports
import { Helmet } from "react-helmet-async";
import { HeartIcon, ChevronRightIcon, ChevronLeftIcon, FaRegHeart} from '../../components/Icons';
import { useCustomerAuth } from '../customer-account/auth-context/customerAuthContext';
import { homeService } from "./services/homeService";
import { customerAccountService } from "../customer-account/customerAccountService";
import { customToastContainerStyle } from "../../commons/toastStyles";
import { useSEO, generateHomeSEO } from '../../hooks/useSEO';

// Asset imports
import Logo from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/logo-as.png";
import AsSolutionsPhoto from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/welcome-as.png";
import FlashSalePromo from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/flash-sale-4.png";
import BabySalePromo from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/baby-3.png";
import FournitureSalePromo from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/fourniture-2.png";
import FourniturePromoSlide from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/fourniture-g.png";
import GaragePromoSlide from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/garage.png";
import JasquaMobile from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/jasqua-mobile.png";
import FashionImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/fashion.png";
import GarageSliderMobile from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/garage-slider-mobile.png";
import SliderNoOne from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/as1/maison-new.png";
import SliderNoOneMobile from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/as1/maison-new.png";
import BagageImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/bagages.png";
import GardenImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/as1/garden.png";
import SanitaryImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/sanitary.png";
import BebeImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/as1/bebe.png";
import PorteImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/porte.png";
import FurnitureImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/furniture.png";
import FenetreImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/fenetre.png";
import BricolageImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/bricolage.png";
import AutoImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/auto.png";
import FurnitureII from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/furnitureii.png";
import CarToolsImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/car-tools.png";
import CarAccessories from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/auto-accessories.png";
import CarPaintsImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/car-paints.png";
import CarOilsImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/car-fluids.png";
import MaisonVideoOne from "../../assets/video-1.mp4";
import FlashDealsImg from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/flash-sale.png";
import BricolageMobile from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/bricolage-mobile.png";
import FlashSaleMobileImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/flash-sale-mobile.png";
import BebeMobileImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/flash-sale-mobile.png";
import BeautyMobile from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/beauty-mobile.jpg";
import LightsMobile from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/lights-mobile.jpg";
import VerandaImage from "https://as-solutions-storage.fra1.cdn.digitaloceanspaces.com/home-page-assets/as2/veranda.png";

// Component imports
import Footer from "../../shared-customer/components/Footer";
import MobileCategoryNavigation from "../../shared-customer/components/MobileCategoryNavigation";
import ExploreAll from "../../shared-customer/components/ExploreAll";
import Navbar from "../../shared-customer/components/Navbar";
import { useSwipeable } from "react-swipeable";
import { FaChevronRight } from 'react-icons/fa';

function Home() {
  let toast = useToast();
  const { customer, isLoading } = useCustomerAuth();
  
  // SEO for home page
  const homeSEO = useMemo(() => generateHomeSEO(), []);
  
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

  // Memoize expensive operations
  const handleAddToWishlist = useCallback(async (productId) => {
    if (!customer || !customer.id) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des produits à votre liste de souhaits.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await customerAccountService.addToWishlist(customer.id, productId);
      toast({
        title: "Produit ajouté !",
        description: "Le produit a été ajouté à votre liste de souhaits.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit à votre liste de souhaits.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [customer, toast]);

  const isMobile = useBreakpointValue({ base: true, md: false });
  const columns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5, xl: 6 });

  // Memoize slide handlers for performance
  const handlePromoSlideChange = useCallback((index) => {
    setCurrentPromoSlide(index);
  }, []);

  const handleMobilePromoSlideChange = useCallback((index) => {
    setCurrentMobilePromoSlide(index);
  }, []);

  // Progressive loading for better performance
  useEffect(() => {
    // Load critical data first
    fetchNewArrivals();
    fetchFlashDeals();
    
    // Load secondary data with delay
    const timer1 = setTimeout(() => {
      fetchTopDoorsProducts();
      fetchTopWindowssProducts();
    }, 100);
    
    const timer2 = setTimeout(() => {
      fetchTopAutoMotoProducts();
      fetchTopBabyProducts();
    }, 300);
    
    const timer3 = setTimeout(() => {
      fetchFurnitureFlashDeals();
      fetchTopConstructionProducts();
      fetchTopSanitaryProducts();
      fetchTopBeautyProducts();
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };

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

  // Optimized Intersection Observer hook for impressions (BATCHED)
  const useImpressionObserver = useCallback((products, section, transformFn) => {
    const observedRef = useRef([]);
    const sentImpressions = useRef(new Set());

    useEffect(() => {
      if (!products || products.length === 0) return;
      
      // Use passive intersection observer for better performance
      const observer = new IntersectionObserver(
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
          
          // Batch API calls for better performance
          if (batchEvents.length > 0) {
            requestIdleCallback(() => {
              homeService.createProductEventsBatch(batchEvents).catch(() => {});
            });
          }
        },
        { 
          threshold: 0.5,
          rootMargin: '50px'  // Preload slightly before visible
        }
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
  }, []);

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

  // Early loading state
  if (isLoading) {
    return (
      <Box minH="100vh" bg="rgba(255, 255, 255, 1)" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="blue.500" />
      </Box>
    );
  }

  return (
    <>

    <Helmet>
        {/* Primary Meta Tags */}
        <title>AS Solutions Fournitures - Fournitures de Qualité pour la Maison, Bricolage & Jardin</title>
        <meta name="title" content="AS Solutions Fournitures - Fournitures de Qualité pour la Maison, Bricolage & Jardin" />
        <meta name="description" content="Découvrez notre vaste sélection de fournitures : bricolage, maison, jardin, auto-moto et plus. ✓ Prix compétitifs ✓ Livraison rapide ✓ Service client expert. Plus de 10 000 produits disponibles en ligne." />
        <meta name="keywords" content="fournitures, bricolage, maison, jardin, outils, auto-moto, bébé, beauté, construction, portes, fenêtres, sanitaires, France, AS Solutions" />
        <meta name="author" content="AS Solutions Fournitures" />
        <link rel="canonical" href="https://assolutionsfournitures.fr" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://assolutionsfournitures.fr" />
        <meta property="og:site_name" content="AS Solutions Fournitures" />
        <meta property="og:title" content="AS Solutions Fournitures - Fournitures de Qualité pour Tous vos Projets" />
        <meta property="og:description" content="Découvrez notre vaste sélection de fournitures : bricolage, maison, jardin, auto-moto et plus. ✓ Prix compétitifs ✓ Livraison rapide ✓ Service client expert" />
        <meta property="og:image" content="https://assolutionsfournitures.fr/assets/logo-as.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />       

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />

        {/* Structured Data - Organization */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "AS Solutions Fournitures",
            "url": "https://assolutionsfournitures.fr",
            "logo": "https://assolutionsfournitures.fr/assets/logo-as.png",
            "description": "Fournisseur de produits de qualité pour la maison, bricolage, jardin, auto-moto et plus",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "FR"
            },
            
          })}
        </script>

        {/* Structured Data - WebSite with SearchAction */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AS Solutions Fournitures",
            "url": "https://assolutionsfournitures.fr",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://assolutionsfournitures.fr/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

    <Box minH="100vh" bg="rgba(255, 255, 255, 1)">
      {/* SEO and Accessibility Meta */}
      <Box as="header" role="banner">
        <Navbar />
      </Box>

      {/* Main Content with Container */}
      <Container maxW="8xl" py={6} px={4} as="main" role="main">
        <Flex gap={4} display={{ base: "none", md: "flex" }} as="section" aria-label="Promotions principales">
          <Box bg="white" h="100%" mb={8} width="370px">
            <Link to="/category/salle-de-bain-sanitaires" 
            aria-label="Voir les produits sanitaires"
            title="Voir les produits sanitaires"
            >
              <Box
                bg="white"
                h="240.03px"
                rounded="xl"
                bgImage={SanitaryImage}
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
                  L’alliance du style et <br />
                  de la pureté.
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

            <Link to="/category/fentres"
            aria-label="Voir les produits fenêtres"
            title="Voir les produits fenêtres"
            >
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

            <Link to="/category/bricolage-et-outils"
              aria-label="Voir les produits de bricolage et outils"
              title="Voir les produits de bricolage et outils"
            >
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
                      title="Voir les maisons préfabriquées en bois"
                      aria-label="Voir les maisons préfabriquées en bois"
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
                        alt="La maison de vos rêves - Maisons préfabriquées en bois AS Solutions"
                        w="full"
                        h="full"
                        rounded="xl"
                        objectFit="cover"
                        transition="transform 0.3s"
                        _hover={{ transform: "scale(1.02)" }}
                        zIndex={1}
                        loading="eager"
                        fetchpriority="high"
                        decoding="async"
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

                    {/* Slide 2 */}
                    <Box
                      as="a"
                      href="/category/structures-extrieures"
                      position="absolute"
                      title="Voir les structures extérieures"
                      aria-label='Voir les structures extérieures'
                      inset={0}
                      display={currentPromoSlide === 1 ? "flex" : "none"}
                      alignItems="center"
                      justifyContent="space-between"
                      p={0}
                      transition="all 0.4s ease-in-out"
                    >
                      <Image
                        src={VerandaImage}
                        alt="La véranda, votre nouvelle pièce à vivre."
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
                          La véranda, votre nouvelle pièce à vivre.
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
                    {[0, 1].map((index) => (
                      <Box
                        key={index}
                        w="8px"
                        h="8px"
                        bg={currentPromoSlide === index ? "white" : "gray.300"}
                        title="Changer de diapositive"
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
                  icon={<ChevronLeftIcon />}
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
                  icon={<ChevronRightIcon />}
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
                <Link to="/category/jardin-quipement-extrieur"
                  aria-label='Voir les produits de jardin et équipement extérieur'
                  title='Voir les produits de jardin et équipement extérieur'
                >
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

                <Link to="/flash-deals"
                  title="Voir les offres flash"
                  aria-label="Voir les offres flash"
                >
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
              title="Voir les offres sur les meubles"
              aria-label="Voir les offres sur les meubles"
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
                      alt="La maison de vos rêves - Maisons préfabriquées en bois (mobile)"
                      w="full"
                      h="full"
                      objectFit="cover"
                      rounded="xl"
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
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

                {currentMobilePromoSlide === 1 && (
                  <Box
                    as="a"
                    href="/category/structures-extrieures"
                    position="relative"
                    h="full"
                    w="full"
                    display="block"
                  >
                    <Image
                      src={VerandaImage}
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
                  {[0,1].map((index) => (
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
        <Box mb={8} mt={2} as="section" aria-labelledby="portes-heading">
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
            <Link to='/category/automoto'>
              <Box bg="blue.300" h="566px" rounded="xl">
                <Image
                  src={AutoImage}
                  h="full"
                  w="full"
                  objectFit="fill"
                  rounded="xl"
                />
              </Box>
            </Link>
          </Box>

          <Box bg="white" h="600px" width="448.01px">
            <Link to='/category/accessoires-pour-voitures'>
              <Box bg="blue.300" h="251.1px" rounded="xl">
                <Image
                  src={CarAccessories}
                  h="full"
                  w="full"
                  objectFit="fill"
                  rounded="xl"
                />
              </Box>
            </Link>

            <Box>
              <SimpleGrid columns={2} spacing={2} mt={6}>
                <Link to='/category/peintures-et-accessoires-de-peinture'>
                <Box
                  bg="blue.300"
                  h="291.18px"
                  rounded="lg"
                  bgImage={CarPaintsImage}
                  bgSize="100%"
                ></Box>
                </Link>
                <Link to='/category/huiles-et-autres-fluides'>
                <Box
                  bg="blue.300"
                  h="291.18px"
                  rounded="lg"
                  bgImage={CarOilsImage}
                  bgSize="100%"
                ></Box>
                </Link>
              </SimpleGrid>
            </Box>
          </Box>

          <Box bg="white" h="600px" width="auto" maxW="340px">
            <Link to='/category/outils-pour-voitures'>
              <Box h="563.97px" rounded="lg">
                <Image
                  src={CarToolsImage}
                  h="full"
                  w="full"
                  objectFit="fill"
                  rounded="xl"
                />
              </Box>
            </Link>
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
      <Suspense fallback={<Box h="200px" bg="gray.50" display="flex" alignItems="center" justifyContent="center"><Spinner /></Box>}>
        <Footer />
      </Suspense>
    </Box>
    </>
  );
}

// Optimized ProductImage with lazy loading and accessibility
const ProductImage = memo(function ProductImage({
  src,
  alt,
  height = { base: "150px", sm: "180px", md: "200px" },
  bg = "transparent",
  loading = "lazy",
  priority = false,
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <Box
      w="full"
      h={height}
      bg={loaded ? bg : "gray.100"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      pl={2}
      pr={2}
      pt={2}
      position="relative"
      {...props}
    >
      {!loaded && !error && (
        <Spinner size="sm" color="gray.400" position="absolute" />
      )}
      <Image
        src={error ? "/src/assets/no-image.svg" : src}
        alt={alt || "Image produit"}
        w="full"
        h="full"
        objectFit="contain"
        objectPosition="center"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setError(true);
          setLoaded(true);
        }}
        opacity={loaded ? 1 : 0}
        transition="opacity 0.3s ease"
        fallback={
          <Box
            w="full"
            h={height}
            bg="#f7fafc"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.500"
            fontSize="sm"
            textAlign="center"
          >
            Image non disponible
          </Box>
        }
      />
    </Box>
  );
});

export default memo(Home);
