import React, { useState, useEffect, useCallback, useRef } from "react";
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
  Input,
  Select,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FiEdit,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiHome,
  FiUsers,
  FiInfo,
  FiBriefcase,
  FiFileText,
  FiFolder,
  FiChevronDown,
  FiArrowLeft,
  FiMoreVertical,
  FiAlertTriangle,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import { useAuth } from "../../administration/authContext/authContext";
import { usePreferences } from "../../administration/authContext/preferencesProvider";
import Loader from "../../../commons/Loader";
import SidebarContent from "../../administration/layouts/SidebarContent";
import MobileNav from "../../administration/layouts/MobileNav";
import SettingsModal from "../../administration/components/settings/SettingsModal";
import CompanyUpdateModal from "../companies-management/CompanyUpdateModal";
import {
  formatRelativeTime,
  formatOptions,
  formatWithTimezone,
} from "../../../commons/formatOptions";
import UserList from "./UserList";
import AssetsList from "./AssetsList";
import AssetCreateModal from "./AssetCreateModal";
import AssetEditModal from "./AssetEditModal";
import AssetDeleteModal from "./AssetDeleteModal";
import DocumentsList from "./DocumentsList";
import DocumentUploadModal from "./DocumentUploadModal";
import DocumentEditModal from "./DocumentEditModal";
import DocumentDeleteModal from "./DocumentDeleteModal";
import DocumentViewModal from "./DocumentViewModal";
import WarehouseCreateModal from "./WarehouseCreateModal";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const MotionBox = motion.create(Box);
const MotionFlex = motion.create(Flex);
const MotionCard = motion.create(Card);

const EmptyState = ({
  icon = FiFileText,
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
      borderColor="gray.200"
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

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { account, isLoading: isAuthLoading } = useAuth();
  const { currentTimezone } = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [assets, setAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [assetsPage, setAssetsPage] = useState(1);
  const [totalAssets, setTotalAssets] = useState(0);
  const [totalAssetsPages, setTotalAssetsPages] = useState(0);
  const [assetFilters, setAssetFilters] = useState({
    search: "",
    status: "",
    category: "",
  });
  const [showAssetFilters, setShowAssetFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
  const [documentsPage, setDocumentsPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalDocumentsPages, setTotalDocumentsPages] = useState(0);
  const [documentFilters, setDocumentFilters] = useState({
    search: "",
    is_confidential: "",
  });
  const [showDocumentFilters, setShowDocumentFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [isLoadingWarehouses, setIsLoadingWarehouses] = useState(false);

  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isAssetCreateModalOpen,
    onOpen: onAssetCreateModalOpen,
    onClose: onAssetCreateModalClose,
  } = useDisclosure();

  const {
    isOpen: isAssetEditModalOpen,
    onOpen: onAssetEditModalOpen,
    onClose: onAssetEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isAssetDeleteModalOpen,
    onOpen: onAssetDeleteModalOpen,
    onClose: onAssetDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isDocumentUploadModalOpen,
    onOpen: onDocumentUploadModalOpen,
    onClose: onDocumentUploadModalClose,
  } = useDisclosure();

  const {
    isOpen: isDocumentEditModalOpen,
    onOpen: onDocumentEditModalOpen,
    onClose: onDocumentEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDocumentDeleteModalOpen,
    onOpen: onDocumentDeleteModalOpen,
    onClose: onDocumentDeleteModalClose,
  } = useDisclosure();

  const {
    isOpen: isDocumentViewModalOpen,
    onOpen: onDocumentViewModalOpen,
    onClose: onDocumentViewModalClose,
  } = useDisclosure();

  const {
    isOpen: isWarehouseCreateModalOpen,
    onOpen: onWarehouseCreateModalOpen,
    onClose: onWarehouseCreateModalClose,
  } = useDisclosure();

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

  const fetchCompanyDetails = useCallback(async () => {
    if (!companyId) return;

    setIsLoadingDetails(true);
    try {
      const response = await companiesService.getCompanyInfo(companyId);
      setCompanyDetails(response.data.data);
    } catch (error) {
      handleApiError(error, toast);
      navigate("/companies");
    } finally {
      setIsLoadingDetails(false);
    }
  }, [companyId, navigate, toast]);

  // Fetch company users
  const fetchCompanyUsers = useCallback(async () => {
    if (!companyId) return;

    setIsLoadingUsers(true);
    try {
      const response = await companiesService.getAllUsersOfCompany(companyId);
      setUsers(response.data.data.administration || []);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsLoadingUsers(false);
    }
  }, [companyId, toast]);

  // Fetch company assets
  const fetchCompanyAssets = useCallback(
    async (reset = false) => {
      if (!companyId) return;

      const pageToFetch = reset ? 1 : assetsPage;

      setIsLoadingAssets(true);
      try {
        const params = {
          page: pageToFetch,
          limit: 10,
          sortBy: "created_at",
          sortOrder: "DESC",
          search: assetFilters.search,
          status: assetFilters.status,
          category: assetFilters.category,
        };

        const response = await companiesService.getCompanyAssets(
          companyId,
          params
        );
        const {
          assets: fetchedAssets,
          total_items,
          total_pages,
          current_page,
        } = response.data.data;

        if (reset) {
          setAssets(fetchedAssets || []);
          setAssetsPage(1);
        } else {
          setAssets((prev) => [...prev, ...(fetchedAssets || [])]);
        }

        setTotalAssets(total_items || 0);
        setTotalAssetsPages(total_pages || 0);
        setAssetsPage(current_page + 1);
      } catch (error) {
        handleApiError(error, toast);
      } finally {
        setIsLoadingAssets(false);
      }
    },
    [companyId, assetsPage, assetFilters, toast]
  );

  // Fetch company documents
  const fetchCompanyDocuments = useCallback(
    async (reset = false) => {
      if (!companyId) return;

      const pageToFetch = reset ? 1 : documentsPage;

      setIsLoadingDocuments(true);
      try {
        const params = {
          page: pageToFetch,
          limit: 10,
          sortBy: "created_at",
          sortOrder: "DESC",
          search: documentFilters.search,
          is_confidential: documentFilters.is_confidential,
        };

        const response = await companiesService.getCompanyDocuments(
          companyId,
          params
        );

        if (response && response.data && response.data.data) {
          const {
            documents: fetchedDocuments,
            total_items,
            total_pages,
            current_page,
          } = response.data.data;

          if (reset) {
            setDocuments(fetchedDocuments || []);
            setDocumentsPage(1);
          } else {
            setDocuments((prev) => [...prev, ...(fetchedDocuments || [])]);
          }

          setTotalDocuments(total_items || 0);
          setTotalDocumentsPages(total_pages || 0);
          setDocumentsPage(current_page + 1);
        } else {
          if (reset) {
            setDocuments([]);
          }
        }
      } catch (error) {
        handleApiError(error, toast);
      } finally {
        setIsLoadingDocuments(false);
      }
    },
    [companyId, documentsPage, documentFilters, toast]
  );

  // Fetch company warehouses
  const fetchCompanyWarehouses = useCallback(async () => {
    if (!companyId) return;

    setIsLoadingWarehouses(true);
    try {
      const response = await companiesService.getCompanyWarehouses(companyId);
      setWarehouses(response.data.data.warehouses || []);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsLoadingWarehouses(false);
    }
  }, [companyId, toast]);

  // Handle status changes
  const handleActivateCompany = async () => {
    try {
      const result = await companiesService.markCompanyActive(companyId);
      toast({
        description:
          result.data.message || "Company has been activated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchCompanyDetails();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleDeactivateCompany = async () => {
    try {
      const result = await companiesService.markCompanyInactive(companyId);
      toast({
        description:
          result.data.message || "Company has been deactivated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      fetchCompanyDetails();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  // Handle edit company
  const handleEditCompany = () => {
    onEditModalOpen();
  };

  // Handle logo change
  const handleChangeLogo = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        description: "Please upload an image file (JPEG, PNG, GIF, SVG)",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        description: "Logo image must be less than 10MB",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    try {
      setIsUploading(true);
      const result = await companiesService.changeCompanyLogo(companyId, file);

      toast({
        description: result.data.message || "Company logo updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      fetchCompanyDetails();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const triggerLogoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAssetEdit = (asset) => {
    setSelectedAsset(asset);
    onAssetEditModalOpen();
  };

  const handleAssetDelete = (asset) => {
    setSelectedAsset(asset);
    onAssetDeleteModalOpen();
  };

  const handleAssetStatusChange = async (assetId, newStatus) => {
    try {
      const result = await companiesService.updateCompanyAssetStatus(
        companyId,
        assetId,
        newStatus
      );

      toast({
        description: result.data.message || "Asset status has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      fetchCompanyAssets(true);
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleAssetFilterChange = (e) => {
    const { name, value } = e.target;
    setAssetFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyAssetFilters = () => {
    fetchCompanyAssets(true);
  };

  const resetAssetFilters = () => {
    setAssetFilters({
      search: "",
      status: "",
      category: "",
    });
    fetchCompanyAssets(true);
  };

  const handleDocumentEdit = (document) => {
    setSelectedDocument(document);
    onDocumentEditModalOpen();
  };

  const handleDocumentDelete = (document) => {
    setSelectedDocument(document);
    onDocumentDeleteModalOpen();
  };

  const handleDocumentView = (document) => {
    setSelectedDocument(document);
    onDocumentViewModalOpen();
  };

  const handleDocumentFilterChange = (e) => {
    const { name, value } = e.target;
    setDocumentFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyDocumentFilters = () => {
    fetchCompanyDocuments(true);
  };

  const resetDocumentFilters = () => {
    setDocumentFilters({
      search: "",
      is_confidential: "",
    });
    fetchCompanyDocuments(true);
  };

  const handleWarehouseDuplicate = async (warehouseId) => {
    try {
      const result = await companiesService.duplicateCompanyWarehouse(warehouseId);
      toast({
        description: result.data.message || 'Warehouse duplicated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle,
      });
      fetchCompanyWarehouses();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  const handleWarehouseInactive = async (warehouseId) => {
    try {
      const result = await companiesService.makeWarehouseInactive(warehouseId);
      toast({
        description: result.data.message || 'Warehouse deactivated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle,
      });
      fetchCompanyWarehouses();
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId, fetchCompanyDetails]);

  const handleTabChange = (index) => {
    try {
      if (index === 1 && users.length === 0) {
        // Users tab
        fetchCompanyUsers();
      } else if (index === 2 && assets.length === 0) {
        // Assets tab
        fetchCompanyAssets(true);
      } else if (index === 3 && documents.length === 0) {
        // Documents tab
        fetchCompanyDocuments(true);
      } else if (index === 4 && warehouses.length === 0) {
        // Warehouses tab
        fetchCompanyWarehouses();
      }
    } catch (error) {
      index = 1;
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
          <Skeleton height="50px" width="200px" mb={6} />
          <SkeletonText mt="4" noOfLines={6} spacing="4" skeletonHeight="4" />
        </Box>
      </Box>
    );
  }

  if (!companyDetails) {
    return (
      <Box minH="100vh" bg="rgb(241,241,241)">
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p="5">
          <Alert status="error" variant="solid" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Company Not Found</AlertTitle>
            <AlertDescription>
              The requested company could not be found.
            </AlertDescription>
          </Alert>
          <Button
            mt={4}
            leftIcon={<FiArrowLeft />}
            onClick={() => navigate("/companies")}
          >
            Back to Companies List
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="rgb(241,241,241)">
      <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
      <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
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
              onClick={() => navigate("/companies-console")}
            >
              <Icon as={FiBriefcase} mr={1} />
              Companies
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink color="blue.400" fontWeight="medium">
              {companyDetails?.business_name || "Company Details"}
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
            <Heading size="md" color="black" fontWeight="500">
              Company Profile
            </Heading>
            <Button
              leftIcon={<FiArrowLeft />}
              onClick={() => navigate("/companies-console")}
              bg='black'
              color='white'
              _hover={{ bg: "gray.800" }}
              size="sm"
            >
              Back to List
            </Button>
          </MotionFlex>

          {/* Company Info Card */}
          <MotionCard
            bg="rgb(255,255,255)"
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
              bgGradient="linear(to-r, blue.900, rgb(255,255,255))"
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
                  _hover={{ bg: "whiteAlpha.200" }}
                />
                <MenuList bg="rgb(255,255,255)" borderColor="gray.200">
                  <MenuItem
                    icon={<FiEdit />}
                    onClick={handleEditCompany}
                    color="gray.900"
                    bg="transparent"
                    _hover={{ bg: "rgb(241,241,241)" }}
                  >
                    Edit Company
                  </MenuItem>

                  {/* Add new menu item for changing logo */}
                  <MenuItem
                    icon={<FiImage />}
                    onClick={triggerLogoUpload}
                    color="black"
                    bg="transparent"
                    _hover={{ bg: "rgb(241,241,241)" }}
                    isDisabled={isUploading}
                  >
                    {isUploading ? "Uploading Logo..." : "Change Logo"}
                  </MenuItem>

                  {companyDetails?.is_inactive ? (
                    <MenuItem
                      icon={<FiCheckCircle />}
                      onClick={handleActivateCompany}
                      color="gray.900"
                      bg="transparent"
                      _hover={{ bg: "rgb(241,241,241)" }}
                    >
                      Activate Company
                    </MenuItem>
                  ) : (
                    <MenuItem
                      icon={<FiXCircle />}
                      onClick={handleDeactivateCompany}
                      color="gray.900"
                      bg="transparent"
                      _hover={{ bg: "rgb(241,241,241)" }}
                    >
                      Deactivate Company
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            </Box>

            <CardBody pt={0} mt="-50px">
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "center", md: "flex-start" }}
                gap={6}
              >
                <VStack spacing={3} align="center" position="relative">
                  {companyDetails.logo_url ? (
                    <Box
                      borderRadius="xl"
                      overflow="hidden"
                      border="4px solid"
                      borderColor="gray.200"
                      boxShadow="xl"
                      width="150px"
                      height="150px"
                      position="relative"
                      cursor="pointer"
                      onClick={triggerLogoUpload}
                      _hover={{
                        "&::after": {
                          content: '"Change Logo"',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          fontSize: "sm",
                          fontWeight: "medium",
                        },
                      }}
                    >
                      <Image
                        src={`${companyDetails.logo_url}`}
                        alt={`${companyDetails.business_name} logo`}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        fallback={
                          <Center bg="blue.500" width="100%" height="100%">
                            <Icon
                              as={FiBriefcase}
                              fontSize="5xl"
                              color="black"
                            />
                          </Center>
                        }
                      />
                      {isUploading && (
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          width="100%"
                          height="100%"
                          bg="transparent"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Spinner size="lg" color="blue.400" thickness="3px" />
                        </Box>
                      )}
                    </Box>
                  ) : (
                    <Center
                      bg="black"
                      color="white"
                      borderRadius="xl"
                      width="150px"
                      height="150px"
                      border="4px solid"
                      borderColor="gray.200"
                      boxShadow="xl"
                      position="relative"
                      cursor="pointer"
                      onClick={triggerLogoUpload}
                      _hover={{
                        "&::after": {
                          content: '"Upload Logo"',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "rgba(0,0,0,0.6)",
                          color: "white",
                          fontSize: "sm",
                          fontWeight: "medium",
                        },
                      }}
                    >
                      <Icon as={FiBriefcase} fontSize="5xl" />
                      {isUploading && (
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          width="100%"
                          height="100%"
                          bg="rgba(0,0,0,0.7)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Spinner size="lg" color="blue.400" thickness="3px" />
                        </Box>
                      )}
                    </Center>
                  )}

                  {/* Hidden file input for logo upload */}
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleChangeLogo}
                    style={{ display: "none" }}
                  />

                  <Tooltip
                    label="Click to change company logo"
                    placement="bottom"
                    hasArrow
                  >
                    <Text
                      color="blue.400"
                      fontSize="xs"
                      cursor="pointer"
                      onClick={triggerLogoUpload}
                    >
                      <Icon as={FiImage} mr={1} />
                      {companyDetails.logo_url ? "Change Logo" : "Upload Logo"}
                    </Text>
                  </Tooltip>

                  <VStack spacing={1}>
                    <Text
                      fontWeight="bold"
                      fontSize={{ base: "xl", md: "2xl" }}
                      color="black"
                      textAlign="center"
                    >
                      {companyDetails.business_name}
                    </Text>
                    <Text color="gray.900" fontSize="md">
                      {companyDetails.market_name}
                    </Text>
                    <Tag
                      size="md"
                      colorScheme="blue"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      <Icon as={FiBriefcase} mr={1} />
                      {companyDetails.type_of_business || "Business"}
                    </Tag>
                    {/* Status Indicators */}
                    <HStack spacing={2} mt={2} wrap="wrap" justify="center">
                      <Badge
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        colorScheme={
                          !companyDetails.is_inactive ? "green" : "red"
                        }
                        variant={
                          !companyDetails.is_inactive ? "solid" : "subtle"
                        }
                      >
                        <Icon
                          as={
                            !companyDetails.is_inactive
                              ? FiCheckCircle
                              : FiXCircle
                          }
                          mr={1}
                        />
                        {!companyDetails.is_inactive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge
                        px={2}
                        py={0.5}
                        borderRadius="md"
                        colorScheme={
                          companyDetails.is_verified ? "teal" : "yellow"
                        }
                        variant={
                          companyDetails.is_verified ? "solid" : "subtle"
                        }
                      >
                        <Icon
                          as={
                            companyDetails.is_verified
                              ? FiCheckCircle
                              : FiAlertTriangle
                          }
                          mr={1}
                        />
                        {companyDetails.is_verified ? "Verified" : "Unverified"}
                      </Badge>
                    </HStack>
                  </VStack>
                </VStack>

                {/* Company details grid */}
                <Box
                  flex="1"
                  mt={{ base: 4, md: 0 }}
                  position="relative"
                  zIndex={1}
                >
                  {/* Company Stats */}
                  <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4} mb={4}>
                    <StatCard
                      label="Total Orders"
                      value={companyDetails.total_orders || 0}
                      icon={FiActivity}
                      color="blue"
                    />
                    <StatCard
                      label="Rating"
                      value={companyDetails.average_rating?.toFixed(1) || 0}
                      icon={FiCheckCircle}
                      color="green"
                    />
                    <StatCard
                      label="Returns"
                      value={companyDetails.return_count || 0}
                      icon={FiXCircle}
                      color="red"
                    />
                  </SimpleGrid>

                  {/* Business Information */}
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={5}
                    bg="rgb(255,255,255)"
                    p={4}
                    borderRadius="lg"
                    boxShadow="inner"
                    mb={4}
                  >
                    <InfoItem
                      icon={FiBriefcase}
                      label="Business Type"
                      value={companyDetails.type_of_business || "Not specified"}
                    />
                    <InfoItem
                      icon={FiInfo}
                      label="Business ID"
                      value={
                        companyDetails.number_unique_identifier ||
                        "Not specified"
                      }
                    />
                    <InfoItem
                      icon={FiFileText}
                      label="Fiscal Number"
                      value={companyDetails.fiscal_number || "Not specified"}
                    />
                    <InfoItem
                      icon={FiGlobe}
                      label="Website"
                      value={companyDetails.website_url || "Not specified"}
                      isLink={!!companyDetails.website_url}
                    />
                  </SimpleGrid>

                  {/* Contact Information */}
                  <SimpleGrid
                    columns={{ base: 1, sm: 2 }}
                    spacing={5}
                    bg="rgb(255,255,255)"
                    p={4}
                    borderRadius="lg"
                    boxShadow="inner"
                  >
                    <InfoItem
                      icon={FiMapPin}
                      label="Location"
                      value={
                        companyDetails.city && companyDetails.country
                          ? `${companyDetails.city}, ${companyDetails.country}`
                          : companyDetails.country ||
                            companyDetails.city ||
                            "Not specified"
                      }
                    />
                    <InfoItem
                      icon={FiMapPin}
                      label="Address"
                      value={companyDetails.address || "Not specified"}
                    />
                    <InfoItem
                      icon={FiPhone}
                      label="Phone Number"
                      value={companyDetails.phone_number || "Not specified"}
                    />
                    <InfoItem
                      icon={FiMail}
                      label="Postal Code"
                      value={companyDetails.postal_code || "Not specified"}
                    />
                    <InfoItem
                      icon={FiUser}
                      label="Contact Person"
                      value={companyDetails.contact_person || "Not specified"}
                    />
                    <InfoItem
                      icon={FiMail}
                      label="Contact Email"
                      value={
                        companyDetails.contact_person_email || "Not specified"
                      }
                      isLink={!!companyDetails.contact_person_email}
                    />
                    <InfoItem
                      icon={FiPhone}
                      label="Contact Phone"
                      value={
                        companyDetails.contact_person_phone || "Not specified"
                      }
                    />
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
                  color="gray.900"
                  _selected={{ color: "white", bg: "blue.500" }}
                  fontWeight="medium"
                  mr={2}
                  px={5}
                >
                  <Icon as={FiInfo} mr={2} />
                  Company Info
                </Tab>
                <Tab
                  color="gray.900"
                  _selected={{ color: "white", bg: "blue.500" }}
                  fontWeight="medium"
                  mr={2}
                  px={5}
                >
                  <Icon as={FiUsers} mr={2} />
                  Users
                </Tab>
                <Tab
                  color="gray.900"
                  _selected={{ color: "white", bg: "blue.500" }}
                  fontWeight="medium"
                  mr={2}
                  px={5}
                >
                  <Icon as={FiImage} mr={2} />
                  Assets
                </Tab>
                <Tab
                  color="gray.900"
                  _selected={{ color: "white", bg: "blue.500" }}
                  fontWeight="medium"
                  mr={2}
                  px={5}
                >
                  <Icon as={FiFolder} mr={2} />
                  Documents
                </Tab>
                <Tab
                  color="gray.900"
                  _selected={{ color: "white", bg: "blue.500" }}
                  fontWeight="medium"
                  px={5}
                >
                  <Icon as={FiBriefcase} mr={2} />
                  Warehouses
                </Tab>
              </TabList>

              <TabPanels>
                {/* Company Info Tab */}
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
                    <CardHeader>
                      <Heading size="md" color="black" fontWeight="medium">
                        Detailed Information
                      </Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                        <Box>
                          <Heading size="sm" color="gray.900" mb={4}>
                            Business Details
                          </Heading>
                          <VStack align="stretch" spacing={4}>
                            <Field
                              label="Business Name"
                              value={companyDetails.business_name}
                            />
                            <Field
                              label="Market Name"
                              value={companyDetails.market_name}
                            />
                            <Field
                              label="Type of Business"
                              value={
                                companyDetails.type_of_business ||
                                "Not specified"
                              }
                            />
                            <Field
                              label="Business Identifier"
                              value={
                                companyDetails.number_unique_identifier ||
                                "Not specified"
                              }
                            />
                            <Field
                              label="Fiscal Number"
                              value={
                                companyDetails.fiscal_number || "Not specified"
                              }
                            />
                            <Field
                              label="Date of Registration"
                              value={
                                companyDetails.data_of_registration
                                  ? formatWithTimezone(
                                      companyDetails.data_of_registration,
                                      formatOptions.FULL_DATE,
                                      currentTimezone
                                    )
                                  : "Not specified"
                              }
                            />
                            <Field
                              label="Employees Count"
                              value={
                                companyDetails.employees_count ||
                                "Not specified"
                              }
                            />
                          </VStack>
                        </Box>

                        <Box>
                          <Heading size="sm" color="gray.900" mb={4}>
                            Contact Information
                          </Heading>
                          <VStack align="stretch" spacing={4}>
                            <Field
                              label="Country"
                              value={companyDetails.country || "Not specified"}
                            />
                            <Field
                              label="City"
                              value={companyDetails.city || "Not specified"}
                            />
                            <Field
                              label="Address"
                              value={companyDetails.address || "Not specified"}
                            />
                            <Field
                              label="Postal Code"
                              value={
                                companyDetails.postal_code || "Not specified"
                              }
                            />
                            <Field
                              label="Phone Number"
                              value={
                                companyDetails.phone_number || "Not specified"
                              }
                            />
                            <Field
                              label="Website"
                              value={
                                companyDetails.website_url || "Not specified"
                              }
                              isLink={!!companyDetails.website_url}
                            />
                          </VStack>
                        </Box>

                        <Box gridColumn={{ md: "span 2" }}>
                          <Heading size="sm" color="gray.900" mb={4}>
                            Primary Contact
                          </Heading>
                          <VStack align="stretch" spacing={4}>
                            <Field
                              label="Contact Person"
                              value={
                                companyDetails.contact_person || "Not specified"
                              }
                            />
                            <Field
                              label="Contact Email"
                              value={
                                companyDetails.contact_person_email ||
                                "Not specified"
                              }
                              isLink={!!companyDetails.contact_person_email}
                            />
                            <Field
                              label="Contact Phone"
                              value={
                                companyDetails.contact_person_phone ||
                                "Not specified"
                              }
                            />
                          </VStack>
                        </Box>

                        {companyDetails.notes_internal && (
                          <Box gridColumn={{ md: "span 2" }}>
                            <Heading size="sm" color="gray.900" mb={4}>
                              Internal Notes
                            </Heading>
                            <Box
                              bg="gray.100"
                              p={4}
                              borderRadius="md"
                              fontSize="sm"
                              color="gray.900"
                            >
                              {companyDetails.notes_internal}
                            </Box>
                          </Box>
                        )}
                      </SimpleGrid>
                    </CardBody>
                  </MotionCard>
                </TabPanel>

                {/* Users Tab */}
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
                    <CardHeader>
                      <Heading size="md" color="black" fontWeight="medium">
                        Company Users
                      </Heading>
                    </CardHeader>
                    <CardBody pt={0}>
                      {isLoadingUsers ? (
                        <Center py={8}>
                          <VStack>
                            <Spinner
                              size="lg"
                              color="blue.400"
                              thickness="3px"
                              speed="0.8s"
                            />
                            <Text color="gray.400" mt={2}>
                              Loading users...
                            </Text>
                          </VStack>
                        </Center>
                      ) : users && users.length > 0 ? (
                        <UserList users={users} />
                      ) : (
                        <EmptyState
                          icon={FiUsers}
                          title="No Users Found"
                          message="This company doesn't have any registered users."
                        />
                      )}
                    </CardBody>
                  </MotionCard>
                </TabPanel>

                {/* Assets Tab */}
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
                    <CardHeader>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ base: "column", sm: "row" }}
                        gap={2}
                      >
                        <Heading size="md" color="gray.900" fontWeight="medium">
                          Company Assets
                        </Heading>
                        <HStack spacing={2}>
                          <Button
                            leftIcon={<FiPlus />}
                            bg='black'
                            color='white'
                            _hover={{ bg: "gray.800" }}
                            size="sm"
                            onClick={onAssetCreateModalOpen}
                          >
                            Add Asset
                          </Button>
                          <Button
                            leftIcon={<FiFilter />}
                            size="sm"
                            onClick={() =>
                              setShowAssetFilters(!showAssetFilters)
                            }
                            bg='black'
                            color='white'
                            _hover={{ bg: "gray.800" }}
                          >
                            {showAssetFilters ? "Hide Filters" : "Filters"}
                          </Button>
                          <Button
                            leftIcon={<FiRefreshCw />}
                            size="sm"
                            onClick={() => fetchCompanyAssets(true)}
                            isLoading={isLoadingAssets}
                            bg='black'
                            color='white'
                            _hover={{ bg: "gray.800" }}
                          >
                            Refresh
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>

                    <CardBody pt={0}>
                      {/* Filters */}
                      {showAssetFilters && (
                        <Box
                          mb={6}
                          p={4}
                          bg="rgb(255,255,255)"
                          borderRadius="md"
                          borderWidth="1px"
                          borderColor="gray.400"
                        >
                          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                            <FormControl>
                              <FormLabel fontSize="sm" color='gray.900'>Search</FormLabel>
                              <Input
                                name="search"
                                value={assetFilters.search}
                                onChange={handleAssetFilterChange}
                                placeholder="Search assets..."
                                size="sm"
                                bg="rgb(241,241,241)"
                                borderColor='gray.200'
                                rounded='lg'
                                _hover={{ borderColor: 'gray.200' }}
                                color='gray.900'
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm" color='gray.900'>Status</FormLabel>
                              <Select
                                name="status"
                                value={assetFilters.status}
                                onChange={handleAssetFilterChange}
                                placeholder="All statuses"
                                size="sm"
                                bg="rgb(241,241,241)"
                                borderColor='gray.200'
                                rounded='lg'
                                _hover={{ borderColor: 'gray.200' }}
                                color='gray.900'
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                              </Select>
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm" color='gray.900'>Category</FormLabel>
                              <Select
                                name="category"
                                value={assetFilters.category}
                                onChange={handleAssetFilterChange}
                                placeholder="All categories"
                                size="sm"
                                bg="rgb(241,241,241)"
                                borderColor='gray.200'
                                rounded='lg'
                                _hover={{ borderColor: 'gray.200' }}
                                color='gray.900'
                              >
                                <option value="Furniture">Furniture</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Office Equipment">
                                  Office Equipment
                                </option>
                                <option value="Machinery">Machinery</option>
                                <option value="Vehicle">Vehicle</option>
                                <option value="IT Equipment">
                                  IT Equipment
                                </option>
                              </Select>
                            </FormControl>
                          </SimpleGrid>
                          <Flex justify="flex-end" mt={4} gap={2}>
                            <Button
                              size="sm"
                              onClick={resetAssetFilters}
                            >
                              Reset
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={applyAssetFilters}
                            >
                              Apply Filters
                            </Button>
                          </Flex>
                        </Box>
                      )}

                      {/* Assets display */}
                      {isLoadingAssets && assets.length === 0 ? (
                        <Center py={8}>
                          <VStack>
                            <Spinner
                              size="lg"
                              color="blue.400"
                              thickness="3px"
                              speed="0.8s"
                            />
                            <Text color="gray.900" mt={2}>
                              Loading assets...
                            </Text>
                          </VStack>
                        </Center>
                      ) : assets && assets.length > 0 ? (
                        <Box>
                          <AssetsList
                            assets={assets}
                            onEdit={handleAssetEdit}
                            onDelete={handleAssetDelete}
                            onStatusChange={handleAssetStatusChange}
                            refreshAssets={fetchCompanyAssets}
                          />

                          {/* Load more button */}
                          {assetsPage <= totalAssetsPages && (
                            <Center mt={6}>
                              <Button
                                onClick={() => fetchCompanyAssets()}
                                isLoading={isLoadingAssets}
                                leftIcon={<FiRefreshCw />}
                                size="sm"
                                bg='blue.500'
                                color='black'
                                _hover={{ bg: 'blue.500' }}
                              >
                                Load More Assets
                              </Button>
                            </Center>
                          )}

                          {/* Assets count */}
                          <Text
                            textAlign="center"
                            color="gray.900"
                            fontSize="sm"
                            mt={4}
                          >
                            Showing {assets.length} of {totalAssets} assets
                          </Text>
                        </Box>
                      ) : (
                        <EmptyState
                          icon={FiImage}
                          title="No Assets Found"
                          message="This company doesn't have any registered assets."
                          action={
                            <Button
                              leftIcon={<FiPlus />}
                              colorScheme="blue"
                              onClick={onAssetCreateModalOpen}
                            >
                              Add Asset
                            </Button>
                          }
                        />
                      )}
                    </CardBody>
                  </MotionCard>
                </TabPanel>

                {/* Documents Tab */}
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
                    <CardHeader>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ base: "column", sm: "row" }}
                        gap={2}
                      >
                        <Heading size="md" color="gray.900" fontWeight="medium">
                          Company Documents
                        </Heading>
                        <HStack spacing={2}>
                          <Button
                            leftIcon={<FiPlus />}
                            colorScheme="blue"
                            size="sm"
                            onClick={onDocumentUploadModalOpen}
                          >
                            Upload Document
                          </Button>
                          <Button
                            leftIcon={<FiFilter />}
                            size="sm"
                            onClick={() =>
                              setShowDocumentFilters(!showDocumentFilters)
                            }
                            bg='black'
                            color='white'
                            _hover={{ bg: "gray.800" }}
                          >
                            {showDocumentFilters ? "Hide Filters" : "Filters"}
                          </Button>
                          <Button
                            leftIcon={<FiRefreshCw />}
                            size="sm"
                            onClick={() => fetchCompanyDocuments(true)}
                            isLoading={isLoadingDocuments}
                            bg='black'
                            color='white'
                            _hover={{ bg: "gray.800" }}
                          >
                            Refresh
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>

                    <CardBody pt={0}>
                      {/* Filters */}
                      {showDocumentFilters && (
                        <Box
                          mb={6}
                          p={4}
                          bg="rgb(255,255,255)"
                          borderRadius="md"
                          borderColor={'gray.400'}
                        >
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl>
                              <FormLabel fontSize="sm" color='gray.900'>Search</FormLabel>
                              <Input
                                name="search"
                                value={documentFilters.search}
                                onChange={handleDocumentFilterChange}
                                placeholder="Search documents..."
                                size="sm"
                                bg="rgb(241,241,241)"
                                color='gray.900'
                                _hover={{ borderColor: 'gray.400' }}
                                borderColor='gray.400'
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel fontSize="sm" color='gray.900'>
                                Confidentiality
                              </FormLabel>
                              <Select
                                name="is_confidential"
                                value={documentFilters.is_confidential}
                                onChange={handleDocumentFilterChange}
                                placeholder="All documents"
                                size="sm"
                                bg="rgb(241,241,241)"
                                color='gray.900'
                                _hover={{ borderColor: 'gray.400' }}
                                borderColor='gray.400'
                              >
                                <option value="true">Confidential Only</option>
                                <option value="false">
                                  Non-confidential Only
                                </option>
                              </Select>
                            </FormControl>
                          </SimpleGrid>
                          <Flex justify="flex-end" mt={4} gap={2}>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={resetDocumentFilters}
                            >
                              Reset
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={applyDocumentFilters}
                            >
                              Apply Filters
                            </Button>
                          </Flex>
                        </Box>
                      )}

                      {/* Documents display */}
                      {isLoadingDocuments && documents.length === 0 ? (
                        <Center py={8}>
                          <VStack>
                            <Spinner
                              size="lg"
                              color="blue.400"
                              thickness="3px"
                              speed="0.8s"
                            />
                            <Text color="gray.900" mt={2}>
                              Loading documents...
                            </Text>
                          </VStack>
                        </Center>
                      ) : documents && documents.length > 0 ? (
                        <Box>
                          <DocumentsList
                            documents={documents}
                            onEdit={handleDocumentEdit}
                            onDelete={handleDocumentDelete}
                            onView={handleDocumentView}
                            onUpload={onDocumentUploadModalOpen}
                            refreshDocuments={fetchCompanyDocuments}
                          />

                          {/* Load more button */}
                          {documentsPage <= totalDocumentsPages && (
                            <Center mt={6}>
                              <Button
                                onClick={() => fetchCompanyDocuments()}
                                isLoading={isLoadingDocuments}
                                leftIcon={<FiRefreshCw />}
                                colorScheme="blue"
                                variant="outline"
                                size="sm"
                              >
                                Load More Documents
                              </Button>
                            </Center>
                          )}

                          {/* Documents count */}
                          <Text
                            textAlign="center"
                            color="gray.900"
                            fontSize="sm"
                            mt={4}
                          >
                            Showing {documents.length} of {totalDocuments}{" "}
                            documents
                          </Text>
                        </Box>
                      ) : (
                        <EmptyState
                          icon={FiFolder}
                          title="No Documents Found"
                          message="This company doesn't have any documents uploaded yet."
                          action={
                            <Button
                              leftIcon={<FiPlus />}
                              colorScheme="blue"
                              onClick={onDocumentUploadModalOpen}
                            >
                              Upload Document
                            </Button>
                          }
                        />
                      )}
                    </CardBody>
                  </MotionCard>
                </TabPanel>

                {/* Warehouses Tab */}
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
                    <CardHeader>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection={{ base: "column", sm: "row" }}
                        gap={2}
                      >
                        <Heading size="md" color="gray.900" fontWeight="medium">
                          Company Warehouses
                        </Heading>
                        <HStack spacing={2}>
                          <Button
                            leftIcon={<FiPlus />}
                            colorScheme="blue"
                            size="sm"
                            onClick={onWarehouseCreateModalOpen}
                          >
                            Create Warehouse
                          </Button>
                          <Button
                            leftIcon={<FiRefreshCw />}
                            size="sm"
                            onClick={fetchCompanyWarehouses}
                            isLoading={isLoadingWarehouses}
                            bg='black'
                            color='white'
                            _hover={{ bg: "gray.800" }}
                          >
                            Refresh
                          </Button>
                        </HStack>
                      </Flex>
                    </CardHeader>

                    <CardBody pt={0}>
                      {isLoadingWarehouses ? (
                        <Center py={8}>
                          <VStack>
                            <Spinner size="lg" color="blue.400" thickness="3px" speed="0.8s" />
                            <Text color="gray.400" mt={2}>Loading warehouses...</Text>
                          </VStack>
                        </Center>
                      ) : warehouses && warehouses.length > 0 ? (
                        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                          {warehouses.map((warehouse) => (
                            <Box
                              key={warehouse.id}
                              p={4}
                              borderWidth="1px"
                              borderRadius="lg"
                              bg="white"
                              boxShadow="sm"
                              _hover={{ boxShadow: "md" }}
                            >
                              <VStack align="start" spacing={3}>
                                <HStack justify="space-between" width="100%">
                                  <Text fontWeight="bold" color="gray.900">
                                    {warehouse.name}
                                  </Text>
                                  <Badge
                                    colorScheme={warehouse.is_active ? "green" : "red"}
                                    variant="solid"
                                  >
                                    {warehouse.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </HStack>
                                
                                <Text fontSize="sm" color="gray.600">
                                  Type: {warehouse.type || "main"}
                                </Text>
                                
                                {warehouse.address && (
                                  <Text fontSize="sm" color="gray.600">
                                    {warehouse.address}
                                  </Text>
                                )}
                                
                                {warehouse.city && warehouse.country && (
                                  <Text fontSize="sm" color="gray.600">
                                    {warehouse.city}, {warehouse.country}
                                  </Text>
                                )}

                                {warehouse.contact_email && (
                                  <Text fontSize="sm" color="gray.600">
                                    Email: {warehouse.contact_email}
                                  </Text>
                                )}

                                {warehouse.contact_phone && (
                                  <Text fontSize="sm" color="gray.600">
                                    Phone: {warehouse.contact_phone}
                                  </Text>
                                )}

                                <HStack spacing={2} mt={3}>
                                  <Button
                                    size="xs"
                                    colorScheme="blue"
                                    variant="outline"
                                    onClick={() => handleWarehouseDuplicate(warehouse.id)}
                                  >
                                    Duplicate
                                  </Button>
                                  {warehouse.is_active && (
                                    <Button
                                      size="xs"
                                      colorScheme="red"
                                      variant="outline"
                                      onClick={() => handleWarehouseInactive(warehouse.id)}
                                    >
                                      Deactivate
                                    </Button>
                                  )}
                                </HStack>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <EmptyState
                          icon={FiBriefcase}
                          title="No Warehouses Found"
                          message="This company doesn't have any warehouses configured yet."
                          action={
                            <Button
                              leftIcon={<FiPlus />}
                              colorScheme="blue"
                              onClick={onWarehouseCreateModalOpen}
                            >
                              Create Warehouse
                            </Button>
                          }
                        />
                      )}
                    </CardBody>
                  </MotionCard>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </MotionBox>
        </MotionFlex>

        {/* Edit Company Modal */}
        <CompanyUpdateModal
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
          companyId={companyId}
          refreshList={fetchCompanyDetails}
        />

        {/* Asset Modals */}
        <AssetCreateModal
          isOpen={isAssetCreateModalOpen}
          onClose={onAssetCreateModalClose}
          companyId={companyId}
          onSuccess={() => fetchCompanyAssets(true)}
        />

        <AssetEditModal
          isOpen={isAssetEditModalOpen}
          onClose={onAssetEditModalClose}
          companyId={companyId}
          asset={selectedAsset}
          onSuccess={() => fetchCompanyAssets(true)}
        />

        <AssetDeleteModal
          isOpen={isAssetDeleteModalOpen}
          onClose={onAssetDeleteModalClose}
          companyId={companyId}
          asset={selectedAsset}
          onSuccess={() => fetchCompanyAssets(true)}
        />

        {/* Document Modals */}
        <DocumentUploadModal
          isOpen={isDocumentUploadModalOpen}
          onClose={onDocumentUploadModalClose}
          companyId={companyId}
          onSuccess={() => fetchCompanyDocuments(true)}
        />

        <DocumentEditModal
          isOpen={isDocumentEditModalOpen}
          onClose={onDocumentEditModalClose}
          companyId={companyId}
          document={selectedDocument}
          onSuccess={() => fetchCompanyDocuments(true)}
        />

        <DocumentDeleteModal
          isOpen={isDocumentDeleteModalOpen}
          onClose={onDocumentDeleteModalClose}
          companyId={companyId}
          document={selectedDocument}
          onSuccess={() => fetchCompanyDocuments(true)}
        />

        <DocumentViewModal
          isOpen={isDocumentViewModalOpen}
          onClose={onDocumentViewModalClose}
          companyId={companyId}
          document={selectedDocument}
          onEdit={handleDocumentEdit}
          onDelete={handleDocumentDelete}
        />

        {/* Warehouse Modals */}
        <WarehouseCreateModal
          isOpen={isWarehouseCreateModalOpen}
          onClose={onWarehouseCreateModalClose}
          companyId={companyId}
          onSuccess={fetchCompanyWarehouses}
        />
      </MotionBox>
    </Box>
  );
};

// Helper components
const InfoItem = ({ icon, label, value, tooltip, isLink = false }) => {
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
            {isLink && value !== "Not specified" ? (
              <Text
                as="a"
                href={value.startsWith("http") ? value : `mailto:${value}`}
                target="_blank"
                color="blue.900"
              >
                {value}
              </Text>
            ) : (
              <Text>{value}</Text>
            )}
          </Tooltip>
        ) : isLink && value !== "Not specified" ? (
          <Text
            as="a"
            href={value.startsWith("http") ? value : `mailto:${value}`}
            target="_blank"
            color="blue.900"
          >
            {value}
          </Text>
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
      _hover={{ bg: "gray.750", transform: "translateY(-2px)" }}
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
          <Text fontSize="lg" fontWeight="bold" color="gray.900">
            {value}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

// Field component for detailed view
const Field = ({ label, value, isLink = false }) => {
  return (
    <Box>
      <Text color="gray.900" fontSize="xs" mb={1}>
        {label}
      </Text>
      {isLink && value !== "Not specified" ? (
        <Text
          color="blue.400"
          as="a"
          href={value.startsWith("http") ? value : `mailto:${value}`}
          target="_blank"
        >
          {value}
        </Text>
      ) : (
        <Text color="gray.900">{value}</Text>
      )}
    </Box>
  );
};

export default CompanyDetails;
