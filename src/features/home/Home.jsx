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

  // Promotional carousel data
  const promoSlides = [
    {
      id: 1,
      title: "Hot summer savings on what's cool",
      subtitle: "Get it in as fast as an hour*",
      buttonText: "Shop now",
      bgGradient: "linear-gradient(135deg, #EBF8FF, #BEE3F8)",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop",
      textColor: "blue.900",
      subtitleColor: "blue.700",
      buttonBg: "blue.600",
      buttonHoverBg: "blue.700",
    },
    {
      id: 2,
      title: "Summer fashion deals up to 60% off",
      subtitle: "Limited time offer",
      buttonText: "Explore deals",
      bgGradient: "linear-gradient(135deg, #FEF3C7, #FCD34D)",
      image:
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop",
      textColor: "gray.800",
      subtitleColor: "gray.700",
      buttonBg: "gray.800",
      buttonHoverBg: "gray.700",
    },
    {
      id: 3,
      title: "Premium home & garden essentials",
      subtitle: "Transform your space",
      buttonText: "Shop collection",
      bgGradient: "linear-gradient(135deg, #F0FDF4, #86EFAC)",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
      textColor: "green.900",
      subtitleColor: "green.700",
      buttonBg: "green.600",
      buttonHoverBg: "green.700",
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
        limit: 24, // Fetch 24 products for horizontal scroll
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
        category_id: "edffdc4c-36bb-4b05-82c1-22fb322dc88f", // furniture
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
    };
  };

  return (
    <Box minH="100vh" bg="gray.50">
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
            p={6}
            position="relative"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack align="start" spacing={3}>
              <Heading
                size="lg"
                color="gray.800"
                fontWeight="bold"
                lineHeight="1.2"
                fontFamily={"Bricolage Grotesque"}
              >
                Everything for July 4th
              </Heading>
              <Text
                color="gray.700"
                fontSize="sm"
                textDecoration="underline"
                cursor="pointer"
                fontFamily={"Bricolage Grotesque"}
              >
                Shop now
              </Text>
            </VStack>

            {/* Decorative elements */}
            <Box position="absolute" top="20px" right="20px">
              <Box
                w="40px"
                h="40px"
                bg="red.500"
                borderRadius="full"
                opacity="0.8"
              />
            </Box>
            <Box position="absolute" bottom="60px" right="40px">
              <Box
                w="60px"
                h="60px"
                bg="blue.500"
                borderRadius="full"
                opacity="0.6"
              />
            </Box>
            <Box position="absolute" bottom="20px" left="20px">
              <Box
                w="30px"
                h="30px"
                bg="white"
                borderRadius="full"
                opacity="0.9"
              />
            </Box>
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
                p={6}
                transition="all 0.5s ease-in-out"
              >
                <VStack align="start" spacing={3} flex="1">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={promoSlides[currentPromoSlide].subtitleColor}
                    letterSpacing="wide"
                  >
                    {promoSlides[currentPromoSlide].subtitle}
                  </Text>
                  <Heading
                    size="xl"
                    color={promoSlides[currentPromoSlide].textColor}
                    fontWeight="black"
                    lineHeight="1.1"
                    fontFamily={"Bricolage Grotesque"}
                  >
                    {promoSlides[currentPromoSlide].title}
                  </Heading>
                  <Button
                    bg={promoSlides[currentPromoSlide].buttonBg}
                    color="white"
                    size="md"
                    borderRadius="full"
                    px={6}
                    _hover={{
                      bg: promoSlides[currentPromoSlide].buttonHoverBg,
                      transform: "translateY(-1px)",
                    }}
                    transition="all 0.2s"
                  >
                    {promoSlides[currentPromoSlide].buttonText}
                  </Button>
                </VStack>

                {/* Product showcase */}
                <Box
                  flex="1"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Image
                    src={promoSlides[currentPromoSlide].image}
                    alt="Promotional item"
                    borderRadius="xl"
                    w="160px"
                    h="160px"
                    objectFit="cover"
                    shadow="lg"
                    transition="all 0.5s ease-in-out"
                  />
                </Box>
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
            bg="#A7F3D0"
            borderRadius="12px"
            p={6}
            position="relative"
            overflow="hidden"
          >
            <VStack align="start" spacing={3} h="full" justify="space-between">
              <Box>
                <Text fontSize="sm" fontWeight="bold" color="green.800" mb={2}>
                  Only at AS Solutions
                </Text>
                <Heading
                  size="md"
                  color="green.900"
                  fontWeight="bold"
                  lineHeight="1.2"
                  fontFamily={"Bricolage Grotesque"}
                >
                  Baby Evie toys & more
                </Heading>
                <Text
                  fontSize="sm"
                  color="green.800"
                  textDecoration="underline"
                  cursor="pointer"
                  mt={2}
                  fontFamily={"Bricolage Grotesque"}
                >
                  Shop new arrivals
                </Text>
              </Box>
            </VStack>

            {/* Cute character illustration placeholder */}
            <Box position="absolute" bottom="10px" right="10px">
              <Box
                w="80px"
                h="80px"
                bg="pink.200"
                borderRadius="full"
                opacity="0.8"
              />
            </Box>
          </GridItem>

          {/* Bottom Left - Summer home trends */}
          <GridItem
            colSpan={{ base: 1, lg: 1 }}
            bg="#FDE68A"
            borderRadius="12px"
            p={4}
            position="relative"
            overflow="hidden"
          >
            <VStack align="start" spacing={2} h="full" justify="center">
              <Heading
                size="md"
                color="orange.900"
                fontWeight="bold"
                fontFamily={"Bricolage Grotesque"}
              >
                Summer home trends from €6
              </Heading>
              <Text
                fontSize="sm"
                color="orange.800"
                textDecoration="underline"
                cursor="pointer"
                fontFamily={"Bricolage Grotesque"}
              >
                Shop home
              </Text>
            </VStack>

            {/* Home icon */}
            <Box position="absolute" top="15px" right="15px">
              <Icon as={FaHome} color="orange.600" boxSize="24px" />
            </Box>
          </GridItem>

          {/* Bottom Right - Scoop exclusive */}
          <GridItem
            colSpan={{ base: 1, lg: 1 }}
            bg="white"
            borderRadius="12px"
            p={4}
            position="relative"
            overflow="hidden"
            border="2px"
            borderColor="gray.200"
          >
            <VStack align="start" spacing={2} h="full" justify="center">
              <Heading
                size="md"
                color="gray.800"
                fontWeight="bold"
                fontFamily={"Bricolage Grotesque"}
              >
                Scoop—only at AS Solutions
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                textDecoration="underline"
                cursor="pointer"
                fontFamily={"Bricolage Grotesque"}
              >
                Shop now
              </Text>
            </VStack>

            {/* Fashion model image */}
            <Box position="absolute" bottom="10px" right="10px">
              <Image
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&h=60&fit=crop"
                alt="Fashion"
                borderRadius="full"
                w="50px"
                h="50px"
                objectFit="cover"
              />
            </Box>
          </GridItem>
        </Grid>

        {/* Flash Deals Section - Updated to use real data */}
        <Box mb={8}>
          <Flex align="center" justify="space-between" mb={6}>
            <HStack spacing={3}>
              <Icon as={FaFire} color="red.500" fontSize="xl" />
              <Heading
                size="md"
                color="gray.800"
                fontWeight="bold"
                fontFamily={"Bricolage Grotesque"}
              >
                Flash Deals
              </Heading>
            </HStack>
            <Button
              variant="outline"
              size="sm"
              colorScheme="red"
              borderColor="red.300"
              color="red.600"
              _hover={{
                bg: "red.500",
                color: "white",
                borderColor: "red.500",
              }}
              fontFamily={"Bricolage Grotesque"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                navigate("/flash-deals");
              }}
            >
              View All Deals
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
                        bg="white"
                        borderRadius="12px"
                        overflow="hidden"
                        shadow="md"
                        transition="all 0.3s ease"
                        cursor="pointer"
                        border="0px"
                        position="relative"
                        minW={{ base: "150px", sm: "180px", md: "200px" }}
                        maxW={{ base: "150px", sm: "180px", md: "200px" }}
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
                                    Deal Image
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />

                          {/* Discount Badge - Top Left */}
                          {product.discountPercentage > 0 && (
                            <Badge
                              position="absolute"
                              top="2"
                              left="2"
                              bg="red.500"
                              color="white"
                              fontSize="xs"
                              fontWeight="bold"
                              px="2"
                              py="1"
                              borderRadius="md"
                              textTransform="uppercase"
                            >
                              -{Math.round(product.discountPercentage)}% OFF
                            </Badge>
                          )}

                          {/* Deal Type Badge - Top Right Corner */}
                          {(product.isMegaDeal ||
                            product.isHotDeal ||
                            product.isSpecialOffer) && (
                            <Badge
                              position="absolute"
                              top="2"
                              right="12"
                              bg={
                                product.isMegaDeal
                                  ? "purple.500"
                                  : product.isHotDeal
                                  ? "red.600"
                                  : "blue.500"
                              }
                              color="white"
                              fontSize="2xs"
                              fontWeight="bold"
                              px="1"
                              py="0.5"
                              borderRadius="sm"
                              textTransform="uppercase"
                            >
                              {product.isMegaDeal
                                ? "MEGA"
                                : product.isHotDeal
                                ? "HOT"
                                : "SPECIAL"}
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
                            <Text
                              fontSize="sm"
                              color="gray.800"
                              noOfLines={2}
                              lineHeight="short"
                              minH="40px"
                              title={product.title}
                              fontWeight="medium"
                              as="a"
                              href={`/product/${product.slug}`}
                            >
                              {product.title}
                            </Text>

                            <VStack align="start" spacing={1} w="full">
                              {/* Pricing Section */}
                              <HStack spacing={2} w="full" align="center">
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="red.600"
                                >
                                  €{product.price.toFixed(2)}
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <Text
                                      fontSize="sm"
                                      color="gray.500"
                                      textDecoration="line-through"
                                    >
                                      €{product.originalPrice.toFixed(2)}
                                    </Text>
                                  )}
                              </HStack>

                              {/* Savings Display */}
                              {product.savingsAmount > 0 && (
                                <HStack spacing={1}>
                                  <Icon
                                    as={FaTags}
                                    color="green.500"
                                    fontSize="xs"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="green.600"
                                    fontWeight="semibold"
                                  >
                                    Save €{product.savingsAmount.toFixed(2)}
                                  </Text>
                                </HStack>
                              )}

                              {/* Company name */}
                              {product.company && (
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  noOfLines={1}
                                >
                                  by{" "}
                                  {product.company.business_name ||
                                    product.company.market_name}
                                </Text>
                              )}

                              {/* Category */}
                              {product.category && (
                                <Text
                                  fontSize="xs"
                                  color="blue.500"
                                  noOfLines={1}
                                >
                                  {product.category.name}
                                </Text>
                              )}

                              {/* Deal Features */}
                              <HStack spacing={1} flexWrap="wrap">
                                {product.badges?.free_shipping && (
                                  <Badge
                                    size="sm"
                                    colorScheme="green"
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    Free Ship
                                  </Badge>
                                )}

                                {product.dealType === "flash_sale" && (
                                  <Badge
                                    size="sm"
                                    colorScheme="purple"
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    Flash Sale
                                  </Badge>
                                )}
                              </HStack>
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
                          No flash deals available
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Check back soon for amazing deals!
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
              size="md"
              color="gray.800"
              fontWeight="bold"
              fontFamily={"Bricolage Grotesque"}
            >
              New arrivals
            </Heading>
            {/* <Button
              variant="outline"
              size="sm"
              colorScheme="gray"
              borderColor="gray.300"
              color="gray.600"
              _hover={{
                bg: "rgb(239,48,84)",
                color: "white",
                borderColor: "rgb(239,48,84)",
              }}
              fontFamily={"Bricolage Grotesque"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                // Navigate to all new arrivals page
              }}
            >
              View All
            </Button> */}
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
                        bg="white"
                        borderRadius="12px"
                        overflow="hidden"
                        shadow="4xl"
                        _hover={{
                          shadow: "md",
                          transform: "translateY(-2px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        border="1px"
                        borderColor="gray.100"
                        minW={{ base: "150px", sm: "180px", md: "200px" }}
                        maxW={{ base: "150px", sm: "180px", md: "200px" }}
                        flexShrink={0}
                        onClick={handleProductClick(product?.slug)}
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

                          {/* Top Badge */}
                          {product.tag && (
                            <Badge
                              position="absolute"
                              top="2"
                              left="2"
                              bg={
                                product.badges?.is_new
                                  ? "green.500"
                                  : "rgb(239,48,84)"
                              }
                              color="white"
                              fontSize="xs"
                              fontWeight="bold"
                              px="2"
                              py="1"
                              borderRadius="md"
                            >
                              {product.tag}
                            </Badge>
                          )}

                          {/* Recently Added Indicator */}
                          {product.is_recently_added && (
                            <Badge
                              position="absolute"
                              top="2"
                              right="12"
                              bg="blue.500"
                              color="white"
                              fontSize="2xs"
                              fontWeight="bold"
                              px="1"
                              py="0.5"
                              borderRadius="sm"
                            >
                              RECENT
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
                            <Text
                              fontSize="sm"
                              color="gray.800"
                              noOfLines={2}
                              lineHeight="short"
                              minH="40px"
                              title={product.title}
                            >
                              {product.title}
                            </Text>

                            <VStack align="start" spacing={1} w="full">
                              <HStack spacing={2} w="full" align="center">
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="rgb(239,48,84)"
                                >
                                  €{product.price.toFixed(2)}
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <Text
                                      fontSize="sm"
                                      color="gray.500"
                                      textDecoration="line-through"
                                    >
                                      €{product.originalPrice.toFixed(2)}
                                    </Text>
                                  )}
                              </HStack>

                              {/* Company name */}
                              {product.company && (
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  noOfLines={1}
                                >
                                  by{" "}
                                  {product.company.business_name ||
                                    product.company.market_name}
                                </Text>
                              )}

                              {/* Category */}
                              {product.category && (
                                <Text
                                  fontSize="xs"
                                  color="blue.500"
                                  noOfLines={1}
                                >
                                  {product.category.name}
                                </Text>
                              )}

                              {/* Free shipping badge */}
                              {product.badges?.free_shipping && (
                                <Badge
                                  size="sm"
                                  colorScheme="green"
                                  variant="subtle"
                                  fontSize="2xs"
                                >
                                  Free Shipping
                                </Badge>
                              )}
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
                          No new arrivals yet
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Check back soon for the latest products!
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
                size="md"
                color="gray.800"
                fontWeight="bold"
                fontFamily={"Bricolage Grotesque"}
              >
                Save on Furniture
              </Heading>
            </HStack>
            {/* <Button
              variant="outline"
              size="sm"
              colorScheme="red"
              borderColor="red.300"
              color="red.600"
              _hover={{
                bg: "red.500",
                color: "white",
                borderColor: "red.500",
              }}
              fontFamily={"Bricolage Grotesque"}
              rightIcon={<Icon as={FaChevronRight} fontSize="xs" />}
              onClick={() => {
                // Navigate to furniture flash deals page
              }}
            >
              View All Furniture Deals
            </Button> */}
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
                        bg="white"
                        borderRadius="12px"
                        overflow="hidden"
                        shadow="md"
                        _hover={{
                          shadow: "xl",
                          transform: "translateY(-4px)",
                        }}
                        transition="all 0.3s ease"
                        cursor="pointer"
                        position="relative"
                        minW={{ base: "150px", sm: "180px", md: "200px" }}
                        maxW={{ base: "150px", sm: "180px", md: "200px" }}
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
                                bg="brown.100"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                              >
                                <VStack spacing={2}>
                                  <Icon
                                    as={FaHome}
                                    fontSize="2xl"
                                    color="brown.500"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="brown.600"
                                    textAlign="center"
                                  >
                                    Furniture Deal
                                  </Text>
                                </VStack>
                              </Box>
                            }
                          />

                          {/* Discount Badge - Top Left */}
                          {product.discountPercentage > 0 && (
                            <Badge
                              position="absolute"
                              top="2"
                              left="2"
                              bg="red.500"
                              color="white"
                              fontSize="xs"
                              fontWeight="bold"
                              px="2"
                              py="1"
                              borderRadius="md"
                              textTransform="uppercase"
                            >
                              -{Math.round(product.discountPercentage)}% OFF
                            </Badge>
                          )}

                          {/* Deal Type Badge - Top Right Corner */}
                          {(product.isMegaDeal ||
                            product.isHotDeal ||
                            product.isSpecialOffer) && (
                            <Badge
                              position="absolute"
                              top="2"
                              right="12"
                              bg={
                                product.isMegaDeal
                                  ? "purple.500"
                                  : product.isHotDeal
                                  ? "red.600"
                                  : "blue.500"
                              }
                              color="white"
                              fontSize="2xs"
                              fontWeight="bold"
                              px="1"
                              py="0.5"
                              borderRadius="sm"
                              textTransform="uppercase"
                            >
                              {product.isMegaDeal
                                ? "MEGA"
                                : product.isHotDeal
                                ? "HOT"
                                : "SPECIAL"}
                            </Badge>
                          )}

                          {/* Furniture Badge - Bottom Left */}
                          <Badge
                            position="absolute"
                            bottom="2"
                            left="2"
                            bg="brown.500"
                            color="white"
                            fontSize="2xs"
                            fontWeight="bold"
                            px="2"
                            py="1"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Icon as={FaHome} fontSize="2xs" />
                            FURNITURE
                          </Badge>

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
                            <Text
                              fontSize="sm"
                              color="gray.800"
                              noOfLines={2}
                              lineHeight="short"
                              minH="40px"
                              title={product.title}
                              fontWeight="medium"
                            >
                              {product.title}
                            </Text>

                            <VStack align="start" spacing={1} w="full">
                              {/* Pricing Section */}
                              <HStack spacing={2} w="full" align="center">
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="red.600"
                                >
                                  €{product.price.toFixed(2)}
                                </Text>

                                {product.originalPrice &&
                                  product.originalPrice > product.price && (
                                    <Text
                                      fontSize="sm"
                                      color="gray.500"
                                      textDecoration="line-through"
                                    >
                                      €{product.originalPrice.toFixed(2)}
                                    </Text>
                                  )}
                              </HStack>

                              {/* Savings Display */}
                              {product.savingsAmount > 0 && (
                                <HStack spacing={1}>
                                  <Icon
                                    as={FaTags}
                                    color="green.500"
                                    fontSize="xs"
                                  />
                                  <Text
                                    fontSize="xs"
                                    color="green.600"
                                    fontWeight="semibold"
                                  >
                                    Save €{product.savingsAmount.toFixed(2)}
                                  </Text>
                                </HStack>
                              )}

                              {/* Company name */}
                              {product.company && (
                                <Text
                                  fontSize="xs"
                                  color="gray.500"
                                  noOfLines={1}
                                >
                                  by{" "}
                                  {product.company.business_name ||
                                    product.company.market_name}
                                </Text>
                              )}

                              {/* Category - Should show furniture category */}
                              {product.category && (
                                <Text
                                  fontSize="xs"
                                  color="brown.500"
                                  noOfLines={1}
                                  fontWeight="semibold"
                                >
                                  {product.category.name}
                                </Text>
                              )}

                              {/* Deal Features */}
                              <HStack spacing={1} flexWrap="wrap">
                                {product.badges?.free_shipping && (
                                  <Badge
                                    size="sm"
                                    colorScheme="green"
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    Free Ship
                                  </Badge>
                                )}

                                {product.dealType === "flash_sale" && (
                                  <Badge
                                    size="sm"
                                    colorScheme="purple"
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    Flash Sale
                                  </Badge>
                                )}

                                {/* Furniture specific badge */}
                                <Badge
                                  size="sm"
                                  colorScheme="brown"
                                  variant="subtle"
                                  fontSize="2xs"
                                >
                                  Furniture
                                </Badge>
                              </HStack>
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
                          No furniture deals available
                        </Text>
                        <Text fontSize="sm" color="gray.400">
                          Check back soon for amazing furniture deals!
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

        {/* Best Selling in Furniture */}

        {/* Trending products */}

        {/* Best Selling in Furniture */}

        {/* Promotions Cards */}
        <Box mb={8}>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
            mb={8}
          >
            {/* HBCU Pride Box */}
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
                {/* Overlay for better text readability */}
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

            {/* Accessibility Box */}
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
                {/* Overlay */}
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

            {/* Summer Music Box */}
            <GridItem colSpan={{ base: 1, lg: 1 }}>
              <VStack spacing={4} h="300px">
                {/* Adaptive School Essentials */}
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
                  {/* Overlay */}
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

                {/* Summer's Hottest Hits */}
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
                  {/* Overlay */}
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

            {/* Black & Unlimited Summer Box */}
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
                {/* Overlay */}
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
        </Box>

        {/* Explore All */}
        <Box mb={8}>
          <VStack align="start" spacing={2} mb={6}>
            <Heading
              size="md"
              color="gray.800"
              fontWeight="bold"
              fontFamily={"Bricolage Grotesque"}
            >
              Explore All Products
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Discover our entire collection
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
