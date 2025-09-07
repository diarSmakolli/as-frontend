// version 1.3
import React, { useState, useEffect, useCallback, useRef } from "react";
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
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderMark,
  useDisclosure as useCollapseDisclosure,
  Collapse,
  Center,
  Skeleton,
  SkeletonCircle,
} from "@chakra-ui/react";
import {
  FaFilter,
  FaEuroSign,
  FaBoxOpen,
  FaCog,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { homeService } from "../home/services/homeService";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";
import ProductCard from "./ProductCard";
import { handleApiError } from "../../commons/handleApiError";
import { useCustomerAuth } from "../customer-account/auth-context/customerAuthContext";

const FilterSidebar = React.memo(
  ({
    isMobile = false,
    minPrice,
    maxPrice,
    tempMinPrice,
    tempMaxPrice,
    includeOutOfStock,
    availableFilters,
    selectedFilters,
    getSelectedFiltersCount,
    clearFilters,
    handleMinPriceChange,
    handleMaxPriceChange,
    applyPriceRange,
    clearPriceRange,
    applyFilters,
    setIncludeOutOfStock,
    handleSpecificationChange,
    clearSpecificationFilter,
  }) => {
    const { isOpen: isSpecOpen, onToggle: onSpecToggle } =
      useCollapseDisclosure({ defaultIsOpen: false });

    return (
      <VStack
        align="stretch"
        spacing={6}
        p={isMobile ? 0 : 4}
        bg={"#fff"}
        border="1px solid rgba(145, 158, 171, 0.2)"
        borderRadius={isMobile ? 0 : "lg"}
        maxH={isMobile ? "auto" : "calc(100vh - 120px)"}
        overflowY={isMobile ? "visible" : "auto"}
      >
        <HStack justify="space-between">
          <Text
            fontSize="md"
            fontWeight="500"
            fontFamily={"Airbnb Cereal VF"}
            color='gray.700'
          >
            Filtres{" "}
            {getSelectedFiltersCount() > 0 && `(${getSelectedFiltersCount()})`}
          </Text>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearFilters}
            fontFamily={"Airbnb Cereal VF"}
            fontSize={'sm'}
            color='gray.700'
          >
            Tout effacer
          </Button>
        </HStack>

        {/* Active Filters Summary */}
        {getSelectedFiltersCount() > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" mb={2}>
              Filtres actifs
            </Text>
            <Box maxH="120px" overflowY="auto">
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
                {includeOutOfStock && (
                  <WrapItem>
                    <Tag size="sm" colorScheme="orange" variant="solid">
                      <TagLabel>Inclure les ruptures de stock</TagLabel>
                      <TagCloseButton
                        onClick={() => setIncludeOutOfStock(false)}
                      />
                    </Tag>
                  </WrapItem>
                )}
                {/* Dynamic specification filters tags */}
                {Object.entries(selectedFilters.specifications || {}).map(
                  ([specKey, specValues]) =>
                    // specValues.slice(0, 8)
                    specValues
                    .map((value) => (
                      <WrapItem key={`${specKey}-${value}`}>
                        <Tag size="sm" colorScheme="purple" variant="solid">
                          <TagLabel noOfLines={1} maxW="120px">
                            {value}
                          </TagLabel>
                          <TagCloseButton
                            onClick={() =>
                              clearSpecificationFilter(specKey, value)
                            }
                          />
                        </Tag>
                      </WrapItem>
                    ))
                )}
                {/* Show count if more filters are applied */}
                {Object.values(selectedFilters.specifications || {}).flat()
                  .length > 8 && (
                  <WrapItem>
                    <Tag size="sm" colorScheme="gray" variant="outline">
                      <TagLabel>
                        +
                        {Object.values(
                          selectedFilters.specifications || {}
                        ).flat().length - 8}{" "}
                        plus
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                )}
              </Wrap>
            </Box>
          </Box>
        )}

        <Divider />

        {/* Price Range Filter */}
        <Box>
          <HStack mb={3}>
            {/* <FaEuroSign color="gray.500" /> */}
            <Text fontWeight="500" fontFamily={"Airbnb Cereal VF"}>
              Gamme de prix
            </Text>
          </HStack>

          {availableFilters?.price_range && (
            <Text fontSize="xs" color="gray.600" mb={2} fontFamily={"Airbnb Cereal VF"}>
              {availableFilters.price_range.formatted_range}
            </Text>
          )}

          <VStack spacing={3}>
            <HStack spacing={2} w="full">
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500" fontFamily={"Airbnb Cereal VF"}>
                  Prix minimum
                </Text>
                <Input
                  value={tempMinPrice}
                  onChange={handleMinPriceChange}
                  placeholder={
                    availableFilters?.price_range?.min?.toString() || "0"
                  }
                  size="sm"
                  autoComplete="off"
                />
              </VStack>
              <Text alignSelf="end" pb={2} color="gray.400" fontFamily={"Airbnb Cereal VF"}>
                à
              </Text>
              <VStack spacing={1} flex={1}>
                <Text fontSize="xs" color="gray.500" fontFamily={"Airbnb Cereal VF"}>
                  Prix maximum
                </Text>
                <Input
                  value={tempMaxPrice}
                  onChange={handleMaxPriceChange}
                  placeholder={
                    availableFilters?.price_range?.max?.toString() || "∞"
                  }
                  size="sm"
                  autoComplete="off"
                />
              </VStack>
            </HStack>
            <HStack spacing={2} w="full">
              <Button
                size="sm"
                bg='#0d00caff'
                color='white'
                _hover={{ bg: '#0d00caff' }}
                _active={{ bg: '#0d00caff' }}
                _focus={{ bg: '#0d00caff' }}
                onClick={applyPriceRange}
                flex={1}
                fontFamily={"Airbnb Cereal VF"}
              >
                Appliquer
              </Button>
              <Button
                size="sm"
                bg='#0d00caff'
                color='white'
                _hover={{ bg: '#0d00caff' }}
                _active={{ bg: '#0d00caff' }}
                _focus={{ bg: '#0d00caff' }}
                onClick={clearPriceRange}
                flex={1}
              >
                Claire
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        {/* Availability Filter */}
        <Box>
          <HStack mb={3}>
            <FaBoxOpen color="gray.500" />
            <Text fontWeight="500" fontFamily="Airbnb Cereal VF">
              Disponibilité
            </Text>
          </HStack>

          {availableFilters?.availability?.options &&
          availableFilters.availability.options.length > 0 ? (
            <VStack align="start" spacing={2}>
              {availableFilters.availability.options.map((option) => (
                <HStack key={option.value} justify="space-between" w="full">
                  <Checkbox
                    size="sm"
                    isChecked={
                      option.value === "out_of_stock"
                        ? includeOutOfStock
                        : !includeOutOfStock
                    }
                    onChange={(e) => {
                      if (option.value === "out_of_stock") {
                        setIncludeOutOfStock(e.target.checked);
                      } else {
                        setIncludeOutOfStock(!e.target.checked);
                      }
                    }}
                  >
                    <Text fontSize="sm">{option.label}</Text>
                  </Checkbox>
                  {/* <Text fontSize="xs" color="gray.500">
                    ({option.count})
                  </Text> */}
                </HStack>
              ))}
            </VStack>
          ) : (
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" color="gray.600" fontFamily="Airbnb Cereal VF">
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
          )}
        </Box>

        {/* Auto-Generated Specifications Filters */}
        {availableFilters?.specifications &&
          Object.keys(availableFilters.specifications).length > 0 && (
            <>
              <Divider />
              <Box>
                <Button
                  variant="ghost"
                  w="full"
                  justifyContent="space-between"
                  onClick={onSpecToggle}
                  px={0}
                  py={2}
                  h="auto"
                  _hover={{ bg: "transparent" }}
                >
                  <HStack>
                    <FaCog color="gray.500" />
                    <VStack align="start" spacing={0}>
                      <Text
                        fontWeight="500"
                        fontFamily="Airbnb Cereal VF"
                      >
                        Filtrer par spécifications
                      </Text>
                      {/* <Text fontSize="xs" color="gray.500" fontFamily="Airbnb Cereal VF">
                        {Object.keys(availableFilters.specifications).length}{" "}
                        catégories disponibles
                      </Text> */}
                    </VStack>
                  </HStack>
                  <Box color="gray.400">
                    {isSpecOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </Box>
                </Button>

                <Collapse in={isSpecOpen} animateOpacity>
                  <Box mt={3}>
                    <Box
                      maxH="400px"
                      overflowY="auto"
                      overflowX="hidden"
                      pr={2}
                      css={{
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#CBD5E0",
                          borderRadius: "24px",
                        },
                      }}
                    >
                      <Accordion allowMultiple defaultIndex={[]}>
                        {Object.entries(availableFilters.specifications)
                          // .slice(0, 8)
                          .map(([specKey, specData]) => (
                            <AccordionItem key={specKey} border="none" mb={2}>
                              <AccordionButton
                                px={2}
                                py={2}
                                borderRadius="md"
                                _hover={{ bg: "gray.100" }}
                              >
                                <Box flex="1" textAlign="left">
                                  <Text fontSize="xs" fontWeight="medium">
                                    {specData.label}
                                  </Text>
                                  <HStack spacing={2}>
                                    {/* <Text fontSize="xs" color="gray.500">
                                      {specData.total_products} products
                                    </Text> */}
                                    {selectedFilters.specifications?.[specKey]
                                      ?.length > 0 && (
                                      <Text
                                        fontSize="xs"
                                        color="blue.500"
                                        fontWeight="medium"
                                      >
                                        (
                                        {
                                          selectedFilters.specifications[
                                            specKey
                                          ].length
                                        }{" "}
                                        choisie)
                                      </Text>
                                    )}
                                  </HStack>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel px={2} py={2}>
                                <Box maxH="180px" overflowY="auto">
                                  <VStack align="start" spacing={2}>
                                    {specData.options.map((option) => (
                                      <HStack
                                        key={option.value}
                                        justify="space-between"
                                        w="full"
                                        py={1}
                                        px={2}
                                        borderRadius="sm"
                                        _hover={{ bg: "gray.50" }}
                                      >
                                        <Checkbox
                                          size="sm"
                                          isChecked={
                                            selectedFilters.specifications?.[
                                              specKey
                                            ]?.includes(option.value) || false
                                          }
                                          onChange={(e) =>
                                            handleSpecificationChange(
                                              specKey,
                                              option.value,
                                              e.target.checked
                                            )
                                          }
                                        >
                                          <Text fontSize="sm" noOfLines={1}>
                                            {option.label}
                                          </Text>
                                        </Checkbox>
                                        {/* <Text
                                          fontSize="xs"
                                          color="gray.500"
                                          flexShrink={0}
                                        >
                                          ({option.count})
                                        </Text> */}
                                      </HStack>
                                    ))}
                                  </VStack>
                                </Box>
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </Box>

                    {Object.keys(selectedFilters.specifications).length > 0 && (
                      <Box mt={3} pt={3} borderTopWidth="1px">
                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.600">
                            {
                              Object.values(
                                selectedFilters.specifications
                              ).flat().length
                            }{" "}
                            spécifications sélectionnées
                          </Text>
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() =>
                              setSelectedFilters((prev) => ({
                                ...prev,
                                specifications: {},
                              }))
                            }
                            color="red.500"
                          >
                            Effacer toutes les spécifications
                          </Button>
                        </HStack>
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </Box>
            </>
          )}

        {isMobile && (
          <Button bg="#0d00caff" _hover={{ bg: '#0d00caff'}} _active={{bg: '#0d00caff'}} _focus={{bg: '#0d00caff'}} onClick={applyFilters} size="lg" fontFamily={"Airbnb Cereal VF"}>
            Appliquer des filtres
          </Button>
        )}
      </VStack>
    );
  }
);

const CustomerSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { customer } = useCustomerAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [availableFilters, setAvailableFilters] = useState(null);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "relevance"
  );
  const [minPrice, setMinPrice] = useState(
    parseFloat(searchParams.get("min_price")) || 0
  );
  const [maxPrice, setMaxPrice] = useState(
    parseFloat(searchParams.get("max_price")) || 0
  );
  const [includeOutOfStock, setIncludeOutOfStock] = useState(
    searchParams.get("include_out_of_stock") === "true"
  );
  const [selectedFilters, setSelectedFilters] = useState({
    specifications: {}, 
  });
  const [tempMinPrice, setTempMinPrice] = useState("");
  const [tempMaxPrice, setTempMaxPrice] = useState("");
  const impressionRefs = useRef([]);
  const sentImpressions = useRef(new Set());
  

  // Watch for URL changes
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [searchParams, query]);

  // send analytics event on page load
  useEffect(() => {
    if (query && query.trim().length > 0) {
      homeService
        .createProductEvent({
          event_type: "search_result",
          session_id:
            typeof window !== "undefined"
              ? customer?.id
              : null,
          customer_id: customer?.id || null,
          search_query: query,
          page_type: "search_results",
          page_url: typeof window !== "undefined" ? window.location.href : null,
          referrer_url:
            typeof document !== "undefined" ? document.referrer : null,
          timestamp: new Date().toISOString(),
        })
        .catch(() => {});
    }
  }, [query, sortBy, selectedFilters, customer?.id]);

  // Analytics for Impressions and Hovers
  // Track impressions (batch)
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
            const product = products[index];
            const uniqueKey = `search-${product.id}-${index}`;
            if (!sentImpressions.current.has(uniqueKey)) {
              batchEvents.push({
                event_type: "impression",
                product_id: product.id,
                position: index,
                page_type: "search_results",
                page_url: typeof window !== "undefined" ? window.location.href : null,
                referrer_url: typeof document !== "undefined" ? document.referrer : null,
                timestamp: new Date().toISOString(),
              });
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
    impressionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => {
      impressionRefs.current.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [products]);

  // Product hover event
  const handleProductHover = (product, index) => {
    homeService.createProductEvent({
      event_type: "hover",
      product_id: product.id,
      position: index,
      page_type: "search_results",
      page_url: typeof window !== "undefined" ? window.location.href : null,
      referrer_url: typeof document !== "undefined" ? document.referrer : null,
      timestamp: new Date().toISOString(),
    }).catch(() => {});
  };

  // Search function
  const searchProducts = useCallback(
    async (isLoadMore = false) => {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setProducts([]);
        setOffset(0);
      }

      try {
        const params = {
          q: query,
          limit: 25,
          offset: isLoadMore ? offset : 0,
          sort_by: sortBy,
          min_price: minPrice > 0 ? minPrice : undefined,
          max_price: maxPrice > 0 ? maxPrice : undefined,
          include_out_of_stock: includeOutOfStock,
        };

        const hasSpecificationFilters =
          Object.keys(selectedFilters.specifications).length > 0;

        if (hasSpecificationFilters) {
          params.filters = {
            specifications: selectedFilters.specifications,
          };
        }

        const result = await homeService.searchProducts(params);

        if (result.status === "success") {
          if (isLoadMore) {
            setProducts((prev) => [...prev, ...result.data.products]);
            setOffset((prev) => prev + 25);
          } else {
            setProducts(result.data.products);
            setOffset(25);
          }

          setTotalCount(result.data.pagination.total_count);
          setHasMore(result.data.pagination.has_more);

          if (result.data.available_filters) {
            setAvailableFilters(result.data.available_filters);
          }
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        setProducts([]);
        setTotalCount(0);
        setHasMore(false);
        navigate("/");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      query,
      sortBy,
      minPrice,
      maxPrice,
      includeOutOfStock,
      selectedFilters,
      offset,
      toast,
    ]
  );

  // Handle specification filter changes
  const handleSpecificationChange = useCallback((specKey, value, isChecked) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (!newFilters.specifications[specKey]) {
        newFilters.specifications[specKey] = [];
      }

      if (isChecked) {
        if (!newFilters.specifications[specKey].includes(value)) {
          newFilters.specifications[specKey] = [
            ...newFilters.specifications[specKey],
            value,
          ];
        }
      } else {
        newFilters.specifications[specKey] = newFilters.specifications[
          specKey
        ].filter((v) => v !== value);
        if (newFilters.specifications[specKey].length === 0) {
          delete newFilters.specifications[specKey];
        }
      }

      return newFilters;
    });
  }, []);

  // Clear individual specification filter
  const clearSpecificationFilter = useCallback((specKey, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (newFilters.specifications[specKey]) {
        newFilters.specifications[specKey] = newFilters.specifications[
          specKey
        ].filter((v) => v !== value);
        if (newFilters.specifications[specKey].length === 0) {
          delete newFilters.specifications[specKey];
        }
      }
      return newFilters;
    });
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  // Handle price input changes
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
        containerStyle: customErrorToastContainerStyle,
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
        containerStyle: customErrorToastContainerStyle,
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
        containerStyle: customErrorToastContainerStyle,
      });
      return;
    }

    if (max > 0 && min > max) {
      toast({
        title: "Gamme de prix non valide",
        description: "Le prix minimum ne peut pas être supérieur au prix maximum.",
        status: "error",
        duration: 3000,
        variant: "custom",
        containerStyle: customErrorToastContainerStyle,
      });
      return;
    }

    setMinPrice(min);
    setMaxPrice(max);
  }, [tempMinPrice, tempMaxPrice, toast]);

  // Clear price range
  const clearPriceRange = useCallback(() => {
    setMinPrice(0);
    setMaxPrice(0);
    setTempMinPrice("");
    setTempMaxPrice("");
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    searchProducts();
    onClose();
  }, [searchProducts, onClose]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSortBy("relevance");
    setMinPrice(0);
    setMaxPrice(0);
    setTempMinPrice("");
    setTempMaxPrice("");
    setIncludeOutOfStock(false);
    setSelectedFilters({
      specifications: {},
    });
  }, []);

  // Load more products
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      searchProducts(true);
    }
  }, [hasMore, loadingMore, searchProducts]);

  // Get selected filters count
  const getSelectedFiltersCount = useCallback(() => {
    return (
      (includeOutOfStock ? 1 : 0) +
      (minPrice > 0 || maxPrice > 0 ? 1 : 0) +
      Object.values(selectedFilters.specifications).flat().length
    );
  }, [includeOutOfStock, minPrice, maxPrice, selectedFilters]);

  // Initial search when component mounts or query changes
  useEffect(() => {
    searchProducts();
  }, [query]);

  // Search when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [sortBy, includeOutOfStock, minPrice, maxPrice, selectedFilters]);

  // Sort options
  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "price_low_high", label: "Price: Low to High" },
    { value: "price_high_low", label: "Price: High to Low" },
    { value: "name_a_z", label: "Name: A-Z" },
    { value: "name_z_a", label: "Name: Z-A" },
    { value: "newest", label: "Newest First" },
  ];

  if (loading) {
    return (
      <>
        <Box minH="100vh" bg="gray.50">
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
    <Box minH="100vh" bg="rgba(252, 252, 253, 1)">
      <Navbar />

      <Container maxW="8xl" py={6}>
        {/* Search Results Header */}
        <VStack spacing={6} mb={8}>
          <Flex
            w="full"
            justify="space-between"
            align="center"
            wrap="wrap"
            gap={4}
          >
            <VStack align="start" spacing={1}>
              <Text
                fontSize="xl"
                fontWeight="500"
                fontFamily={"Airbnb Cereal VF"}
              >
                {loading ? "Recherche..." : `${totalCount} Résultats trouvés`}
                {query && `à "${query}"`}
              </Text>
              {getSelectedFiltersCount() > 0 && (
                <Text fontSize="sm" color="gray.600">
                  {getSelectedFiltersCount()} filtres
                </Text>
              )}
              {availableFilters && (
                <Text
                  fontSize="xs"
                  color="gray.500"
                  fontFamily={"Airbnb Cereal VF"}
                >
                  {Object.keys(availableFilters.specifications || {}).length}{" "}
                  types de spécifications disponibles
                </Text>
              )}
            </VStack>

            <HStack spacing={4}>
              {/* Mobile Filter Button */}
              <Button
                leftIcon={<FaFilter />}
                variant="outline"
                display={{ base: "flex", lg: "none" }}
                onClick={onOpen}
                fontFamily="Bogle"
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
        <Grid
          templateColumns={{ base: "1fr", lg: "300px 1fr" }}
          gap={{ base: 6, md: 6 }}
        >
          {/* Desktop Filters */}
          <Box display={{ base: "none", lg: "block" }}>
            <FilterSidebar
              minPrice={minPrice}
              maxPrice={maxPrice}
              tempMinPrice={tempMinPrice}
              tempMaxPrice={tempMaxPrice}
              includeOutOfStock={includeOutOfStock}
              availableFilters={availableFilters}
              selectedFilters={selectedFilters}
              getSelectedFiltersCount={getSelectedFiltersCount}
              clearFilters={clearFilters}
              handleMinPriceChange={handleMinPriceChange}
              handleMaxPriceChange={handleMaxPriceChange}
              applyPriceRange={applyPriceRange}
              clearPriceRange={clearPriceRange}
              applyFilters={applyFilters}
              setIncludeOutOfStock={setIncludeOutOfStock}
              handleSpecificationChange={handleSpecificationChange}
              clearSpecificationFilter={clearSpecificationFilter}
            />
          </Box>

          {/* Products Grid */}
          <Box>
            {loading ? (
              <VStack py={20}>
                <Spinner size="xl" color="blue.500" />
                <Text>Searching products...</Text>
              </VStack>
            ) : products.length === 0 ? (
              <>
                <Center>
                  <Text fontFamily="Bogle" fontSize={"xl"}>
                    Aucun produit trouvé dans {query}.
                  </Text>
                </Center>
                <Center>
                  <Text
                    fontFamily="Bogle"
                    fontSize={"md"}
                    mt={5}
                    color="gray.600"
                  >
                    Essayez de rechercher des produits ou d’ajuster vos filtres.
                  </Text>
                </Center>
                <Center>
                  <Text
                    fontFamily="Bogle"
                    fontSize={"md"}
                    mt={5}
                    color="gray.600"
                    as="a"
                    href="/"
                  >
                    Retour à l'accueil
                  </Text>
                </Center>
              </>
            ) : (
              <>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
                  {products.map((product, idx) => (
                    <Box
                      key={product.id}
                      ref={el => (impressionRefs.current[idx] = el)}
                      data-index={idx}
                      data-impression="not-sent"
                      onMouseEnter={() => handleProductHover(product, idx)}
                    >
                      <ProductCard
                        key={product.id}
                        product={homeService.formatProductData(product)}
                      />
                    </Box>
                  ))}
                </SimpleGrid>

                {hasMore && (
                  <VStack spacing={4}>
                    <Button
                      size="sm"
                      onClick={loadMore}
                      isLoading={loadingMore}
                      loadingText="Loading more..."
                      w="auto"
                      maxW="auto"
                      borderColor="blue.500"
                      borderWidth={0}
                      color="white"
                      rounded="3px"
                      p={5}
                      _hover={{ bg: "rgb(241, 36, 36)" }}
                      bg="rgb(241, 36, 36)"
                      fontFamily={"Bogle"}
                    >
                      Afficher plus de produits
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
            <DrawerHeader>Filtrer les produits</DrawerHeader>
            <DrawerBody>
              <FilterSidebar
                isMobile={true}
                minPrice={minPrice}
                maxPrice={maxPrice}
                tempMinPrice={tempMinPrice}
                tempMaxPrice={tempMaxPrice}
                includeOutOfStock={includeOutOfStock}
                availableFilters={availableFilters}
                selectedFilters={selectedFilters}
                getSelectedFiltersCount={getSelectedFiltersCount}
                clearFilters={clearFilters}
                handleMinPriceChange={handleMinPriceChange}
                handleMaxPriceChange={handleMaxPriceChange}
                applyPriceRange={applyPriceRange}
                clearPriceRange={clearPriceRange}
                applyFilters={applyFilters}
                setIncludeOutOfStock={setIncludeOutOfStock}
                handleSpecificationChange={handleSpecificationChange}
                clearSpecificationFilter={clearSpecificationFilter}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
      <Footer />
    </Box>
  );
};

export default CustomerSearchPage;
