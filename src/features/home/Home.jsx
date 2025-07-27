import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";
import Logo from "../../assets/logo-as.png";
import AsSolutionsPhoto from '../../assets/welcome-as.png';
import FlashSalePromo from '../../assets/flash-sale-4.png';
import BabySalePromo from '../../assets/baby-3.png';
import FournitureSalePromo from '../../assets/fourniture-2.png';
import FourniturePromoSlide from '../../assets/fourniture-g.png';
import GaragePromoSlide from '../../assets/garage.png';
import JasquaMobile from '../../assets/jasqua-mobile.png';
import GarageSliderMobile from '../../assets/garage-slider-mobile.png';
import { homeService } from "./services/homeService";
import Footer from "../../shared-customer/components/Footer";
import MobileCategoryNavigation from "../../shared-customer/components/MobileCategoryNavigation";
import { useSwipeable } from "react-swipeable";
import ExploreAll from "../../shared-customer/components/ExploreAll";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared-customer/components/Navbar";

function Home() {
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(false);
  const [flashDeals, setFlashDeals] = useState([]);
  const [flashDealsLoading, setFlashDealsLoading] = useState(false);
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
      link: '/category/automoto'
    },
   
  ];

  const handleProductClick = (slug) => {
    return () => navigate(`/product/${slug}`);
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
        min_discount: 15, // Minimum 15% discount for flash deals
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
      setFlashDealsLoading(true);
      const response = await homeService.getFurnitureFlashDeals({
        limit: 24,
        min_discount: 15,
        category_id: "edffdc4c-36bb-4b05-82c1-22fb322dc88f", // furniture id
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
      isLimitedStock: apiProduct.flash_deal?.availability?.is_available || false,
    };
  };

  // FETCH BY CATEGORY TOP PRODUCTS

  const fetchTopDoorsProducts = async () => {
    try {
      setTopDoorsLoading(true);
      const response = await homeService.getTopProductsByCategorySlug("portes", {
        limit: 20,
      });

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
      const response = await homeService.getTopProductsByCategorySlug("fentres", {
        limit: 20,
      });

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
      const response = await homeService.getTopProductsByCategorySlug("automoto", {
        limit: 20,
      });

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
      const response = await homeService.getTopProductsByCategorySlug("enfants-bb", {
        limit: 20,
      });

      const products = response.data || [];

      setTopBabyProducts(products);
    } catch (error) {
      setTopBabyProducts([]);
    } finally {
      setTopBabyLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#fff">
      {/* Header matching Wish design but with AS Solutions branding */}
      <Navbar />

      {/* Main Content with Container */}
      <Container maxW="8xl" py={6}>
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
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="gray.800"
                fontSize="2xl"
                fontFamily={"Bogle"}
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
              fontFamily={"Bogle"}
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                        bg="transparent"
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.3s ease"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        position="relative"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
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
                      >
                        <Box
                          position="relative"
                          zIndex={1}
                          as="a"
                          href={`/product/${product.slug}`}
                        >
                          <Image
                            src={product.image}
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            rounded="0px"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaFire}
                                    fontSize="2xl"
                                    color="red.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    {product?.title}
                                  </Text>
                                </VStack>
                              </Box>
                            }
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

                          {/* Discount Badge - Top Left */}
                          {/* {product.discountPercentage > 0 && (
                            <Badge
                              position="absolute"
                              top="2"
                              left="2"
                              bg="red"
                              color="white"
                              fontSize="xs"
                              fontWeight="bold"
                              px="2"
                              py="1"
                              borderRadius="2px"
                              textTransform="uppercase"
                            >
                              -{Math.round(product.discountPercentage)}% OFF
                            </Badge>
                          )} */}

                          {/* Heart Icon */}
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>

                        <CardBody p={3} position="relative" zIndex={1}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              {/* Pricing Section */}
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  $ {product.price.toFixed(2)}
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.originalPrice.toFixed(2)}
                                      </Text>

                                      {/* Responsive discount badge */}
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>

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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>

                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  // No flash deals found - Empty state
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="red.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="red.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaFire} boxSize="8" color="red.400" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucune offre flash disponible
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour des offres incroyables !
                        </Text>
                      </VStack>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={() => fetchFlashDeals()}
                        leftIcon={<Icon as={FaFire} />}
                      >
                        Refresh Deals
                      </Button> */}
                    </VStack>
                  </Box>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* New Arrivals Section */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <Heading
              color="gray.800"
              fontSize="2xl"
              fontWeight="bold"
              fontFamily={"Bogle"}
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                        bg="transparent"
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product?.slug)}
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
                      >
                        <Box position="relative">
                          <Image
                            src={product.image}
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaBox}
                                    fontSize="2xl"
                                    color="gray.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    No Image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />

                          {/* Recently Added Indicator */}
                          {product.is_recently_added && (
                            <Badge
                              position="absolute"
                              top="2"
                              left="2"
                              bg="navy"
                              color="white"
                              fontSize="2xs"
                              fontWeight="bold"
                              px="2"
                              py="0.5"
                              borderRadius="md"
                            >
                              Nouveau
                            </Badge>
                          )}

                          {/* Heart Icon */}
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "rgb(239,48,84)" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>

                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  $ {product.price.toFixed(2)}
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.originalPrice.toFixed(2)}
                                      </Text>

                                      {/* Responsive discount badge */}
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>

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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>

                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  // No products found - Empty state
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="gray.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="gray.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBox} boxSize="8" color="gray.300" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucun nouvel arrivage pour le moment
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour les derniers produits !
                        </Text>
                      </VStack>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        colorScheme="gray"
                        onClick={() => fetchNewArrivals()}
                        leftIcon={<Icon as={FaChevronRight} />}
                      >
                        Refresh
                      </Button> */}
                    </VStack>
                  </Box>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Furniture Flash Deals Section Save */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              {/* <Icon as={FaFire} color="red.500" fontSize="xl" /> */}
              <Heading
                color="gray.800"
                fontWeight="bold"
                fontFamily={"Bogle"}
                fontSize="2xl"
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                {flashDealsLoading ? (
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
                ) : flashDeals && flashDeals.length > 0 ? (
                  // Real furniture flash deals data
                  flashDeals.map((apiProduct, index) => {
                    const product = transformFlashDealData(apiProduct);
                    const productId = `furniture-flash-${index}-${product.id}`;

                    return (
                      <Card
                        key={productId}
                        bg="transparent"
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product?.slug)}
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
                      >
                        <Box position="relative" zIndex={1}>
                          <Image
                            src={product.image}
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaHome}
                                    fontSize="2xl"
                                    color="gray.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    Aucune image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />

                          {/* Heart Icon */}
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>

                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  $ {product.price.toFixed(2)}
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.originalPrice.toFixed(2)}
                                      </Text>

                                      {/* Responsive discount badge */}
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>

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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>

                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  // No furniture flash deals found - Empty state
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="brown.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="brown.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaHome} boxSize="8" color="brown.400" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucune offre de meubles disponible
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour des offres de meubles incroyables !
                        </Text>
                      </VStack>
                      {/* <Button
                        size="sm"
                        variant="outline"
                        colorScheme="brown"
                        onClick={() => fetchFurnitureFlashDeals()}
                        leftIcon={<Icon as={FaHome} />}
                      >
                        Refresh Furniture Deals
                      </Button> */}
                    </VStack>
                  </Box>
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
                color="gray.800"
                fontSize="2xl"
                fontFamily={"Bogle"}
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
              fontFamily={"Bogle"}
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product.slug)}
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
                      >
                        <Box position="relative">
                          <Image
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaBox}
                                    fontSize="2xl"
                                    color="gray.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    Aucune image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  ${" "}
                                  {product.final_price_gross ??
                                    product.regular_price_gross ??
                                    0}
                                </Text>
                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.regular_price_gross}
                                      </Text>
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>
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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>
                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="gray.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="gray.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBox} boxSize="8" color="gray.300" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucune offre de meubles disponible
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour des offres de meubles incroyables !
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
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
                color="gray.800"
                fontSize="2xl"
                fontFamily={"Bogle"}
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
              fontFamily={"Bogle"}
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product.slug)}
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
                      >
                        <Box position="relative">
                          <Image
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaBox}
                                    fontSize="2xl"
                                    color="gray.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    Aucune image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  ${" "}
                                  {product.final_price_gross ??
                                    product.regular_price_gross ??
                                    0}
                                </Text>
                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.regular_price_gross}
                                      </Text>
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>
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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>
                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="gray.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="gray.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBox} boxSize="8" color="gray.300" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucune offre de meubles disponible
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour des offres de meubles incroyables !
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
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
                color="gray.800"
                fontSize="2xl"
                fontFamily={"Bogle"}
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
              fontFamily={"Bogle"}
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product.slug)}
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
                      >
                        <Box position="relative">
                          <Image
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaBox}
                                    fontSize="2xl"
                                    color="gray.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    Aucune image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  ${" "}
                                  {product.final_price_gross ??
                                    product.regular_price_gross ??
                                    0}
                                </Text>
                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.regular_price_gross}
                                      </Text>
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>
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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>
                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="gray.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="gray.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBox} boxSize="8" color="gray.300" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucune offre de moto haut de gamme trouvée
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour des offres de moto incroyables !
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
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
                color="gray.800"
                fontSize="2xl"
                fontFamily={"Bogle"}
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
              fontFamily={"Bogle"}
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
              background:
                "linear-gradient(to left, rgba(249,250,251,0.9), transparent)",
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
                        borderRadius="0px"
                        overflow="hidden"
                        shadow="none"
                        transition="all 0.2s"
                        cursor="pointer"
                        borderWidth="0px"
                        borderColor="gray.400"
                        minW={{ base: "200px", sm: "200px", md: "225px" }}
                        maxW={{ base: "200px", sm: "200px", md: "225px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product.slug)}
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
                      >
                        <Box position="relative">
                          <Image
                            src={
                              product.main_image_url ||
                              (product.images?.[0]?.url ?? "")
                            }
                            alt={product.title}
                            w="full"
                            h={{ base: "150px", sm: "180px", md: "200px" }}
                            objectFit="cover"
                            fallback={
                              <Box
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                bg="gray.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaBox}
                                    fontSize="2xl"
                                    color="gray.400"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="gray.500"
                                    textAlign="center"
                                  >
                                    No Image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />
                          <IconButton
                            position="absolute"
                            top="2"
                            right="2"
                            size="sm"
                            icon={<FaHeart />}
                            bg="white"
                            color="gray.400"
                            _hover={{ color: "red.500", bg: "red.50" }}
                            borderRadius="full"
                            aria-label="Add to wishlist"
                            shadow="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </Box>
                        <CardBody p={3}>
                          <VStack align="start" spacing={2}>
                            <VStack align="start" spacing={1} w="full">
                              <HStack
                                spacing={2}
                                w="full"
                                align="center"
                                flexWrap="wrap"
                              >
                                <Text
                                  fontSize={{ base: "lg", sm: "xl" }}
                                  fontWeight="bold"
                                  color="navy"
                                  fontFamily="Bogle"
                                >
                                  ${" "}
                                  {product.final_price_gross ??
                                    product.regular_price_gross ??
                                    0}
                                </Text>
                                {product.regular_price_gross &&
                                  product.regular_price_gross >
                                    product.final_price_gross && (
                                    <>
                                      <Text
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        color="gray.500"
                                        textDecoration="line-through"
                                        fontFamily="Bogle"
                                      >
                                        $ {product.regular_price_gross}
                                      </Text>
                                      <Badge
                                        bg="red.600"
                                        fontFamily="Bogle"
                                        color="white"
                                        fontSize={{ base: "xs", sm: "sm" }}
                                        fontWeight="bold"
                                        px={{ base: "1", sm: "2" }}
                                        py="0"
                                        borderRadius="md"
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
                                        % OFF
                                      </Badge>
                                    </>
                                  )}
                              </HStack>
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
                                fontFamily="Fira Sans"
                              >
                                {product.title}
                              </Text>
                              <Button
                                fontFamily="Bogle"
                                size="sm"
                                bg="transparent"
                                color="gray.900"
                                _hover={{
                                  bg: "transparent",
                                  borderWidth: "2px",
                                }}
                                _active={{ bg: "transparent" }}
                                _focus={{ bg: "transparent" }}
                                px={10}
                                variant="outline"
                                borderColor="navy"
                                rounded="full"
                                borderWidth="1px"
                              >
                                Ajouter
                              </Button>
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <Box
                    minW="full"
                    p={8}
                    textAlign="center"
                    color="gray.500"
                    bg="transparent"
                    borderRadius="12px"
                    border="0px"
                    borderColor="gray.200"
                  >
                    <VStack spacing={4}>
                      <Box
                        w="16"
                        h="16"
                        bg="gray.100"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaBox} boxSize="8" color="gray.300" />
                      </Box>
                      <VStack spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="medium"
                          color="gray.600"
                        >
                          Aucune offre de moto haut de gamme trouvée
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Revenez bientôt pour des offres de moto incroyables !
                        </Text>
                      </VStack>
                    </VStack>
                  </Box>
                )}
              </HStack>
            </Box>
          </Box>
        </Box>

        {/* Promotions Cards */}
        {/* <Box mb={8}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
            mb={8}
          >
            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <Box
                position="relative"
                h="300px"
                borderRadius="12px"
                overflow="hidden"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                backgroundImage="url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop')"
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.6))"
                  borderRadius="12px"
                />

                <Box
                  position="relative"
                  h="full"
                  p={6}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  zIndex={1}
                >
                  <VStack align="start" spacing={3}>
                    <Heading
                      size="lg"
                      color="white"
                      fontWeight="bold"
                      lineHeight="1.2"
                      fontFamily="Bricolage Grotesque"
                    >
                      Show off your HBCU pride
                    </Heading>
                  </VStack>

                  <Button
                    bg="white"
                    color="blue.600"
                    size="md"
                    borderRadius="full"
                    px={6}
                    fontWeight="bold"
                    _hover={{
                      bg: "gray.100",
                      transform: "translateY(-1px)",
                    }}
                    alignSelf="flex-start"
                    fontFamily="Bricolage Grotesque"
                  >
                    Shop now
                  </Button>
                </Box>
              </Box>
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <Box
                position="relative"
                h="300px"
                borderRadius="12px"
                overflow="hidden"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                backgroundImage="url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop')"
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="linear-gradient(135deg, rgba(34, 197, 94, 0.7), rgba(22, 163, 74, 0.6))"
                  borderRadius="12px"
                />

                <Box
                  position="relative"
                  h="full"
                  p={6}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  zIndex={1}
                >
                  <VStack align="start" spacing={3}>
                    <Heading
                      size="md"
                      color="white"
                      fontWeight="bold"
                      lineHeight="1.2"
                      fontFamily="Bricolage Grotesque"
                    >
                      Accessibility for all
                    </Heading>
                    <Text
                      color="white"
                      fontSize="lg"
                      fontWeight="semibold"
                      fontFamily="Bricolage Grotesque"
                    >
                      Adaptive at AS Solutions
                    </Text>
                  </VStack>

                  <Text
                    color="white"
                    fontSize="sm"
                    textDecoration="underline"
                    cursor="pointer"
                    fontFamily="Bricolage Grotesque"
                    _hover={{ opacity: 0.8 }}
                  >
                    Shop now
                  </Text>
                </Box>
              </Box>
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <VStack spacing={4} h="300px">
                <Box
                  position="relative"
                  h="140px"
                  w="full"
                  borderRadius="12px"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                  backgroundImage="url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=140&fit=crop')"
                  backgroundSize="cover"
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                >
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="linear-gradient(135deg, rgba(168, 85, 247, 0.7), rgba(147, 51, 234, 0.6))"
                    borderRadius="12px"
                  />

                  <Box
                    position="relative"
                    h="full"
                    p={4}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    zIndex={1}
                  >
                    <Heading
                      size="sm"
                      color="white"
                      fontWeight="bold"
                      lineHeight="1.2"
                      fontFamily="Bricolage Grotesque"
                    >
                      Adaptive school essentials
                    </Heading>

                    <Text
                      color="white"
                      fontSize="xs"
                      textDecoration="underline"
                      cursor="pointer"
                      fontFamily="Bricolage Grotesque"
                      _hover={{ opacity: 0.8 }}
                    >
                      Shop now
                    </Text>
                  </Box>
                </Box>

                <Box
                  position="relative"
                  h="140px"
                  w="full"
                  borderRadius="12px"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.3s ease"
                  _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                  backgroundImage="url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=140&fit=crop')"
                  backgroundSize="cover"
                  backgroundPosition="center"
                  backgroundRepeat="no-repeat"
                >
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="linear-gradient(135deg, rgba(251, 191, 36, 0.8), rgba(245, 158, 11, 0.7))"
                    borderRadius="12px"
                  />

                  <Box
                    position="relative"
                    h="full"
                    p={4}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    zIndex={1}
                  >
                    <VStack align="start" spacing={1}>
                      <Heading
                        size="sm"
                        color="gray.800"
                        fontWeight="bold"
                        lineHeight="1.2"
                        fontFamily="Bricolage Grotesque"
                      >
                        Summer's hottest hits
                      </Heading>
                      <Text
                        color="gray.700"
                        fontSize="xs"
                        fontFamily="Bricolage Grotesque"
                      >
                        Black & Unlimited music legends.
                      </Text>
                    </VStack>

                    <Text
                      color="gray.800"
                      fontSize="xs"
                      textDecoration="underline"
                      cursor="pointer"
                      fontFamily="Bricolage Grotesque"
                      _hover={{ opacity: 0.8 }}
                    >
                      Shop now
                    </Text>
                  </Box>
                </Box>
              </VStack>
            </GridItem>

            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <Box
                position="relative"
                h="300px"
                borderRadius="12px"
                overflow="hidden"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                backgroundImage="url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop')"
                backgroundSize="cover"
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  right="0"
                  bottom="0"
                  bg="linear-gradient(135deg, rgba(29, 78, 216, 0.8), rgba(30, 58, 138, 0.7))"
                  borderRadius="12px"
                />

                <Box
                  position="relative"
                  h="full"
                  p={6}
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  zIndex={1}
                >
                  <VStack align="start" spacing={3}>
                    <Heading
                      size="lg"
                      color="white"
                      fontWeight="bold"
                      lineHeight="1.2"
                      fontFamily="Bricolage Grotesque"
                    >
                      Black & Unlimited summer favorites
                    </Heading>
                  </VStack>

                  <VStack align="start" spacing={2}>
                    <HStack spacing={2} align="baseline">
                      <Text
                        color="white"
                        fontSize="sm"
                        fontFamily="Bricolage Grotesque"
                      >
                        From
                      </Text>
                      <Text
                        color="white"
                        fontSize="3xl"
                        fontWeight="bold"
                        fontFamily="Bricolage Grotesque"
                        lineHeight="1"
                      >
                        €8
                        <Text as="span" fontSize="lg" verticalAlign="super">
                          97
                        </Text>
                      </Text>
                    </HStack>

                    <Text
                      color="white"
                      fontSize="sm"
                      textDecoration="underline"
                      cursor="pointer"
                      fontFamily="Bricolage Grotesque"
                      _hover={{ opacity: 0.8 }}
                    >
                      Shop now
                    </Text>
                  </VStack>
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Box> */}

        {/* Explore All */}
        <Box mb={8}>
          <VStack align="start" spacing={2} mb={6}>
            <Heading
              size="md"
              color="gray.800"
              fontWeight="bold"
              fontFamily={"Bogle"}
            >
              Explorer tous les produits
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Découvrez notre collection complète de produits
            </Text>
          </VStack>

          <ExploreAll
            initialFilters={{
              limit: 30,
              sort_by: "created_at",
              sort_order: "DESC",
            }}
          />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

export default Home;
