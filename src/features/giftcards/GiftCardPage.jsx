import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  chakra,
  Select,
} from "@chakra-ui/react";
import { FaSyncAlt, FaPlus, FaEdit } from "react-icons/fa";
import { homeService } from "../home/services/homeService";
import Loader from "../../commons/Loader";
import { useAuth } from "../administration/authContext/authContext";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";
import { customToastContainerStyle } from "../../commons/toastStyles";

const initialState = {
  code: "",
  original_amount: "",
  valid_from: "",
  valid_until: "",
  is_active: true,
  recipient_email: "",
  message: "",
};

export default function GiftCardPage() {
  const { account, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [giftCardLoading, setGiftCardLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Edit modal state
  const [editForm, setEditForm] = useState(initialState);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingGiftCardId, setEditingGiftCardId] = useState(null);

  const {
    isOpen: isCreateModalOpen,
    onOpen: onOpenCreateModal,
    onClose: onCloseCreateModal,
  } = useDisclosure();

  // Fetch gift cards
  const fetchGiftCards = async (params = {}) => {
    setGiftCardLoading(true);
    try {
      const res = await homeService.getAllGiftCards({
        page: params.page || 1,
        limit: params.limit || pagination.limit,
        search: params.search !== undefined ? params.search : search,
      });
      setGiftCards(res.data || []);
      setPagination(
        res.pagination || { page: 1, limit: 10, totalPages: 1, total: 0 }
      );
    } catch (error) {
      toast({
        title: "Erreur lors du chargement des cartes cadeaux.",
        description: error?.message || "Erreur inconnue",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setGiftCardLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftCards();
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

    const payload = {
      ...form,
      original_amount: form.original_amount ? Number(form.original_amount) : null,
    };

    try {
      await homeService.createGiftCard(payload);
      toast({
        title: "Carte cadeau créée.",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setForm(initialState);
      onCloseCreateModal();
      fetchGiftCards({ page: 1 });
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

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchGiftCards({ page: newPage });
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchGiftCards({ page: 1, search });
  };

  // Edit modal handlers
  const handleEditClick = (giftCard) => {
    setEditingGiftCardId(giftCard.id);
    setEditForm({
      ...giftCard,
      original_amount: giftCard.original_amount || "",
      valid_from: giftCard.valid_from ? giftCard.valid_from.slice(0, 10) : "",
      valid_until: giftCard.valid_until ? giftCard.valid_until.slice(0, 10) : "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    const payload = {
      ...editForm,
      original_amount: editForm.original_amount ? Number(editForm.original_amount) : null,
    };

    try {
      await homeService.updateGiftCard(editingGiftCardId, payload);
      toast({
        title: "Carte cadeau mise à jour.",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsEditModalOpen(false);
      setEditingGiftCardId(null);
      setEditForm(initialState);
      fetchGiftCards({ page: pagination.page });
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
            Cartes cadeaux
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
            Nouvelle carte cadeau
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
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, width: "100%" }}>
            <Input
              size="md"
              placeholder="Recherche par code, email, message..."
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
            onClick={() => fetchGiftCards()}
            isLoading={giftCardLoading}
            borderRadius="full"
            colorScheme="gray"
            ml={{ base: 0, md: 2 }}
          />
        </Flex>

        {/* Gift Cards Table */}
        <Box
          bg="white"
          borderRadius="xl"
          boxShadow="sm"
          p={4}
          overflowX="auto"
        >
          <Table size="md" variant="simple">
            <Thead bg="#f4f6fa">
              <Tr>
                <Th color="#1a2947" fontWeight="700">Code</Th>
                <Th color="#1a2947" fontWeight="700">Montant</Th>
                <Th color="#1a2947" fontWeight="700">Restant</Th>
                <Th color="#1a2947" fontWeight="700">Active</Th>
                <Th color="#1a2947" fontWeight="700">Valide du</Th>
                <Th color="#1a2947" fontWeight="700">Valide jusqu'à</Th>
                <Th color="#1a2947" fontWeight="700">Email destinataire</Th>
                <Th color="#1a2947" fontWeight="700">Message</Th>
                <Th color="#1a2947" fontWeight="700">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {giftCardLoading ? (
                <Tr>
                  <Td colSpan={9}>
                    <Spinner size="sm" /> Chargement...
                  </Td>
                </Tr>
              ) : giftCards.length === 0 ? (
                <Tr>
                  <Td colSpan={9}>
                    <Text color="gray.500">Aucune carte cadeau trouvée.</Text>
                  </Td>
                </Tr>
              ) : (
                giftCards.map((card) => (
                  <Tr key={card.id}>
                    <Td fontWeight="600" color="#1a2947">{card.code}</Td>
                    <Td>€{parseFloat(card.original_amount).toFixed(2)}</Td>
                    <Td>€{parseFloat(card.remaining_amount).toFixed(2)}</Td>
                    <Td>
                      <Badge
                        colorScheme={card.is_active ? "green" : "red"}
                        borderRadius="full"
                        px={3}
                      >
                        {card.is_active ? "Oui" : "Non"}
                      </Badge>
                    </Td>
                    <Td>
                      {card.valid_from
                        ? new Date(card.valid_from).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td>
                      {card.valid_until
                        ? new Date(card.valid_until).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td>{card.recipient_email || "-"}</Td>
                    <Td maxW="200px" whiteSpace="pre-line">
                      {card.message || "-"}
                    </Td>
                    <Td>
                      <IconButton
                        icon={<FaEdit />}
                        aria-label="Edit"
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                        onClick={() => handleEditClick(card)}
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
              isDisabled={pagination.page <= 1 || giftCardLoading}
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
                pagination.page >= pagination.totalPages || giftCardLoading
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

      {/* Create Gift Card Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCloseCreateModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={2}>
          <ModalHeader fontWeight="700" color="#1a2947">
            Nouvelle carte cadeau
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="create-giftcard-form" onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Input name="code" value={form.code} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Montant</FormLabel>
                  <Input
                    name="original_amount"
                    type="number"
                    value={form.original_amount}
                    onChange={handleChange}
                    placeholder="Ex: 50"
                  />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Valide à partir de</FormLabel>
                    <Input
                      name="valid_from"
                      type="date"
                      value={form.valid_from}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valide jusqu'à</FormLabel>
                    <Input
                      name="valid_until"
                      type="date"
                      value={form.valid_until}
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
                <FormControl>
                  <FormLabel>Email destinataire</FormLabel>
                  <Input
                    name="recipient_email"
                    type="email"
                    value={form.recipient_email}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                  />
                </FormControl>
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
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="create-giftcard-form"
              isLoading={loading}
              loadingText="Création..."
              borderRadius="full"
            >
              Créer la carte cadeau
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Gift Card Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl" p={2}>
          <ModalHeader fontWeight="700" color="#1a2947">
            Modifier la carte cadeau
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="edit-giftcard-form" onSubmit={handleEditSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Code</FormLabel>
                  <Input name="code" value={editForm.code} onChange={handleEditChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Montant</FormLabel>
                  <Input
                    name="original_amount"
                    type="number"
                    value={editForm.original_amount}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <Stack direction="row" spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Valide à partir de</FormLabel>
                    <Input
                      name="valid_from"
                      type="date"
                      value={editForm.valid_from}
                      onChange={handleEditChange}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Valide jusqu'à</FormLabel>
                    <Input
                      name="valid_until"
                      type="date"
                      value={editForm.valid_until}
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
                <FormControl>
                  <FormLabel>Email destinataire</FormLabel>
                  <Input
                    name="recipient_email"
                    type="email"
                    value={editForm.recipient_email}
                    onChange={handleEditChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Message</FormLabel>
                  <Textarea
                    name="message"
                    value={editForm.message}
                    onChange={handleEditChange}
                  />
                </FormControl>
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
                setEditingGiftCardId(null);
              }}
              borderRadius="full"
            >
              Annuler
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              form="edit-giftcard-form"
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