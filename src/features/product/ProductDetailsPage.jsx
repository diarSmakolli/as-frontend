import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Image,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
  Badge,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  IconButton,
  Tooltip,
  Flex,
  Icon,
  AspectRatio,
  Center,
  Spinner,
  Skeleton,
  SkeletonText,
  Tag,
  TagLabel,
  TagLeftIcon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  List,
  ListItem,
  ListIcon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useClipboard,
  Switch,
  FormControl,
  FormLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Avatar,
  AvatarGroup,
  Wrap,
  WrapItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiEdit,
  FiPackage,
  FiTruck,
  FiCheck,
  FiStar,
  FiShare2,
  FiZoomIn,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiTag,
  FiInfo,
  FiShield,
  FiClock,
  FiMapPin,
  FiPhone,
  FiGlobe,
  FiImage,
  FiX,
  FiPlus,
  FiMinus,
  FiDollarSign,
  FiTool,
  FiBox,
  FiSettings,
  FiAward,
  FiZap,
  FiTarget,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiMoreVertical,
  FiTrash2,
  FiPrinter,
  FiDownload,
  FiActivity,
  FiUsers,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiDatabase,
  FiLayers,
  FiBookmark,
  FiCalendar,
  FiArchive,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiMaximize2,
  FiMinimize2,
  FiExternalLink,
  FiMail,
  FiMessageSquare,
  FiFileText,
  FiFolder,
  FiUserCheck,
  FiCreditCard,
  FiShoppingCart,
} from "react-icons/fi";
import { productService } from "./services/productService";
import { handleApiError } from "../../commons/handleApiError";
import { useAuth } from "../administration/authContext/authContext";
import { usePreferences } from "../administration/authContext/preferencesProvider";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";
import Loader from "../../commons/Loader";
import { formatWithTimezone, formatOptions } from "../../commons/formatOptions";
import { customToastContainerStyle } from "../../commons/toastStyles";

const MotionBox = motion.create(Box);
const MotionCard = motion.create(Card);
const MotionImage = motion.create(Image);

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { account, isLoading: isAuthLoading } = useAuth();
  const { currentTimezone } = usePreferences();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showRelatedItems, setShowRelatedItems] = useState(false);
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure();
  const { hasCopied: hasSkuCopied, onCopy: onSkuCopy } = useClipboard(
    product?.sku || ""
  );
  const { hasCopied: hasIdCopied, onCopy: onIdCopy } = useClipboard(
    product?.id || ""
  );
  const [duplicating, setDuplicating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [unarchiving, setUnarchiving] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const bgColor = useColorModeValue("#f4f6f9", "gray.900");
  const surfaceColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("#e5e5e5", "gray.600");
  const primaryBlue = "#0176d3";
  const accentColor = useColorModeValue("#0176d3", "#4a90e2");
  const textSecondary = useColorModeValue("#706e6b", "gray.400");
  const textPrimary = useColorModeValue("#080707", "white");

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.4, delay: 0.2 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fetchProductDetails = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    try {
      const response = await productService.getProductById(productId);

      if (response.data?.status === "success") {
        const productData = response.data.data.product;
        setProduct(productData);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  }, [productId, navigate, toast]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleStatusToggle = async (field, currentValue) => {
    setUpdatingStatus(true);
    try {
      const formData = new FormData();
      formData.append(field, !currentValue);

      await productService.updateProduct(productId, formData);

      toast({
        title: "Status Updated",
        description: `Product ${field.replace("_", " ")} has been ${
          !currentValue ? "enabled" : "disabled"
        }.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      fetchProductDetails();
    } catch (error) {
      handleApiError(error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDuplicateProduct = async () => {
    if (
      !window.confirm(
        'Are you sure you want to duplicate this product? A copy will be created with " - Duplicate1" added to the name.'
      )
    ) {
      return;
    }

    setDuplicating(true);
    try {
      const response = await productService.duplicateProduct(productId);

      if (response.data?.status === "success") {
        toast({
          title: "Product Duplicated",
          description: `Product has been duplicated successfully. New title: "${response.data.data.newProduct.title}"`,
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });

        // Navigate to the new product or stay on current
        const shouldNavigate = window.confirm(
          "Would you like to view the duplicated product?"
        );
        if (shouldNavigate) {
          navigate(`/products-console/${response.data.data.newProduct.id}`);
        }
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setDuplicating(false);
    }
  };

  const handlePublishProduct = async () => {
    if (!product) return;

    setPublishing(true);

    try {
      const response = await productService.publishProduct(productId);

      if (response.data.status === "success") {
        // Update local product state
        setProduct((prev) => ({
          ...prev,
          is_published: true,
          updated_at: new Date().toISOString(),
        }));

        toast({
          title: "Product Published",
          description:
            "Product has been published successfully and is now visible to customers.",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setPublishing(false);
    }
  };

  const handleArchiveProduct = async () => {
    if (!product) return;

    setArchiving(true);

    try {
      const response = await productService.archiveProduct(productId);

      if (response.data.status === "success") {
        // Update local product state
        setProduct((prev) => ({
          ...prev,
          is_archived: true,
          updated_at: new Date().toISOString(),
        }));

        toast({
          title: "Product Archived",
          description: "Product has been archived successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });

        navigate("/products-console");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setArchiving(false);
    }
  };

  const handleUnarchiveProduct = async () => {
    if (!product) return;

    setUnarchiving(true);

    try {
      const response = await productService.unarchiveProduct(productId);

      if (response.data.status === "success") {
        // Update local product state
        setProduct((prev) => ({
          ...prev,
          is_archived: false,
          updated_at: new Date().toISOString(),
        }));

        toast({
          title: "Product Unarchived",
          description: "Product has been unarchived successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });

        fetchProductDetails();
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUnarchiving(false);
    }
  };

  const handleUnpublishProduct = async () => {
    if (!product) return;

    setUnpublishing(true);

    try {
      const response = await productService.unpublishProduct(productId);

      if (response.data.status === "success") {
        // Update local product state
        setProduct((prev) => ({
          ...prev,
          is_published: false,
          updated_at: new Date().toISOString(),
        }));

        toast({
          title: "Product Unpublished",
          description: "Product has been unpublished successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUnpublishing(false);
    }
  };

  if (isAuthLoading) {
    return <Loader />;
  }

  if (loading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p={6}>
          <Container maxW="full">
            <Skeleton height="40px" width="300px" mb={6} />
            <Grid templateColumns="1fr" gap={6}>
              <Skeleton height="400px" borderRadius="xl" />
              <SkeletonText noOfLines={4} spacing="4" />
            </Grid>
          </Container>
        </Box>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />
        <Box ml={{ base: 0, md: 60 }} p={6}>
          <Container maxW="full">
            <Alert status="error" borderRadius="xl">
              <AlertIcon />
              <AlertDescription>
                Product not found or has been removed.
              </AlertDescription>
            </Alert>
            <Button
              mt={6}
              leftIcon={<FiArrowLeft />}
              onClick={() => navigate("/products-console")}
              colorScheme="blue"
              size="lg"
            >
              Back to Products
            </Button>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
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

      <Box ml={{ base: 0, md: 60 }}>
        <Container maxW="full" px={0} py={0}>
          <MotionBox {...fadeIn}>
            {/* Salesforce-style Header Bar */}
            <Box
              display={{ base: "none", md: "flex" }}
              bg={surfaceColor}
              borderBottom="1px solid"
              borderColor={borderColor}
              px={6}
              py={4}
              position="sticky"
              top={0}
              zIndex={100}
              boxShadow="sm"
            >
              <Flex justify="space-between" align="center">
                <HStack spacing={4}>
                  <Button
                    leftIcon={<FiArrowLeft />}
                    variant="ghost"
                    onClick={() => navigate("/products-console")}
                    size="sm"
                    color={textSecondary}
                  >
                    Products
                  </Button>
                  <Divider orientation="vertical" height="20px" />
                  <Breadcrumb
                    separator={
                      <Icon
                        as={FiChevronRight}
                        color={textSecondary}
                        fontSize="sm"
                      />
                    }
                    fontSize="sm"
                    color={textSecondary}
                  >
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => navigate("/")}
                        _hover={{ color: primaryBlue }}
                      >
                        <Icon as={FiHome} mr={1} />
                        Home
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        onClick={() => navigate("/products-console")}
                        _hover={{ color: primaryBlue }}
                      >
                        Products
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                      <BreadcrumbLink color={primaryBlue} fontWeight="medium">
                        {product.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </HStack>

                <HStack spacing={3}>
                  <Tooltip label="Edit Product">
                    <IconButton
                      icon={<FiEdit />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() =>
                        navigate(`/products-console/${productId}/edit`)
                      }
                    />
                  </Tooltip>

                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="outline"
                      size="sm"
                      aria-label="More actions"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleDuplicateProduct}
                        isDisabled={duplicating}
                      >
                        {duplicating ? "Duplicating..." : "Duplicate Product"}
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handlePublishProduct}
                        isDisabled={publishing}
                      >
                        {publishing ? "Publishing..." : "Publish Product"}
                      </MenuItem>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleArchiveProduct}
                        isDisabled={archiving}
                      >
                        {publishing
                          ? "Archiving product..."
                          : "Archive Product"}
                      </MenuItem>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleUnarchiveProduct}
                        isDisabled={unarchiving}
                      >
                        {publishing
                          ? "UnArchiving product..."
                          : "UnArchive Product"}
                      </MenuItem>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleUnpublishProduct}
                        isDisabled={unpublishing}
                      >
                        {publishing
                          ? "Unpublishing product..."
                          : "Unpublish Product"}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Flex>
            </Box>

            {/* Salesforce style header bar mobile */}
            <Box
              bg={surfaceColor}
              borderBottom="1px solid"
              borderColor={borderColor}
              px={4}
              py={3}
              position="sticky"
              top={0}
              zIndex={100}
              boxShadow="sm"
              display={{ base: "flex", md: "none" }}
            >
              <Flex w="100%" align="center" justify="space-between">
                {/* Left: Back button */}
                <IconButton
                  icon={<FiArrowLeft />}
                  aria-label="Back"
                  variant="ghost"
                  size="lg"
                  color={primaryBlue}
                  onClick={() => navigate("/products-console")}
                />

                {/* Center: Product Title */}
                <Text
                  fontWeight="bold"
                  fontSize="md"
                  color={textPrimary}
                  noOfLines={1}
                  flex={1}
                  textAlign="center"
                  mx={2}
                >
                  {product.title}
                </Text>

                {/* Right: Actions */}
                <HStack spacing={1}>
                  <Tooltip label="Edit">
                    <IconButton
                      icon={<FiEdit />}
                      aria-label="Edit"
                      size="lg"
                      variant="ghost"
                      color={primaryBlue}
                      onClick={() =>
                        navigate(`/products-console/${productId}/edit`)
                      }
                    />
                  </Tooltip>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="lg"
                      aria-label="More"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleDuplicateProduct}
                        isDisabled={duplicating}
                      >
                        {duplicating ? "Duplicating..." : "Duplicate"}
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handlePublishProduct}
                        isDisabled={publishing}
                      >
                        {publishing ? "Publishing..." : "Publish"}
                      </MenuItem>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleArchiveProduct}
                        isDisabled={archiving}
                      >
                        {archiving ? "Archiving..." : "Archive"}
                      </MenuItem>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleUnarchiveProduct}
                        isDisabled={unarchiving}
                      >
                        {unarchiving ? "UnArchiving..." : "UnArchive"}
                      </MenuItem>
                      <MenuItem
                        icon={<FiCopy />}
                        onClick={handleUnpublishProduct}
                        isDisabled={unpublishing}
                      >
                        {unpublishing ? "Unpublishing..." : "Unpublish"}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </HStack>
              </Flex>
            </Box>

            {/* Product Header Section - Salesforce Style */}
            <Box
              bg={surfaceColor}
              px={6}
              py={6}
              borderBottom="1px solid"
              borderColor={borderColor}
            >
              <Grid
                templateColumns={{ base: "1fr", lg: "auto 1fr auto" }}
                gap={6}
                alignItems="start"
              >
                {/* Product Image */}
                <Box>
                  <AspectRatio ratio={1} width="120px" height="120px">
                    <Box
                      borderRadius="xl"
                      overflow="hidden"
                      border="3px solid"
                      borderColor={borderColor}
                      cursor="pointer"
                      onClick={onImageModalOpen}
                      position="relative"
                      _hover={{
                        borderColor: primaryBlue,
                        transform: "scale(1.02)",
                        transition: "all 0.2s",
                      }}
                    >
                      <Image
                        src={
                          product.images?.[selectedImageIndex]?.url ||
                          product.main_image_url
                        }
                        alt={product.title}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        fallback={
                          <Center bg="gray.100">
                            <Icon
                              as={FiPackage}
                              fontSize="3xl"
                              color="gray.400"
                            />
                          </Center>
                        }
                      />
                      <Box
                        position="absolute"
                        bottom={2}
                        right={2}
                        bg="blackAlpha.600"
                        borderRadius="md"
                        p={1}
                        color="white"
                        fontSize="xs"
                      >
                        <Icon as={FiZoomIn} />
                      </Box>
                    </Box>
                  </AspectRatio>

                  {/* Image Thumbnails */}
                  {product.images?.length > 1 && (
                    <HStack spacing={2} mt={3} justify="center">
                      {product.images.slice(0, 4).map((image, index) => (
                        <Box
                          key={image.id}
                          width="30px"
                          height="30px"
                          borderRadius="md"
                          overflow="hidden"
                          border="2px solid"
                          borderColor={
                            selectedImageIndex === index
                              ? primaryBlue
                              : "transparent"
                          }
                          cursor="pointer"
                          onClick={() => setSelectedImageIndex(index)}
                          _hover={{ borderColor: primaryBlue }}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt_text}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                        </Box>
                      ))}
                      {product.images.length > 4 && (
                        <Center
                          width="30px"
                          height="30px"
                          borderRadius="md"
                          bg="gray.100"
                          fontSize="xs"
                          fontWeight="bold"
                          color={textSecondary}
                        >
                          +{product.images.length - 4}
                        </Center>
                      )}
                    </HStack>
                  )}
                </Box>

                {/* Product Info */}
                <VStack align="start" spacing={4}>
                  <VStack align="start" spacing={2}>
                    <HStack spacing={3} align="center">
                      <Heading size="lg" color={textPrimary} fontWeight="600">
                        {product.title}
                      </Heading>
                      <StatusBadge product={product} />
                    </HStack>

                    <HStack spacing={4} wrap="wrap">
                      <HStack spacing={2}>
                        <Text
                          fontSize="sm"
                          color={textSecondary}
                          fontWeight="500"
                        >
                          SKU:
                        </Text>
                        <Text
                          fontSize="sm"
                          fontFamily="mono"
                          bg="gray.100"
                          px={2}
                          py={1}
                          borderRadius="md"
                        >
                          {product.sku}
                        </Text>
                        <IconButton
                          icon={<FiCopy />}
                          size="xs"
                          variant="ghost"
                          onClick={onSkuCopy}
                          title={hasSkuCopied ? "Copied!" : "Copy SKU"}
                        />
                      </HStack>

                      <HStack spacing={2}>
                        <Text
                          fontSize="sm"
                          color={textSecondary}
                          fontWeight="500"
                        >
                          EAN:
                        </Text>
                        <Text
                          fontSize="sm"
                          fontFamily="mono"
                          color={textSecondary}
                        >
                          {product?.ean}
                        </Text>
                        <IconButton
                          icon={<FiCopy />}
                          size="xs"
                          variant="ghost"
                          onClick={onIdCopy}
                          title={hasIdCopied ? "Copied!" : "Copy ID"}
                        />
                      </HStack>

                      <HStack spacing={2}>
                        <Text
                          fontSize="sm"
                          color={textSecondary}
                          fontWeight="500"
                        >
                          Barcode:
                        </Text>
                        <Text
                          fontSize="sm"
                          fontFamily="mono"
                          color={textSecondary}
                        >
                          {product?.barcode}
                        </Text>
                        <IconButton
                          icon={<FiCopy />}
                          size="xs"
                          variant="ghost"
                          onClick={onIdCopy}
                          title={hasIdCopied ? "Copied!" : "Copy ID"}
                        />
                      </HStack>
                    </HStack>

                    {/* Key Metrics Row */}
                    <HStack spacing={6} wrap="wrap">
                      <VStack spacing={0} align="start">
                        <Text
                          fontSize="xs"
                          color={textSecondary}
                          fontWeight="500"
                          textTransform="uppercase"
                        >
                          Final Price
                        </Text>
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={primaryBlue}
                        >
                          €{product.final_price_gross}
                        </Text>
                      </VStack>

                      <VStack spacing={0} align="start">
                        <Text
                          fontSize="xs"
                          color={textSecondary}
                          fontWeight="500"
                          textTransform="uppercase"
                        >
                          Stock Status
                        </Text>
                        <HStack spacing={1}>
                          <Icon
                            as={
                              product.is_available_on_stock
                                ? FiCheckCircle
                                : FiXCircle
                            }
                            color={
                              product.is_available_on_stock
                                ? "green.500"
                                : "red.500"
                            }
                            fontSize="sm"
                          />
                          <Text fontSize="sm" fontWeight="medium">
                            {product.is_available_on_stock
                              ? "In Stock"
                              : "Out of Stock"}
                          </Text>
                        </HStack>
                      </VStack>

                      <VStack spacing={0} align="start">
                        <Text
                          fontSize="xs"
                          color={textSecondary}
                          fontWeight="500"
                          textTransform="uppercase"
                        >
                          Categories
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {product.categories_summary?.total_categories || 0}{" "}
                          assigned
                        </Text>
                      </VStack>

                      <VStack spacing={0} align="start">
                        <Text
                          fontSize="xs"
                          color={textSecondary}
                          fontWeight="500"
                          textTransform="uppercase"
                        >
                          Last Updated
                        </Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {formatWithTimezone(
                            product.updated_at,
                            formatOptions.RELATIVE_TIME,
                            currentTimezone
                          )}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  {/* Feature Badges */}
                  <Wrap spacing={2}>
                    {product.mark_as_featured && (
                      <Badge
                        colorScheme="purple"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                      >
                        <Icon as={FiAward} mr={1} fontSize="xs" />
                        Featured
                      </Badge>
                    )}
                    {product.mark_as_new && (
                      <Badge
                        colorScheme="orange"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                      >
                        <Icon as={FiZap} mr={1} fontSize="xs" />
                        New
                      </Badge>
                    )}
                    {product.mark_as_top_seller && (
                      <Badge
                        colorScheme="red"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                      >
                        <Icon as={FiStar} mr={1} fontSize="xs" />
                        Bestseller
                      </Badge>
                    )}
                    {product.shipping_free && (
                      <Badge
                        colorScheme="green"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                      >
                        <Icon as={FiTruck} mr={1} fontSize="xs" />
                        Free Shipping
                      </Badge>
                    )}
                    {product.has_services && (
                      <Badge
                        colorScheme="blue"
                        variant="subtle"
                        borderRadius="full"
                        px={2}
                      >
                        <Icon as={FiTool} mr={1} fontSize="xs" />
                        Services
                      </Badge>
                    )}
                  </Wrap>
                </VStack>

                {/* Quick Actions Panel */}
                <VStack spacing={3} align="stretch" minW="200px">
                  <Button
                    leftIcon={<FiEdit />}
                    colorScheme="blue"
                    size="sm"
                    onClick={() =>
                      navigate(`/products-console/${productId}/edit`)
                    }
                  >
                    Edit Product
                  </Button>

                  <HStack spacing={2}>
                    <Button
                      leftIcon={<FiCopy />}
                      variant="outline"
                      size="sm"
                      flex={1}
                      onClick={handleDuplicateProduct}
                      isLoading={duplicating}
                      loadingText="Duplicating..."
                    >
                      Clone
                    </Button>
                  </HStack>
                </VStack>
              </Grid>
            </Box>

            {/* Main Content Area with Salesforce Tabs */}
            <Box
              bg={bgColor}
              minH="calc(100vh - 200px)"
              display={{ base: "none", md: "block" }}
            >
              <Tabs
                variant="enclosed"
                colorScheme="blue"
                index={activeTab}
                onChange={setActiveTab}
                bg={surfaceColor}
                borderBottom="1px solid"
                borderColor={borderColor}
              >
                <TabList px={6} bg={surfaceColor}>
                  <Tab
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                    py={4}
                  >
                    <Icon as={FiInfo} mr={2} />
                    Details
                  </Tab>
                  <Tab
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                    py={4}
                  >
                    <Icon as={FiDollarSign} mr={2} />
                    Pricing
                  </Tab>
                  <Tab
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                    py={4}
                  >
                    <Icon as={FiTag} mr={2} />
                    Categories
                  </Tab>
                  <Tab
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                    py={4}
                  >
                    <Icon as={FiSettings} mr={2} />
                    Options
                  </Tab>
                  <Tab
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                    py={4}
                  >
                    <Icon as={FiTool} mr={2} />
                    Services
                  </Tab>
                </TabList>

                <TabPanels bg={bgColor}>
                  {/* Details Tab */}
                  <TabPanel p={6}>
                    <Grid
                      templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
                      gap={6}
                    >
                      <VStack spacing={6} align="stretch">
                        {/* Product Information Card */}
                        <SalesforceCard
                          title="Product Information"
                          icon={FiInfo}
                        >
                          <VStack spacing={4} align="stretch">
                            <Box
                              dangerouslySetInnerHTML={{
                                __html: product.description,
                              }}
                              sx={{
                                "& p": { mb: 4 },
                                "& br": { mb: 2 },
                                "& strong": { fontWeight: "bold" },
                                "& em": { fontStyle: "italic" },
                                lineHeight: 1.6,
                                color: textPrimary,
                              }}
                            />
                            {product.short_description && (
                              <Box>
                                <Text
                                  fontSize="sm"
                                  color={textSecondary}
                                  fontWeight="500"
                                  mb={2}
                                >
                                  Short Description
                                </Text>
                                <Text color={textPrimary}>
                                  {product.short_description}
                                </Text>
                              </Box>
                            )}
                          </VStack>
                        </SalesforceCard>

                        {/* Technical Specifications */}
                        <SalesforceCard
                          title="Technical Specifications"
                          icon={FiPackage}
                        >
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <VStack spacing={4} align="stretch">
                              <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={textPrimary}
                                mb={2}
                              >
                                Physical Properties
                              </Text>
                              <SpecificationItem
                                label="Weight"
                                value={`${product.weight} ${product.weight_unit}`}
                              />
                              <SpecificationItem
                                label="Dimensions"
                                value={`${product.width}×${product.height}×${product.length} ${product.measures_unit}`}
                              />
                              {product.thickness && (
                                <SpecificationItem
                                  label="Thickness"
                                  value={`${product.thickness} ${product.measures_unit}`}
                                />
                              )}
                              <SpecificationItem
                                label="Unit Type"
                                value={product.unit_type}
                              />
                              <SpecificationItem
                                label="Lead Time"
                                value={`${product.lead_time} days`}
                              />
                            </VStack>

                            <VStack spacing={4} align="stretch">
                              <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={textPrimary}
                                mb={2}
                              >
                                Product Codes
                              </Text>
                              <SpecificationItem
                                label="SKU"
                                value={product.sku}
                                isMono
                              />
                              <SpecificationItem
                                label="Barcode"
                                value={product.barcode}
                                isMono
                              />
                              {product.ean && (
                                <SpecificationItem
                                  label="EAN"
                                  value={product.ean}
                                  isMono
                                />
                              )}
                              <SpecificationItem
                                label="Status"
                                value={product.status}
                              />
                            </VStack>
                          </SimpleGrid>
                        </SalesforceCard>

                        {/* Custom Details */}
                        {product.custom_details?.length > 0 && (
                          <SalesforceCard
                            title="Custom Details"
                            icon={FiLayers}
                          >
                            <SimpleGrid
                              columns={{ base: 2, md: 3 }}
                              spacing={4}
                            >
                              {product.custom_details.map((detail, index) => (
                                <SpecificationItem
                                  key={index}
                                  label={detail.label}
                                  value={detail.value}
                                />
                              ))}
                            </SimpleGrid>
                          </SalesforceCard>
                        )}
                      </VStack>

                      {/* Sidebar */}
                      <VStack spacing={6} align="stretch">
                        {/* Status Controls */}
                        <SalesforceCard title="Product Status" icon={FiShield}>
                          <VStack spacing={4} align="stretch">
                            <StatusControl
                              label="Active"
                              description="Product is active in the system"
                              value={product.is_active}
                              onChange={(value) =>
                                handleStatusToggle("is_active", value)
                              }
                              isLoading={updatingStatus}
                            />
                            <StatusControl
                              label="Published"
                              description="Visible to customers"
                              value={product.is_published}
                              onChange={(value) =>
                                handleStatusToggle("is_published", value)
                              }
                              isLoading={updatingStatus}
                            />
                            <StatusControl
                              label="In Stock"
                              description="Available for purchase"
                              value={product.is_available_on_stock}
                              onChange={(value) =>
                                handleStatusToggle(
                                  "is_available_on_stock",
                                  value
                                )
                              }
                              isLoading={updatingStatus}
                            />
                          </VStack>
                        </SalesforceCard>

                        {/* Company Information */}
                        <SalesforceCard
                          title="Company Information"
                          icon={FiUsers}
                        >
                          <VStack spacing={4} align="stretch">
                            <CompanyInfoItem
                              title="Owner"
                              company={product.company}
                              icon={FiShield}
                            />
                            {product.supplier && (
                              <CompanyInfoItem
                                title="Supplier"
                                company={product.supplier}
                                icon={FiTruck}
                              />
                            )}
                          </VStack>
                        </SalesforceCard>

                        {/* System Information */}
                        <SalesforceCard
                          title="System Information"
                          icon={FiDatabase}
                        >
                          <VStack spacing={3} align="stretch">
                            <SpecificationItem
                              label="Created"
                              value={formatWithTimezone(
                                product.created_at,
                                formatOptions.FULL_DATE_TIME,
                                currentTimezone
                              )}
                            />
                            <SpecificationItem
                              label="Last Updated"
                              value={formatWithTimezone(
                                product.updated_at,
                                formatOptions.FULL_DATE_TIME,
                                currentTimezone
                              )}
                            />
                            <SpecificationItem
                              label="Tax Rate"
                              value={`${product.tax?.name} (${product.tax?.rate}%)`}
                            />
                          </VStack>
                        </SalesforceCard>
                      </VStack>
                    </Grid>
                  </TabPanel>

                  {/* Pricing Tab */}
                  <TabPanel p={6}>
                    <Grid
                      templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
                      gap={6}
                    >
                      <VStack spacing={6} align="stretch">
                        <SalesforceCard
                          title="Pricing Breakdown"
                          icon={FiDollarSign}
                        >
                          <VStack spacing={6} align="stretch">
                            {/* Pricing Table */}
                            <TableContainer>
                              <Table variant="simple">
                                <Thead>
                                  <Tr>
                                    <Th color={textSecondary} fontSize="xs">
                                      Price Type
                                    </Th>
                                    <Th
                                      color={textSecondary}
                                      fontSize="xs"
                                      isNumeric
                                    >
                                      Net Amount
                                    </Th>
                                    <Th
                                      color={textSecondary}
                                      fontSize="xs"
                                      isNumeric
                                    >
                                      Gross Amount
                                    </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td fontWeight="medium">Purchase Price</Td>
                                    <Td isNumeric fontFamily="mono">
                                      €{product.purchase_price_nett}
                                    </Td>
                                    <Td isNumeric fontFamily="mono">
                                      €{product.purchase_price_gross}
                                    </Td>
                                  </Tr>
                                  <Tr>
                                    <Td fontWeight="medium">Regular Price</Td>
                                    <Td isNumeric fontFamily="mono">
                                      €{product.regular_price_nett}
                                    </Td>
                                    <Td isNumeric fontFamily="mono">
                                      €{product.regular_price_gross}
                                    </Td>
                                  </Tr>
                                  <Tr
                                    bg={
                                      product.is_discounted
                                        ? "green.50"
                                        : "transparent"
                                    }
                                  >
                                    <Td fontWeight="bold">Final Price</Td>
                                    <Td
                                      isNumeric
                                      fontFamily="mono"
                                      fontWeight="bold"
                                      color="green.600"
                                    >
                                      €{product.final_price_nett}
                                    </Td>
                                    <Td
                                      isNumeric
                                      fontFamily="mono"
                                      fontWeight="bold"
                                      color="green.600"
                                    >
                                      €{product.final_price_gross}
                                    </Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </TableContainer>

                            {product.is_discounted && (
                              <Box
                                bg="red.50"
                                p={4}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="red.200"
                              >
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={0}>
                                    <Text
                                      fontSize="sm"
                                      color="red.700"
                                      fontWeight="500"
                                    >
                                      Discount Applied
                                    </Text>
                                    <Text fontSize="xs" color="red.600">
                                      {product.discount_percentage_nett}% off
                                      regular price
                                    </Text>
                                  </VStack>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="red.600"
                                  >
                                    €
                                    {product.calculated_prices?.savings_nett ||
                                      0}{" "}
                                    saved
                                  </Text>
                                </HStack>
                              </Box>
                            )}
                          </VStack>
                        </SalesforceCard>
                      </VStack>

                      <VStack spacing={6} align="stretch">
                        <SalesforceCard title="Pricing Summary" icon={FiBox}>
                          <VStack spacing={4} align="stretch">
                            <Box
                              bg="blue.50"
                              p={4}
                              borderRadius="lg"
                              textAlign="center"
                            >
                              <Text
                                fontSize="xs"
                                color="blue.600"
                                fontWeight="500"
                                textTransform="uppercase"
                              >
                                Customer Price
                              </Text>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="blue.600"
                              >
                                €{product.final_price_gross}
                              </Text>
                              <Text fontSize="xs" color="blue.500">
                                Including {product.tax?.rate}% VAT
                              </Text>
                            </Box>

                            <SimpleGrid columns={2} spacing={4}>
                              <Box textAlign="center">
                                <Text
                                  fontSize="xs"
                                  color={textSecondary}
                                  textTransform="uppercase"
                                >
                                  Margin
                                </Text>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="green.500"
                                >
                                  {(
                                    ((product.final_price_nett -
                                      product.purchase_price_nett) /
                                      product.purchase_price_nett) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </Text>
                              </Box>
                              <Box textAlign="center">
                                <Text
                                  fontSize="xs"
                                  color={textSecondary}
                                  textTransform="uppercase"
                                >
                                  Profit
                                </Text>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="green.500"
                                >
                                  €
                                  {(
                                    product.final_price_nett -
                                    product.purchase_price_nett
                                  ).toFixed(2)}
                                </Text>
                              </Box>
                            </SimpleGrid>
                          </VStack>
                        </SalesforceCard>
                      </VStack>
                    </Grid>
                  </TabPanel>

                  {/* Categories Tab */}
                  <TabPanel p={6}>
                    <SalesforceCard title="Product Categories" icon={FiTag}>
                      {product.categories?.length > 0 ? (
                        <SimpleGrid
                          columns={{ base: 1, md: 2, lg: 3 }}
                          spacing={4}
                        >
                          {product.categories.map((category) => (
                            <Box
                              key={category.id}
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor={
                                category.product_category_info?.is_primary
                                  ? primaryBlue
                                  : borderColor
                              }
                              bg={
                                category.product_category_info?.is_primary
                                  ? "blue.50"
                                  : surfaceColor
                              }
                              position="relative"
                            >
                              <VStack align="start" spacing={3}>
                                <HStack justify="space-between" width="100%">
                                  <Text fontWeight="bold" color={textPrimary}>
                                    {category.name}
                                  </Text>
                                  {category.product_category_info
                                    ?.is_primary && (
                                    <Badge colorScheme="blue" size="sm">
                                      Primary
                                    </Badge>
                                  )}
                                </HStack>
                                {category.description && (
                                  <Text fontSize="sm" color={textSecondary}>
                                    {category.description}
                                  </Text>
                                )}
                                {category.image_url && (
                                  <Image
                                    src={category.image_url}
                                    alt={category.name}
                                    boxSize="40px"
                                    objectFit="cover"
                                    borderRadius="md"
                                  />
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <EmptyState
                          icon={FiTag}
                          title="No Categories Assigned"
                          description="This product hasn't been assigned to any categories yet."
                        />
                      )}
                    </SalesforceCard>
                  </TabPanel>

                  {/* Options Tab */}
                  <TabPanel p={6}>
                    <SalesforceCard
                      title="Custom Product Options"
                      icon={FiSettings}
                    >
                      {product.custom_options?.length > 0 ? (
                        <VStack spacing={6} align="stretch">
                          {product.custom_options.map((option) => (
                            <Box
                              key={option.id}
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor={borderColor}
                              bg={surfaceColor}
                            >
                              <VStack align="stretch" spacing={4}>
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={0}>
                                    <Text
                                      fontWeight="bold"
                                      fontSize="lg"
                                      color={textPrimary}
                                    >
                                      {option.option_name}
                                    </Text>
                                    <HStack spacing={2}>
                                      <Badge
                                        colorScheme="purple"
                                        variant="outline"
                                      >
                                        {option.option_type}
                                      </Badge>
                                      {option.is_required && (
                                        <Badge
                                          colorScheme="red"
                                          variant="solid"
                                          size="sm"
                                        >
                                          Required
                                        </Badge>
                                      )}
                                      {option.affects_price && (
                                        <Badge
                                          colorScheme="green"
                                          variant="solid"
                                          size="sm"
                                        >
                                          Affects Price
                                        </Badge>
                                      )}
                                    </HStack>
                                  </VStack>
                                </HStack>

                                {option.help_text && (
                                  <Text fontSize="sm" color={textSecondary}>
                                    {option.help_text}
                                  </Text>
                                )}

                                {option.option_values?.length > 0 && (
                                  <Box>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="medium"
                                      color={textPrimary}
                                      mb={3}
                                    >
                                      Available Values:
                                    </Text>
                                    <SimpleGrid
                                      columns={{ base: 2, md: 3, lg: 4 }}
                                      spacing={3}
                                    >
                                      {option.option_values.map(
                                        (value, index) => (
                                          <Box
                                            key={index}
                                            p={3}
                                            bg={
                                              value.is_default
                                                ? "blue.50"
                                                : "gray.50"
                                            }
                                            border="1px solid"
                                            borderColor={
                                              value.is_default
                                                ? "blue.200"
                                                : "gray.200"
                                            }
                                            borderRadius="md"
                                            position="relative"
                                          >
                                            <VStack spacing={2} align="center">
                                              <Text
                                                fontWeight={
                                                  value.is_default
                                                    ? "bold"
                                                    : "normal"
                                                }
                                                fontSize="sm"
                                                textAlign="center"
                                              >
                                                {value.option_value}
                                              </Text>
                                              {value.price_modifier > 0 && (
                                                <Text
                                                  fontSize="xs"
                                                  color="green.600"
                                                  fontWeight="medium"
                                                >
                                                  +€{value.price_modifier}
                                                </Text>
                                              )}
                                            </VStack>
                                            {value.is_default && (
                                              <Badge
                                                position="absolute"
                                                top="-5px"
                                                right="-5px"
                                                size="xs"
                                                colorScheme="blue"
                                                borderRadius="full"
                                              >
                                                Default
                                              </Badge>
                                            )}
                                          </Box>
                                        )
                                      )}
                                    </SimpleGrid>
                                  </Box>
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <EmptyState
                          icon={FiSettings}
                          title="No Custom Options"
                          description="This product doesn't have any custom options configured."
                        />
                      )}
                    </SalesforceCard>
                  </TabPanel>

                  {/* Services Tab */}
                  <TabPanel p={6}>
                    <SalesforceCard title="Product Services" icon={FiTool}>
                      {product.product_services?.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {product.product_services.map((service) => (
                            <Box
                              key={service.id}
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor={borderColor}
                              bg={surfaceColor}
                            >
                              <HStack justify="space-between">
                                <VStack align="start" spacing={2}>
                                  <HStack>
                                    <Text fontWeight="bold" color={textPrimary}>
                                      {service.title}
                                    </Text>
                                    <Badge
                                      colorScheme={
                                        service.is_required ? "red" : "gray"
                                      }
                                      variant="solid"
                                      size="sm"
                                    >
                                      {service.is_required
                                        ? "Required"
                                        : "Optional"}
                                    </Badge>
                                    <Badge
                                      colorScheme="blue"
                                      variant="outline"
                                      size="sm"
                                    >
                                      {service.service_type}
                                    </Badge>
                                  </HStack>
                                  {service.description && (
                                    <Text fontSize="sm" color={textSecondary}>
                                      {service.description}
                                    </Text>
                                  )}
                                  {service.company && (
                                    <HStack spacing={2}>
                                      <Text fontSize="xs" color={textSecondary}>
                                        Provided by:
                                      </Text>
                                      <Text fontSize="xs" fontWeight="medium">
                                        {service.company.business_name}
                                      </Text>
                                    </HStack>
                                  )}
                                </VStack>
                                <VStack align="end" spacing={1}>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="green.600"
                                  >
                                    €{service.price}
                                  </Text>
                                  <Text fontSize="xs" color={textSecondary}>
                                    Per service
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <EmptyState
                          icon={FiTool}
                          title="No Services Available"
                          description="This product doesn't have any additional services."
                        />
                      )}
                    </SalesforceCard>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            {/* Main Content Area */}
            <Box
              bg={bgColor}
              minH="calc(100vh - 200px)"
              display={{ base: "flex", md: "none" }}
            >
              <Tabs
                variant="enclosed"
                colorScheme="blue"
                index={activeTab}
                onChange={setActiveTab}
                bg={surfaceColor}
                borderBottom="1px solid"
                borderColor={borderColor}
              >
                <TabList
                  px={2}
                  bg={surfaceColor}
                  overflowX="auto"
                  whiteSpace="nowrap"
                  width="100%"
                  maxWidth="100vw"
                  sx={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#0176d3 #e5e5e5",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <Tab
                    minW="120px"
                    maxW="100%"
                    py={4}
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                  >
                    <Icon as={FiInfo} mr={2} />
                    Details
                  </Tab>
                  <Tab
                    minW="120px"
                    maxW="100%"
                    py={4}
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                  >
                    <Icon as={FiDollarSign} mr={2} />
                    Pricing
                  </Tab>
                  <Tab
                    minW="120px"
                    maxW="100%"
                    py={4}
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                  >
                    <Icon as={FiTag} mr={2} />
                    Categories
                  </Tab>
                  <Tab
                    minW="120px"
                    maxW="100%"
                    py={4}
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                  >
                    <Icon as={FiSettings} mr={2} />
                    Options
                  </Tab>
                  <Tab
                    minW="120px"
                    maxW="100%"
                    py={4}
                    _selected={{
                      bg: bgColor,
                      borderColor: borderColor,
                      borderBottomColor: bgColor,
                      color: primaryBlue,
                      fontWeight: "600",
                    }}
                    _hover={{ color: primaryBlue }}
                  >
                    <Icon as={FiTool} mr={2} />
                    Services
                  </Tab>
                </TabList>

                <TabPanels bg={bgColor}>
                  {/* Details Tab */}
                  <TabPanel p={6}>
                    <Grid
                      templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
                      gap={6}
                    >
                      <VStack spacing={6} align="stretch">
                        {/* Product Information Card */}
                        <SalesforceCard
                          title="Product Information"
                          icon={FiInfo}
                        >
                          <VStack spacing={4} align="stretch">
                            <Box
                              dangerouslySetInnerHTML={{
                                __html: product.description,
                              }}
                              sx={{
                                "& p": { mb: 4 },
                                "& br": { mb: 2 },
                                "& strong": { fontWeight: "bold" },
                                "& em": { fontStyle: "italic" },
                                lineHeight: 1.6,
                                color: textPrimary,
                              }}
                            />
                            {product.short_description && (
                              <Box>
                                <Text
                                  fontSize="sm"
                                  color={textSecondary}
                                  fontWeight="500"
                                  mb={2}
                                >
                                  Short Description
                                </Text>
                                <Text color={textPrimary}>
                                  {product.short_description}
                                </Text>
                              </Box>
                            )}
                          </VStack>
                        </SalesforceCard>

                        {/* Technical Specifications */}
                        <SalesforceCard
                          title="Technical Specifications"
                          icon={FiPackage}
                        >
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <VStack spacing={4} align="stretch">
                              <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={textPrimary}
                                mb={2}
                              >
                                Physical Properties
                              </Text>
                              <SpecificationItem
                                label="Weight"
                                value={`${product.weight} ${product.weight_unit}`}
                              />
                              <SpecificationItem
                                label="Dimensions"
                                value={`${product.width}×${product.height}×${product.length} ${product.measures_unit}`}
                              />
                              {product.thickness && (
                                <SpecificationItem
                                  label="Thickness"
                                  value={`${product.thickness} ${product.measures_unit}`}
                                />
                              )}
                              <SpecificationItem
                                label="Unit Type"
                                value={product.unit_type}
                              />
                              <SpecificationItem
                                label="Lead Time"
                                value={`${product.lead_time} days`}
                              />
                            </VStack>

                            <VStack spacing={4} align="stretch">
                              <Text
                                fontSize="sm"
                                fontWeight="600"
                                color={textPrimary}
                                mb={2}
                              >
                                Product Codes
                              </Text>
                              <SpecificationItem
                                label="SKU"
                                value={product.sku}
                                isMono
                              />
                              <SpecificationItem
                                label="Barcode"
                                value={product.barcode}
                                isMono
                              />
                              {product.ean && (
                                <SpecificationItem
                                  label="EAN"
                                  value={product.ean}
                                  isMono
                                />
                              )}
                              <SpecificationItem
                                label="Status"
                                value={product.status}
                              />
                            </VStack>
                          </SimpleGrid>
                        </SalesforceCard>

                        {/* Custom Details */}
                        {product.custom_details?.length > 0 && (
                          <SalesforceCard
                            title="Custom Details"
                            icon={FiLayers}
                          >
                            <SimpleGrid
                              columns={{ base: 2, md: 3 }}
                              spacing={4}
                            >
                              {product.custom_details.map((detail, index) => (
                                <SpecificationItem
                                  key={index}
                                  label={detail.label}
                                  value={detail.value}
                                />
                              ))}
                            </SimpleGrid>
                          </SalesforceCard>
                        )}
                      </VStack>

                      {/* Sidebar */}
                      <VStack spacing={6} align="stretch">
                        {/* Status Controls */}
                        <SalesforceCard title="Product Status" icon={FiShield}>
                          <VStack spacing={4} align="stretch">
                            <StatusControl
                              label="Active"
                              description="Product is active in the system"
                              value={product.is_active}
                              onChange={(value) =>
                                handleStatusToggle("is_active", value)
                              }
                              isLoading={updatingStatus}
                            />
                            <StatusControl
                              label="Published"
                              description="Visible to customers"
                              value={product.is_published}
                              onChange={(value) =>
                                handleStatusToggle("is_published", value)
                              }
                              isLoading={updatingStatus}
                            />
                            <StatusControl
                              label="In Stock"
                              description="Available for purchase"
                              value={product.is_available_on_stock}
                              onChange={(value) =>
                                handleStatusToggle(
                                  "is_available_on_stock",
                                  value
                                )
                              }
                              isLoading={updatingStatus}
                            />
                          </VStack>
                        </SalesforceCard>

                        {/* Company Information */}
                        <SalesforceCard
                          title="Company Information"
                          icon={FiUsers}
                        >
                          <VStack spacing={4} align="stretch">
                            <CompanyInfoItem
                              title="Owner"
                              company={product.company}
                              icon={FiShield}
                            />
                            {product.supplier && (
                              <CompanyInfoItem
                                title="Supplier"
                                company={product.supplier}
                                icon={FiTruck}
                              />
                            )}
                          </VStack>
                        </SalesforceCard>

                        {/* System Information */}
                        <SalesforceCard
                          title="System Information"
                          icon={FiDatabase}
                        >
                          <VStack spacing={3} align="stretch">
                            <SpecificationItem
                              label="Created"
                              value={formatWithTimezone(
                                product.created_at,
                                formatOptions.FULL_DATE_TIME,
                                currentTimezone
                              )}
                            />
                            <SpecificationItem
                              label="Last Updated"
                              value={formatWithTimezone(
                                product.updated_at,
                                formatOptions.FULL_DATE_TIME,
                                currentTimezone
                              )}
                            />
                            <SpecificationItem
                              label="Tax Rate"
                              value={`${product.tax?.name} (${product.tax?.rate}%)`}
                            />
                          </VStack>
                        </SalesforceCard>
                      </VStack>
                    </Grid>
                  </TabPanel>

                  {/* Pricing Tab */}
                  <TabPanel p={6}>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <VStack spacing={6} align="stretch">
                        <SalesforceCard
                          title="Pricing Breakdown"
                          icon={FiDollarSign}
                        >
                          <VStack spacing={6} align="stretch">
                            {/* Responsive Pricing Table */}
                            <Box
                              overflowX="auto"
                              maxWidth={{ base: "100%", md: "unset" }}
                              width={{ base: "100%", md: "unset" }}
                              sx={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "#0176d3 #e5e5e5",
                                WebkitOverflowScrolling: "touch",
                              }}
                            >
                              <TableContainer
                                minW={{ base: "400px", md: "500px" }}
                                width="100%"
                              >
                                <Table variant="simple">
                                  <Thead>
                                    <Tr>
                                      <Th color={textSecondary} fontSize="xs">
                                        Price Type
                                      </Th>
                                      <Th
                                        color={textSecondary}
                                        fontSize="xs"
                                        isNumeric
                                      >
                                        Net Amount
                                      </Th>
                                      <Th
                                        color={textSecondary}
                                        fontSize="xs"
                                        isNumeric
                                      >
                                        Gross Amount
                                      </Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    <Tr>
                                      <Td fontWeight="medium">
                                        Purchase Price
                                      </Td>
                                      <Td isNumeric fontFamily="mono">
                                        €{product.purchase_price_nett}
                                      </Td>
                                      <Td isNumeric fontFamily="mono">
                                        €{product.purchase_price_gross}
                                      </Td>
                                    </Tr>
                                    <Tr>
                                      <Td fontWeight="medium">Regular Price</Td>
                                      <Td isNumeric fontFamily="mono">
                                        €{product.regular_price_nett}
                                      </Td>
                                      <Td isNumeric fontFamily="mono">
                                        €{product.regular_price_gross}
                                      </Td>
                                    </Tr>
                                    <Tr
                                      bg={
                                        product.is_discounted
                                          ? "green.50"
                                          : "transparent"
                                      }
                                    >
                                      <Td fontWeight="bold">Final Price</Td>
                                      <Td
                                        isNumeric
                                        fontFamily="mono"
                                        fontWeight="bold"
                                        color="green.600"
                                      >
                                        €{product.final_price_nett}
                                      </Td>
                                      <Td
                                        isNumeric
                                        fontFamily="mono"
                                        fontWeight="bold"
                                        color="green.600"
                                      >
                                        €{product.final_price_gross}
                                      </Td>
                                    </Tr>
                                  </Tbody>
                                </Table>
                              </TableContainer>
                            </Box>

                            {product.is_discounted && (
                              <Box
                                bg="red.50"
                                p={4}
                                borderRadius="lg"
                                border="1px solid"
                                borderColor="red.200"
                                maxWidth="100vw"
                                width="100%"
                              >
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={0}>
                                    <Text
                                      fontSize="sm"
                                      color="red.700"
                                      fontWeight="500"
                                    >
                                      Discount Applied
                                    </Text>
                                    <Text fontSize="xs" color="red.600">
                                      {product.discount_percentage_nett}% off
                                      regular price
                                    </Text>
                                  </VStack>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="red.600"
                                  >
                                    €
                                    {product.calculated_prices?.savings_nett ||
                                      0}{" "}
                                    saved
                                  </Text>
                                </HStack>
                              </Box>
                            )}
                          </VStack>
                        </SalesforceCard>
                      </VStack>

                      <VStack spacing={6} align="stretch">
                        <SalesforceCard title="Pricing Summary" icon={FiBox}>
                          <VStack spacing={4} align="stretch">
                            <Box
                              bg="blue.50"
                              p={4}
                              borderRadius="lg"
                              textAlign="center"
                              maxWidth="100vw"
                              width="100%"
                            >
                              <Text
                                fontSize="xs"
                                color="blue.600"
                                fontWeight="500"
                                textTransform="uppercase"
                              >
                                Customer Price
                              </Text>
                              <Text
                                fontSize="2xl"
                                fontWeight="bold"
                                color="blue.600"
                              >
                                €{product.final_price_gross}
                              </Text>
                              <Text fontSize="xs" color="blue.500">
                                Including {product.tax?.rate}% VAT
                              </Text>
                            </Box>

                            <SimpleGrid
                              columns={2}
                              spacing={4}
                              maxWidth="100vw"
                              width="100%"
                            >
                              <Box textAlign="center">
                                <Text
                                  fontSize="xs"
                                  color={textSecondary}
                                  textTransform="uppercase"
                                >
                                  Margin
                                </Text>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="green.500"
                                >
                                  {(
                                    ((product.final_price_nett -
                                      product.purchase_price_nett) /
                                      product.purchase_price_nett) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </Text>
                              </Box>
                              <Box textAlign="center">
                                <Text
                                  fontSize="xs"
                                  color={textSecondary}
                                  textTransform="uppercase"
                                >
                                  Profit
                                </Text>
                                <Text
                                  fontSize="lg"
                                  fontWeight="bold"
                                  color="green.500"
                                >
                                  €
                                  {(
                                    product.final_price_nett -
                                    product.purchase_price_nett
                                  ).toFixed(2)}
                                </Text>
                              </Box>
                            </SimpleGrid>
                          </VStack>
                        </SalesforceCard>
                      </VStack>
                    </SimpleGrid>
                  </TabPanel>

                  {/* Categories Tab */}
                  <TabPanel p={6}>
                    <SalesforceCard title="Product Categories" icon={FiTag}>
                      {product.categories?.length > 0 ? (
                        <SimpleGrid
                          columns={{ base: 1, md: 2, lg: 3 }}
                          spacing={4}
                        >
                          {product.categories.map((category) => (
                            <Box
                              key={category.id}
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor={
                                category.product_category_info?.is_primary
                                  ? primaryBlue
                                  : borderColor
                              }
                              bg={
                                category.product_category_info?.is_primary
                                  ? "blue.50"
                                  : surfaceColor
                              }
                              position="relative"
                            >
                              <VStack align="start" spacing={3}>
                                <HStack justify="space-between" width="100%">
                                  <Text fontWeight="bold" color={textPrimary}>
                                    {category.name}
                                  </Text>
                                  {category.product_category_info
                                    ?.is_primary && (
                                    <Badge colorScheme="blue" size="sm">
                                      Primary
                                    </Badge>
                                  )}
                                </HStack>
                                {category.description && (
                                  <Text fontSize="sm" color={textSecondary}>
                                    {category.description}
                                  </Text>
                                )}
                                {category.image_url && (
                                  <Image
                                    src={category.image_url}
                                    alt={category.name}
                                    boxSize="40px"
                                    objectFit="cover"
                                    borderRadius="md"
                                  />
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      ) : (
                        <EmptyState
                          icon={FiTag}
                          title="No Categories Assigned"
                          description="This product hasn't been assigned to any categories yet."
                        />
                      )}
                    </SalesforceCard>
                  </TabPanel>

                  {/* Options Tab */}
                  <TabPanel p={6}>
                    <SalesforceCard
                      title="Custom Product Options"
                      icon={FiSettings}
                    >
                      {product.custom_options?.length > 0 ? (
                        <VStack spacing={6} align="stretch">
                          {product.custom_options.map((option) => (
                            <Box
                              key={option.id}
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor={borderColor}
                              bg={surfaceColor}
                            >
                              <VStack align="stretch" spacing={4}>
                                <HStack justify="space-between">
                                  <VStack align="start" spacing={0}>
                                    <Text
                                      fontWeight="bold"
                                      fontSize="lg"
                                      color={textPrimary}
                                    >
                                      {option.option_name}
                                    </Text>
                                    <HStack spacing={2}>
                                      <Badge
                                        colorScheme="purple"
                                        variant="outline"
                                      >
                                        {option.option_type}
                                      </Badge>
                                      {option.is_required && (
                                        <Badge
                                          colorScheme="red"
                                          variant="solid"
                                          size="sm"
                                        >
                                          Required
                                        </Badge>
                                      )}
                                      {option.affects_price && (
                                        <Badge
                                          colorScheme="green"
                                          variant="solid"
                                          size="sm"
                                        >
                                          Affects Price
                                        </Badge>
                                      )}
                                    </HStack>
                                  </VStack>
                                </HStack>

                                {option.help_text && (
                                  <Text fontSize="sm" color={textSecondary}>
                                    {option.help_text}
                                  </Text>
                                )}

                                {option.option_values?.length > 0 && (
                                  <Box>
                                    <Text
                                      fontSize="sm"
                                      fontWeight="medium"
                                      color={textPrimary}
                                      mb={3}
                                    >
                                      Available Values:
                                    </Text>
                                    <SimpleGrid
                                      columns={{ base: 2, md: 3, lg: 4 }}
                                      spacing={3}
                                    >
                                      {option.option_values.map(
                                        (value, index) => (
                                          <Box
                                            key={index}
                                            p={3}
                                            bg={
                                              value.is_default
                                                ? "blue.50"
                                                : "gray.50"
                                            }
                                            border="1px solid"
                                            borderColor={
                                              value.is_default
                                                ? "blue.200"
                                                : "gray.200"
                                            }
                                            borderRadius="md"
                                            position="relative"
                                          >
                                            <VStack spacing={2} align="center">
                                              <Text
                                                fontWeight={
                                                  value.is_default
                                                    ? "bold"
                                                    : "normal"
                                                }
                                                fontSize="sm"
                                                textAlign="center"
                                              >
                                                {value.option_value}
                                              </Text>
                                              {value.price_modifier > 0 && (
                                                <Text
                                                  fontSize="xs"
                                                  color="green.600"
                                                  fontWeight="medium"
                                                >
                                                  +€{value.price_modifier}
                                                </Text>
                                              )}
                                            </VStack>
                                            {value.is_default && (
                                              <Badge
                                                position="absolute"
                                                top="-5px"
                                                right="-5px"
                                                size="xs"
                                                colorScheme="blue"
                                                borderRadius="full"
                                              >
                                                Default
                                              </Badge>
                                            )}
                                          </Box>
                                        )
                                      )}
                                    </SimpleGrid>
                                  </Box>
                                )}
                              </VStack>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <EmptyState
                          icon={FiSettings}
                          title="No Custom Options"
                          description="This product doesn't have any custom options configured."
                        />
                      )}
                    </SalesforceCard>
                  </TabPanel>

                  {/* Services Tab */}
                  <TabPanel p={6}>
                    <SalesforceCard title="Product Services" icon={FiTool}>
                      {product.product_services?.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {product.product_services.map((service) => (
                            <Box
                              key={service.id}
                              p={4}
                              borderRadius="lg"
                              border="1px solid"
                              borderColor={borderColor}
                              bg={surfaceColor}
                            >
                              <HStack justify="space-between">
                                <VStack align="start" spacing={2}>
                                  <HStack>
                                    <Text fontWeight="bold" color={textPrimary}>
                                      {service.title}
                                    </Text>
                                    <Badge
                                      colorScheme={
                                        service.is_required ? "red" : "gray"
                                      }
                                      variant="solid"
                                      size="sm"
                                    >
                                      {service.is_required
                                        ? "Required"
                                        : "Optional"}
                                    </Badge>
                                    <Badge
                                      colorScheme="blue"
                                      variant="outline"
                                      size="sm"
                                    >
                                      {service.service_type}
                                    </Badge>
                                  </HStack>
                                  {service.description && (
                                    <Text fontSize="sm" color={textSecondary}>
                                      {service.description}
                                    </Text>
                                  )}
                                  {service.company && (
                                    <HStack spacing={2}>
                                      <Text fontSize="xs" color={textSecondary}>
                                        Provided by:
                                      </Text>
                                      <Text fontSize="xs" fontWeight="medium">
                                        {service.company.business_name}
                                      </Text>
                                    </HStack>
                                  )}
                                </VStack>
                                <VStack align="end" spacing={1}>
                                  <Text
                                    fontSize="lg"
                                    fontWeight="bold"
                                    color="green.600"
                                  >
                                    €{service.price}
                                  </Text>
                                  <Text fontSize="xs" color={textSecondary}>
                                    Per service
                                  </Text>
                                </VStack>
                              </HStack>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <EmptyState
                          icon={FiTool}
                          title="No Services Available"
                          description="This product doesn't have any additional services."
                        />
                      )}
                    </SalesforceCard>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={onImageModalClose}
        size="6xl"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh">
          <ModalCloseButton color="white" size="lg" />
          <ModalBody p={0}>
            <Flex align="center" justify="center" h="90vh">
              {selectedImageIndex > 0 && (
                <IconButton
                  icon={<FiChevronLeft />}
                  position="absolute"
                  left={4}
                  top="50%"
                  transform="translateY(-50%)"
                  colorScheme="whiteAlpha"
                  color="white"
                  size="lg"
                  onClick={() => setSelectedImageIndex(selectedImageIndex - 1)}
                  zIndex={2}
                />
              )}

              <Image
                src={
                  product.images?.[selectedImageIndex]?.url ||
                  product.main_image_url
                }
                alt={
                  product.images?.[selectedImageIndex]?.alt_text ||
                  product.title
                }
                maxW="100%"
                maxH="100%"
                objectFit="contain"
              />

              {selectedImageIndex < product.images?.length - 1 && (
                <IconButton
                  icon={<FiChevronRight />}
                  position="absolute"
                  right={4}
                  top="50%"
                  transform="translateY(-50%)"
                  colorScheme="whiteAlpha"
                  color="white"
                  size="lg"
                  onClick={() => setSelectedImageIndex(selectedImageIndex + 1)}
                  zIndex={2}
                />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Salesforce-style Components
const SalesforceCard = ({ title, icon, children, rightAction }) => {
  const surfaceColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("#e5e5e5", "gray.600");
  const textPrimary = useColorModeValue("#080707", "white");

  return (
    <Box
      bg={surfaceColor}
      borderRadius="lg"
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
    >
      <Box px={4} py={3} borderBottom="1px solid" borderColor={borderColor}>
        <Flex justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={icon} color="#0176d3" fontSize="lg" />
            <Text fontWeight="600" color={textPrimary} fontSize="md">
              {title}
            </Text>
          </HStack>
          {rightAction}
        </Flex>
      </Box>
      <Box p={4}>{children}</Box>
    </Box>
  );
};

const StatusBadge = ({ product }) => {
  const getStatusConfig = () => {
    if (!product.is_active) return { label: "Inactive", color: "red" };
    if (product.is_published) return { label: "Published", color: "green" };
    return { label: "Draft", color: "orange" };
  };

  const config = getStatusConfig();

  return (
    <Badge
      colorScheme={config.color}
      variant="solid"
      borderRadius="full"
      px={3}
      py={1}
    >
      {config.label}
    </Badge>
  );
};

const SpecificationItem = ({ label, value, isMono = false }) => {
  const textSecondary = useColorModeValue("#706e6b", "gray.400");
  const textPrimary = useColorModeValue("#080707", "white");

  return (
    <HStack justify="space-between" align="start">
      <Text fontSize="sm" color={textSecondary} minW="80px">
        {label}:
      </Text>
      <Text
        fontSize="sm"
        color={textPrimary}
        fontWeight="medium"
        fontFamily={isMono ? "mono" : "inherit"}
        textAlign="right"
        flex={1}
      >
        {value}
      </Text>
    </HStack>
  );
};

const StatusControl = ({ label, description, value, onChange, isLoading }) => {
  const textSecondary = useColorModeValue("#706e6b", "gray.400");

  return (
    <FormControl
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <FormLabel mb={0} fontWeight="medium" fontSize="sm">
          {label}
        </FormLabel>
        <Text fontSize="xs" color={textSecondary}>
          {description}
        </Text>
      </Box>
      <Switch
        isChecked={value}
        onChange={(e) => onChange(e.target.checked)}
        colorScheme="blue"
        isDisabled={isLoading}
        size="md"
      />
    </FormControl>
  );
};

const CompanyInfoItem = ({ title, company, icon }) => {
  const textSecondary = useColorModeValue("#706e6b", "gray.400");
  const textPrimary = useColorModeValue("#080707", "white");

  return (
    <Box>
      <HStack mb={2}>
        <Icon as={icon} color={textSecondary} fontSize="sm" />
        <Text fontSize="sm" fontWeight="medium" color={textSecondary}>
          {title}
        </Text>
      </HStack>
      <HStack>
        {company.logo_url && (
          <Avatar
            src={company.logo_url}
            name={company.business_name}
            size="sm"
          />
        )}
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold" fontSize="sm" color={textPrimary}>
            {company.business_name}
          </Text>
          <Text fontSize="xs" color={textSecondary}>
            {company.market_name}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const EmptyState = ({ icon, title, description }) => {
  const textSecondary = useColorModeValue("#706e6b", "gray.400");

  return (
    <Center py={12}>
      <VStack spacing={4}>
        <Icon as={icon} fontSize="3xl" color={textSecondary} />
        <VStack spacing={2}>
          <Text fontWeight="medium" color={textSecondary}>
            {title}
          </Text>
          <Text fontSize="sm" color={textSecondary} textAlign="center">
            {description}
          </Text>
        </VStack>
      </VStack>
    </Center>
  );
};

export default ProductDetailsPage;
