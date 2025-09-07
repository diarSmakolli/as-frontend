import React, { useState, useEffect } from 'react';
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
  Badge,
  IconButton,
  Grid,
  GridItem,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  AlertDescription,
  useBreakpointValue,
  SimpleGrid,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Spacer,
  useToast,
} from '@chakra-ui/react';
import { 
  FaTrash, 
  FaMinus, 
  FaPlus,
  FaShoppingCart,
  FaTag,
  FaGift,
  FaTimes 
} from 'react-icons/fa';
import { CiTrash } from "react-icons/ci";
import { homeService } from '../home/services/homeService';
import { useCustomerAuth } from '../customer-account/auth-context/customerAuthContext';
import Navbar from '../../shared-customer/components/Navbar';
import Footer from '../../shared-customer/components/Footer';
import { customToastContainerStyle } from '../../commons/toastStyles';


const CartPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { customer } = useCustomerAuth();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [promotionCode, setPromotionCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [giftCardLoading, setGiftCardLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (customer) {
      fetchCartData();
    } else {
      setLoading(false);
    }
  }, [customer]);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await homeService.getActiveCart();
      setCartData(response);
      setError(null);
    } catch (error) {
      setCartData([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
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
  };

  const removeItem = async (cartItemId) => {
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
  };

  const applyPromotion = async () => {
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
  };

  const removePromotion = async () => {
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
  };

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) return;
    
    try {
      setGiftCardLoading(true);
      await homeService.applyGiftCard(giftCardCode);
      setGiftCardCode('');
      await fetchCartData();
      toast({
        title: "Carte cadeau appliquée",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } catch (error) {
      toast({
        title: "Erreur lors de l'application de la carte-cadeau",
        description: error.message || "Échec de l'application de la carte-cadeau",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } finally {
      setGiftCardLoading(false);
    }
  };

  const removeGiftCard = async () => {
    try {
      await homeService.removeGiftCard();
      await fetchCartData();
      toast({
        title: "Carte cadeau supprimée",
        status: "success",
        duration: 2000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la suppression de la carte-cadeau",
        description: error.message || 'Échec de la suppression de la carte-cadeau',
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout/confirm');
  };

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
        <Container maxW="7xl" py={8}>
          <VStack spacing={6}>
            <Skeleton height="40px" width="200px" />
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8} w="full">
              <Box bg="white" borderRadius="xl" p={6} shadow="sm" border="1px" borderColor="gray.200">
                <VStack spacing={4}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <HStack key={i} spacing={4} w="full" p={4} borderBottom="1px" borderColor="gray.100">
                      <Skeleton height="80px" width="80px" borderRadius="md" />
                      <VStack align="start" flex={1} spacing={2}>
                        <SkeletonText noOfLines={2} spacing={1} w="full" />
                        <Skeleton height="20px" width="60px" />
                      </VStack>
                      <Skeleton height="40px" width="120px" />
                      <Skeleton height="30px" width="30px" />
                    </HStack>
                  ))}
                </VStack>
              </Box>
              <Box bg="white" borderRadius="xl" p={6} shadow="sm" border="1px" borderColor="gray.200">
                <VStack spacing={4}>
                  <SkeletonText noOfLines={8} spacing={3} w="full" />
                  <Skeleton height="50px" w="full" />
                </VStack>
              </Box>
            </Grid>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <>
        <Navbar />
        <Container maxW="6xl" py={8}>
          <VStack spacing={8} align="center" py={20}>
            <FaShoppingCart size={80} color="gray.300" />
            <VStack spacing={4} textAlign="center">
              <Text fontSize="2xl" fontWeight="bold" color="gray.600">
                Le panier est vide.
              </Text>
              <Text color="gray.500">
                Ajoutez des produits au panier pour continuer
              </Text>
              <Button 
                colorScheme="orange" 
                size="lg" 
                onClick={() => navigate('/')}
                leftIcon={<FaShoppingCart />}
              >
                Continuer les achats
              </Button>
            </VStack>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <Box bg="rgba(252, 252, 253, 1)" minH="calc(100vh - 200px)" display={'none'}>
        <Container maxW="8xl" py={8} pl={8} pr={8}>
          {/* Page Title */}
          <Text
            fontSize="2xl"
            fontWeight="500"
            mb={8}
            color="gray.800"
            fontFamily="Airbnb Cereal VF"
          >
            Panier
          </Text>

          {error && (
            <Alert status="error" mb={6} borderRadius="xl">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
            {/* Cart Items */}
            <VStack spacing={6} align="stretch">
              {cartData.items.map((item) => (
                <Box
                  key={item.id}
                  bg="gray.50"
                  borderRadius="xl"
                  p={6}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  {/* Main Product Info Grid */}
                  <Grid
                    templateColumns="120px 1fr auto auto auto"
                    gap={6}
                    alignItems="start"
                    mb={4}
                  >
                    {/* Product Image */}
                    <Image
                      src={item.product_snapshot?.main_image_url}
                      alt={item.product_snapshot?.title}
                      boxSize="120px"
                      objectFit="cover"
                      borderRadius="lg"
                      bg="gray.100"
                    />

                    {/* Product Details - Basic Info Only */}
                    <VStack align="start" spacing={3} flex={1}>
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        lineHeight="1.4"
                        fontFamily="Airbnb Cereal VF"
                        color="gray.800"
                      >
                        {item.product_snapshot?.title}
                      </Text>
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        fontFamily="Airbnb Cereal VF"
                      >
                        SKU: {item.product?.sku}
                      </Text>
                    </VStack>

                    {/* Price */}
                    <VStack align="center" spacing={1} minW="100px">
                      <Text fontSize="xs" color="gray.600" textAlign="center">
                        Prix unitaire
                      </Text>
                      <Text
                        fontWeight="bold"
                        fontSize="lg"
                        color="gray.800"
                        textAlign="center"
                      >
                        {parseFloat(item.unit_price).toFixed(2)} €
                      </Text>
                      {item.product_snapshot?.regular_price_nett !==
                        item.product_snapshot?.final_price_nett && (
                        <Text
                          fontSize="sm"
                          textDecoration="line-through"
                          color="gray.400"
                          textAlign="center"
                          fontFamily="Airbnb Cereal VF"
                        >
                          {parseFloat(
                            item.product_snapshot?.regular_price_nett || 0
                          ).toFixed(2)}{" "}
                          €
                        </Text>
                      )}
                    </VStack>

                    {/* Quantity */}
                    <VStack align="center" spacing={2} minW="120px">
                      <Text fontSize="xs" color="gray.600">
                        Quantité
                      </Text>
                      <HStack spacing={1}>
                        <IconButton
                          icon={
                            updatingItems.has(item.id) ? (
                              <Spinner size="xs" />
                            ) : (
                              <FaMinus />
                            )
                          }
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          isDisabled={
                            item.quantity <= 1 || updatingItems.has(item.id)
                          }
                          colorScheme="gray"
                          variant="outline"
                        />
                        <Text fontWeight="bold" minW="40px" textAlign="center" fontFamily="Airbnb Cereal VF">
                          {item.quantity}
                        </Text>
                        <IconButton
                          icon={
                            updatingItems.has(item.id) ? (
                              <Spinner size="xs" />
                            ) : (
                              <FaPlus />
                            )
                          }
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          isDisabled={updatingItems.has(item.id)}
                          colorScheme="gray"
                          variant="outline"
                        />
                      </HStack>
                    </VStack>

                    {/* Total & Actions */}
                    <VStack align="center" spacing={2} minW="120px">
                      <Text fontSize="xs" color="gray.600">
                        Total
                      </Text>
                      <Text fontWeight="600" fontSize="xl" color="black" fontFamily="Airbnb Cereal VF">
                        {parseFloat(item.total_price).toFixed(2)} €
                      </Text>
                      <IconButton
                        icon={
                          updatingItems.has(item.id) ? (
                            <Spinner size="xs" />
                          ) : (
                            <CiTrash size="19px" />
                          )
                        }
                        onClick={() => removeItem(item.id)}
                        isDisabled={updatingItems.has(item.id)}
                        colorScheme="red"
                        variant="ghost"
                        size="sm"
                        title="Retirer du panier"
                      />
                    </VStack>
                  </Grid>

                  {/* Full Width Customization Sections Below */}
                  <VStack spacing={4} align="stretch" w="full">
                    {/* Custom Options - Full Width */}
                    {Array.isArray(item.selected_options) &&
                      item.selected_options.length > 0 && (
                        <Box
                          w="full"
                          // bg="#fff"
                          // borderRadius="lg"
                          p={2}
                          // border="1px solid rgba(145, 158, 171, 0.2)"
                        >
                          <Text
                            fontSize="lg"
                            fontWeight="600"
                            color="black"
                            mb={3}
                            fontFamily="Airbnb Cereal VF"
                          >
                            ✨ Configuration personnalisée
                          </Text>
                          <SimpleGrid
                            columns={{ base: 1, md: 1, lg: 2 }}
                            spacing={3}
                          >
                            {item.selected_options.map((opt, idx) => (
                              <Box
                                key={idx}
                                bg="#fff"
                                borderRadius="md"
                                p={1.5}
                                border="1px solid rgba(145, 158, 171, 0.2)"
                                shadow="sm"
                              >
                                <HStack spacing={2} align="center">
                                  {/* Image */}
                                  {opt.image_url && (
                                    <Image
                                      src={opt.image_url}
                                      alt={opt.image_alt_text || opt.value_name}
                                      boxSize="100px"
                                      borderRadius="none"
                                      objectFit="cover"
                                    />
                                  )}

                                  {/* Content */}
                                  <VStack
                                    spacing={1}
                                    align="start"
                                    textAlign="start"
                                    pl={2}
                                  >
                                    <Text
                                      fontSize="xs"
                                      color="gray.500"
                                      fontWeight="500"
                                      // textTransform="uppercase"
                                      letterSpacing="wide"
                                      fontFamily="Airbnb Cereal VF"
                                    >
                                      Option: {opt.option_name}?
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      color="gray.800"
                                      fontWeight="500"
                                      noOfLines={2}
                                      lineHeight="1.3"
                                      fontFamily="Airbnb Cereal VF"
                                    >
                                      Choisie: {opt.value_name}
                                    </Text>

                                    {/* Price modifier */}
                                    {opt.price_modifier &&
                                      parseFloat(opt.price_modifier) !== 0 && (
                                        <Text
                                          fontSize="xs"
                                          color="green.600"
                                          fontWeight="500"
                                          bg="green.100"
                                          px={2}
                                          py={1}
                                          borderRadius="md"
                                          textAlign="center"
                                          fontFamily="Airbnb Cereal VF"
                                        >
                                          +
                                          {parseFloat(
                                            opt.price_modifier
                                          ).toFixed(2)}{" "}
                                          €
                                        </Text>
                                      )}

                                      {opt.price_modifier &&
                                      parseFloat(opt.price_modifier) == 0 && (
                                        <Text
                                          fontSize="xs"
                                          color="green.600"
                                          fontWeight="500"
                                          bg="green.100"
                                          px={2}
                                          py={1}
                                          borderRadius="md"
                                          textAlign="center"
                                          fontFamily="Airbnb Cereal VF"
                                        >
                                          Included
                                        </Text>
                                      )}
                                  </VStack>
                                </HStack>
                              </Box>
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                    {/* Dimensions - Full Width */}
                    {item.dimensions &&
                      Object.keys(item.dimensions).length > 0 && (
                        <Box
                          w="full"
                          bg="#fff"
                          borderRadius="lg"
                          p={4}
                          border="1px solid"
                          borderColor="blue.200"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="blue.700"
                            mb={3}
                          >
                            📏 Dimensions sur mesure
                          </Text>
                          <HStack spacing={3} wrap="wrap">
                            {Object.entries(item.dimensions).map(
                              ([key, value]) => (
                                <HStack
                                  key={key}
                                  bg="white"
                                  px={3}
                                  py={2}
                                  borderRadius="md"
                                  border="1px solid"
                                  borderColor="blue.200"
                                  shadow="sm"
                                >
                                  <Text
                                    fontSize="xs"
                                    color="blue.600"
                                    fontWeight="medium"
                                  >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                    :
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="gray.800"
                                    fontWeight="bold"
                                  >
                                    {value} cm
                                  </Text>
                                </HStack>
                              )
                            )}
                          </HStack>
                        </Box>
                      )}

                    {/* Services - Full Width */}
                    {item.selected_services &&
                      Object.keys(item.selected_services).length > 0 && (
                        <Box
                          w="full"
                          bg="purple.50"
                          borderRadius="lg"
                          p={4}
                          border="1px solid"
                          borderColor="purple.200"
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="purple.700"
                            mb={3}
                          >
                            🔧 Services additionnels
                          </Text>
                          <VStack align="start" spacing={2}>
                            {Object.entries(item.selected_services).map(
                              ([key, value]) => (
                                <HStack
                                  key={key}
                                  bg="white"
                                  px={3}
                                  py={2}
                                  borderRadius="md"
                                  border="1px solid"
                                  borderColor="purple.200"
                                  w="full"
                                  shadow="sm"
                                >
                                  <Text
                                    fontSize="xs"
                                    color="purple.600"
                                    fontWeight="medium"
                                    minW="max-content"
                                  >
                                    {key}:
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="gray.800"
                                    fontWeight="semibold"
                                  >
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : value}
                                  </Text>
                                </HStack>
                              )
                            )}
                          </VStack>
                        </Box>
                      )}
                  </VStack>
                </Box>
              ))}
            </VStack>

            {/* Order Summary */}
            <Box
              bg="white"
              borderRadius="xl"
              p={6}
              shadow="sm"
              border="1px"
              borderColor="gray.200"
              h="fit-content"
            >
              <Text fontSize="xl" fontWeight="500" mb={6} color="gray.800" fontFamily="Airbnb Cereal VF">
                Total de la commande:
              </Text>

              {/* Promotion Code */}
              <Box mb={6}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={3}
                  color="gray.700"
                  fontFamily="Airbnb Cereal VF"
                >
                  Code de réduction
                </Text>
                <InputGroup size="md">
                  <Input
                    placeholder="Nouveau code de réduction"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    borderRadius="md"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _focus={{ borderColor: "orange.400", bg: "white" }}
                    fontFamily="Airbnb Cereal VF"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={applyPromotion}
                      isLoading={promotionLoading}
                      isDisabled={!promotionCode.trim()}
                      bg='black'
                      color='white'
                      _hover={{ bg: 'gray.800' }}
                      _focus={{ bg: 'gray.800' }}
                      _active={{ bg: 'gray.800' }}
                      fontSize="xs"
                      fontFamily="Airbnb Cereal VF"
                    >
                      Appliquer
                    </Button>
                  </InputRightElement>
                </InputGroup>

                {cartData.applied_promotion_code && (
                  <HStack
                    mt={2}
                    p={2}
                    bg="green.50"
                    borderRadius="md"
                    justify="space-between"
                  >
                    <HStack spacing={2}>
                      <FaTag color="green" size={12} />
                      <Text fontSize="sm" color="green.700" fontFamily="Airbnb Cereal VF">
                        {cartData.applied_promotion_code}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<FaTimes />}
                      size="xs"
                      onClick={removePromotion}
                      colorScheme="red"
                      variant="ghost"
                    />
                  </HStack>
                )}
              </Box>

              {/* Gift Card */}
              <Box mb={6}>
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  mb={3}
                  color="gray.700"
                  fontFamily="Airbnb Cereal VF"
                >
                  Cartes-cadeaux / Bons d'achat
                </Text>
                <InputGroup size="md">
                  <Input
                    placeholder="Cartes-cadeaux / Bons d'achat"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    borderRadius="md"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _focus={{ borderColor: "orange.400", bg: "white" }}
                    
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={applyGiftCard}
                      isLoading={giftCardLoading}
                      isDisabled={!giftCardCode.trim()}
                      bg='black'
                      color='white'
                      _hover={{ bg: 'gray.800' }}
                      _focus={{ bg: 'gray.800' }}
                      _active={{ bg: 'gray.800' }}
                      fontSize="xs"
                    >
                      Appliquer
                    </Button>
                  </InputRightElement>
                </InputGroup>

                {cartData.applied_gift_card_code && (
                  <HStack
                    mt={2}
                    p={2}
                    bg="purple.50"
                    borderRadius="md"
                    justify="space-between"
                    fontFamily="Airbnb Cereal VF"
                  >
                    <HStack spacing={2}>
                      <FaGift color="purple" size={12} />
                      <Text fontSize="sm" color="purple.700" fontFamily="Airbnb Cereal VF">
                        {cartData.applied_gift_card_code}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<FaTimes />}
                      size="xs"
                      onClick={removeGiftCard}
                      colorScheme="red"
                      variant="ghost"
                    />
                  </HStack>
                )}
              </Box>

              <Divider my={4} />

              {/* Summary Details */}
              <VStack spacing={3} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600" fontFamily="Airbnb Cereal VF">
                    Sous-total:
                  </Text>
                  <Text fontWeight="semibold" fontFamily="Airbnb Cereal VF">
                    {cartData.subtotal?.toFixed(2)} €
                  </Text>
                </HStack>

                {/* <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Transporti: (STANDARD - Transport falas)</Text>
                  <Text fontWeight="semibold">0.00 €</Text>
                </HStack> */}

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.500" fontStyle="italic" fontFamily="Airbnb Cereal VF">
                    Impôts
                  </Text>
                  <Text fontWeight="semibold" color="gray.500" fontFamily="Airbnb Cereal VF">
                    {(cartData.tax || 0).toFixed(2)} €
                  </Text>
                </HStack>

                {cartData.promotion_discount > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="orange.600" fontFamily="Airbnb Cereal VF">
                      Remise promotionnelle:
                    </Text>
                    <Text fontWeight="semibold" color="orange.600" fontFamily="Airbnb Cereal VF">
                      -{cartData.promotion_discount.toFixed(2)} €
                    </Text>
                  </HStack>
                )}

                {cartData.gift_card_discount > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="purple.600" fontFamily="Airbnb Cereal VF">
                      Remise sur les cartes-cadeaux:
                    </Text>
                    <Text fontWeight="semibold" color="purple.600" fontFamily="Airbnb Cereal VF">
                      -{cartData.gift_card_discount.toFixed(2)} €
                    </Text>
                  </HStack>
                )}

                {cartData.shipping_discount > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="blue.600" fontFamily="Airbnb Cereal VF">
                      Rabais sur les transports:
                    </Text>
                    <Text fontWeight="semibold" color="blue.600" fontFamily="Airbnb Cereal VF">
                      -{cartData.shipping_discount.toFixed(2)} €
                    </Text>
                  </HStack>
                )}
              </VStack>

              <Divider my={4} />

              {/* Total */}
              <HStack justify="space-between" mb={6}>
                <Text fontSize="lg" fontWeight="bold" color="gray.800" fontFamily="Airbnb Cereal VF">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="600" color="black" fontFamily="Airbnb Cereal VF">
                  {cartData.total?.toFixed(2)} €
                </Text>
              </HStack>

              {/* Checkout Button */}
              <Button
                w="full"
                size="lg"
                bg='#0d00ffff'
                color='white'
                onClick={proceedToCheckout}
                isDisabled={cartData.total <= 0}
                borderRadius="lg"
                py={6}
                fontSize="sm"
                fontWeight="600"
                letterSpacing="wider"
                _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
                transition="all 0.2s"
                fontFamily="Airbnb Cereal VF"
              >
                Aller
              </Button>
            </Box>
          </Grid>
        </Container>
      </Box>

      <Box bg="rgba(252, 252, 253, 1)" minH="calc(100vh - 200px)">
  <Container maxW="8xl" py={8} px={{ base: 4, md: 8 }}>
    {/* Page Title */}
    <Text
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="500"
      mb={8}
      color="gray.800"
      fontFamily="Airbnb Cereal VF"
    >
      Panier
    </Text>

    {error && (
      <Alert status="error" mb={6} borderRadius="xl">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}

    <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={{ base: 4, md: 8 }}>
      {/* Cart Items */}
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        {cartData.items.map((item) => (
          <Box
            key={item.id}
            bg="gray.50"
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Mobile Layout - Stack vertically */}
            <VStack spacing={4} align="stretch" display={{ base: "flex", md: "none" }}>
              {/* Product Image and Basic Info */}
              <HStack spacing={3} align="start">
                <Image
                  src={item.product_snapshot?.main_image_url}
                  alt={item.product_snapshot?.title}
                  boxSize="80px"
                  objectFit="cover"
                  borderRadius="lg"
                  bg="gray.100"
                  flexShrink={0}
                />
                <VStack align="start" spacing={2} flex={1} minW={0}>
                  <Text
                    fontWeight="bold"
                    fontSize="md"
                    lineHeight="1.4"
                    fontFamily="Airbnb Cereal VF"
                    color="gray.800"
                    noOfLines={2}
                  >
                    {item.product_snapshot?.title}
                  </Text>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontFamily="Airbnb Cereal VF"
                  >
                    SKU: {item.product?.sku}
                  </Text>
                </VStack>
                <IconButton
                  icon={
                    updatingItems.has(item.id) ? (
                      <Spinner size="xs" />
                    ) : (
                      <CiTrash size="16px" />
                    )
                  }
                  onClick={() => removeItem(item.id)}
                  isDisabled={updatingItems.has(item.id)}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  title="Retirer du panier"
                />
              </HStack>

              {/* Price, Quantity, Total Row */}
              <HStack justify="space-between" align="center" spacing={2}>
                {/* Price */}
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontSize="xs" color="gray.600">
                    Prix unitaire
                  </Text>
                  <Text
                    fontWeight="bold"
                    fontSize="sm"
                    color="gray.800"
                  >
                    {parseFloat(item.unit_price).toFixed(2)} €
                  </Text>
                  {item.product_snapshot?.regular_price_nett !==
                    item.product_snapshot?.final_price_nett && (
                    <Text
                      fontSize="xs"
                      textDecoration="line-through"
                      color="gray.400"
                      fontFamily="Airbnb Cereal VF"
                    >
                      {parseFloat(
                        item.product_snapshot?.regular_price_nett || 0
                      ).toFixed(2)} €
                    </Text>
                  )}
                </VStack>

                {/* Quantity */}
                <VStack align="center" spacing={1} flex={1}>
                  <Text fontSize="xs" color="gray.600">
                    Quantité
                  </Text>
                  <HStack spacing={1}>
                    <IconButton
                      icon={
                        updatingItems.has(item.id) ? (
                          <Spinner size="xs" />
                        ) : (
                          <FaMinus />
                        )
                      }
                      size="xs"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      isDisabled={
                        item.quantity <= 1 || updatingItems.has(item.id)
                      }
                      colorScheme="gray"
                      variant="outline"
                    />
                    <Text fontWeight="bold" minW="30px" textAlign="center" fontSize="sm" fontFamily="Airbnb Cereal VF">
                      {item.quantity}
                    </Text>
                    <IconButton
                      icon={
                        updatingItems.has(item.id) ? (
                          <Spinner size="xs" />
                        ) : (
                          <FaPlus />
                        )
                      }
                      size="xs"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      isDisabled={updatingItems.has(item.id)}
                      colorScheme="gray"
                      variant="outline"
                    />
                  </HStack>
                </VStack>

                {/* Total */}
                <VStack align="end" spacing={1} flex={1}>
                  <Text fontSize="xs" color="gray.600">
                    Total
                  </Text>
                  <Text fontWeight="600" fontSize="lg" color="black" fontFamily="Airbnb Cereal VF">
                    {parseFloat(item.total_price).toFixed(2)} €
                  </Text>
                </VStack>
              </HStack>
            </VStack>

            {/* Desktop Layout - Keep existing grid */}
            <Grid
              templateColumns="120px 1fr auto auto auto"
              gap={6}
              alignItems="start"
              mb={4}
              display={{ base: "none", md: "grid" }}
            >
              {/* Product Image */}
              <Image
                src={item.product_snapshot?.main_image_url}
                alt={item.product_snapshot?.title}
                boxSize="120px"
                objectFit="cover"
                borderRadius="lg"
                bg="gray.100"
              />

              {/* Product Details - Basic Info Only */}
              <VStack align="start" spacing={3} flex={1}>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  lineHeight="1.4"
                  fontFamily="Airbnb Cereal VF"
                  color="gray.800"
                >
                  {item.product_snapshot?.title}
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  fontFamily="Airbnb Cereal VF"
                >
                  SKU: {item.product?.sku}
                </Text>
              </VStack>

              {/* Price */}
              <VStack align="center" spacing={1} minW="100px">
                <Text fontSize="xs" color="gray.600" textAlign="center">
                  Prix unitaire
                </Text>
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color="gray.800"
                  textAlign="center"
                >
                  {parseFloat(item.unit_price).toFixed(2)} €
                </Text>
                {item.product_snapshot?.regular_price_nett !==
                  item.product_snapshot?.final_price_nett && (
                  <Text
                    fontSize="sm"
                    textDecoration="line-through"
                    color="gray.400"
                    textAlign="center"
                    fontFamily="Airbnb Cereal VF"
                  >
                    {parseFloat(
                      item.product_snapshot?.regular_price_nett || 0
                    ).toFixed(2)}{" "}
                    €
                  </Text>
                )}
              </VStack>

              {/* Quantity */}
              <VStack align="center" spacing={2} minW="120px">
                <Text fontSize="xs" color="gray.600">
                  Quantité
                </Text>
                <HStack spacing={1}>
                  <IconButton
                    icon={
                      updatingItems.has(item.id) ? (
                        <Spinner size="xs" />
                      ) : (
                        <FaMinus />
                      )
                    }
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    isDisabled={
                      item.quantity <= 1 || updatingItems.has(item.id)
                    }
                    colorScheme="gray"
                    variant="outline"
                  />
                  <Text fontWeight="bold" minW="40px" textAlign="center" fontFamily="Airbnb Cereal VF">
                    {item.quantity}
                  </Text>
                  <IconButton
                    icon={
                      updatingItems.has(item.id) ? (
                        <Spinner size="xs" />
                      ) : (
                        <FaPlus />
                      )
                    }
                    size="sm"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    isDisabled={updatingItems.has(item.id)}
                    colorScheme="gray"
                    variant="outline"
                  />
                </HStack>
              </VStack>

              {/* Total & Actions */}
              <VStack align="center" spacing={2} minW="120px">
                <Text fontSize="xs" color="gray.600">
                  Total
                </Text>
                <Text fontWeight="600" fontSize="xl" color="black" fontFamily="Airbnb Cereal VF">
                  {parseFloat(item.total_price).toFixed(2)} €
                </Text>
                <IconButton
                  icon={
                    updatingItems.has(item.id) ? (
                      <Spinner size="xs" />
                    ) : (
                      <CiTrash size="19px" />
                    )
                  }
                  onClick={() => removeItem(item.id)}
                  isDisabled={updatingItems.has(item.id)}
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  title="Retirer du panier"
                />
              </VStack>
            </Grid>

            {/* Full Width Customization Sections Below */}
            <VStack spacing={4} align="stretch" w="full">
              {/* Custom Options - Full Width */}
              {Array.isArray(item.selected_options) &&
                item.selected_options.length > 0 && (
                  <Box
                    w="full"
                    p={2}
                  >
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="600"
                      color="black"
                      mb={3}
                      fontFamily="Airbnb Cereal VF"
                    >
                      ✨ Configuration personnalisée
                    </Text>
                    <SimpleGrid
                      columns={{ base: 1, md: 1, lg: 2 }}
                      spacing={3}
                    >
                      {item.selected_options.map((opt, idx) => (
                        <Box
                          key={idx}
                          bg="#fff"
                          borderRadius="md"
                          p={{ base: 2, md: 1.5 }}
                          border="1px solid rgba(145, 158, 171, 0.2)"
                          shadow="sm"
                        >
                          <HStack spacing={2} align="center">
                            {/* Image */}
                            {opt.image_url && (
                              <Image
                                src={opt.image_url}
                                alt={opt.image_alt_text || opt.value_name}
                                boxSize={{ base: "60px", md: "100px" }}
                                borderRadius="none"
                                objectFit="cover"
                                flexShrink={0}
                              />
                            )}

                            {/* Content */}
                            <VStack
                              spacing={1}
                              align="start"
                              textAlign="start"
                              pl={2}
                              flex={1}
                              minW={0}
                            >
                              <Text
                                fontSize={{ base: "2xs", md: "xs" }}
                                color="gray.500"
                                fontWeight="500"
                                letterSpacing="wide"
                                fontFamily="Airbnb Cereal VF"
                                noOfLines={1}
                              >
                                Option: {opt.option_name}?
                              </Text>
                              <Text
                                fontSize={{ base: "xs", md: "sm" }}
                                color="gray.800"
                                fontWeight="500"
                                noOfLines={2}
                                lineHeight="1.3"
                                fontFamily="Airbnb Cereal VF"
                              >
                                Choisie: {opt.value_name}
                              </Text>

                              {/* Price modifier */}
                              {opt.price_modifier &&
                                parseFloat(opt.price_modifier) !== 0 && (
                                  <Text
                                    fontSize={{ base: "2xs", md: "xs" }}
                                    color="green.600"
                                    fontWeight="500"
                                    bg="green.100"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    textAlign="center"
                                    fontFamily="Airbnb Cereal VF"
                                  >
                                    +
                                    {parseFloat(
                                      opt.price_modifier
                                    ).toFixed(2)}{" "}
                                    €
                                  </Text>
                                )}

                                {opt.price_modifier &&
                                parseFloat(opt.price_modifier) == 0 && (
                                  <Text
                                    fontSize={{ base: "2xs", md: "xs" }}
                                    color="green.600"
                                    fontWeight="500"
                                    bg="green.100"
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                    textAlign="center"
                                    fontFamily="Airbnb Cereal VF"
                                  >
                                    Included
                                  </Text>
                                )}
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

              {/* Dimensions - Full Width */}
              {item.dimensions &&
                Object.keys(item.dimensions).length > 0 && (
                  <Box
                    w="full"
                    bg="#fff"
                    borderRadius="lg"
                    p={{ base: 3, md: 4 }}
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="bold"
                      color="blue.700"
                      mb={3}
                    >
                      📏 Dimensions sur mesure
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2}>
                      {Object.entries(item.dimensions).map(
                        ([key, value]) => (
                          <HStack
                            key={key}
                            bg="white"
                            px={{ base: 2, md: 3 }}
                            py={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="blue.200"
                            shadow="sm"
                            spacing={1}
                          >
                            <Text
                              fontSize={{ base: "2xs", md: "xs" }}
                              color="blue.600"
                              fontWeight="medium"
                              noOfLines={1}
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}:
                            </Text>
                            <Text
                              fontSize={{ base: "xs", md: "sm" }}
                              color="gray.800"
                              fontWeight="bold"
                            >
                              {value} cm
                            </Text>
                          </HStack>
                        )
                      )}
                    </SimpleGrid>
                  </Box>
                )}

              {/* Services - Full Width */}
              {item.selected_services &&
                Object.keys(item.selected_services).length > 0 && (
                  <Box
                    w="full"
                    bg="purple.50"
                    borderRadius="lg"
                    p={{ base: 3, md: 4 }}
                    border="1px solid"
                    borderColor="purple.200"
                  >
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight="bold"
                      color="purple.700"
                      mb={3}
                    >
                      🔧 Services additionnels
                    </Text>
                    <VStack align="start" spacing={2}>
                      {Object.entries(item.selected_services).map(
                        ([key, value]) => (
                          <VStack
                            key={key}
                            bg="white"
                            px={{ base: 2, md: 3 }}
                            py={2}
                            borderRadius="md"
                            border="1px solid"
                            borderColor="purple.200"
                            w="full"
                            shadow="sm"
                            align="start"
                            spacing={1}
                          >
                            <Text
                              fontSize={{ base: "2xs", md: "xs" }}
                              color="purple.600"
                              fontWeight="medium"
                            >
                              {key}:
                            </Text>
                            <Text
                              fontSize={{ base: "xs", md: "sm" }}
                              color="gray.800"
                              fontWeight="semibold"
                              wordBreak="break-word"
                            >
                              {Array.isArray(value)
                                ? value.join(", ")
                                : value}
                            </Text>
                          </VStack>
                        )
                      )}
                    </VStack>
                  </Box>
                )}
            </VStack>
          </Box>
        ))}
      </VStack>

      {/* Order Summary */}
      <Box
        bg="white"
        borderRadius="xl"
        p={{ base: 4, md: 6 }}
        shadow="sm"
        border="1px"
        borderColor="gray.200"
        h="fit-content"
        position={{ base: "relative", lg: "sticky" }}
        top={{ lg: "20px" }}
      >
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="500" mb={6} color="gray.800" fontFamily="Airbnb Cereal VF">
          Total de la commande:
        </Text>

        {/* Promotion Code */}
        <Box mb={6}>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            mb={3}
            color="gray.700"
            fontFamily="Airbnb Cereal VF"
          >
            Code de réduction
          </Text>
          <InputGroup size={{ base: "sm", md: "md" }}>
            <Input
              placeholder="Nouveau code de réduction"
              value={promotionCode}
              onChange={(e) => setPromotionCode(e.target.value)}
              borderRadius="md"
              bg="gray.50"
              border="1px"
              borderColor="gray.200"
              _focus={{ borderColor: "orange.400", bg: "white" }}
              fontFamily="Airbnb Cereal VF"
              fontSize={{ base: "sm", md: "md" }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h={{ base: "1.5rem", md: "1.75rem" }}
                size="sm"
                onClick={applyPromotion}
                isLoading={promotionLoading}
                isDisabled={!promotionCode.trim()}
                bg='black'
                color='white'
                _hover={{ bg: 'gray.800' }}
                _focus={{ bg: 'gray.800' }}
                _active={{ bg: 'gray.800' }}
                fontSize="xs"
                fontFamily="Airbnb Cereal VF"
              >
                Appliquer
              </Button>
            </InputRightElement>
          </InputGroup>

          {cartData.applied_promotion_code && (
            <HStack
              mt={2}
              p={2}
              bg="green.50"
              borderRadius="md"
              justify="space-between"
            >
              <HStack spacing={2}>
                <FaTag color="green" size={12} />
                <Text fontSize="sm" color="green.700" fontFamily="Airbnb Cereal VF" noOfLines={1}>
                  {cartData.applied_promotion_code}
                </Text>
              </HStack>
              <IconButton
                icon={<FaTimes />}
                size="xs"
                onClick={removePromotion}
                colorScheme="red"
                variant="ghost"
              />
            </HStack>
          )}
        </Box>

        {/* Gift Card */}
        <Box mb={6}>
          <Text
            fontSize="sm"
            fontWeight="600"
            mb={3}
            color="gray.700"
            fontFamily="Airbnb Cereal VF"
          >
            Cartes-cadeaux / Bons d'achat
          </Text>
          <InputGroup size={{ base: "sm", md: "md" }}>
            <Input
              placeholder="Cartes-cadeaux / Bons d'achat"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value)}
              borderRadius="md"
              bg="gray.50"
              border="1px"
              borderColor="gray.200"
              _focus={{ borderColor: "orange.400", bg: "white" }}
              fontSize={{ base: "sm", md: "md" }}
            />
            <InputRightElement width="4.5rem">
              <Button
                h={{ base: "1.5rem", md: "1.75rem" }}
                size="sm"
                onClick={applyGiftCard}
                isLoading={giftCardLoading}
                isDisabled={!giftCardCode.trim()}
                bg='black'
                color='white'
                _hover={{ bg: 'gray.800' }}
                _focus={{ bg: 'gray.800' }}
                _active={{ bg: 'gray.800' }}
                fontSize="xs"
              >
                Appliquer
              </Button>
            </InputRightElement>
          </InputGroup>

          {cartData.applied_gift_card_code && (
            <HStack
              mt={2}
              p={2}
              bg="purple.50"
              borderRadius="md"
              justify="space-between"
              fontFamily="Airbnb Cereal VF"
            >
              <HStack spacing={2}>
                <FaGift color="purple" size={12} />
                <Text fontSize="sm" color="purple.700" fontFamily="Airbnb Cereal VF" noOfLines={1}>
                  {cartData.applied_gift_card_code}
                </Text>
              </HStack>
              <IconButton
                icon={<FaTimes />}
                size="xs"
                onClick={removeGiftCard}
                colorScheme="red"
                variant="ghost"
              />
            </HStack>
          )}
        </Box>

        <Divider my={4} />

        {/* Summary Details */}
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.600" fontFamily="Airbnb Cereal VF">
              Sous-total:
            </Text>
            <Text fontWeight="semibold" fontFamily="Airbnb Cereal VF">
              {cartData.subtotal?.toFixed(2)} €
            </Text>
          </HStack>

          <HStack justify="space-between">
            <Text fontSize="sm" color="gray.500" fontStyle="italic" fontFamily="Airbnb Cereal VF">
              Impôts
            </Text>
            <Text fontWeight="semibold" color="gray.500" fontFamily="Airbnb Cereal VF">
              {(cartData.tax || 0).toFixed(2)} €
            </Text>
          </HStack>

          {cartData.promotion_discount > 0 && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="orange.600" fontFamily="Airbnb Cereal VF" noOfLines={1}>
                Remise promotionnelle:
              </Text>
              <Text fontWeight="semibold" color="orange.600" fontFamily="Airbnb Cereal VF">
                -{cartData.promotion_discount.toFixed(2)} €
              </Text>
            </HStack>
          )}

          {cartData.gift_card_discount > 0 && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="purple.600" fontFamily="Airbnb Cereal VF" noOfLines={1}>
                Remise sur les cartes-cadeaux:
              </Text>
              <Text fontWeight="semibold" color="purple.600" fontFamily="Airbnb Cereal VF">
                -{cartData.gift_card_discount.toFixed(2)} €
              </Text>
            </HStack>
          )}

          {cartData.shipping_discount > 0 && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="blue.600" fontFamily="Airbnb Cereal VF" noOfLines={1}>
                Rabais sur les transports:
              </Text>
              <Text fontWeight="semibold" color="blue.600" fontFamily="Airbnb Cereal VF">
                -{cartData.shipping_discount.toFixed(2)} €
              </Text>
            </HStack>
          )}
        </VStack>

        <Divider my={4} />

        {/* Total */}
        <HStack justify="space-between" mb={6}>
          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" color="gray.800" fontFamily="Airbnb Cereal VF">
            Total:
          </Text>
          <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="600" color="black" fontFamily="Airbnb Cereal VF">
            {cartData.total?.toFixed(2)} €
          </Text>
        </HStack>

        {/* Checkout Button */}
        <Button
          w="full"
          size={{ base: "md", md: "lg" }}
          bg='#0d00ffff'
          color='white'
          onClick={proceedToCheckout}
          isDisabled={cartData.total <= 0}
          borderRadius="lg"
          py={{ base: 4, md: 6 }}
          fontSize={{ base: "sm", md: "sm" }}
          fontWeight="600"
          letterSpacing="wider"
          _hover={{ transform: "translateY(-1px)", shadow: "lg" }}
          transition="all 0.2s"
          fontFamily="Airbnb Cereal VF"
        >
          Aller
        </Button>
      </Box>
    </Grid>
  </Container>
</Box>

      <Footer />
    </>
  );
};

export default CartPage;