import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertDescription,
  useBreakpointValue,
  Spinner,
  Flex,
  useToast,
  Link,
  Icon,
  Grid,
  GridItem,
  IconButton,
  Heading,
  Badge,
} from '@chakra-ui/react';
import { 
  FaTrash, 
  FaMinus, 
  FaPlus,
  FaShoppingCart,
  FaTag,
  FaGift,
  FaTimes,
  FaShieldAlt,
  FaExclamationCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import { MdOutlineShoppingCart } from "react-icons/md";
import { homeService } from '../home/services/homeService';
import { useCustomerAuth } from '../customer-account/auth-context/customerAuthContext';
import Navbar from '../../shared-customer/components/Navbar';
import Footer from '../../shared-customer/components/Footer';
import { customToastContainerStyle } from '../../commons/toastStyles';

const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { customer } = useCustomerAuth();
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // State declarations
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promotionCode, setPromotionCode] = useState('');
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [promotionLoading, setPromotionLoading] = useState(false);

  const fetchCartData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await homeService.getActiveCart();
      setCartData(response);
      setError(null);
    } catch (error) {
      setCartData(null);
      setError("Impossible de charger les données du panier.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (customer) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [customer, fetchCartData]);

  const updateQuantity = useCallback(async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      await homeService.updateCartItemQuantity(cartItemId, newQuantity);
      await fetchCartData();
      toast({
        title: "Quantité mise à jour",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la mise à jour de la quantité",
        description: error.message || 'Échec de la mise à jour de la quantité',
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  }, [fetchCartData, toast]);

  const removeItem = useCallback(async (cartItemId) => {
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    try {
      await homeService.removeFromCart(cartItemId);
      await fetchCartData();
      toast({
        title: "Article supprimé",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression de l'élément",
        description: error.message || "Échec de la suppression de l'élément",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  }, [fetchCartData, toast]);

  const applyPromotion = useCallback(async () => {
    if (!promotionCode.trim()) return;
    
    try {
      setPromotionLoading(true);
      await homeService.applyPromotionCode(promotionCode);
      setPromotionCode('');
      await fetchCartData();
      toast({
        title: "Code promotionnel appliqué",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'application de la promotion",
        description: error.message || "Échec de l'application du code promotionnel",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } finally {
      setPromotionLoading(false);
    }
  }, [promotionCode, fetchCartData, toast]);

  const removePromotion = useCallback(async () => {
    try {
      await homeService.removePromotion();
      await fetchCartData();
      toast({
        title: "Promotion supprimée",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression de la promotion",
        description: error.message || 'Échec de la suppression de la promotion',
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    }
  }, [fetchCartData, toast]);

  const proceedToCheckout = useCallback(() => {
    navigate('/checkout/confirm');
  }, [navigate]);

  const getTotalItemCount = useCallback(() => {
    if (!cartData || !cartData.items) return 0;
    return cartData.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartData]);
  
  const formatDimensions = useCallback((dimensions) => {
    if (!dimensions || Object.keys(dimensions).length === 0) return "";
    return Object.entries(dimensions)
      .map(([key, value]) => `${value}cm ${key}`)
      .join(" × ");
  }, []);

  if (!customer) {
    return (
      <>
        <Navbar />
        <Container maxW="6xl" py={8}>
          <VStack spacing={8} align="center" py={20}>
            <FaShoppingCart size={80} color="gray.300" />
            <VStack spacing={4} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="gray.600">
                Veuillez vous connecter pour voir votre panier.
              </Text>
              <Button 
                colorScheme="blue" 
                size="lg" 
                onClick={() => navigate('/account/signin')}
                leftIcon={<FaShoppingCart />}
              >
                SE CONNECTER
              </Button>
            </VStack>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <Box bg="#ffffff" minH="calc(100vh - 200px)">
          <Container maxW="6xl" py={8}>
            <Skeleton height="40px" width="140px" mb={6} />
            <Flex direction={{ base: "column", lg: "row" }} gap={6}>
              <Box flex="2">
                <VStack align="stretch" spacing={8}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Flex key={i} gap={4} pb={6} borderBottom="1px solid" borderColor="gray.200">
                      <Skeleton height="120px" width="120px" />
                      <VStack align="flex-start" flex={1} spacing={2}>
                        <SkeletonText noOfLines={2} spacing="2" w="90%" />
                        <Skeleton height="20px" w="30%" />
                        <Skeleton height="24px" w="40%" />
                      </VStack>
                      <Skeleton height="30px" width="80px" />
                    </Flex>
                  ))}
                </VStack>
              </Box>
              
              <Box flex="1" maxW={{ lg: "380px" }} w="full">
                <Skeleton height="300px" />
              </Box>
            </Flex>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <>
        <Navbar />
        <Box bg="#ffffff" minH="calc(100vh - 200px)">
          <Container maxW="6xl" py={8}>
            <Text fontSize="2xl" fontWeight="bold" color="#333333" mb={6}>
              Panier
            </Text>
            <Box borderRadius="md" p={8} textAlign="center">
              <VStack spacing={6}>
                <Box
                  borderRadius="full"
                  p={4}
                  width="100px"
                  height="100px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <MdOutlineShoppingCart size={50} color="#666" />
                </Box>
                <Text fontSize="xl" fontWeight="medium" color="#333333">
                  Votre panier est vide
                </Text>
                <Text color="gray.600" maxW="500px">
                  Parcourez notre catalogue de produits et ajoutez des articles à votre panier
                </Text>
                <Button 
                  bg="#0064D2"
                  _hover={{ bg: "#004B9C" }}
                  color="white"
                  size="lg"
                  onClick={() => navigate('/')}
                  borderRadius="sm"
                  px={8}
                >
                  Continuer les achats
                </Button>
              </VStack>
            </Box>
          </Container>
        </Box>
        <Footer />
      </>
    );
  }

  // Safe data extraction
  const items = cartData?.items || [];
  const subtotal = cartData?.subtotal || 0;
  const total = cartData?.total || 0;
  const shipping_fee = cartData?.shipping_fee || 0;
  const tax = cartData?.tax || 0;
  const promotion_discount = cartData?.promotion_discount || 0;
  const applied_promotion_code = cartData?.applied_promotion_code || '';
  const shipping_discount = cartData?.shipping_discount || 0;

  return (
    <>
      <Navbar />
      <Box bg="#ffffff" minH="calc(100vh - 200px)" pb={{ base: 20, md: 10 }}>
        <Container maxW="6xl" py={{ base: 4, md: 6 }}>
          {/* Header - eBay style */}
          <Flex justify="space-between" mb={{ base: 4, md: 6 }}>
            <Heading as="h1" fontSize="lg" fontWeight="500" color="#333333"
            fontFamily="Airbnb Cereal VF">
              Panier
            </Heading>
          </Flex>
          
          {/* Errors or warnings - eBay red style */}
          {error && (
            <Box bg="#CC0000" color="white" p={3} mb={4} borderRadius="sm">
              <Flex align="center" gap={2}>
                <Icon as={FaExclamationCircle} boxSize="18px" />
                <Text fontWeight="medium">{error}</Text>
              </Flex>
            </Box>
          )}

          {/* Main content - eBay style */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
            {/* Left Column - Cart Items */}
            <GridItem>
              {items.map((item, index) => (
                <Box 
                  key={item.id}
                  mb={6}
                  pb={6}
                  border="1px solid #E5E5E5"
                  p={4}
                  rounded='2xl'
                >
                  <Flex gap={{ base: 3, md: 6 }}>
                    {/* Product Image - eBay style */}
                    <Box width={{ base: "80px", md: "120px" }} height={{ base: "80px", md: "120px" }}>
                      <Image 
                        src={item.product_snapshot?.main_image_url} 
                        alt={item.product_snapshot?.title || "Product image"}
                        width="100%"
                        height="100%"
                        objectFit="fill"
                      />
                    </Box>

                    {/* Product Details - eBay style */}
                    <Box flex="1">
                      {/* Title */}
                      <Link 
                        color="black"
                        fontWeight="500"
                        fontSize={{ base: "15px", md: "16px" }}
                        display="block"
                        mb={1}
                        noOfLines={2}
                        _hover={{ textDecoration: "underline" }}
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        {item.product_snapshot?.title || "Product Title"}
                      </Link>

                      {/* SKU */}
                      <Text fontSize="13px" color="gray.600" mb={2}>
                        SKU: {item.product_snapshot?.sku || "N/A"}
                      </Text>

                      {/* Display custom options if they exist */}
                      {item.selected_options && item.selected_options.length > 0 && (
                        <Box mb={2}>
                          {item.selected_options.map((option, idx) => (
                            <Flex key={idx} fontSize="13px" mb={1}>
                              <Text fontWeight="medium" mr={1}>{option.option_name}:</Text>
                              <Text color="gray.700">{option.value_name}</Text>
                            </Flex>
                          ))}
                        </Box>
                      )}
                      
                      {/* Display dimensions if they exist */}
                      {item.dimensions && Object.keys(item.dimensions).length > 0 && (
                        <Flex fontSize="13px" mb={2}>
                          <Text fontWeight="medium" mr={1}>Dimensions:</Text>
                          <Text color="gray.700">
                            {formatDimensions(item.dimensions)}
                          </Text>
                        </Flex>
                      )}

                      {/* Price eBay Style */}
                      <Text fontSize="16px" fontWeight="bold" mb={2}>
                        {parseFloat(item.unit_price || 0).toFixed(2)} €
                      </Text>
                      
                      {/* Quantity Selector - eBay style */}
                      <HStack spacing={4} mb={4}>
                        <Box 
                          border="1px solid #cccccc" 
                          borderRadius="sm" 
                          overflow="hidden" 
                          width="70px"
                        >
                          <Flex>
                            <Box 
                              as="button" 
                              width="30px" 
                              height="30px"
                              bg="#F8F8F8" 
                              borderRight="1px solid #cccccc"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updatingItems.has(item.id)}
                            >
                              {updatingItems.has(item.id) ? (
                                <Spinner size="xs" />
                              ) : (
                                <Icon as={FaMinus} fontSize="8px" />
                              )}
                            </Box>
                            <Box 
                              textAlign="center" 
                              width="40px"
                              height="30px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              fontSize="14px"
                            >
                              {item.quantity}
                            </Box>
                            <Box 
                              as="button" 
                              width="30px" 
                              height="30px"
                              bg="#F8F8F8" 
                              borderLeft="1px solid #cccccc"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updatingItems.has(item.id)}
                            >
                              {updatingItems.has(item.id) ? (
                                <Spinner size="xs" />
                              ) : (
                                <Icon as={FaPlus} fontSize="8px" />
                              )}
                            </Box>
                          </Flex>
                        </Box>
                        
                        <Text fontSize="14px" fontWeight="bold" color="gray.800">
                          Total: {parseFloat(item.total_price || 0).toFixed(2)} €
                        </Text>
                      </HStack>

                      {/* Action links */}
                      <Flex gap={4} fontSize="14px" color="#0064D2">
                        <Link onClick={() => removeItem(item.id)}>
                          Supprimer
                        </Link>
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </GridItem>

            {/* Right Column - Order Summary - eBay style */}
            <GridItem>
              <Box mb={6}>
                <Text fontSize="md" fontWeight="500" mb={4} color="#333333" fontFamily="Airbnb Cereal VF">
                  Récapitulatif de la commande
                </Text>

                <Box mb={4}>
                  <Flex justify="space-between" mb={2}>
                    <Text color="#555555" fontFamily="Airbnb Cereal VF">Articles ({getTotalItemCount()})</Text>
                    <Text fontWeight="medium" fontFamily="Airbnb Cereal VF">{subtotal.toFixed(2)} €</Text>
                  </Flex>
                  
                  {shipping_fee > 0 && (
                    <Flex justify="space-between" mb={2}>
                      <Flex align="center" gap={1}>
                        <Text color="#555555" fontFamily="Airbnb Cereal VF">Livraison</Text>
                        <Icon as={FaInfoCircle} color="gray.400" fontSize="12px" />
                      </Flex>
                      <Text fontWeight="medium" fontFamily="Airbnb Cereal VF">
                        {shipping_fee.toFixed(2)} €
                      </Text>
                    </Flex>
                  )}

                  {/* Tax info */}
                  {tax > 0 && (
                    <Flex justify="space-between" mb={2}>
                      <Text color="#555555" fontFamily="Airbnb Cereal VF">TVA</Text>
                      <Text fontWeight="medium" fontFamily="Airbnb Cereal VF">{tax.toFixed(2)} €</Text>
                    </Flex>
                  )}

                  {/* Promotions */}
                  {promotion_discount > 0 && (
                    <Flex justify="space-between" color="green.600" mb={2}>
                      <Text fontFamily="Airbnb Cereal VF">Remise promotionnelle</Text>
                      <Text fontWeight="medium" fontFamily="Airbnb Cereal VF">-{promotion_discount.toFixed(2)} €</Text>
                    </Flex>
                  )}

                  {/* Shipping Discount */}
                  {shipping_discount > 0 && (
                    <Flex justify="space-between" color="green.600" mb={2}>
                      <Text>Remise livraison</Text>
                      <Text fontWeight="medium">-{shipping_discount.toFixed(2)} €</Text>
                    </Flex>
                  )}
                </Box>

                <Divider borderColor="#E5E5E5" my={3} />
                
                {/* Total - eBay style */}
                <Flex justify="space-between" mb={4} fontWeight="500" fontSize="md">
                  <Text fontFamily="Airbnb Cereal VF" fontWeight={500}>Total</Text>
                  <Text fontFamily="Airbnb Cereal VF" fontWeight={500}>{total.toFixed(2)} €</Text>
                </Flex>
                
                {/* Checkout Button - eBay style */}
                <Button
                  w="100%"
                  bg="#0064D2"
                  color="white"
                  size="lg"
                  borderRadius="3px"
                  _hover={{ bg: "#004B9C" }}
                  onClick={proceedToCheckout}
                  fontSize="16px"
                  fontWeight="normal"
                  mb={4}
                >
                  Passer à la caisse
                </Button>
                
                {/* eBay Protection - like in the image */}
                <Flex align="center" mb={6}>
                  <Icon as={FaShieldAlt} color="#0064D2" mr={2} />
                  <Text fontSize="14px" color="#0064D2">
                    Achat protégé par AS Solutions
                  </Text>
                </Flex>
                
                {/* Promotion Code - eBay style */}
                <Box mb={6}>
                  <Text fontSize="16px" fontWeight="medium" mb={2}>
                    Code promotionnel
                  </Text>
                  <InputGroup size="md">
                    <Input
                      placeholder="Entrer le code"
                      value={promotionCode}
                      onChange={(e) => setPromotionCode(e.target.value)}
                      borderRadius="3px"
                      borderColor="#cccccc"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={applyPromotion}
                        isLoading={promotionLoading}
                        isDisabled={!promotionCode.trim()}
                        borderRadius="3px"
                        bg="#F5F5F5"
                        _hover={{ bg: "#E5E5E5" }}
                        color="black"
                        fontWeight="normal"
                      >
                        Appliquer
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  
                  {applied_promotion_code && (
                    <Flex 
                      mt={2} 
                      p={2} 
                      bg="#F5F5F5" 
                      borderRadius="sm" 
                      justify="space-between" 
                      align="center"
                    >
                      <HStack spacing={1}>
                        <Icon as={FaTag} color="green.600" boxSize="12px" />
                        <Text fontSize="14px" color="green.600">
                          {applied_promotion_code}
                        </Text>
                      </HStack>
                      <IconButton
                        icon={<FaTimes />}
                        aria-label="Remove promotion"
                        onClick={removePromotion}
                        size="xs"
                        variant="ghost"
                        colorScheme="gray"
                      />
                    </Flex>
                  )}
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>
        
        {/* Mobile Fixed Checkout - eBay style */}
        <Box
          display={{ base: 'block', md: 'none' }}
          position="fixed"
          bottom="0"
          left="0"
          right="0"
          bg="white"
          p={3}
          borderTop="1px solid"
          borderColor="gray.200"
          zIndex={10}
          boxShadow="0 -2px 6px rgba(0,0,0,0.05)"
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="12px" color="gray.600">Total:</Text>
              <Text fontWeight="bold" fontSize="18px">{total.toFixed(2)} €</Text>
            </Box>
            <Button
              bg="#0064D2"
              color="white"
              _hover={{ bg: "#004B9C" }}
              onClick={proceedToCheckout}
              borderRadius="3px"
              fontWeight="normal"
            >
              Passer à la caisse
            </Button>
          </Flex>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default CartPage;