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
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
        limit: 12,
        exclude_out_of_stock: true,
      });

      if (response.status === "success") {
        setRecommendations(response.data.recommendations);
      }
    } catch (err) {
      setRecommendations([]);
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
      key={product?.id}
      bg="white"
      overflow="hidden"
      shadow="sm"
      transition="all 0.3s ease"
      cursor="pointer"
      borderWidth="1px"
      borderColor="gray.300"
      position="relative"
      rounded="2xl"
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
      <Box position="relative">
        <Image
          src={product?.main_image_url}
          alt={product?.title}
          w="full"
          h="200px"
          objectFit="cover"
          rounded="lg"
          fallback={
            <Box
              w="full"
              h={{ base: "150px", sm: "180px", md: "200px" }}
              bg="#fff"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {" "}
            </Box>
          }
        />

        {/* Heart Icon */}
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
            bg: "navy",
            fontWeight: "bold",
          }}
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
                fontSize="md"
                color="black"
                noOfLines={2}
                lineHeight="short"
                minH="40px"
                title={product.title}
                fontWeight="500"
                as="a"
                href={`/product/${product.slug}`}
                fontFamily="Airbnb Cereal VF"
              >
                {product?.title}
              </Text>

              <Text
                fontSize={{ base: "lg", sm: "xl" }}
                fontWeight="600"
                color="black"
                fontFamily="Airbnb Cereal VF"
              >
                {product?.pricing.final_price_gross.toFixed(2)} €
              </Text>

              {product?.pricing.is_discounted &&
                product?.pricing.regular_price_gross >
                  product?.pricing.final_price_gross && (
                  <>
                    {/* Responsive discount badge */}
                    <Badge
                      bg="rgba(0, 0, 0, 1)"
                      fontFamily="Airbnb Cereal VF"
                      color="white"
                      fontSize={{ base: "xs", sm: "sm" }}
                      fontWeight="500"
                      px={{ base: "1", sm: "2" }}
                      py="0"
                      borderRadius="full"
                      textTransform="uppercase"
                      flexShrink={0}
                    >
                      €{product?.pricing.discount_percentage} %
                    </Badge>

                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color="gray.700"
                      textDecoration="line-through"
                      fontFamily="Airbnb Cereal VF"
                      fontWeight="500"
                    >
                      €{product?.pricing.regular_price_gross.toFixed(2)}
                    </Text>
                  </>
                )}
            </HStack>
          </VStack>
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
              fontFamily="Airbnb Cereal VF"
              color="gray.800"
              fontWeight='600'
            >
              {title}
            </Heading>
            <Text
              fontSize="sm"
              color="gray.600"
              fontFamily="Airbnb Cereal VF"
            >
              Basé sur des produits et catégories similaires
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
