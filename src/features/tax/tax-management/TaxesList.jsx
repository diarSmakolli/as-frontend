import * as chakra from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiTrash2,
} from "react-icons/fi";
import SettingsModal from "../../administration/components/settings/SettingsModal";
import Loader from "../../../commons/Loader";
import MobileNav from "../../administration/layouts/MobileNav";
import SidebarContent from "../../administration/layouts/SidebarContent";
import { useAuth } from "../../administration/authContext/authContext";
import { taxService } from "../services/taxService";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const fontName = "Inter";
const primaryBg = "rgb(255,255,255)";
const secondaryBg = "rgb(241,241,241)";
const tertiaryBg = "rgb(50,50,50)";
const highlightBg = "rgb(60,60,60)";

export default function TaxesList() {
  const { account, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form states
  const [taxForm, setTaxForm] = useState({
    name: "",
    rate: "",
  });

  const toast = chakra.useToast();

  useEffect(() => {
    fetchTaxes();
  }, [currentPage, searchTerm, filters]);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        ...filters,
      };
      const response = await taxService.getAllTaxes(params);
      setTaxes(response.data.taxes);
      setPagination(response.data.pagination);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTax = async () => {
    try {
      const response = await taxService.createTax(taxForm);
      toast({
        description: response.data.message || "Tax created successfully",
        status: "success",
        duration: 5000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsCreateModalOpen(false);
      setTaxForm({ name: "", rate: "" });
      fetchTaxes();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleEditTax = async () => {
    try {
      const response = await taxService.editTax(selectedTax.id, taxForm);
      toast({
        description: response.data.message || "Tax updated successfully",
        status: "success",
        duration: 5000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsEditModalOpen(false);
      setTaxForm({ name: "", rate: "" });
      setSelectedTax(null);
      fetchTaxes();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleDeleteTax = async () => {
    try {
      const response = await taxService.deleteTax(selectedTax.id);
      toast({
        description: response.data.message || "Tax deleted successfully",
        status: "success",
        duration: 5000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsDeleteModalOpen(false);
      setSelectedTax(null);
      fetchTaxes();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const openEditModal = (tax) => {
    setSelectedTax(tax);
    setTaxForm({ name: tax.name, rate: tax.rate.toString() });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (tax) => {
    setSelectedTax(tax);
    setIsDeleteModalOpen(true);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <chakra.Box minH="100vh" bg={secondaryBg}>
        <chakra.Box display={{ base: "none", md: "block" }}>
          <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        </chakra.Box>
        {/* Mobile Sidebar: shown when menu is open */}
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
        {/* MobileNav: always visible, passes menu toggle */}
        <MobileNav
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onOpen={() => setIsSidebarOpen(true)}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <chakra.Box ml={{ base: 0, md: 60 }} p="5">
          {/* Header Section */}
          <chakra.Flex
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "left", md: "flex-start" }}
            mb={6}
          >
            <chakra.Box textAlign={{ base: "left", md: "left" }}>
              <chakra.Text
                color="gray.900"
                fontSize={{ base: "xl", md: "2xl" }}
                fontFamily={fontName}
                fontWeight="400"
                letterSpacing="wide"
                mb={1}
              >
                Tax Console
              </chakra.Text>
            </chakra.Box>

            <chakra.Button
              leftIcon={<FiPlus />}
              bg="black"
              color="white"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              mt={{ base: 4, md: 0 }}
              shadow="md"
              _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
              transition="all 0.2s"
            >
              Create New Tax
            </chakra.Button>
          </chakra.Flex>

          {/* Search and Filters */}
          <chakra.Box bg={primaryBg} p={4} borderRadius="lg" mb={6} shadow="sm">
            <chakra.Flex direction={{ base: "column", md: "row" }} gap={4}>
              <chakra.InputGroup flex="1">
                <chakra.InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.300" />
                </chakra.InputLeftElement>
                <chakra.Input
                  placeholder="Search taxes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </chakra.InputGroup>
              <chakra.Button
                leftIcon={<FiRefreshCw />}
                onClick={fetchTaxes}
                variant="outline"
              >
                Refresh
              </chakra.Button>
            </chakra.Flex>
          </chakra.Box>

          {/* Taxes Table */}
          <chakra.Box
            bg={primaryBg}
            borderRadius="lg"
            shadow="sm"
            overflow="hidden"
          >
            <chakra.Table variant="simple">
              <chakra.Thead bg="gray.50">
                <chakra.Tr>
                  <chakra.Th>Name</chakra.Th>
                  <chakra.Th>Rate (%)</chakra.Th>
                  <chakra.Th>Created Date</chakra.Th>
                  <chakra.Th>Actions</chakra.Th>
                </chakra.Tr>
              </chakra.Thead>
              <chakra.Tbody>
                {loading ? (
                  <chakra.Tr>
                    <chakra.Td colSpan={4} textAlign="center" py={8}>
                      <chakra.Spinner />
                    </chakra.Td>
                  </chakra.Tr>
                ) : taxes.length === 0 ? (
                  <chakra.Tr>
                    <chakra.Td colSpan={4} textAlign="center" py={8}>
                      No taxes found
                    </chakra.Td>
                  </chakra.Tr>
                ) : (
                  taxes.map((tax) => (
                    <chakra.Tr key={tax.id}>
                      <chakra.Td fontWeight="medium">{tax.name}</chakra.Td>
                      <chakra.Td>{tax.rate}%</chakra.Td>
                      <chakra.Td>
                        {new Date(tax.created_at).toLocaleDateString()}
                      </chakra.Td>
                      <chakra.Td>
                        <chakra.HStack spacing={2}>
                          <chakra.IconButton
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => openEditModal(tax)}
                          />
                          <chakra.IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => openDeleteModal(tax)}
                          />
                        </chakra.HStack>
                      </chakra.Td>
                    </chakra.Tr>
                  ))
                )}
              </chakra.Tbody>
            </chakra.Table>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <chakra.Flex
                justifyContent="space-between"
                alignItems="center"
                p={4}
                borderTop="1px solid"
                borderColor="gray.200"
              >
                <chakra.Text fontSize="sm" color="gray.600">
                  Page {pagination.current_page} of {pagination.total_pages}
                </chakra.Text>
                <chakra.HStack>
                  <chakra.Button
                    size="sm"
                    disabled={!pagination.has_prev_page}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </chakra.Button>
                  <chakra.Button
                    size="sm"
                    disabled={!pagination.has_next_page}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </chakra.Button>
                </chakra.HStack>
              </chakra.Flex>
            )}
          </chakra.Box>
        </chakra.Box>

        {/* Create Tax Modal */}
        <chakra.Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        >
          <chakra.ModalOverlay />
          <chakra.ModalContent>
            <chakra.ModalHeader>Create New Tax</chakra.ModalHeader>
            <chakra.ModalCloseButton />
            <chakra.ModalBody>
              <chakra.VStack spacing={4}>
                <chakra.FormControl>
                  <chakra.FormLabel>Tax Name</chakra.FormLabel>
                  <chakra.Input
                    value={taxForm.name}
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, name: e.target.value })
                    }
                    placeholder="Enter tax name"
                  />
                </chakra.FormControl>
                <chakra.FormControl>
                  <chakra.FormLabel>Rate (%)</chakra.FormLabel>
                  <chakra.Input
                    type="number"
                    step="0.01"
                    value={taxForm.rate}
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, rate: e.target.value })
                    }
                    placeholder="Enter tax rate"
                  />
                </chakra.FormControl>
              </chakra.VStack>
            </chakra.ModalBody>
            <chakra.ModalFooter>
              <chakra.Button
                variant="ghost"
                mr={3}
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </chakra.Button>
              <chakra.Button colorScheme="blue" onClick={handleCreateTax}>
                Create Tax
              </chakra.Button>
            </chakra.ModalFooter>
          </chakra.ModalContent>
        </chakra.Modal>

        {/* Edit Tax Modal */}
        <chakra.Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        >
          <chakra.ModalOverlay />
          <chakra.ModalContent>
            <chakra.ModalHeader>Edit Tax</chakra.ModalHeader>
            <chakra.ModalCloseButton />
            <chakra.ModalBody>
              <chakra.VStack spacing={4}>
                <chakra.FormControl>
                  <chakra.FormLabel>Tax Name</chakra.FormLabel>
                  <chakra.Input
                    value={taxForm.name}
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, name: e.target.value })
                    }
                    placeholder="Enter tax name"
                  />
                </chakra.FormControl>
                <chakra.FormControl>
                  <chakra.FormLabel>Rate (%)</chakra.FormLabel>
                  <chakra.Input
                    type="number"
                    step="0.01"
                    value={taxForm.rate}
                    onChange={(e) =>
                      setTaxForm({ ...taxForm, rate: e.target.value })
                    }
                    placeholder="Enter tax rate"
                  />
                </chakra.FormControl>
              </chakra.VStack>
            </chakra.ModalBody>
            <chakra.ModalFooter>
              <chakra.Button
                variant="ghost"
                mr={3}
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </chakra.Button>
              <chakra.Button colorScheme="blue" onClick={handleEditTax}>
                Update Tax
              </chakra.Button>
            </chakra.ModalFooter>
          </chakra.ModalContent>
        </chakra.Modal>

        {/* Delete Confirmation Modal */}
        <chakra.Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <chakra.ModalOverlay />
          <chakra.ModalContent>
            <chakra.ModalHeader>Delete Tax</chakra.ModalHeader>
            <chakra.ModalCloseButton />
            <chakra.ModalBody>
              <chakra.Text>
                Are you sure you want to delete the tax "{selectedTax?.name}"?
                This action cannot be undone.
              </chakra.Text>
            </chakra.ModalBody>
            <chakra.ModalFooter>
              <chakra.Button
                variant="ghost"
                mr={3}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </chakra.Button>
              <chakra.Button colorScheme="red" onClick={handleDeleteTax}>
                Delete
              </chakra.Button>
            </chakra.ModalFooter>
          </chakra.ModalContent>
        </chakra.Modal>
      </chakra.Box>
    </>
  );
}
