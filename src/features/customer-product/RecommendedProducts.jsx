import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
  Image,
  VStack,
  HStack,
  Badge,
  Button,
  Skeleton,
  useColorModeValue,
  Flex,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiStar,
  FiTruck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { homeService } from "../home/services/homeService";

const RecommendedProducts = ({
  productSlug,
  title = "Recommended for you",
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Responsive card width
  const cardWidth = useBreakpointValue({
    base: "280px",
    sm: "300px",
    md: "300px",
  });

  useEffect(() => {
    if (productSlug) {
      fetchRecommendations();
    }
  }, [productSlug]);

  useEffect(() => {
    checkScrollButtons();
  }, [recommendations]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await homeService.getRecommendedProducts(productSlug, {
        limit: 12, // Increased for scrolling
        exclude_out_of_stock: true,
      });

      if (response.status === "success") {
        setRecommendations(response.data.recommendations);
      } else {
        setError("Failed to load recommendations");
      }
    } catch (err) {
      setError("Unable to load recommended products");
    } finally {
      setLoading(false);
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = parseFloat(cardWidth) + 24; // card width + gap
      const currentScrollLeft = scrollContainerRef.current.scrollLeft;

      scrollContainerRef.current.scrollTo({
        left:
          direction === "left"
            ? currentScrollLeft - scrollAmount
            : currentScrollLeft + scrollAmount,
        behavior: "smooth",
      });

      // Update scroll buttons after animation
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const renderProductCard = (product, index) => (
    <Card
      key={product.id}
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      cursor="pointer"
      rounded="xl"
      shadow="none"
      transition="all 0.3s ease"
      minW={cardWidth}
      maxW={cardWidth}
      flexShrink={0}
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "none",
        borderColor: "navy.200",
      }}
      onClick={() => handleProductClick(product.slug)}
    >
      <Box position="relative">
        <Image
          src={product.main_image_url}
          alt={product.title}
          objectFit="cover"
          w="100%"
          h="200px"
          fallback={
            <Box
              w="100%"
              h="200px"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400" fontSize="sm">
                No Image
              </Text>
            </Box>
          }
        />

        {/* Badges */}
        <Box position="absolute" top={2} left={2} zIndex={1}>
          <VStack spacing={1} align="flex-start">
            {product.badges?.is_on_sale && (
              <Badge
                colorScheme="red"
                size="sm"
                fontFamily="Bricolage Grotesque"
                fontWeight="bold"
                px={2}
                py={1}
                borderRadius="md"
              >
                Sale
              </Badge>
            )}
            {product.badges?.is_new && (
              <Badge
                colorScheme="green"
                size="sm"
                fontFamily="Bricolage Grotesque"
                fontWeight="bold"
                px={2}
                py={1}
                borderRadius="md"
              >
                New
              </Badge>
            )}
            {product.badges?.is_featured && (
              <Badge
                colorScheme="blue"
                size="sm"
                fontFamily="Bricolage Grotesque"
                fontWeight="bold"
                px={2}
                py={1}
                borderRadius="md"
              >
                Featured
              </Badge>
            )}
          </VStack>
        </Box>

        {/* Discount Badge */}
        {product.pricing?.is_discounted && (
          <Badge
            position="absolute"
            top={2}
            right={2}
            colorScheme="orange"
            borderRadius="full"
            px={3}
            py={1}
            fontWeight="bold"
            fontSize="xs"
            fontFamily="Bricolage Grotesque"
          >
            -{Math.round(product.pricing.discount_percentage || 0)}%
          </Badge>
        )}
      </Box>

      <CardBody p={4}>
        <VStack align="stretch" spacing={3}>
          {/* Product Title */}
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="gray.800"
            noOfLines={2}
            minH="40px"
            fontFamily="Bricolage Grotesque"
            lineHeight="1.3"
          >
            {product.title}
          </Text>

          {/* Category */}
          {product.primary_category && (
            <Text
              fontSize="xs"
              color="gray.500"
              fontFamily="Bricolage Grotesque"
              noOfLines={1}
            >
              {product.primary_category.name}
            </Text>
          )}

          {/* Pricing */}
          <Box>
            <HStack spacing={2} align="baseline" wrap="wrap">
              <Text
                fontSize="lg"
                fontWeight="bold"
                color="navy"
                fontFamily="Bricolage Grotesque"
              >
                {formatPrice(product.pricing?.final_price_nett || 0)}
              </Text>
              {product.pricing?.is_discounted && (
                <Text
                  fontSize="sm"
                  color="gray.400"
                  textDecoration="line-through"
                  fontFamily="Bricolage Grotesque"
                >
                  {formatPrice(product.pricing?.regular_price_nett || 0)}
                </Text>
              )}
            </HStack>
            {product.pricing?.savings && (
              <Text
                fontSize="xs"
                color="green.600"
                fontFamily="Bricolage Grotesque"
                fontWeight="medium"
              >
                Save {formatPrice(product.pricing.savings.savings_nett)}
              </Text>
            )}
          </Box>

          {/* Features */}
          <HStack spacing={3} fontSize="xs" color="gray.600" wrap="wrap">
            {product.badges?.free_shipping && (
              <HStack spacing={1}>
                <Icon as={FiTruck} />
                <Text fontFamily="Bricolage Grotesque">Free Ship</Text>
              </HStack>
            )}
            {product.badges?.is_top_seller && (
              <HStack spacing={1}>
                <Icon as={FiStar} />
                <Text fontFamily="Bricolage Grotesque">Top Seller</Text>
              </HStack>
            )}
          </HStack>

          {/* Add to Cart Button */}
          <Button
            size="sm"
            bg="navy"
            color="white"
            fontFamily="Bricolage Grotesque"
            _hover={{ bg: "navy.600" }}
            _active={{ bg: "navy.700" }}
            borderRadius="md"
            fontWeight="medium"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            Add to Cart
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );

  if (loading) {
    return (
      <Container maxW="1400px" py={12}>
        <VStack spacing={8} align="stretch">
          <Heading size="lg" fontFamily="Bricolage Grotesque" color="gray.800">
            {title}
          </Heading>
          <Box position="relative">
            <HStack spacing={6} overflowX="hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  borderRadius="lg"
                  minW={cardWidth}
                  flexShrink={0}
                >
                  <Skeleton height="200px" />
                  <CardBody>
                    <VStack spacing={2} align="stretch">
                      <Skeleton height="40px" />
                      <Skeleton height="20px" />
                      <Skeleton height="24px" width="60%" />
                      <Skeleton height="32px" />
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </HStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return;
  }

  if (!recommendations || recommendations.length === 0) {
    return null; // Don't show anything if no recommendations
  }

  return (
    <Container maxW="1400px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="flex-start" spacing={1}>
            <Heading
              size="md"
              fontFamily="Bricolage Grotesque"
              color="gray.800"
            >
              {title}
            </Heading>
            <Text
              fontSize="sm"
              color="gray.600"
              fontFamily="Bricolage Grotesque"
            >
              Based on similar products and categories
            </Text>
          </VStack>

          <HStack spacing={2}>
            {/* Scroll Navigation Buttons */}
            <IconButton
              aria-label="Scroll left"
              icon={<Icon as={FiChevronLeft} />}
              size="sm"
              variant="outline"
              borderRadius="full"
              isDisabled={!canScrollLeft}
              onClick={() => scroll("left")}
              bg="white"
              _hover={{ bg: "gray.50" }}
              _disabled={{
                opacity: 0.4,
                cursor: "not-allowed",
              }}
            />
            <IconButton
              aria-label="Scroll right"
              icon={<Icon as={FiChevronRight} />}
              size="sm"
              variant="outline"
              borderRadius="full"
              isDisabled={!canScrollRight}
              onClick={() => scroll("right")}
              bg="white"
              _hover={{ bg: "gray.50" }}
              _disabled={{
                opacity: 0.4,
                cursor: "not-allowed",
              }}
            />
          </HStack>
        </Flex>

        {/* Scrollable Products Container */}
        <Box position="relative">
          <Box
            ref={scrollContainerRef}
            display="flex"
            gap={6}
            overflowX="auto"
            overflowY="hidden"
            pb={4}
            onScroll={checkScrollButtons}
            css={{
              scrollbarWidth: "thin",
              scrollbarColor: "#CBD5E0 #F7FAFC",
              "&::-webkit-scrollbar": {
                height: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#F7FAFC",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#A0AEC0",
              },
            }}
          >
            {recommendations.map((product, index) =>
              renderProductCard(product, index)
            )}
          </Box>

          {/* Gradient Overlays for Visual Indication */}
          {canScrollLeft && (
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              width="40px"
              background="linear-gradient(to right, rgba(255,255,255,0.8), transparent)"
              pointerEvents="none"
              zIndex={1}
            />
          )}
          {canScrollRight && (
            <Box
              position="absolute"
              right={0}
              top={0}
              bottom={0}
              width="40px"
              background="linear-gradient(to left, rgba(255,255,255,0.8), transparent)"
              pointerEvents="none"
              zIndex={1}
            />
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default RecommendedProducts;
