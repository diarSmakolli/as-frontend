import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { SEO } from '../../hooks/useSEO';
import {
  Box,
  Container,
  Grid,
  VStack,
  HStack,
  Text,
  Select,
  Button,
  Input,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Flex,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useDisclosure as useCollapseDisclosure,
  Collapse,
  Badge,
  Stack,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FaFilter,
  FaEuroSign,
  FaBoxOpen,
  FaCog,
  FaChevronDown,
  FaChevronUp,
  FaFire,
  FaBolt,
  FaPercent,
  FaTags,
  FaGift,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { homeService } from "../home/services/homeService";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";
import ProductCard from "./ProductCard";
import { customToastContainerStyle } from "../../commons/toastStyles";

const FlashDealFilterSidebar = React.memo(
  ({
    isMobile = false,
    minPrice,
    maxPrice,
    tempMinPrice,
    tempMaxPrice,
    minDiscount,
    maxDiscount,
    tempMinDiscount,
    tempMaxDiscount,
    includeOutOfStock,
    availableFilters,
    selectedFilters,
    getSelectedFiltersCount,
    clearFilters,
    handleMinPriceChange,
    handleMaxPriceChange,
    handleMinDiscountChange,
    handleMaxDiscountChange,
    applyPriceRange,
    clearPriceRange,
    applyDiscountRange,
    clearDiscountRange,
    applyFilters,
    setIncludeOutOfStock,
    handleDiscountRangeChange,
    handleDealTypeChange,
    clearDiscountRangeFilter,
    clearDealTypeFilter,
  }) => {
    const { isOpen: isDiscountOpen, onToggle: onDiscountToggle } =
      useCollapseDisclosure({ defaultIsOpen: true });
    const { isOpen: isDealTypesOpen, onToggle: onDealTypesToggle } =
      useCollapseDisclosure({ defaultIsOpen: true });

    return (
      <VStack
        align="stretch"
        spacing={6}
        p={isMobile ? 0 : 4}
        bg={isMobile ? "white" : "gray.50"}
        borderRadius={isMobile ? 0 : "lg"}
        border="1px solid rgba(145, 158, 171, 0.2)"
      >
        <HStack justify="space-between">
          <Text
            fontSize="md"
            fontWeight="500"
            fontFamily={"Airbnb Cereal VF"}
          >
            Filtres d'offres flash{" "}
            {getSelectedFiltersCount() > 0 && `(${getSelectedFiltersCount()})`}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            fontFamily={"Airbnb Cereal VF"}
            fontSize={'sm'}
          >
            Tout effacer
          </Button>
        </HStack>

        {/* Active Filters Summary */}
        {getSelectedFiltersCount() > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="500" mb={2} fontFamily={"Airbnb Cereal VF"}>
              Filtres actifs :
            </Text>
            <Wrap spacing={1}>
              {(minPrice > 0 || maxPrice > 0) && (
                <WrapItem>
                  <Tag size="sm" colorScheme="blue" variant="solid">
                    <TagLabel>
                      €{minPrice > 0 ? minPrice : 0} - €
                      {maxPrice > 0 ? maxPrice : "∞"}
                    </TagLabel>
                    <TagCloseButton onClick={clearPriceRange} />
                  </Tag>
                </WrapItem>
              )}
              {(minDiscount > 0 || maxDiscount > 0) && (
                <WrapItem>
                  <Tag size="sm" colorScheme="red" variant="solid">
                    <TagLabel>
                      {minDiscount > 0 ? minDiscount : 0}% -
                      {maxDiscount > 0 ? maxDiscount : "∞"}%
                    </TagLabel>
                    <TagCloseButton onClick={clearDiscountRange} />
                  </Tag>
                </WrapItem>
              )}
              {includeOutOfStock && (
                <WrapItem>
                  <Tag size="sm" colorScheme="orange" variant="solid">
                    <TagLabel>Include Out of Stock</TagLabel>
                    <TagCloseButton
                      onClick={() => setIncludeOutOfStock(false)}
                    />
                  </Tag>
                </WrapItem>
              )}
              {/* Discount Range Filters */}
              {selectedFilters.discount_ranges?.map((range) => (
                <WrapItem key={`discount-${range}`}>
                  <Tag size="sm" colorScheme="red" variant="solid">
                    <TagLabel>{range}</TagLabel>
                    <TagCloseButton
                      onClick={() => clearDiscountRangeFilter(range)}
                    />
                  </Tag>
                </WrapItem>
              ))}
              {/* Deal Type Filters */}
              {selectedFilters.deal_types?.map((type) => (
                <WrapItem key={`dealtype-${type}`}>
                  <Tag size="sm" colorScheme="purple" variant="solid">
                    <TagLabel>{type}</TagLabel>
                    <TagCloseButton onClick={() => clearDealTypeFilter(type)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        <Divider />

        {/* Price Range Filter */}
        <Box>
          <HStack mb={3}>
            <Text fontWeight="500" fontFamily={"Airbnb Cereal VF"}>
              Gamme de prix
            </Text>
          </HStack>

          <VStack spacing={3}>
            <HStack spacing={2} w="full">
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Prix minimum
                </Text>
                <Input
                  value={tempMinPrice}
                  onChange={handleMinPriceChange}
                  placeholder="0"
                  size="sm"
                  autoComplete="off"
                />
              </VStack>
              <Text alignSelf="end" pb={2} color="gray.400">
                à
              </Text>
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Prix maximum
                </Text>
                <Input
                  value={tempMaxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder="∞"
                  size="sm"
                  autoComplete="off"
                />
              </VStack>
            </HStack>
            <HStack spacing={2} w="full">
              <Button
                size="sm"
                colorScheme="blue"
                onClick={applyPriceRange}
                flex={1}
              >
                Appliquer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearPriceRange}
                flex={1}
              >
                Clair
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Discount Range Filter */}
        <Box>
          <HStack mb={3}>
            <Text fontWeight="500" fontFamily={"Airbnb Cereal VF"}>
              Discount Range
            </Text>
          </HStack>

          <VStack spacing={3}>
            <HStack spacing={2} w="full">
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Remise minimale (%)
                </Text>
                <Input
                  value={tempMinDiscount}
                  onChange={handleMinDiscountChange}
                  placeholder="10"
                  size="sm"
                  autoComplete="off"
                />
              </VStack>
              <Text alignSelf="end" pb={2} color="gray.400">
                à
              </Text>
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Remise maximale (%)
                </Text>
                <Input
                  value={tempMaxDiscount}
                  onChange={handleMaxDiscountChange}
                  placeholder="∞"
                  size="sm"
                  autoComplete="off"
                />
              </VStack>
            </HStack>
            <HStack spacing={2} w="full">
              <Button
                size="sm"
                colorScheme="red"
                onClick={applyDiscountRange}
                flex={1}
              >
                Appliquer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearDiscountRange}
                flex={1}
              >
                Clair
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Availability Filter */}
        <Box>
          <HStack mb={3}>
            <FaBoxOpen color="gray.500" />
            <Text fontWeight="500" fontFamily={"Airbnb Cereal VF"}>
              Disponibilité
            </Text>
          </HStack>

          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600" fontFamily={"Airbnb Cereal VF"}>
              Inclure les produits en rupture de stock
            </Text>
            <Box
              as="button"
              onClick={() => setIncludeOutOfStock(!includeOutOfStock)}
              w="48px"
              h="24px"
              bg={includeOutOfStock ? "rgb(239, 48, 84)" : "gray.200"}
              borderRadius="full"
              position="relative"
              transition="all 0.2s"
              _hover={{
                bg: includeOutOfStock ? "rgb(220, 40, 75)" : "gray.300",
              }}
              _focus={{
                outline: "none",
                boxShadow: "0 0 0 3px rgba(239, 48, 84, 0.1)",
              }}
            >
              <Box
                w="20px"
                h="20px"
                bg="white"
                borderRadius="full"
                position="absolute"
                top="2px"
                left={includeOutOfStock ? "26px" : "2px"}
                transition="all 0.2s"
                boxShadow="sm"
              />
            </Box>
          </HStack>
        </Box>

        {isMobile && (
          <Button colorScheme="blue" onClick={applyFilters} size="lg" fontFamily={"Airbnb Cereal VF"}>
            Appliquer des filtres
          </Button>
        )}
      </VStack>
    );
  }
);

const CustomerDealsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State management
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [availableFilters, setAvailableFilters] = useState({});
  const [dealStats, setDealStats] = useState({});

  // Filter states
  const [sortBy, setSortBy] = useState("discount_percentage");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minDiscount, setMinDiscount] = useState(10);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [includeOutOfStock, setIncludeOutOfStock] = useState(false);

  // Selected filters
  const [selectedFilters, setSelectedFilters] = useState({
    discount_ranges: [],
    deal_types: [],
  });

  // Input states
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const [tempMinDiscount, setTempMinDiscount] = useState("10");
  const [tempMaxDiscount, setTempMaxDiscount] = useState("");

  const itemsPerPage = 24;

  // Fetch deals data
  const fetchDeals = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setDeals([]);
        setOffset(0);
      }

      setError(null);

      try {
        const params = {
          limit: itemsPerPage,
          offset: isLoadMore ? offset : 0,
          sort_by: sortBy,
          min_price: minPrice > 0 ? minPrice : undefined,
          max_price: maxPrice > 0 ? maxPrice : undefined,
          min_discount: minDiscount > 0 ? minDiscount : 10,
          max_discount: maxDiscount > 0 ? maxDiscount : undefined,
          include_out_of_stock: includeOutOfStock,
        };

        // Add advanced filters
        const hasAdvancedFilters =
          selectedFilters.discount_ranges.length > 0 ||
          selectedFilters.deal_types.length > 0;

        if (hasAdvancedFilters) {
          params.filters = {
            discount_ranges:
              selectedFilters.discount_ranges.length > 0
                ? selectedFilters.discount_ranges
                : undefined,
            deal_types:
              selectedFilters.deal_types.length > 0
                ? selectedFilters.deal_types
                : undefined,
          };

          // Remove undefined values
          Object.keys(params.filters).forEach(
            (key) =>
              params.filters[key] === undefined && delete params.filters[key]
          );
        }

        const response = await homeService.getAdvancedFlashDeals(params);

        if (response.status === "success") {
          if (isLoadMore) {
            setDeals((prev) => [...prev, ...response.data.products]);
            setOffset((prev) => prev + itemsPerPage);
          } else {
            setDeals(response.data.products || []);
            setOffset(itemsPerPage);
          }

          setTotalCount(response.data.pagination?.total_count || 0);
          setHasMore(response.data.pagination?.has_more || false);
          setAvailableFilters(response.data.available_filters || {});
          setDealStats(response.data.deal_statistics || {});
        } else {
          navigate("/");
        }
      } catch (err) {
        setDeals([]);
        navigate("/");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      sortBy,
      minPrice,
      maxPrice,
      minDiscount,
      maxDiscount,
      includeOutOfStock,
      selectedFilters,
      offset,
      toast,
    ]
  );

  // Initial load
  useEffect(() => {
    fetchDeals();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDeals();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    sortBy,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    includeOutOfStock,
    selectedFilters,
  ]);

  // Handle input changes
  const handleMinPriceChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTempMinPrice(value);
    }
  }, []);

  const handleMaxPriceChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTempMaxPrice(value);
    }
  }, []);

  const handleMinDiscountChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTempMinDiscount(value);
    }
  }, []);

  const handleMaxDiscountChange = useCallback((e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setTempMaxDiscount(value);
    }
  }, []);

  // Apply price range
  const applyPriceRange = useCallback(() => {
    const min =
      tempMinPrice && tempMinPrice.trim() !== "" ? parseFloat(tempMinPrice) : 0;
    const max =
      tempMaxPrice && tempMaxPrice.trim() !== "" ? parseFloat(tempMaxPrice) : 0;

    if (tempMinPrice && isNaN(min)) {
      toast({
        title: "Prix invalide",
        description: "Veuillez saisir un prix minimum valide.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (tempMaxPrice && isNaN(max)) {
      toast({
        title: "Prix invalide",
        description: "Veuillez saisir un prix maximum valide.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (min < 0) {
      toast({
        title: "Prix invalide",
        description: "Le prix minimum ne peut pas être négatif.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (max > 0 && min > max) {
      toast({
        title: "Prix invalide",
        description: "Le prix minimum ne peut pas être supérieur au prix maximum.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    setMinPrice(min);
    setMaxPrice(max);
  }, [tempMinPrice, tempMaxPrice, toast]);

  // Apply discount range
  const applyDiscountRange = useCallback(() => {
    const min =
      tempMinDiscount && tempMinDiscount.trim() !== ""
        ? parseFloat(tempMinDiscount)
        : 10;
    const max =
      tempMaxDiscount && tempMaxDiscount.trim() !== ""
        ? parseFloat(tempMaxDiscount)
        : 0;

    if (tempMinDiscount && isNaN(min)) {
      toast({
        title: "Remise invalide",
        description: "Veuillez saisir une remise minimale valide.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (tempMaxDiscount && isNaN(max)) {
      toast({
        title: "Remise invalide",
        description: "Veuillez saisir une remise maximale valide.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (min < 0) {
      toast({
        title: "Remise invalide",
        description: "La remise minimale ne peut pas être négative.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (max > 0 && min > max) {
      toast({
        title: "Plage de remise non valide",
        description:
          "La remise minimale ne peut pas être supérieure à la remise maximale.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    setMinDiscount(min);
    setMaxDiscount(max);
  }, [tempMinDiscount, tempMaxDiscount, toast]);

  // Clear functions
  const clearPriceRange = useCallback(() => {
    setMinPrice(0);
    setMaxPrice(0);
    setTempMinPrice("");
    setTempMaxPrice("");
  }, []);

  const clearDiscountRange = useCallback(() => {
    setMinDiscount(10);
    setMaxDiscount(0);
    setTempMinDiscount("10");
    setTempMaxDiscount("");
  }, []);

  // Handle filter changes
  const handleDiscountRangeChange = useCallback((value, checked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      discount_ranges: checked
        ? [...prev.discount_ranges, value]
        : prev.discount_ranges.filter((item) => item !== value),
    }));
  }, []);

  const handleDealTypeChange = useCallback((value, checked) => {
    setSelectedFilters((prev) => ({
      ...prev,
      deal_types: checked
        ? [...prev.deal_types, value]
        : prev.deal_types.filter((item) => item !== value),
    }));
  }, []);

  // Clear individual filters
  const clearDiscountRangeFilter = useCallback((value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      discount_ranges: prev.discount_ranges.filter((item) => item !== value),
    }));
  }, []);

  const clearDealTypeFilter = useCallback((value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      deal_types: prev.deal_types.filter((item) => item !== value),
    }));
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    fetchDeals();
    onClose();
  }, [fetchDeals, onClose]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSortBy("discount_percentage");
    setMinPrice(0);
    setMaxPrice(0);
    setMinDiscount(10);
    setMaxDiscount(0);
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempMinDiscount("10");
    setTempMaxDiscount("");
    setIncludeOutOfStock(false);
    setSelectedFilters({
      discount_ranges: [],
      deal_types: [],
    });
  }, []);

  // Load more
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchDeals(true);
    }
  }, [hasMore, loadingMore, fetchDeals]);

  // Get selected filters count
  const getSelectedFiltersCount = useCallback(() => {
    return (
      (includeOutOfStock ? 1 : 0) +
      (minPrice > 0 || maxPrice > 0 ? 1 : 0) +
      (minDiscount > 10 || maxDiscount > 0 ? 1 : 0) +
      selectedFilters.discount_ranges.length +
      selectedFilters.deal_types.length
    );
  }, [
    includeOutOfStock,
    minPrice,
    maxPrice,
    minDiscount,
    maxDiscount,
    selectedFilters,
  ]);

  // SEO for flash deals page
  const flashDealsSEO = useMemo(() => ({
    title: `Offres Flash - Jusqu'à 70% de Réduction | As Solutions Fournitures`,
    description: `Découvrez ${totalCount} offres flash incroyables avec jusqu'à 70% de réduction. ✓ Livraison rapide ✓ Stock limité ✓ Promotions exceptionnelles`,
    keywords: 'offres flash, promotions, réductions, ventes flash, prix bas, liquidation, As Solutions',
    image: '/assets/logo-as.png',
    type: 'website',
    canonical: 'https://assolutionsfournitures.fr/flash-deals',
  }), [totalCount]);

  // Handle sort change
  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  // Navigate to product details
  const handleProductClick = useCallback(
    (product) => {
      navigate(`/product/${product.slug}`);
    },
    [navigate]
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  // Sort options
  const sortOptions = [
    { value: "discount_percentage", label: "Highest Discount" },
    { value: "savings_high_low", label: "Highest Savings" },
    { value: "price_low_high", label: "Price: Low to High" },
    { value: "price_high_low", label: "Price: High to Low" },
    { value: "urgency", label: "Deal Urgency" },
    { value: "popularity", label: "Popularity" },
    { value: "newest", label: "Newest" },
  ];

  if (loading) {
    return (
      <>
        <Box minH="100vh" bg="rgba(252, 252, 253, 1)">
          {/* Navbar Skeleton */}
          <Box bg="white" borderBottom="1px" borderColor="gray.100" py={4}>
            <Container maxW="8xl">
              <HStack spacing={6} justify="space-between">
                <Skeleton height="40px" width="120px" borderRadius="md" />
                <HStack spacing={4} flex={1} justify="center">
                  <Skeleton height="32px" width="80px" borderRadius="md" />
                  <Skeleton height="32px" width="100px" borderRadius="md" />
                  <Skeleton height="32px" width="90px" borderRadius="md" />
                  <Skeleton height="32px" width="110px" borderRadius="md" />
                </HStack>
                <HStack spacing={3}>
                  <SkeletonCircle size="40px" />
                  <SkeletonCircle size="40px" />
                  <Skeleton height="40px" width="100px" borderRadius="md" />
                </HStack>
              </HStack>
            </Container>
          </Box>

          <Container maxW="8xl" py={6}>
            {/* Header Section Skeleton */}
            <VStack spacing={6} mb={8}>
              <Flex
                w="full"
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={4}
              >
                <VStack align="start" spacing={3}>
                  {/* Flash Deals Title with Lightning Icon */}
                  <HStack spacing={3}>
                    <SkeletonCircle size="24px" />
                    <Skeleton height="32px" width="180px" />
                  </HStack>

                  {/* Subtitle */}
                  <Skeleton height="24px" width="250px" />

                  {/* Filter count */}
                  <Skeleton height="16px" width="120px" />

                  {/* Description */}
                  <Skeleton height="14px" width="350px" />
                </VStack>

                <HStack spacing={4}>
                  {/* Mobile Filter Button Skeleton */}
                  <Skeleton
                    height="40px"
                    width="100px"
                    borderRadius="md"
                    display={{ base: "block", lg: "none" }}
                  />

                  {/* Sort Section */}
                  <HStack spacing={2}>
                    <Skeleton
                      height="16px"
                      width="40px"
                      display={{ base: "none", md: "block" }}
                    />
                    <Skeleton height="32px" width="160px" borderRadius="md" />
                  </HStack>
                </HStack>
              </Flex>
            </VStack>

            {/* Main Content Grid */}
            <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
              {/* Desktop Filter Sidebar Skeleton */}
              <Box display={{ base: "none", lg: "block" }}>
                <VStack
                  align="stretch"
                  spacing={6}
                  p={4}
                  bg="gray.50"
                  borderRadius="lg"
                >
                  {/* Filter Header */}
                  <HStack justify="space-between">
                    <Skeleton height="20px" width="140px" />
                    <Skeleton height="20px" width="60px" />
                  </HStack>

                  {/* Active Filters Section */}
                  <Box>
                    <Skeleton height="16px" width="100px" mb={2} />
                    <HStack spacing={2}>
                      <Skeleton
                        height="24px"
                        width="80px"
                        borderRadius="full"
                      />
                      <Skeleton
                        height="24px"
                        width="60px"
                        borderRadius="full"
                      />
                      <Skeleton
                        height="24px"
                        width="70px"
                        borderRadius="full"
                      />
                    </HStack>
                  </Box>

                  <Skeleton height="1px" width="100%" />

                  {/* Price Range Filter */}
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <SkeletonCircle size="16px" />
                      <Skeleton height="18px" width="90px" />
                    </HStack>

                    <HStack spacing={2} w="full">
                      <VStack spacing={1} flex={1}>
                        <Skeleton height="12px" width="60px" />
                        <Skeleton
                          height="32px"
                          width="100%"
                          borderRadius="md"
                        />
                      </VStack>
                      <Skeleton
                        height="16px"
                        width="20px"
                        alignSelf="end"
                        mb={2}
                      />
                      <VStack spacing={1} flex={1}>
                        <Skeleton height="12px" width="60px" />
                        <Skeleton
                          height="32px"
                          width="100%"
                          borderRadius="md"
                        />
                      </VStack>
                    </HStack>

                    <HStack spacing={2} w="full">
                      <Skeleton height="32px" flex={1} borderRadius="md" />
                      <Skeleton height="32px" flex={1} borderRadius="md" />
                    </HStack>
                  </VStack>

                  <Skeleton height="1px" width="100%" />

                  {/* Discount Range Filter */}
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <SkeletonCircle size="16px" />
                      <Skeleton height="18px" width="110px" />
                    </HStack>

                    <HStack spacing={2} w="full">
                      <VStack spacing={1} flex={1}>
                        <Skeleton height="12px" width="80px" />
                        <Skeleton
                          height="32px"
                          width="100%"
                          borderRadius="md"
                        />
                      </VStack>
                      <Skeleton
                        height="16px"
                        width="20px"
                        alignSelf="end"
                        mb={2}
                      />
                      <VStack spacing={1} flex={1}>
                        <Skeleton height="12px" width="80px" />
                        <Skeleton
                          height="32px"
                          width="100%"
                          borderRadius="md"
                        />
                      </VStack>
                    </HStack>

                    <HStack spacing={2} w="full">
                      <Skeleton height="32px" flex={1} borderRadius="md" />
                      <Skeleton height="32px" flex={1} borderRadius="md" />
                    </HStack>
                  </VStack>

                  <Skeleton height="1px" width="100%" />

                  {/* Availability Filter */}
                  <VStack align="stretch" spacing={3}>
                    <HStack>
                      <SkeletonCircle size="16px" />
                      <Skeleton height="18px" width="80px" />
                    </HStack>

                    <HStack justify="space-between" align="center">
                      <Skeleton height="16px" width="180px" />
                      <Skeleton
                        height="24px"
                        width="48px"
                        borderRadius="full"
                      />
                    </HStack>
                  </VStack>

                  {/* Additional Filter Categories */}
                  {[...Array(2)].map((_, index) => (
                    <VStack key={index} align="stretch" spacing={3}>
                      <Skeleton height="1px" width="100%" />
                      <HStack>
                        <SkeletonCircle size="16px" />
                        <Skeleton height="18px" width="120px" />
                      </HStack>
                      <VStack spacing={2} align="stretch">
                        {[...Array(3)].map((_, i) => (
                          <HStack key={i} justify="space-between">
                            <HStack>
                              <SkeletonCircle size="16px" />
                              <Skeleton height="16px" width="100px" />
                            </HStack>
                            <Skeleton height="16px" width="20px" />
                          </HStack>
                        ))}
                      </VStack>
                    </VStack>
                  ))}
                </VStack>
              </Box>

              {/* Products Grid Skeleton */}
              <Box>
                {/* Loading Animation with Spinner */}
                <VStack py={8} spacing={6}>
                  <HStack spacing={3}>
                    <Skeleton height="40px" width="40px" borderRadius="full" />
                    <VStack spacing={2}>
                      <Skeleton height="20px" width="200px" />
                      <Skeleton height="16px" width="150px" />
                    </VStack>
                  </HStack>
                </VStack>

                {/* Product Cards Grid Skeleton */}
                <SimpleGrid
                  columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                  spacing={4}
                  mb={8}
                >
                  {[...Array(20)].map((_, index) => (
                    <Box
                      key={index}
                      bg="white"
                      borderRadius="lg"
                      overflow="hidden"
                      shadow="sm"
                    >
                      {/* Product Image */}
                      <Box position="relative">
                        <Skeleton height="200px" />

                        {/* Flash Deal Badge */}
                        <Box position="absolute" top={2} left={2}>
                          <Skeleton
                            height="24px"
                            width="60px"
                            borderRadius="full"
                          />
                        </Box>

                        {/* Discount Badge */}
                        <Box position="absolute" top={2} right={2}>
                          <Skeleton
                            height="24px"
                            width="40px"
                            borderRadius="full"
                          />
                        </Box>

                        {/* Urgency Indicator */}
                        <Box position="absolute" bottom={2} left={2}>
                          <Skeleton
                            height="20px"
                            width="80px"
                            borderRadius="full"
                          />
                        </Box>
                      </Box>

                      {/* Product Info */}
                      <VStack p={3} spacing={3} align="stretch">
                        {/* Product Title */}
                        <VStack spacing={1} align="stretch">
                          <Skeleton height="16px" width="100%" />
                          <Skeleton height="16px" width="80%" />
                        </VStack>

                        {/* Price Section */}
                        <VStack spacing={1} align="stretch">
                          <HStack justify="space-between" align="center">
                            <Skeleton height="20px" width="70px" />
                            <Skeleton height="16px" width="50px" />
                          </HStack>
                          <Skeleton height="14px" width="60px" />
                        </VStack>

                        {/* Savings */}
                        <Skeleton height="16px" width="90px" />

                        {/* Progress Bar for Stock/Time */}
                        <VStack spacing={1}>
                          <Skeleton
                            height="8px"
                            width="100%"
                            borderRadius="full"
                          />
                          <Skeleton height="12px" width="60%" />
                        </VStack>

                        {/* Action Button */}
                        <Skeleton height="36px" borderRadius="md" />
                      </VStack>
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Load More Button Skeleton */}
                <VStack spacing={4}>
                  <Skeleton height="40px" width="200px" borderRadius="md" />
                </VStack>
              </Box>
            </Grid>
          </Container>

          {/* Footer Skeleton */}
          <Box bg="gray.900" mt={12} py={8}>
            <Container maxW="8xl">
              <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
                {[...Array(4)].map((_, i) => (
                  <VStack key={i} align="start" spacing={4}>
                    <Skeleton height="20px" width="120px" />
                    <VStack align="start" spacing={2}>
                      <Skeleton height="16px" width="80px" />
                      <Skeleton height="16px" width="100px" />
                      <Skeleton height="16px" width="90px" />
                      <Skeleton height="16px" width="70px" />
                    </VStack>
                  </VStack>
                ))}
              </SimpleGrid>

              <Skeleton height="1px" width="100%" my={8} />

              <HStack justify="space-between" wrap="wrap" gap={4}>
                <Skeleton height="16px" width="200px" />
                <HStack spacing={4}>
                  <Skeleton height="32px" width="32px" borderRadius="md" />
                  <Skeleton height="32px" width="32px" borderRadius="md" />
                  <Skeleton height="32px" width="32px" borderRadius="md" />
                  <Skeleton height="32px" width="32px" borderRadius="md" />
                </HStack>
              </HStack>
            </Container>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Offres Flash - Jusqu'à 70% de Réduction sur {totalCount} Produits | AS Solutions Fournitures</title>
        <meta 
          name="title" 
          content={`Offres Flash - Jusqu'à 70% de Réduction sur ${totalCount} Produits | AS Solutions Fournitures`} 
        />
        <meta 
          name="description" 
          content={`🔥 Découvrez ${totalCount} offres flash exclusives avec jusqu'à 70% de réduction ! ✓ Stock limité ✓ Livraison rapide ✓ Promotions exceptionnelles ✓ Économisez sur bricolage, maison, jardin et plus`} 
        />
        <meta 
          name="keywords" 
          content="offres flash, promotions, réductions, ventes flash, prix bas, liquidation, destockage, soldes, bons plans, bricolage pas cher, fournitures promotion, AS Solutions" 
        />
        <link rel="canonical" href={`${BASE_URL}/flash-deals`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AS Solutions Fournitures" />
        <meta property="og:title" content={`🔥 Offres Flash - Jusqu'à 70% de Réduction sur ${totalCount} Produits`} />
        <meta 
          property="og:description" 
          content={`Profitez de nos ${totalCount} offres flash exceptionnelles ! Stock limité, livraison rapide, économies garanties sur bricolage, maison, jardin et plus.`} 
        />
        <meta property="og:image" content={dealsImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Offres Flash AS Solutions - Réductions jusqu'à 70%" />
        <meta property="og:locale" content="fr_FR" />

        

        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="AS Solutions Fournitures" />
        <meta name="language" content="French" />
        <meta name="revisit-after" content="1 days" />
        <meta name="distribution" content="global" />

        {/* Structured Data - OfferCatalog */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            "name": "Offres Flash AS Solutions Fournitures",
            "description": `Découvrez ${totalCount} offres flash exceptionnelles avec jusqu'à 70% de réduction`,
            "url": `${BASE_URL}/flash-deals`,
            "numberOfItems": totalCount,
            "itemListElement": deals.slice(0, 10).map((product, index) => {
              const formattedProduct = homeService.formatFlashDealProductData(product);
              const dealPrice = formattedProduct.pricing?.final_price_gross || formattedProduct.price || 0;
              const originalPrice = formattedProduct.pricing?.original_price || dealPrice;
              const discount = formattedProduct.pricing?.discount_percentage || 0;
              
              return {
                "@type": "Offer",
                "position": index + 1,
                "itemOffered": {
                  "@type": "Product",
                  "name": formattedProduct.title,
                  "description": formattedProduct.description || formattedProduct.short_description,
                  "image": formattedProduct.main_image_url,
                  "sku": formattedProduct.sku || formattedProduct.id,
                  "brand": {
                    "@type": "Brand",
                    "name": formattedProduct.brand || "AS Solutions"
                  }
                },
                "price": dealPrice,
                "priceCurrency": "EUR",
                "priceValidUntil": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                "availability": formattedProduct.stock_quantity > 0 
                  ? "https://schema.org/InStock" 
                  : "https://schema.org/OutOfStock",
                "url": `${BASE_URL}/product/${formattedProduct.slug}`,
                "seller": {
                  "@type": "Organization",
                  "name": "AS Solutions Fournitures"
                },
                "priceSpecification": {
                  "@type": "PriceSpecification",
                  "price": dealPrice,
                  "priceCurrency": "EUR",
                  "valueAddedTaxIncluded": true
                },
                ...(discount > 0 && {
                  "eligibleQuantity": {
                    "@type": "QuantitativeValue",
                    "value": formattedProduct.stock_quantity
                  }
                })
              };
            }),
            "provider": {
              "@type": "Organization",
              "name": "AS Solutions Fournitures",
              "url": BASE_URL,
              "logo": `${BASE_URL}/assets/logo-as.png`
            }
          })}
        </script>

        {/* Structured Data - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Offres Flash - AS Solutions Fournitures",
            "description": `Découvrez ${totalCount} offres flash exceptionnelles avec jusqu'à 70% de réduction`,
            "url": `${BASE_URL}/flash-deals`,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": totalCount,
              "itemListElement": deals.slice(0, 20).map((product, index) => {
                const formattedProduct = homeService.formatFlashDealProductData(product);
                return {
                  "@type": "ListItem",
                  "position": index + 1,
                  "item": {
                    "@type": "Product",
                    "name": formattedProduct.title,
                    "url": `${BASE_URL}/product/${formattedProduct.slug}`,
                    "image": formattedProduct.main_image_url,
                    "offers": {
                      "@type": "Offer",
                      "price": formattedProduct.pricing?.final_price_gross || formattedProduct.price || 0,
                      "priceCurrency": "EUR",
                      "availability": formattedProduct.stock_quantity > 0 
                        ? "https://schema.org/InStock" 
                        : "https://schema.org/OutOfStock"
                    }
                  }
                };
              })
            }
          })}
        </script>

        {/* Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": BASE_URL
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Offres Flash",
                "item": `${BASE_URL}/flash-deals`
              }
            ]
          })}
        </script>

        {/* Additional Meta Tags for Better Indexing */}
        <meta property="product:availability" content="in stock" />
        <meta property="product:condition" content="new" />
        <meta property="product:price:currency" content="EUR" />
        <meta name="price" content={deals[0] ? (homeService.formatFlashDealProductData(deals[0]).pricing?.final_price_gross || 0) : 0} />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#EF3054" />
        <meta name="msapplication-navbutton-color" content="#EF3054" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#EF3054" />
      </Helmet>

      <Box minH="100vh" bg="gray.50">
        <Navbar />

        <Container maxW="8xl" py={6}>
        {/* Flash Deals Header */}
        <VStack spacing={6} mb={8}>
          <Flex
            w="full"
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={4}
          >
            <VStack align="start" spacing={1}>
              <HStack>
                <Heading
                  fontSize="xl"
                  fontWeight="600"
                  fontFamily="Airbnb Cereal VF"
                  color="black"
                >
                  Offres flash
                </Heading>
              </HStack>
              <Text
                fontSize="md"
                fontWeight="500"
                fontFamily="Airbnb Cereal VF"
              >
                {loading ? "Loading..." : `${totalCount} Offres incroyables trouvées`}
              </Text>
              {getSelectedFiltersCount() > 0 && (
                <Text fontSize="sm" color="gray.600" fontFamily="Airbnb Cereal VF">
                  {getSelectedFiltersCount()} filtres appliqués
                </Text>
              )}
              <Text fontSize="sm" color="gray.500" fontFamily="Airbnb Cereal VF">
                Découvrez des offres incroyables avec jusqu'à 70 % de réduction sur une sélection de produits
              </Text>
            </VStack>

            <HStack spacing={4}>
              {/* Mobile Filter Button */}
              <Button
                leftIcon={<FaFilter />}
                variant="outline"
                display={{ base: "flex", lg: "none" }}
                onClick={onOpen}
                fontFamily="Airbnb Cereal VF"
              >
                Filtres{" "}
                {getSelectedFiltersCount() > 0 &&
                  `(${getSelectedFiltersCount()})`}
              </Button>

              {/* Sort Options */}
              <HStack>
                <Text fontSize="sm" display={{ base: "none", md: "block" }}>
                  Sort:
                </Text>
                <Select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  w={{ base: "160px", md: "200px" }}
                  bg="white"
                  size="sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </HStack>
            </HStack>
          </Flex>
        </VStack>

        {/* Main Content */}
        <Grid templateColumns={{ base: "1fr", lg: "300px 1fr" }} gap={6}>
          {/* Desktop Filters */}
          <Box display={{ base: "none", lg: "block" }}>
            <FlashDealFilterSidebar
              minPrice={minPrice}
              maxPrice={maxPrice}
              tempMinPrice={tempMinPrice}
              tempMaxPrice={tempMaxPrice}
              minDiscount={minDiscount}
              maxDiscount={maxDiscount}
              tempMinDiscount={tempMinDiscount}
              tempMaxDiscount={tempMaxDiscount}
              includeOutOfStock={includeOutOfStock}
              availableFilters={availableFilters}
              selectedFilters={selectedFilters}
              getSelectedFiltersCount={getSelectedFiltersCount}
              clearFilters={clearFilters}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              handleMinDiscountChange={handleMinDiscountChange}
              handleMaxDiscountChange={handleMaxDiscountChange}
              applyPriceRange={applyPriceRange}
              clearPriceRange={clearPriceRange}
              applyDiscountRange={applyDiscountRange}
              clearDiscountRange={clearDiscountRange}
              applyFilters={applyFilters}
              setIncludeOutOfStock={setIncludeOutOfStock}
              handleDiscountRangeChange={handleDiscountRangeChange}
              handleDealTypeChange={handleDealTypeChange}
              clearDiscountRangeFilter={clearDiscountRangeFilter}
              clearDealTypeFilter={clearDealTypeFilter}
            />
          </Box>

          {/* Products Grid */}
          <Box>
            {loading ? (
              <VStack py={20}>
                <Spinner size="xl" color="red.500" />
                <Text>Chargement des offres flash...</Text>
              </VStack>
            ) : error ? (
              window.location.href = "/"
            ) : deals.length === 0 ? (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold">Aucune offre flash trouvée</Text>
                  <Text fontSize="sm" fontFamily="Bogle">
                    Essayez d'ajuster vos filtres pour voir plus d'offres.
                  </Text>
                </VStack>
              </Alert>
            ) : (
              <>
                <SimpleGrid
                  columns={{ base: 2, md: 3, lg: 4, xl: 4 }}
                  spacing={4}
                  mb={8}
                >
                  {deals.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={homeService.formatFlashDealProductData(product)}
                      isFlashDeal={true}
                    />
                  ))}
                </SimpleGrid>

                {/* Load More Button */}
                {hasMore && (
                  <VStack spacing={4}>
                    <Button
                      size="sm"
                      onClick={loadMore}
                      isLoading={loadingMore}
                      loadingText="Chargement de plus d'offres..."
                      w="auto"
                      maxW="auto"
                      borderColor="red.500"
                      borderWidth={0}
                      color="white"
                      p={5}
                      _hover={{ bg: "rgb(241, 36, 36)" }}
                      bg="rgb(241, 36, 36)"
                      fontFamily="Bogle"
                    >
                      Afficher plus d'offres flash
                    </Button>
                  </VStack>
                )}
              </>
            )}
          </Box>
        </Grid>

        {/* Mobile Filter Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filtres d'offres flash</DrawerHeader>
            <DrawerBody>
              <FlashDealFilterSidebar
                isMobile={true}
                minPrice={minPrice}
                maxPrice={maxPrice}
                tempMinPrice={tempMinPrice}
                tempMaxPrice={tempMaxPrice}
                minDiscount={minDiscount}
                maxDiscount={maxDiscount}
                tempMinDiscount={tempMinDiscount}
                tempMaxDiscount={tempMaxDiscount}
                includeOutOfStock={includeOutOfStock}
                availableFilters={availableFilters}
                selectedFilters={selectedFilters}
                getSelectedFiltersCount={getSelectedFiltersCount}
                clearFilters={clearFilters}
                handleMinPriceChange={handleMinPriceChange}
                handleMaxPriceChange={handleMaxPriceChange}
                handleMinDiscountChange={handleMinDiscountChange}
                handleMaxDiscountChange={handleMaxDiscountChange}
                applyPriceRange={applyPriceRange}
                clearPriceRange={clearPriceRange}
                applyDiscountRange={applyDiscountRange}
                clearDiscountRange={clearDiscountRange}
                applyFilters={applyFilters}
                setIncludeOutOfStock={setIncludeOutOfStock}
                handleDiscountRangeChange={handleDiscountRangeChange}
                handleDealTypeChange={handleDealTypeChange}
                clearDiscountRangeFilter={clearDiscountRangeFilter}
                clearDealTypeFilter={clearDealTypeFilter}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>

      <Footer />
    </Box>
  </>
  );
};

export default CustomerDealsPage;