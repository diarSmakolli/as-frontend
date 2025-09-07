import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Switch,
  VStack,
  Heading,
  useToast,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Flex,
  Text,
  IconButton,
  chakra,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { homeService } from "../home/services/homeService";
import { FaSyncAlt, FaPlus, FaEdit } from "react-icons/fa";
import Loader from "../../commons/Loader";
import { useAuth } from "../administration/authContext/authContext";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";
import { customToastContainerStyle } from "../../commons/toastStyles";

const initialState = {
  code: "",
  title: "",
  description: "",
  type: "percentage",
  discount_value: "",
  minimum_order_amount: "",
  maximum_discount_amount: "",
  usage_limit: "",
  usage_limit_per_customer: 1,
  is_active: true,
  valid_from: "",
  valid_until: "",
  applicable_to: "all",
  applicable_product_ids: "",
  applicable_category_ids: "",
};

export default function PromotionPage() {
  const { account, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editForm, setEditForm] = useState(initialState);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingPromotionId, setEditingPromotionId] = useState(null);

  const {
    isOpen: isCreateModalOpen,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure();

  // Open edit modal and populate form
  const handleEditClick = (promo) => {
    setEditingPromotionId(promo.id);
    setEditForm({
      ...promo,
      applicable_product_ids: Array.isArray(promo.applicable_product_ids)
        ? promo.applicable_product_ids.join(",")
        : promo.applicable_product_ids || "",
      applicable_category_ids: Array.isArray(promo.applicable_category_ids)
        ? promo.applicable_category_ids.join(",")
        : promo.applicable_category_ids || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle edit form change
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Fetch promotions
  const fetchPromotions = async (params = {}) => {
    setPromoLoading(true);
    try {
      const res = await homeService.getAllPromotions({
        page: params.page || 1,
        limit: params.limit || pagination.limit,
        search: params.search !== undefined ? params.search : search,
      });
      setPromotions(res.data || []);
      setPagination(
        res.pagination || { page: 1, limit: 10, totalPages: 1, total: 0 }
      );
    } catch (error) {
      toast({
        title: "Erreur lors du chargement des promotions.",
        description: error?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setPromoLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare IDs as arrays if needed
    const payload = {
      ...form,
      discount_value: form.discount_value ? Number(form.discount_value) : null,
      minimum_order_amount: form.minimum_order_amount
        ? Number(form.minimum_order_amount)
        : 0,
      maximum_discount_amount: form.maximum_discount_amount
        ? Number(form.maximum_discount_amount)
        : null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
      usage_limit_per_customer: form.usage_limit_per_customer
        ? Number(form.usage_limit_per_customer)
        : 1,
      applicable_product_ids:
        form.applicable_to === "specific_products" &&
        form.applicable_product_ids
          ? form.applicable_product_ids.split(",").map((id) => id.trim())
          : [],
      applicable_category_ids:
        form.applicable_to === "specific_categories" &&
        form.applicable_category_ids
          ? form.applicable_category_ids.split(",").map((id) => id.trim())
          : [],
    };

    try {
      await homeService.createPromotion(payload);
      toast({
        title: "Promotion créée.",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setForm(initialState);
      onCloseCreateModal();
      fetchPromotions({ page: 1 }); // Refresh list after creation
    } catch (error) {
      toast({
        title: "Erreur lors de la création.",
        description: error?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const payload = {
      ...editForm,
      discount_value: editForm.discount_value
        ? Number(editForm.discount_value)
        : null,
      minimum_order_amount: editForm.minimum_order_amount
        ? Number(editForm.minimum_order_amount)
        : 0,
      maximum_discount_amount: editForm.maximum_discount_amount
        ? Number(editForm.maximum_discount_amount)
        : null,
      usage_limit: editForm.usage_limit ? Number(editForm.usage_limit) : null,
      usage_limit_per_customer: editForm.usage_limit_per_customer
        ? Number(editForm.usage_limit_per_customer)
        : 1,
      applicable_product_ids:
        editForm.applicable_to === "specific_products" &&
        editForm.applicable_product_ids
          ? editForm.applicable_product_ids.split(",").map((id) => id.trim())
          : [],
      applicable_category_ids:
        editForm.applicable_to === "specific_categories" &&
        editForm.applicable_category_ids
          ? editForm.applicable_category_ids.split(",").map((id) => id.trim())
          : [],
    };

    try {
      await homeService.updatePromotion(editingPromotionId, payload);
      toast({
        title: "Promotion mise à jour.",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsEditModalOpen(false);
      setEditingPromotionId(null);
      setEditForm(initialState);
      fetchPromotions({ page: pagination.page });
    } catch (error) {
      toast({
        title: "Erreur lors de la mise à jour.",
        description: error?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setEditLoading(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchPromotions({ page: newPage });
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPromotions({ page: 1, search });
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
          <Heading fontSize="2xl" color="#1a2947" fontWeight="500">
            Promotions
          </Heading>
          <Button
            leftIcon={<FaPlus />}
            colorScheme="blue"
            onClick={onOpenCreateModal}
            borderRadius="full"
            fontWeight="600"
            px={6}
            size="md"
            boxShadow="sm"
          >
            Nouvelle promotion
          </Button>
        </Flex>

        {/* Search and refresh */}
        <Flex
          mb={6}
          align="center"
          gap={2}
          bg="white"
          p={4}
          borderRadius="xl"
          boxShadow="sm"
          direction={{ base: "column", md: "row" }}
        >
          <form
            onSubmit={handleSearch}
            style={{ display: "flex", gap: 8, width: "100%" }}
          >
            <Input
              size="md"
              placeholder="Recherche par code, titre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              width={{ base: "100%", md: "300px" }}
              bg="#f7fafc"
              borderRadius="full"
              fontWeight="500"
            />
            <Button
              size="md"
              type="submit"
              colorScheme="blue"
              borderRadius="full"
              fontWeight="600"
              px={6}
            >
              Rechercher
            </Button>
          </form>
          <IconButton
            icon={<FaSyncAlt />}
            aria-label="Rafraîchir"
            size="md"
            onClick={() => fetchPromotions()}
            isLoading={promoLoading}
            borderRadius="full"
            colorScheme="gray"
            ml={{ base: 0, md: 2 }}
          />
        </Flex>

        {/* Promotions Table */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" p={4} overflowX="auto">
          <Table size="md" variant="simple">
            <Thead bg="#f4f6fa">
              <Tr>
                <Th color="#1a2947" fontWeight="700">
                  Code
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Titre
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Type
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Valeur
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Active
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Valide du
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Valide jusqu'à
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Utilisations
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {promoLoading ? (
                <Tr>
                  <Td colSpan={8}>
                    <Spinner size="sm" /> Chargement...
                  </Td>
                </Tr>
              ) : promotions.length === 0 ? (
                <Tr>
                  <Td colSpan={8}>
                    <Text color="gray.500">Aucune promotion trouvée.</Text>
                  </Td>
                </Tr>
              ) : (
                promotions.map((promo) => (
                  <Tr key={promo.id}>
                    <Td fontWeight="600" color="#1a2947">
                      {promo.code}
                    </Td>
                    <Td>{promo.title}</Td>
                    <Td>
                      <Badge colorScheme="purple" borderRadius="full" px={2}>
                        {promo.type}
                      </Badge>
                    </Td>
                    <Td>
                      {promo.type === "percentage"
                        ? `${promo.discount_value}%`
                        : promo.type === "fixed_amount"
                        ? `€${promo.discount_value}`
                        : promo.type === "free_shipping"
                        ? "Livraison gratuite"
                        : promo.type === "buy_x_get_y"
                        ? "Buy X Get Y"
                        : "-"}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={promo.is_active ? "green" : "red"}
                        borderRadius="full"
                        px={3}
                      >
                        {promo.is_active ? "Oui" : "Non"}
                      </Badge>
                    </Td>
                    <Td>
                      {promo.valid_from
                        ? new Date(promo.valid_from).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td>
                      {promo.valid_until
                        ? new Date(promo.valid_until).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td>
                      {promo.usage_count || 0}
                      {promo.usage_limit ? ` / ${promo.usage_limit}` : ""}
                    </Td>
                    <Td>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                        onClick={() => handleEditClick(promo)}
                        variant="ghost"
                      />
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
              isDisabled={pagination.page <= 1 || promoLoading}
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
                pagination.page >= pagination.totalPages || promoLoading
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

      {/* Create Promotion Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={onCloseCreateModal}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={2}>
          <ModalHeader fontWeight="700" color="#1a2947">
            Create Promotion
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="create-promo-form" onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Input
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select name="type" value={form.type} onChange={handleChange}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed_amount">Fixed Amount</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="buy_x_get_y">Buy X Get Y</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Discount value</FormLabel>
                  <Input
                    name="discount_value"
                    type="number"
                    value={form.discount_value}
                    onChange={handleChange}
                    placeholder="Ex: 10 (pour 10% ou 10€)"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Minimum order amount</FormLabel>
                  <Input
                    name="minimum_order_amount"
                    type="number"
                    value={form.minimum_order_amount}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Maximum discount amount</FormLabel>
                  <Input
                    name="maximum_discount_amount"
                    type="number"
                    value={form.maximum_discount_amount}
                    onChange={handleChange}
                  />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl>
                    <FormLabel>Usage Limit</FormLabel>
                    <Input
                      name="usage_limit"
                      type="number"
                      value={form.usage_limit}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Usage Limit Per Customer</FormLabel>
                    <Input
                      name="usage_limit_per_customer"
                      type="number"
                      value={form.usage_limit_per_customer}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Active</FormLabel>
                  <Switch
                    name="is_active"
                    isChecked={form.is_active}
                    onChange={handleChange}
                  />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Valid From</FormLabel>
                    <Input
                      name="valid_from"
                      type="date"
                      value={form.valid_from}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valid Until</FormLabel>
                    <Input
                      name="valid_until"
                      type="date"
                      value={form.valid_until}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <FormControl isRequired>
                  <FormLabel>Applicability</FormLabel>
                  <Select
                    name="applicable_to"
                    value={form.applicable_to}
                    onChange={handleChange}
                  >
                    <option value="all">All products</option>
                    <option value="specific_products">Specific products</option>
                    <option value="specific_categories">
                      Specific categories
                    </option>
                  </Select>
                </FormControl>
                {form.applicable_to === "specific_products" && (
                  <FormControl>
                    <FormLabel>Product IDs (comma separated)</FormLabel>
                    <Input
                      name="applicable_product_ids"
                      value={form.applicable_product_ids}
                      onChange={handleChange}
                      placeholder="Ex: uuid1,uuid2,uuid3"
                    />
                  </FormControl>
                )}
                {form.applicable_to === "specific_categories" && (
                  <FormControl>
                    <FormLabel>Category IDs (comma separated)</FormLabel>
                    <Input
                      name="applicable_category_ids"
                      value={form.applicable_category_ids}
                      onChange={handleChange}
                      placeholder="Ex: uuid1,uuid2"
                    />
                  </FormControl>
                )}
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={3}
              onClick={() => {
                setForm(initialState);
                onCloseCreateModal();
              }}
              borderRadius="full"
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="create-promo-form"
              isLoading={loading}
              loadingText="Création..."
              borderRadius="full"
            >
              Create Promotion
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Promotion Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={2}>
          <ModalHeader fontWeight="700" color="#1a2947">
            Modifier la promotion
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="edit-promo-form" onSubmit={handleEditSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Input
                    name="code"
                    value={editForm.code}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Titre</FormLabel>
                  <Input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                  >
                    <option value="percentage">Pourcentage</option>
                    <option value="fixed_amount">Montant fixe</option>
                    <option value="free_shipping">Livraison gratuite</option>
                    <option value="buy_x_get_y">Achetez X obtenez Y</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Valeur de la remise</FormLabel>
                  <Input
                    name="discount_value"
                    type="number"
                    value={editForm.discount_value}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Montant minimum de commande</FormLabel>
                  <Input
                    name="minimum_order_amount"
                    type="number"
                    value={editForm.minimum_order_amount}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Montant maximum de remise</FormLabel>
                  <Input
                    name="maximum_discount_amount"
                    type="number"
                    value={editForm.maximum_discount_amount}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl>
                    <FormLabel>Limite d'utilisation</FormLabel>
                    <Input
                      name="usage_limit"
                      type="number"
                      value={editForm.usage_limit}
                      onChange={handleEditChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Limite par client</FormLabel>
                    <Input
                      name="usage_limit_per_customer"
                      type="number"
                      value={editForm.usage_limit_per_customer}
                      onChange={handleEditChange}
                    />
                  </FormControl>
                </Stack>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Active</FormLabel>
                  <Switch
                    name="is_active"
                    isChecked={editForm.is_active}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Valide à partir de</FormLabel>
                    <Input
                      name="valid_from"
                      type="date"
                      value={
                        editForm.valid_from
                          ? editForm.valid_from.slice(0, 10)
                          : ""
                      }
                      onChange={handleEditChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valide jusqu'à</FormLabel>
                    <Input
                      name="valid_until"
                      type="date"
                      value={
                        editForm.valid_until
                          ? editForm.valid_until.slice(0, 10)
                          : ""
                      }
                      onChange={handleEditChange}
                    />
                  </FormControl>
                </Stack>
                <FormControl isRequired>
                  <FormLabel>Applicabilité</FormLabel>
                  <Select
                    name="applicable_to"
                    value={editForm.applicable_to}
                    onChange={handleEditChange}
                  >
                    <option value="all">Tous les produits</option>
                    <option value="specific_products">
                      Produits spécifiques
                    </option>
                    <option value="specific_categories">
                      Catégories spécifiques
                    </option>
                  </Select>
                </FormControl>
                {editForm.applicable_to === "specific_products" && (
                  <FormControl>
                    <FormLabel>
                      ID des produits (séparés par des virgules)
                    </FormLabel>
                    <Input
                      name="applicable_product_ids"
                      value={editForm.applicable_product_ids}
                      onChange={handleEditChange}
                      placeholder="Ex: uuid1,uuid2,uuid3"
                    />
                  </FormControl>
                )}
                {editForm.applicable_to === "specific_categories" && (
                  <FormControl>
                    <FormLabel>
                      ID des catégories (séparés par des virgules)
                    </FormLabel>
                    <Input
                      name="applicable_category_ids"
                      value={editForm.applicable_category_ids}
                      onChange={handleEditChange}
                      placeholder="Ex: uuid1,uuid2"
                    />
                  </FormControl>
                )}
              </VStack>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="gray"
              mr={3}
              onClick={() => {
                setEditForm(initialState);
                setIsEditModalOpen(false);
                setEditingPromotionId(null);
              }}
              borderRadius="full"
            >
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="edit-promo-form"
              isLoading={editLoading}
              loadingText="Mise à jour..."
              borderRadius="full"
            >
              Mettre à jour
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
