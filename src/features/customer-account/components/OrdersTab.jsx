import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  Badge,
  Flex,
  SimpleGrid,
  Icon,
  Skeleton,
  Select,
  Divider,
  Image as ChakraImage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useBreakpointValue,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaFilter,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaShoppingBag,
  FaChevronDown,
  FaClipboardCheck,
  FaCreditCard,
  FaTruck,
  FaPhone,
  FaCalculator,
  FaUniversity,
  FaUndo,
  FaSearch,
  FaMapMarkerAlt,
  FaDownload,
  FaRegCreditCard,
  FaExternalLinkAlt,
} from "react-icons/fa";

const OrdersTab = ({
  orders,
  ordersLoading,
  ordersError,
  ordersFilters,
  setOrdersFilters,
  fetchOrders,
  expandedOrders,
  toggleOrderExpansion,
  getStatusColor,
  getStatusProgress,
  getStatusTimeline,
  formatDate,
  getStatusDisplayName,
  hasCustomizations,
  ordersPagination,
  cancelOrderModal,
  closeCancelOrderModal,
  setCancelOrderModal,
  openCancelOrderModal,
  handleSubmitCancelOrder,
  handleCompletePayment,
}) => {
  // Custom color schemes for better theme integration
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.800");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const highlightColor = useColorModeValue("blue.500", "blue.300");
  const filterBg = useColorModeValue("white", "gray.700");
  const emptyIconColor = useColorModeValue("gray.300", "gray.600");
  const errorIconColor = useColorModeValue("red.400", "red.300");

  // Responsive values
  const filterColumns = useBreakpointValue({ base: 1, md: 3 });
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Mock function to handle order tracking
  const handleTrackOrder = (orderNumber) => {
    // Implement tracking functionality
  };

  // Mock function to handle invoice download
  const handleDownloadInvoice = (orderId) => {
    // Implement download functionality
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount || 0);
  };

  return (
    <VStack spacing={6} align="stretch" maxW="100%">
      {/* Clean, minimalist header */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        justify="space-between"
        align={{ base: "stretch", md: "flex-end" }}
        gap={4}
        mb={2}
      >
        <Box>
          <Text 
            fontSize={{ base: "xl", md: "2xl" }} 
            fontWeight="600" 
            color={useColorModeValue("gray.800", "white")}
            mb={1}
          >
            Historique des commandes
          </Text>
          <Text fontSize="sm" color={mutedText}>
            {orders?.length || 0} commande(s) trouvée(s)
          </Text>
        </Box>

        {/* Streamlined search */}
        <InputGroup size="md" maxW={{ base: "full", md: "320px" }}>
          <Input
            placeholder="Rechercher par numéro..."
            rounded="md"
            value={ordersFilters?.search || ""}
            onChange={(e) => {
              const newFilters = {
                ...ordersFilters,
                search: e.target.value,
              };
              setOrdersFilters(newFilters);
            }}
            bg={filterBg}
            _focus={{
              borderColor: highlightColor,
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
          />
          <InputRightElement>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => fetchOrders({ ...ordersFilters, page: 1 })}
            >
              <Icon as={FaSearch} color={mutedText} />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Flex>

      {/* Simple filter bar - Walmart inspired */}
      <Box
        bg={filterBg}
        p={4}
        borderRadius="md"
        boxShadow="sm"
        border="1px solid"
        borderColor={borderColor}
      >
        <SimpleGrid columns={filterColumns} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" mb={1}>
              Statut
            </FormLabel>
            <Select
              size="md"
              value={ordersFilters.status}
              onChange={(e) => {
                const newFilters = {
                  ...ordersFilters,
                  status: e.target.value,
                };
                setOrdersFilters(newFilters);
                fetchOrders({ ...newFilters, page: 1 });
              }}
              placeholder="Tous les statuts"
              bg={filterBg}
              rounded="md"
            >
              <option value="pending">En attente</option>
              <option value="processing">Traitement</option>
              <option value="paid">Payé</option>
              <option value="shipped">Expédié</option>
              <option value="completed">Livré</option>
              <option value="cancelled">Annulé</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" mb={1}>
              Période
            </FormLabel>
            <Grid templateColumns="1fr auto 1fr" gap={2}>
              <Input
                type="date"
                size="md"
                value={ordersFilters.fromDate}
                onChange={(e) => {
                  const newFilters = {
                    ...ordersFilters,
                    fromDate: e.target.value,
                  };
                  setOrdersFilters(newFilters);
                  fetchOrders({ ...newFilters, page: 1 });
                }}
                bg={filterBg}
                rounded="md"
              />
              <Text alignSelf="center">-</Text>
              <Input
                type="date"
                size="md"
                value={ordersFilters.toDate}
                onChange={(e) => {
                  const newFilters = {
                    ...ordersFilters,
                    toDate: e.target.value,
                  };
                  setOrdersFilters(newFilters);
                  fetchOrders({ ...newFilters, page: 1 });
                }}
                bg={filterBg}
                rounded="md"
              />
            </Grid>
          </FormControl>

          <FormControl display="flex" alignItems="flex-end">
            <Button
              size="md"
              variant="outline"
              colorScheme="blue"
              rounded="md"
              w="full"
              onClick={() => {
                const clearedFilters = {
                  status: "",
                  fromDate: "",
                  toDate: "",
                  search: "",
                };
                setOrdersFilters(clearedFilters);
                fetchOrders({ ...clearedFilters, page: 1 });
              }}
              leftIcon={<Icon as={FaFilter} />}
            >
              Réinitialiser
            </Button>
          </FormControl>
        </SimpleGrid>
      </Box>

      {/* Loading state */}
      {ordersLoading ? (
        <VStack spacing={4} width="100%">
          {[...Array(3)].map((_, index) => (
            <Box
              key={index}
              bg={cardBg}
              borderRadius="md"
              boxShadow="sm"
              width="100%"
              overflow="hidden"
              p={4}
            >
              <Flex justify="space-between" mb={4}>
                <Skeleton height="24px" width="140px" />
                <Skeleton height="22px" width="100px" />
              </Flex>
              <Skeleton height="16px" width="60%" mb={3} />
              <Skeleton height="16px" width="40%" mb={5} />
              <Flex justify="space-between" align="center">
                <Skeleton height="14px" width="120px" />
                <Skeleton height="34px" width="120px" borderRadius="md" />
              </Flex>
            </Box>
          ))}
        </VStack>
      ) : ordersError ? (
        // Error state
        <Box
          bg={cardBg}
          borderRadius="md"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
          py={10}
          px={6}
        >
          <Icon as={FaExclamationTriangle} boxSize={10} color={errorIconColor} mb={4} />
          <Text fontSize="lg" fontWeight="600" mb={2} color="red.500">
            Erreur lors du chargement des commandes
          </Text>
          <Text fontSize="md" color={mutedText} maxW="500px" mx="auto" mb={6}>
            {ordersError}
          </Text>
          <Button
            colorScheme="blue"
            onClick={() => fetchOrders()}
            size="md"
            leftIcon={<Icon as={FaUndo} />}
          >
            Réessayer
          </Button>
        </Box>
      ) : orders.length === 0 ? (
        // Empty state
        <Box
          bg={cardBg}
          borderRadius="md"
          boxShadow="sm"
          border="1px solid"
          borderColor={borderColor}
          textAlign="center"
          py={12}
          px={6}
        >
          <Text fontSize="lg" fontWeight="600" mb={2}>
            Aucune commande trouvée
          </Text>
          <Text fontSize="md" color={mutedText} maxW="500px" mx="auto" mb={6}>
            {ordersFilters.status || ordersFilters.fromDate || ordersFilters.toDate
              ? "Essayez d'ajuster vos filtres pour voir plus de résultats"
              : "Vos commandes apparaîtront ici une fois que vous aurez effectué un achat"}
          </Text>
        </Box>
      ) : (
        // Orders list - Clean, minimal design inspired by Amazon & Walmart
        <VStack spacing={4} align="stretch">
          {orders.map((order) => {
            const statusColor = getStatusColor(order.status);
            const isExpanded = expandedOrders.has(order.id);
            const orderDate = new Date(order.created_at);
            const isCancelled = ["cancelled", "order_cancel_request"].includes(order.status?.toLowerCase());

            return (
              <Box
                key={order.id}
                bg={cardBg}
                borderRadius="md"
                boxShadow="sm"
                border="1px solid"
                borderColor={borderColor}
                overflow="hidden"
                transition="all 0.2s"
                _hover={{
                  boxShadow: "md",
                  borderColor: "gray.300",
                }}
              >
                {/* Order header - Clean, minimal header with essential info only */}
                <Flex 
                  p={4}
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  borderBottom="1px solid"
                  borderColor={borderColor}
                  bg={headerBg}
                  gap={2}
                >
                  <Grid 
                    templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
                    gap={4}
                    width={{ base: "100%", md: "auto" }}
                  >
                    {/* Order date */}
                    <Box>
                      <Text fontSize="xs" color={mutedText} mb={1}>
                        COMMANDE PASSÉE
                      </Text>
                      <Text fontSize="sm" fontWeight="500">
                        {orderDate.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </Text>
                    </Box>

                    {/* Order total */}
                    <Box>
                      <Text fontSize="xs" color={mutedText} mb={1}>
                        TOTAL
                      </Text>
                      <Text fontSize="sm" fontWeight="600">
                        {formatCurrency(order.total)}
                      </Text>
                    </Box>

                    {/* Order number */}
                    <Box>
                      <Text fontSize="xs" color={mutedText} mb={1}>
                        COMMANDE N°
                      </Text>
                      <Text fontSize="sm" fontWeight="500" color={highlightColor}>
                        {order.order_number}
                      </Text>
                    </Box>
                  </Grid>

                  {/* Status badge - Clean, minimal status indicator */}
                  <Flex 
                    align="center" 
                    justify={{ base: "flex-start", md: "flex-end" }}
                    pt={{ base: 2, md: 0 }}
                    borderTop={{ base: "1px solid", md: "none" }}
                    borderColor={{ base: borderColor, md: "transparent" }}
                    mt={{ base: 2, md: 0 }}
                  >
                    <Badge
                      colorScheme={statusColor}
                      px={3}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="500"
                      textTransform="capitalize"
                      mb={{ base: 1, md: 0 }}
                    >
                      {getStatusDisplayName(order.status)}
                    </Badge>
                  </Flex>
                </Flex>

                {/* Order content - Clean, minimal content */}
                <Box p={4}>
                  {/* Products summary */}
                  <Flex 
                    direction={{ base: "column", md: "row" }} 
                    gap={5} 
                    mb={4}
                    align={{ base: "flex-start", md: "center" }}
                  >
                    {/* Product thumbnails */}
                    <Flex gap={2} flexWrap="wrap" minW={{ md: "160px" }}>
                      {order.items && order.items.slice(0, 3).map((item, itemIndex) => (
                        <Box key={itemIndex} position="relative">
                          <ChakraImage
                            src={item?.product_snapshot?.main_image_url}
                            alt={item?.product_snapshot?.title || "Produit"}
                            boxSize={{ base: "50px", md: "60px" }}
                            objectFit="cover"
                            borderRadius="md"
                            border="1px solid"
                            borderColor={borderColor}
                            fallbackSrc="https://via.placeholder.com/60"
                          />
                          {item.quantity > 1 && (
                            <Badge
                              position="absolute"
                              bottom="0"
                              right="0"
                              bg="blackAlpha.700"
                              color="white"
                              fontSize="xs"
                              px={1}
                              py={0.5}
                              borderRadius="sm"
                            >
                              {item.quantity}
                            </Badge>
                          )}
                        </Box>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <Flex
                          boxSize={{ base: "50px", md: "60px" }}
                          bg="gray.50"
                          borderRadius="md"
                          border="1px solid"
                          borderColor={borderColor}
                          justify="center"
                          align="center"
                          fontSize="xs"
                          fontWeight="500"
                          color={mutedText}
                        >
                          +{order.items.length - 3}
                        </Flex>
                      )}
                    </Flex>

                    {/* Order summary */}
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="500" mb={1}>
                        {order.items?.length} {order.items?.length === 1 ? "article" : "articles"}
                      </Text>
                      {order.items && order.items.length > 0 && (
                        <Text fontSize="sm" color={mutedText} noOfLines={1}>
                          {order.items.map(item => item.product_snapshot?.title).slice(0, 2).join(", ")}
                          {order.items.length > 2 ? "..." : ""}
                        </Text>
                      )}
                    </Box>

                    {/* Primary action buttons */}
                    <Flex 
                      gap={2} 
                      wrap="wrap" 
                      justify={{ base: "flex-start", md: "flex-end" }}
                      mt={{ base: 3, md: 0 }}
                    >
                      {/* Status-based primary action */}
                      {/* {["shipped", "on_delivery", "in_transit"].includes(order.status?.toLowerCase()) && (
                        <Button
                          leftIcon={<FaTruck />}
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleTrackOrder(order.order_number)}
                          rounded="md"
                        >
                          Suivre
                        </Button>
                      )} */}
                      
                      {/* {(order.status === "completed" || order.status === "shipped" || order.status === "paid") && (
                        <Button
                          leftIcon={<FaDownload />}
                          variant="outline"
                          colorScheme="blue"
                          size="sm"
                          onClick={() => handleDownloadInvoice(order.id)}
                          rounded="md"
                        >
                          Facture
                        </Button>
                      )} */}

                      {order.payment_method === "credit_card" && order.payment_status === "pending" && (
                        <Button
                          leftIcon={<FaRegCreditCard />}
                          colorScheme="green"
                          size="sm"
                          onClick={() => handleCompletePayment(order.id)}
                          rounded="md"
                        >
                          Payer
                        </Button>
                      )}

                      {["pending", "pending_payment", "processing"].includes(order.status?.toLowerCase()) && (
                        <Button
                          leftIcon={<FaUndo />}
                          colorScheme="red"
                          variant="outline"
                          size="sm"
                          onClick={() => openCancelOrderModal(order.id)}
                          rounded="md"
                        >
                          Annuler
                        </Button>
                      )}
                      
                      {/* View details button */}
                      <Button
                        rightIcon={<FaChevronDown />}
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpansion(order.id)}
                        rounded="md"
                      >
                        Détails
                      </Button>
                    </Flex>
                  </Flex>

                  {/* Delivery info - Only for shipped orders */}
                  {!isCancelled && ["shipped", "on_delivery", "in_transit"].includes(order.status?.toLowerCase()) && (
                    <Box 
                      p={3} 
                      bg={`${statusColor}.50`} 
                      borderRadius="md" 
                      mb={4}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Icon as={FaTruck} color={`${statusColor}.500`} />
                      <Text fontSize="sm" fontWeight="500" color={`${statusColor}.700`}>
                        Livraison prévue le {new Date(orderDate.getTime() + 7*24*60*60*1000).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long"
                        })}
                      </Text>
                    </Box>
                  )}

                  {/* Expanded details */}
                  {isExpanded && (
                    <Box
                      mt={4}
                      pt={4}
                      borderTop="1px solid"
                      borderColor={borderColor}
                      animation="fadeIn 0.2s ease"
                    >
                      {/* Clean 2-column layout for order details */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <Box>
                          <Text fontSize="sm" fontWeight="600" mb={3}>
                            Articles commandés
                          </Text>
                          
                          <VStack 
                            spacing={4} 
                            align="stretch" 
                            bg={useColorModeValue("gray.50", "gray.700")}
                            p={3}
                            borderRadius="md"
                          >
                            {order.items && order.items.map((item, itemIndex) => (
                              <Flex key={itemIndex} gap={3}>
                                <ChakraImage
                                  src={item?.product_snapshot?.main_image_url}
                                  alt={item?.product_snapshot?.title}
                                  boxSize="50px"
                                  objectFit="cover"
                                  borderRadius="md"
                                  bg="white"
                                  fallbackSrc="https://via.placeholder.com/50"
                                />
                                <Box flex="1">
                                  <Text fontSize="sm" fontWeight="500" mb={0.5} noOfLines={2}>
                                    {item.product_snapshot?.title || "Produit"}
                                  </Text>
                                  <Flex justify="space-between" fontSize="sm">
                                    <Text color={mutedText}>
                                      Qté: {item.quantity}
                                    </Text>
                                    <Text fontWeight="500">
                                      {formatCurrency(item.total_price)}
                                    </Text>
                                  </Flex>
                                </Box>
                              </Flex>
                            ))}
                          </VStack>
                          
                          {/* Order summary */}
                          <Box mt={4}>
                            <Text fontSize="sm" fontWeight="600" mb={3}>
                              Résumé
                            </Text>
                            <VStack 
                              align="stretch" 
                              fontSize="sm" 
                              spacing={2}
                              bg={useColorModeValue("gray.50", "gray.700")}
                              p={3}
                              borderRadius="md"
                            >
                              <Flex justify="space-between">
                                <Text color={mutedText}>Sous-total:</Text>
                                <Text>{formatCurrency(order.subtotal)}</Text>
                              </Flex>
                              {order.shipping_fee > 0 && (
                                <Flex justify="space-between">
                                  <Text color={mutedText}>Livraison:</Text>
                                  <Text>{formatCurrency(order.shipping_fee)}</Text>
                                </Flex>
                              )}
                              {order.tax > 0 && (
                                <Flex justify="space-between">
                                  <Text color={mutedText}>TVA:</Text>
                                  <Text>{formatCurrency(order.tax)}</Text>
                                </Flex>
                              )}
                              <Divider my={1} />
                              <Flex justify="space-between" fontWeight="600">
                                <Text>Total:</Text>
                                <Text>{formatCurrency(order.total)}</Text>
                              </Flex>
                            </VStack>
                          </Box>
                        </Box>
                        
                        <Box>
                          {/* Payment information */}
                          <Text fontSize="sm" fontWeight="600" mb={3}>
                            Paiement
                          </Text>
                          <Box
                            bg={useColorModeValue("gray.50", "gray.700")}
                            p={3}
                            borderRadius="md"
                            mb={4}
                          >
                            <Flex align="center" mb={2}>
                              <Icon 
                                as={order.payment_method === "credit_card" ? FaCreditCard : FaUniversity}
                                mr={2}
                                color={order.payment_method === "credit_card" ? "purple.500" : "blue.500"}
                              />
                              <Text fontSize="sm">
                                {order.payment_method === "credit_card" ? "Carte de crédit" : "Virement bancaire"}
                              </Text>
                            </Flex>
                            
                            <Flex align="center" mb={1}>
                              <Text fontSize="xs" color={mutedText} mr={2}>
                                Statut:
                              </Text>
                              <Badge
                                colorScheme={
                                  order.payment_status === "paid"
                                    ? "green"
                                    : order.payment_status === "failed"
                                    ? "red"
                                    : "yellow"
                                }
                                fontSize="xs"
                              >
                                {order.payment_status === "paid"
                                  ? "Payé"
                                  : order.payment_status === "failed"
                                  ? "Échoué"
                                  : "En attente"}
                              </Badge>
                            </Flex>
                            {order.payment_date && (
                              <Text fontSize="xs" color={mutedText}>
                                Date: {new Date(order.payment_date).toLocaleDateString()}
                              </Text>
                            )}
                          </Box>
                          
                          {/* Shipping information */}
                          <Text fontSize="sm" fontWeight="600" mb={3}>
                            Adresse de livraison
                          </Text>
                          <Box
                            bg={useColorModeValue("gray.50", "gray.700")}
                            p={3}
                            borderRadius="md"
                          >
                            {order.shipping_address ? (
                              <VStack align="start" spacing={1} fontSize="sm">
                                <Text fontWeight="500">
                                  {order.shipping_address.street}
                                </Text>
                                <Text>
                                  {order.shipping_address.city}, {order.shipping_address.postal_code}
                                </Text>
                                <Text>
                                  {order.shipping_address.country}
                                </Text>
                                {order.shipping_address.phone && (
                                  <Flex align="center" mt={1} fontSize="xs" color={mutedText}>
                                    <Icon as={FaPhone} boxSize="3" mr={1} />
                                    {order.shipping_address.phone}
                                  </Flex>
                                )}
                              </VStack>
                            ) : (
                              <Text fontSize="sm" color={mutedText}>
                                Aucune adresse fournie
                              </Text>
                            )}
                          </Box>

                          {/* Action buttons */}
                          {/* {!isCancelled && (
                            <Flex mt={4} gap={2}>
                              
                              {(order.status === "completed" || order.status === "shipped" || order.status === "paid") && (
                                <Button
                                  leftIcon={<FaDownload />}
                                  size="sm"
                                  colorScheme="blue"
                                  onClick={() => handleDownloadInvoice(order.id)}
                                  flex="1"
                                >
                                  Télécharger la facture
                                </Button>
                              )}
                            </Flex>
                          )} */}
                        </Box>
                      </SimpleGrid>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}

          {/* Simplified pagination - Inspired by Amazon */}
          {orders.length > 0 && ordersPagination.totalPages > 1 && (
            <Flex justify="center" mt={6} wrap="wrap" gap={2}>
              <Button
                size="sm"
                onClick={() => fetchOrders({ ...ordersFilters, page: ordersPagination.page - 1 })}
                isDisabled={ordersPagination.page === 1}
                rounded="md"
              >
                Précédent
              </Button>
              
              <Text display="flex" alignItems="center" px={2} fontSize="sm" color={mutedText}>
                Page {ordersPagination.page} sur {ordersPagination.totalPages}
              </Text>
              
              <Button
                size="sm"
                onClick={() => fetchOrders({ ...ordersFilters, page: ordersPagination.page + 1 })}
                isDisabled={ordersPagination.page === ordersPagination.totalPages}
                rounded="md"
              >
                Suivant
              </Button>
            </Flex>
          )}
        </VStack>
      )}

      {/* Cancel Order Modal - Clean, minimal design */}
      <Modal
        isOpen={cancelOrderModal.isOpen}
        onClose={closeCancelOrderModal}
        isCentered
        size="md"
      >
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent rounded="md">
          <ModalHeader borderBottom="1px solid" borderColor={borderColor}>
            Annulation de commande
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={5}>
            <Text mb={4}>
              Veuillez indiquer la raison de l'annulation de cette commande.
            </Text>
            
            <FormControl isRequired isInvalid={!!cancelOrderModal.error}>
              <Input
                value={cancelOrderModal.reason}
                onChange={(e) =>
                  setCancelOrderModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                    error: null,
                  }))
                }
                placeholder="Raison de l'annulation"
                rounded="md"
              />
              <FormErrorMessage>{cancelOrderModal.error}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          
          <ModalFooter gap={3} borderTop="1px solid" borderColor={borderColor}>
            <Button 
              variant="outline" 
              onClick={closeCancelOrderModal}
              rounded="md"
            >
              Annuler
            </Button>
            <Button
              colorScheme="red"
              onClick={handleSubmitCancelOrder}
              isLoading={cancelOrderModal.loading}
              isDisabled={!cancelOrderModal.reason}
              rounded="md"
            >
              Confirmer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default OrdersTab;