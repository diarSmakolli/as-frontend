import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Badge,
  IconButton,
  chakra,
  useToast,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { FaSyncAlt, FaSearch } from "react-icons/fa";
import { homeService } from "../home/services/homeService";
import Loader from "../../commons/Loader";
import { useAuth } from "../administration/authContext/authContext";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";

const initialFilters = {
  search: "",
  is_active: "",
  customer_type: "",
  email_verified: "",
  customer_group: "",
  preferred_language: "",
  preferred_currency: "",
  created_from: "",
  created_until: "",
};

export default function CustomersPage() {
  const { account, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [customers, setCustomers] = useState([]);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState(initialFilters);
  const toast = useToast();

  // Fetch customers
  const fetchCustomers = async (params = {}) => {
    setCustomerLoading(true);
    try {
      const res = await homeService.getAllCustomers({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...filters,
        ...params.filters,
      });
      setCustomers(res.data || []);
      setPagination(
        res.pagination || { page: 1, limit: 20, totalPages: 1, total: 0 }
      );
    } catch (error) {
      toast({
        title: "Erreur lors du chargement des clients.",
        description: error?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCustomerLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search/filter submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers({ page: 1 });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchCustomers({ page: newPage });
  };

  if (isLoading) return <Loader />;

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
        <Flex
          align="center"
          justify="space-between"
          mb={8}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading size="lg" color="#1a2947" fontWeight="700">
            Clients
          </Heading>
        </Flex>

        {/* Filters/Search */}
        <Box mb={6} bg="white" p={4} borderRadius="xl" boxShadow="sm">
          <form onSubmit={handleSearch}>
            <Flex
              wrap="wrap"
              gap={4}
              align="center"
              direction={{ base: "column", md: "row" }}
            >
              <Input
                name="search"
                placeholder="Recherche nom, email, société, téléphone..."
                value={filters.search}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "220px" }}
                bg="#f7fafc"
                borderRadius="full"
                fontWeight="500"
              />
              <Select
                name="is_active"
                value={filters.is_active}
                onChange={handleFilterChange}
                placeholder="Statut"
                width={{ base: "100%", md: "120px" }}
                borderRadius="full"
              >
                <option value="true">Actif</option>
                <option value="false">Inactif</option>
              </Select>
              <Select
                name="customer_type"
                value={filters.customer_type}
                onChange={handleFilterChange}
                placeholder="Type"
                width={{ base: "100%", md: "140px" }}
                borderRadius="full"
              >
                <option value="client">Client</option>
                <option value="business">Entreprise</option>
              </Select>
              <Select
                name="email_verified"
                value={filters.email_verified}
                onChange={handleFilterChange}
                placeholder="Email vérifié"
                width={{ base: "100%", md: "140px" }}
                borderRadius="full"
              >
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </Select>
              <Input
                name="customer_group"
                placeholder="Groupe"
                value={filters.customer_group}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "120px" }}
                bg="#f7fafc"
                borderRadius="full"
              />
              <Input
                name="preferred_language"
                placeholder="Langue"
                value={filters.preferred_language}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "120px" }}
                bg="#f7fafc"
                borderRadius="full"
              />
              <Input
                name="preferred_currency"
                placeholder="Devise"
                value={filters.preferred_currency}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "120px" }}
                bg="#f7fafc"
                borderRadius="full"
              />
              <Input
                name="created_from"
                type="date"
                value={filters.created_from}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "160px" }}
                borderRadius="full"
              />
              <Input
                name="created_until"
                type="date"
                value={filters.created_until}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "160px" }}
                borderRadius="full"
              />
              <Button
                leftIcon={<FaSearch />}
                colorScheme="blue"
                type="submit"
                borderRadius="full"
                fontWeight="600"
                px={6}
              >
                Rechercher
              </Button>
              <IconButton
                icon={<FaSyncAlt />}
                aria-label="Rafraîchir"
                size="md"
                onClick={() => fetchCustomers()}
                isLoading={customerLoading}
                borderRadius="full"
                colorScheme="gray"
              />
            </Flex>
          </form>
        </Box>

        {/* Customers Table */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" p={4} overflowX="auto">
          <Table size="md" variant="simple">
            <Thead bg="#f4f6fa">
              <Tr>
                <Th color="#1a2947" fontWeight="700">
                  Nom
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Email
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Type
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Entreprise
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Téléphone
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Statut
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Email vérifié
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Groupe
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Langue
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Devise
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Créé le
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {customerLoading ? (
                <Tr>
                  <Td colSpan={11}>
                    <Spinner size="sm" /> Chargement...
                  </Td>
                </Tr>
              ) : customers.length === 0 ? (
                <Tr>
                  <Td colSpan={11}>
                    <Text color="gray.500">Aucun client trouvé.</Text>
                  </Td>
                </Tr>
              ) : (
                customers.map((customer) => (
                  <Tr key={customer.id}>
                    <Td fontWeight="600" color="#1a2947">
                      {customer.first_name} {customer.last_name}
                    </Td>
                    <Td>{customer.email}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          customer.customer_type === "business"
                            ? "purple"
                            : "blue"
                        }
                        borderRadius="full"
                        px={2}
                      >
                        {customer.customer_type === "business"
                          ? "Entreprise"
                          : "Client"}
                      </Badge>
                    </Td>
                    <Td>{customer.business_name || "-"}</Td>
                    <Td>{customer.phone_primary || "-"}</Td>
                    <Td>
                      <Badge
                        colorScheme={customer.is_active ? "green" : "red"}
                        borderRadius="full"
                        px={3}
                      >
                        {customer.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={customer.email_verified ? "green" : "red"}
                        borderRadius="full"
                        px={3}
                      >
                        {customer.email_verified ? "Oui" : "Non"}
                      </Badge>
                    </Td>
                    <Td>{customer.customer_group || "-"}</Td>
                    <Td>{customer.preferred_language || "-"}</Td>
                    <Td>{customer.preferred_currency || "-"}</Td>
                    <Td>
                      {customer.created_at
                        ? new Date(customer.created_at).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                        fontWeight="600"
                        as='a'
                        href={`/customer-details/${customer.id}`}
                      >
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
              onClick={() => handlePageChange(pagination.page - 1)}
              isDisabled={pagination.page <= 1 || customerLoading}
              borderRadius="full"
              colorScheme="gray"
              fontWeight="600"
            >
              Précédent
            </Button>
            <Text fontSize="sm" color="#1a2947" fontWeight="600">
              Page {pagination.page} / {pagination.totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              isDisabled={
                pagination.page >= pagination.totalPages || customerLoading
              }
              borderRadius="full"
              colorScheme="gray"
              fontWeight="600"
            >
              Suivant
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}