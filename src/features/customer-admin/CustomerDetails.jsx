import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  chakra,
  Badge,
  Divider,
  Stack,
  Button,
  useToast,
  HStack,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Avatar,
  Input,
  Select,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { homeService } from "../home/services/homeService";
import Loader from "../../commons/Loader";
import { useAuth } from "../administration/authContext/authContext";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";
import { ArrowBackIcon } from "@chakra-ui/icons";

export default function CustomerDetails() {
  const { customerId } = useParams();
  const { account, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [ordersSearch, setOrdersSearch] = useState("");
  const [ordersStatus, setOrdersStatus] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await homeService.getCustomerById(customerId);
        setCustomer(res.data);
      } catch (error) {
        toast({
          title: "Erreur lors du chargement du client.",
          description: error?.message || "Erreur inconnue",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
    // eslint-disable-next-line
  }, [customerId]);

  // Fetch orders when customerId changes or on tab switch
  useEffect(() => {
    if (customerId) fetchOrders({ page: 1 });
    // eslint-disable-next-line
  }, [customerId]);

  // Fetch orders for this customer
  const fetchOrders = async (params = {}) => {
    setOrdersLoading(true);
    try {
      const res = await homeService.getOrdersByCustomerId(customerId, {
        page: params.page || ordersPagination.page,
        limit: params.limit || ordersPagination.limit,
        status: params.status !== undefined ? params.status : ordersStatus,
        search: params.search !== undefined ? params.search : ordersSearch,
      });
      setOrders(res.data || []);
      setOrdersPagination(
        res.pagination || { page: 1, limit: 10, totalPages: 1, total: 0 }
      );
    } catch (error) {
      toast({
        title: "Erreur lors du chargement des commandes.",
        description: error?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Handler for order search/filter
  const handleOrdersSearch = (e) => {
    e.preventDefault();
    fetchOrders({ page: 1, search: ordersSearch });
  };

  // Handler for order status filter
  const handleOrdersStatusChange = (e) => {
    setOrdersStatus(e.target.value);
    fetchOrders({ page: 1, status: e.target.value });
  };

  // Handler for order pagination
  const handleOrdersPageChange = (newPage) => {
    fetchOrders({ page: newPage });
  };

  if (isLoading) return <Loader />;
  if (loading)
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#f4f6fa">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );

  if (!customer)
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#f4f6fa">
        <Text color="gray.500">Client introuvable.</Text>
      </Flex>
    );

  return (
    <Box minH="100vh" bg="#f4f6fa">
      {/* Sidebar */}
      <chakra.Box display={{ base: "none", md: "block" }}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
      </chakra.Box>
      {/* Mobile Sidebar */}
      <chakra.Box
        display={{ base: isSidebarOpen ? "block" : "none", md: "none" }}
        position="fixed"
        zIndex={999}
      >
        <SidebarContent
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </chakra.Box>
      {/* MobileNav */}
      <MobileNav
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onOpen={() => setIsSidebarOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <Box ml={{ base: 0, md: 60 }} p={{ base: 2, md: 8 }}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          mb={4}
          onClick={() => navigate(-1)}
          colorScheme="blue"
          borderRadius="full"
        >
          Retour
        </Button>

        {/* Customer Details HStack */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={8}
          mb={8}
          width="100%"
        >
          <HStack align="flex-start" spacing={8} width="100%">
            <Avatar
              size="2xl"
              name={`${customer.first_name} ${customer.last_name}`}
              src={customer.profile_picture_url}
              mr={4}
            />
            <VStack align="flex-start" spacing={2} width="100%">
              <Flex align="center" gap={4} flexWrap="wrap">
                <Heading size="lg" color="#1a2947" fontWeight="700">
                  {customer.first_name} {customer.last_name}
                </Heading>
                <Badge
                  colorScheme={customer.is_active ? "green" : "red"}
                  borderRadius="full"
                  px={3}
                  fontSize="md"
                >
                  {customer.is_active ? "Actif" : "Inactif"}
                </Badge>
                <Badge
                  colorScheme={customer.email_verified ? "green" : "red"}
                  borderRadius="full"
                  px={3}
                  fontSize="md"
                >
                  Email {customer.email_verified ? "vérifié" : "non vérifié"}
                </Badge>
                <Badge
                  colorScheme="blue"
                  borderRadius="full"
                  px={3}
                  fontSize="md"
                >
                  {customer.customer_type === "business"
                    ? "Entreprise"
                    : "Client"}
                </Badge>
              </Flex>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2} width="100%">
                <Box>
                  <Text fontSize="md" color="gray.600">
                    <b>Email:</b> {customer.email}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Téléphone:</b> {customer.phone_primary || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Langue préférée:</b> {customer.preferred_language || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Devise préférée:</b> {customer.preferred_currency || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Groupe:</b> {customer.customer_group || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Genre:</b> {customer.gender || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Date de naissance:</b>{" "}
                    {customer.date_of_birth
                      ? new Date(customer.date_of_birth).toLocaleDateString()
                      : "-"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="md" color="gray.600">
                    <b>Entreprise:</b> {customer.business_name || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Numéro TVA:</b> {customer.vat_number || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Type d'entreprise:</b> {customer.business_type || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Téléphone entreprise:</b> {customer.business_phone || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Email entreprise:</b> {customer.business_email || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Adresse entreprise:</b> {customer.business_address || "-"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="md" color="gray.600">
                    <b>Dernière connexion:</b>{" "}
                    {customer.last_login
                      ? new Date(customer.last_login).toLocaleString()
                      : "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Dernière IP:</b> {customer.last_login_ip || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Agent utilisateur:</b> {customer.user_agent || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Points fidélité:</b> {customer.loyalty_points}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Solde récompense:</b> {customer.reward_balance} €
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Notes internes:</b> {customer.internal_notes || "-"}
                  </Text>
                </Box>
              </SimpleGrid>
              <Divider my={2} />
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2} width="100%">
                <Box>
                  <Text fontSize="md" color="gray.600">
                    <b>Date d'inscription:</b>{" "}
                    {customer.created_at
                      ? new Date(customer.created_at).toLocaleDateString()
                      : "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Dernière modification:</b>{" "}
                    {customer.updated_at
                      ? new Date(customer.updated_at).toLocaleDateString()
                      : "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Adresse principale:</b> {customer.address_primary || "-"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="md" color="gray.600">
                    <b>Total commandes:</b> {customer.total_orders}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Total dépensé:</b> {customer.total_spent} €
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Dernière commande:</b>{" "}
                    {customer.last_order_at
                      ? new Date(customer.last_order_at).toLocaleDateString()
                      : "-"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="md" color="gray.600">
                    <b>Référence parrainage:</b> {customer.referral_code || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Parrainé par:</b> {customer.referred_by || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>URL parrainage:</b> {customer.referral_url || "-"}
                  </Text>
                  <Text fontSize="md" color="gray.600">
                    <b>Notifications email:</b>{" "}
                    {customer.is_email_notifications_enabled ? "Oui" : "Non"}
                  </Text>
                </Box>
              </SimpleGrid>
              <Text fontSize="sm" color="gray.400">
                ID client: {customer.id}
              </Text>
            </VStack>
          </HStack>
        </Box>

        {/* Tabs for related info */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={8}
          flex="2"
          minW="340px"
        >
          <Tabs colorScheme="blue" variant="enclosed">
            <TabList>
              <Tab>Commandes</Tab>
              {/* <Tab>Factures</Tab> */}
              <Tab>Adresses</Tab>
              {/* <Tab>Autres</Tab> */}
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text color="gray.500" fontSize="md">
                 <TabPanel>
                {/* Orders Tab Content */}
                <form onSubmit={handleOrdersSearch}>
                  <Flex mb={4} gap={2} align="center" wrap="wrap">
                    <Input
                      placeholder="Recherche numéro, paiement..."
                      value={ordersSearch}
                      onChange={(e) => setOrdersSearch(e.target.value)}
                      width={{ base: "100%", md: "220px" }}
                      bg="#f7fafc"
                      borderRadius="full"
                      fontWeight="500"
                    />
                    <Select
                      placeholder="Statut"
                      value={ordersStatus}
                      onChange={handleOrdersStatusChange}
                      width={{ base: "100%", md: "160px" }}
                      borderRadius="full"
                    >
                      <option value="pending">En attente</option>
                      <option value="processing">En cours</option>
                      <option value="paid">Payée</option>
                      <option value="shipped">Expédiée</option>
                      <option value="on_delivery">En livraison</option>
                      <option value="in_transit">En transit</option>
                      <option value="in_customs">En douane</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                      <option value="pending_payment">Paiement en attente</option>
                      <option value="order_cancel_request">Demande d'annulation</option>
                    </Select>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      borderRadius="full"
                      fontWeight="600"
                      px={6}
                      isLoading={ordersLoading}
                    >
                      Rechercher
                    </Button>
                  </Flex>
                </form>
                <Box overflowX="auto">
                  <Table size="md" variant="simple">
                    <Thead bg="#f4f6fa">
                      <Tr>
                        <Th>Numéro</Th>
                        <Th>Date</Th>
                        <Th>Statut</Th>
                        <Th>Total</Th>
                        <Th>Paiement</Th>
                        <Th>Livraison</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {ordersLoading ? (
                        <Tr>
                          <Td colSpan={7}>
                            <Spinner size="sm" /> Chargement...
                          </Td>
                        </Tr>
                      ) : orders.length === 0 ? (
                        <Tr>
                          <Td colSpan={7}>
                            <Text color="gray.500">Aucune commande trouvée.</Text>
                          </Td>
                        </Tr>
                      ) : (
                        orders.map((order) => (
                          <Tr key={order.id}>
                            <Td fontWeight="600" color="#1a2947">
                              {order.order_number}
                            </Td>
                            <Td>
                              {order.created_at
                                ? new Date(order.created_at).toLocaleDateString()
                                : "-"}
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  order.status === "completed"
                                    ? "green"
                                    : order.status === "cancelled"
                                    ? "red"
                                    : "blue"
                                }
                                borderRadius="full"
                                px={3}
                              >
                                {order.status}
                              </Badge>
                            </Td>
                            <Td>€{parseFloat(order.total).toFixed(2)}</Td>
                            <Td>{order.payment_method}</Td>
                            <Td>
                              {order.shipping_address
                                ? order.shipping_address.city
                                : "-"}
                            </Td>
                            <Td>
                              {/* Future: View order details, etc. */}
                              <Button size="sm" colorScheme="blue" variant="ghost"
                              as='a' href={`/order-details/${order?.id}`}>
                                Voir
                              </Button>
                            </Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                  {/* Pagination Controls */}
                  <Flex mt={4} justify="flex-end" align="center" gap={2}>
                    <Button
                      size="sm"
                      onClick={() => handleOrdersPageChange(ordersPagination.page - 1)}
                      isDisabled={ordersPagination.page <= 1 || ordersLoading}
                      borderRadius="full"
                      colorScheme="gray"
                      fontWeight="600"
                    >
                      Précédent
                    </Button>
                    <Text fontSize="sm" color="#1a2947" fontWeight="600">
                      Page {ordersPagination.page} / {ordersPagination.totalPages}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => handleOrdersPageChange(ordersPagination.page + 1)}
                      isDisabled={
                        ordersPagination.page >= ordersPagination.totalPages || ordersLoading
                      }
                      borderRadius="full"
                      colorScheme="gray"
                      fontWeight="600"
                    >
                      Suivant
                    </Button>
                  </Flex>
                </Box>
              </TabPanel>
                </Text>
              </TabPanel>
              {/* <TabPanel>
                <Text color="gray.500" fontSize="md">
                  (Factures à venir)
                </Text>
              </TabPanel> */}
              <TabPanel>
                <VStack align="stretch" spacing={2}>
                  {customer.addresses && customer.addresses.length > 0 ? (
                    customer.addresses.map((addr, idx) => (
                      <Box key={idx} p={3} borderWidth={1} borderRadius="md" bg="#f7fafc">
                        <Text fontWeight="bold">{addr.label || "Adresse"}</Text>
                        <Text>
                          {addr.first_name} {addr.last_name}{" "}
                          {addr.company && `(${addr.company})`}
                        </Text>
                        <Text>
                          {addr.street}, {addr.city} {addr.postal_code}, {addr.country}
                        </Text>
                        <Text>{addr.phone}</Text>
                        {addr.is_default && (
                          <Badge colorScheme="blue" ml={2}>
                            Par défaut
                          </Badge>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Text color="gray.500">Aucune adresse enregistrée.</Text>
                  )}
                </VStack>
              </TabPanel>
              {/* <TabPanel>
                <Text color="gray.500" fontSize="md">
                  (Informations supplémentaires à venir)
                </Text>
              </TabPanel> */}
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Box>
  );
}