import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage,
  useToast,
  Flex,
  Badge,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash, FaKey, FaUser, FaShieldAlt } from "react-icons/fa";
import { administrationService } from "../../services/administrationService";
import { customToastContainerStyle } from "../../../../commons/toastStyles";
import { handleApiError } from "../../../../commons/handleApiError";

const ResetPasswordModal = ({ isOpen, onClose, user, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await administrationService.resetPassword(user.id, {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      toast({
        description: result.data.message || `Password for ${
          user.preferred_name || `${user.first_name} ${user.last_name}`
        } has been reset successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      if (onSuccess) {
        onSuccess();
      }

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      onClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  if (!user) return null;

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
          <FaKey />
          <Text fontSize={'lg'}>Reset User Password</Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Flex direction="column" gap={4}>
            <Flex
              alignItems="center"
              p={3}
              bg="rgb(241,241,241)"
              borderRadius="md"
              mb={2}
            >
              <FaUser size={18} style={{ marginRight: "12px", opacity: 0.7 }} />
              <Flex direction="column">
                <Text fontWeight="bold">
                  {user.preferred_name ||
                    `${user.first_name} ${user.last_name}`}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  {user.email}
                </Text>
              </Flex>
              <Badge
                ml="auto"
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
            </Flex>

            <Alert status="warning" borderRadius="md" bg="orange.900" mb={2}>
              <AlertIcon color="orange.200" />
              <Text fontSize="sm" color='orange'>
                Resetting this password will invalidate the user's current
                password and may require them to log in again.
              </Text>
            </Alert>

            <Divider borderColor="gray.600" my={2} />

            <FormControl isInvalid={errors.newPassword}>
              <FormLabel display="flex" alignItems="center">
                <FaShieldAlt style={{ marginRight: "8px" }} />
                New Password
              </FormLabel>
              <InputGroup>
                <Input
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  bg="rgb(255,255,255)"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.200" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showNewPassword ? "Hide password" : "Show password"
                    }
                    icon={showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    size="sm"
                    variant="ghost"
                    onClick={toggleShowNewPassword}
                    color="gray.400"
                    _hover={{ color: "gray.300" }}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword} mt={4}>
              <FormLabel display="flex" alignItems="center">
                <FaShieldAlt style={{ marginRight: "8px" }} />
                Confirm Password
              </FormLabel>
              <InputGroup>
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  bg="rgb(255,255,255)"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.200" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                    icon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    size="sm"
                    variant="ghost"
                    onClick={toggleShowConfirmPassword}
                    color="gray.400"
                    _hover={{ color: "gray.300" }}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.200">
          <Button
            bg='black'
            size="sm"
            color="white"
            _hover={{ bg: "black" }}
            leftIcon={<FaKey />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            mr={3}
          >
            Reset Password
          </Button>
          <Button
            size="sm"
            bg='transparent'
            color="black"
            _hover={{ bg: "transparent" }}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordModal;
