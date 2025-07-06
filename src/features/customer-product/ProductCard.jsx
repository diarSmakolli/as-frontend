// import React from "react";
// import {
//   Box,
//   Image,
//   Text,
//   VStack,
//   HStack,
//   Badge,
//   Button,
//   useColorModeValue,
//   Card,
//   Icon,
//   IconButton,
//   CardBody,
// } from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
// import { FaShoppingCart, FaHeart, FaBox } from "react-icons/fa";

// const ProductCard = ({ product }) => {
//   const navigate = useNavigate();
//   const bgColor = useColorModeValue("white", "gray.800");
//   const borderColor = useColorModeValue("gray.200", "gray.600");

//   const handleProductClick = () => {
//     navigate(`/product/${product.slug}`);
//   };

//   const formatPrice = (price) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "EUR",
//     }).format(price);
//   };

//   return (
//     <Box
//       bg={bgColor}
//       borderWidth="1px"
//       borderColor={borderColor}
//       borderRadius="lg"
//       overflow="hidden"
//       cursor="pointer"
//       onClick={handleProductClick}
//       transition="all 0.2s"
//       _hover={{
//         transform: 'translateY(-2px)',
//         shadow: 'lg',
//       }}
//       position="relative"
//     >
//       {/* Product Image */}
//       <Box position="relative" h="200px">
//         <Image
//           src={product.main_image_url || product.images?.[0]?.url}
//           alt={product.title}
//           w="full"
//           h="full"
//           objectFit="cover"
//           fallbackSrc="https://via.placeholder.com/300x200?text=No+Image"
//         />

//         {/* Badges */}
//         <VStack position="absolute" top={2} left={2} spacing={1} align="start">
//           {product.badges?.is_new && (
//             <Badge colorScheme="green" size="sm">NEW</Badge>
//           )}
//           {product.badges?.is_on_sale && (
//             <Badge colorScheme="red" size="sm">SALE</Badge>
//           )}
//           {product.badges?.is_featured && (
//             <Badge colorScheme="purple" size="sm">FEATURED</Badge>
//           )}
//           {product.badges?.free_shipping && (
//             <Badge colorScheme="blue" size="sm">FREE SHIPPING</Badge>
//           )}
//         </VStack>

//         {/* Discount Percentage */}
//         {product.pricing?.is_discounted && product.pricing?.savings_percentage > 0 && (
//           <Badge
//             position="absolute"
//             top={2}
//             right={2}
//             colorScheme="red"
//             borderRadius="full"
//             px={2}
//             py={1}
//           >
//             -{Math.round(product.pricing.savings_percentage)}%
//           </Badge>
//         )}
//       </Box>

//       {/* Product Info */}
//       <VStack p={4} align="stretch" spacing={3}>
//         {/* Title */}
//         <Text
//           fontSize="md"
//           fontWeight="semibold"
//           noOfLines={2}
//           minH="48px"
//           lineHeight="1.2"
//         >
//           {product.title}
//         </Text>

//         {/* Price */}
//         <VStack align="start" spacing={1}>
//           <HStack spacing={2}>
//             <Text fontSize="lg" fontWeight="bold" color="blue.600">
//               {formatPrice(product.pricing?.final_price_nett || product.pricing?.final_price_gross)}
//             </Text>
//             {product.pricing?.is_discounted && (
//               <Text
//                 fontSize="sm"
//                 color="gray.500"
//                 textDecoration="line-through"
//               >
//                 {formatPrice(product.pricing.regular_price_nett || product.pricing.regular_price_gross)}
//               </Text>
//             )}
//           </HStack>

//           {product.pricing?.is_discounted && product.pricing?.savings_nett > 0 && (
//             <Text fontSize="sm" color="green.600">
//               Save {formatPrice(product.pricing.savings_nett)}
//             </Text>
//           )}
//         </VStack>

//         {/* Company */}
//         {product.company && (
//           <Text fontSize="sm" color="gray.600">
//             by {product.company.market_name || product.company.business_name}
//           </Text>
//         )}

//         {/* Action Buttons */}
//         {/* <HStack spacing={2} mt={2}>
//           <Button
//             size="sm"
//             colorScheme="blue"
//             leftIcon={<FaShoppingCart />}
//             flex={1}
//             onClick={(e) => {
//               e.stopPropagation();
//               // Handle add to cart
//               console.log('Add to cart:', product.id);
//             }}
//           >
//             Add to Cart
//           </Button>
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={(e) => {
//               e.stopPropagation();
//               // Handle wishlist
//               console.log('Add to wishlist:', product.id);
//             }}
//           >
//             <FaHeart />
//           </Button>
//         </HStack> */}
//       </VStack>
//     </Box>
//   );
// };

// export default ProductCard;

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
      bg="white"
      borderRadius="12px"
      overflow="hidden"
      shadow="sm"
      _hover={{
        shadow: "md",
        transform: "translateY(-2px)",
      }}
      transition="all 0.2s"
      cursor="pointer"
      border="1px"
      borderColor="gray.100"
      onClick={handleProductClick}
    >
      <Box position="relative">
        <Image
          src={transformedProduct.image}
          alt={transformedProduct.title}
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

        {/* Top Badge with AS Solutions color */}
        {mainTag && (
          <Badge
            position="absolute"
            top="2"
            left="2"
            bg={
              transformedProduct.badges?.is_new ? "green.500" : "rgb(239,48,84)"
            }
            color="white"
            fontSize="xs"
            fontWeight="bold"
            px="2"
            py="1"
            borderRadius="md"
          >
            {mainTag}
          </Badge>
        )}

        {/* Discount Badge - FIXED TO SHOW PERCENTAGE */}
        {transformedProduct.isDiscounted &&
          transformedProduct.discountPercentage > 0 && (
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
              -{Math.round(transformedProduct.discountPercentage)}% OFF
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
            title={transformedProduct.title}
          >
            {transformedProduct.title}
          </Text>

          <VStack align="start" spacing={1} w="full">
            <HStack spacing={2} w="full" align="center">
              <Text fontSize="lg" fontWeight="bold" color="rgb(239,48,84)">
                €{formatPrice(transformedProduct.price)}
              </Text>

              {transformedProduct.originalPrice &&
                transformedProduct.isDiscounted && (
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    textDecoration="line-through"
                  >
                    €{formatPrice(transformedProduct.originalPrice)}
                  </Text>
                )}
            </HStack>

            {/* Show savings amount */}
            {transformedProduct.isDiscounted &&
              transformedProduct.originalPrice &&
              transformedProduct.discountPercentage > 0 && (
                <Text fontSize="xs" color="green.600" fontWeight="medium">
                  Save €
                  {(
                    parseFloat(transformedProduct.originalPrice) -
                    parseFloat(transformedProduct.price)
                  ).toFixed(2)}{" "}
                  ({Math.round(transformedProduct.discountPercentage)}% off)
                </Text>
              )}

            {/* Company name */}
            {transformedProduct.company && (
              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                by{" "}
                {transformedProduct.company.market_name ||
                  transformedProduct.company.business_name}
              </Text>
            )}

            {/* Category */}
            {transformedProduct.category && (
              <Text fontSize="xs" color="blue.500" noOfLines={1}>
                {transformedProduct.category.name}
              </Text>
            )}

            {/* Badges */}
            <HStack spacing={1} flexWrap="wrap">
              {transformedProduct.badges?.free_shipping && (
                <Badge
                  size="sm"
                  colorScheme="green"
                  variant="subtle"
                  fontSize="2xs"
                >
                  Free Shipping
                </Badge>
              )}

              {transformedProduct.is_recently_added && (
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
};

export default ProductCard;
