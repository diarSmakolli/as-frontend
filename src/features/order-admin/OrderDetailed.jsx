import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  Badge,
  Divider,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  chakra,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useColorModeValue,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Icon,
  FormControl,
  FormLabel,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
  MenuDivider,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { homeService } from "../home/services/homeService";
import {
  ArrowBackIcon,
  CalendarIcon,
  EmailIcon,
  PhoneIcon,
  CloseIcon,
  CheckIcon,
} from "@chakra-ui/icons";
import {
  FaUser,
  FaTruck,
  FaCreditCard,
  FaMapMarkerAlt,
  FaClipboardList,
  FaReceipt,
  FaExclamationTriangle,
} from "react-icons/fa";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import SettingsModal from "../administration/components/settings/SettingsModal";
import Loader from "../../commons/Loader";
import { FiMoreVertical, FiDownload, FiFileText, FiPlus } from "react-icons/fi";
import { useAuth } from "../administration/authContext/authContext";

export default function OrderDetailed() {
  const { orderId } = useParams();
  const { account } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [currentAction, setCurrentAction] = useState("");
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [staffNote, setStaffNote] = useState("");
  const [addNoteLoading, setAddNoteLoading] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [deliveryNoteLoading, setDeliveryNoteLoading] = useState(false);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelNote, setCancelNote] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [docActionLoading, setDocActionLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const openCancelModal = () => {
    setCancelNote("");
    setIsCancelModalOpen(true);
  };

  const allowedStatuses = [
    "pending",
    "processing",
    "paid",
    "shipped",
    "on_delivery",
    "in_transit",
    "in_customs",
    "completed",
    "cancelled",
    "pending_payment",
    "order_cancel_request",
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await homeService.getOrderDetailsAdmin(orderId);
        setOrder(res.data);
      } catch (error) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      case "processing":
        return "blue";
      case "pending":
        return "yellow";
      case "shipped":
        return "purple";
      case "paid":
        return "green";
      default:
        return "gray";
    }
  };

  if (loading)
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#f4f6fa">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );

  if (!order)
    return (
      <Flex minH="100vh" align="center" justify="center" bg="#f4f6fa">
        <Text color="gray.500">Order not found.</Text>
      </Flex>
    );

  const handleCancellationAction = async (action) => {
    setActionLoading(true);
    try {
      const requestData = {
        order_id: order.id,
        action: action,
        admin_note: adminNote || "",
      };

      // Add refund amount if it's an approval and amount is specified
      if (action === "approve" && refundAmount) {
        requestData.refund_amount = parseFloat(refundAmount);
      }

      const response = await homeService.handleCancellationRequest(requestData);

      toast({
        title: "Success",
        description: response.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Refresh order data
      await fetchOrder();

      // Reset form and close modal
      setAdminNote("");
      setRefundAmount("");
      setCurrentAction("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to process cancellation request",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openActionModal = (action) => {
    setCurrentAction(action);
    onOpen();
  };

  const handleModalClose = () => {
    if (!actionLoading) {
      setAdminNote("");
      setRefundAmount("");
      setCurrentAction("");
      onClose();
    }
  };

  // Add Staff Note handler
  const handleAddStaffNote = async () => {
    if (!staffNote.trim()) return;
    setAddNoteLoading(true);
    try {
      await homeService.addStaffNoteToOrder({
        order_id: order.id,
        note: staffNote,
      });
      toast({
        title: "Note added",
        description: "Staff note has been added to the order.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setStaffNote("");
      setIsAddNoteOpen(false);
      // Refresh order to show new notes
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add staff note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setAddNoteLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!newStatus) return;
    setStatusLoading(true);
    try {
      await homeService.updateOrderStatus({
        order_id: order.id,
        new_status: newStatus,
        note: statusNote,
      });
      toast({
        title: "Order status updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsStatusModalOpen(false);
      setNewStatus("");
      setStatusNote("");
      // Refresh order
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleGenerateDeliveryNote = async () => {
    setDeliveryNoteLoading(true);
    try {
      const result = await homeService.generateDeliveryNote(order.id);

      toast({
        title: "Delivery Note Generated",
        description: "The delivery note has been generated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Open the PDF in a new tab
      window.open(result.url, "_blank");

      // Refresh order data to show the new document
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate delivery note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeliveryNoteLoading(false);
    }
  };

  const handleAdminCancelOrder = async () => {
    setCancelLoading(true);
    try {
      const admin_id = account.id;
      const admin_name = account.first_name + " " + account.last_name;

      await homeService.cancelOrderByAdmin({
        order_id: order.id,
        admin_id,
        admin_name,
        admin_note: cancelNote,
      });

      toast({
        title: "Order Cancelled",
        description: "The order has been cancelled successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsCancelModalOpen(false);
      // Refresh order data
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCancelLoading(false);
    }
  };

  // SEND TO CUSTOMER EMAILS
  const handleGenerateProInvoice = async () => {
    setDocActionLoading(true);
    try {
      const result = await homeService.generateProInvoice(order.id);
      toast({
        title: "Proforma Invoice Generated",
        description: "The proforma invoice has been generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.open(result.url, "_blank");
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate proforma invoice.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleGenerateCreditNote = async () => {
    setDocActionLoading(true);
    try {
      const result = await homeService.generateCreditNote(order.id);
      toast({
        title: "Credit Note Generated",
        description: "The credit note has been generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.open(result.url, "_blank");
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate credit note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleGenerateStornoBill = async () => {
    setDocActionLoading(true);
    try {
      const result = await homeService.generateStornoBill(order.id);
      toast({
        title: "Storno Bill Generated",
        description: "The storno bill has been generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.open(result.url, "_blank");
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate storno bill.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    setDocActionLoading(true);
    try {
      const result = await homeService.generateInvoice(order.id);
      toast({
        title: "Invoice Generated",
        description: "The invoice has been generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      window.open(result.url, "_blank");
      const res = await homeService.getOrderDetailsAdmin(orderId);
      setOrder(res.data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate invoice.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  // Email sending handlers
  const handleSendPaidInvoiceEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendPaidInvoiceEmail(order.id);
      toast({
        title: "Paid Invoice Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send paid invoice email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendProcessingEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendProcessingEmail(order.id);
      toast({
        title: "Processing Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send processing email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendShippedEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendShippedEmail(order.id);
      toast({
        title: "Shipped Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send shipped email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendInCustomsEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendInCustomsEmail(order.id);
      toast({
        title: "In Customs Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send in customs email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendOnDeliveryEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendOnDeliveryEmail(order.id);
      toast({
        title: "On Delivery Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send on delivery email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendDeliveredEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendDeliveredEmail(order.id);
      toast({
        title: "Delivered Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send delivered email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendCancelledEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendCancelledEmail(order.id);
      toast({
        title: "Cancelled Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send cancelled email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const handleSendRefundedEmail = async () => {
    setDocActionLoading(true);
    try {
      await homeService.sendRefundedEmail(order.id);
      toast({
        title: "Refunded Email Sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to send refunded email.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDocActionLoading(false);
    }
  };

  const isRefundRequest = order?.cancellation_reason?.includes("REFUND");

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

      <Box ml={{ base: 0, md: 60 }} p={{ base: 4, md: 8 }}>
        {/* Header */}
        <Flex align="center" justify="space-between" mb={8}>
          <HStack spacing={4}>
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              onClick={() => navigate(-1)}
              colorScheme="blue"
              borderRadius="md"
            >
              Back to Orders
            </Button>
            <Divider orientation="vertical" height="24px" />
            <VStack align="start" spacing={0}>
              <Heading size="lg" color="gray.800" fontWeight="700">
                Order {order.order_number}
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Order ID: {order.id} • Created{" "}
                {new Date(order.created_at).toLocaleDateString()}
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={3}>
            <Badge
              colorScheme={getStatusColor(order.status)}
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
              fontWeight="600"
            >
              {order.status?.toUpperCase()}
            </Badge>
            {/* Three dots menu */}
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FiMoreVertical />}
                variant="ghost"
                size="md"
              />
              <MenuList>
                <MenuItem onClick={() => setIsStatusModalOpen(true)}>
                  Change Order Status
                </MenuItem>
                <MenuItem onClick={() => setIsAddNoteOpen(true)}>
                  Add Staff Note
                </MenuItem>
                <MenuItem
                  onClick={handleGenerateDeliveryNote}
                  isDisabled={deliveryNoteLoading}
                  icon={
                    deliveryNoteLoading ? <Spinner size="sm" /> : <FiFileText />
                  }
                >
                  {deliveryNoteLoading
                    ? "Generating..."
                    : "Generate Delivery Note"}
                </MenuItem>
                <MenuItem
                  onClick={openCancelModal}
                  icon={<CloseIcon color="red.500" />}
                  isDisabled={
                    order.status === "cancelled" || order.status === "completed"
                  }
                >
                  Cancel Order
                </MenuItem>
                {/* SEND EMAILS TO CUSTOMER FOR STATUSES */}
                <MenuItem
                  onClick={handleGenerateProInvoice}
                  isDisabled={docActionLoading}
                >
                  Generate Proforma Invoice
                </MenuItem>
                <MenuItem
                  onClick={handleGenerateCreditNote}
                  isDisabled={docActionLoading}
                >
                  Generate Credit Note
                </MenuItem>
                <MenuItem
                  onClick={handleGenerateStornoBill}
                  isDisabled={docActionLoading}
                >
                  Generate Storno Bill
                </MenuItem>
                <MenuItem
                  onClick={handleGenerateInvoice}
                  isDisabled={docActionLoading}
                >
                  Generate Invoice
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onClick={handleSendPaidInvoiceEmail}
                  isDisabled={docActionLoading}
                >
                  Send Paid Invoice Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendProcessingEmail}
                  isDisabled={docActionLoading}
                >
                  Send Processing Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendShippedEmail}
                  isDisabled={docActionLoading}
                >
                  Send Shipped Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendInCustomsEmail}
                  isDisabled={docActionLoading}
                >
                  Send In Customs Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendOnDeliveryEmail}
                  isDisabled={docActionLoading}
                >
                  Send On Delivery Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendDeliveredEmail}
                  isDisabled={docActionLoading}
                >
                  Send Delivered Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendCancelledEmail}
                  isDisabled={docActionLoading}
                >
                  Send Cancelled Email
                </MenuItem>
                <MenuItem
                  onClick={handleSendRefundedEmail}
                  isDisabled={docActionLoading}
                >
                  Send Refunded Email
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>

        {/* Cancellation Request Alert */}
        {order.status === "order_cancel_request" && (
          <Card
            mb={6}
            boxShadow="md"
            border="2px"
            borderColor="orange.300"
            bg="orange.50"
          >
            <CardHeader>
              <HStack spacing={3}>
                <Avatar
                  icon={<FaExclamationTriangle />}
                  size="sm"
                  bg="orange.500"
                />
                <Heading size="md" color="orange.700">
                  Cancellation Request Pending
                </Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Request Type:</strong>{" "}
                    {isRefundRequest
                      ? "Refund Request"
                      : "Cancellation Request"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Requested At:</strong>{" "}
                    {new Date(order.cancellation_requested_at).toLocaleString()}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Reason:</strong> {order.cancellation_reason}
                  </Text>
                  {isRefundRequest && (
                    <Text fontSize="sm" color="gray.700">
                      <strong>Order Total:</strong> €
                      {parseFloat(order.total).toFixed(2)}
                    </Text>
                  )}
                </Box>

                <Divider />

                <HStack spacing={4} justify="center">
                  <Button
                    leftIcon={<CheckIcon />}
                    colorScheme="green"
                    onClick={() => openActionModal("approve")}
                    size="lg"
                  >
                    Approve {isRefundRequest ? "Refund" : "Cancellation"}
                  </Button>
                  <Button
                    leftIcon={<CloseIcon />}
                    colorScheme="red"
                    variant="outline"
                    onClick={() => openActionModal("reject")}
                    size="lg"
                  >
                    Reject Request
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}

        <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
          <CardHeader>
            <HStack spacing={3} justify="space-between">
              <Heading size="md" color="gray.800">
                Staff Notes
              </Heading>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => setIsAddNoteOpen(true)}
              >
                Add Note
              </Button>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            <VStack align="stretch" spacing={3}>
              {order.staff_notes && order.staff_notes.length > 0 ? (
                order.staff_notes.map((note, idx) => (
                  <Box
                    key={idx}
                    p={3}
                    bg="gray.50"
                    borderRadius="md"
                    borderLeft="4px solid #3182ce"
                  >
                    <Text fontSize="sm" color="gray.800">
                      {note.note}
                    </Text>
                    <HStack spacing={2} mt={1}>
                      <Text fontSize="xs" color="gray.500">
                        By: {note.staff_name || note.staff_id}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {note.created_at
                          ? new Date(note.created_at).toLocaleString()
                          : ""}
                      </Text>
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">No staff notes yet.</Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        {order.documents && (
          <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
            <CardHeader>
              <HStack spacing={3} justify="space-between">
                <Heading size="md" color="gray.800">
                  Order Documents
                </Heading>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="blue"
                  size="sm"
                  onClick={handleGenerateDeliveryNote}
                  isLoading={deliveryNoteLoading}
                  loadingText="Generating..."
                >
                  Generate Delivery Note
                </Button>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <VStack align="stretch" spacing={4}>
                {/* Delivery Notes */}
                {order.documents.delivery_notes &&
                  order.documents.delivery_notes.length > 0 && (
                    <Box>
                      <Heading size="sm" color="blue.600" mb={3}>
                        📄 Delivery Notes (
                        {order.documents.delivery_notes.length})
                      </Heading>
                      <VStack align="stretch" spacing={2}>
                        {order.documents.delivery_notes.map((note, idx) => (
                          <Box
                            key={note.id || idx}
                            p={3}
                            bg="blue.50"
                            borderRadius="md"
                            borderLeft="4px solid #3182ce"
                          >
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1} flex={1}>
                                <HStack spacing={2}>
                                  <Text fontWeight="600" color="blue.700">
                                    {note.filename}
                                  </Text>
                                  <Badge colorScheme="blue" size="sm">
                                    {note.size_mb} MB
                                  </Badge>
                                </HStack>
                                <Text fontSize="xs" color="gray.600">
                                  Generated:{" "}
                                  {new Date(note.generated_at).toLocaleString()}
                                </Text>
                              </VStack>
                              <HStack spacing={2}>
                                <Button
                                  as={Link}
                                  href={note.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                  leftIcon={<FiDownload />}
                                  _hover={{ textDecoration: "none" }}
                                >
                                  Download
                                </Button>
                                <Button
                                  as={Link}
                                  href={note.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  colorScheme="blue"
                                  leftIcon={<FiFileText />}
                                  _hover={{ textDecoration: "none" }}
                                >
                                  View
                                </Button>
                              </HStack>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}

                {/* Invoices (if you add them later) */}
                {order.documents.invoices &&
                  order.documents.invoices.length > 0 && (
                    <Box>
                      <Heading size="sm" color="green.600" mb={3}>
                        📋 Invoices ({order.documents.invoices.length})
                      </Heading>
                      <VStack align="stretch" spacing={2}>
                        {order.documents.invoices.map((invoice, idx) => (
                          <Box
                            key={invoice.id || idx}
                            p={3}
                            bg="green.50"
                            borderRadius="md"
                            borderLeft="4px solid #38a169"
                          >
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1} flex={1}>
                                <HStack spacing={2}>
                                  <Text fontWeight="600" color="green.700">
                                    {invoice.filename}
                                  </Text>
                                  <Badge colorScheme="green" size="sm">
                                    {invoice.size_mb} MB
                                  </Badge>
                                </HStack>
                                <Text fontSize="xs" color="gray.600">
                                  Generated:{" "}
                                  {new Date(
                                    invoice.generated_at
                                  ).toLocaleString()}
                                </Text>
                              </VStack>
                              <HStack spacing={2}>
                                <Button
                                  as={Link}
                                  href={invoice.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  colorScheme="green"
                                  variant="outline"
                                  leftIcon={<FiDownload />}
                                  _hover={{ textDecoration: "none" }}
                                >
                                  Download
                                </Button>
                                <Button
                                  as={Link}
                                  href={invoice.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  size="sm"
                                  colorScheme="green"
                                  leftIcon={<FiFileText />}
                                  _hover={{ textDecoration: "none" }}
                                >
                                  View
                                </Button>
                              </HStack>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}

                {/* Show message if no documents */}
                {(!order.documents.delivery_notes ||
                  order.documents.delivery_notes.length === 0) &&
                  (!order.documents.invoices ||
                    order.documents.invoices.length === 0) && (
                    <Box textAlign="center" py={8}>
                      <Text color="gray.500" mb={4}>
                        No documents generated yet for this order.
                      </Text>
                      <Button
                        leftIcon={<FiFileText />}
                        colorScheme="blue"
                        onClick={handleGenerateDeliveryNote}
                        isLoading={deliveryNoteLoading}
                        loadingText="Generating..."
                      >
                        Generate Your First Delivery Note
                      </Button>
                    </Box>
                  )}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Summary Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
          <Stat
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel color="gray.500">Total Amount</StatLabel>
            <StatNumber color="blue.500" fontSize="2xl">
              €{parseFloat(order.total).toFixed(2)}
            </StatNumber>
            <StatHelpText>Including tax & shipping</StatHelpText>
          </Stat>
          <Stat
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel color="gray.500">Items Count</StatLabel>
            <StatNumber color="green.500" fontSize="2xl">
              {order.items?.length || 0}
            </StatNumber>
            <StatHelpText>Total products</StatHelpText>
          </Stat>
          <Stat
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel color="gray.500">Payment Method</StatLabel>
            <StatNumber color="purple.500" fontSize="lg">
              {order.payment_method === "credit_card" ? "Credit Card" : "Other"}
            </StatNumber>
            {/* <StatHelpText>
              {order.payment_intent_id ? "Stripe" : "Manual"}
            </StatHelpText> */}
          </Stat>
          <Stat
            bg={cardBg}
            p={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <StatLabel color="gray.500">Order Date</StatLabel>
            <StatNumber color="orange.500" fontSize="lg">
              {new Date(order.created_at).toLocaleDateString()}
            </StatNumber>
            <StatHelpText>
              {new Date(order.created_at).toLocaleTimeString()}
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
          {/* Left Column */}
          <GridItem>
            {/* Customer Information */}
            <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack spacing={3}>
                  <Avatar icon={<FaUser />} size="sm" bg="blue.500" />
                  <Heading size="md" color="gray.800">
                    Customer Information
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {order.customer ? (
                  <VStack align="stretch" spacing={3}>
                    <HStack spacing={3}>
                      <Avatar
                        size="lg"
                        name={`${order.customer.first_name} ${order.customer.last_name}`}
                        bg="blue.500"
                      />
                      <VStack align="start" spacing={1}>
                        <Heading size="sm" color="gray.800">
                          {order.customer.first_name} {order.customer.last_name}
                        </Heading>
                        <HStack spacing={1}>
                          <EmailIcon color="gray.500" boxSize={3} />
                          <Text fontSize="sm" color="gray.600">
                            {order.customer.email}
                          </Text>
                        </HStack>
                        {order.customer.phone_primary && (
                          <HStack spacing={1}>
                            <PhoneIcon color="gray.500" boxSize={3} />
                            <Text fontSize="sm" color="gray.600">
                              {order.customer.phone_primary}
                            </Text>
                          </HStack>
                        )}
                      </VStack>
                    </HStack>
                    <HStack spacing={4} pt={2}>
                      <Text fontSize="sm">
                        <strong>Customer Type:</strong>{" "}
                        {order.customer.customer_type}
                      </Text>
                      <Text fontSize="sm">
                        <strong>Status:</strong>
                        <Badge
                          ml={1}
                          colorScheme={
                            order.customer.is_active ? "green" : "red"
                          }
                          size="sm"
                        >
                          {order.customer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </Text>
                    </HStack>
                  </VStack>
                ) : (
                  <Text color="gray.500">
                    No customer information available
                  </Text>
                )}
              </CardBody>
            </Card>

            {/* Order Items */}
            <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack spacing={3}>
                  <Avatar icon={<FaClipboardList />} size="sm" bg="green.500" />
                  <Heading size="md" color="gray.800">
                    Order Items
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={8} align="stretch">
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, itemIndex) => (
                      <Box
                        key={item.id}
                        p={6}
                        borderWidth="2px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        bg="gray.50"
                      >
                        {/* Main Product Summary */}
                        <Card mb={4} boxShadow="sm" bg="white">
                          <CardHeader pb={2}>
                            <Heading size="sm" color="blue.600">
                              Item #{itemIndex + 1} -{" "}
                              {item.product_snapshot?.title ||
                                "Unknown Product"}
                            </Heading>
                          </CardHeader>
                          <CardBody pt={0}>
                            <Box overflowX="auto">
                              <Table variant="simple" size="sm">
                                <Thead bg="blue.50">
                                  <Tr>
                                    <Th color="gray.700" fontWeight="600">
                                      Product Details
                                    </Th>
                                    <Th
                                      color="gray.700"
                                      fontWeight="600"
                                      isNumeric
                                    >
                                      Quantity
                                    </Th>
                                    <Th
                                      color="gray.700"
                                      fontWeight="600"
                                      isNumeric
                                    >
                                      Unit Price
                                    </Th>
                                    <Th
                                      color="gray.700"
                                      fontWeight="600"
                                      isNumeric
                                    >
                                      Total Price
                                    </Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td>
                                      <VStack align="start" spacing={1}>
                                        <Text fontWeight="600" color="gray.800">
                                          {item.product_snapshot?.title ||
                                            "Unknown Product"}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                          SKU:{" "}
                                          {item.product_snapshot?.sku || "N/A"}
                                        </Text>
                                        <Text fontSize="sm" color="gray.500">
                                          Product ID: {item.product_id}
                                        </Text>
                                        {item.product_snapshot?.description && (
                                          <Text
                                            fontSize="sm"
                                            color="gray.600"
                                            noOfLines={2}
                                          >
                                            {item.product_snapshot.description}
                                          </Text>
                                        )}
                                        {item.calculation_source && (
                                          <Badge colorScheme="blue" size="sm">
                                            {item.calculation_source}
                                          </Badge>
                                        )}
                                      </VStack>
                                    </Td>
                                    <Td isNumeric>
                                      <Text
                                        fontWeight="600"
                                        fontSize="lg"
                                        color="blue.600"
                                      >
                                        {item.quantity}
                                      </Text>
                                      {item.added_at && (
                                        <Text fontSize="xs" color="gray.500">
                                          Added:{" "}
                                          {new Date(
                                            item.added_at
                                          ).toLocaleDateString()}
                                        </Text>
                                      )}
                                    </Td>
                                    <Td isNumeric>
                                      <Text fontWeight="600" fontSize="lg">
                                        €
                                        {parseFloat(item.unit_price).toFixed(2)}
                                      </Text>
                                    </Td>
                                    <Td isNumeric>
                                      <Text
                                        fontWeight="bold"
                                        fontSize="xl"
                                        color="green.600"
                                      >
                                        €
                                        {parseFloat(item.total_price).toFixed(
                                          2
                                        )}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {item.quantity} × €
                                        {parseFloat(item.unit_price).toFixed(2)}
                                      </Text>
                                    </Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </Box>
                          </CardBody>
                        </Card>

                        {/* Selected Options Table */}
                        {item.selected_options &&
                          Array.isArray(item.selected_options) &&
                          item.selected_options.length > 0 && (
                            <Card mb={4} boxShadow="sm" bg="white">
                              <CardHeader pb={2}>
                                <HStack spacing={2}>
                                  <Avatar size="xs" bg="blue.500" />
                                  <Heading size="sm" color="blue.600">
                                    Selected Options
                                  </Heading>
                                </HStack>
                              </CardHeader>
                              <CardBody pt={0}>
                                <Box overflowX="auto">
                                  <Table variant="simple" size="sm">
                                    <Thead bg="blue.50">
                                      <Tr>
                                        <Th color="gray.700" fontWeight="600">
                                          Option Name
                                        </Th>
                                        <Th color="gray.700" fontWeight="600">
                                          Selected Value
                                        </Th>
                                        <Th color="gray.700" fontWeight="600">
                                          Option ID
                                        </Th>
                                        <Th color="gray.700" fontWeight="600">
                                          Image
                                        </Th>
                                        <Th
                                          color="gray.700"
                                          fontWeight="600"
                                          isNumeric
                                        >
                                          Price Modifier
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {item.selected_options.map((opt, idx) => (
                                        <Tr key={idx}>
                                          <Td>
                                            <Text
                                              fontWeight="600"
                                              color="gray.800"
                                            >
                                              {opt.option_name}
                                            </Text>
                                          </Td>
                                          <Td>
                                            <Text color="gray.700">
                                              {opt.value_name}
                                            </Text>
                                          </Td>
                                          <Td>
                                            <Text
                                              fontSize="xs"
                                              color="gray.500"
                                              fontFamily="mono"
                                            >
                                              {opt.value_id?.substring(0, 8)}...
                                            </Text>
                                          </Td>
                                          <Td>
                                            {opt.image_url ? (
                                              <Badge
                                                colorScheme="green"
                                                size="sm"
                                              >
                                                📷 Available
                                              </Badge>
                                            ) : (
                                              <Text
                                                fontSize="xs"
                                                color="gray.400"
                                              >
                                                No image
                                              </Text>
                                            )}
                                          </Td>
                                          <Td isNumeric>
                                            {parseFloat(opt.price_modifier) !==
                                            0 ? (
                                              <Badge
                                                colorScheme="orange"
                                                size="sm"
                                              >
                                                {opt.price_modifier_type ===
                                                "fixed"
                                                  ? "+"
                                                  : ""}
                                                €
                                                {parseFloat(
                                                  opt.price_modifier
                                                ).toFixed(2)}
                                              </Badge>
                                            ) : (
                                              <Text
                                                fontSize="xs"
                                                color="gray.400"
                                              >
                                                No modifier
                                              </Text>
                                            )}
                                          </Td>
                                        </Tr>
                                      ))}
                                    </Tbody>
                                  </Table>
                                </Box>
                              </CardBody>
                            </Card>
                          )}

                        {/* Selected Services Table */}
                        {item.selected_services &&
                          Array.isArray(item.selected_services) &&
                          item.selected_services.length > 0 && (
                            <Card mb={4} boxShadow="sm" bg="white">
                              <CardHeader pb={2}>
                                <HStack spacing={2}>
                                  <Avatar size="xs" bg="purple.500" />
                                  <Heading size="sm" color="purple.600">
                                    Selected Services
                                  </Heading>
                                </HStack>
                              </CardHeader>
                              <CardBody pt={0}>
                                <Box overflowX="auto">
                                  <Table variant="simple" size="sm">
                                    <Thead bg="purple.50">
                                      <Tr>
                                        <Th color="gray.700" fontWeight="600">
                                          Service Name
                                        </Th>
                                        <Th color="gray.700" fontWeight="600">
                                          Description
                                        </Th>
                                        <Th color="gray.700" fontWeight="600">
                                          Service ID
                                        </Th>
                                        <Th
                                          color="gray.700"
                                          fontWeight="600"
                                          isNumeric
                                        >
                                          Price
                                        </Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {item.selected_services.map(
                                        (service, idx) => (
                                          <Tr key={idx}>
                                            <Td>
                                              <Text
                                                fontWeight="600"
                                                color="gray.800"
                                              >
                                                {service.service_name ||
                                                  service.name ||
                                                  "Service"}
                                              </Text>
                                            </Td>
                                            <Td>
                                              <Text
                                                fontSize="sm"
                                                color="gray.600"
                                                noOfLines={2}
                                              >
                                                {service.description ||
                                                  "No description"}
                                              </Text>
                                            </Td>
                                            <Td>
                                              {service.service_id ? (
                                                <Text
                                                  fontSize="xs"
                                                  color="gray.500"
                                                  fontFamily="mono"
                                                >
                                                  {service.service_id.substring(
                                                    0,
                                                    8
                                                  )}
                                                  ...
                                                </Text>
                                              ) : (
                                                <Text
                                                  fontSize="xs"
                                                  color="gray.400"
                                                >
                                                  No ID
                                                </Text>
                                              )}
                                            </Td>
                                            <Td isNumeric>
                                              {service.price ? (
                                                <Badge
                                                  colorScheme="purple"
                                                  size="sm"
                                                >
                                                  €
                                                  {parseFloat(
                                                    service.price
                                                  ).toFixed(2)}
                                                </Badge>
                                              ) : (
                                                <Text
                                                  fontSize="xs"
                                                  color="gray.400"
                                                >
                                                  No price
                                                </Text>
                                              )}
                                            </Td>
                                          </Tr>
                                        )
                                      )}
                                    </Tbody>
                                  </Table>
                                </Box>
                              </CardBody>
                            </Card>
                          )}

                        {/* Dimensions & Pricing Table */}
                        {((item.dimensions &&
                          Object.keys(item.dimensions).length > 0) ||
                          (item.pricing_breakdown &&
                            Object.keys(item.pricing_breakdown).length >
                              0)) && (
                          <Card boxShadow="sm" bg="white">
                            <CardHeader pb={2}>
                              <HStack spacing={2}>
                                <Avatar size="xs" bg="green.500" />
                                <Heading size="sm" color="green.600">
                                  Dimensions & Pricing Details
                                </Heading>
                              </HStack>
                            </CardHeader>
                            <CardBody pt={0}>
                              <Grid
                                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                                gap={6}
                              >
                                {/* Dimensions */}
                                {item.dimensions &&
                                  Object.keys(item.dimensions).length > 0 && (
                                    <Box>
                                      <Heading
                                        size="xs"
                                        color="green.700"
                                        mb={3}
                                      >
                                        Dimensions
                                      </Heading>
                                      <Box overflowX="auto">
                                        <Table variant="simple" size="sm">
                                          <Thead bg="green.50">
                                            <Tr>
                                              <Th
                                                color="gray.700"
                                                fontWeight="600"
                                              >
                                                Property
                                              </Th>
                                              <Th
                                                color="gray.700"
                                                fontWeight="600"
                                              >
                                                Value
                                              </Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {Object.entries(
                                              item.dimensions
                                            ).map(([key, value]) => (
                                              <Tr key={key}>
                                                <Td>
                                                  <Text
                                                    fontWeight="600"
                                                    color="gray.700"
                                                  >
                                                    {key
                                                      .replace(/_/g, " ")
                                                      .replace(/\b\w/g, (l) =>
                                                        l.toUpperCase()
                                                      )}
                                                  </Text>
                                                </Td>
                                                <Td>
                                                  <Text color="gray.600">
                                                    {value || "N/A"}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            ))}
                                          </Tbody>
                                        </Table>
                                      </Box>
                                    </Box>
                                  )}

                                {/* Pricing Breakdown */}
                                {item.pricing_breakdown &&
                                  Object.keys(item.pricing_breakdown).length >
                                    0 && (
                                    <Box>
                                      <Heading
                                        size="xs"
                                        color="green.700"
                                        mb={3}
                                      >
                                        Pricing Breakdown
                                      </Heading>
                                      <Box overflowX="auto">
                                        <Table variant="simple" size="sm">
                                          <Thead bg="green.50">
                                            <Tr>
                                              <Th
                                                color="gray.700"
                                                fontWeight="600"
                                              >
                                                Component
                                              </Th>
                                              <Th
                                                color="gray.700"
                                                fontWeight="600"
                                                isNumeric
                                              >
                                                Amount
                                              </Th>
                                            </Tr>
                                          </Thead>
                                          <Tbody>
                                            {/* Final Pricing */}
                                            {item.pricing_breakdown.final && (
                                              <Tr>
                                                <Td>
                                                  <Text
                                                    fontWeight="600"
                                                    color="gray.700"
                                                  >
                                                    Final Total
                                                  </Text>
                                                </Td>
                                                <Td isNumeric>
                                                  <Text
                                                    color="green.600"
                                                    fontWeight="600"
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.pricing_breakdown
                                                        .final.gross || 0
                                                    ).toFixed(2)}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            )}

                                            {/* Base Product */}
                                            {item.pricing_breakdown
                                              .base_product && (
                                              <Tr>
                                                <Td>
                                                  <Text
                                                    fontWeight="600"
                                                    color="gray.700"
                                                  >
                                                    Base Product
                                                  </Text>
                                                  {item.pricing_breakdown
                                                    .base_product
                                                    .calculation_details && (
                                                    <Text
                                                      fontSize="xs"
                                                      color="gray.500"
                                                    >
                                                      {
                                                        item.pricing_breakdown
                                                          .base_product
                                                          .calculation_details
                                                          .calculation
                                                      }
                                                    </Text>
                                                  )}
                                                </Td>
                                                <Td isNumeric>
                                                  <Text
                                                    color="green.600"
                                                    fontWeight="600"
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.pricing_breakdown
                                                        .base_product.gross || 0
                                                    ).toFixed(2)}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            )}

                                            {/* Custom Options */}
                                            {item.pricing_breakdown
                                              .custom_options && (
                                              <Tr>
                                                <Td>
                                                  <Text
                                                    fontWeight="600"
                                                    color="gray.700"
                                                  >
                                                    Custom Options
                                                  </Text>
                                                  {item.pricing_breakdown
                                                    .custom_options.details &&
                                                    item.pricing_breakdown
                                                      .custom_options.details
                                                      .length > 0 && (
                                                      <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                      >
                                                        {
                                                          item.pricing_breakdown
                                                            .custom_options
                                                            .details.length
                                                        }{" "}
                                                        option(s)
                                                      </Text>
                                                    )}
                                                </Td>
                                                <Td isNumeric>
                                                  <Text
                                                    color="green.600"
                                                    fontWeight="600"
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.pricing_breakdown
                                                        .custom_options.gross ||
                                                        0
                                                    ).toFixed(2)}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            )}

                                            {/* Percentage Adjustments */}
                                            {item.pricing_breakdown
                                              .percentage_adjustments && (
                                              <Tr>
                                                <Td>
                                                  <Text
                                                    fontWeight="600"
                                                    color="gray.700"
                                                  >
                                                    Percentage Adjustments
                                                  </Text>
                                                  {item.pricing_breakdown
                                                    .percentage_adjustments
                                                    .details &&
                                                    item.pricing_breakdown
                                                      .percentage_adjustments
                                                      .details.length > 0 && (
                                                      <Text
                                                        fontSize="xs"
                                                        color="gray.500"
                                                      >
                                                        {
                                                          item.pricing_breakdown
                                                            .percentage_adjustments
                                                            .details.length
                                                        }{" "}
                                                        adjustment(s)
                                                      </Text>
                                                    )}
                                                </Td>
                                                <Td isNumeric>
                                                  <Text
                                                    color="green.600"
                                                    fontWeight="600"
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.pricing_breakdown
                                                        .percentage_adjustments
                                                        .amount || 0
                                                    ).toFixed(2)}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            )}

                                            {/* Subtotal */}
                                            {item.pricing_breakdown
                                              .subtotal && (
                                              <Tr>
                                                <Td>
                                                  <Text
                                                    fontWeight="600"
                                                    color="gray.700"
                                                  >
                                                    Subtotal
                                                  </Text>
                                                </Td>
                                                <Td isNumeric>
                                                  <Text
                                                    color="green.600"
                                                    fontWeight="600"
                                                  >
                                                    €
                                                    {parseFloat(
                                                      item.pricing_breakdown
                                                        .subtotal.gross || 0
                                                    ).toFixed(2)}
                                                  </Text>
                                                </Td>
                                              </Tr>
                                            )}

                                            {/* Breakdown Info */}
                                            {item.pricing_breakdown
                                              .breakdown && (
                                              <Tr>
                                                <Td colSpan={2}>
                                                  <Box
                                                    p={2}
                                                    bg="green.25"
                                                    borderRadius="md"
                                                  >
                                                    <Text
                                                      fontSize="xs"
                                                      color="gray.600"
                                                    >
                                                      <strong>Currency:</strong>{" "}
                                                      {
                                                        item.pricing_breakdown
                                                          .breakdown.currency
                                                      }{" "}
                                                      |<strong> Tax:</strong>{" "}
                                                      {item.pricing_breakdown
                                                        .breakdown.includes_tax
                                                        ? "Included"
                                                        : "Excluded"}{" "}
                                                      |
                                                      <strong>
                                                        {" "}
                                                        Discount:
                                                      </strong>{" "}
                                                      {item.pricing_breakdown
                                                        .breakdown
                                                        .includes_discount
                                                        ? "Applied"
                                                        : "None"}
                                                    </Text>
                                                  </Box>
                                                </Td>
                                              </Tr>
                                            )}
                                          </Tbody>
                                        </Table>
                                      </Box>
                                    </Box>
                                  )}
                              </Grid>
                            </CardBody>
                          </Card>
                        )}
                      </Box>
                    ))
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Text color="gray.500">No items in this order</Text>
                    </Box>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          {/* Right Column */}
          <GridItem>
            {/* Shipping Address */}
            <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack spacing={3}>
                  <Avatar icon={<FaTruck />} size="sm" bg="purple.500" />
                  <Heading size="md" color="gray.800">
                    Shipping Address
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {order.shipping_address ? (
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="600" color="gray.800">
                      {order.shipping_address.first_name}{" "}
                      {order.shipping_address.last_name}
                    </Text>
                    {order.shipping_address.company && (
                      <Text fontSize="sm" color="gray.600">
                        {order.shipping_address.company}
                      </Text>
                    )}
                    <Text fontSize="sm" color="gray.600">
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
                      <Text fontSize="sm" color="gray.600">
                        📞 {order.shipping_address.phone}
                      </Text>
                    )}
                  </VStack>
                ) : (
                  <Text color="gray.500">No shipping address provided</Text>
                )}
              </CardBody>
            </Card>

            {/* Billing Address */}
            <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack spacing={3}>
                  <Avatar icon={<FaReceipt />} size="sm" bg="orange.500" />
                  <Heading size="md" color="gray.800">
                    Billing Address
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {order.billing_address ? (
                  <VStack align="stretch" spacing={2}>
                    <Text fontWeight="600" color="gray.800">
                      {order.billing_address.first_name}{" "}
                      {order.billing_address.last_name}
                    </Text>
                    {order.billing_address.company && (
                      <Text fontSize="sm" color="gray.600">
                        {order.billing_address.company}
                      </Text>
                    )}
                    <Text fontSize="sm" color="gray.600">
                      {order.billing_address.street}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {order.billing_address.city},{" "}
                      {order.billing_address.postal_code}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      {order.billing_address.country}
                    </Text>
                  </VStack>
                ) : (
                  <Text color="gray.500">Same as shipping address</Text>
                )}
              </CardBody>
            </Card>

            {/* Order Summary */}
            <Card mb={6} boxShadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader>
                <HStack spacing={3}>
                  <Avatar icon={<FaCreditCard />} size="sm" bg="red.500" />
                  <Heading size="md" color="gray.800">
                    Order Summary
                  </Heading>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack align="stretch" spacing={3}>
                  <Flex justify="space-between">
                    <Text>Subtotal:</Text>
                    <Text fontWeight="600">
                      €{parseFloat(order.subtotal).toFixed(2)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Tax:</Text>
                    <Text fontWeight="600">
                      €{parseFloat(order.tax).toFixed(2)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Shipping:</Text>
                    <Text fontWeight="600">
                      €{parseFloat(order.shipping_fee).toFixed(2)}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Discounts:</Text>
                    <Text fontWeight="600" color="green.500">
                      -€{parseFloat(order.discounts).toFixed(2)}
                    </Text>
                  </Flex>
                  {order.promotion && (
                    <Flex justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Promotion ({order.promotion.code}):
                      </Text>
                      <Text fontSize="sm" color="green.500">
                        -€{parseFloat(order.promotion_discount || 0).toFixed(2)}
                      </Text>
                    </Flex>
                  )}
                  {order.gift_card && (
                    <Flex justify="space-between">
                      <Text fontSize="sm" color="gray.600">
                        Gift Card ({order.gift_card.code}):
                      </Text>
                      <Text fontSize="sm" color="green.500">
                        -€{parseFloat(order.gift_card_discount || 0).toFixed(2)}
                      </Text>
                    </Flex>
                  )}
                  <Divider />
                  <Flex justify="space-between">
                    <Text fontSize="lg" fontWeight="700" color="gray.800">
                      Total:
                    </Text>
                    <Text fontSize="lg" fontWeight="700" color="blue.600">
                      €{parseFloat(order.total).toFixed(2)}
                    </Text>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>

            {/* Additional Information */}
            <Card boxShadow="sm" border="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md" color="gray.800">
                  Additional Information
                </Heading>
              </CardHeader>
              <CardBody pt={0}>
                <VStack align="stretch" spacing={2}>
                  <Text fontSize="sm">
                    <strong>Payment Intent:</strong>{" "}
                    {order.payment_intent_id || "N/A"}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Shipping Status:</strong>{" "}
                    {order.shipping_status || "N/A"}
                  </Text>
                  {order.special_note && (
                    <Text fontSize="sm">
                      <strong>Special Note:</strong> {order.special_note}
                    </Text>
                  )}
                  {order.cancellation_reason && (
                    <Text fontSize="sm" color="red.500">
                      <strong>Cancellation Reason:</strong>{" "}
                      {order.cancellation_reason}
                    </Text>
                  )}
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>

      {/* Cancellation Request Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        size="lg"
        closeOnOverlayClick={!actionLoading}
        closeOnEsc={!actionLoading}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Icon
                as={currentAction === "approve" ? CheckIcon : CloseIcon}
                color={currentAction === "approve" ? "green.500" : "red.500"}
                boxSize={5}
              />
              <Text>
                {currentAction === "approve" ? "Approve" : "Reject"}{" "}
                {isRefundRequest ? "Refund" : "Cancellation"} Request
              </Text>
            </HStack>
          </ModalHeader>
          {!actionLoading && <ModalCloseButton />}

          <ModalBody>
            <VStack spacing={4} align="stretch">
              {/* Request Information */}
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.700">
                  <strong>Order:</strong> {order.order_number}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  <strong>Customer:</strong> {order.customer?.first_name}{" "}
                  {order.customer?.last_name}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  <strong>Request Type:</strong>{" "}
                  {isRefundRequest ? "Refund Request" : "Cancellation Request"}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  <strong>Reason:</strong> {order.cancellation_reason}
                </Text>
                <Text fontSize="sm" color="gray.700">
                  <strong>Requested At:</strong>{" "}
                  {new Date(order.cancellation_requested_at).toLocaleString()}
                </Text>
              </Box>

              {/* Confirmation Message */}
              <Text fontSize="md" color="gray.800">
                Are you sure you want to <strong>{currentAction}</strong> this{" "}
                {isRefundRequest ? "refund" : "cancellation"} request?
              </Text>

              {currentAction === "approve" && isRefundRequest && (
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="600">
                    Refund Amount (Optional)
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Text color="gray.500" fontSize="sm">
                        €
                      </Text>
                    </InputLeftElement>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder={`Max: ${parseFloat(order.total).toFixed(2)}`}
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      focusBorderColor="blue.500"
                      isDisabled={actionLoading}
                    />
                  </InputGroup>
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Leave empty to refund the full amount (€
                    {parseFloat(order.total).toFixed(2)})
                  </Text>
                </FormControl>
              )}

              <FormControl isRequired>
                <FormLabel color="gray.700" fontWeight="600">
                  Admin Note
                </FormLabel>
                <Textarea
                  placeholder={`Add a note about why you ${currentAction}d this request...`}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={4}
                  focusBorderColor="blue.500"
                  isDisabled={actionLoading}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  This note will be recorded for audit purposes
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3}>
              <Button
                variant="ghost"
                onClick={handleModalClose}
                isDisabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme={currentAction === "approve" ? "green" : "red"}
                onClick={() => handleCancellationAction(currentAction)}
                isLoading={actionLoading}
                loadingText={`${
                  currentAction === "approve" ? "Approving" : "Rejecting"
                }...`}
                leftIcon={
                  <Icon
                    as={currentAction === "approve" ? CheckIcon : CloseIcon}
                  />
                }
                disabled={!adminNote.trim()}
              >
                {currentAction === "approve" ? "Approve" : "Reject"} Request
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Staff Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Note</FormLabel>
              <Textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                placeholder="Enter your note here..."
                rows={4}
                isDisabled={addNoteLoading}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setIsAddNoteOpen(false)}
              isDisabled={addNoteLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleAddStaffNote}
              isLoading={addNoteLoading}
              ml={3}
              disabled={!staffNote.trim()}
            >
              Add Note
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Order Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isRequired>
              <FormLabel>New Status</FormLabel>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  borderColor: "#CBD5E0",
                }}
                disabled={statusLoading}
              >
                <option value="">Select status</option>
                {allowedStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormControl>
              <FormLabel>Staff Note (optional)</FormLabel>
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Add a note for this status change..."
                rows={3}
                isDisabled={statusLoading}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setIsStatusModalOpen(false)}
              isDisabled={statusLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleUpdateOrderStatus}
              isLoading={statusLoading}
              ml={3}
              disabled={!newStatus}
            >
              Update Status
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Order</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={3}>
              Are you sure you want to <b>cancel</b> this order? This action
              cannot be undone.
            </Text>
            <FormControl isRequired>
              <FormLabel>Admin Note</FormLabel>
              <Textarea
                value={cancelNote}
                onChange={(e) => setCancelNote(e.target.value)}
                placeholder="Reason for cancellation (required)"
                rows={4}
                isDisabled={cancelLoading}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setIsCancelModalOpen(false)}
              isDisabled={cancelLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleAdminCancelOrder}
              isLoading={cancelLoading}
              ml={3}
              disabled={!cancelNote.trim()}
            >
              Confirm Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
