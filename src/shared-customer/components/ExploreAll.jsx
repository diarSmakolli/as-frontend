import React, { useEffect, useRef, useCallback } from "react";
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
  Skeleton,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";
import { FaHeart, FaBox, FaChevronUp, FaHome } from "react-icons/fa";
import { useExploreAllProducts } from "../../features/home/hooks/useExploreAllProducts";
import { useNavigate } from "react-router-dom";

const ExploreAll = ({ initialFilters = {} }) => {
  const bottomRef = useRef();

  const { products, loading, error, hasMore, totalCount, loadMore, filters } =
    useExploreAllProducts({
      limit: 30,
      sort_by: "created_at",
      sort_order: "DESC",
      ...initialFilters,
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
      price: apiProduct.pricing.final_price_gross,
      originalPrice: apiProduct.pricing.is_discounted
        ? apiProduct.pricing.regular_price_gross
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
      behavior: "smooth",
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
        rootMargin: "100px",
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  if (error) {
    navigate('/')
  }

  if (products.length === 0) {
    return (
      <>
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
            <VStack spacing={2}>
              <Text fontSize="xl" fontWeight="500" color="gray.600" fontFamily='Bogle'>
                Aucun produit à explorer disponible
              </Text>
              <Text fontSize="sm" color="gray.400" fontFamily='Bogle'>
                Revenez bientôt ou essayez d'ajuster vos filtres
              </Text>
            </VStack>
          </VStack>
        </Box>
      </>
    );
  }

  if (!loading && products.length === 0) {
    return (
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
            <Text
              fontSize="lg"
              fontWeight="medium"
              color="gray.600"
              fontFamily="Bogle"
            >
              Aucun produit trouvé pour explorer.
            </Text>
            <Text
              fontSize="sm"
              color="gray.400"
              textAlign="center"
              fontFamily="Bogle"
            >
              Essayez d'ajuster votre recherche ou vos filtres
            </Text>
          </VStack>
        </VStack>
      </Center>
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
                        <Icon as={FaBox} fontSize="2xl" color="gray.400" />
                        <Text fontSize="xs" color="gray.500" textAlign="center">
                          No Image
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
                    <HStack spacing={2} w="full" align="center" flexWrap="wrap">
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
                                ((product.originalPrice - product.price) /
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
                      _hover={{ bg: "transparent", borderWidth: "2px" }}
                      _active={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      px={10}
                      variant="outline"
                      borderColor="navy"
                      rounded="full"
                      borderWidth="1px"
                    >
                      Add
                    </Button>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Loading indicator */}
      {loading && (
        <SimpleGrid columns={columns} spacing={4} mb={8}>
          {[...Array(12)].map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              bg="white"
              borderRadius="12px"
              overflow="hidden"
              shadow="sm"
              border="1px"
              borderColor="gray.100"
            >
              {/* Image Skeleton */}
              <Box position="relative">
                <Skeleton height="200px" />

                {/* Badge Skeletons */}
                <Box position="absolute" top="2" left="2">
                  <Skeleton height="20px" width="50px" borderRadius="md" />
                </Box>

                <Box position="absolute" top="2" right="12">
                  <Skeleton height="20px" width="60px" borderRadius="md" />
                </Box>

                {/* Heart Icon Skeleton */}
                <Box position="absolute" top="2" right="2">
                  <SkeletonCircle size="32px" />
                </Box>
              </Box>

              {/* Content Skeleton */}
              <CardBody p={3}>
                <VStack align="start" spacing={2}>
                  {/* Title Skeleton */}
                  <VStack align="start" spacing={1} w="full">
                    <Skeleton height="16px" width="100%" />
                    <Skeleton height="16px" width="80%" />
                  </VStack>

                  {/* Price Section Skeleton */}
                  <VStack align="start" spacing={1} w="full">
                    <HStack spacing={2} w="full" align="center">
                      <Skeleton height="20px" width="70px" />
                      <Skeleton height="16px" width="60px" />
                    </HStack>

                    {/* Company Skeleton */}
                    <Skeleton height="12px" width="60%" />

                    {/* Category Skeleton */}
                    <Skeleton height="12px" width="50%" />

                    {/* Badges Skeleton */}
                    <HStack spacing={1} flexWrap="wrap">
                      <Skeleton height="16px" width="60px" borderRadius="md" />
                      <Skeleton height="16px" width="40px" borderRadius="md" />
                    </HStack>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* End of results */}
      {!hasMore && products.length > 0 && (
        <Box py={8}>
          <VStack spacing={4}>
            <Text color="gray.500" textAlign="center" fontSize="lg" fontFamily='Bogle'>
              Tu as atteint la fin
            </Text>
            <Text fontSize="sm" color="gray.400" textAlign="center" fontFamily='Bogle'>
              Affichage de tous les {totalCount} produits
            </Text>
            <Button
              leftIcon={<Icon as={FaChevronUp} />}
              variant="outline"
              colorScheme="gray"
              size="sm"
              onClick={scrollToTop}
            >
              Retour en haut
            </Button>
          </VStack>
        </Box>
      )}      

      {/* Scroll trigger element - invisible div that triggers loading */}
      <div ref={bottomRef} style={{ height: "1px", visibility: "hidden" }} />
    </Box>
  );
};

export default ExploreAll;
