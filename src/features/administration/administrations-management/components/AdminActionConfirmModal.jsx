import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Text,
  Icon,
  Flex,
  Badge,
} from "@chakra-ui/react";
import {
  FaExclamationTriangle,
  FaLock,
  FaUnlock,
  FaCheck,
} from "react-icons/fa";

const actionIcons = {
  lock: FaLock,
  unlock: FaUnlock,
  verify: FaCheck,
  unverify: FaCheck,
  suspicious: FaExclamationTriangle,
  unsuspicious: FaExclamationTriangle,
  deactivate: FaExclamationTriangle,
  activate: FaExclamationTriangle,
};

const actionColors = {
  lock: "red",
  unlock: "green",
  verify: "blue",
  unverify: "red",
  suspicious: "orange",
  unsuspicious: "green",
  deactivate: "red",
  activate: "green",
};

const AdminActionConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  action,
  user,
  isLoading,
}) => {
  if (!user) return null;

  const getActionDetails = () => {
    switch (action) {
      case "lock":
        return {
          title: "Lock Account",
          description: `Are you sure you want to lock ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account? This will prevent them from logging in to the system.`,
          confirmLabel: "Lock Account",
          color: "red",
          icon: FaLock,
        };
      case "unlock":
        return {
          title: "Unlock Account",
          description: `Are you sure you want to unlock ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account? This will allow them to log in to the system again.`,
          confirmLabel: "Unlock Account",
          color: "green",
          icon: FaUnlock,
        };
      case "verify":
        return {
          title: "Verify Account",
          description: `Are you sure you want to verify ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account? This will mark their account as verified.`,
          confirmLabel: "Verify Account",
          color: "blue",
          icon: FaCheck,
        };
      case "unverify":
        return {
          title: "Unverify Account",
          description: `Are you sure you want to remove verification from ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account?`,
          confirmLabel: "Unverify Account",
          color: "red",
          icon: FaCheck,
        };
      case "suspicious":
        return {
          title: "Mark as Suspicious",
          description: `Are you sure you want to mark ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account as suspicious?`,
          confirmLabel: "Mark Suspicious",
          color: "orange",
          icon: FaExclamationTriangle,
        };
      case "unsuspicious":
        return {
          title: "Clear Suspicious Status",
          description: `Are you sure you want to clear the suspicious status from ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account?`,
          confirmLabel: "Clear Suspicious",
          color: "green",
          icon: FaExclamationTriangle,
        };
      case "deactivate":
        return {
          title: "Deactivate Account",
          description: `Are you sure you want to deactivate ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account? This will hide their account from normal operations.`,
          confirmLabel: "Deactivate Account",
          color: "red",
          icon: FaExclamationTriangle,
        };
      case "activate":
        return {
          title: "Activate Account",
          description: `Are you sure you want to activate ${
            user.preferred_name || `${user.first_name} ${user.last_name}`
          }'s account?`,
          confirmLabel: "Activate Account",
          color: "green",
          icon: FaExclamationTriangle,
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to perform this action?",
          confirmLabel: "Confirm",
          color: "blue",
          icon: FaExclamationTriangle,
        };
    }
  };

  const { title, description, confirmLabel, color, icon } = getActionDetails();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" borderRadius="xl">
        <ModalHeader
          borderBottomWidth="1px"
          borderColor="gray.200"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Icon as={icon} color={`${color}.400`} />
          <Text fontSize={'lg'}>{title}</Text>
        </ModalHeader>

        <ModalBody py={6}>
          <Flex direction="column" gap={4}>
            <Text>{description}</Text>

            <Flex wrap="wrap" gap={2} mt={2}>
              <Text fontWeight="bold" fontSize="sm">
                User Details:
              </Text>
              <Badge
                colorScheme={
                  user.role === "global-administrator"
                    ? "purple"
                    : user.role === "administrator"
                    ? "blue"
                    : user.role === "supplier"
                    ? "green"
                    : "gray"
                }
              >
                {user.role?.replace("-", " ")}
              </Badge>

              {user.is_locked && <Badge colorScheme="red">Locked</Badge>}

              {user.is_verified && <Badge colorScheme="green">Verified</Badge>}

              {user.is_suspicious && (
                <Badge colorScheme="orange">Suspicious</Badge>
              )}

              {user.is_inactive && <Badge colorScheme="gray">Inactive</Badge>}
            </Flex>
          </Flex>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.200">
          <Button
            colorScheme={color}
            mr={3}
            onClick={onConfirm}
            isLoading={isLoading}
            leftIcon={<Icon as={icon} />}
            size="sm"
          >
            {confirmLabel}
          </Button>
          <Button
            size="sm"
            color='black'
            bg='transparent'
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminActionConfirmModal;
