// filepath: /Users/bashclay/Desktop/dev/dev-local/as-solutions-fourniture-e-commerce-system/client/src/features/customer-account/components/OrdersList.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Skeleton,
  FormControl,
  FormLabel,
  Select,
  Input,
  Icon,
  Flex,
  SimpleGrid,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormErrorMessage,
  useDisclosure,
  Image as ChakraImage,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaExclamationTriangle,
  FaShoppingBag,
  FaFilter,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaCreditCard,
  FaUniversity,
  FaCalculator,
  FaClipboardCheck,
  FaCog,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaPhone,
  FaTicketAlt,
  FaUndo,
  FaPalette,
  FaTools,
} from "react-icons/fa";

const OrdersList = ({
  orders,
  ordersLoading,
  ordersError,
  ordersFilters,
  setOrdersFilters,
  fetchOrders,
  ordersPagination,
  cancelOrderModal,
  setCancelOrderModal,
  handleCompletePayment,
  handleSubmitCancelOrder,
}) => {
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subtleColor = useColorModeValue("gray.500", "gray.400");

  // Helper functions
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "yellow";
      case "processing":
        return "blue";
      case "paid":
        return "green";
      case "shipped":
        return "purple";
      case "on_delivery":
        return "orange";
      case "in_transit":
        return "cyan";
      case "in_customs":
        return "pink";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "pending_payment":
        return "orange";
      case "order_cancel_request":
        return "red";
      default:
        return "gray";
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusProgress = (status) => {
    const statusFlow = {
      pending: 16.67,
      processing: 33.33,
      paid: 50,
      shipped: 66.67,
      on_delivery: 83.33,
      in_transit: 83.33,
      in_customs: 83.33,
      completed: 100,
      cancelled: 0,
      pending_payment: 16.67,
      order_cancel_request: 0,
    };

    return statusFlow[status?.toLowerCase()] || 0;
  };

  const getStatusTimeline = (status) => {
    const timeline = [
      { key: "pending", label: "Commande passée", icon: FaClipboardCheck },
      { key: "processing", label: "Traitement", icon: FaCog },
      { key: "paid", label: "Paiement confirmé", icon: FaCreditCard },
      { key: "shipped", label: "Expédié", icon: FaBox },
      { key: "on_delivery", label: "En livraison", icon: FaTruck },
      { key: "completed", label: "Livré", icon: FaCheckCircle },
    ];

    const currentStatusIndex = timeline.findIndex(
      (item) => item.key === status?.toLowerCase()
    );

    return timeline.map((item, index) => ({
      ...item,
      isActive: index === currentStatusIndex,
      isCompleted: index < currentStatusIndex,
      isPending: index > currentStatusIndex,
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusDisplayName = (status) => {
    const statusMap = {
      pending: "En attente",
      processing: "Traitement",
      paid: "Payé",
      shipped: "Expédié",
      on_delivery: "En livraison",
      in_transit: "En transit",
      in_customs: "En douane",
      completed: "Terminé",
      cancelled: "Annulé",
      pending_payment: "Paiement en attente",
      order_cancel_request: "Annulation demandée",
    };
    return statusMap[status?.toLowerCase()] || status;
  };

  // Handler to open the cancel modal
  const openCancelOrderModal = (orderId) => {
    setCancelOrderModal({
      isOpen: true,
      orderId,
      loading: false,
      reason: "",
      error: null,
    });
  };

  // Handler to close the cancel modal
  const closeCancelOrderModal = () => {
    setCancelOrderModal({
      isOpen: false,
      orderId: null,
      loading: false,
      reason: "",
      error: null,
    });
  };

  // Helper function to check if an item has customizations
  const hasCustomizations = (item) => {
    const hasOptions =
      item.selected_options &&
      Array.isArray(item.selected_options) &&
      item.selected_options.length > 0;

    const hasDimensions =
      item.dimensions &&
      typeof item.dimensions === "object" &&
      Object.keys(item.dimensions).length > 0;

    const hasServices =
      item.selected_services &&
      Array.isArray(item.selected_services) &&
      item.selected_services.length > 0;

    return hasOptions || hasDimensions || hasServices;
  };

  return (
    <VStack spacing={6} align="stretch" maxW="100%">
      {/* Enhanced Header */}
      <Box
        bg={cardBg}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={4} align="stretch">
          <Flex
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 3, md: 0 }}
          >
            <HStack spacing={3}>
              <Icon as={FaShoppingBag} boxSize="5" color="blue.500" />
              <VStack align="start" spacing={0}>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="600"
                  color={textColor}
                >
                  Mes commandes
                </Text>
                <Text fontSize={{ base: "xs", md: "sm" }} color={subtleColor}>
                  Suivez et gérez vos commandes
                </Text>
              </VStack>
            </HStack>
          </Flex>

          {/* Enhanced Filters */}
          <Box
            bg={useColorModeValue("gray.50", "gray.700")}
            p={{ base: 3, md: 4 }}
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
          >
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 4 }}
              spacing={{ base: 3, md: 4 }}
            >
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  <HStack spacing={2}>
                    <Icon as={FaFilter} size="sm" />
                    <Text>Statut</Text>
                  </HStack>
                </FormLabel>
                <Select
                  size={{ base: "md", md: "sm" }}
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
                  bg={cardBg}
                  borderRadius="lg"
                >
                  <option value="pending">En attente</option>
                  <option value="processing">Traitement</option>
                  <option value="paid">Payé</option>
                  <option value="shipped">Expédié</option>
                  <option value="on_delivery">À la livraison</option>
                  <option value="in_transit">En transit</option>
                  <option value="in_customs">En douane</option>
                  <option value="completed">Complété</option>
                  <option value="cancelled">Annulé</option>
                  <option value="pending_payment">Paiement en attente</option>
                  <option value="order_cancel_request">
                    Annulation demandée
                  </option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} size="sm" />
                    <Text>À partir de la date</Text>
                  </HStack>
                </FormLabel>
                <Input
                  type="date"
                  size={{ base: "md", md: "sm" }}
                  value={ordersFilters.fromDate}
                  onChange={(e) => {
                    const newFilters = {
                      ...ordersFilters,
                      fromDate: e.target.value,
                    };
                    setOrdersFilters(newFilters);
                    fetchOrders({ ...newFilters, page: 1 });
                  }}
                  bg={cardBg}
                  borderRadius="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  <HStack spacing={2}>
                    <Icon as={FaCalendarAlt} size="sm" />
                    <Text>À ce jour</Text>
                  </HStack>
                </FormLabel>
                <Input
                  type="date"
                  size={{ base: "md", md: "sm" }}
                  value={ordersFilters.toDate}
                  onChange={(e) => {
                    const newFilters = {
                      ...ordersFilters,
                      toDate: e.target.value,
                    };
                    setOrdersFilters(newFilters);
                    fetchOrders({ ...newFilters, page: 1 });
                  }}
                  bg={cardBg}
                  borderRadius="lg"
                />
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  <Text>Actions</Text>
                </FormLabel>
                <Button
                  size={{ base: "md", md: "sm" }}
                  variant="outline"
                  colorScheme="blue"
                  borderRadius="lg"
                  w={{ base: "full", md: "auto" }}
                  onClick={() => {
                    const clearedFilters = {
                      status: "",
                      fromDate: "",
                      toDate: "",
                    };
                    setOrdersFilters(clearedFilters);
                    fetchOrders({ ...clearedFilters, page: 1 });
                  }}
                >
                  Effacer les filtres
                </Button>
              </FormControl>
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>

      {/* Orders List */}
      <Box
        bg={cardBg}
        borderRadius="xl"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
      >
        {ordersLoading ? (
          <VStack spacing={4} p={6}>
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                height="120px"
                width="100%"
                borderRadius="lg"
              />
            ))}
          </VStack>
        ) : ordersError ? (
          <Box textAlign="center" py={16}>
            <Icon
              as={FaExclamationTriangle}
              boxSize="16"
              color="red.300"
              mb={4}
            />
            <Text fontSize="xl" color="red.500" mb={2} fontWeight="600">
              Erreur lors du chargement des commandes
            </Text>
            <Text fontSize="sm" color={subtleColor} mb={6}>
              {ordersError}
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => fetchOrders()}
              borderRadius="lg"
            >
              Essayer à nouveau
            </Button>
          </Box>
        ) : orders.length === 0 ? (
          <Box textAlign="center" py={16}>
            <Icon as={FaShoppingBag} boxSize="16" color="gray.300" mb={4} />
            <Text fontSize="xl" color="gray.500" mb={2} fontWeight="600">
              Aucune commande trouvée
            </Text>
            <Text fontSize="sm" color={subtleColor} mb={6}>
              {ordersFilters.status ||
              ordersFilters.fromDate ||
              ordersFilters.toDate
                ? "Essayez d'ajuster vos filtres pour voir plus de résultats"
                : "Lorsque vous passez des commandes, elles apparaîtront ici"}
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              borderRadius="lg"
              onClick={() => (window.location.href = "/")}
            >
              Commencez à magasiner
            </Button>
          </Box>
        ) : (
          <VStack spacing={0} align="stretch">
            {orders.map((order, index) => {
              const statusColor = getStatusColor(order.status);
              const statusProgress = getStatusProgress(order.status);
              const isCancelled = ["cancelled", "order_cancel_request"].includes(
                order.status?.toLowerCase()
              );
              const isExpanded = expandedOrders.has(order.id);
              const timeline = getStatusTimeline(order.status);

              return (
                <Box
                  key={order.id}
                  position="relative"
                  overflow="hidden"
                  borderBottom={index < orders.length - 1 ? "1px" : "none"}
                  borderColor="gray.100"
                  _hover={{ bg: hoverBg }}
                  transition="all 0.3s ease"
                >
                  {/* Order Card */}
                  <Box p={{ base: 4, md: 6 }}>
                    {/* Progress Bar */}
                    <Box mb={4}>
                      <Box
                        h="3px"
                        bg="gray.100"
                        borderRadius="full"
                        overflow="hidden"
                      >
                        <Box
                          h="100%"
                          bg={isCancelled ? "red.400" : `${statusColor}.400`}
                          width={isCancelled ? "100%" : `${statusProgress}%`}
                          borderRadius="full"
                          transition="all 0.8s ease"
                        />
                      </Box>
                    </Box>

                    {/* Order Header */}
                    <Flex
                      direction={{ base: "column", md: "row" }}
                      justify="space-between"
                      align={{ base: "stretch", md: "center" }}
                      mb={4}
                      gap={{ base: 4, md: 0 }}
                    >
                      <HStack spacing={{ base: 3, md: 4 }} align="flex-start">
                        <Box
                          w="12px"
                          h="12px"
                          borderRadius="full"
                          bg={`${statusColor}.500`}
                          mt={1}
                        />
                        <VStack align="start" spacing={0}>
                          <HStack spacing={2} flexWrap="wrap">
                            <Text
                              fontSize="lg"
                              fontWeight="700"
                              color={textColor}
                            >
                              #{order.order_number}
                            </Text>
                            <Badge
                              colorScheme={statusColor}
                              variant="subtle"
                              fontSize="xs"
                              px={6}
                              py={1}
                              borderRadius="full"
                            >
                              {getStatusDisplayName(order.status)}
                            </Badge>
                          </HStack>
                          <HStack
                            spacing={4}
                            fontSize="sm"
                            color={subtleColor}
                            flexWrap="wrap"
                          >
                            <Text>{formatDate(order.created_at)}</Text>
                            <Text>•</Text>
                            <Text>{order.items?.length || 0} articles</Text>
                            <Text>•</Text>
                            <Text>
                              {order.payment_method === "credit_card"
                                ? "Carte de crédit"
                                : "Virement bancaire"}
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>

                      <HStack spacing={3}>
                        <VStack align="end" spacing={0}>
                          <Text
                            fontSize="xl"
                            fontWeight="700"
                            color={textColor}
                          >
                            €{parseFloat(order.total || 0).toFixed(2)}
                          </Text>
                          <Badge
                            colorScheme={
                              order.payment_status === "paid"
                                ? "green"
                                : order.payment_status === "failed"
                                  ? "red"
                                  : "yellow"
                            }
                            variant="subtle"
                            fontSize="xs"
                            textTransform="none"
                            py={1}
                            px={4}
                            rounded="lg"
                          >
                            Statut: {order.payment_status?.toUpperCase()}
                          </Badge>
                        </VStack>
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => toggleOrderExpansion(order.id)}
                          rightIcon={
                            isExpanded ? <FaChevronUp /> : <FaChevronDown />
                          }
                          borderRadius="lg"
                        >
                          {isExpanded ? "Moins" : "Détails"}
                        </Button>
                      </HStack>
                    </Flex>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <Box
                        mt={6}
                        pt={6}
                        borderTop="1px"
                        borderColor="gray.100"
                        animation="fadeIn 0.3s ease"
                      >
                        <VStack spacing={6} align="stretch">
                          {/* Status Timeline */}
                          {!isCancelled && (
                            <Box>
                              <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={textColor}
                                mb={4}
                              >
                                Progression de la commande
                              </Text>
                              <HStack
                                spacing={0}
                                justify="space-between"
                                position="relative"
                              >
                                {/* Progress Line */}
                                <Box
                                  position="absolute"
                                  top="50%"
                                  left="0"
                                  right="0"
                                  h="2px"
                                  bg="gray.200"
                                  transform="translateY(-50%)"
                                  zIndex={1}
                                />
                                <Box
                                  position="absolute"
                                  top="50%"
                                  left="0"
                                  h="2px"
                                  bg={`${statusColor}.400`}
                                  width={`${statusProgress}%`}
                                  transform="translateY(-50%)"
                                  zIndex={2}
                                  transition="all 0.8s ease"
                                />

                                {timeline.map((step, stepIndex) => (
                                  <VStack
                                    key={step.key}
                                    spacing={2}
                                    align="center"
                                    flex={1}
                                    zIndex={3}
                                  >
                                    <Box
                                      w="32px"
                                      h="32px"
                                      borderRadius="full"
                                      bg={
                                        step.isCompleted || step.isActive
                                          ? `${statusColor}.500`
                                          : "gray.200"
                                      }
                                      color={
                                        step.isCompleted || step.isActive
                                          ? "white"
                                          : "gray.400"
                                      }
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      border="3px solid white"
                                      boxShadow="sm"
                                      transition="all 0.3s ease"
                                    >
                                      <Icon as={step.icon} boxSize="3" />
                                    </Box>
                                    <Text
                                      fontSize="xs"
                                      color={
                                        step.isCompleted || step.isActive
                                          ? `${statusColor}.600`
                                          : "gray.400"
                                      }
                                      fontWeight={
                                        step.isActive ? "600" : "400"
                                      }
                                      textAlign="center"
                                      lineHeight="1.2"
                                    >
                                      {step.label}
                                    </Text>
                                  </VStack>
                                ))}
                              </HStack>
                            </Box>
                          )}

                          {order.items && order.items.length > 0 && (
                            <Box
                              bg={cardBg}
                              borderRadius="xl"
                              border="1px"
                              borderColor={borderColor}
                              overflow="hidden"
                              boxShadow="sm"
                            >
                              <Box
                                bg={useColorModeValue("gray.50", "gray.700")}
                                px={6}
                                py={4}
                                borderBottom="1px"
                                borderColor={borderColor}
                              >
                                <HStack spacing={2}>
                                  <Text
                                    fontSize="md"
                                    fontWeight="600"
                                    color={textColor}
                                  >
                                    Produits
                                  </Text>
                                  <Badge
                                    colorScheme="purple"
                                    variant="subtle"
                                    borderRadius="full"
                                    px={4}
                                    py={1}
                                  >
                                    {order.items.length}{" "}
                                    {order.items.length === 1
                                      ? "article"
                                      : "articles"}
                                  </Badge>
                                </HStack>
                              </Box>

                              <VStack spacing={0} align="stretch">
                                {order.items.map((item, itemIndex) => (
                                  <Box
                                    key={itemIndex}
                                    borderBottom={
                                      itemIndex < order.items.length - 1
                                        ? "1px"
                                        : "none"
                                    }
                                    borderColor="gray.100"
                                    p={6}
                                    _hover={{ bg: hoverBg }}
                                    transition="background 0.2s"
                                  >
                                    {/* Main Product Row */}
                                    <HStack
                                      spacing={4}
                                      align="start"
                                      mb={
                                        hasCustomizations(item) ? 4 : 0
                                      }
                                    >
                                      <ChakraImage
                                        src={
                                          item?.product_snapshot?.main_image_url
                                        }
                                        alt={
                                          item?.product_snapshot?.title ||
                                          "Product image"
                                        }
                                        boxSize="70px"
                                        objectFit="cover"
                                        borderRadius="lg"
                                        bg="gray.100"
                                        fallbackSrc="https://via.placeholder.com/70x70?text=No+Image"
                                        flexShrink={0}
                                        boxShadow="sm"
                                      />

                                      <VStack
                                        align="start"
                                        spacing={3}
                                        flex={1}
                                      >
                                        <Text
                                          fontSize="md"
                                          fontWeight="600"
                                          color={textColor}
                                          lineHeight="1.3"
                                        >
                                          {item.product_snapshot?.title ||
                                            "Product Title"}
                                        </Text>

                                        <HStack spacing={4} wrap="wrap">
                                          <Badge
                                            colorScheme="blue"
                                            variant="subtle"
                                          >
                                            Quantité: {item.quantity || 0}
                                          </Badge>
                                          <Badge
                                            colorScheme="gray"
                                            variant="subtle"
                                          >
                                            €
                                            {parseFloat(
                                              item.unit_price || 0
                                            ).toFixed(2)}{" "}
                                            chaque
                                          </Badge>
                                          <Badge
                                            colorScheme="green"
                                            variant="solid"
                                            fontSize="sm"
                                          >
                                            €
                                            {parseFloat(
                                              item.total_price || 0
                                            ).toFixed(2)}
                                          </Badge>
                                        </HStack>

                                        {item.product_snapshot?.description && (
                                          <Text
                                            fontSize="sm"
                                            color={subtleColor}
                                            noOfLines={2}
                                            lineHeight="1.4"
                                          >
                                            {item.product_snapshot.description}
                                          </Text>
                                        )}
                                      </VStack>
                                    </HStack>

                                    {/* Customization Details */}
                                    {hasCustomizations(item) && (
                                      <Box
                                        bg={useColorModeValue("blue.50", "blue.900")}
                                        borderRadius="lg"
                                        p={4}
                                        mt={4}
                                        border="1px"
                                        borderColor={useColorModeValue("blue.100", "blue.700")}
                                      >
                                        <Text
                                          fontSize="sm"
                                          fontWeight="600"
                                          color={useColorModeValue("blue.700", "blue.200")}
                                          mb={3}
                                          display="flex"
                                          alignItems="center"
                                          gap={2}
                                        >
                                          ✨ Personnalisations
                                        </Text>

                                        {item.selected_options &&
                                          Array.isArray(item.selected_options) &&
                                          item.selected_options.length > 0 && (
                                            <Box mb={4}>
                                              <Text fontSize="xs" fontWeight="500" mb={2}>
                                                Options sélectionnées
                                              </Text>
                                              <Box
                                                bg={cardBg}
                                                borderRadius="md"
                                                overflow="hidden"
                                                border="1px"
                                                borderColor={borderColor}
                                              >
                                                {/* Options Table */}
                                                <HStack
                                                  p={3}
                                                  borderBottom="1px"
                                                  borderColor={borderColor}
                                                  fontWeight="600"
                                                  fontSize="xs"
                                                  bg={useColorModeValue("gray.50", "gray.700")}
                                                >
                                                  <Box flex="0 0 60px" textAlign="center">
                                                    Image
                                                  </Box>
                                                  <Box flex="1">Option</Box>
                                                  <Box flex="1">Valeur</Box>
                                                </HStack>

                                                <VStack spacing={0} align="stretch">
                                                  {item.selected_options.map(
                                                    (option, optionIndex) => (
                                                      <HStack
                                                        key={optionIndex}
                                                        p={3}
                                                        borderBottom={
                                                          optionIndex <
                                                          item.selected_options.length - 1
                                                            ? "1px"
                                                            : "none"
                                                        }
                                                        borderColor="gray.100"
                                                        _hover={{ bg: hoverBg }}
                                                        align="center"
                                                      >
                                                        {/* Image Column */}
                                                        <Box
                                                          flex="0 0 60px"
                                                          textAlign="center"
                                                        >
                                                          {option.image_url ? (
                                                            <ChakraImage
                                                              src={option.image_url}
                                                              alt={
                                                                option.image_alt_text ||
                                                                option.value_name
                                                              }
                                                              boxSize="40px"
                                                              objectFit="cover"
                                                              borderRadius="md"
                                                              bg="gray.100"
                                                              fallbackSrc="https://via.placeholder.com/40x40?text=No+Image"
                                                              mx="auto"
                                                            />
                                                          ) : (
                                                            <Box
                                                              w="40px"
                                                              h="40px"
                                                              bg="gray.100"
                                                              borderRadius="md"
                                                              display="flex"
                                                              alignItems="center"
                                                              justifyContent="center"
                                                              mx="auto"
                                                            >
                                                              <Icon
                                                                as={FaPalette}
                                                                color="gray.400"
                                                                boxSize="3"
                                                              />
                                                            </Box>
                                                          )}
                                                        </Box>
                                                        {/* Option Column */}
                                                        <Box flex="1">
                                                          <Text
                                                            fontSize="xs"
                                                            color={textColor}
                                                            fontWeight="500"
                                                            lineHeight="1.3"
                                                            noOfLines={2}
                                                          >
                                                            {option.option_name}
                                                          </Text>
                                                        </Box>

                                                        {/* Selected Value Column */}
                                                        <Box flex="1">
                                                          <Text
                                                            fontSize="xs"
                                                            color={textColor}
                                                            fontWeight="400"
                                                            lineHeight="1.3"
                                                            noOfLines={2}
                                                          >
                                                            {option.value_name}
                                                          </Text>
                                                        </Box>
                                                      </HStack>
                                                    )
                                                  )}
                                                </VStack>
                                              </Box>
                                            </Box>
                                        )}

                                        {/* Dimensions */}
                                        {item.dimensions &&
                                          typeof item.dimensions === "object" &&
                                          Object.keys(item.dimensions).length > 0 && (
                                            <Box mt={4}>
                                              <Text fontSize="xs" fontWeight="500" mb={2}>
                                                Dimensions
                                              </Text>
                                              <Box
                                                bg={cardBg}
                                                borderRadius="md"
                                                border="1px"
                                                borderColor={borderColor}
                                                overflow="hidden"
                                              >
                                                <HStack
                                                  p={3}
                                                  borderBottom="1px"
                                                  borderColor={borderColor}
                                                  fontWeight="600"
                                                  fontSize="xs"
                                                  bg={useColorModeValue("gray.50", "gray.700")}
                                                >
                                                  <Box flex="1">Dimension</Box>
                                                  <Box flex="1">Valeur</Box>
                                                  <Box flex="0 0 60px" textAlign="center">
                                                    Unité
                                                  </Box>
                                                </HStack>

                                                <VStack spacing={0} align="stretch">
                                                  {Object.entries(item.dimensions).map(
                                                    ([key, value], dimensionIndex) => (
                                                      <HStack
                                                        key={key}
                                                        p={3}
                                                        borderBottom={
                                                          dimensionIndex <
                                                          Object.keys(item.dimensions).length - 1
                                                            ? "1px"
                                                            : "none"
                                                        }
                                                        borderColor="gray.100"
                                                        _hover={{ bg: hoverBg }}
                                                        align="center"
                                                      >
                                                        {/* Dimension Name Column */}
                                                        <Box flex="1">
                                                          <Text
                                                            fontSize="xs"
                                                            color={subtleColor}
                                                            fontWeight="500"
                                                            lineHeight="1.3"
                                                            textTransform="capitalize"
                                                          >
                                                            {key.replace(/_/g, " ")}
                                                          </Text>
                                                        </Box>

                                                        {/* Value Column */}
                                                        <Box flex="1">
                                                          <Text
                                                            fontSize="xs"
                                                            color={textColor}
                                                            fontWeight="600"
                                                            lineHeight="1.3"
                                                          >
                                                            {value}
                                                          </Text>
                                                        </Box>

                                                        {/* Unit Column */}
                                                        <Box flex="0 0 60px" textAlign="center">
                                                          <Text fontSize="xs">
                                                            {key.toLowerCase().includes("width") ||
                                                            key.toLowerCase().includes("height") ||
                                                            key.toLowerCase().includes("length") ||
                                                            key.toLowerCase().includes("depth")
                                                              ? "cm"
                                                              : key.toLowerCase().includes("weight")
                                                                ? "kg"
                                                                : key.toLowerCase().includes("area")
                                                                  ? "m²"
                                                                  : key.toLowerCase().includes(
                                                                      "volume"
                                                                    )
                                                                    ? "m³"
                                                                    : "-"}
                                                          </Text>
                                                        </Box>
                                                      </HStack>
                                                    )
                                                  )}
                                                </VStack>
                                              </Box>
                                            </Box>
                                        )}

                                        {/* Selected Services */}
                                        {item.selected_services &&
                                          Array.isArray(item.selected_services) &&
                                          item.selected_services.length > 0 && (
                                            <Box mt={4}>
                                              <Text fontSize="xs" fontWeight="500" mb={2}>
                                                Services sélectionnés
                                              </Text>
                                              <Box
                                                bg={cardBg}
                                                borderRadius="md"
                                                border="1px"
                                                borderColor={useColorModeValue("green.100", "green.700")}
                                                overflow="hidden"
                                              >
                                                {/* Services Table */}
                                                <HStack
                                                  bg={useColorModeValue("green.50", "green.900")}
                                                  p={3}
                                                  borderBottom="1px"
                                                  borderColor={useColorModeValue("green.100", "green.700")}
                                                  fontWeight="600"
                                                  fontSize="xs"
                                                  color={useColorModeValue("green.700", "green.200")}
                                                >
                                                  <Box flex="1">Service</Box>
                                                  <Box flex="1">Description</Box>
                                                  <Box flex="0 0 80px" textAlign="center">
                                                    Prix
                                                  </Box>
                                                </HStack>

                                                <VStack spacing={0} align="stretch">
                                                  {item.selected_services.map(
                                                    (service, serviceIndex) => (
                                                      <HStack
                                                        key={serviceIndex}
                                                        p={3}
                                                        borderBottom={
                                                          serviceIndex <
                                                          item.selected_services.length - 1
                                                            ? "1px"
                                                            : "none"
                                                        }
                                                        borderColor="gray.100"
                                                        _hover={{ bg: hoverBg }}
                                                        align="center"
                                                      >
                                                        {/* Service Name Column */}
                                                        <Box flex="1">
                                                          <Text
                                                            fontSize="xs"
                                                            color={useColorModeValue("green.600", "green.300")}
                                                            fontWeight="500"
                                                            lineHeight="1.3"
                                                            noOfLines={2}
                                                          >
                                                            {service.service_name || service.name}
                                                          </Text>
                                                        </Box>

                                                        {/* Description Column */}
                                                        <Box flex="1">
                                                          <Text
                                                            fontSize="xs"
                                                            color={textColor}
                                                            fontWeight="400"
                                                            lineHeight="1.3"
                                                            noOfLines={2}
                                                          >
                                                            {service.description || service.value || "-"}
                                                          </Text>
                                                        </Box>

                                                        {/* Price Column */}
                                                        <Box flex="0 0 80px" textAlign="center">
                                                          {service.price &&
                                                          parseFloat(service.price) !== 0 ? (
                                                            <Badge
                                                              colorScheme="green"
                                                              variant="subtle"
                                                              fontSize="2xs"
                                                              borderRadius="full"
                                                            >
                                                              €
                                                              {parseFloat(service.price).toFixed(
                                                                2
                                                              )}
                                                            </Badge>
                                                          ) : (
                                                            <Text fontSize="xs" color={subtleColor}>
                                                              Gratuit
                                                            </Text>
                                                          )}
                                                        </Box>
                                                      </HStack>
                                                    )
                                                  )}
                                                </VStack>
                                              </Box>
                                            </Box>
                                        )}
                                      </Box>
                                    )}
                                  </Box>
                                ))}
                              </VStack>
                            </Box>
                          )}

                          {/* Order Details Grid */}
                          <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            spacing={6}
                          >
                            {/* Shipping Address */}
                            <Box
                              bg={useColorModeValue("gray.50", "gray.700")}
                              p={5}
                              borderRadius="xl"
                              boxShadow="sm"
                              transition="transform 0.2s"
                              _hover={{ transform: "translateY(-2px)" }}
                            >
                              <HStack spacing={2} mb={3}>
                                <Icon as={FaTruck} color="blue.500" boxSize="4" />
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color={textColor}
                                >
                                  Adresse de livraison
                                </Text>
                              </HStack>
                              {order.shipping_address ? (
                                <VStack align="start" spacing={1}>
                                  <Text
                                    fontSize="sm"
                                    color={textColor}
                                    fontWeight="500"
                                  >
                                    {order.shipping_address.street}
                                  </Text>
                                  <Text fontSize="sm" color={subtleColor}>
                                    {order.shipping_address.city},{" "}
                                    {order.shipping_address.postal_code}
                                  </Text>
                                  <Text fontSize="sm" color={subtleColor}>
                                    {order.shipping_address.country}
                                  </Text>
                                  {order.shipping_address.phone && (
                                    <HStack spacing={1} mt={1}>
                                      <Icon
                                        as={FaPhone}
                                        color={subtleColor}
                                        boxSize="3"
                                      />
                                      <Text fontSize="xs" color={subtleColor}>
                                        {order.shipping_address.phone}
                                      </Text>
                                    </HStack>
                                  )}
                                </VStack>
                              ) : (
                                <Text fontSize="sm" color={subtleColor}>
                                  Aucune adresse fournie
                                </Text>
                              )}
                            </Box>

                            {/* Billing Address */}
                            <Box
                              bg={useColorModeValue("gray.50", "gray.700")}
                              p={5}
                              borderRadius="xl"
                              boxShadow="sm"
                              transition="transform 0.2s"
                              _hover={{ transform: "translateY(-2px)" }}
                            >
                              <HStack spacing={2} mb={3}>
                                <Icon
                                  as={FaFileInvoice}
                                  color="purple.500"
                                  boxSize="4"
                                />
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color={textColor}
                                >
                                  Adresse de facturation
                                </Text>
                              </HStack>
                              {order.billing_address ? (
                                <VStack align="start" spacing={1}>
                                  <Text
                                    fontSize="sm"
                                    color={textColor}
                                    fontWeight="500"
                                  >
                                    {order.billing_address.street}
                                  </Text>
                                  <Text fontSize="sm" color={subtleColor}>
                                    {order.billing_address.city},{" "}
                                    {order.billing_address.postal_code}
                                  </Text>
                                  <Text fontSize="sm" color={subtleColor}>
                                    {order.billing_address.country}
                                  </Text>
                                  {order.billing_address.phone && (
                                    <HStack spacing={1} mt={1}>
                                      <Icon
                                        as={FaPhone}
                                        color={subtleColor}
                                        boxSize="3"
                                      />
                                      <Text fontSize="xs" color={subtleColor}>
                                        {order.billing_address.phone}
                                      </Text>
                                    </HStack>
                                  )}
                                </VStack>
                              ) : (
                                <Text fontSize="sm" color={subtleColor}>
                                  Identique à l'expédition
                                </Text>
                              )}
                            </Box>

                            {/* Payment Method */}
                            <Box
                              bg={useColorModeValue("gray.50", "gray.700")}
                              p={5}
                              borderRadius="xl"
                              boxShadow="sm"
                              transition="transform 0.2s"
                              _hover={{ transform: "translateY(-2px)" }}
                            >
                              <HStack spacing={2} mb={3}>
                                <Icon
                                  as={FaCreditCard}
                                  color="green.500"
                                  boxSize="4"
                                />
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color={textColor}
                                >
                                  Mode de paiement
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={2}>
                                <HStack spacing={2}>
                                  <Icon
                                    as={
                                      order.payment_method === "credit_card"
                                        ? FaCreditCard
                                        : FaUniversity
                                    }
                                    color={
                                      order.payment_method === "credit_card"
                                        ? "blue.500"
                                        : "orange.500"
                                    }
                                    boxSize="4"
                                  />
                                  <Text
                                    fontSize="sm"
                                    color={textColor}
                                    fontWeight="500"
                                  >
                                    {order.payment_method === "credit_card"
                                      ? "Carte de crédit"
                                      : "Virement bancaire"}
                                  </Text>
                                </HStack>

                                <Badge
                                  colorScheme={
                                    order.payment_status === "paid"
                                      ? "green"
                                      : order.payment_status === "failed"
                                        ? "red"
                                        : "yellow"
                                  }
                                  variant="subtle"
                                  fontSize="xs"
                                  px={3}
                                  py={1}
                                  borderRadius="full"
                                >
                                  {order.payment_status?.charAt(0).toUpperCase() +
                                    order.payment_status?.slice(1)}
                                </Badge>
                              </VStack>
                            </Box>

                            {/* Order Summary */}
                            <Box
                              bg={useColorModeValue("gray.50", "gray.700")}
                              p={5}
                              borderRadius="xl"
                              boxShadow="sm"
                              transition="transform 0.2s"
                              _hover={{ transform: "translateY(-2px)" }}
                            >
                              <HStack spacing={2} mb={3}>
                                <Icon
                                  as={FaCalculator}
                                  color="orange.500"
                                  boxSize="4"
                                />
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color={textColor}
                                >
                                  Résumé de la commande
                                </Text>
                              </HStack>
                              <VStack align="start" spacing={2}>
                                <HStack justify="space-between" w="100%">
                                  <Text fontSize="sm" color={subtleColor}>
                                    Sous-total:
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color={textColor}
                                    fontWeight="500"
                                  >
                                    €{parseFloat(order.subtotal || 0).toFixed(2)}
                                  </Text>
                                </HStack>

                                {order.shipping_fee > 0 && (
                                  <HStack justify="space-between" w="100%">
                                    <Text fontSize="sm" color={subtleColor}>
                                      Expédition:
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      color={textColor}
                                      fontWeight="500"
                                    >
                                      €{parseFloat(order.shipping_fee || 0).toFixed(2)}
                                    </Text>
                                  </HStack>
                                )}

                                {order.tax > 0 && (
                                  <HStack justify="space-between" w="100%">
                                    <Text fontSize="sm" color={subtleColor}>
                                      TVA:
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      color={textColor}
                                      fontWeight="500"
                                    >
                                      €{parseFloat(order.tax || 0).toFixed(2)}
                                    </Text>
                                  </HStack>
                                )}

                                {(order.promotion_discount > 0 ||
                                  order.gift_card_discount > 0) && (
                                  <HStack justify="space-between" w="100%">
                                    <Text fontSize="sm" color="green.500">
                                      Réductions:
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      color="green.500"
                                      fontWeight="500"
                                    >
                                      -€
                                      {(
                                        parseFloat(order.promotion_discount || 0) +
                                        parseFloat(order.gift_card_discount || 0)
                                      ).toFixed(2)}
                                    </Text>
                                  </HStack>
                                )}

                                <Divider />

                                <HStack justify="space-between" w="100%">
                                  <Text
                                    fontSize="sm"
                                    fontWeight="600"
                                    color={textColor}
                                  >
                                    Total:
                                  </Text>
                                  <Text
                                    fontSize="md"
                                    fontWeight="700"
                                    color={useColorModeValue("blue.500", "blue.300")}
                                  >
                                    €{parseFloat(order.total || 0).toFixed(2)}
                                  </Text>
                                </HStack>
                              </VStack>
                            </Box>
                          </SimpleGrid>

                          {/* Actions - Only show if there are actual actions available */}
                          {([
                            "pending",
                            "pending_payment",
                            "processing",
                          ].includes(order.status?.toLowerCase()) ||
                            (order.payment_method === "credit_card" &&
                              order.payment_status === "pending")) && (
                            <Box
                              bg={useColorModeValue("gray.50", "gray.700")}
                              p={5}
                              borderRadius="xl"
                            >
                              <HStack spacing={2} mb={3}>
                                <Icon as={FaCog} color="blue.500" boxSize="4" />
                                <Text
                                  fontSize="sm"
                                  fontWeight="600"
                                  color={textColor}
                                >
                                  Actions
                                </Text>
                              </HStack>
                              <HStack spacing={3} wrap="wrap">
                                {/* Cancel Order Button */}
                                {["pending", "pending_payment", "processing"].includes(
                                  order.status?.toLowerCase()
                                ) && (
                                  <Button
                                    size="sm"
                                    colorScheme="red"
                                    variant="outline"
                                    leftIcon={<Icon as={FaUndo} />}
                                    onClick={() =>
                                      openCancelOrderModal(order.id)
                                    }
                                    borderRadius="lg"
                                  >
                                    Annuler la commande
                                  </Button>
                                )}

                                {/* Complete Payment Button */}
                                {order.payment_method === "credit_card" &&
                                  order.payment_status === "pending" && (
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      leftIcon={<Icon as={FaCreditCard} />}
                                      onClick={() =>
                                        handleCompletePayment(order.id)
                                      }
                                      borderRadius="lg"
                                    >
                                      Finaliser le paiement
                                    </Button>
                                  )}
                              </HStack>
                            </Box>
                          )}

                          {/* Special Notes and Codes */}
                          {(order.special_note ||
                            order.applied_promotion_code ||
                            order.applied_gift_card_code) && (
                            <SimpleGrid
                              columns={{ base: 1, md: 2 }}
                              spacing={4}
                            >
                              {order.special_note && (
                                <Box 
                                  bg={cardBg}
                                  p={4} 
                                  borderRadius="xl"
                                  border="1px"
                                  borderColor={useColorModeValue("blue.100", "blue.700")}
                                >
                                  <HStack spacing={2} mb={2}>
                                    <Icon as={FaTools} color="blue.500" />
                                    <Text
                                      fontSize="sm"
                                      fontWeight="600"
                                      color={useColorModeValue("blue.700", "blue.200")}
                                    >
                                      Note spéciale
                                    </Text>
                                  </HStack>
                                  <Text
                                    fontSize="sm"
                                    color={useColorModeValue("blue.600", "blue.300")}
                                    fontStyle="italic"
                                    bg={useColorModeValue("blue.50", "blue.900")}
                                    p={3}
                                    borderRadius="md"
                                  >
                                    "{order.special_note}"
                                  </Text>
                                </Box>
                              )}

                              {(order.applied_promotion_code ||
                                order.applied_gift_card_code) && (
                                <Box 
                                  bg={cardBg}
                                  p={4} 
                                  borderRadius="xl"
                                  border="1px"
                                  borderColor={borderColor}
                                >
                                  <HStack spacing={2} mb={2}>
                                    <Icon as={FaTicketAlt} color="purple.500" />
                                    <Text
                                      fontSize="sm"
                                      fontWeight="600"
                                      color={textColor}
                                    >
                                      Codes appliqués
                                    </Text>
                                  </HStack>
                                  <VStack spacing={2} align="start">
                                    {order.applied_promotion_code && (
                                      <Badge
                                        colorScheme="blue"
                                        variant="solid"
                                        fontSize="xs"
                                        px={3}
                                        py={1}
                                        borderRadius="md"
                                      >
                                        Promo: {order.applied_promotion_code}
                                      </Badge>
                                    )}
                                    {order.applied_gift_card_code && (
                                      <Badge
                                        colorScheme="purple"
                                        variant="solid"
                                        fontSize="xs"
                                        px={3}
                                        py={1}
                                        borderRadius="md"
                                      >
                                        Carte-cadeau:{" "}
                                        {order.applied_gift_card_code}
                                      </Badge>
                                    )}
                                  </VStack>
                                </Box>
                              )}
                            </SimpleGrid>
                          )}
                        </VStack>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </VStack>
        )}
      </Box>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={cancelOrderModal.isOpen}
        onClose={closeCancelOrderModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Demande d'annulation de commande</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>
              Veuillez fournir une raison pour l'annulation de cette commande :
            </Text>
            <FormControl isRequired isInvalid={!!cancelOrderModal.error}>
              <FormLabel>Raison</FormLabel>
              <Input
                value={cancelOrderModal.reason}
                onChange={(e) =>
                  setCancelOrderModal((prev) => ({
                    ...prev,
                    reason: e.target.value,
                    error: null,
                  }))
                }
                placeholder="Entrez votre raison"
                borderRadius="lg"
              />
              <FormErrorMessage>{cancelOrderModal.error}</FormErrorMessage>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={closeCancelOrderModal}
              borderRadius="lg"
            >
              Annuler
            </Button>
            <Button
              colorScheme="red"
              onClick={handleSubmitCancelOrder}
              isLoading={cancelOrderModal.loading}
              isDisabled={!cancelOrderModal.reason}
              borderRadius="lg"
            >
              Soumettre la demande
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default OrdersList;