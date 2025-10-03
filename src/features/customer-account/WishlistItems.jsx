import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Avatar,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Button,
  Skeleton,
  SkeletonText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  useToast,
  IconButton,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHeart, FaChevronRight, FaRegHeart, FaTrash } from "react-icons/fa";
import { CiTrash } from "react-icons/ci";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";
import { customerAccountService } from "./customerAccountService";
import { homeService } from "../home/services/homeService";
import { useCustomerAuth } from "./auth-context/customerAuthContext";
import { useNavigate } from "react-router-dom";
import { customToastContainerStyle } from "../../commons/toastStyles";

export default function WishlistItems() {
  const toast = useToast();
  const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { customer, isLoading: authLoading } = useCustomerAuth();
  const [wishlist, setWishlist] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // Sidebar menu
  const menuItems = [
    { key: "overview", icon: FaHeart, label: "Liste de souhaits", active: true },
  ];

  useEffect(() => {
    if (!authLoading && !customer) {
      navigate("/signin");
    }
  }, [authLoading, customer, navigate]);

  useEffect(() => {
    if (customer) {
      fetchWishlist(pagination.page, pagination.limit);
    }
    // eslint-disable-next-line
  }, [customer, pagination.page, pagination.limit]);

  const transformProductData = (apiProduct) => {
    return {
      id: apiProduct.id,
      title: apiProduct.title,
      image:
        apiProduct.main_image_url ||
        (apiProduct.images && apiProduct.images.length > 0
          ? apiProduct.images[0].url
          : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"),
      price:
        apiProduct.pricing?.final_price_gross ||
        apiProduct.pricing?.regular_price_gross ||
        0,
      originalPrice: apiProduct.pricing?.regular_price_gross,
      discount: apiProduct.pricing?.savings_percentage || 0,
      tag: apiProduct.badges?.is_on_sale
        ? `${Math.round(apiProduct.pricing?.discount_percentage || 0)}% OFF`
        : apiProduct.badges?.is_new
        ? "NEW"
        : null,
      sku: apiProduct.sku,
      slug: apiProduct.slug,
      badges: apiProduct.badges,
      company: apiProduct.company,
      category: apiProduct.primary_category,
      is_recently_added: apiProduct.is_recently_added,
    };
  };


  const transformWishlistData = (apiProduct) => {
    const baseProduct = transformProductData(apiProduct);

    return {
      ...baseProduct,
      savingsAmount: apiProduct.pricing?.savings_nett || 0,
      dealUrgency: apiProduct.flash_deal?.deal_urgency || "low",
      dealType: apiProduct.flash_deal?.deal_type || "discount",
      isHotDeal: apiProduct.badges?.hot_deal || false,
      isMegaDeal: apiProduct.badges?.mega_deal || false,
      isSpecialOffer: apiProduct.flash_deal?.is_special_offer || false,
      discountPercentage: apiProduct.flash_deal?.discount_percentage || 0,
      isLimitedStock:
        apiProduct.flash_deal?.availability?.is_available || false,
    };
  };

  const fetchWishlist = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const res = await customerAccountService.getWishlist(page, limit);
      setWishlist(res.items || []);
      setPagination((prev) => ({
        ...prev,
        page: res.pagination.page,
        limit: res.pagination.limit,
        total: res.pagination.total,
        totalPages: res.pagination.totalPages,
      }));
    } catch (err) {
      toast({
        title: "Échec du chargement de la liste de souhaits",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle
      });
    }
    setLoading(false);
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await customerAccountService.removeFromWishlist(productId);

      const removedItem =
        wishlist.find(
          (item) =>
            item.product_id === productId || item.product?.id === productId
        ) || {};
      const removedProduct = removedItem.product || null;
      const price =
        removedProduct?.final_price_gross ??
        removedProduct?.regular_price_gross ??
        null;

      setWishlist((prev) =>
        prev.filter(
          (item) =>
            item.product_id !== productId && item.product?.id !== productId
        )
      );
      setPagination((prev) => ({
        ...prev,
        total: prev.total > 0 ? prev.total - 1 : 0,
      }));

      if (homeService?.createProductEvent) {
        homeService
          .createProductEvent({
            event_type: "wishlist_remove",
            product_id: productId,
            customer_id: customer?.id ?? null,
            page_type: "wishlist",
            page_url: typeof window !== "undefined" ? window.location.href : null,
            price_remove_from_wishlist: price,
            timestamp: new Date().toISOString(),
          })
      }

      toast({
        title: "Supprimé de la liste de souhaits",
        status: "success",
        duration: 2500,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (err) {
      toast({
        title: "Échec de la suppression de la liste de souhaits",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
    setSelectedProductId(null);
    onClose();
  };

  // Pagination handlers
  const handlePrev = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <>
      <Navbar />
      <Box minH="100vh" bg="rgba(252, 252, 253, 1)" py={4}>
        <Container maxW="8xl">
          {/* Breadcrumb */}
          <Breadcrumb mb={6} fontSize="sm" color="gray.600">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Maison</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/account">Compte</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Liste de souhaits</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap={6}>
            {/* Sidebar */}
            <GridItem>
              <VStack spacing={0} align="stretch">
                {/* User Info Card */}
                <Box
                  bg="white"
                  p={4}
                  borderRadius="md"
                  mb={4}
                  border="1px"
                  borderColor="gray.200"
                >
                  <HStack spacing={3} align="center">
                    <Avatar
                      size="md"
                      name={`${customer?.first_name} ${customer?.last_name}`}
                      bg="purple.500"
                      color="white"
                      src={customer?.profile_picture_url}
                    />
                    <VStack align="flex-start" spacing={0}>
                      <Text fontWeight="600" fontSize="md" color="gray.800">
                        {customer?.first_name} {customer?.last_name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {customer?.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Navigation Menu */}
                {/* <Box
                  bg="white"
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <VStack spacing={0} align="stretch">
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      p={3}
                      borderBottom="1px"
                      borderColor="gray.100"
                      color="gray.700"
                      fontFamily="Airbnb Cereal VF"
                    >
                      Compte
                    </Text>
                    {menuItems.map((item) => (
                      <Box
                        key={item.key}
                        bg={item.active ? "transparent" : "transparent"}
                        borderLeft={
                          item.active ? "0px solid" : "0px solid transparent"
                        }
                        borderColor={item.active ? "transparent" : "transparent"}
                        px={3}
                        py={2}
                        cursor="pointer"
                        _hover={{
                          bg: item.active ? "gray.50" : "gray.50",
                        }}
                        borderBottom="1px"
                        borderBottomColor="gray.100"
                      >
                        <HStack spacing={3}>
                          <Icon
                            as={item.icon}
                            size="sm"
                            color={item.active ? "gray.500" : "gray.500"}
                          />
                          <Text
                            fontSize="sm"
                            fontWeight={item.active ? "500" : "normal"}
                            color={item.active ? "gray.700" : "gray.700"}
                          >
                            {item.label}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Box> */}
              </VStack>
            </GridItem>

            {/* Main Content */}
            <GridItem>
              <Box
                bg="rgba(255,255,255,1)"
                p={6}
                borderRadius="md"
                border="1px solid rgba(145, 158, 171, 0.2)"
                minH="400px"
              >
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between" align="center">
                    <Heading fontSize="md" color="gray.800" fontFamily="Airbnb Cereal VF">
                      Ma liste de souhaits
                    </Heading>
                    <Text color="gray.500" fontSize="sm">
                      {pagination.total} articles
                    </Text>
                  </HStack>

                  {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 4, lg: 4 }}>
                      {[...Array(pagination.limit)].map((_, idx) => (
                        <Card
                          key={idx}
                          bg="white"
                          borderRadius="md"
                          border="1px"
                          borderColor="gray.100"
                        >
                          <Skeleton h="180px" w="full" />
                          <CardBody>
                            <VStack align="start" spacing={2}>
                              <SkeletonText
                                noOfLines={2}
                                spacing={2}
                                w="full"
                              />
                              <Skeleton h="6" w="20" borderRadius="full" />
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  ) : wishlist && wishlist.length > 0 ? (
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      {wishlist.map((item, index) => {
                        const product = item.product;
                        if (!product) return null;
                        const price =
                          typeof product.final_price_gross === "number"
                            ? product.final_price_gross
                            : typeof product.regular_price_gross === "number"
                            ? product.regular_price_gross
                            : 0;
                        const originalPrice =
                          typeof product.regular_price_gross === "number"
                            ? product.regular_price_gross
                            : null;

                        return (
                          <Card
                            key={`wishlist-${index}-${product.id}`}
                            bg="white"
                            overflow="hidden"
                            shadow="sm"
                            transition="all 0.3s ease"
                            cursor="pointer"
                            borderWidth="1px"
                            borderColor="gray.300"
                            position="relative"
                            rounded="2xl"
                            minW={{ base: "150px", sm: "200px", md: "240px" }}
                            maxW={{ base: "150px", sm: "200px", md: "240px" }}
                            flexShrink={0}
                            data-index={index}
                          >
                            <Box position="relative" rounded="lg">
                              <Image
                                src={
                                  product.main_image_url ||
                                  (product.images?.[0]?.url ?? "")
                                }
                                alt={product.title}
                                w="full"
                                h={{ base: "150px", sm: "180px", md: "200px" }}
                                objectFit="contain"
                                rounded="lg"
                                fallback={
                                  <Box
                                    w="full"
                                    h={{
                                      base: "150px",
                                      sm: "180px",
                                      md: "200px",
                                    }}
                                    bg="#fff"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    {" "}
                                  </Box>
                                }
                              />

                              <IconButton
                                icon={<CiTrash size='20px' />}
                                aria-label="Remove from wishlist"
                                bg='#fff'
                                size="sm"
                                variant="solid"
                                position="absolute"
                                top={2}
                                right={2}
                                zIndex={2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProductId(product.id);
                                  onOpen();
                                }}
                              />
                            </Box>
                            <CardBody p={3}>
                              <VStack align="start" spacing={2}>
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
                                    {product.title}
                                  </Text>

                                  <HStack
                                    spacing={2}
                                    w="full"
                                    align="center"
                                    flexWrap="wrap"
                                  >
                                    <Text
                                      fontSize={{ base: "lg", sm: "xl" }}
                                      fontWeight="600"
                                      color="black"
                                      fontFamily="Airbnb Cereal VF"
                                    >
                                      {price.toFixed(2)} €
                                    </Text>

                                    {originalPrice && originalPrice > price && (
                                      <>
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
                                          -
                                          {Math.round(
                                            ((originalPrice - price) /
                                              originalPrice) *
                                              100
                                          )}
                                          %
                                        </Badge>

                                        <Text
                                          fontSize={{ base: "xs", sm: "sm" }}
                                          color="gray.700"
                                          textDecoration="line-through"
                                          fontFamily="Airbnb Cereal VF"
                                          fontWeight="500"
                                        >
                                          €{originalPrice.toFixed(2)}
                                        </Text>
                                      </>
                                    )}
                                  </HStack>
                                </VStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        );
                      })}
                    </SimpleGrid>
                  ) : (
                    <Box textAlign="center" py={12}>
                      <Icon as={FaHeart} boxSize={16} color="gray.300" mb={4} />
                      <Text fontSize="lg" color="gray.500" mb={2}>
                        Votre liste de souhaits est vide
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        Parcourez les produits et ajoutez-les à votre liste de souhaits !
                      </Text>
                    </Box>
                  )}

                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <HStack justify="center" mt={4}>
                      <Button
                        size="sm"
                        onClick={handlePrev}
                        isDisabled={pagination.page === 1}
                        variant="outline"
                      >
                        Précédente
                      </Button>
                      <Text fontSize="sm" color="gray.600">
                        Page {pagination.page} of {pagination.totalPages}
                      </Text>
                      <Button
                        size="sm"
                        onClick={handleNext}
                        isDisabled={pagination.page === pagination.totalPages}
                        variant="outline"
                      >
                        Suivante
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>

       {/* Confirmation Modal */}
       <Modal isOpen={isOpen} onClose={() => { setSelectedProductId(null); onClose(); }} isCentered>
        <ModalOverlay />
        <ModalContent rounded='2xl' ml={{ base: 4 }} mr={{base: 4}}>
          <ModalHeader fontFamily="Airbnb Cereal VF" fontSize='md'>Supprimer de la liste de souhaits</ModalHeader>
          <ModalBody fontFamily="Airbnb Cereal VF" fontSize='sm'>
            Êtes-vous sûr de vouloir supprimer ce produit de votre liste de souhaits ?
          </ModalBody>
          <ModalFooter fontFamily="Airbnb Cereal VF">
            <Button variant="ghost" mr={3} onClick={() => { setSelectedProductId(null); onClose(); }} fontFamily="Airbnb Cereal VF" fontSize='sm'>
              Annuler
            </Button>
            <Button colorScheme="red" onClick={() => handleRemoveFromWishlist(selectedProductId)} fontFamily="Airbnb Cereal VF" rounded='xl' fontSize='sm'>
              Retirer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </>
  );
}