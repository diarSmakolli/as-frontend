// v2.0
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

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { customer } = useCustomerAuth();

  const handleProductClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  // Calculate discount percentage if not provided
  const calculateDiscountPercentage = () => {
    // First try to get it from the product data
    const providedDiscount =
      product.pricing?.discount_percentage_nett ||
      product.discount_percentage_nett;
    if (providedDiscount && providedDiscount > 0) {
      return providedDiscount;
    }

    // Calculate it from prices if not provided
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

  // Transform product data to match ExploreAll format
  const transformedProduct = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    image: product.main_image_url || product.images?.[0]?.url,
    price: product.pricing?.final_price_gross || product.final_price_gross,
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
    is_recently_added: product.is_recently_added,
  };

  // Determine the main tag to display
  const getMainTag = () => {
    if (transformedProduct.badges?.is_new) return "NEW";
    if (transformedProduct.badges?.is_featured) return "FEATURED";
    if (transformedProduct.badges?.is_on_sale) return "SALE";
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

  return (
    <>
      <Link to={`/product/${product.slug}`}>
        <Card
          onClick={handleProductClick}
          bg="transparent"
          overflow="hidden"
          shadow="none"
          // transition="all 0.3s ease"
          cursor="pointer"
          border="0px solid rgba(145, 158, 171, 0.2)"
          position="relative"
          rounded="12px"
          minW={{ base: "200px", sm: "240px", md: "240px" }}
          maxW={{ base: "200px", sm: "240px", md: "240px" }}
          flexShrink={0}
        >
          <Box position="relative">
            <ProductImage
              src={transformedProduct?.image}
              alt={transformedProduct?.title}
              height={{ base: "150px", sm: "180px", md: "200px" }}
              bg="rgba(255,255,255,1)"
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
                bg: "rgba(255, 0, 0, 1)",
                fontWeight: "bold",
              }}
              borderRadius="full"
              aria-label="Add to wishlist"
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
              {/* <Text
            fontSize="sm"
            color="gray.800"
            noOfLines={2}
            lineHeight="short"
            minH="40px"
            title={transformedProduct.title}
          >
            {transformedProduct.title}
          </Text> */}

              <VStack align="start" spacing={1} w="full">
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
                  fontFamily="Airbnb Cereal VF"
                >
                  {transformedProduct.title}
                </Text>

                <HStack spacing={2} w="full" align="center">
                  <Text
                    fontSize={{ base: "lg", sm: "xl" }}
                    fontWeight="600"
                    color="black"
                    fontFamily="Airbnb Cereal VF"
                  >
                    {formatPrice(transformedProduct.price)} €
                  </Text>

                  {transformedProduct.originalPrice &&
                    transformedProduct.isDiscounted && (
                      // <Text
                      //   fontSize="sm"
                      //   color="gray.500"
                      //   textDecoration="line-through"
                      // >
                      //   €{formatPrice(transformedProduct.originalPrice)}
                      // </Text>
                      <>
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
                        >
                          - {Math.round(transformedProduct.discountPercentage)}%{" "}
                        </Badge>

                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          color="gray.700"
                          textDecoration="line-through"
                          fontFamily="Airbnb Cereal VF"
                          fontWeight="500"
                        >
                          {formatPrice(transformedProduct.originalPrice)} €
                        </Text>
                      </>
                    )}
                </HStack>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Link>
    </>
  );
};

function ProductImage({
  src,
  alt,
  height = { base: "150px", sm: "180px", md: "200px" },
  bg = "transparent",
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
        w="full"
        h="full"
        objectFit="contain"
        objectPosition="center"
        fallback={
          <Box
            w="full"
            h={height}
            bg="#fff"
            display="flex"
            alignItems="center"
            justifyContent="center"
          />
        }
      />
    </Box>
  );
}

export default ProductCard;
