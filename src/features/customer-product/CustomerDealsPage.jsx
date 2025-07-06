import React, { useState, useEffect, useCallback } from "react";
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
      >
        <HStack justify="space-between">
          <Text
            fontSize="lg"
            fontWeight="bold"
            fontFamily={"Bricolage Grotesque"}
          >
            Flash Deal Filters{" "}
            {getSelectedFiltersCount() > 0 && `(${getSelectedFiltersCount()})`}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            fontFamily={"Bricolage Grotesque"}
          >
            Clear All
          </Button>
        </HStack>

        {/* Active Filters Summary */}
        {getSelectedFiltersCount() > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Active Filters:
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
            <FaEuroSign color="gray.500" />
            <Text fontWeight="semibold" fontFamily={"Bricolage Grotesque"}>
              Price Range
            </Text>
          </HStack>

          <VStack spacing={3}>
            <HStack spacing={2} w="full">
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Min Price
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
                to
              </Text>
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Max Price
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
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearPriceRange}
                flex={1}
              >
                Clear
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Discount Range Filter */}
        <Box>
          <HStack mb={3}>
            <FaPercent color="gray.500" />
            <Text fontWeight="semibold" fontFamily={"Bricolage Grotesque"}>
              Discount Range
            </Text>
          </HStack>

          <VStack spacing={3}>
            <HStack spacing={2} w="full">
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Min Discount (%)
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
                to
              </Text>
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500">
                  Max Discount (%)
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
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearDiscountRange}
                flex={1}
              >
                Clear
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Availability Filter */}
        <Box>
          <HStack mb={3}>
            <FaBoxOpen color="gray.500" />
            <Text fontWeight="semibold" fontFamily={"Bricolage Grotesque"}>
              Availability
            </Text>
          </HStack>

          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              Include Out of Stock Products
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
          <Button colorScheme="blue" onClick={applyFilters} size="lg">
            Apply Filters
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
          throw new Error(response.message || "Failed to fetch deals");
        }
      } catch (err) {
        setError(err.message || "Failed to load deals");
        setDeals([]);
        toast({
          description: "Failed to load flash deals. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
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
        title: "Invalid Price",
        description: "Please enter a valid minimum price.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (tempMaxPrice && isNaN(max)) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid maximum price.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (min < 0) {
      toast({
        title: "Invalid Price",
        description: "Minimum price cannot be negative.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (max > 0 && min > max) {
      toast({
        title: "Invalid Price Range",
        description: "Minimum price cannot be greater than maximum price.",
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
        title: "Invalid Discount",
        description: "Please enter a valid minimum discount.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (tempMaxDiscount && isNaN(max)) {
      toast({
        title: "Invalid Discount",
        description: "Please enter a valid maximum discount.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (min < 0) {
      toast({
        title: "Invalid Discount",
        description: "Minimum discount cannot be negative.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    if (max > 0 && min > max) {
      toast({
        title: "Invalid Discount Range",
        description:
          "Minimum discount cannot be greater than maximum discount.",
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

  return (
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
                <FaBolt color="red.500" size="24px" />
                <Heading
                  fontSize="2xl"
                  fontWeight="bold"
                  fontFamily={"Bricolage Grotesque"}
                  color="red.500"
                >
                  Flash Deals
                </Heading>
              </HStack>
              <Text
                fontSize="lg"
                fontWeight="bold"
                fontFamily={"Bricolage Grotesque"}
              >
                {loading ? "Loading..." : `${totalCount} Amazing Deals Found`}
              </Text>
              {getSelectedFiltersCount() > 0 && (
                <Text fontSize="sm" color="gray.600">
                  {getSelectedFiltersCount()} filters applied
                </Text>
              )}
              <Text fontSize="sm" color="gray.500">
                Discover amazing deals with up to 70% off on selected products
              </Text>
            </VStack>

            <HStack spacing={4}>
              {/* Mobile Filter Button */}
              <Button
                leftIcon={<FaFilter />}
                variant="outline"
                display={{ base: "flex", lg: "none" }}
                onClick={onOpen}
                fontFamily={"Bricolage Grotesque"}
              >
                Filters{" "}
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
                <Text>Loading flash deals...</Text>
              </VStack>
            ) : error ? (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold">Error Loading Deals</Text>
                  <Text fontSize="sm" fontFamily={"Bricolage Grotesque"}>
                    {error}
                  </Text>
                </VStack>
              </Alert>
            ) : deals.length === 0 ? (
              <Alert status="info" borderRadius="lg">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="semibold">No flash deals found</Text>
                  <Text fontSize="sm" fontFamily={"Bricolage Grotesque"}>
                    Try adjusting your filters to see more deals.
                  </Text>
                </VStack>
              </Alert>
            ) : (
              <>
                <SimpleGrid
                  columns={{ base: 2, md: 3, lg: 4, xl: 5 }}
                  spacing={4}
                  mb={8}
                >
                  {deals.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={homeService.formatFlashDealProductData(product)}
                      onClick={() => handleProductClick(product)}
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
                      loadingText="Loading more deals..."
                      w="auto"
                      maxW="auto"
                      borderColor="red.500"
                      borderWidth={0}
                      color="white"
                      p={5}
                      _hover={{ bg: "rgb(239, 48, 84)" }}
                      bg="rgb(239, 48, 84)"
                      fontFamily={"Bricolage Grotesque"}
                    >
                      Show More Flash Deals
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
            <DrawerHeader>Flash Deal Filters</DrawerHeader>
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
  );
};

export default CustomerDealsPage;
