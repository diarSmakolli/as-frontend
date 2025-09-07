import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  useToast,
  Avatar,
  Badge,
  Divider,
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Select,
  Skeleton,
  SkeletonText,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  GridItem,
  Center,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Checkbox,
  Image as ChakraImage,
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShoppingBag,
  FaBell,
  FaStar,
  FaEdit,
  FaCalendarAlt,
  FaPhone,
  FaHeart,
  FaEye,
  FaTicketAlt,
  FaCreditCard,
  FaUndo,
  FaComments,
  FaCog,
  FaUserFriends,
  FaQuestionCircle,
  FaFileInvoice,
  FaExclamationTriangle,
  FaShieldAlt,
  FaChevronRight,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaClipboardCheck,
  FaFilter,
  FaChevronLeft,
  FaChevronDown,
  FaChevronUp,
  FaTable,
  FaCalculator,
  FaCube,
  FaPalette,
  FaRuler,
  FaUniversity
} from "react-icons/fa";
import { GiBeachBag } from "react-icons/gi";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { GrLocation } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { GrOverview } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { useCustomerAuth } from "./auth-context/customerAuthContext";
import Navbar from "../../shared-customer/components/Navbar";
import { customToastContainerStyle } from "../../commons/toastStyles";
import Footer from "../../shared-customer/components/Footer";
import { customerAccountService } from "./customerAccountService";

export default function ProfileAccount() {
  const toast = useToast();
  const { customer, isLoading } = useCustomerAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm] = useState({
    customer_type: "",
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    business_name: "",
    business_registration_number: "",
    vat_number: "",
    business_type: "",
    business_phone: "",
    business_address: "",
    email: "",
    phone_primary: "",
    preferred_language: "fr",
    preferred_currency: "EUR",
  });
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    is_default: false,
  });
  const [addresses, setAddresses] = useState([]);
  const [editAddressModal, setEditAddressModal] = useState({
    isOpen: false,
    addressIdentifier: null,
    values: {
      label: "",
      street: "",
      city: "",
      postal_code: "",
      country: "",
      phone: "",
      is_default: false,
    },
    errors: {},
  });
  const [changePasswordModal, setChangePasswordModal] = useState({
    isOpen: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    errors: {},
    loading: false,
  });
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(
    customer?.is_email_notifications_enabled ?? true
  );
  const [emailNotifLoading, setEmailNotifLoading] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);
  const [ordersPagination, setOrdersPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [ordersFilters, setOrdersFilters] = useState({
    status: "",
    fromDate: "",
    toDate: "",
  });
  const [cancelOrderModal, setCancelOrderModal] = useState({
    isOpen: false,
    orderId: null,
    loading: false,
    reason: "",
    error: null,
  });
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  const openEditAddressModal = (address, identifier) => {
    setEditAddressModal({
      isOpen: true,
      addressIdentifier: identifier,
      values: { ...address },
      errors: {},
    });
  };

  // Handler to open modal
  const openDeleteAccountModal = () => setDeleteAccountModal(true);
  // Handler to close modal
  const closeDeleteAccountModal = () => setDeleteAccountModal(false);

  // Handle edit modal field changes
  const handleEditAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditAddressModal((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: type === "checkbox" ? checked : value,
      },
      errors: {
        ...prev.errors,
        [name]: undefined,
      },
    }));
  };

  // Validate edit address fields
  const validateEditAddress = (values) => {
    const requiredFields = [
      "label",
      "street",
      "city",
      "postal_code",
      "country",
      "phone",
    ];
    const errors = {};
    requiredFields.forEach((field) => {
      if (!values[field] || values[field].toString().trim() === "") {
        errors[field] = "Required";
      }
    });
    return errors;
  };

  // USE EFFECTS
  useEffect(() => {
    if (customer?.addresses) {
      setAddresses(customer.addresses);
    }
  }, [customer]);

  useEffect(() => {
    if (customer) {
      setForm({
        customer_type: customer.customer_type || "",
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        gender: customer.gender || "",
        date_of_birth: customer.date_of_birth || "",
        business_name: customer.business_name || "",
        business_registration_number:
          customer.business_registration_number || "",
        vat_number: customer.vat_number || "",
        business_type: customer.business_type || "",
        business_phone: customer.business_phone || "",
        business_address: customer.business_address || "",
        email: customer.email || "",
        phone_primary: customer.phone_primary || "",
        preferred_language: customer.preferred_language || "fr",
        preferred_currency: customer.preferred_currency || "EUR",
      });
    }
  }, [customer]);

  useEffect(() => {
    if (customer?.is_email_notifications_enabled !== undefined) {
      setEmailNotificationsEnabled(customer.is_email_notifications_enabled);
    }
  }, [customer]);

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);
  // END USE EFFECTS

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // CUSTOMER PROFILE STARTS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await customerAccountService.updateCustomer(form);
      toast({
        title: "Profil mis à jour avec succès !",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setEditMode(false);
    } catch (err) {
      toast({
        title: "Échec de la mise à jour du profil",
        description: err.message || "Veuillez réessayer plus tard.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setUpdating(false);
    }
  };
  // CUSTOMER PROFILE ENDS

  // ADDRESS START
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // add address
  const handleAddAddress = async () => {
    try {
      const res = await customerAccountService.addAddress(newAddress);
      toast({
        title: "Adresse ajoutée!",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      // Optionally update customer addresses in UI
      if (customer && res.addresses) {
        setAddresses(res.addresses);
      }
      setNewAddress({
        label: "",
        street: "",
        city: "",
        postal_code: "",
        country: "",
        phone: "",
        is_default: false,
      });
      onClose();
    } catch (err) {
      toast({
        title: "Échec de l'ajout de l'adresse",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };

  // delete address
  const handleDeleteAddress = async (addressIdentifier) => {
    try {
      const res = await customerAccountService.deleteAddress(addressIdentifier);
      toast({
        title: "Adresse supprimée!",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      // Optionally update customer addresses in UI
      if (res.addresses) {
        setAddresses(res.addresses);
      }
    } catch (err) {
      toast({
        title: "Échec de la suppression de l'adresse",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };

  // edit address
  const handleEditAddressSubmit = async () => {
    const errors = validateEditAddress(editAddressModal.values);
    if (Object.keys(errors).length > 0) {
      setEditAddressModal((prev) => ({ ...prev, errors }));
      return;
    }
    try {
      const res = await customerAccountService.editAddress(
        editAddressModal.addressIdentifier,
        editAddressModal.values
      );
      toast({
        title: "Adresse mise à jour!",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      if (res.addresses) setAddresses(res.addresses);
      setEditAddressModal((prev) => ({ ...prev, isOpen: false }));
    } catch (err) {
      toast({
        title: "Échec de la mise à jour de l'adresse",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };
  // END ADDRESS

  // CHANGE PASSWORD START
  const openChangePasswordModal = () => {
    setChangePasswordModal({
      isOpen: true,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errors: {},
      loading: false,
    });
  };

  const handleChangePasswordField = (e) => {
    const { name, value } = e.target;
    setChangePasswordModal((prev) => ({
      ...prev,
      [name]: value,
      errors: { ...prev.errors, [name]: undefined },
    }));
  };

  const validateChangePassword = () => {
    const errors = {};
    if (!changePasswordModal.currentPassword)
      errors.currentPassword = "Requis";
    if (!changePasswordModal.newPassword) errors.newPassword = "Requis";
    if (!changePasswordModal.confirmPassword)
      errors.confirmPassword = "Requis";
    if (
      changePasswordModal.newPassword &&
      changePasswordModal.confirmPassword &&
      changePasswordModal.newPassword !== changePasswordModal.confirmPassword
    ) {
      errors.confirmPassword = "les mots de passe ne correspondent pas";
    }
    return errors;
  };

  const handleChangePasswordSubmit = async () => {
    const errors = validateChangePassword();
    if (Object.keys(errors).length > 0) {
      setChangePasswordModal((prev) => ({ ...prev, errors }));
      return;
    }
    setChangePasswordModal((prev) => ({ ...prev, loading: true }));
    try {
      await customerAccountService.changePassword(
        changePasswordModal.currentPassword,
        changePasswordModal.newPassword
      );
      toast({
        title: "Mot de passe modifié avec succès !",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setChangePasswordModal((prev) => ({
        ...prev,
        isOpen: false,
        loading: false,
      }));
    } catch (err) {
      toast({
        title: "Impossible de changer le mot de passe",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setChangePasswordModal((prev) => ({ ...prev, loading: false }));
    }
  };
  // CHANGE PASSWORD END

  // PROFILE PICUTE START
  const fileInputRef = useRef();

  const handleCustomFileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await customerAccountService.uploadProfilePicture(file);
      toast({
        title: "Photo de profil mise à jour !",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      // Optionally update customer state/profile picture in UI
    } catch (err) {
      toast({
        title: "Échec du téléchargement de la photo de profil",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };
  // PROFILE PICTURE END

  // SET EMAIL NOTIFICATIONS START
  const handleToggleEmailNotifications = async () => {
    setEmailNotifLoading(true);
    try {
      const res = await customerAccountService.setEmailNotifications(
        !emailNotificationsEnabled
      );
      setEmailNotificationsEnabled(res.is_email_notifications_enabled);
      toast({
        title: `Notifications par e-mail ${
          res.is_email_notifications_enabled ? "activé" : "désactivé"
        }!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (err) {
      toast({
        title: "Échec de la mise à jour des notifications par e-mail",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
    setEmailNotifLoading(false);
  };
  // SET EMAIL NOTIFICATIONS END

  // DELETE ACCOUNT START
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await customerAccountService.deleteAccount();
      toast({
        title: "Compte désactivé.",
        description: "Votre compte a été désactivé.",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      // Optionally, log out the user or redirect to home/login
      window.location.href = "/";
    } catch (err) {
      toast({
        title: "Échec de la désactivation du compte",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
    setDeleteLoading(false);
    closeDeleteAccountModal();
  };
  // DELETE ACCOUNT END

  // ORDER START
  // Add this function to fetch orders:
  const fetchOrders = async (options = {}) => {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      const params = {
        page: options.page || ordersPagination.page,
        limit: options.limit || ordersPagination.limit,
        ...ordersFilters,
        ...options,
      };

      const response = await customerAccountService.getOrdersByCustomer(params);

      setOrders(response.orders || []);
      setOrdersPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      });
    } catch (err) {
      setOrdersError(err.message || "Échec du chargement des commandes");
      toast({
        title: "Échec du chargement des commandes",
        description: err.message || "Veuillez réessayer plus tard.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  // Helper function to get status color:
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

  // Add this function to toggle order expansion:
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

  // Update the getStatusProgress function for more accurate progress:
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

  // Add this function for status timeline data:
  const getStatusTimeline = (status) => {
    const timeline = [
      { key: "pending", label: "Commande passée", icon: FaClipboardCheck },
      { key: "processing", label: "Traitement", icon: FaCog },
      { key: "paid", label: "Paiement confirmé", icon: FaCreditCard },
      { key: "shipped", label: "Shipped", icon: FaBox },
      { key: "on_delivery", label: "Expédié", icon: FaTruck },
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

  // Helper function to format date:
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Add this function to get status display name:
  const getStatusDisplayName = (status) => {
    const statusMap = {
      pending: "Pending",
      processing: "Processing",
      paid: "Paid",
      shipped: "Shipped",
      on_delivery: "On Delivery",
      in_transit: "In Transit",
      in_customs: "In Customs",
      completed: "Completed",
      cancelled: "Cancelled",
      pending_payment: "Pending Payment",
      order_cancel_request: "Cancel Requested",
    };
    return statusMap[status?.toLowerCase()] || status;
  };
  // ORDER END

  // CANCEL ORDER START
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

  // Handler to submit cancellation
  const handleSubmitCancelOrder = async () => {
    setCancelOrderModal((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await customerAccountService.requestOrderCancellation({
        order_id: cancelOrderModal.orderId,
        type: "cancellation",
        reason: cancelOrderModal.reason,
      });
      toast({
        title: "Demande d'annulation envoyée !",
        description: "Votre demande sera étudiée par notre équipe.",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      closeCancelOrderModal();
      fetchOrders();
    } catch (err) {
      setCancelOrderModal((prev) => ({
        ...prev,
        error: err.message || "Échec de la demande d'annulation",
        loading: false,
      }));
    }
  };
  // CANCEL ORDER END

  // COMPLETE PAYMENT WITH CARD
  // Add this function:
  const handleCompletePayment = async (orderId) => {
    try {
      const res = await customerAccountService.completePayment({
        order_id: orderId,
      });
      if (res && res.payment_link) {
        window.location.href = res.payment_link;
      } else {
        toast({
          title: "Impossible de démarrer le paiement",
          description: "Aucun lien de paiement retourné.",
          status: "error",
          duration: 4000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      }
    } catch (err) {
      toast({
        title: "Impossible de démarrer le paiement",
        description: err.message || "Veuillez réessayer.",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }
  };
  // COMPLETE PAYMENT WITH CARD END

  const menuItems = [
    { key: "overview", icon: RxDashboard, label: "Aperçu" },
    { key: "orders", icon: GiBeachBag, label: "Ordres" },
    // { key: "payment", icon: HiOutlineCreditCard, label: "Payment" },
    // { key: "returns", icon: HiOutlineReceiptRefund, label: "Returns/refunds" },
    { key: "shipping", icon: GrLocation, label: "Adresse de livraison" },
    { key: "settings", icon: IoSettingsOutline, label: "Paramètres" },
  ];

  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <VStack spacing={6} align="stretch">
            {/* User Header */}
            <Box
              bg="white"
              p={{ base: 4, md: 6 }}
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
            >
              <VStack spacing={4} align="stretch">
                {/* Mobile: Stack vertically, Desktop: Side by side */}
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  gap={4}
                >
                  <HStack spacing={4} w="full">
                    <Avatar
                      size={{ base: "md", md: "lg" }}
                      name={`${customer?.first_name} ${customer?.last_name}`}
                      bg="purple.500"
                      color="white"
                      src={customer?.profile_picture_url}
                    />
                    <VStack align="flex-start" spacing={1} flex={1}>
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="600"
                        color="gray.800"
                        lineHeight="1.2"
                      >
                        {customer?.first_name} {customer?.last_name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {customer?.email}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        Member since{" "}
                        {customer?.created_at
                          ? new Date(customer.created_at).toLocaleDateString(
                              "en-US"
                            )
                          : "-"}
                      </Text>
                    </VStack>
                  </HStack>

                  {/* Edit Button - Full width on mobile */}
                  <Button
                    leftIcon={<FaEdit />}
                    onClick={() => setEditMode(!editMode)}
                    size={{ base: "sm", md: "sm" }}
                    bg="#fff"
                    color="rgba(48, 51, 57, 1)"
                    fontSize={"sm"}
                    border="1.5px solid rgba(145, 158, 171, 0.2)"
                    rounded="full"
                    fontWeight={"500"}
                    px={6}
                    py={4}
                    w={{ base: "full", md: "auto" }}
                  >
                    {editMode ? "Annuler" : "Modifier"}
                  </Button>
                </Flex>

                {/* Badges - Stack on mobile, wrap on larger screens */}
                <VStack spacing={3} align="stretch">
                  <Flex
                    wrap="wrap"
                    gap={2}
                    direction={{ base: "column", sm: "row" }}
                    align={{ base: "stretch", sm: "flex-start" }}
                  >
                    <Badge
                      colorScheme={customer?.is_active ? "green" : "red"}
                      fontSize={{ base: "xs", md: "sm" }}
                      px={3}
                      py={1}
                      borderRadius="md"
                      textAlign="center"
                    >
                      {customer?.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge
                      colorScheme={
                        customer?.email_verified ? "green" : "yellow"
                      }
                      fontSize={{ base: "xs", md: "sm" }}
                      px={3}
                      py={1}
                      borderRadius="md"
                      textAlign="center"
                    >
                      {customer?.email_verified
                        ? "E-mail vérifié"
                        : "E-mail non vérifié"}
                    </Badge>
                    <Badge
                      colorScheme={
                        customer?.is_email_notifications_enabled
                          ? "orange"
                          : "gray"
                      }
                      fontSize={{ base: "xs", md: "sm" }}
                      px={3}
                      py={1}
                      borderRadius="md"
                      textAlign="center"
                    >
                      {customer?.is_email_notifications_enabled
                        ? "Notifications par e-mail activées"
                        : "Notifications par e-mail désactivées"}
                    </Badge>
                  </Flex>
                </VStack>

                {/* Stats - Stack on mobile */}
                <SimpleGrid
                  columns={{ base: 1, sm: 2 }}
                  spacing={{ base: 4, md: 8 }}
                  mt={4}
                >
                  <VStack spacing={0} align="flex-start">
                    <Text fontSize="sm" color="gray.500">
                      Total des commandes
                    </Text>
                    <Text
                      fontWeight="bold"
                      color="orange.500"
                      fontSize={{ base: "lg", md: "xl" }}
                    >
                      {customer?.total_orders ?? 0}
                    </Text>
                  </VStack>
                  <VStack spacing={0} align="flex-start">
                    <Text fontSize="sm" color="gray.500">
                      Total dépensé
                    </Text>
                    <Text
                      fontWeight="bold"
                      color="orange.500"
                      fontSize={{ base: "lg", md: "xl" }}
                    >
                      €{customer?.total_spent ?? "0.00"}
                    </Text>
                  </VStack>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Personal Information Form */}
            {editMode && (
              <Box
                bg="white"
                p={{ base: 4, md: 6 }}
                borderRadius="md"
                border="1px"
                borderColor="gray.200"
              >
                <VStack spacing={6} align="stretch">
                  {/* Header - Stack on mobile */}
                  <Flex
                    direction={{ base: "column", md: "row" }}
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    gap={4}
                  >
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="600"
                      color="gray.800"
                    >
                      Informations personnelles
                    </Text>
                    <Button
                      onClick={handleSubmit}
                      isLoading={updating}
                      loadingText="Updating..."
                      size="sm"
                      bg="#fff"
                      color="rgba(48, 51, 57, 1)"
                      fontSize={"sm"}
                      border="1.5px solid rgba(145, 158, 171, 0.2)"
                      rounded="full"
                      fontWeight={"500"}
                      px={6}
                      py={4}
                      w={{ base: "full", md: "auto" }}
                    >
                      Enregistrer les modifications
                    </Button>
                  </Flex>

                  <form onSubmit={handleSubmit}>
                    <VStack spacing={6} align="stretch">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isInvalid={!!errors.first_name}>
                          <FormLabel
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.700"
                          >
                            Prénom
                          </FormLabel>
                          <Input
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            placeholder="Entrez le prénom"
                            borderRadius="md"
                            size={{ base: "md", md: "md" }}
                          />
                          <FormErrorMessage>
                            {errors.first_name}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.last_name}>
                          <FormLabel
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.700"
                          >
                            Nom de famille
                          </FormLabel>
                          <Input
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            placeholder="Entrez le nom de famille"
                            borderRadius="md"
                            size={{ base: "md", md: "md" }}
                          />
                          <FormErrorMessage>
                            {errors.last_name}
                          </FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl isInvalid={!!errors.date_of_birth}>
                          <FormLabel
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.700"
                          >
                            Date de naissance
                          </FormLabel>
                          <Input
                            name="date_of_birth"
                            type="date"
                            value={form.date_of_birth}
                            onChange={handleChange}
                            borderRadius="md"
                            size={{ base: "md", md: "md" }}
                          />
                          <FormErrorMessage>
                            {errors.date_of_birth}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                          <FormLabel
                            fontSize="sm"
                            fontWeight="600"
                            color="gray.700"
                          >
                            Genre
                          </FormLabel>
                          <RadioGroup
                            value={form.gender}
                            onChange={(value) =>
                              setForm((prev) => ({ ...prev, gender: value }))
                            }
                          >
                            <Stack
                              direction={{ base: "column", sm: "row" }}
                              spacing={{ base: 3, sm: 6 }}
                            >
                              <Radio value="male">Mâle</Radio>
                              <Radio value="female">Femelle</Radio>
                              <Radio value="other">Autre</Radio>
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Type de client
                        </FormLabel>
                        <Select
                          name="customer_type"
                          value={form.customer_type}
                          onChange={handleChange}
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
                        >
                          <option value="client">Cliente</option>
                          <option value="business">Entreprise</option>
                        </Select>
                      </FormControl>

                      {/* Business fields, only show if business */}
                      {form.customer_type === "business" && (
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.700"
                              >
                                Nom de l'entreprise
                              </FormLabel>
                              <Input
                                name="business_name"
                                value={form.business_name}
                                onChange={handleChange}
                                placeholder="Enter business name"
                                borderRadius="md"
                                size={{ base: "md", md: "md" }}
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.700"
                              >
                                Numéro d'enregistrement d'entreprise
                              </FormLabel>
                              <Input
                                name="business_registration_number"
                                value={form.business_registration_number}
                                onChange={handleChange}
                                placeholder="Enter registration number"
                                borderRadius="md"
                                size={{ base: "md", md: "md" }}
                              />
                            </FormControl>
                          </SimpleGrid>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.700"
                              >
                                Numéro de TVA
                              </FormLabel>
                              <Input
                                name="vat_number"
                                value={form.vat_number}
                                onChange={handleChange}
                                placeholder="Enter VAT number"
                                borderRadius="md"
                                size={{ base: "md", md: "md" }}
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.700"
                              >
                                Type d'entreprise
                              </FormLabel>
                              <Input
                                name="business_type"
                                value={form.business_type}
                                onChange={handleChange}
                                placeholder="Enter business type"
                                borderRadius="md"
                                size={{ base: "md", md: "md" }}
                              />
                            </FormControl>
                          </SimpleGrid>
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.700"
                              >
                                Téléphone professionnel
                              </FormLabel>
                              <Input
                                name="business_phone"
                                value={form.business_phone}
                                onChange={handleChange}
                                placeholder="Enter business phone"
                                borderRadius="md"
                                size={{ base: "md", md: "md" }}
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                fontWeight="600"
                                color="gray.700"
                              >
                                Adresse de l'entreprise
                              </FormLabel>
                              <Input
                                name="business_address"
                                value={form.business_address}
                                onChange={handleChange}
                                placeholder="Enter business address"
                                borderRadius="md"
                                size={{ base: "md", md: "md" }}
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      )}
                    </VStack>
                  </form>
                </VStack>
              </Box>
            )}
          </VStack>
        );

      case "orders":
        return (
          <>
            <VStack spacing={6} align="stretch" maxW='100%'>
              {/* Enhanced Header */}
              <Box
                bg="white"
                p={{ base: 4, md: 6 }}
                borderRadius="xl"
                border="1px solid rgba(145, 158, 171, 0.2)"
                shadow="sm"
              >
                <VStack spacing={4} align="stretch">
                  <Flex
                    justify="space-between"
                    align={{ base: "flex-start", md: "center" }}
                    direction={{ base: "column", md: "row" }}
                    gap={{ base: 3, md: 0 }}
                  >
                    <HStack spacing={3}>
                      <VStack align="start" spacing={0}>
                        <Text
                          fontSize={{ base: "md", md: "lg" }}
                          fontWeight="500"
                          color="gray.700"
                        >
                          Mes commandes
                        </Text>
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          color="gray.500"
                        >
                          Suivez et gérez vos commandes
                        </Text>
                      </VStack>
                    </HStack>
                  </Flex>

                  {/* Enhanced Filters */}
                  <Box
                    bg="gray.50"
                    p={{ base: 3, md: 4 }}
                    borderRadius="xl"
                    border="1px solid rgba(145, 158, 171, 0.2)"
                  >
                    <SimpleGrid
                      columns={{ base: 1, sm: 2, md: 4 }}
                      spacing={{ base: 3, md: 4 }}
                    >
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
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
                          bg="white"
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
                          <option value="pending_payment">
                            Paiement en attente
                          </option>
                          <option value="order_cancel_request">
                            Annulation demandée
                          </option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
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
                          bg="white"
                          borderRadius="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
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
                          bg="white"
                          borderRadius="lg"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          <Text>Actes</Text>
                        </FormLabel>
                        <Button
                          size={{ base: "md", md: "sm" }}
                          variant="outline"
                          colorScheme="gray"
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

              {/* Minimal Orders List */}
              <Box
                bg="white"
                borderRadius="xl"
                border="1px"
                borderColor="gray.200"
                overflow="hidden"
                shadow="sm"
                display='flex'
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
                    <Text fontSize="sm" color="gray.400" mb={6}>
                      {ordersError}
                    </Text>
                    <Button
                      colorScheme="orange"
                      size="lg"
                      onClick={() => fetchOrders()}
                      borderRadius="lg"
                    >
                      Essayer à nouveau
                    </Button>
                  </Box>
                ) : orders.length === 0 ? (
                  <Box textAlign="center" py={16}>
                    <Icon
                      as={FaShoppingBag}
                      boxSize="16"
                      color="gray.300"
                      mb={4}
                    />
                    <Text
                      fontSize="xl"
                      color="gray.500"
                      mb={2}
                      fontWeight="600"
                    >
                      Aucune commande trouvée
                    </Text>
                    <Text fontSize="sm" color="gray.400" mb={6}>
                      {ordersFilters.status ||
                      ordersFilters.fromDate ||
                      ordersFilters.toDate
                        ? "Essayez d'ajuster vos filtres pour voir plus de résultats"
                        : "Lorsque vous passez des commandes, elles apparaîtront ici"}
                    </Text>
                    <Button
                      colorScheme="orange"
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
                      const isCancelled = [
                        "cancelled",
                        "order_cancel_request",
                      ].includes(order.status?.toLowerCase());
                      const isExpanded = expandedOrders.has(order.id);
                      const timeline = getStatusTimeline(order.status);

                      return (
                        <Box
                          key={order.id}
                          position="relative"
                          overflow="hidden"
                          borderBottom={
                            index < orders.length - 1 ? "1px" : "none"
                          }
                          borderColor="gray.100"
                          _hover={{ bg: "gray.50" }}
                          transition="all 0.3s ease"
                        >
                          {/* Minimal Order Card */}
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
                                  bg={
                                    isCancelled
                                      ? "red.400"
                                      : `${statusColor}.400`
                                  }
                                  width={
                                    isCancelled ? "100%" : `${statusProgress}%`
                                  }
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
                              <HStack
                                spacing={{ base: 3, md: 4 }}
                                align="flex-start"
                              >
                                <Box
                                  w="10px"
                                  h="10px"
                                  borderRadius="full"
                                  bg={`${statusColor}.500`}
                                />
                                <VStack align="start" spacing={0}>
                                  <HStack spacing={2}>
                                    <Text
                                      fontSize="lg"
                                      fontWeight="700"
                                      color="gray.800"
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
                                    color="gray.500"
                                  >
                                    <Text>{formatDate(order.created_at)}</Text>
                                    <Text>•</Text>
                                    <Text>
                                      {order.items?.length || 0} articles
                                    </Text>
                                    <Text>•</Text>
                                    <Text>
                                      {order.payment_method === "credit_card"
                                        ? "Credit Card"
                                        : "Bank Transfer"}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </HStack>

                              <HStack spacing={3}>
                                <VStack align="end" spacing={0}>
                                  <Text
                                    fontSize="xl"
                                    fontWeight="700"
                                    color="gray.800"
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
                                    textTransform={"none"}
                                    py={1}
                                    px={4}
                                    rounded="lg"
                                  >
                                    Statut de paiement:{" "}
                                    {order.payment_status?.toUpperCase()}
                                  </Badge>
                                </VStack>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="gray"
                                  onClick={() => toggleOrderExpansion(order.id)}
                                  rightIcon={
                                    isExpanded ? (
                                      <FaChevronUp />
                                    ) : (
                                      <FaChevronDown />
                                    )
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
                                        color="gray.700"
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
                                                step.isCompleted ||
                                                step.isActive
                                                  ? `${statusColor}.500`
                                                  : "gray.200"
                                              }
                                              color={
                                                step.isCompleted ||
                                                step.isActive
                                                  ? "white"
                                                  : "gray.400"
                                              }
                                              display="flex"
                                              alignItems="center"
                                              justifyContent="center"
                                              border="3px solid white"
                                              shadow="sm"
                                              transition="all 0.3s ease"
                                            >
                                              <Icon as={step.icon} size="sm" />
                                            </Box>
                                            <Text
                                              fontSize="xs"
                                              color={
                                                step.isCompleted ||
                                                step.isActive
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
                                      bg="white"
                                      borderRadius="xl"
                                      border="1px solid"
                                      borderColor="gray.200"
                                      overflow="hidden"
                                      shadow="sm"
                                    >
                                      <Box
                                        bg="gray.50"
                                        px={6}
                                        py={4}
                                        borderBottom="1px solid"
                                        borderColor="gray.200"
                                      >
                                        <HStack spacing={2}>
                                          <Text
                                            fontSize="md"
                                            fontWeight="600"
                                            color="gray.800"
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
                                                ? "1px solid"
                                                : "none"
                                            }
                                            borderColor="gray.100"
                                            p={6}
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
                                                  item?.product_snapshot
                                                    ?.main_image_url
                                                }
                                                alt={
                                                  item?.product_snapshot
                                                    ?.title || "Product image"
                                                }
                                                boxSize="60px"
                                                objectFit="cover"
                                                borderRadius="lg"
                                                bg="gray.100"
                                                fallbackSrc="https://via.placeholder.com/60x60?text=No+Image"
                                                flexShrink={0}
                                              />

                                              <VStack
                                                align="start"
                                                spacing={4}
                                                flex={1}
                                              >
                                                <Text
                                                  fontSize="sm"
                                                  fontWeight="500"
                                                  color="gray.800"
                                                  lineHeight="1.3"
                                                >
                                                  {item.product_snapshot
                                                    ?.title || "Product Title"}
                                                </Text>

                                                <HStack spacing={3} wrap="wrap">
                                                  <Badge
                                                    fontSize="sm"
                                                    bg="transparent"
                                                    textTransform={"none"}
                                                    textDecoration={"none"}
                                                    fontWeight={"400"}
                                                  >
                                                    Quantité:{" "}
                                                    {item.quantity || 0}
                                                  </Badge>
                                                  <Badge
                                                    fontSize="sm"
                                                    bg="transparent"
                                                    textTransform={"none"}
                                                    textDecoration={"none"}
                                                    fontWeight={"400"}
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.unit_price || 0
                                                    ).toFixed(2)}{" "}
                                                    chaque
                                                  </Badge>
                                                  <Badge
                                                    fontSize="sm"
                                                    bg="transparent"
                                                    textTransform={"none"}
                                                    textDecoration={"none"}
                                                    fontWeight={"600"}
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.total_price || 0
                                                    ).toFixed(2)}{" "}
                                                    totale
                                                  </Badge>
                                                </HStack>

                                                {item.product_snapshot
                                                  ?.description && (
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.600"
                                                    noOfLines={1}
                                                    lineHeight="1.4"
                                                  >
                                                    {
                                                      item.product_snapshot
                                                        .description
                                                    }
                                                  </Text>
                                                )}
                                              </VStack>
                                            </HStack>

                                            {/* Customization Details - Only show if has customizations */}
                                            {hasCustomizations(item) && (
                                              <Box
                                                bg="gray.50"
                                                borderRadius="lg"
                                                p={4}
                                                border="1px solid"
                                                borderColor="gray.200"
                                              >
                                                <Text
                                                  fontSize="sm"
                                                  fontWeight="600"
                                                  color="gray.700"
                                                  mb={3}
                                                  display="flex"
                                                  alignItems="center"
                                                  gap={2}
                                                >
                                                  ✨ Personnalisations
                                                </Text>

                                                {item.selected_options &&
                                                  Array.isArray(
                                                    item.selected_options
                                                  ) &&
                                                  item.selected_options.length >
                                                    0 && (
                                                    <Box>
                                                      <Box
                                                        bg="white"
                                                        borderRadius="md"
                                                        overflow="hidden"
                                                        border="1px solid rgba(145, 158, 171, 0.2)"
                                                      >
                                                        {/* Table Header */}
                                                        <HStack
                                                          p={3}
                                                          borderBottom="1px solid"
                                                          borderColor="rgba(145, 158, 171, 0.2)"
                                                          fontWeight="600"
                                                          fontSize="xs"
                                                        >
                                                          <Box
                                                            flex="0 0 60px"
                                                            textAlign="center"
                                                          >
                                                            Image
                                                          </Box>
                                                          <Box flex="1">
                                                            Option
                                                          </Box>
                                                          <Box flex="1">
                                                            Valeur sélectionnée
                                                          </Box>
                                                        </HStack>

                                                        {/* Table Rows */}
                                                        <VStack
                                                          spacing={0}
                                                          align="stretch"
                                                        >
                                                          {item.selected_options.map(
                                                            (
                                                              option,
                                                              optionIndex
                                                            ) => (
                                                              <HStack
                                                                key={
                                                                  optionIndex
                                                                }
                                                                p={3}
                                                                borderBottom={
                                                                  optionIndex <
                                                                  item
                                                                    .selected_options
                                                                    .length -
                                                                    1
                                                                    ? "1px solid"
                                                                    : "none"
                                                                }
                                                                borderColor="gray.100"
                                                                _hover={{
                                                                  bg: "gray.50",
                                                                }}
                                                                align="center"
                                                              >
                                                                {/* Image Column */}
                                                                <Box
                                                                  flex="0 0 60px"
                                                                  textAlign="center"
                                                                >
                                                                  {option.image_url ? (
                                                                    <ChakraImage
                                                                      src={
                                                                        option.image_url
                                                                      }
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
                                                                        as={
                                                                          FaPalette
                                                                        }
                                                                        color="gray.400"
                                                                        size="sm"
                                                                      />
                                                                    </Box>
                                                                  )}
                                                                </Box>
                                                                {/* Option Column */}
                                                                <Box flex="1">
                                                                  <Text
                                                                    fontSize="xs"
                                                                    color="gray.600"
                                                                    fontWeight="500"
                                                                    lineHeight="1.3"
                                                                    noOfLines={
                                                                      2
                                                                    }
                                                                  >
                                                                    {
                                                                      option.option_name
                                                                    }
                                                                  </Text>
                                                                </Box>

                                                                {/* Selected Value Column */}
                                                                <Box flex="1">
                                                                  <Text
                                                                    fontSize="xs"
                                                                    color="gray.800"
                                                                    fontWeight="400"
                                                                    lineHeight="1.3"
                                                                    noOfLines={
                                                                      2
                                                                    }
                                                                  >
                                                                    {
                                                                      option.value_name
                                                                    }
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
                                                  typeof item.dimensions ===
                                                    "object" &&
                                                  Object.keys(item.dimensions)
                                                    .length > 0 && (
                                                    <Box mt={4}>
                                                      <HStack
                                                        spacing={2}
                                                        mb={3}
                                                      >
                                                        <Text
                                                          fontSize="xs"
                                                          fontWeight="600"
                                                          color="gray.700"
                                                        >
                                                          Dimensions
                                                        </Text>
                                                      </HStack>

                                                      <Box
                                                        bg="white"
                                                        borderRadius="md"
                                                        border="1px solid"
                                                        borderColor="rgba(145, 158, 171, 0.2)"
                                                        overflow="hidden"
                                                      >
                                                        {/* Table Header */}
                                                        <HStack
                                                          p={3}
                                                          borderBottom="1px solid"
                                                          borderColor="rgba(145, 158, 171, 0.2)"
                                                          fontWeight="600"
                                                          fontSize="xs"
                                                          color="gray.700"
                                                        >
                                                          <Box flex="1">
                                                            Dimension
                                                          </Box>
                                                          <Box flex="1">
                                                            Valeur
                                                          </Box>
                                                          <Box
                                                            flex="0 0 60px"
                                                            textAlign="center"
                                                          >
                                                            Unité
                                                          </Box>
                                                        </HStack>

                                                        {/* Table Rows */}
                                                        <VStack
                                                          spacing={0}
                                                          align="stretch"
                                                        >
                                                          {Object.entries(
                                                            item.dimensions
                                                          ).map(
                                                            (
                                                              [key, value],
                                                              dimensionIndex
                                                            ) => (
                                                              <HStack
                                                                key={key}
                                                                p={3}
                                                                borderBottom={
                                                                  dimensionIndex <
                                                                  Object.keys(
                                                                    item.dimensions
                                                                  ).length -
                                                                    1
                                                                    ? "1px solid"
                                                                    : "none"
                                                                }
                                                                borderColor="gray.100"
                                                                _hover={{
                                                                  bg: "gray.50",
                                                                }}
                                                                align="center"
                                                              >
                                                                {/* Dimension Name Column */}
                                                                <Box flex="1">
                                                                  <Text
                                                                    fontSize="xs"
                                                                    color="gray.600"
                                                                    fontWeight="500"
                                                                    lineHeight="1.3"
                                                                    textTransform="capitalize"
                                                                  >
                                                                    {key.replace(
                                                                      /_/g,
                                                                      " "
                                                                    )}
                                                                  </Text>
                                                                </Box>

                                                                {/* Value Column */}
                                                                <Box flex="1">
                                                                  <Text
                                                                    fontSize="xs"
                                                                    color="gray.800"
                                                                    fontWeight="600"
                                                                    lineHeight="1.3"
                                                                  >
                                                                    {value}
                                                                  </Text>
                                                                </Box>

                                                                {/* Unit Column */}
                                                                <Box
                                                                  flex="0 0 60px"
                                                                  textAlign="center"
                                                                >
                                                                  <Text fontSize="sm">
                                                                    {key
                                                                      .toLowerCase()
                                                                      .includes(
                                                                        "width"
                                                                      ) ||
                                                                    key
                                                                      .toLowerCase()
                                                                      .includes(
                                                                        "height"
                                                                      ) ||
                                                                    key
                                                                      .toLowerCase()
                                                                      .includes(
                                                                        "length"
                                                                      ) ||
                                                                    key
                                                                      .toLowerCase()
                                                                      .includes(
                                                                        "depth"
                                                                      )
                                                                      ? "cm"
                                                                      : key
                                                                          .toLowerCase()
                                                                          .includes(
                                                                            "weight"
                                                                          )
                                                                      ? "kg"
                                                                      : key
                                                                          .toLowerCase()
                                                                          .includes(
                                                                            "area"
                                                                          )
                                                                      ? "m²"
                                                                      : key
                                                                          .toLowerCase()
                                                                          .includes(
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
                                                  Array.isArray(
                                                    item.selected_services
                                                  ) &&
                                                  item.selected_services
                                                    .length > 0 && (
                                                    <Box mt={4}>
                                                      <HStack
                                                        spacing={2}
                                                        mb={3}
                                                      >
                                                        <Icon
                                                          as={FaTools}
                                                          color="green.500"
                                                          size="xs"
                                                        />
                                                        <Text
                                                          fontSize="xs"
                                                          fontWeight="600"
                                                          color="green.700"
                                                        >
                                                          Services sélectionnés
                                                        </Text>
                                                      </HStack>

                                                      <Box
                                                        bg="white"
                                                        borderRadius="md"
                                                        border="1px solid"
                                                        borderColor="green.100"
                                                        overflow="hidden"
                                                      >
                                                        {/* Table Header */}
                                                        <HStack
                                                          bg="green.50"
                                                          p={3}
                                                          borderBottom="1px solid"
                                                          borderColor="green.100"
                                                          fontWeight="600"
                                                          fontSize="xs"
                                                          color="green.700"
                                                        >
                                                          <Box flex="1">
                                                            Service
                                                          </Box>
                                                          <Box flex="1">
                                                            Description
                                                          </Box>
                                                          <Box
                                                            flex="0 0 80px"
                                                            textAlign="center"
                                                          >
                                                            Prix
                                                          </Box>
                                                        </HStack>

                                                        {/* Table Rows */}
                                                        <VStack
                                                          spacing={0}
                                                          align="stretch"
                                                        >
                                                          {item.selected_services.map(
                                                            (
                                                              service,
                                                              serviceIndex
                                                            ) => (
                                                              <HStack
                                                                key={
                                                                  serviceIndex
                                                                }
                                                                p={3}
                                                                borderBottom={
                                                                  serviceIndex <
                                                                  item
                                                                    .selected_services
                                                                    .length -
                                                                    1
                                                                    ? "1px solid"
                                                                    : "none"
                                                                }
                                                                borderColor="gray.100"
                                                                _hover={{
                                                                  bg: "gray.50",
                                                                }}
                                                                align="center"
                                                              >
                                                                {/* Service Name Column */}
                                                                <Box flex="1">
                                                                  <Text
                                                                    fontSize="xs"
                                                                    color="green.600"
                                                                    fontWeight="500"
                                                                    lineHeight="1.3"
                                                                    noOfLines={
                                                                      2
                                                                    }
                                                                  >
                                                                    {service.service_name ||
                                                                      service.name}
                                                                  </Text>
                                                                </Box>

                                                                {/* Description Column */}
                                                                <Box flex="1">
                                                                  <Text
                                                                    fontSize="xs"
                                                                    color="gray.800"
                                                                    fontWeight="400"
                                                                    lineHeight="1.3"
                                                                    noOfLines={
                                                                      2
                                                                    }
                                                                  >
                                                                    {service.description ||
                                                                      service.value}
                                                                  </Text>
                                                                </Box>

                                                                {/* Price Column */}
                                                                <Box
                                                                  flex="0 0 80px"
                                                                  textAlign="center"
                                                                >
                                                                  {service.price &&
                                                                  parseFloat(
                                                                    service.price
                                                                  ) !== 0 ? (
                                                                    <Badge
                                                                      colorScheme="green"
                                                                      variant="subtle"
                                                                      fontSize="2xs"
                                                                      borderRadius="full"
                                                                    >
                                                                      €
                                                                      {parseFloat(
                                                                        service.price
                                                                      ).toFixed(
                                                                        2
                                                                      )}
                                                                    </Badge>
                                                                  ) : (
                                                                    <Text
                                                                      fontSize="xs"
                                                                      color="gray.400"
                                                                    >
                                                                      Gratuite
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
                                    <Box bg="gray.50" p={4} borderRadius="xl">
                                      <HStack spacing={2} mb={3}>
                                        <Icon as={FaTruck} color="blue.500" />
                                        <Text
                                          fontSize="sm"
                                          fontWeight="600"
                                          color="gray.700"
                                        >
                                          Adresse de livraison
                                        </Text>
                                      </HStack>
                                      {order.shipping_address ? (
                                        <VStack align="start" spacing={1}>
                                          <Text
                                            fontSize="sm"
                                            color="gray.800"
                                            fontWeight="500"
                                          >
                                            {order.shipping_address.street}
                                          </Text>
                                          <Text fontSize="sm" color="gray.600">
                                            {order.shipping_address.city},{" "}
                                            {order.shipping_address.postal_code}
                                          </Text>
                                          <Text fontSize="sm" color="gray.600">
                                            {order.shipping_address.country}
                                          </Text>
                                          {order.shipping_address.phone && (
                                            <HStack spacing={1} mt={1}>
                                              <Icon
                                                as={FaPhone}
                                                color="gray.400"
                                                size="xs"
                                              />
                                              <Text
                                                fontSize="xs"
                                                color="gray.500"
                                              >
                                                {order.shipping_address.phone}
                                              </Text>
                                            </HStack>
                                          )}
                                        </VStack>
                                      ) : (
                                        <Text fontSize="sm" color="gray.400">
                                          Aucune adresse fournie
                                        </Text>
                                      )}
                                    </Box>

                                    {/* Billing Address */}
                                    <Box bg="gray.50" p={4} borderRadius="xl">
                                      <HStack spacing={2} mb={3}>
                                        <Icon
                                          as={FaFileInvoice}
                                          color="purple.500"
                                        />
                                        <Text
                                          fontSize="sm"
                                          fontWeight="600"
                                          color="gray.700"
                                        >
                                          Adresse de facturation
                                        </Text>
                                      </HStack>
                                      {order.billing_address ? (
                                        <VStack align="start" spacing={1}>
                                          <Text
                                            fontSize="sm"
                                            color="gray.800"
                                            fontWeight="500"
                                          >
                                            {order.billing_address.street}
                                          </Text>
                                          <Text fontSize="sm" color="gray.600">
                                            {order.billing_address.city},{" "}
                                            {order.billing_address.postal_code}
                                          </Text>
                                          <Text fontSize="sm" color="gray.600">
                                            {order.billing_address.country}
                                          </Text>
                                          {order.billing_address.phone && (
                                            <HStack spacing={1} mt={1}>
                                              <Icon
                                                as={FaPhone}
                                                color="gray.400"
                                                size="xs"
                                              />
                                              <Text
                                                fontSize="xs"
                                                color="gray.500"
                                              >
                                                {order.billing_address.phone}
                                              </Text>
                                            </HStack>
                                          )}
                                        </VStack>
                                      ) : (
                                        <Text fontSize="sm" color="gray.400">
                                          Identique à l'expédition
                                        </Text>
                                      )}
                                    </Box>

                                    {/* Payment Method */}
                                    <Box bg="gray.50" p={4} borderRadius="xl">
                                      <HStack spacing={2} mb={3}>
                                        <Icon
                                          as={FaCreditCard}
                                          color="green.500"
                                        />
                                        <Text
                                          fontSize="sm"
                                          fontWeight="600"
                                          color="gray.700"
                                        >
                                          Mode de paiement
                                        </Text>
                                      </HStack>
                                      <VStack align="start" spacing={2}>
                                        <HStack spacing={2}>
                                          <Icon
                                            as={
                                              order.payment_method ===
                                              "credit_card"
                                                ? FaCreditCard
                                                : FaUniversity
                                            }
                                            color={
                                              order.payment_method ===
                                              "credit_card"
                                                ? "blue.500"
                                                : "orange.500"
                                            }
                                            size="sm"
                                          />
                                          <Text
                                            fontSize="sm"
                                            color="gray.800"
                                            fontWeight="500"
                                          >
                                            {order.payment_method ===
                                            "credit_card"
                                              ? "Credit Card"
                                              : "Bank Transfer"}
                                          </Text>
                                        </HStack>

                                        <Badge
                                          colorScheme={
                                            order.payment_status === "paid"
                                              ? "green"
                                              : order.payment_status ===
                                                "failed"
                                              ? "red"
                                              : "yellow"
                                          }
                                          variant="subtle"
                                          fontSize="xs"
                                          px={3}
                                          py={1}
                                          borderRadius="full"
                                        >
                                          {order.payment_status
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            order.payment_status?.slice(1)}
                                        </Badge>
                                      </VStack>
                                    </Box>

                                    {/* Order Summary */}
                                    <Box bg="gray.50" p={4} borderRadius="xl">
                                      <HStack spacing={2} mb={3}>
                                        <Icon
                                          as={FaCalculator}
                                          color="orange.500"
                                        />
                                        <Text
                                          fontSize="sm"
                                          fontWeight="600"
                                          color="gray.700"
                                        >
                                          Résumé de la commande
                                        </Text>
                                      </HStack>
                                      <VStack align="start" spacing={2}>
                                        <HStack
                                          justify="space-between"
                                          w="100%"
                                        >
                                          <Text fontSize="sm" color="gray.600">
                                            Total:
                                          </Text>
                                          <Text
                                            fontSize="sm"
                                            color="gray.800"
                                            fontWeight="500"
                                          >
                                            €
                                            {parseFloat(
                                              order.subtotal || 0
                                            ).toFixed(2)}
                                          </Text>
                                        </HStack>

                                        {order.shipping_fee > 0 && (
                                          <HStack
                                            justify="space-between"
                                            w="100%"
                                          >
                                            <Text
                                              fontSize="sm"
                                              color="gray.600"
                                            >
                                              Expédition:
                                            </Text>
                                            <Text
                                              fontSize="sm"
                                              color="gray.800"
                                              fontWeight="500"
                                            >
                                              €
                                              {parseFloat(
                                                order.shipping_fee || 0
                                              ).toFixed(2)}
                                            </Text>
                                          </HStack>
                                        )}

                                        {order.tax > 0 && (
                                          <HStack
                                            justify="space-between"
                                            w="100%"
                                          >
                                            <Text
                                              fontSize="sm"
                                              color="gray.600"
                                            >
                                              Impôt:
                                            </Text>
                                            <Text
                                              fontSize="sm"
                                              color="gray.800"
                                              fontWeight="500"
                                            >
                                              €
                                              {parseFloat(
                                                order.tax || 0
                                              ).toFixed(2)}
                                            </Text>
                                          </HStack>
                                        )}

                                        {(order.promotion_discount > 0 ||
                                          order.gift_card_discount > 0) && (
                                          <HStack
                                            justify="space-between"
                                            w="100%"
                                          >
                                            <Text
                                              fontSize="sm"
                                              color="green.600"
                                            >
                                              Réductions:
                                            </Text>
                                            <Text
                                              fontSize="sm"
                                              color="green.600"
                                              fontWeight="500"
                                            >
                                              -€
                                              {(
                                                parseFloat(
                                                  order.promotion_discount || 0
                                                ) +
                                                parseFloat(
                                                  order.gift_card_discount || 0
                                                )
                                              ).toFixed(2)}
                                            </Text>
                                          </HStack>
                                        )}

                                        <Divider />

                                        <HStack
                                          justify="space-between"
                                          w="100%"
                                        >
                                          <Text
                                            fontSize="sm"
                                            fontWeight="600"
                                            color="gray.800"
                                          >
                                            Total:
                                          </Text>
                                          <Text
                                            fontSize="sm"
                                            fontWeight="700"
                                            color="orange.500"
                                          >
                                            €
                                            {parseFloat(
                                              order.total || 0
                                            ).toFixed(2)}
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
                                    <Box bg="gray.50" p={4} borderRadius="xl">
                                      <HStack spacing={2} mb={3}>
                                        <Icon as={FaCog} color="gray.500" />
                                        <Text
                                          fontSize="sm"
                                          fontWeight="600"
                                          color="gray.700"
                                        >
                                          Actes
                                        </Text>
                                      </HStack>
                                      <HStack spacing={2} wrap="wrap">
                                        {/* Cancel Order Button */}
                                        {[
                                          "pending",
                                          "pending_payment",
                                          "processing",
                                        ].includes(
                                          order.status?.toLowerCase()
                                        ) && (
                                          <Button
                                            size="sm"
                                            color="rgb(99, 115, 129)"
                                            rounded="50px"
                                            border="1px solid rgba(145, 158, 171, 0.2)"
                                            p="18px 18px"
                                            bg="#fff"
                                            fontWeight={"500"}
                                            fontFamily="Airbnb Cereal VF"
                                            leftIcon={<FaUndo />}
                                            onClick={() =>
                                              openCancelOrderModal(order.id)
                                            }
                                          >
                                            Annuler la commande
                                          </Button>
                                        )}

                                        {/* Complete Payment Button */}
                                        {order.payment_method ===
                                          "credit_card" &&
                                          order.payment_status ===
                                            "pending" && (
                                            <Button
                                              size="sm"
                                              color="rgb(99, 115, 129)"
                                              rounded="50px"
                                              border="1px solid rgba(145, 158, 171, 0.2)"
                                              p="18px 18px"
                                              bg="#fff"
                                              fontWeight={"500"}
                                              fontFamily="Airbnb Cereal VF"
                                              leftIcon={<FaCreditCard />}
                                              onClick={() =>
                                                handleCompletePayment(order.id)
                                              }
                                            >
                                              Paiement complet
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
                                        <Box bg="#fff" p={4} borderRadius="xl">
                                          <HStack spacing={2} mb={2}>
                                            <Text
                                              fontSize="sm"
                                              fontWeight="600"
                                              color="blue.700"
                                            >
                                              Note spéciale
                                            </Text>
                                          </HStack>
                                          <Text
                                            fontSize="sm"
                                            color="blue.600"
                                            fontStyle="italic"
                                          >
                                            "{order.special_note}"
                                          </Text>
                                        </Box>
                                      )}

                                      {(order.applied_promotion_code ||
                                        order.applied_gift_card_code) && (
                                        <Box bg="#fff" p={4} borderRadius="xl">
                                          <HStack spacing={2} mb={2}>
                                            <Icon
                                              as={FaTicketAlt}
                                              color="blue.500"
                                            />
                                            <Text
                                              fontSize="sm"
                                              fontWeight="600"
                                              color="gray.700"
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
                                              >
                                                Promo:{" "}
                                                {order.applied_promotion_code}
                                              </Badge>
                                            )}
                                            {order.applied_gift_card_code && (
                                              <Badge
                                                colorScheme="purple"
                                                variant="solid"
                                                fontSize="xs"
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

              {/* Enhanced Pagination */}
              {orders.length > 0 && ordersPagination.totalPages > 1 && (
                <Box
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.200"
                  shadow="sm"
                  display='none'
                >
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.600">
                      Affichage{" "}
                      <Text as="span" fontWeight="600">
                        {(ordersPagination.page - 1) * ordersPagination.limit +
                          1}
                      </Text>{" "}
                      à{" "}
                      <Text as="span" fontWeight="600">
                        {Math.min(
                          ordersPagination.page * ordersPagination.limit,
                          ordersPagination.total
                        )}
                      </Text>{" "}
                      de{" "}
                      <Text as="span" fontWeight="600">
                        {ordersPagination.total}
                      </Text>{" "}
                      ordres
                    </Text>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FaChevronLeft />}
                        onClick={() =>
                          fetchOrders({ page: ordersPagination.page - 1 })
                        }
                        isDisabled={ordersPagination.page <= 1 || ordersLoading}
                        borderRadius="lg"
                      >
                        Précédente
                      </Button>
                      <HStack spacing={1}>
                        {Array.from(
                          { length: Math.min(5, ordersPagination.totalPages) },
                          (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                size="sm"
                                variant={
                                  page === ordersPagination.page
                                    ? "solid"
                                    : "outline"
                                }
                                colorScheme={
                                  page === ordersPagination.page
                                    ? "orange"
                                    : "gray"
                                }
                                onClick={() => fetchOrders({ page })}
                                isDisabled={ordersLoading}
                                borderRadius="lg"
                              >
                                {page}
                              </Button>
                            );
                          }
                        )}
                      </HStack>
                      <Button
                        size="sm"
                        variant="outline"
                        rightIcon={<FaChevronRight />}
                        onClick={() =>
                          fetchOrders({ page: ordersPagination.page + 1 })
                        }
                        isDisabled={
                          ordersPagination.page >=
                            ordersPagination.totalPages || ordersLoading
                        }
                        borderRadius="lg"
                      >
                        Suivante
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              )}

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
                      Veuillez fournir une raison pour l'annulation de cette
                      commande :
                    </Text>
                    <FormControl
                      isRequired
                      isInvalid={!!cancelOrderModal.error}
                    >
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
                      <FormErrorMessage>
                        {cancelOrderModal.error}
                      </FormErrorMessage>
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
                      Soumettre une demande
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </VStack>
          </>
        );

      case "shipping":
        return (
          <>
            <Box
              bg="rgb(255,255,255)"
              p={6}
              borderRadius="xl"
              border="1px solid rgba(145, 158, 171, 0.2)"
            >
              <VStack spacing={6} align="stretch">
                <Button
                  size="sm"
                  color="rgba(223, 240, 255, 1)"
                  rounded="10px"
                  border="1px solid rgba(148, 145, 171, 0.2)"
                  // p="18px 18px"
                  w="100%"
                  bg="#3167a8ff"
                  _hover={{ color: "white" }}
                  fontWeight={"500"}
                  fontFamily="Airbnb Cereal VF"
                  onClick={onOpen}
                  display={{ base: "flex", md: "none" }}
                >
                  Ajouter une nouvelle adresse
                </Button>

                <Flex justify="space-between" align="center">
                  <Text fontSize="xl" fontWeight="500" color="gray.800">
                    Adresses de livraison
                  </Text>
                  <Button
                    size="sm"
                    color="rgba(223, 240, 255, 1)"
                    rounded="10px"
                    border="1px solid rgba(148, 145, 171, 0.2)"
                    p="18px 18px"
                    bg="#3167a8ff"
                    _hover={{ color: "white" }}
                    fontWeight={"500"}
                    fontFamily="Airbnb Cereal VF"
                    onClick={onOpen}
                    display={{ base: "none", md: "flex" }}
                  >
                    Ajouter une nouvelle adresse
                  </Button>
                </Flex>

                {addresses && addresses.length > 0 ? (
                  <SimpleGrid
                    columns={{ base: 1, md: 3 }}
                    spacing={4}
                    align="stretch"
                  >
                    {addresses.map((address, index) => (
                      <Box
                        key={index}
                        p={4}
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        borderRadius="xl"
                        position="relative"
                        _hover={{ shadow: "md" }}
                        transition="all 0.2s"
                      >
                        {address.is_default && (
                          <Badge
                            position="absolute"
                            top={2}
                            right={2}
                            fontSize="xs"
                            textDecoration={"none"}
                            textTransform={"none"}
                            py={1}
                            px={4}
                            rounded={"lg"}
                            bg="#3167a8ff"
                            color={"gray.100"}
                            fontWeight={"500"}
                          >
                            Défaut
                          </Badge>
                        )}

                        <VStack align="flex-start" spacing={2}>
                          <HStack spacing={2}>
                            <Icon as={FaMapMarkerAlt} color="blue.500" />
                            <Text
                              fontWeight="600"
                              fontSize="md"
                              color="gray.800"
                            >
                              {address.label}
                            </Text>
                          </HStack>

                          <Text fontSize="sm" color="gray.600">
                            {address.street}
                          </Text>

                          <Text fontSize="sm" color="gray.600">
                            {address.city}, {address.postal_code}
                          </Text>

                          <Text fontSize="sm" color="gray.600">
                            {address.country}
                          </Text>

                          {address.phone && (
                            <HStack spacing={2}>
                              <Icon as={FaPhone} color="gray.500" size="sm" />
                              <Text fontSize="sm" color="gray.600">
                                {address.phone}
                              </Text>
                            </HStack>
                          )}
                        </VStack>

                        <HStack spacing={2} mt={4}>
                          <Button
                            size="sm"
                            color="rgba(223, 240, 255, 1)"
                            rounded="10px"
                            border="1px solid rgba(148, 145, 171, 0.2)"
                            bg="#3167a8ff"
                            px={6}
                            py={0}
                            _hover={{ color: "white" }}
                            fontWeight={"500"}
                            fontFamily="Airbnb Cereal VF"
                            onClick={() =>
                              openEditAddressModal(address, address.label)
                            }
                          >
                            Modifier
                          </Button>
                          {!address.is_default && (
                            <Button
                              size="sm"
                              color="rgba(223, 240, 255, 1)"
                              rounded="10px"
                              border="1px solid rgba(148, 145, 171, 0.2)"
                              bg="#3167a8ff"
                              _hover={{ color: "white" }}
                              fontWeight={"500"}
                              fontFamily="Airbnb Cereal VF"
                              onClick={() => handleDeleteAddress(address.label)}
                            >
                              Supprimer
                            </Button>
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={12}>
                    <Icon
                      as={FaMapMarkerAlt}
                      size="4xl"
                      color="gray.300"
                      mb={4}
                    />
                    <Text fontSize="lg" color="gray.500" mb={2}>
                      Aucune adresse enregistrée
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      Ajoutez une adresse pour faciliter l'expédition.
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>

            {/* Add Address Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <ModalOverlay />
              <ModalContent rounded="2xl">
                <ModalHeader>Ajouter une nouvelle adresse</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Étiquette d'adresse
                      </FormLabel>
                      <Input
                        name="label"
                        value={newAddress.label}
                        onChange={handleAddressChange}
                        placeholder="e.g., Home, Work, Office"
                        borderRadius="md"
                        isRequired={true}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Adresse de la rue
                      </FormLabel>
                      <Input
                        name="street"
                        value={newAddress.street}
                        onChange={handleAddressChange}
                        placeholder="Entrez l'adresse postale"
                        borderRadius="md"
                      />
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Ville
                        </FormLabel>
                        <Input
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          placeholder="Entrez ville"
                          borderRadius="md"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Code Postal
                        </FormLabel>
                        <Input
                          name="postal_code"
                          value={newAddress.postal_code}
                          onChange={handleAddressChange}
                          placeholder="Entrez le code postal"
                          borderRadius="md"
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isRequired>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Pays
                      </FormLabel>
                      <Select
                        name="country"
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        placeholder="Sélectionnez le pays"
                        borderRadius="md"
                      >
                        <option value="France">France</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Numéro de téléphone
                      </FormLabel>
                      <Input
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="Enter phone number"
                        borderRadius="md"
                      />
                    </FormControl>

                    <FormControl>
                      <Checkbox
                        name="is_default"
                        isChecked={newAddress.is_default}
                        onChange={handleAddressChange}
                        colorScheme="orange"
                      >
                        Définir comme adresse par défaut
                      </Checkbox>
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button
                    variant="ghost"
                    mr={3}
                    onClick={onClose}
                    fontWeight="400"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    color="rgba(223, 240, 255, 1)"
                    rounded="10px"
                    border="1px solid rgba(148, 145, 171, 0.2)"
                    p="18px 18px"
                    bg="#3167a8ff"
                    _hover={{ color: "white" }}
                    fontWeight={"500"}
                    fontFamily="Airbnb Cereal VF"
                    onClick={handleAddAddress}
                  >
                    Ajouter une adresse
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Edit Address Modal */}
            <Modal
              isOpen={editAddressModal.isOpen}
              onClose={() =>
                setEditAddressModal((prev) => ({ ...prev, isOpen: false }))
              }
              size="lg"
            >
              <ModalOverlay />
              <ModalContent rounded="2xl">
                <ModalHeader>Edit Address</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl
                      isRequired
                      isInvalid={!!editAddressModal.errors.label}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Étiquette d'adresse
                      </FormLabel>
                      <Input
                        name="label"
                        value={editAddressModal.values.label}
                        onChange={handleEditAddressChange}
                        placeholder="e.g., Home, Work, Office"
                        borderRadius="md"
                      />
                      <FormErrorMessage>
                        {editAddressModal.errors.label}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={!!editAddressModal.errors.street}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Adresse de la rue
                      </FormLabel>
                      <Input
                        name="street"
                        value={editAddressModal.values.street}
                        onChange={handleEditAddressChange}
                        placeholder="Entrez l'adresse postale"
                        borderRadius="md"
                      />
                      <FormErrorMessage>
                        {editAddressModal.errors.street}
                      </FormErrorMessage>
                    </FormControl>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl
                        isRequired
                        isInvalid={!!editAddressModal.errors.city}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Ville
                        </FormLabel>
                        <Input
                          name="city"
                          value={editAddressModal.values.city}
                          onChange={handleEditAddressChange}
                          placeholder="Entrez Ville"
                          borderRadius="md"
                        />
                        <FormErrorMessage>
                          {editAddressModal.errors.city}
                        </FormErrorMessage>
                      </FormControl>

                      <FormControl
                        isRequired
                        isInvalid={!!editAddressModal.errors.postal_code}
                      >
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Code Postal
                        </FormLabel>
                        <Input
                          name="postal_code"
                          value={editAddressModal.values.postal_code}
                          onChange={handleEditAddressChange}
                          placeholder="Entrez le code postal"
                          borderRadius="md"
                        />
                        <FormErrorMessage>
                          {editAddressModal.errors.postal_code}
                        </FormErrorMessage>
                      </FormControl>
                    </SimpleGrid>

                    <FormControl
                      isRequired
                      isInvalid={!!editAddressModal.errors.country}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Pays
                      </FormLabel>
                      <Select
                        name="country"
                        value={editAddressModal.values.country}
                        onChange={handleEditAddressChange}
                        placeholder="Sélectionnez le pays"
                        borderRadius="md"
                      >
                        <option value="France">France</option>
                      </Select>
                      <FormErrorMessage>
                        {editAddressModal.errors.country}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      isInvalid={!!editAddressModal.errors.phone}
                    >
                      <FormLabel
                        fontSize="sm"
                        fontWeight="600"
                        color="gray.700"
                      >
                        Numéro de téléphone
                      </FormLabel>
                      <Input
                        name="phone"
                        value={editAddressModal.values.phone}
                        onChange={handleEditAddressChange}
                        placeholder="Entrez Numéro de téléphone"
                        borderRadius="md"
                      />
                      <FormErrorMessage>
                        {editAddressModal.errors.phone}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <Checkbox
                        name="is_default"
                        isChecked={editAddressModal.values.is_default}
                        onChange={handleEditAddressChange}
                        colorScheme="orange"
                      >
                        Définir comme adresse par défaut
                      </Checkbox>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    mr={3}
                    onClick={() =>
                      setEditAddressModal((prev) => ({
                        ...prev,
                        isOpen: false,
                      }))
                    }
                    fontWeight={"400"}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    color="rgba(223, 240, 255, 1)"
                    rounded="10px"
                    border="1px solid rgba(148, 145, 171, 0.2)"
                    p="18px 18px"
                    bg="#3167a8ff"
                    _hover={{ color: "white" }}
                    fontWeight={"500"}
                    fontFamily="Airbnb Cereal VF"
                    onClick={handleEditAddressSubmit}
                  >
                    Enregistrer les modifications
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        );

      case "settings":
        return (
          <>
            <Box
              bg="rgb(255,255,255)"
              p={6}
              borderRadius="2xl"
              fontFamily="Airbnb Cereal VF"
              border="1px solid rgba(145, 158, 171, 0.2)"
              // border="1px"
              // borderColor="gray.200"
            >
              <VStack spacing={6} align="stretch">
                <Text
                  fontSize="lg"
                  fontWeight="500"
                  color="rgba(10, 9, 9, 1)"
                  fontFamily="Airbnb Cereal VF"
                >
                  Paramètres du compte
                </Text>

                <VStack spacing={4} align="stretch">
                  <Box
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={1}>
                        <Text
                          fontWeight="500"
                          fontFamily="Airbnb Cereal VF"
                          color="rgba(67, 76, 80, 1)"
                        >
                          Notifications par e-mail
                        </Text>
                        <Text
                          fontSize="sm"
                          color="rgba(67, 76, 80, 1)"
                          fontFamily="Airbnb Cereal VF"
                        >
                          Recevez des mises à jour sur vos commandes et votre
                          compte
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        color="rgb(99, 115, 129)"
                        rounded="50px"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        p="18px 18px"
                        bg="#fff"
                        fontWeight={"500"}
                        fontFamily="Airbnb Cereal VF"
                        isLoading={emailNotifLoading}
                        onClick={handleToggleEmailNotifications}
                      >
                        {emailNotificationsEnabled ? "Activé" : "Désactivé"}
                      </Button>
                    </HStack>
                  </Box>

                  <Box
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="500">Mot de passe</Text>
                        <Text fontSize="sm" color="gray.500">
                          Changer le mot de passe de votre compte
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        color="rgb(99, 115, 129)"
                        rounded="50px"
                        border="1px solid rgba(145, 158, 171, 0.2)"
                        p="18px 18px"
                        bg="#fff"
                        fontWeight={"500"}
                        fontFamily="Airbnb Cereal VF"
                        onClick={openChangePasswordModal}
                      >
                        Changement
                      </Button>
                    </HStack>
                  </Box>

                  <Box
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="500">Profile Picture</Text>
                        <Text fontSize="sm" color="gray.500">
                         Télécharger une nouvelle photo de profil
                        </Text>
                        <HStack spacing={4} mt={2}>
                          <Avatar
                            size="lg"
                            name={`${customer?.first_name} ${customer?.last_name}`}
                            src={customer?.profile_picture_url}
                          />
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleProfilePictureChange}
                          />
                          <Button
                            size="sm"
                            color="rgb(99, 115, 129)"
                            rounded="50px"
                            border="1px solid rgba(145, 158, 171, 0.2)"
                            p="18px 18px"
                            bg="#fff"
                            fontWeight={"500"}
                            fontFamily="Airbnb Cereal VF"
                            onClick={handleCustomFileClick}
                          >
                           Télécharger une photo
                          </Button>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>

                  <Box
                    p={4}
                    border="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                  >
                    <HStack justify="space-between">
                      <VStack align="flex-start" spacing={1}>
                        <Text fontWeight="500">Delete Account</Text>
                        <Text fontSize="sm" color="gray.500">
                          Réussir à désactiver votre compte
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        rounded="full"
                        onClick={openDeleteAccountModal}
                      >
                        Désactiver
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </VStack>
            </Box>

            {/* Change password modal */}
            <Modal
              isOpen={changePasswordModal.isOpen}
              onClose={() =>
                setChangePasswordModal((prev) => ({ ...prev, isOpen: false }))
              }
              size="md"
            >
              <ModalOverlay />
              <ModalContent rounded="2xl">
                <ModalHeader
                  fontFamily={"Airbnb Cereal VF"}
                  fontSize={"lg"}
                  fontWeight={"500"}
                >
                  Changer le mot de passe
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl
                      isRequired
                      isInvalid={!!changePasswordModal.errors.currentPassword}
                    >
                      <FormLabel
                        color="rgb(99, 115, 129)"
                        fontWeight={"normal"}
                      >
                        Mot de passe actuel
                      </FormLabel>
                      <Input
                        name="currentPassword"
                        type="password"
                        border="1.5px solid rgba(145, 158, 171, 0.2)"
                        rounded="25px"
                        fontSize="sm"
                        value={changePasswordModal.currentPassword}
                        onChange={handleChangePasswordField}
                        placeholder="Entrez le mot de passe actuel"
                      />
                      <FormErrorMessage>
                        {changePasswordModal.errors.currentPassword}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={!!changePasswordModal.errors.newPassword}
                    >
                      <FormLabel
                        color="rgb(99, 115, 129)"
                        fontWeight={"normal"}
                      >
                        Nouveau mot de passe
                      </FormLabel>
                      <Input
                        name="newPassword"
                        type="password"
                        border="1.5px solid rgba(145, 158, 171, 0.2)"
                        rounded="25px"
                        fontSize="sm"
                        value={changePasswordModal.newPassword}
                        onChange={handleChangePasswordField}
                        placeholder="Entrez un nouveau mot de passe"
                      />
                      <FormErrorMessage>
                        {changePasswordModal.errors.newPassword}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      isInvalid={!!changePasswordModal.errors.confirmPassword}
                    >
                      <FormLabel
                        color="rgb(99, 115, 129)"
                        fontWeight={"normal"}
                      >
                        Confirmer le nouveau mot de passe
                      </FormLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        border="1.5px solid rgba(145, 158, 171, 0.2)"
                        rounded="25px"
                        fontSize="sm"
                        value={changePasswordModal.confirmPassword}
                        onChange={handleChangePasswordField}
                        placeholder="Confirmer le nouveau mot de passe"
                      />
                      <FormErrorMessage>
                        {changePasswordModal.errors.confirmPassword}
                      </FormErrorMessage>
                    </FormControl>
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    fontWeight={"500"}
                    mr={3}
                    onClick={() =>
                      setChangePasswordModal((prev) => ({
                        ...prev,
                        isOpen: false,
                      }))
                    }
                  >
                    Annuler
                  </Button>
                  <Button
                    bg="#fff"
                    color="rgba(48, 51, 57, 1)"
                    fontSize={"sm"}
                    border="1.5px solid rgba(145, 158, 171, 0.2)"
                    rounded="full"
                    fontWeight={"500"}
                    onClick={handleChangePasswordSubmit}
                    isLoading={changePasswordModal.loading}
                  >
                    Changer le mot de passe
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            {/* Delete Account Modal */}
            <Modal
              isOpen={deleteAccountModal}
              onClose={closeDeleteAccountModal}
              isCentered
            >
              <ModalOverlay />
              <ModalContent rounded="2xl">
                <ModalHeader>Désactiver le compte</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>
                    Êtes-vous sûr de vouloir désactiver votre compte ? Cette action peut être annulée en contactant le support.
                  </Text>
                </ModalBody>
                <ModalFooter>
                  <Button
                    variant="ghost"
                    mr={3}
                    onClick={closeDeleteAccountModal}
                  >
                    Annuler
                  </Button>
                  <Button
                    colorScheme="red"
                    rounded="full"
                    onClick={handleDeleteAccount}
                    isLoading={deleteLoading}
                  >
                    Désactiver
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        );

      default:
        return (
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <VStack spacing={6} align="stretch">
              <Text fontSize="xl" fontWeight="600" color="gray.800">
                {menuItems.find((item) => item.key === activeTab)?.label ||
                  "Coming Soon"}
              </Text>
              <Box textAlign="center" py={12}>
                <Icon as={FaCog} size="4xl" color="gray.300" mb={4} />
                <Text fontSize="lg" color="gray.500" mb={2}>
                  Cette section est en cours de développement
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Nous travaillons dur pour vous proposer cette fonctionnalité prochainement
                </Text>
              </Box>
            </VStack>
          </Box>
        );
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <Box minH="100vh" bg="rgba(252, 252, 253, 1)" py={8}>
          <Container maxW="8xl">
            <VStack spacing={6} align="stretch">
              <Skeleton height="60px" borderRadius="md" />
              <SimpleGrid columns={{ base: 1, lg: 4 }} spacing={6}>
                <Box>
                  <Skeleton height="500px" borderRadius="md" />
                </Box>
                <Box gridColumn={{ base: "1", lg: "2 / 5" }}>
                  <SkeletonText noOfLines={20} spacing="4" />
                </Box>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box minH="100vh" bg="rgba(252, 252, 253, 1)" py={4}>
        <Container maxW="8xl">
          {/* Breadcrumb */}
          <Breadcrumb mb={6} fontSize="sm" color="gray.600">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Maison</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Account</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Grid templateColumns={{ base: "1fr", lg: "250px 1fr" }} gap={6}>
            {/* Sidebar */}
            <GridItem>
              <VStack spacing={0} align="stretch">
                {/* User Info Card */}
                <Box
                  bg="rgb(255,255,255)"
                  p={4}
                  borderRadius="2xl"
                  mb={4}
                  border="1px solid rgba(145, 158, 171, 0.2)"
                >
                  <HStack spacing={3} align="center">
                    <Avatar
                      size="md"
                      name={`${customer?.first_name} ${customer?.last_name}`}
                      bg="purple.500"
                      color="white"
                      src={customer?.profile_picture_url}
                    />
                    <VStack align="flex-start" spacing={0}>
                      <Text
                        fontWeight="600"
                        fontSize="md"
                        color="gray.800"
                        fontFamily="Airbnb Cereal VF"
                      >
                        {customer?.first_name} {customer?.last_name}
                      </Text>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontFamily="Airbnb Cereal VF"
                      >
                        {customer?.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* Navigation Menu */}
                <Box
                  bg="rgba(255,255,255, 1)"
                  borderRadius="2xl"
                  border="1px solid rgba(145, 158, 171, 0.2)"
                >
                  <VStack spacing={0} align="stretch">
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      p={3}
                      borderBottom="1px"
                      borderColor="gray.100"
                      color="gray.700"
                      fontFamily="Airbnb Cereal VF"
                    >
                      Account
                    </Text>

                    {menuItems.map((item, index) => (
                      <Box
                        key={item.key}
                        bg={
                          activeTab === item.key ? "transparent" : "transparent"
                        }
                        mt={1}
                        px={6}
                        py={2}
                        cursor="pointer"
                        _hover={{
                          bg: activeTab === item.key ? "gray.50" : "gray.50",
                        }}
                        onClick={() => setActiveTab(item.key)}
                        fontFamily="Airbnb Cereal VF"
                      >
                        <HStack spacing={3}>
                          <Icon
                            as={item.icon}
                            size="md"
                            color={activeTab === item.key ? "black" : "black"}
                          />
                          <Text
                            fontSize="sm"
                            fontWeight={
                              activeTab === item.key ? "500" : "normal"
                            }
                            color={activeTab === item.key ? "blue" : "gray.700"}
                            fontFamily="Airbnb Cereal VF"
                          >
                            {item.label}
                          </Text>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </GridItem>

            {/* Main Content */}
            <GridItem>{renderTabContent()}</GridItem>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
