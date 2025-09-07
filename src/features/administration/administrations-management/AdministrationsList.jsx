import * as chakra from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../authContext/authContext";
import SidebarContent from "../layouts/SidebarContent";
import MobileNav from "../layouts/MobileNav";
import SettingsModal from "../components/settings/SettingsModal";
import Pagination from "../../../commons/components/Pagination";
import { administrationService } from "../services/administrationService";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatRelativeTime,
  formatOptions,
  formatWithTimezone,
} from "../../../commons/formatOptions";
import {
  FaUser,
  FaFilter,
  FaSearch,
  FaSync,
  FaEllipsisV,
  FaEdit,
  FaLock,
  FaBan,
  FaExclamationTriangle,
  FaCheck,
  FaPlus,
  FaClock,
  FaChevronDown,
  FaKey,
} from "react-icons/fa";
import EditAccountModal from "./components/EditAccountModal";
import { handleApiError } from "../../../commons/handleApiError";
import AdminActionConfirmModal from "./components/AdminActionConfirmModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import { usePreferences } from "../authContext/preferencesProvider";
import { customToastContainerStyle } from "../../../commons/toastStyles";
import CreateAccountModal from "./components/CreateAccountModal";
import Loader from "../../../commons/Loader";
import { useNavigate } from "react-router-dom";
import EditPercentageModal from "./components/EditPercentageModal";

const fontName = "Inter";

const colors = {
  background: "rgb(22,22,22)",
  backgroundLight: "rgb(35,35,35)",
  backgroundHover: "rgb(45,45,45)",
  backgroundActive: "rgb(50,50,50)",
  borderColor: "rgb(60,60,60)",
  textPrimary: "gray.900",
  textSecondary: "rgb(180,180,180)",
  textMuted: "rgb(130,130,130)",
  accent: "rgb(79,161,230)",
  focusRing: "rgb(66,153,225, 0.6)",
};

export default function AdministrationsList() {
  const navigate = useNavigate();
  const { account } = useAuth();
  const { currentTimezone } = usePreferences();
  const toast = chakra.useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState(null);
  const actionMenuRef = useRef(null);
  const tableRef = useRef(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] =
    useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditPercentageModalOpen, setIsEditPercentageModalOpen] = useState(false);
  const [isProcessRewardsModalOpen, setIsProcessRewardsModalOpen] = useState(false);
  const [isProcessingRewards, setIsProcessingRewards] = useState(false);



  const handleCreateAccountSuccess = () => {
    fetchUsers(currentPage);
  };

  const [filters, setFilters] = useState({
    role: "",
    is_inactive: "",
    is_suspicious: "",
    is_verified: "",
    is_locked: "",
    sort_by: "created_at",
    sort_order: "DESC",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target)
      ) {
        setActiveActionMenu(null);
      }
    };

    if (activeActionMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activeActionMenu]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 10 };

      if (searchQuery) {
        params.search = searchQuery;
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "") {
          params[key] = value;
        }
      });

      const response = await administrationService.getAllUsers(params);
      setUsers(response.data.data.accounts);
      setTotalItems(response.data.data.total_items);
      setCurrentPage(response.data.data.current_page);
      setTotalPages(response.data.data.total_pages);
      setError(null);
    } catch (err) {
      setUsers([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setActiveSavedFilter(null);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchUsers(1);
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      role: "",
      is_inactive: "",
      is_suspicious: "",
      is_verified: "",
      is_locked: "",
      sort_by: "created_at",
      sort_order: "DESC",
    });
    setDateRange({ from: "", to: "" });
    setSearchQuery("");
    setActiveSavedFilter(null);
    fetchUsers(1);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      fetchUsers(1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchUsers(page);
    if (tableRef.current) {
      const yOffset = -20;
      const y =
        tableRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toggleActionMenu = (userId) => {
    setActiveActionMenu(activeActionMenu === userId ? null : userId);
  };

  const handleActionMenuKeyDown = (e, userId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleActionMenu(userId);
    }
  };

  const handleUserAction = (action, userId) => {
    setActiveActionMenu(null);

    const user = users.find((u) => u.id === userId);

    if (action === "edit") {
      setSelectedUser(user);
      setIsEditModalOpen(true);
    } else if (action === "resetPassword") {
      setSelectedUser(user);
      setIsResetPasswordModalOpen(true);
    } else {
      let actionToConfirm = action;

      if (action === "lock" && user.is_locked) {
        actionToConfirm = "unlock";
      } else if (action === "verify" && user.is_verified) {
        actionToConfirm = "unverify";
      } else if (action === "suspicious" && user.is_suspicious) {
        actionToConfirm = "unsuspicious";
      } else if (action === "deactivate" && user.is_inactive) {
        actionToConfirm = "activate";
      }

      setSelectedUser(user);
      setCurrentAction(actionToConfirm);
      setIsActionModalOpen(true);
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !currentAction) return;

    setIsProcessingAction(true);

    try {
      let result;
      let successMessage = "";

      switch (currentAction) {
        case "lock":
          result = await administrationService.lockAccount(selectedUser.id);
          successMessage = "Account has been locked successfully";
          break;
        case "unlock":
          result = await administrationService.unlockAccount(selectedUser.id);
          successMessage = "Account has been unlocked successfully";
          break;
        case "verify":
          result = await administrationService.verifyAccount(selectedUser.id);
          successMessage = "Account has been verified successfully";
          break;
        case "unverify":
          result = await administrationService.unverifyAccount(
            selectedUser.id,
            false
          );
          successMessage = "Account verification has been removed";
          break;
        case "suspicious":
          result = await administrationService.lockAccount(
            selectedUser.id,
            true
          );
          successMessage = "Account has been marked as suspicious";
          break;
        case "unsuspicious":
          result = await administrationService.unlockAccount(
            selectedUser.id,
            false
          );
          successMessage = "Suspicious flag has been cleared";
          break;
        case "deactivate":
          result = await administrationService.lockAccount(
            selectedUser.id,
            true
          );
          successMessage = "Account has been deactivated";
          break;
        case "activate":
          result = await administrationService.unlockAccount(
            selectedUser.id,
            false
          );
          successMessage = "Account has been activated";
          break;
        default:
          break;
      }

      toast({
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      fetchUsers(currentPage);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsProcessingAction(false);
      setIsActionModalOpen(false);
      setCurrentAction(null);
    }
  };

  const handlePasswordResetSuccess = () => {
    fetchUsers(currentPage);
  };

  const closeActionModal = () => {
    setIsActionModalOpen(false);
    setCurrentAction(null);
    setSelectedUser(null);
  };

  const handleEditSuccess = () => {
    fetchUsers(currentPage);
  };

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "global-administrator", label: "Global Administrator" },
    { value: "administrator", label: "Administrator" },
    { value: "supplier", label: "Supplier" },
    { value: "employee", label: "Employee" },
  ];

  const booleanOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <chakra.Box minH="100vh" bg={"rgb(241,241,241)"}>
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

        <EditAccountModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onSuccess={handleEditSuccess}
        />

        <AdminActionConfirmModal
          isOpen={isActionModalOpen}
          onClose={closeActionModal}
          onConfirm={handleConfirmAction}
          action={currentAction}
          user={selectedUser}
          isLoading={isProcessingAction}
        />

        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          onClose={() => setIsResetPasswordModalOpen(false)}
          user={selectedUser}
          onSuccess={handlePasswordResetSuccess}
        />

        <CreateAccountModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateAccountSuccess}
        />

        <EditPercentageModal
          isOpen={isEditPercentageModalOpen}
          onClose={() => setIsEditPercentageModalOpen(false)}
          user={selectedUser}
          onSuccess={fetchUsers}
          administrationService={administrationService}
        />

        <chakra.Box
          ml={{ base: 0, md: 60 }}
          p={{ base: 3, md: 5 }}
          transition="all 0.3s"
        >
          <chakra.Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "flex-end" }}
            mb={6}
          >
            <chakra.Text
              color={colors.textPrimary}
              fontSize={{ base: "2xl", md: "3xl" }}
              fontFamily={fontName}
              fontWeight="light"
            >
              Administrations Console
            </chakra.Text>

            <chakra.Box>
              <chakra.Button
                leftIcon={<FaPlus />}
                size="sm"
                mt={{ base: 3, md: 0 }}
                bg="black"
                _hover={{ bg: "black" }}
                transition="all 0.2s"
                onClick={() => setIsCreateModalOpen(true)}
                color="white"
              >
                Create Account
              </chakra.Button>

              <chakra.Button
                colorScheme="green"
                variant="solid"
                size="sm"
                ml={{ base: 0, md: 4 }}
                mt={{ base: 3, md: 0 }}
                onClick={() => setIsProcessRewardsModalOpen(true)}
              >
                Process Reward Payments
              </chakra.Button>
            </chakra.Box>
          </chakra.Flex>

          <chakra.Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={4}
            mb={6}
          >
            <StatCard
              title="Total Users"
              value={totalItems}
              icon={<FaUser />}
              color="black"
              bg={"#fff"}
              borderColor={"gray.200"}
            />
            <StatCard
              title="Administrators"
              value={
                users.filter(
                  (u) =>
                    u.role === "administrator" ||
                    u.role === "global-administrator"
                ).length
              }
              icon={<FaCheck />}
              color="black"
              bg={"#fff"}
              borderColor={"gray.200"}
            />
            <StatCard
              title="Suppliers"
              value={users.filter((u) => u.role === "supplier").length}
              icon={<FaUser />}
              color="black"
              bg={"#fff"}
              borderColor={"gray.200"}
            />
            <StatCard
              title="Locked Accounts"
              value={users.filter((u) => u.is_locked).length}
              icon={<FaLock />}
              color="black"
              bg={"#fff"}
              borderColor={"gray.200"}
            />
          </chakra.Grid>

          <chakra.Flex
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "stretch", md: "center" }}
            mb={6}
            gap={4}
          >
            <chakra.InputGroup
              size="md"
              maxW={{ base: "100%", md: "400px" }}
              boxShadow="sm"
            >
              <chakra.InputLeftElement
                pointerEvents="none"
                color={colors.textMuted}
              >
                <FaSearch />
              </chakra.InputLeftElement>
              <chakra.Input
                bg={"rgb(255,255,255)"}
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                borderColor={"gray.300"}
                rounded="xl"
                _focus={{
                  borderColor: "blue.400",
                  boxShadow: `0 0 0 1px ${colors.focusRing}`,
                }}
                color={colors.textPrimary}
                _hover={{ borderColor: "blue.300" }}
                aria-label="Search users"
              />
            </chakra.InputGroup>

            <chakra.Flex
              gap={3}
              flexWrap="wrap"
              justifyContent={{ base: "flex-start", sm: "flex-end" }}
            >
              <chakra.Button
                leftIcon={<FaFilter />}
                size="sm"
                bg="black"
                color="white"
                _hover={{ bg: "black", transform: "translateY(-1px)" }}
                _active={{ bg: "black" }}
                boxShadow="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                transition="all 0.2s"
              >
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </chakra.Button>

              <chakra.Button
                leftIcon={<FaSync />}
                size="sm"
                onClick={resetFilters}
                title="Reset filters"
                color="white"
                bg="black"
                _hover={{
                  bg: "black",
                  transform: "translateY(-1px)",
                }}
                boxShadow="sm"
                transition="all 0.2s"
              >
                Reset
              </chakra.Button>
            </chakra.Flex>
          </chakra.Flex>

          <AnimatePresence>
            {isFilterOpen && (
              <chakra.Box
                as={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                overflow="hidden"
                mb={6}
              >
                <chakra.Box
                  bg={"#fff"}
                  p={5}
                  rounded="xl"
                  boxShadow="lg"
                  borderWidth="1px"
                  borderColor={"gray.200"}
                >
                  <chakra.Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(5, 1fr)",
                    }}
                    gap={5}
                    mb={5}
                  >
                    <chakra.Box>
                      <chakra.Text
                        mb={2}
                        color={colors.textPrimary}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Role
                      </chakra.Text>
                      <chakra.Menu placement="bottom">
                        {({ isOpen }) => (
                          <>
                            <chakra.MenuButton
                              as={chakra.Button}
                              w="100%"
                              textAlign="left"
                              rightIcon={<FaChevronDown />}
                              bg={"rgb(241,241,241)"}
                              borderColor={colors.borderColor}
                              color={
                                filters.role
                                  ? colors.textPrimary
                                  : colors.textMuted
                              }
                              size="sm"
                            >
                              {roleOptions.find(
                                (opt) => opt.value === filters.role
                              )?.label || "Select Role"}
                            </chakra.MenuButton>
                            <chakra.MenuList
                              bg={"#fff"}
                              borderColor={"gray.200"}
                              boxShadow="xl"
                              zIndex={9}
                            >
                              {roleOptions.map((option) => (
                                <chakra.MenuItem
                                  key={option.value}
                                  onClick={() =>
                                    handleFilterChange("role", option.value)
                                  }
                                  bg={
                                    filters.role === option.value
                                      ? "transparent"
                                      : "transparent"
                                  }
                                  _hover={{ bg: "rgb(241,241,241)" }}
                                  color={colors.textPrimary}
                                >
                                  {option.label}
                                </chakra.MenuItem>
                              ))}
                            </chakra.MenuList>
                          </>
                        )}
                      </chakra.Menu>
                    </chakra.Box>

                    <chakra.Box>
                      <chakra.Text
                        mb={2}
                        color={colors.textPrimary}
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        Inactive
                      </chakra.Text>
                      <chakra.Menu placement="bottom">
                        {({ isOpen }) => (
                          <>
                            <chakra.MenuButton
                              as={chakra.Button}
                              w="100%"
                              textAlign="left"
                              rightIcon={<FaChevronDown />}
                              bg={"rgb(241,241,241)"}
                              color={
                                filters.is_inactive
                                  ? colors.textPrimary
                                  : colors.textMuted
                              }
                              size="sm"
                            >
                              {booleanOptions.find(
                                (opt) => opt.value === filters.is_inactive
                              )?.label || "Select Status"}
                            </chakra.MenuButton>
                            <chakra.MenuList
                              bg={"rgb(255,255,255)"}
                              boxShadow="xl"
                              zIndex={9}
                            >
                              {booleanOptions.map((option) => (
                                <chakra.MenuItem
                                  key={option.value}
                                  onClick={() =>
                                    handleFilterChange(
                                      "is_inactive",
                                      option.value
                                    )
                                  }
                                  bg={
                                    filters.is_inactive === option.value
                                      ? "transparent"
                                      : "transparent"
                                  }
                                  _hover={{ bg: "rgb(241,241,241)" }}
                                  color={colors.textPrimary}
                                >
                                  {option.label}
                                </chakra.MenuItem>
                              ))}
                            </chakra.MenuList>
                          </>
                        )}
                      </chakra.Menu>
                    </chakra.Box>

                    <chakra.Flex
                      justifyContent="flex-end"
                      mt={4}
                      gridColumn={{ lg: "span 5" }}
                    >
                      <chakra.Button
                        bg="black"
                        color="white"
                        onClick={applyFilters}
                        leftIcon={<FaFilter />}
                        boxShadow="md"
                        size="sm"
                        px={6}
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        transition="all 0.2s"
                      >
                        Apply Filters
                      </chakra.Button>
                    </chakra.Flex>
                  </chakra.Grid>
                </chakra.Box>
              </chakra.Box>
            )}
          </AnimatePresence>

          {loading ? (
            <chakra.Center py={10}>
              <chakra.Flex direction="column" align="center">
                <chakra.Spinner
                  size="xl"
                  color="black"
                  thickness="4px"
                  speed="0.65s"
                  mb={4}
                />
                <chakra.Text color={colors.textPrimary}>
                  Loading administration accounts...
                </chakra.Text>
              </chakra.Flex>
            </chakra.Center>
          ) : error ? (
            <chakra.Alert
              status="error"
              variant="solid"
              borderRadius="md"
              bg="red.700"
              color="white"
              py={4}
              alignItems="center"
            >
              <chakra.AlertIcon color="white" />
              <chakra.AlertDescription fontWeight="medium">
                {error}
              </chakra.AlertDescription>
              <chakra.CloseButton
                position="absolute"
                right="8px"
                top="8px"
                onClick={() => setError(null)}
              />
            </chakra.Alert>
          ) : (
            <>
              <chakra.Box
                ref={tableRef}
                id="usersTable"
                overflowX="auto"
                bg={"rgb(255,255,255)"}
                rounded="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={"gray.200"}
                as={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="user-table-container"
                sx={{
                  scrollbarWidth: "thin",
                  scrollbarColor: `${colors.borderColor} ${colors.backgroundLight}`,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: colors.backgroundLight,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: colors.borderColor,
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: colors.textMuted,
                  },
                }}
                pb={2}
              >
                <chakra.Table variant="simple" size="md">
                  <chakra.Thead
                    bg={"rgb(255,255,255)"}
                    position="sticky"
                    top={0}
                    zIndex={1}
                  >
                    <chakra.Tr>
                      <chakra.Th
                        color={colors.textPrimary}
                        borderBottomColor={"gray.200"}
                        fontWeight="500"
                        py={4}
                        fontSize="sm"
                        textTransform={"none"}
                      >
                        Name
                      </chakra.Th>
                      <chakra.Th
                        color={colors.textPrimary}
                        borderBottomColor={"gray.200"}
                        fontWeight="500"
                        py={4}
                        fontSize="sm"
                        textTransform={"none"}
                      >
                        Email
                      </chakra.Th>
                      <chakra.Th
                        color={colors.textPrimary}
                        borderBottomColor={"gray.200"}
                        fontWeight="500"
                        py={4}
                        fontSize="sm"
                        textTransform={"none"}
                      >
                        Role
                      </chakra.Th>
                      <chakra.Th
                        color={colors.textPrimary}
                        borderBottomColor={"gray.200"}
                        fontWeight="500"
                        py={4}
                        fontSize="sm"
                        textTransform={"none"}
                      >
                        Status
                      </chakra.Th>
                      <chakra.Th
                        color={colors.textPrimary}
                        borderBottomColor={"gray.200"}
                        fontWeight="500"
                        py={4}
                        fontSize="sm"
                        textTransform={"none"}
                      >
                        Last Login
                      </chakra.Th>
                      <chakra.Th
                        color={colors.textPrimary}
                        width="80px"
                        textAlign="right"
                        borderBottomColor={"gray.200"}
                        fontWeight="500"
                        py={4}
                        fontSize="sm"
                        textTransform={"none"}
                      >
                        Actions
                      </chakra.Th>
                    </chakra.Tr>
                  </chakra.Thead>
                  <chakra.Tbody>
                    {users.length === 0 ? (
                      <chakra.Tr>
                        <chakra.Td
                          colSpan={6}
                          textAlign="center"
                          py={10}
                          color={colors.textPrimary}
                          border={0}
                        >
                          <chakra.Flex
                            direction="column"
                            align="center"
                            justify="center"
                            as={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <FaUser
                              size={32}
                              style={{ marginBottom: "16px", opacity: 0.5 }}
                            />
                            <chakra.Text
                              fontWeight="medium"
                              mb={2}
                              fontSize="lg"
                            >
                              No users found
                            </chakra.Text>
                            <chakra.Text
                              fontSize="sm"
                              color={colors.textMuted}
                              mb={5}
                              maxW="300px"
                              textAlign="center"
                            >
                              We couldn't find any users matching your criteria.
                              Try adjusting your filters or search query.
                            </chakra.Text>
                            <chakra.Button
                              size="sm"
                              bg="black"
                              color="white"
                              _hover={{ bg: "black" }}
                              onClick={resetFilters}
                              leftIcon={<FaSync />}
                              boxShadow="md"
                            >
                              Reset Filters
                            </chakra.Button>
                          </chakra.Flex>
                        </chakra.Td>
                      </chakra.Tr>
                    ) : (
                      users.map((user, index) => (
                        <chakra.Tr
                          key={user.id}
                          _hover={{ bg: "rgb(241,241,241)" }}
                          as={motion.tr}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          position="relative"
                          borderBottomWidth="1px"
                          borderColor={"gray.200"}
                        >
                          <chakra.Td color={colors.textPrimary} border={0}>
                            <chakra.Flex alignItems="center">
                              <chakra.Avatar
                                onDoubleClick={() =>
                                  navigate(
                                    `/administrations-console/detailed/${user.id}`
                                  )
                                }
                                size="sm"
                                name={`${user.first_name} ${user.last_name}`}
                                mr={3}
                                bg={
                                  user.role === "global-administrator"
                                    ? "purple.500"
                                    : user.role === "administrator"
                                    ? "blue.500"
                                    : user.role === "supplier"
                                    ? "green.500"
                                    : "gray.500"
                                }
                                boxShadow="sm"
                              />
                              <chakra.Box>
                                <chakra.Text
                                  fontWeight="medium"
                                  onDoubleClick={() =>
                                    navigate(
                                      `/administrations-console/detailed/${user.id}`
                                    )
                                  }
                                >
                                  {user.preferred_name ||
                                    `${user.first_name} ${user.last_name}`}
                                </chakra.Text>
                                <chakra.Text
                                  fontSize="xs"
                                  color={colors.textPrimary}
                                  onDoubleClick={() =>
                                    navigate(
                                      `/administrations-console/detailed/${user.id}`
                                    )
                                  }
                                >
                                  {user.phone_number || "No phone"}
                                </chakra.Text>
                              </chakra.Box>
                            </chakra.Flex>
                          </chakra.Td>
                          <chakra.Td
                            color={colors.textPrimary}
                            border={0}
                            onDoubleClick={() =>
                              navigate(
                                `/administrations-console/detailed/${user.id}`
                              )
                            }
                          >
                            {user.email}
                          </chakra.Td>
                          <chakra.Td border={0}>
                            <chakra.Badge
                              colorScheme={
                                user.role === "global-administrator"
                                  ? "purple"
                                  : user.role === "administrator"
                                  ? "blue"
                                  : user.role === "supplier"
                                  ? "green"
                                  : "gray"
                              }
                              px={2}
                              py={1}
                              borderRadius="full"
                              fontWeight="medium"
                              boxShadow="sm"
                              textTransform="capitalize"
                            >
                              {user.role.replace("-", " ")}
                            </chakra.Badge>
                          </chakra.Td>
                          <chakra.Td border={0}>
                            <chakra.Flex direction="column" gap={1}>
                              {user.is_inactive && (
                                <chakra.Badge colorScheme="gray" fontSize="xs">
                                  Inactive
                                </chakra.Badge>
                              )}
                              {user.is_locked && (
                                <chakra.Badge colorScheme="red" fontSize="xs">
                                  Locked
                                </chakra.Badge>
                              )}
                              {user.is_suspicious && (
                                <chakra.Badge
                                  colorScheme="orange"
                                  fontSize="xs"
                                >
                                  Suspicious
                                </chakra.Badge>
                              )}
                              {user.is_verified && (
                                <chakra.Badge colorScheme="green" fontSize="xs">
                                  Verified
                                </chakra.Badge>
                              )}
                              {!user.is_inactive &&
                                !user.is_locked &&
                                !user.is_suspicious && (
                                  <chakra.Badge
                                    colorScheme="blue"
                                    fontSize="xs"
                                  >
                                    Active
                                  </chakra.Badge>
                                )}
                            </chakra.Flex>
                          </chakra.Td>
                          <chakra.Td
                            color={colors.textPrimary}
                            fontSize="sm"
                            border={0}
                          >
                            <chakra.Flex align="center">
                              <FaClock
                                size={12}
                                style={{ marginRight: "6px", opacity: 0.7 }}
                              />
                              <chakra.Tooltip
                                label={formatWithTimezone(
                                  user.last_login_time,
                                  formatOptions.FULL_DATE_TIME,
                                  currentTimezone
                                )}
                                placement="top"
                                hasArrow
                                bg={colors.backgroundActive}
                                color={colors.textPrimary}
                              >
                                <chakra.Text>
                                  {/* {formatWithTimezone(
                                      user.last_login_time,
                                      formatOptions.FULL_DATE_TIME,
                                      currentTimezone
                                    )} */}
                                  {user.last_login_time
                                    ? formatRelativeTime(user.last_login_time)
                                    : "Never"}
                                </chakra.Text>
                              </chakra.Tooltip>
                            </chakra.Flex>
                          </chakra.Td>

                          <chakra.Td textAlign="right" border={0}>
                            <chakra.Popover
                              placement="bottom-end"
                              isOpen={activeActionMenu === user.id}
                              onClose={() => setActiveActionMenu(null)}
                              closeOnBlur={true}
                              gutter={4}
                              strategy="fixed"
                            >
                              <chakra.PopoverTrigger>
                                <chakra.IconButton
                                  color="gray.900"
                                  aria-label="User Actions"
                                  icon={<FaEllipsisV />}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleActionMenu(user.id)}
                                  onKeyDown={(e) =>
                                    handleActionMenuKeyDown(e, user.id)
                                  }
                                  _hover={{
                                    bg: colors.backgroundActive,
                                    color: "white",
                                  }}
                                  borderRadius="md"
                                />
                              </chakra.PopoverTrigger>
                              <chakra.PopoverContent
                                bg={"rgb(255,255,255)"}
                                borderColor={"gray.200"}
                                boxShadow="xl"
                                width="200px"
                                _focus={{ outline: "none" }}
                                zIndex={10}
                              >
                                <chakra.PopoverBody p={0}>
                                  <chakra.Stack spacing={0}>
                                    <ActionMenuItem
                                      label="Edit User"
                                      icon={<FaEdit />}
                                      onClick={() =>
                                        handleUserAction("edit", user.id)
                                      }
                                    />
                                    <ActionMenuItem
                                      label="Reset Password"
                                      icon={<FaKey />}
                                      onClick={() =>
                                        handleUserAction(
                                          "resetPassword",
                                          user.id
                                        )
                                      }
                                      colorScheme="blue"
                                    />
                                    <ActionMenuItem
                                      label={
                                        user.is_locked
                                          ? "Unlock Account"
                                          : "Lock Account"
                                      }
                                      icon={<FaLock />}
                                      onClick={() =>
                                        handleUserAction("lock", user.id)
                                      }
                                      colorScheme={
                                        user.is_locked ? "green" : "orange"
                                      }
                                    />
                                    <ActionMenuItem
                                      label={
                                        user.is_inactive
                                          ? "Activate Account"
                                          : "Deactivate Account"
                                      }
                                      icon={<FaBan />}
                                      onClick={() =>
                                        handleUserAction("deactivate", user.id)
                                      }
                                      colorScheme={
                                        user.is_inactive ? "green" : "red"
                                      }
                                    />
                                    <ActionMenuItem
                                      label={
                                        user.is_suspicious
                                          ? "Clear Suspicious"
                                          : "Mark Suspicious"
                                      }
                                      icon={<FaExclamationTriangle />}
                                      onClick={() =>
                                        handleUserAction("suspicious", user.id)
                                      }
                                      colorScheme={
                                        user.is_suspicious ? "green" : "orange"
                                      }
                                    />
                                    <ActionMenuItem
                                      label={
                                        user.is_verified
                                          ? "Unverify User"
                                          : "Verify User"
                                      }
                                      icon={<FaCheck />}
                                      onClick={() =>
                                        handleUserAction("verify", user.id)
                                      }
                                      colorScheme={
                                        user.is_verified ? "red" : "green"
                                      }
                                    />
                                    <ActionMenuItem
                                      label="Edit Commission"
                                      icon={<FaEdit />}
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setIsEditPercentageModalOpen(true);
                                      }}
                                      colorScheme="blue"
                                    />
                                  </chakra.Stack>
                                </chakra.PopoverBody>
                              </chakra.PopoverContent>
                            </chakra.Popover>
                          </chakra.Td>
                        </chakra.Tr>
                      ))
                    )}
                  </chakra.Tbody>
                </chakra.Table>
              </chakra.Box>

              {totalPages > 1 && (
                <chakra.Box mt={6}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showPageCount={true}
                    colorScheme="blue"
                  />
                </chakra.Box>
              )}

              <chakra.Text
                textAlign="center"
                color={colors.textPrimary}
                fontSize="sm"
                mt={4}
                mb={2}
                fontWeight="medium"
              >
                Showing {users.length} of {totalItems} users
              </chakra.Text>
            </>
          )}
        </chakra.Box>

        {/* Modal for Processing Rewards */}
        <chakra.Modal
          isOpen={isProcessRewardsModalOpen}
          onClose={() => setIsProcessRewardsModalOpen(false)}
          isCentered
        >
          <chakra.ModalOverlay />
          <chakra.ModalContent>
            <chakra.ModalHeader>Process Reward Payments</chakra.ModalHeader>
            <chakra.ModalCloseButton />
            <chakra.ModalBody>
              <chakra.Text>
                Are you sure you want to process reward payments for all agents
                with a reward balance greater than 0? This will reset their
                reward balance, add a payout history, and notify them.
              </chakra.Text>
            </chakra.ModalBody>
            <chakra.ModalFooter>
              <chakra.Button
                colorScheme="gray"
                mr={3}
                onClick={() => setIsProcessRewardsModalOpen(false)}
                disabled={isProcessingRewards}
              >
                Cancel
              </chakra.Button>
              <chakra.Button
                colorScheme="green"
                onClick={async () => {
                  setIsProcessingRewards(true);
                  try {
                    await administrationService.processRewardPaymentsForAllAgents();
                    toast({
                      description: "Reward payments processed successfully.",
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                      variant: "custom",
                      containerStyle: customToastContainerStyle,
                    });
                    fetchUsers(currentPage);
                  } catch (err) {
                    handleApiError(err, toast);
                  } finally {
                    setIsProcessingRewards(false);
                    setIsProcessRewardsModalOpen(false);
                  }
                }}
                isLoading={isProcessingRewards}
              >
                Confirm & Process
              </chakra.Button>
            </chakra.ModalFooter>
          </chakra.ModalContent>
        </chakra.Modal>
      </chakra.Box>
    </>
  );
}

const StatCard = ({ title, value, icon, color = "blue", bg, borderColor }) => {
  return (
    <chakra.Box
      bg={bg}
      p={5}
      rounded="xl"
      boxShadow="md"
      _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
      borderWidth="1px"
      borderColor={borderColor}
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <chakra.Flex align="center" justify="space-between">
        <chakra.Box>
          <chakra.Text color="gray.900" fontSize="sm" fontWeight="medium">
            {title}
          </chakra.Text>
          <chakra.Text color="gray.900" fontSize="2xl" fontWeight="bold" mt={1}>
            {value}
          </chakra.Text>
        </chakra.Box>
        <chakra.Box
          p={3}
          borderRadius="full"
          bg={`${color}.900`}
          color={`${color}.200`}
          boxShadow="md"
        >
          {icon}
        </chakra.Box>
      </chakra.Flex>
    </chakra.Box>
  );
};

const ActionMenuItem = ({ label, icon, onClick, colorScheme = "gray" }) => {
  return (
    <chakra.Button
      variant="ghost"
      justifyContent="flex-start"
      width="100%"
      py={3}
      px={4}
      borderRadius={0}
      transition="all 0.2s"
      bg="transparent"
      color="black"
      _hover={{ bg: "rgb(241,241,241)" }}
      _focus={{ bg: "rgb(241,241,241)" }}
      onClick={onClick}
      leftIcon={<chakra.Box color={`${colorScheme}.400`}>{icon}</chakra.Box>}
      fontSize="sm"
      fontWeight="normal"
    >
      {label}
    </chakra.Button>
  );
};
