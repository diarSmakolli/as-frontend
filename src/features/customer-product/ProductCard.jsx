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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaBox } from "react-icons/fa";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

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
      product.pricing?.final_price_nett || product.final_price_nett;
    const regularPrice =
      product.pricing?.regular_price_nett || product.regular_price_nett;
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
    price: product.pricing?.final_price_nett || product.final_price_nett,
    originalPrice:
      product.pricing?.is_discounted || product.is_discounted
        ? product.pricing?.regular_price_nett || product.regular_price_nett
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

  return (
    <Card
      onClick={handleProductClick}
      bg="transparent"
      borderRadius="0px"
      overflow="hidden"
      shadow="none"
      transition="all 0.2s"
      cursor="pointer"
      borderWidth="0px"
      borderColor="gray.400"
      // minW={{ base: "200px", sm: "200px", md: "225px" }}
      // maxW={{ base: "200px", sm: "200px", md: "225px" }}
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
          src={transformedProduct?.image}
          alt={transformedProduct?.title}
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
            <HStack spacing={2} w="full" align="center">
              <Text
                fontSize={{ base: "lg", sm: "xl" }}
                fontWeight="bold"
                color="navy"
                fontFamily="Bogle"
              >
                $ {formatPrice(transformedProduct.price)}
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
                    <Text
                      fontSize={{ base: "xs", sm: "sm" }}
                      color="gray.500"
                      textDecoration="line-through"
                      fontFamily="Bogle"
                    >
                      $ {formatPrice(transformedProduct.originalPrice)}
                    </Text>

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
                      <Text as="span" fontWeight="bold">
                        {Math.round(transformedProduct.discountPercentage)}%{" "}
                      </Text>
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
              {transformedProduct?.title}
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
};

export default ProductCard;
