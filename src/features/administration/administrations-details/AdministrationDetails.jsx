import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useToast,
  Spinner,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText,
  Tag,
  Center,
  SimpleGrid,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useBreakpointValue,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiMoreVertical,
  FiEdit,
  FiLock,
  FiUnlock,
  FiCheckCircle,
  FiXCircle,
  FiKey,
  FiClock,
  FiActivity,
  FiUser,
  FiCalendar,
  FiMail,
  FiPhone,
  FiCheckSquare,
  FiAlertCircle,
  FiChevronDown,
  FiX,
  FiFileText,
  FiFilter,
  FiRefreshCw,
  FiServer,
  FiCpu,
  FiGlobe,
  FiArrowLeft,
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiInbox,
  FiHome,
  FiUsers,
  FiShield,
  FiBriefcase,
  FiMapPin,
  FiAlertOctagon,
} from "react-icons/fi";
import { useAuth } from "../authContext/authContext";
import { administrationService } from "../services/administrationService";
import { handleApiError } from "../../../commons/handleApiError";
import InfiniteScroll from "react-infinite-scroll-component";
import EditAccountModal from "../administrations-management/components/EditAccountModal";
import ResetPasswordModal from "../administrations-management/components/ResetPasswordModal";
import { usePreferences } from "../authContext/preferencesProvider";
import { customToastContainerStyle } from "../../../commons/toastStyles";
import Loader from "../../../commons/Loader";
import SidebarContent from "../layouts/SidebarContent";
import MobileNav from "../layouts/MobileNav";
import SettingsModal from "../components/settings/SettingsModal";
import {
  formatRelativeTime,
  formatOptions,
  formatWithTimezone,
} from "../../../commons/formatOptions";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionCard = motion.create(Card);

const EmptyState = ({
  icon = FiInbox,
  title = "No Data Found",
  message = "There are no items to display.",
  action = null,
}) => {
  return (
    <Box
      p={8}
      textAlign="center"
      borderRadius="md"
      bg="rgb(241,241,241)"
      border="1px dashed"
      borderColor="gray.400"
    >
      <VStack spacing={3}>
        <Icon as={icon} fontSize="3xl" color="gray.900" />
        <Text fontWeight="bold" color="black">
          {title}
        </Text>
        <Text color="gray.900">{message}</Text>
        {action && <Box mt={2}>{action}</Box>}
      </VStack>
    </Box>
  );
};

const AdministrationDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { account, isLoading: isAuthLoading } = useAuth();
  const { currentTimezone } = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [sessionsPage, setSessionsPage] = useState(1);
  const [hasMoreSessions, setHasMoreSessions] = useState(true);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const [activities, setActivities] = useState([]);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [hasMoreActivities, setHasMoreActivities] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [totalActivities, setTotalActivities] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isResetPasswordModalOpen,
    onOpen: onResetPasswordModalOpen,
    onClose: onResetPasswordModalClose,
  } = useDisclosure();

  const [activityFilters, setActivityFilters] = useState({
    type: "",
    action: "",
    action_type: "",
    from_date: "",
    to_date: "",
  });

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  };

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const avatarSize = useBreakpointValue({ base: "xl", md: "2xl" });

  // fetch user data details
  const fetchUserDetails = useCallback(async () => {
    if (!accountId) return;
    setIsLoadingDetails(true);
    try {
      const response = await administrationService.getUserDetails(accountId);
      setUserDetails(response.data.data);
    } catch (error) {
      handleApiError(error, toast);
      navigate("/administrations-console");
    } finally {
      setIsLoadingDetails(false);
    }
  }, [accountId, navigate, toast]);

  // fetch sessions of user
  const fetchSessions = useCallback(
    async (reset = false) => {
      const pageToFetch = reset ? 1 : sessionsPage;

      if (!accountId || isLoadingSessions || (!reset && !hasMoreSessions)) {
        if (!reset && !hasMoreSessions) setIsLoadingSessions(false);
        return;
      }

      setIsLoadingSessions(true);
      try {
        const response = await administrationService.getUserSessions(
          accountId,
          {
            page: pageToFetch,
            limit: 10,
            sortBy: "created_at",
            sortOrder: "DESC",
          }
        );

        const {
          sessions: newSessions,
          total_items,
          total_pages,
          current_page,
        } = response.data.data;

        setTotalSessions(total_items);

        if (reset) {
          setSessions(newSessions);
        } else {
          setSessions((prev) => [...prev, ...newSessions]);
        }

        setHasMoreSessions(current_page < total_pages);
        if (current_page < total_pages) {
          setSessionsPage(current_page + 1);
        } else {
          setSessionsPage(total_pages + 1);
        }
      } catch (error) {
        handleApiError(error, toast);
        setHasMoreSessions(false);
      } finally {
        setIsLoadingSessions(false);
      }
    },
    [accountId, toast, sessionsPage, isLoadingSessions, hasMoreSessions]
  );

  // fetch activities of user
  const fetchActivities = useCallback(
    async (reset = false) => {
      const pageToFetch = reset ? 1 : activitiesPage;

      if (!accountId || isLoadingActivities || (!reset && !hasMoreActivities)) {
        if (!reset && !hasMoreActivities) setIsLoadingActivities(false);
        return;
      }

      setIsLoadingActivities(true);
      try {
        const response = await administrationService.getUserActivities(
          accountId,
          {
            page: pageToFetch,
            limit: 10,
            sortBy: "created_at",
            sortOrder: "DESC",
            ...activityFilters,
          }
        );

        const {
          activities: newActivities,
          total_items,
          total_pages,
          current_page,
        } = response.data.data;

        setTotalActivities(total_items);

        if (reset) {
          setActivities(newActivities);
        } else {
          setActivities((prev) => [...prev, ...newActivities]);
        }

        setHasMoreActivities(current_page < total_pages);
        if (current_page < total_pages) {
          setActivitiesPage(current_page + 1);
        } else {
          setActivitiesPage(total_pages + 1);
        }
      } catch (error) {
        handleApiError(error, toast);
        setHasMoreActivities(false);
      } finally {
        setIsLoadingActivities(false);
      }
    },
    [
      accountId,
      toast,
      activitiesPage,
      isLoadingActivities,
      activityFilters,
      hasMoreActivities,
    ]
  );

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setActivityFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setActivitiesPage(1);
    fetchActivities(true);
  };

  // Reset filters
  const resetFilters = () => {
    setActivityFilters({
      type: "",
      action: "",
      action_type: "",
      from_date: "",
      to_date: "",
    });
    setActivitiesPage(1);
    fetchActivities(true);
  };

  const handleLockAccount = async () => {
    try {
      const result = await administrationService.lockAccount(accountId);
      toast({
        description:
          result.data.message || "The account has been locked successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchUserDetails();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleUnlockAccount = async () => {
    try {
      const result = await administrationService.unlockAccount(accountId);
      toast({
        description:
          result.data.message || "The account has been unlocked successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchUserDetails();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleVerifyAccount = async () => {
    try {
      const result = await administrationService.verifyAccount(accountId);
      toast({
        description:
          result.data.message || "The account has been verified successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchUserDetails();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleUnverifyAccount = async () => {
    try {
      const result = await administrationService.unverifyAccount(accountId);
      toast({
        description:
          result.data.message ||
          "The account has been unverified successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchUserDetails();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleUserUpdate = async (userData) => {
    try {
      const result = await administrationService.updateUserDetails(
        accountId,
        userData
      );
      toast({
        description:
          result.data.message ||
          "The account details have been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchUserDetails();
      onEditModalClose();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handlePasswordReset = async (passwordData) => {
    try {
      const result = await administrationService.resetPassword(
        accountId,
        passwordData
      );
      toast({
        description:
          result.data.message || "The password has been reset successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      onResetPasswordModalClose();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  // Format activity type for display
  const formatActivityType = (type) => {
    let colorScheme = "gray";
    switch (type) {
      case "Authentication":
        colorScheme = "blue";
        break;
      case "Create":
        colorScheme = "green";
        break;
      case "Modify":
        colorScheme = "orange";
        break;
      case "Delete":
        colorScheme = "red";
        break;
      case "Lock":
        colorScheme = "red";
        break;
      case "UnLock":
        colorScheme = "green";
        break;
      case "Verify":
        colorScheme = "teal";
        break;
      case "Unverify":
        colorScheme = "yellow";
        break;
      case "Terminate":
        colorScheme = "purple";
        break;
      default:
        break;
    }
    return (
      <Badge colorScheme={colorScheme} px={2} py={0.5} borderRadius="md">
        {type}
      </Badge>
    );
  };

  useEffect(() => {
    if (accountId) {
      fetchUserDetails();
    }
  }, [accountId, fetchUserDetails]);

  useEffect(() => {
    if (userDetails && accountId) {
      if (sessions.length === 0 && hasMoreSessions && !isLoadingSessions) {
        fetchSessions(true);
      }
    }
  }, [
    userDetails,
    accountId,
    sessions.length,
    hasMoreSessions,
    isLoadingSessions,
    fetchSessions,
  ]);

  const handleTabChange = (index) => {
    if (index === 0) {
      // Sessions tab
      if (sessions.length === 0 && hasMoreSessions && !isLoadingSessions) {
        fetchSessions(true);
      }
    } else if (index === 1) {
      // Activities tab
      if (
        activities.length === 0 &&
        hasMoreActivities &&
        !isLoadingActivities
      ) {
        fetchActivities(true);
      }
    }
  };

  if (isAuthLoading) {
    return <Loader />;
  }

  if (isLoadingDetails) {
    return (
      <Box minH="100vh" bg="rgb(241,241,241)">
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p="5">
          <Skeleton height="200px" width="200px" mb={6} />
          <SkeletonText mt="4" noOfLines={6} spacing="4" skeletonHeight="4" />
        </Box>
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Box minH="100vh" bg="rgb(241,241,241)">
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p="5">
          <Alert status="error" variant="solid" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>No user data found!</AlertTitle>
            <AlertDescription>
              The requested user could not be found.
            </AlertDescription>
          </Alert>
          <Button
            mt={4}
            leftIcon={<FiArrowLeft />}
            onClick={() => navigate("/administrations-console")}
          >
            Back to User List
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="rgb(241,241,241)">
      <Box display={{ base: "none", md: "block" }}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
      </Box>
      {/* Mobile Sidebar: shown when menu is open */}
      <Box
        display={{ base: isSidebarOpen ? "block" : "none", md: "none" }}
        position="fixed"
        zIndex={999}
      >
        <SidebarContent
          onSettingsOpen={() => setIsSettingsOpen(true)}
          onClose={() => setIsSidebarOpen(false)}
        />
      </Box>
      {/* MobileNav: always visible, passes menu toggle */}
      <MobileNav
        onSettingsOpen={() => setIsSettingsOpen(true)}
        onOpen={() => setIsSidebarOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <MotionBox ml={{ base: 0, md: 60 }} p={{ base: 4, md: 6 }} {...fadeIn}>
        <Breadcrumb
          fontSize="sm"
          color="gray.900"
          mb={6}
          separator={<Icon as={FiChevronDown} color="gray.600" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={Box} onClick={() => navigate("/")}>
              <Icon as={FiHome} mr={1} />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              as={Box}
              onClick={() => navigate("/administrations-console")}
            >
              <Icon as={FiUsers} mr={1} />
              Users
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="blue.400" fontWeight="medium">
              {userDetails?.preferred_name ||
                `${userDetails?.first_name} ${userDetails?.last_name}` ||
                "User Details"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <MotionFlex direction="column" {...staggerContainer}>
          <MotionFlex
            justify="space-between"
            align="center"
            mb={6}
            {...slideUp}
          >
            <Heading
              size="md"
              color="black"
              fontWeight="500"
              fontFamily={"Inter"}
            >
              User Profile
            </Heading>
            <Button
              leftIcon={<FiArrowLeft />}
              onClick={() => navigate("/administrations-console")}
              bg="black"
              size="sm"
              _hover={{ bg: "black" }}
              color="white"
            >
              Back to List
            </Button>
          </MotionFlex>

          <MotionCard
            bg="rgb(241,241,241)"
            borderColor="gray.200"
            borderWidth="1px"
            borderRadius="xl"
            overflow="hidden"
            {...slideUp}
            transition={{ delay: 0.1 }}
            mb={6}
            boxShadow="lg"
          >
            <Box
              position="relative"
              h="100px"
              bgGradient={`linear(to-r, ${
                userDetails?.role === "global-administrator"
                  ? "purple.900"
                  : userDetails?.role === "administrator"
                  ? "blue.900"
                  : userDetails?.role === "supplier"
                  ? "green.900"
                  : "gray.800"
              }, rgb(255,255,255))`}
            >
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FiMoreVertical />}
                  variant="ghost"
                  aria-label="Options"
                  color="black"
                  position="absolute"
                  top={4}
                  right={4}
                  _hover={{ bg: "transparent" }}
                  _focus={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                />
                <MenuList bg="rgb(255,255,255)" borderColor="gray.400">
                  <MenuItem
                    icon={<FiEdit />}
                    onClick={onEditModalOpen}
                    color="gray.900"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    _focus={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                  >
                    Edit Account
                  </MenuItem>
                  {userDetails?.is_locked ? (
                    <MenuItem
                      icon={<FiUnlock />}
                      onClick={handleUnlockAccount}
                      color="gray.900"
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      Unlock Account
                    </MenuItem>
                  ) : (
                    <MenuItem
                      icon={<FiLock />}
                      onClick={handleLockAccount}
                      color="gray.900"
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      Lock Account
                    </MenuItem>
                  )}
                  {userDetails?.is_verified ? (
                    <MenuItem
                      icon={<FiXCircle />}
                      onClick={handleUnverifyAccount}
                      color="gray.900"
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      Unverify Account
                    </MenuItem>
                  ) : (
                    <MenuItem
                      icon={<FiCheckCircle />}
                      onClick={handleVerifyAccount}
                      color="gray.900"
                      bg="transparent"
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      Verify Account
                    </MenuItem>
                  )}
                  <MenuItem
                    icon={<FiKey />}
                    onClick={onResetPasswordModalOpen}
                    color="gray.900"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                    _focus={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                  >
                    Reset Password
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>

            <CardBody pt={0} mt="-50px">
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "center", md: "flex-start" }}
                gap={6}
              >
                <VStack spacing={3} align="center">
                  <Avatar
                    size={avatarSize}
                    name={`${userDetails?.first_name} ${userDetails?.last_name}`}
                    bg={
                      userDetails?.role === "global-administrator"
                        ? "purple.500"
                        : userDetails?.role === "administrator"
                        ? "blue.500"
                        : userDetails?.role === "supplier"
                        ? "green.500"
                        : "gray.500"
                    }
                    color="black"
                    border="4px solid"
                    borderColor="rgb(241,241,241)"
                    boxShadow="xl"
                  />
                  <VStack spacing={1}>
                    <Text
                      fontWeight="500"
                      fontSize={{ base: "xl", md: "xl" }}
                      color="black"
                      textAlign="center"
                    >
                      {userDetails?.preferred_name ||
                        `${userDetails?.first_name} ${userDetails?.last_name}`}
                    </Text>
                    <Tag
                      size="md"
                      colorScheme={
                        userDetails?.role === "global-administrator"
                          ? "purple"
                          : userDetails?.role === "administrator"
                          ? "blue"
                          : userDetails?.role === "supplier"
                          ? "green"
                          : "gray"
                      }
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      <Icon
                        as={
                          userDetails?.role === "global-administrator"
                            ? FiShield
                            : userDetails?.role === "administrator"
                            ? FiCpu
                            : userDetails?.role === "supplier"
                            ? FiBriefcase
                            : FiUser
                        }
                        mr={1}
                      />
                      {userDetails?.role
                        ?.replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Tag>
                    <HStack spacing={2} mt={2} wrap="wrap" justify="center">
                      <StatusBadge
                        isActive={!userDetails?.is_inactive}
                        isLocked={userDetails?.is_locked}
                        isVerified={userDetails?.is_verified}
                      />
                    </HStack>
                  </VStack>
                </VStack>

                <Box
                  flex="1"
                  mt={{ base: 4, md: 0 }}
                  position="relative"
                  zIndex={1}
                >
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={4}>
                    <StatCard
                      label="Sessions"
                      value={totalSessions}
                      icon={FiServer}
                      color="black"
                    />
                    <StatCard
                      label="Activities"
                      value={totalActivities}
                      icon={FiActivity}
                      color="black"
                    />
                    <StatCard
                      label="Status"
                      value={
                        userDetails?.is_locked
                          ? "Locked"
                          : userDetails?.is_inactive
                          ? "Inactive"
                          : "Active"
                      }
                      icon={
                        userDetails?.is_locked
                          ? FiLock
                          : userDetails?.is_inactive
                          ? FiAlertOctagon
                          : FiCheckCircle
                      }
                      color={
                        userDetails?.is_locked
                          ? "red"
                          : userDetails?.is_inactive
                          ? "orange"
                          : "green"
                      }
                    />
                    <StatCard
                      label="Commission"
                      value={`${userDetails?.commission} %`}
                      icon={FiActivity}
                      color="black"
                    />
                    <StatCard
                      label="Reward Balance"
                      value={`${userDetails?.reward_balance} EUR`}
                      icon={FiActivity}
                      color="black"
                    />
                  </SimpleGrid>

                  {/* User details info */}
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={5}
                    bg="rgb(255,255,255)"
                    p={4}
                    borderRadius="xl"
                    boxShadow="inner"
                  >
                    <InfoItem
                      icon={FiUser}
                      label="Full Name"
                      value={`${userDetails?.first_name} ${userDetails?.last_name}`}
                    />
                    <InfoItem
                      icon={FiMail}
                      label="Email"
                      value={userDetails?.email}
                    />
                    <InfoItem
                      icon={FiPhone}
                      label="Phone"
                      value={userDetails?.phone_number || "Not provided"}
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="Location"
                      value={userDetails?.last_login_location || "Unknown"}
                    />
                    <InfoItem
                      icon={FiClock}
                      label="Last Login"
                      value={
                        userDetails?.last_login_time
                          ? formatWithTimezone(
                              userDetails?.last_login_time,
                              formatOptions.FULL_DATE_TIME,
                              currentTimezone
                            )
                          : "Never"
                      }
                      tooltip={
                        userDetails?.last_login_time
                          ? formatRelativeTime(userDetails?.last_login_time)
                          : "User has never logged in"
                      }
                    />
                    <InfoItem
                      icon={FiCalendar}
                      label="Member Since"
                      value={
                        userDetails?.created_at
                          ? formatWithTimezone(
                              userDetails?.created_at,
                              formatOptions.FULL_DATE_TIME,
                              currentTimezone
                            )
                          : "Unknown"
                      }
                      tooltip={
                        userDetails?.created_at
                          ? formatRelativeTime(userDetails?.created_at)
                          : ""
                      }
                    />
                  </SimpleGrid>

                  {/* Company details info */}
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={5}
                    mt={2}
                    bg="rgb(255,255,255)"
                    p={4}
                    borderRadius="xl"
                    boxShadow="inner"
                  >
                    <InfoItem
                      icon={FiUser}
                      label="Company Name"
                      value={`${userDetails?.company?.business_name}`}
                    />
                    <InfoItem
                      icon={FiMail}
                      label="Type of business"
                      value={userDetails?.company?.type_of_business}
                    />

                    <InfoItem
                      icon={FiMail}
                      label="Market name"
                      value={userDetails?.company?.market_name}
                    />

                    <InfoItem
                      icon={FiMail}
                      label="Number Unique Identifier NUI/UID"
                      value={userDetails?.company?.number_unique_identifier}
                    />

                    <InfoItem
                      icon={FiMail}
                      label="Fiscal number"
                      value={
                        userDetails?.company?.fiscal_number || "Not specified"
                      }
                    />

                    <InfoItem
                      icon={FiMail}
                      label="Location"
                      value={`${userDetails?.company?.country}, ${
                        userDetails?.company?.city || ""
                      }, ${userDetails?.comapny?.postal_code || ""}`}
                    />

                    {userDetails?.company?.logo_url && (
                      <Image
                        src={`${userDetails?.company.logo_url}`}
                        width="100px"
                        height="100px"
                        alt="Company Logo"
                      />
                    )}
                  </SimpleGrid>
                </Box>
              </Flex>
            </CardBody>
          </MotionCard>

          {/* Tabs Section */}
          <MotionBox {...slideUp} transition={{ delay: 0.2 }}>
            <Tabs
              isLazy
              variant="soft-rounded"
              colorScheme="blue"
              onChange={handleTabChange}
              size="md"
            >
              <TabList borderColor="gray.700" mb={4} overflowX="auto" py={2}>
                <Tab
                  color="gray.300"
                  _selected={{ color: "white", bg: "blue.500" }}
                  fontWeight="medium"
                  mr={2}
                  px={5}
                >
                  <Icon as={FiServer} mr={2} />
                  Sessions{" "}
                  {totalSessions > 0 && (
                    <Badge ml={2} colorScheme="blue" borderRadius="full">
                      {totalSessions}
                    </Badge>
                  )}
                </Tab>
                <Tab
                  color="gray.300"
                  _selected={{ color: "black", bg: "blue.500" }}
                  fontWeight="medium"
                  px={5}
                >
                  <Icon as={FiActivity} mr={2} />
                  Activities{" "}
                  {totalActivities > 0 && (
                    <Badge ml={2} colorScheme="blue" borderRadius="full">
                      {totalActivities}
                    </Badge>
                  )}
                </Tab>
                <Tab
                  color="gray.300"
                  _selected={{ color: "black", bg: "blue.500" }}
                  fontWeight="medium"
                  px={5}
                >
                  <Icon as={FiActivity} mr={2} />
                  Reward histories
                </Tab>
              </TabList>

              <TabPanels>
                {/* Sessions Tab */}
                <TabPanel px={0}>
                  <MotionCard
                    bg="rgb(255,255,255)"
                    borderColor="gray.200"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    {...slideUp}
                    mb={6}
                  >
                    <CardHeader pb={0}>
                      <Flex justify="space-between" align="center">
                        <Heading size="md" color="black" fontWeight="medium">
                          User Sessions
                        </Heading>
                        <Button
                          leftIcon={<FiRefreshCw />}
                          size="sm"
                          onClick={() => fetchSessions(true)}
                          isLoading={isLoadingSessions}
                          bg="black"
                          color="white"
                          _hover={{ bg: "black" }}
                        >
                          Refresh
                        </Button>
                      </Flex>
                    </CardHeader>

                    <CardBody>
                      {isLoadingSessions && sessions.length === 0 ? (
                        <Center py={8}>
                          <VStack>
                            <Spinner
                              size="lg"
                              color="black"
                              thickness="3px"
                              speed="0.8s"
                            />
                            <Text color="gray.900" mt={2}>
                              Loading sessions...
                            </Text>
                          </VStack>
                        </Center>
                      ) : sessions.length === 0 ? (
                        <EmptyState
                          icon={FiServer}
                          title="No Sessions Found"
                          message="This user doesn't have any recorded sessions."
                          action={
                            <Button
                              onClick={() => fetchSessions(true)}
                              leftIcon={<FiRefreshCw />}
                              bg="black"
                              color="white"
                              _hover={{ bg: "black" }}
                            >
                              Refresh
                            </Button>
                          }
                        />
                      ) : (
                        <Box maxH="60vh" overflow="hidden" position="relative">
                          <InfiniteScroll
                            dataLength={sessions.length}
                            next={fetchSessions}
                            hasMore={hasMoreSessions}
                            loader={
                              <Center py={4}>
                                <Spinner
                                  size="md"
                                  color="black"
                                  thickness="2px"
                                />
                              </Center>
                            }
                            endMessage={
                              <Text
                                textAlign="center"
                                color="gray.900"
                                py={4}
                                fontSize="sm"
                              >
                                All sessions loaded
                              </Text>
                            }
                            height="60vh"
                            style={{ overflow: "auto" }}
                            scrollThreshold={0.8}
                          >
                            <Table variant="simple" size="md">
                              <Thead
                                position="sticky"
                                top={0}
                                zIndex={1}
                                bg="rgb(255,255,255)"
                              >
                                <Tr>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Device Type
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Browser
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    OS
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    IP Address
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Status
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Created
                                  </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {sessions.map((session, idx) => (
                                  <Tr
                                    key={session.id}
                                    _hover={{ bg: "rgb(241,241,241)" }}
                                    borderBottomWidth={
                                      idx === sessions.length - 1 ? "0" : "1px"
                                    }
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                  >
                                    {/* Device Type */}
                                    <Td color="gray.900" borderColor="gray.200">
                                      <HStack>
                                        <Icon
                                          as={
                                            session.device_type === "Mobile"
                                              ? FiSmartphone
                                              : session.device_type === "Tablet"
                                              ? FiTablet
                                              : FiMonitor
                                          }
                                          color={
                                            session.device_type === "Mobile"
                                              ? "blue.400"
                                              : session.device_type === "Tablet"
                                              ? "purple.400"
                                              : "green.400"
                                          }
                                        />
                                        <Text>
                                          {session.device_type || "Unknown"}
                                        </Text>
                                      </HStack>
                                    </Td>

                                    {/* Browser */}
                                    <Td color="gray.900" borderColor="gray.200">
                                      <Text>
                                        {session.browser || "Unknown"}
                                      </Text>
                                    </Td>

                                    {/* OS */}
                                    <Td color="gray.900" borderColor="gray.200">
                                      <Text>{session.os || "Unknown"}</Text>
                                    </Td>

                                    {/* IP Address */}
                                    <Td color="gray.900" borderColor="gray.200">
                                      <HStack>
                                        <Icon as={FiGlobe} color="gray.500" />
                                        <Text>
                                          {session.ip_address || "Unknown"}
                                        </Text>
                                      </HStack>
                                    </Td>

                                    {/* Status */}
                                    <Td borderColor="gray.200">
                                      <Badge
                                        colorScheme={
                                          new Date(session.expired_at) >
                                          new Date()
                                            ? "green"
                                            : "red"
                                        }
                                        borderRadius="full"
                                        px={2}
                                        py={1}
                                        fontWeight="medium"
                                      >
                                        {new Date(session.expired_at) >
                                        new Date()
                                          ? "Active"
                                          : "Expired"}
                                      </Badge>
                                    </Td>

                                    {/* Created At */}
                                    <Td color="gray.900" borderColor="gray.200">
                                      <Tooltip
                                        label={
                                          session.created_at
                                            ? formatWithTimezone(
                                                session.created_at,
                                                formatOptions.FULL_DATE_TIME,
                                                currentTimezone
                                              )
                                            : "Unknown"
                                        }
                                        placement="top"
                                        hasArrow
                                      >
                                        <Text>
                                          {session.created_at
                                            ? formatRelativeTime(
                                                session.created_at
                                              )
                                            : "Unknown"}
                                        </Text>
                                      </Tooltip>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </InfiniteScroll>
                        </Box>
                      )}
                    </CardBody>
                  </MotionCard>
                </TabPanel>

                {/* Activities Tab */}
                <TabPanel px={0}>
                  <MotionCard
                    bg="rgb(255,255,255)"
                    borderColor="gray.200"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    {...slideUp}
                    mb={6}
                  >
                    <CardHeader pb={0}>
                      <Flex
                        justify="space-between"
                        align={{ base: "stretch", md: "center" }}
                        direction={{ base: "column", md: "row" }}
                        gap={3}
                      >
                        <Heading size="md" color="black" fontWeight="medium">
                          User Activities
                        </Heading>
                        <HStack>
                          {/* <Button
                            leftIcon={<FiFilter />}
                            size="sm"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            bg='black'
                            _hover={{bg: 'black'}}
                            color='white'
                          >
                            {isFilterOpen ? "Hide Filters" : "Show Filters"}
                          </Button> */}
                          <Button
                            leftIcon={<FiRefreshCw />}
                            size="sm"
                            onClick={() => fetchActivities(true)}
                            isLoading={isLoadingActivities}
                            bg="black"
                            color="white"
                            _hover={{ bg: "black" }}
                          >
                            Refresh
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>

                    <CardBody>
                      {isLoadingActivities && activities.length === 0 ? (
                        <Center py={8}>
                          <VStack>
                            <Spinner
                              size="lg"
                              color="black"
                              thickness="3px"
                              speed="0.8s"
                            />
                            <Text color="gray.900" mt={2}>
                              Loading activities...
                            </Text>
                          </VStack>
                        </Center>
                      ) : activities.length === 0 ? (
                        <EmptyState
                          icon={FiActivity}
                          title="No Activities Found"
                          message="There are no activities recorded for this user."
                          action={
                            <Button
                              onClick={() => fetchActivities(true)}
                              leftIcon={<FiRefreshCw />}
                              bg="black"
                              color="white"
                              _hover={{ bg: "black" }}
                            >
                              Refresh
                            </Button>
                          }
                        />
                      ) : (
                        <Box maxH="60vh" overflow="hidden" position="relative">
                          <InfiniteScroll
                            dataLength={activities.length}
                            next={fetchActivities}
                            hasMore={hasMoreActivities}
                            loader={
                              <Center py={4}>
                                <Spinner
                                  size="md"
                                  color="black"
                                  thickness="2px"
                                />
                              </Center>
                            }
                            endMessage={
                              <Text
                                textAlign="center"
                                color="gray.900"
                                py={4}
                                fontSize="sm"
                              >
                                All activities loaded
                              </Text>
                            }
                            height="60vh"
                            style={{ overflow: "auto" }}
                            scrollThreshold={0.8}
                          >
                            <Table variant="simple" size="md">
                              <Thead
                                position="sticky"
                                top={0}
                                zIndex={1}
                                bg="rgb(255,255,255)"
                              >
                                <Tr>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Type
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Action
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Summary
                                  </Th>
                                  <Th
                                    color="gray.900"
                                    fontWeight="semibold"
                                    borderColor="gray.200"
                                    textTransform={"none"}
                                  >
                                    Date
                                  </Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {activities.map((activity, idx) => (
                                  <Tr
                                    key={activity.id}
                                    _hover={{ bg: "rgb(241,241,241)" }}
                                    borderBottomWidth={
                                      idx === activities.length - 1
                                        ? "0"
                                        : "1px"
                                    }
                                    borderColor="gray.200"
                                    transition="all 0.2s"
                                  >
                                    <Td borderColor="gray.200">
                                      {formatActivityType(activity.type)}
                                    </Td>
                                    <Td color="gray.900" borderColor="gray.200">
                                      <Text fontWeight="medium">
                                        {activity.action}
                                      </Text>
                                    </Td>
                                    <Td color="gray.900" borderColor="gray.200">
                                      <Text
                                        noOfLines={2}
                                        title={activity.summary}
                                      >
                                        {activity.summary}
                                      </Text>
                                    </Td>
                                    <Td color="gray.900" borderColor="gray.200">
                                      <Tooltip
                                        label={formatWithTimezone(
                                          activity.created_at,
                                          formatOptions.FULL_DATE_TIME,
                                          currentTimezone
                                        )}
                                        placement="top"
                                        hasArrow
                                      >
                                        <Text>
                                          {formatRelativeTime(
                                            activity.created_at
                                          )}
                                        </Text>
                                      </Tooltip>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </InfiniteScroll>
                        </Box>
                      )}
                    </CardBody>
                  </MotionCard>
                </TabPanel>

                {/* Reward histories Tab */}
                <TabPanel>
                  <Box p={4}>
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      Reward Histories
                    </Text>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Type</Th>
                          <Th>Commission amount</Th>
                          <Th>Status</Th>
                          <Th>Order number</Th>
                          <Th>Order Total amount</Th>
                          <Th>Commission rate</Th>
                          <Th>Date</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {userDetails.histories.map((history) => (
                          <Tr key={history.id}>
                            <Td>{history.type}</Td>
                            <Td>{history.amount}</Td>
                            <Td>{history.status}</Td>
                            <Td>{history.order_number}</Td>
                            <Td>{history.order_total}</Td>
                            <Td>{history.commission_rate} %</Td>
                            <Td color="gray.900" borderColor="gray.200">
                              <Tooltip
                                label={formatWithTimezone(
                                  history.created_at,
                                  formatOptions.FULL_DATE_TIME,
                                  currentTimezone
                                )}
                                placement="top"
                                hasArrow
                              >
                                <Text>
                                  {formatRelativeTime(history.created_at)}
                                </Text>
                              </Tooltip>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MotionBox>
        </MotionFlex>

        {/* Edit Account Modal */}
        {userDetails && (
          <EditAccountModal
            isOpen={isEditModalOpen}
            onClose={onEditModalClose}
            user={userDetails}
            onSuccess={handleUserUpdate}
          />
        )}

        {/* Reset Password Modal */}
        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          onClose={onResetPasswordModalClose}
          user={userDetails}
          onSuccess={handlePasswordReset}
        />
      </MotionBox>
    </Box>
  );
};

// Info item component for user details
const InfoItem = ({ icon, label, value, tooltip }) => {
  return (
    <Box>
      <Text
        fontSize="xs"
        color="gray.900"
        mb={0.5}
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <HStack spacing={2} color="gray.900">
        <Icon as={icon} color="gray.900" />
        {tooltip ? (
          <Tooltip label={tooltip} placement="top" hasArrow>
            <Text>{value}</Text>
          </Tooltip>
        ) : (
          <Text>{value}</Text>
        )}
      </HStack>
    </Box>
  );
};

// Stat card component
const StatCard = ({ label, value, icon, color }) => {
  return (
    <Box
      bg="rgb(255,255,255)"
      p={3}
      borderRadius="lg"
      _hover={{ bg: "gray.400", transform: "translateY(-2px)" }}
      transition="all 0.2s"
      boxShadow="sm"
    >
      <Flex align="center">
        <Box
          p={2}
          borderRadius="md"
          bg={`${color}.900`}
          color={`${color}.200`}
          mr={3}
        >
          <Icon as={icon} boxSize={5} />
        </Box>
        <Box>
          <Text fontSize="xs" color="gray.900" textTransform="uppercase">
            {label}
          </Text>
          <Text fontSize="lg" fontWeight="bold" color="black">
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

// Status badge component
const StatusBadge = ({ isActive, isLocked, isVerified }) => {
  return (
    <>
      <Badge
        px={2}
        py={0.5}
        borderRadius="md"
        colorScheme={isActive ? "green" : "gray"}
        variant={isActive ? "solid" : "subtle"}
      >
        <Icon as={isActive ? FiCheckCircle : FiX} mr={1} />
        {isActive ? "Active" : "Inactive"}
      </Badge>
      <Badge
        px={2}
        py={0.5}
        borderRadius="md"
        colorScheme={isVerified ? "teal" : "yellow"}
        variant={isVerified ? "solid" : "subtle"}
      >
        <Icon as={isVerified ? FiCheckSquare : FiAlertCircle} mr={1} />
        {isVerified ? "Verified" : "Unverified"}
      </Badge>
      <Badge
        px={2}
        py={0.5}
        borderRadius="md"
        colorScheme={!isLocked ? "green" : "red"}
        variant={!isLocked ? "outline" : "solid"}
      >
        <Icon as={isLocked ? FiLock : FiUnlock} mr={1} />
        {isLocked ? "Locked" : "Unlocked"}
      </Badge>
    </>
  );
};

export default AdministrationDetails;
