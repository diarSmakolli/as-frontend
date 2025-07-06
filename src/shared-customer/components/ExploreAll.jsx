import React, { useEffect, useRef, useCallback } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  Icon,
  Spinner,
  Button,
  Center,
  Alert,
  AlertIcon,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaHeart,
  FaBox,
  FaChevronUp,
} from 'react-icons/fa';
import { useExploreAllProducts } from '../../features/home/hooks/useExploreAllProducts';
import { useNavigate } from 'react-router-dom';

const ExploreAll = ({ initialFilters = {} }) => {
  const bottomRef = useRef();
  
  const {
    products,
    loading,
    error,
    hasMore,
    totalCount,
    loadMore,
    filters,
  } = useExploreAllProducts({
    limit: 30,
    sort_by: "created_at",
    sort_order: "DESC",
    ...initialFilters
  });

  const columns = useBreakpointValue({
    base: 2,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    "2xl": 6,
  });

  const navigate = useNavigate();

  const transformProductData = (apiProduct) => {
    return {
      id: apiProduct.id,
      slug: apiProduct.slug,
      title: apiProduct.title,
      image: apiProduct.main_image_url,
      price: apiProduct.pricing.final_price_nett,
      originalPrice: apiProduct.pricing.is_discounted 
        ? apiProduct.pricing.regular_price_nett 
        : null,
      discountPercentage: apiProduct.pricing.discount_percentage,
      tag: apiProduct.badges.is_new 
        ? "NEW" 
        : apiProduct.badges.is_featured 
        ? "FEATURED" 
        : apiProduct.badges.is_on_sale 
        ? "SALE" 
        : null,
      badges: apiProduct.badges,
      category: apiProduct.category,
      company: apiProduct.company,
      is_recently_added: apiProduct.is_recently_added,
    };
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleProductClick = (slug) => {
    return () => navigate(`/product/${slug}`);
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        {error}
        <Button 
          ml={4} 
          size="sm" 
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box position="relative" minH="400px">
      {/* Products Grid */}
      <SimpleGrid columns={columns} spacing={4} mb={8}>
        {products.map((apiProduct, index) => {
          const product = transformProductData(apiProduct);
          const productId = `explore-${index}-${product.id}`;

          return (
            <Card
              key={productId}
              bg="white"
              borderRadius="12px"
              overflow="hidden"
              shadow="sm"
              _hover={{ 
                shadow: "md", 
                transform: "translateY(-2px)" 
              }}
              transition="all 0.2s"
              cursor="pointer"
              border="1px"
              borderColor="gray.100"
              onClick={handleProductClick(product.slug)}
            >
              <Box position="relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  w="full"
                  h="200px"
                  objectFit="cover"
                  fallback={
                    <Box
                      w="full"
                      h="200px"
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

                {/* Top Badge with AS Solutions color */}
                {product.tag && (
                  <Badge
                    position="absolute"
                    top="2"
                    left="2"
                    bg={product.badges.is_new ? "green.500" : "rgb(239,48,84)"}
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

                {/* Discount Badge */}
                {product.discountPercentage > 0 && (
                  <Badge
                    position="absolute"
                    top="2"
                    right="12"
                    bg="red.500"
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    px="2"
                    py="1"
                    borderRadius="md"
                  >
                    -{Math.round(product.discountPercentage)}% OFF
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

                      {product.originalPrice && (
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
                        by {product.company.business_name || product.company.market_name}
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

                    {/* Badges */}
                    <HStack spacing={1} flexWrap="wrap">
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

                      {product.is_recently_added && (
                        <Badge
                          size="sm"
                          colorScheme="purple"
                          variant="subtle"
                          fontSize="2xs"
                        >
                          Recent
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Loading indicator */}
      {loading && (
        <Center py={8}>
          <VStack spacing={4}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="rgb(239,48,84)"
              size="xl"
            />
            <Text color="gray.600">Loading more products...</Text>
            <Text fontSize="sm" color="gray.400">
              {products.length} of {totalCount} products loaded
            </Text>
          </VStack>
        </Center>
      )}

      {/* End of results */}
      {!hasMore && products.length > 0 && (
        <Box py={8}>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center" fontSize="lg">
              🎉 You've reached the end!
            </Text>
            <Text fontSize="sm" color="gray.400" textAlign="center">
              Showing all {totalCount} products
            </Text>
            <Button
              leftIcon={<Icon as={FaChevronUp} />}
              variant="outline"
              colorScheme="gray"
              size="sm"
              onClick={scrollToTop}
            >
              Back to top
            </Button>
          </VStack>
        </Box>
      )}

      {/* Empty state */}
      {!loading && !products.length === 0 && (
        <Center py={16}>
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
              <Text fontSize="lg" fontWeight="medium" color="gray.600">
                No products found for exploring.
              </Text>
              <Text fontSize="sm" color="gray.400" textAlign="center">
                Try adjusting your search or filters
              </Text>
            </VStack>
          </VStack>
        </Center>
     )}

      {/* Scroll trigger element - invisible div that triggers loading */}
      <div ref={bottomRef} style={{ height: '1px', visibility: 'hidden' }} />
    </Box>
  );
};

export default ExploreAll;