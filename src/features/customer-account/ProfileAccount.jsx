import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Icon,
  useDisclosure,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { FaCog, FaChevronDown, FaUser, } from "react-icons/fa";
import { GiBeachBag } from "react-icons/gi";
import { GrLocation } from "react-icons/gr";
import { IoSettingsOutline } from "react-icons/io5";
import { FaClipboardCheck, FaCreditCard, FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";
import OverviewTab from "./components/OverviewTab";
import OrdersTab from "./components/OrdersTab";
import ShippingTab from "./components/ShippingTab";
import SettingsTab from "./components/SettingsTab";
import { useCustomerAuth } from "./auth-context/customerAuthContext";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";
import { customToastContainerStyle } from "../../commons/toastStyles";
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
    { key: "overview", icon: FaUser, label: "Aperçu" },
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
          <OverviewTab
            customer={customer}
            editMode={editMode}
            setEditMode={setEditMode}
            form={form}
            setForm={setForm}
            errors={errors}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            updating={updating}
          />
        );

      case "orders":
        return (
          <OrdersTab
            orders={orders}
            ordersLoading={ordersLoading}
            ordersError={ordersError}
            ordersFilters={ordersFilters}
            setOrdersFilters={setOrdersFilters}
            fetchOrders={fetchOrders}
            expandedOrders={expandedOrders}
            toggleOrderExpansion={toggleOrderExpansion}
            getStatusColor={getStatusColor}
            getStatusProgress={getStatusProgress}
            getStatusTimeline={getStatusTimeline}
            formatDate={formatDate}
            getStatusDisplayName={getStatusDisplayName}
            hasCustomizations={hasCustomizations}
            ordersPagination={ordersPagination}
            cancelOrderModal={cancelOrderModal}
            closeCancelOrderModal={closeCancelOrderModal}
            setCancelOrderModal={setCancelOrderModal}
            openCancelOrderModal={openCancelOrderModal}
            handleSubmitCancelOrder={handleSubmitCancelOrder}
            handleCompletePayment={handleCompletePayment}
          />
        );

      case "shipping":
        return (
          <ShippingTab
            addresses={addresses}
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            newAddress={newAddress}
            handleAddressChange={handleAddressChange}
            handleAddAddress={handleAddAddress}
            editAddressModal={editAddressModal}
            setEditAddressModal={setEditAddressModal}
            openEditAddressModal={openEditAddressModal}
            handleEditAddressChange={handleEditAddressChange}
            handleEditAddressSubmit={handleEditAddressSubmit}
            handleDeleteAddress={handleDeleteAddress}
          />
        );

      case "settings":
        return (
          <SettingsTab
            customer={customer}
            emailNotificationsEnabled={emailNotificationsEnabled}
            emailNotifLoading={emailNotifLoading}
            handleToggleEmailNotifications={handleToggleEmailNotifications}
            changePasswordModal={changePasswordModal}
            setChangePasswordModal={setChangePasswordModal}
            handleChangePasswordField={handleChangePasswordField}
            handleChangePasswordSubmit={handleChangePasswordSubmit}
            openChangePasswordModal={openChangePasswordModal}
            fileInputRef={fileInputRef}
            handleProfilePictureChange={handleProfilePictureChange}
            handleCustomFileClick={handleCustomFileClick}
            deleteAccountModal={deleteAccountModal}
            openDeleteAccountModal={openDeleteAccountModal}
            closeDeleteAccountModal={closeDeleteAccountModal}
            handleDeleteAccount={handleDeleteAccount}
            deleteLoading={deleteLoading}
          />
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

  // Rest of your component rendering logic
  return (
    <>
      <Navbar />
      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 6 }} py={8}>
        {/* Mobile view: dropdown menu */}
        <Box display={{ base: "block", md: "none" }} mb={6}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaChevronDown />}
              w="full"
              textAlign="left"
            >
              {menuItems.find((item) => item.key === activeTab)?.label || "Menu"}
            </MenuButton>
            <MenuList>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  fontWeight={activeTab === item.key ? "600" : "normal"}
                >
                  {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

        {/* Desktop view: horizontal tabs */}
        <HStack
          spacing={6}
          display={{ base: "none", md: "flex" }}
          borderBottom="1px"
          borderColor="gray.200"
          mb={6}
          pb={2}
          overflowX="auto"
        >
          {menuItems.map((item) => (
            <Button
              key={item.key}
              variant="ghost"
              color={activeTab === item.key ? "blue.600" : "gray.600"}
              fontWeight={activeTab === item.key ? "600" : "normal"}
              borderBottom={activeTab === item.key ? "2px" : "0"}
              borderColor="blue.500"
              borderRadius="0"
              onClick={() => setActiveTab(item.key)}
              _hover={{ color: "blue.500" }}
              px={2}
            >
              {item.label}
            </Button>
          ))}
        </HStack>

        {/* Tab content */}
        {renderTabContent()}
      </Box>
      <Footer />
    </>
  );
}