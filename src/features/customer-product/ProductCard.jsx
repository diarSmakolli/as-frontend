// v3.0 - SEO Optimized
import React from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Badge,
  IconButton,
  Icon,
  Card,
  CardBody,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaBox, FaRegHeart } from "react-icons/fa";
import { customerAccountService } from "../customer-account/customerAccountService";
import { useCustomerAuth } from "../customer-account/auth-context/customerAuthContext";
import { customToastContainerStyle } from "../../commons/toastStyles";
import { homeService } from "../home/services/homeService";

const ProductCard = ({ product, index = 0, listName = "product-listing" }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { customer } = useCustomerAuth();

  const BASE_URL = 'https://assolutionsfournitures.fr';

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  // Calculate discount percentage if not provided
  const calculateDiscountPercentage = () => {
    const providedDiscount =
      product.pricing?.discount_percentage_nett ||
      product.discount_percentage_nett;
    if (providedDiscount && providedDiscount > 0) {
      return providedDiscount;
    }

    const finalPrice =
      product.pricing?.final_price_gross || product.final_price_gross;
    const regularPrice =
      product.pricing?.regular_price_gross || product.regular_price_gross;
    const isDiscounted =
      product.pricing?.is_discounted || product.is_discounted;

    if (
      isDiscounted &&
      finalPrice &&
      regularPrice &&
      regularPrice > finalPrice
    ) {
      return ((regularPrice - finalPrice) / regularPrice) * 100;
    }

    return 0;
  };

  // Transform product data
  const transformedProduct = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    image: product.main_image_url || product.images?.[0]?.url || '/assets/no-image.svg',
    price: product.pricing?.final_price_gross || product.final_price_gross || 0,
    originalPrice:
      product.pricing?.is_discounted || product.is_discounted
        ? product.pricing?.regular_price_gross || product.regular_price_gross
        : null,
    discountPercentage: calculateDiscountPercentage(),
    isDiscounted: product.pricing?.is_discounted || product.is_discounted,
    badges: product.badges || {
      is_new: product.mark_as_new,
      is_featured: product.mark_as_featured,
      is_on_sale: product.is_on_sale,
      free_shipping: product.shipping_free,
    },
    company: product.company,
    category: product.category,
    category_name: product.category_name || "Produits",
    is_recently_added: product.is_recently_added,
    stock_quantity: product.stock_quantity || 0,
    brand: product.brand || "AS Solutions",
    sku: product.sku || product.id,
  };

  const isInStock = product.is_available_on_stock = true;
  const discountAmount = transformedProduct.originalPrice 
    ? (transformedProduct.originalPrice - transformedProduct.price).toFixed(2)
    : 0;

  // Determine the main tag to display
  const getMainTag = () => {
    if (transformedProduct.badges?.is_new) return "NEW";
    if (transformedProduct.badges?.is_featured) return "FEATURED";
    if (transformedProduct.badges?.is_on_sale) return "EN PROMOTIONS";
    return null;
  };

  const mainTag = getMainTag();

  const handleAddToWishlist = async (productId) => {
    if (!customer || !customer.id) {
      navigate("/account/signin");
      return;
    }
    try {
      await customerAccountService.addToWishlist(productId);
      toast({
        title: "Ajouté à la liste de souhaits",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      const eventPayload = {
        event_type: "wishlist_add",
        session_id: customer?.id || null,
        customer_id: customer?.id || null,
        product_id: productId,
        page_type: "homepage",
        page_url: typeof window !== "undefined" ? window.location.href : null,
        referrer_url:
          typeof document !== "undefined" ? document.referrer : null,
        timestamp: new Date().toISOString(),
      };

      await homeService.createProductEvent(eventPayload);
    } catch (error) {
      toast({
        title:
          error?.message || "Erreur lors de l'ajout à la liste de souhaits",
        status: "error",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };

  // SEO-friendly product URL
  const productUrl = `/product/${transformedProduct.slug}`;
  const fullProductUrl = `${BASE_URL}${productUrl}`;

  // Create structured data for the product card
  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": transformedProduct.title,
    "image": transformedProduct.image,
    "description": `${transformedProduct.title} - ${formatPrice(transformedProduct.price)}€`,
    "sku": transformedProduct.sku,
    "brand": {
      "@type": "Brand",
      "name": transformedProduct.brand
    },
    "offers": {
      "@type": "Offer",
      "url": fullProductUrl,
      "priceCurrency": "EUR",
      "price": transformedProduct.price,
      "availability": isInStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "seller": {
        "@type": "Organization",
        "name": "AS Solutions Fournitures"
      }
    }
  };

  return (
    <>
      {/* Add microdata structured data */}
      <script type="application/ld+json">
        {JSON.stringify(productStructuredData)}
      </script>

      <article
        itemScope
        itemType="https://schema.org/Product"
        role="article"
        aria-label={`${transformedProduct.title} - ${formatPrice(
          transformedProduct.price
        )}€`}
      >
        {/* Hidden semantic data for SEO */}
        <meta itemProp="name" content={transformedProduct.title} />
        <meta
          itemProp="description"
          content={`${transformedProduct.title} disponible à ${formatPrice(
            transformedProduct.price
          )}€ sur AS Solutions Fournitures`}
        />
        <meta itemProp="image" content={transformedProduct.image} />
        <meta itemProp="sku" content={transformedProduct.sku} />
        <meta itemProp="brand" content={transformedProduct.brand} />
        <link itemProp="url" href={fullProductUrl} />

        {/* Offer metadata */}
        <div
          itemProp="offers"
          itemScope
          itemType="https://schema.org/Offer"
          style={{ display: "none" }}
        >
          <meta itemProp="priceCurrency" content="EUR" />
          <meta itemProp="price" content={transformedProduct.price} />
          <meta
            itemProp="availability"
            content={
              isInStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock"
            }
          />
          <link itemProp="url" href={fullProductUrl} />
        </div>

        <Link
          to={productUrl}
          style={{ textDecoration: "none" }}
          aria-label={`Voir les détails de ${
            transformedProduct.title
          } - ${formatPrice(transformedProduct.price)}€ ${
            transformedProduct.isDiscounted
              ? `(Économisez ${discountAmount}€)`
              : ""
          }`}
          title={`${transformedProduct.title} - ${formatPrice(
            transformedProduct.price
          )}€ ${
            isInStock ? "✓ En stock" : "✗ Rupture de stock"
          } | AS Solutions`}
        >
          <Card
            bg="transparent"
            overflow="hidden"
            shadow="none"
            cursor="pointer"
            border="0px solid rgba(145, 158, 171, 0.2)"
            position="relative"
            rounded="12px"
            minW={{ base: "200px", sm: "240px", md: "240px" }}
            maxW={{ base: "200px", sm: "240px", md: "240px" }}
            flexShrink={0}
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "lg",
            }}
            role="group"
          >
            <Box position="relative">
              {/* Product Image with SEO optimization */}
              <ProductImage
                src={transformedProduct.image}
                alt={`${transformedProduct.title} - ${transformedProduct.category_name} - AS Solutions Fournitures`}
                title={transformedProduct.title}
                height={{ base: "150px", sm: "180px", md: "200px" }}
                bg="rgba(255,255,255,1)"
                loading={index < 4 ? "eager" : "lazy"}
                fetchpriority={index < 4 ? "high" : "auto"}
              />

              {/* Badges with semantic meaning */}
              {(mainTag || transformedProduct.badges?.free_shipping) && (
                <HStack
                  position="absolute"
                  top="2"
                  left="2"
                  spacing={1}
                  role="list"
                  aria-label="Badges produit"
                >
                  {mainTag && (
                    <Badge
                      colorScheme={
                        mainTag === "NEW"
                          ? "green"
                          : mainTag === "FEATURED"
                          ? "purple"
                          : "red"
                      }
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontWeight="600"
                      role="listitem"
                      aria-label={`Badge: ${mainTag}`}
                    >
                      {mainTag}
                    </Badge>
                  )}
                  {transformedProduct.badges?.free_shipping && (
                    <Badge
                      colorScheme="blue"
                      fontSize="xs"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontWeight="600"
                      role="listitem"
                      aria-label="Livraison gratuite"
                    >
                      Livraison gratuite
                    </Badge>
                  )}
                </HStack>
              )}

              {/* Stock indicator */}
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
                  aria-label="Produit en rupture de stock"
                >
                  Rupture de stock
                </Badge>
              )}

              {/* Wishlist Button with proper semantics */}
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
                aria-label={`Ajouter ${transformedProduct.title} à la liste de souhaits`}
                title={`Ajouter ${transformedProduct.title} à la liste de souhaits`}
                shadow="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleAddToWishlist(product.id);
                }}
              />
            </Box>

            <CardBody p={3}>
              <VStack align="start" spacing={2}>
                <VStack align="start" spacing={1} w="full">
                  {/* Product Title - SEO optimized */}
                  <Text
                    as="h3"
                    fontSize="sm"
                    color="black"
                    noOfLines={2}
                    lineHeight="short"
                    minH="40px"
                    title={transformedProduct.title}
                    fontWeight="500"
                    fontFamily="Airbnb Cereal VF"
                    itemProp="name"
                  >
                    {transformedProduct.title}
                  </Text>

                  {/* Category badge for context */}
                  {transformedProduct.category_name && (
                    <Text
                      fontSize="xs"
                      color="gray.600"
                      fontFamily="Airbnb Cereal VF"
                      noOfLines={1}
                      aria-label={`Catégorie: ${transformedProduct.category_name}`}
                    >
                      {transformedProduct.category_name}
                    </Text>
                  )}

                  {/* Price Section with semantic markup */}
                  <HStack
                    spacing={2}
                    w="full"
                    align="center"
                    role="group"
                    aria-label="Prix du produit"
                  >
                    <Text
                      fontSize={{ base: "lg", sm: "xl" }}
                      fontWeight="600"
                      color="black"
                      fontFamily="Airbnb Cereal VF"
                      itemProp="price"
                      content={transformedProduct.price}
                      aria-label={`Prix: ${formatPrice(
                        transformedProduct.price
                      )} euros`}
                    >
                      {formatPrice(transformedProduct.price)} €
                    </Text>

                    {transformedProduct.originalPrice &&
                      transformedProduct.isDiscounted && (
                        <>
                          {/* Discount Badge */}
                          <Badge
                            bg="red.600"
                            color="white"
                            fontFamily="Airbnb Cereal VF"
                            border="1px solid rgba(33, 1, 1, 0.43)"
                            fontSize={{ base: "xs", sm: "sm" }}
                            fontWeight="500"
                            px={{ base: "1", sm: "2" }}
                            py="0"
                            borderRadius="lg"
                            textTransform="uppercase"
                            flexShrink={0}
                            aria-label={`Réduction de ${Math.round(
                              transformedProduct.discountPercentage
                            )} pourcent`}
                            title={`Économisez ${discountAmount}€`}
                          >
                            -{" "}
                            {Math.round(transformedProduct.discountPercentage)}%
                          </Badge>

                          {/* Original Price */}
                          <Text
                            fontSize={{ base: "xs", sm: "sm" }}
                            color="gray.700"
                            textDecoration="line-through"
                            fontFamily="Airbnb Cereal VF"
                            fontWeight="500"
                            aria-label={`Prix original: ${formatPrice(
                              transformedProduct.originalPrice
                            )} euros`}
                          >
                            {formatPrice(transformedProduct.originalPrice)} €
                          </Text>
                        </>
                      )}
                  </HStack>

                  {/* Savings indicator for discounted products */}
                  {transformedProduct.isDiscounted && discountAmount > 0 && (
                    <Text
                      fontSize="xs"
                      color="green.600"
                      fontWeight="500"
                      fontFamily="Airbnb Cereal VF"
                      aria-label={`Économisez ${discountAmount} euros`}
                    >
                      Économisez {discountAmount}€
                    </Text>
                  )}
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </Link>
      </article>
    </>
  );
};

// Enhanced ProductImage component with SEO
function ProductImage({
  src,
  alt,
  title,
  height = { base: "150px", sm: "180px", md: "200px" },
  bg = "transparent",
  loading = "lazy",
  fetchpriority = "auto",
  ...props
}) {
  return (
    <Box
      w="full"
      h={height}
      bg={bg}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      pl={2}
      pr={2}
      pt={2}
      {...props}
    >
      <Image
        src={src}
        alt={alt}
        title={title}
        w="full"
        h="full"
        objectFit="contain"
        objectPosition="center"
        loading={loading}
        fetchpriority={fetchpriority}
        decoding="async"
        itemProp="image"
        fallback={
          <Box
            w="full"
            h={height}
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
    </Box>
  );
}

export default ProductCard;