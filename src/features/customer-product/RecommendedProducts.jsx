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
  Skeleton,
  Flex,
  Icon,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { homeService } from "../home/services/homeService";
import { FaRegHeart } from "react-icons/fa";

const RecommendedProducts = ({
  productSlug,
  title = "Produits Recommandés pour Vous",
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = 'https://assolutionsfournitures.fr';

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

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  // Generate structured data for recommended products
  const generateStructuredData = () => {
    if (!recommendations || recommendations.length === 0) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": title,
      "description": "Produits recommandés basés sur des produits et catégories similaires",
      "numberOfItems": recommendations.length,
      "itemListElement": recommendations.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.title,
          "url": `${BASE_URL}/product/${product.slug}`,
          "image": product.main_image_url,
          "sku": product.sku || product.id,
          "brand": {
            "@type": "Brand",
            "name": product.brand || "AS Solutions"
          },
          "offers": {
            "@type": "Offer",
            "price": product.pricing?.final_price_gross || 0,
            "priceCurrency": "EUR",
            "availability": product.stock_quantity > 0 
              ? "https://schema.org/InStock" 
              : "https://schema.org/OutOfStock",
            "url": `${BASE_URL}/product/${product.slug}`,
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        }
      }))
    };
  };

  const renderProductCard = (product, index) => {
    const price = product?.pricing?.final_price_gross || 0;
    const originalPrice = product?.pricing?.regular_price_gross || price;
    const isDiscounted = product?.pricing?.is_discounted && originalPrice > price;
    const discount = product?.pricing?.discount_percentage || 0;
    const savings = isDiscounted ? (originalPrice - price).toFixed(2) : 0;
    const isInStock = product?.stock_quantity > 0;
    const productUrl = `/product/${product.slug}`;
    const fullProductUrl = `${BASE_URL}${productUrl}`;

    return (
      <article
        key={product?.id}
        itemScope
        itemType="https://schema.org/Product"
        role="article"
        aria-label={`Produit recommandé: ${product?.title} - ${formatPrice(price)}€`}
      >
        {/* Hidden semantic metadata */}
        <meta itemProp="name" content={product?.title} />
        <meta itemProp="description" content={`${product?.title} disponible à ${formatPrice(price)}€`} />
        <meta itemProp="image" content={product?.main_image_url} />
        <meta itemProp="sku" content={product?.sku || product?.id} />
        <meta itemProp="brand" content={product?.brand || "AS Solutions"} />
        <link itemProp="url" href={fullProductUrl} />

        {/* Offer metadata */}
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer" style={{ display: 'none' }}>
          <meta itemProp="priceCurrency" content="EUR" />
          <meta itemProp="price" content={price} />
          <meta itemProp="availability" content={isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
          <link itemProp="url" href={fullProductUrl} />
        </div>

        <Link
          to={productUrl}
          style={{ textDecoration: "none" }}
          aria-label={`Voir les détails de ${product?.title} - ${formatPrice(price)}€ ${isDiscounted ? `(Économisez ${savings}€)` : ''}`}
          title={`${product?.title} - ${formatPrice(price)}€ ${isInStock ? '✓ En stock' : '✗ Rupture de stock'} | AS Solutions`}
        >
          <Card
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
            _hover={{
              transform: "translateY(-4px)",
              shadow: "lg"
            }}
            role="group"
          >
            <Box position="relative">
              {/* Product Image with SEO optimization */}
              <Image
                src={product?.main_image_url}
                alt={`${product?.title} - Produit recommandé - AS Solutions Fournitures`}
                title={product?.title}
                w="full"
                h="200px"
                objectFit="contain"
                rounded="lg"
                loading={index < 6 ? "eager" : "lazy"}
                fetchpriority={index < 6 ? "high" : "auto"}
                decoding="async"
                itemProp="image"
                fallback={
                  <Box
                    w="full"
                    h="200px"
                    bg="#fff"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize="xs" color="gray.400">
                      Image non disponible
                    </Text>
                  </Box>
                }
              />

              {/* Discount Badge */}
              {isDiscounted && discount > 0 && (
                <Badge
                  position="absolute"
                  top="2"
                  left="2"
                  colorScheme="red"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontWeight="600"
                  aria-label={`Réduction de ${discount}%`}
                >
                  -{discount}%
                </Badge>
              )}

              {/* Stock Badge */}
              {!isInStock && (
                <Badge
                  position="absolute"
                  bottom="2"
                  left="2"
                  colorScheme="red"
                  fontSize="xs"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontWeight="600"
                  aria-label="Rupture de stock"
                >
                  Rupture
                </Badge>
              )}

              {/* Wishlist Button */}
              <IconButton
                position="absolute"
                top="2"
                right="2"
                size="sm"
                icon={<FaRegHeart size="20px" aria-hidden="true" />}
                bg="white"
                color="black"
                _hover={{
                  color: "white",
                  bg: "rgba(255, 0, 0, 1)",
                  fontWeight: "bold",
                }}
                borderRadius="full"
                aria-label={`Ajouter ${product?.title} à la liste de souhaits`}
                title={`Ajouter ${product?.title} à la liste de souhaits`}
                shadow="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              />
            </Box>

            <CardBody p={3}>
              <VStack align="start" spacing={2}>
                <VStack align="start" spacing={1} w="full">
                  {/* Product Title */}
                  <Text
                    as="h4"
                    fontSize="md"
                    color="black"
                    noOfLines={2}
                    lineHeight="short"
                    minH="40px"
                    title={product?.title}
                    fontWeight="500"
                    fontFamily="Airbnb Cereal VF"
                    itemProp="name"
                  >
                    {product?.title}
                  </Text>

                  {/* Price Section */}
                  <HStack spacing={2} w="full" align="center" role="group" aria-label="Prix du produit">
                    <Text
                      fontSize={{ base: "lg", sm: "xl" }}
                      fontWeight="600"
                      color="black"
                      fontFamily="Airbnb Cereal VF"
                      itemProp="price"
                      content={price}
                      aria-label={`Prix: ${formatPrice(price)} euros`}
                    >
                      {formatPrice(price)} €
                    </Text>

                    {isDiscounted && (
                      <>
                        {/* Discount Badge */}
                        <Badge
                          bg="rgba(255, 0, 0, 1)"
                          fontFamily="Airbnb Cereal VF"
                          color="gray.200"
                          border="1px solid rgba(33, 1, 1, 0.43)"
                          fontSize={{ base: "xs", sm: "sm" }}
                          fontWeight="500"
                          px={{ base: "1", sm: "2" }}
                          py="0"
                          borderRadius="lg"
                          textTransform="uppercase"
                          flexShrink={0}
                          aria-label={`Réduction de ${Math.round(discount)} pourcent`}
                          title={`Économisez ${savings}€`}
                        >
                          -{Math.round(discount)}%
                        </Badge>

                        {/* Original Price */}
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          color="gray.700"
                          textDecoration="line-through"
                          fontFamily="Airbnb Cereal VF"
                          fontWeight="500"
                          aria-label={`Prix original: ${formatPrice(originalPrice)} euros`}
                        >
                          {formatPrice(originalPrice)} €
                        </Text>
                      </>
                    )}
                  </HStack>

                  {/* Savings indicator */}
                  {isDiscounted && savings > 0 && (
                    <Text
                      fontSize="xs"
                      color="green.600"
                      fontWeight="500"
                      fontFamily="Airbnb Cereal VF"
                      aria-label={`Économisez ${savings} euros`}
                    >
                      Économisez {savings}€
                    </Text>
                  )}

                  {/* Low stock warning */}
                  {isInStock && product?.stock_quantity < 10 && (
                    <HStack spacing={1}>
                      <Box
                        w={2}
                        h={2}
                        borderRadius="full"
                        bg="orange.500"
                        aria-hidden="true"
                      />
                      <Text
                        fontSize="xs"
                        color="orange.600"
                        fontWeight="500"
                        fontFamily="Airbnb Cereal VF"
                        aria-label={`Stock limité: seulement ${product?.stock_quantity} articles restants`}
                      >
                        Seulement {product?.stock_quantity} restant{product?.stock_quantity > 1 ? 's' : ''}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Link>
      </article>
    );
  };

  if (loading) {
    return (
      <Container maxW="1400px" py={12}>
        <VStack spacing={8} align="stretch">
          <Heading 
            size="lg" 
            fontFamily="Airbnb Cereal VF" 
            color="gray.800"
            fontWeight="600"
          >
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

  if (error || !recommendations || recommendations.length === 0) {
    return null; // Don't show anything if no recommendations
  }

  const structuredData = generateStructuredData();

  return (
    <>
      {/* Add structured data for the recommendation list */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      <Container 
        maxW="1400px" 
        py={8}
        as="section"
        aria-labelledby="recommended-products-heading"
      >
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <VStack align="flex-start" spacing={1}>
              <Heading
                id="recommended-products-heading"
                as="h2"
                size="md"
                fontFamily="Airbnb Cereal VF"
                color="gray.800"
                fontWeight="600"
              >
                {title}
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                fontFamily="Airbnb Cereal VF"
              >
                Basé sur des produits et catégories similaires ({recommendations.length} produits)
              </Text>
            </VStack>

            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              {/* Scroll Navigation Buttons */}
              <IconButton
                aria-label="Voir les produits précédents"
                title="Défiler vers la gauche"
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
                aria-label="Voir les produits suivants"
                title="Défiler vers la droite"
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
          <Box 
            position="relative"
            role="region"
            aria-label="Liste de produits recommandés défilante"
          >
            <Box
              ref={scrollContainerRef}
              display="flex"
              gap={6}
              overflowX="auto"
              overflowY="hidden"
              pb={4}
              onScroll={checkScrollButtons}
              role="list"
              aria-label={`${recommendations.length} produits recommandés`}
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
                aria-hidden="true"
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
                aria-hidden="true"
              />
            )}
          </Box>

          {/* Mobile hint */}
          <Text
            fontSize="xs"
            color="gray.500"
            textAlign="center"
            fontFamily="Airbnb Cereal VF"
            display={{ base: "block", md: "none" }}
          >
            Faites défiler horizontalement pour voir plus de produits
          </Text>
        </VStack>
      </Container>
    </>
  );
};

export default RecommendedProducts;