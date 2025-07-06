import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  useToast,
  VStack,
  HStack,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Spinner,
  Center,
  Input,
  Select,
  FormControl,
  FormLabel,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  AspectRatio,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Container,
  Skeleton,
  SkeletonText,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Divider,
  Wrap,
  WrapItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiSearch,
  FiFilter,
  FiRefreshCw,
  FiTag,
  FiTool,
  FiArrowLeft,
  FiPlus,
  FiEye,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiCalendar,
  FiBox,
  FiTruck,
  FiAward,
  FiZap,
  FiStar,
  FiGrid,
  FiList,
  FiHome,
  FiPercent,
  FiShoppingCart,
  FiCheckCircle,
  FiXCircle,
  FiCopy,
} from "react-icons/fi";
import { productService } from './services/productService';
import { handleApiError } from "../../commons/handleApiError";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";
import Loader from "../../commons/Loader";
import { formatWithTimezone, formatOptions } from "../../commons/formatOptions";
import { usePreferences } from "../administration/authContext/preferencesProvider";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);

const ProductsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentTimezone } = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    is_published: '',
    is_active: '',
    page: 1,
    limit: 12,
    sortBy: 'score',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    published: 0,
    draft: 0
  });
  const [duplicating, setDuplicating] = useState(null);

  // Color mode values
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  };

  const slideUp = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 },
  };

  const fetchProducts = useCallback(async (resetPage = false) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: resetPage ? 1 : filters.page
      };

      const response = await productService.getAllProducts(params);
      
      if (response.data?.status === 'success') {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
        
        // Calculate stats
        const allProducts = response.data.data.products;
        setStats({
          total: pagination?.total_items || allProducts.length,
          active: allProducts.filter(p => p.is_active).length,
          published: allProducts.filter(p => p.is_published).length,
          draft: allProducts.filter(p => !p.is_published).length,
        });
        
        if (resetPage) {
          setFilters(prev => ({ ...prev, page: 1 }));
        }
      }
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setLoading(false);
    }
  }, [filters, toast, pagination?.total_items]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    fetchProducts(true);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category_id: '',
      is_published: '',
      is_active: '',
      page: 1,
      limit: viewMode === 'grid' ? 12 : 10,
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleViewProduct = (productId) => {
    navigate(`/products-console/${productId}`);
  };

  const handleEditProduct = (productId) => {
    navigate(`/products-console/${productId}/edit`);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      toast({
        title: "Product deleted",
        description: `${selectedProduct.title} has been deleted successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      fetchProducts();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleDuplicateProduct = async (product) => {
    if (!window.confirm(`Are you sure you want to duplicate "${product.title}"? A copy will be created with " - Duplicate1" added to the name.`)) {
      return;
    }

    setDuplicating(product.id);
    try {
      const response = await productService.duplicateProduct(product.id);
      
      if (response.data?.status === 'success') {
        toast({
          title: "Product Duplicated",
          description: `"${product.title}" has been duplicated successfully as "${response.data.data.new_product_title}"`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Refresh the product list
        fetchProducts(true);

        // Optionally navigate to the new product
        const shouldNavigate = window.confirm('Would you like to view the duplicated product?');
        if (shouldNavigate) {
          navigate(`/products-console/${response.data.data.new_product_id}`);
        }
      }
    } catch (error) {
      console.error('Error duplicating product:', error);
      toast({
        title: "Duplication Failed",
        description: error.message || "Failed to duplicate product. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setDuplicating(null);
    }
  };

  const getStatusColor = (product) => {
    if (!product.is_active) return 'red';
    if (!product.is_published) return 'yellow';
    return 'green';
  };

  const getStatusText = (product) => {
    if (!product.is_active) return 'Inactive';
    if (!product.is_published) return 'Draft';
    return 'Published';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const calculateSavings = (regularPrice, finalPrice) => {
    return (regularPrice - finalPrice).toFixed(2);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setFilters(prev => ({
      ...prev,
      limit: mode === 'grid' ? 12 : 10,
      page: 1
    }));
  };

  if (loading && products.length === 0) {
    return <Loader />;
  }

  const ProductGridItem = ({ product, index }) => (
    <MotionCard
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="12px"
      overflow="hidden"
      cursor="pointer"
      onClick={() => handleViewProduct(product.id)}
      _hover={{ 
        transform: "translateY(-2px)", 
        boxShadow: "lg",
        borderColor: "blue.300"
      }}
      position="relative"
      h="100%"
    >
      {/* Product Image */}
      <Box position="relative">
        <AspectRatio ratio={1}>
          <Image
            src={product.main_image_url}
            alt={product.title}
            objectFit="cover"
            fallback={
              <Center bg="gray.100">
                <Icon as={FiPackage} fontSize="2xl" color="gray.400" />
              </Center>
            }
          />
        </AspectRatio>
        
        {/* Status Badge */}
        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme={getStatusColor(product)}
          variant="solid"
          borderRadius="md"
          fontSize="10px"
          fontWeight="600"
          px={2}
          py={1}
        >
          {getStatusText(product)}
        </Badge>

        {/* Discount Badge */}
        {product.is_discounted && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="red"
            variant="solid"
            borderRadius="md"
            fontSize="10px"
            fontWeight="700"
            px={2}
            py={1}
          >
            -{product.discount_percentage_nett}%
          </Badge>
        )}

        {/* Quick Actions */}
        <Box
          position="absolute"
          bottom={2}
          right={2}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <HStack spacing={1}>
            <IconButton
              icon={<FiEye />}
              size="xs"
              colorScheme="blue"
              variant="solid"
              borderRadius="md"
              onClick={(e) => {
                e.stopPropagation();
                handleViewProduct(product.id);
              }}
              aria-label="View"
            />
            <IconButton
              icon={<FiEdit />}
              size="xs"
              colorScheme="green"
              variant="solid"
              borderRadius="md"
              onClick={(e) => {
                e.stopPropagation();
                handleEditProduct(product.id);
              }}
              aria-label="Edit"
            />
            <IconButton
              icon={<FiCopy />}
              size="xs"
              colorScheme="purple"
              variant="solid"
              borderRadius="md"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateProduct(product);
              }}
              aria-label="Duplicate"
              isLoading={duplicating === product.id}
            />
          </HStack>
        </Box>
      </Box>

      <CardBody p={3}>
        <VStack align="start" spacing={2} h="100%">
          {/* Title and SKU */}
          <Box w="100%">
            <Text fontWeight="600" fontSize="sm" color="gray.900" noOfLines={2} lineHeight="1.3">
              {product.title}
            </Text>
            <HStack justify="space-between" align="center" mt={1}>
              <Text fontSize="10px" color="gray.500" fontFamily="mono" fontWeight="500">
                {product.sku}
              </Text>
              {product.is_available_on_stock ? (
                <HStack spacing={1}>
                  <Icon as={FiCheckCircle} color="green.500" fontSize="10px" />
                  <Text fontSize="10px" color="green.600" fontWeight="500">In Stock</Text>
                </HStack>
              ) : (
                <HStack spacing={1}>
                  <Icon as={FiXCircle} color="red.500" fontSize="10px" />
                  <Text fontSize="10px" color="red.600" fontWeight="500">Out</Text>
                </HStack>
              )}
            </HStack>
          </Box>

          {/* Enhanced Pricing */}
          <Box w="100%" bg="blue.50" p={2} borderRadius="md" border="1px" borderColor="blue.100">
            <VStack align="start" spacing={1}>
              <HStack justify="space-between" w="100%" align="baseline">
                <VStack align="start" spacing={0}>
                  <Text fontSize="md" fontWeight="800" color="blue.600">
                    {formatPrice(product.final_price_nett)}
                  </Text>
                  <Text fontSize="9px" color="blue.500" fontWeight="500">
                    Final Net
                  </Text>
                </VStack>
                
                {product.is_discounted && (
                  <VStack align="end" spacing={0}>
                    <Text fontSize="11px" color="gray.500" textDecoration="line-through" fontWeight="500">
                      {formatPrice(product.regular_price_nett)}
                    </Text>
                    <Text fontSize="9px" color="green.600" fontWeight="600">
                      Save ${calculateSavings(product.regular_price_nett, product.final_price_nett)}
                    </Text>
                  </VStack>
                )}
              </HStack>
              
              {/* Gross Price Info */}
              <HStack justify="space-between" w="100%" fontSize="9px" color="blue.600">
                <Text fontWeight="500">Gross: {formatPrice(product.final_price_gross)}</Text>
                {product.tax?.rate && (
                  <Text fontWeight="500">Tax: {product.tax.rate}%</Text>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Features */}
          <Box w="100%">
            <Wrap spacing={1}>
              {product.shipping_free && (
                <WrapItem>
                  <Badge colorScheme="green" variant="outline" fontSize="9px" px={1} py={0.5} borderRadius="sm">
                    <Icon as={FiTruck} mr={0.5} />
                    Free
                  </Badge>
                </WrapItem>
              )}
              {product.mark_as_featured && (
                <WrapItem>
                  <Badge colorScheme="purple" variant="outline" fontSize="9px" px={1} py={0.5} borderRadius="sm">
                    <Icon as={FiAward} mr={0.5} />
                    Featured
                  </Badge>
                </WrapItem>
              )}
              {product.mark_as_new && (
                <WrapItem>
                  <Badge colorScheme="orange" variant="outline" fontSize="9px" px={1} py={0.5} borderRadius="sm">
                    <Icon as={FiZap} mr={0.5} />
                    New
                  </Badge>
                </WrapItem>
              )}
              {product.mark_as_top_seller && (
                <WrapItem>
                  <Badge colorScheme="red" variant="outline" fontSize="9px" px={1} py={0.5} borderRadius="sm">
                    <Icon as={FiStar} mr={0.5} />
                    Bestseller
                  </Badge>
                </WrapItem>
              )}
              {product.has_services && (
                <WrapItem>
                  <Badge colorScheme="blue" variant="outline" fontSize="9px" px={1} py={0.5} borderRadius="sm">
                    <Icon as={FiTool} mr={0.5} />
                    Services
                  </Badge>
                </WrapItem>
              )}
            </Wrap>
          </Box>

          {/* Created Date */}
          <Text fontSize="9px" color="gray.400" w="100%" mt="auto">
            {formatWithTimezone(product.created_at, formatOptions.SHORT_DATE, currentTimezone)}
          </Text>
        </VStack>
      </CardBody>
    </MotionCard>
  );

  return (
    <Box minH="100vh" bg={bgColor}>
      <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
      <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <Box ml={{ base: 0, md: 60 }}>
        <Container maxW="8xl" px={{ base: 3, md: 6 }} py={6}>
          <MotionBox {...fadeIn}>
            {/* Clean Breadcrumb */}
            <HStack spacing={1} mb={4} fontSize="xs" color="gray.500">
              <Icon as={FiHome} fontSize="xs" />
              <Text cursor="pointer" onClick={() => navigate("/")} _hover={{ color: "blue.500" }}>
                Home
              </Text>
              <Text>•</Text>
              <Text color="blue.500" fontWeight="600">Products</Text>
            </HStack>

            {/* Clean Header */}
            <Flex justify="space-between" align="center" mb={6}>
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Icon as={FiPackage} fontSize="lg" color="blue.500" />
                  <Heading size="lg" color="gray.900" fontWeight="700">
                    Products
                  </Heading>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                  Manage your product inventory
                </Text>
              </VStack>
              <HStack spacing={2}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  colorScheme="gray"
                  size="sm"
                  fontSize="xs"
                >
                  Dashboard
                </Button>
                <Button
                  leftIcon={<FiPlus />}
                  onClick={() => navigate('/create-product')}
                  colorScheme="blue"
                  size="sm"
                  fontSize="xs"
                  _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
                  transition="all 0.2s"
                >
                  Add Product
                </Button>
              </HStack>
            </Flex>

            {/* Compact Stats Overview */}
            <MotionCard
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="12px"
              mb={6}
              {...slideUp}
            >
              <CardBody p={4}>
                <StatGroup>
                  <Stat textAlign="center">
                    <StatLabel color="gray.600" fontWeight="600" fontSize="xs">
                      <Icon as={FiPackage} mr={1} fontSize="xs" />
                      Total
                    </StatLabel>
                    <StatNumber fontSize="xl" fontWeight="800" color="gray.900">
                      {pagination?.total_items || 0}
                    </StatNumber>
                  </Stat>
                  
                  <Stat textAlign="center">
                    <StatLabel color="gray.600" fontWeight="600" fontSize="xs">
                      <Icon as={FiCheckCircle} mr={1} fontSize="xs" />
                      Active
                    </StatLabel>
                    <StatNumber fontSize="xl" fontWeight="800" color="green.500">
                      {stats.active}
                    </StatNumber>
                  </Stat>
                  
                  <Stat textAlign="center">
                    <StatLabel color="gray.600" fontWeight="600" fontSize="xs">
                      <Icon as={FiEye} mr={1} fontSize="xs" />
                      Published
                    </StatLabel>
                    <StatNumber fontSize="xl" fontWeight="800" color="blue.500">
                      {stats.published}
                    </StatNumber>
                  </Stat>
                  
                  <Stat textAlign="center">
                    <StatLabel color="gray.600" fontWeight="600" fontSize="xs">
                      <Icon as={FiEdit} mr={1} fontSize="xs" />
                      Drafts
                    </StatLabel>
                    <StatNumber fontSize="xl" fontWeight="800" color="yellow.500">
                      {stats.draft}
                    </StatNumber>
                  </Stat>
                </StatGroup>
              </CardBody>
            </MotionCard>

            {/* Compact Filters Section */}
            <MotionCard
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="12px"
              mb={6}
              {...slideUp}
              transition={{ delay: 0.1 }}
            >
              <CardHeader bg="gray.50" py={3} borderTopRadius="12px">
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiFilter} color="blue.500" fontSize="sm" />
                    <Heading size="sm" color="gray.900" fontWeight="600">
                      Filters
                    </Heading>
                  </HStack>
                  <HStack spacing={1}>
                    <Tooltip label="Table View">
                      <IconButton
                        icon={<FiList />}
                        size="xs"
                        variant={viewMode === 'table' ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => handleViewModeChange('table')}
                        aria-label="Table view"
                      />
                    </Tooltip>
                    <Tooltip label="Grid View">
                      <IconButton
                        icon={<FiGrid />}
                        size="xs"
                        variant={viewMode === 'grid' ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => handleViewModeChange('grid')}
                        aria-label="Grid view"
                      />
                    </Tooltip>
                    <IconButton
                      icon={<FiRefreshCw />}
                      size="xs"
                      onClick={() => fetchProducts()}
                      isLoading={loading}
                      aria-label="Refresh"
                      title="Refresh products"
                    />
                  </HStack>
                </HStack>
              </CardHeader>
              <CardBody p={4}>
                <VStack spacing={4}>
                  {/* Compact Search Bar */}
                  <FormControl>
                    <HStack>
                      <Box position="relative" flex={1}>
                        <Input
                          value={filters.search}
                          onChange={(e) => handleFilterChange('search', e.target.value)}
                          placeholder="Search products..."
                          size="sm"
                          pl={8}
                          bg="gray.50"
                          border="1px"
                          borderColor="gray.200"
                          _hover={{ borderColor: "gray.300" }}
                          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px #3182ce" }}
                          borderRadius="md"
                          fontSize="xs"
                        />
                        <Icon 
                          as={FiSearch} 
                          position="absolute"
                          left={2}
                          top="50%"
                          transform="translateY(-50%)"
                          color="gray.400"
                          fontSize="sm"
                        />
                      </Box>
                      <Button
                        onClick={applyFilters}
                        colorScheme="blue"
                        size="sm"
                        px={4}
                        isLoading={loading}
                        borderRadius="md"
                        fontSize="xs"
                      >
                        Search
                      </Button>
                    </HStack>
                  </FormControl>

                  {/* Compact Filter Controls */}
                  <HStack spacing={4} w="100%" flexWrap="wrap">
                    <FormControl maxW="140px">
                      <FormLabel color="gray.700" fontWeight="600" fontSize="xs">Status</FormLabel>
                      <Select
                        value={filters.is_published}
                        onChange={(e) => handleFilterChange('is_published', e.target.value)}
                        placeholder="All"
                        bg="gray.50"
                        borderRadius="md"
                        size="sm"
                        fontSize="xs"
                      >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                      </Select>
                    </FormControl>

                    <FormControl maxW="140px">
                      <FormLabel color="gray.700" fontWeight="600" fontSize="xs">Active</FormLabel>
                      <Select
                        value={filters.is_active}
                        onChange={(e) => handleFilterChange('is_active', e.target.value)}
                        placeholder="All"
                        bg="gray.50"
                        borderRadius="md"
                        size="sm"
                        fontSize="xs"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Select>
                    </FormControl>

                    <FormControl maxW="100px">
                      <FormLabel color="gray.700" fontWeight="600" fontSize="xs">Per Page</FormLabel>
                      <Select
                        value={filters.limit}
                        onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                        bg="gray.50"
                        borderRadius="md"
                        size="sm"
                        fontSize="xs"
                      >
                        <option value={viewMode === 'grid' ? 12 : 10}>{viewMode === 'grid' ? 12 : 10}</option>
                        <option value={viewMode === 'grid' ? 24 : 25}>{viewMode === 'grid' ? 24 : 25}</option>
                        <option value={viewMode === 'grid' ? 48 : 50}>{viewMode === 'grid' ? 48 : 50}</option>
                      </Select>
                    </FormControl>

                    <Button
                      onClick={resetFilters}
                      variant="outline"
                      colorScheme="gray"
                      borderRadius="md"
                      size="sm"
                      fontSize="xs"
                      alignSelf="end"
                    >
                      Reset
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Products Display */}
            <MotionCard
              bg={cardBg}
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="12px"
              overflow="hidden"
              {...slideUp}
              transition={{ delay: 0.2 }}
            >
              <CardHeader bg="gray.50" py={3} borderTopRadius="12px">
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Icon as={FiPackage} color="blue.500" fontSize="sm" />
                    <Text fontWeight="700" color="gray.900" fontSize="sm">
                      Products ({pagination?.total_items || 0})
                    </Text>
                  </HStack>
                  {pagination && (
                    <Text fontSize="xs" color="gray.600" fontWeight="500">
                      Page {pagination.current_page} of {pagination.total_pages}
                    </Text>
                  )}
                </HStack>
              </CardHeader>

              <CardBody p={4}>
                {loading ? (
                  <VStack spacing={3}>
                    {[...Array(3)].map((_, i) => (
                      <Box key={i} w="100%">
                        <Skeleton height="80px" borderRadius="md" />
                        <SkeletonText mt={2} noOfLines={2} spacing={2} />
                      </Box>
                    ))}
                  </VStack>
                ) : products.length > 0 ? (
                  viewMode === 'grid' ? (
                    <Box>
                      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing={4}>
                        {products.map((product, index) => (
                          <ProductGridItem key={product.id} product={product} index={index} />
                        ))}
                      </SimpleGrid>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr bg="gray.50">
                            <Th width="60px" borderColor={borderColor} fontSize="xs">Image</Th>
                            <Th borderColor={borderColor} fontSize="xs">Product</Th>
                            <Th borderColor={borderColor} fontSize="xs">SKU</Th>
                            <Th borderColor={borderColor} fontSize="xs">Pricing</Th>
                            <Th borderColor={borderColor} fontSize="xs">Status</Th>
                            <Th borderColor={borderColor} fontSize="xs">Features</Th>
                            <Th borderColor={borderColor} fontSize="xs">Created</Th>
                            <Th width="80px" borderColor={borderColor} fontSize="xs">Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {products.map((product, index) => (
                            <Tr
                              key={product.id}
                              _hover={{ bg: "gray.50" }}
                              cursor="pointer"
                              onClick={() => handleViewProduct(product.id)}
                              transition="background-color 0.2s"
                            >
                              <Td borderColor={borderColor} p={2}>
                                <AspectRatio ratio={1} w="40px" h="40px">
                                  <Image
                                    src={product.main_image_url}
                                    alt={product.title}
                                    borderRadius="md"
                                    objectFit="cover"
                                    fallback={
                                      <Center bg="gray.100" borderRadius="md">
                                        <Icon as={FiPackage} color="gray.400" fontSize="sm" />
                                      </Center>
                                    }
                                  />
                                </AspectRatio>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="600" color="gray.900" noOfLines={1} fontSize="xs">
                                    {product.title}
                                  </Text>
                                  {/* {product.short_description && (
                                    <Text fontSize="10px" color="gray.600" noOfLines={1}>
                                      {product.short_description}
                                    </Text>
                                  )} */}
                                </VStack>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <Text fontSize="10px" fontFamily="mono" fontWeight="600">
                                  {product.sku}
                                </Text>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <VStack align="start" spacing={1}>
                                  <HStack>
                                    <Text fontWeight="700" color="blue.600" fontSize="xs">
                                      {formatPrice(product.final_price_nett)}
                                    </Text>
                                    {product.is_discounted && (
                                      <Badge colorScheme="red" variant="solid" fontSize="9px">
                                        -{product.discount_percentage_nett}%
                                      </Badge>
                                    )}
                                  </HStack>
                                  {product.is_discounted && (
                                    <Text fontSize="9px" color="gray.500" textDecoration="line-through">
                                      {formatPrice(product.regular_price_nett)}
                                    </Text>
                                  )}
                                </VStack>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <VStack align="start" spacing={1}>
                                  <Badge
                                    colorScheme={getStatusColor(product)}
                                    variant="solid"
                                    fontSize="9px"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                  >
                                    {getStatusText(product)}
                                  </Badge>
                                  {product.is_available_on_stock ? (
                                    <HStack spacing={1}>
                                      <Icon as={FiCheckCircle} color="green.500" fontSize="9px" />
                                      <Text fontSize="9px" color="green.600" fontWeight="500">Stock</Text>
                                    </HStack>
                                  ) : (
                                    <HStack spacing={1}>
                                      <Icon as={FiXCircle} color="red.500" fontSize="9px" />
                                      <Text fontSize="9px" color="red.600" fontWeight="500">Out</Text>
                                    </HStack>
                                  )}
                                </VStack>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <Wrap spacing={1}>
                                  {product.shipping_free && (
                                    <WrapItem>
                                      <Tooltip label="Free Shipping">
                                        <Badge colorScheme="green" variant="outline" fontSize="8px" p={1}>
                                          <Icon as={FiTruck} />
                                        </Badge>
                                      </Tooltip>
                                    </WrapItem>
                                  )}
                                  {product.mark_as_featured && (
                                    <WrapItem>
                                      <Tooltip label="Featured">
                                        <Badge colorScheme="purple" variant="outline" fontSize="8px" p={1}>
                                          <Icon as={FiAward} />
                                        </Badge>
                                      </Tooltip>
                                    </WrapItem>
                                  )}
                                  {product.mark_as_new && (
                                    <WrapItem>
                                      <Tooltip label="New">
                                        <Badge colorScheme="orange" variant="outline" fontSize="8px" p={1}>
                                          <Icon as={FiZap} />
                                        </Badge>
                                      </Tooltip>
                                    </WrapItem>
                                  )}
                                  {product.mark_as_top_seller && (
                                    <WrapItem>
                                      <Tooltip label="Best Seller">
                                        <Badge colorScheme="red" variant="outline" fontSize="8px" p={1}>
                                          <Icon as={FiStar} />
                                        </Badge>
                                      </Tooltip>
                                    </WrapItem>
                                  )}
                                  {product.has_services && (
                                    <WrapItem>
                                      <Tooltip label="Has Services">
                                        <Badge colorScheme="blue" variant="outline" fontSize="8px" p={1}>
                                          <Icon as={FiTool} />
                                        </Badge>
                                      </Tooltip>
                                    </WrapItem>
                                  )}
                                </Wrap>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <Text fontSize="10px" color="gray.600">
                                  {formatWithTimezone(product.created_at, formatOptions.SHORT_DATE, currentTimezone)}
                                </Text>
                              </Td>
                              <Td borderColor={borderColor} p={2}>
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    icon={<FiMoreVertical />}
                                    size="xs"
                                    variant="ghost"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <MenuList fontSize="xs">
                                    <MenuItem
                                      icon={<FiEye />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewProduct(product.id);
                                      }}
                                      fontSize="xs"
                                    >
                                      View
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiEdit />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditProduct(product.id);
                                      }}
                                      fontSize="xs"
                                    >
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiCopy />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateProduct(product);
                                      }}
                                      fontSize="xs"
                                      isDisabled={duplicating === product.id}
                                    >
                                      {duplicating === product.id ? 'Duplicating...' : 'Duplicate'}
                                    </MenuItem>
                                    {/* <MenuItem
                                      icon={<FiTrash2 />}
                                      color="red.600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteProduct(product);
                                      }}
                                      fontSize="xs"
                                    >
                                      Delete
                                    </MenuItem> */}
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  )
                ) : (
                  <Center py={12}>
                    <VStack spacing={4}>
                      <Icon as={FiPackage} fontSize="4xl" color="gray.300" />
                      <VStack spacing={1}>
                        <Text color="gray.600" fontSize="md" fontWeight="600">
                          No products found
                        </Text>
                        <Text color="gray.500" fontSize="xs" textAlign="center">
                          {Object.values(filters).some(v => v !== '' && v !== 1 && v !== 10 && v !== 12) 
                            ? "Try adjusting your filters"
                            : "Create your first product"
                          }
                        </Text>
                      </VStack>
                      <Button
                        leftIcon={<FiPlus />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => navigate('/create-product')}
                        fontSize="xs"
                      >
                        Create Product
                      </Button>
                    </VStack>
                  </Center>
                )}

                {/* Compact Pagination */}
                {pagination && pagination.total_pages > 1 && (
                  <Box mt={6}>
                    <Divider mb={4} />
                    <HStack justify="space-between" align="center">
                      <Text fontSize="xs" color="gray.600" fontWeight="500">
                        {((pagination.current_page - 1) * filters.limit) + 1}-{Math.min(pagination.current_page * filters.limit, pagination.total_items)} of {pagination.total_items}
                      </Text>
                      
                      <HStack spacing={1}>
                        <IconButton
                          icon={<FiChevronLeft />}
                          size="xs"
                          onClick={() => handlePageChange(pagination.current_page - 1)}
                          isDisabled={!pagination.has_prev}
                          aria-label="Previous"
                          borderRadius="md"
                        />
                        
                        <HStack spacing={0.5}>
                          {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                            let pageNum;
                            if (pagination.total_pages <= 5) {
                              pageNum = i + 1;
                            } else if (pagination.current_page <= 3) {
                              pageNum = i + 1;
                            } else if (pagination.current_page >= pagination.total_pages - 2) {
                              pageNum = pagination.total_pages - 4 + i;
                            } else {
                              pageNum = pagination.current_page - 2 + i;
                            }
                            
                            return (
                              <Button
                                key={pageNum}
                                size="xs"
                                variant={pageNum === pagination.current_page ? "solid" : "ghost"}
                                colorScheme={pageNum === pagination.current_page ? "blue" : "gray"}
                                onClick={() => handlePageChange(pageNum)}
                                borderRadius="md"
                                fontWeight="600"
                                fontSize="xs"
                                minW="24px"
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                        </HStack>
                        
                        <IconButton
                          icon={<FiChevronRight />}
                          size="xs"
                          onClick={() => handlePageChange(pagination.current_page + 1)}
                          isDisabled={!pagination.has_next}
                          aria-label="Next"
                          borderRadius="md"
                        />
                      </HStack>
                    </HStack>
                  </Box>
                )}
              </CardBody>
            </MotionCard>
          </MotionBox>
        </Container>
      </Box>

      {/* Clean Delete Confirmation Dialog */}
      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="12px" maxW="400px">
            <AlertDialogHeader fontSize="md" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody fontSize="sm">
              Are you sure you want to delete <strong>{selectedProduct?.title}</strong>? 
              This cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onDeleteClose} borderRadius="md" size="sm" fontSize="xs">
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={2} borderRadius="md" size="sm" fontSize="xs">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default ProductsPage;