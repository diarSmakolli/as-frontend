import React, { useState, useEffect } from "react";
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
  Textarea,
  FormErrorMessage,
  useToast,
  Flex,
  Text,
  FormHelperText,
} from "@chakra-ui/react";
import { FaSave, FaTimes, FaBuilding } from "react-icons/fa";
import { administrationService } from "../../services/administrationService";
import { customToastContainerStyle } from "../../../../commons/toastStyles";
import { handleApiError } from "../../../../commons/handleApiError";
import { companyService } from "../../services/companyService";
import CommonSelect from "../../../../commons/components/CommonSelect";

const EditAccountModal = ({ isOpen, onClose, user, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    level: 1,
    preferred_name: "",
    phone_number: "",
    visible_status: "Active",
    note: "",
    company_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "supplier",
        level: user.level || 1,
        preferred_name: user.preferred_name || "",
        phone_number: user.phone_number || "",
        visible_status: user.visible_status || "Active",
        note: user.note || "",
        company_id: user.company_id || "",
      });
    }
    if (isOpen && user) {
      const fetchCompanies = async () => {
        setIsLoadingCompanies(true);
        try {
          const response = await companyService.getAllCompaniesForSelect();
          if (response.data && response.data.status === "success") {
            setCompanies(response.data.data || []);
          } else {
            setCompanies([]);
          }
        } catch (error) {
          setCompanies([]);
        } finally {
          setIsLoadingCompanies(false);
        }
      };
      fetchCompanies();
    } else if (!isOpen) {
      setCompanies([]);
      setErrors({});
    }
  }, [user, isOpen, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.role) newErrors.role = "Role is required";

    if (formData.role === "supplier" && !formData.company_id) {
      newErrors.company_id = "Company is required for Supplier role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        company_id: formData.company_id === "" ? null : formData.company_id,
      };

      const result = await administrationService.updateUserDetails(
        user.id,
        payload
      );

      toast({
        description: result.data.message || "Account updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      if (onSuccess) {
        onSuccess(result.data.data);
      }
      onClose();
    } catch (error) {
      const apiErrors = handleApiError(error.response, toast, true);
      if (apiErrors) {
        setErrors((prev) => ({ ...prev, ...apiErrors }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: "global-administrator", label: "Global Administrator" },
    { value: "administrator", label: "Administrator" },
    { value: "supplier", label: "Supplier" },
    { value: "employee", label: "Employee" },
  ];

  const levelOptions = [1, 2, 3, 4, 5].map((level) => ({
    value: level.toString(),
    label: `Level ${level}`,
  }));

  const companyOptionsForSelect = [
    {
      value: "",
      label:
        formData.role === "supplier"
          ? "Select company (Required)"
          : "-- No Company (Unassign) --",
    },
    ...companies.map((company) => ({
      value: company.id,
      label: `${company.business_name} (${company.market_name})`,
    })),
  ];

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Busy", label: "Busy" },
    { value: "Away", label: "Away" },
    { value: "Offline", label: "Offline" },
    { value: "On Vacation", label: "On Vacation" },
    { value: "Do Not Disturb", label: "Do Not Disturb" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="black" rounded="xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.200">
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontFamily={"Inter"} fontWeight={"500"}>
              Edit Account: {user?.preferred_name || user?.email}
            </Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py={6}>
          <Flex direction="column" gap={4}>
            {/* Basic Info */}
            <Flex gap={4} width="100%">
              <FormControl isInvalid={!!errors.first_name} isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "gray.300",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <FormErrorMessage>{errors.first_name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.last_name} isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "gray.300",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <FormErrorMessage>{errors.last_name}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                bg="rgb(241,241,241)"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "gray.300",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.phone_number}>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                bg="rgb(241,241,241)"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "gray.300",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
              />
              <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.preferred_name}>
              <FormLabel>Preferred Name</FormLabel>
              <Input
                name="preferred_name"
                value={formData.preferred_name}
                onChange={handleChange}
                bg="rgb(241,241,241)"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "gray.300",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
              />
              <FormErrorMessage>{errors.preferred_name}</FormErrorMessage>
            </FormControl>

            <Flex gap={4} width="100%">
              <FormControl isInvalid={!!errors.role} isRequired flex={1}>
                <FormLabel>Role</FormLabel>
                <CommonSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  placeholder="Select a role"
                  error={errors.role}
                  size="md"
                />
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.level} flex={1}>
                <FormLabel>Level</FormLabel>
                <CommonSelect
                  name="level"
                  value={formData.level.toString()}
                  onChange={handleChange}
                  options={levelOptions}
                  placeholder="Select level"
                  error={errors.level}
                  size="md"
                />
                <FormErrorMessage>{errors.level}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl
              isInvalid={!!errors.company_id}
              isRequired={formData.role === "supplier"}
            >
              <FormLabel display="flex" alignItems="center">
                <FaBuilding style={{ marginRight: "8px" }} /> Company
              </FormLabel>
              <CommonSelect
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                options={companyOptionsForSelect}
                isLoading={isLoadingCompanies}
                isDisabled={
                  isLoadingCompanies ||
                  (formData.role === "supplier" &&
                    companies.length === 0 &&
                    !isLoadingCompanies)
                }
                isSearchable={true}
                size="md"
                noOptionsMessage={
                  isLoadingCompanies
                    ? "Loading..."
                    : companies.length === 0
                    ? "No companies available"
                    : "No matching companies"
                }
                loadingMessage="Loading companies..."
                error={errors.company_id}
              />
              <FormErrorMessage>{errors.company_id}</FormErrorMessage>
              {formData.role !== "supplier" && (
                <FormHelperText>
                  Optional. Select "-- No Company --" to unassign.
                </FormHelperText>
              )}
              {formData.role === "supplier" &&
                !formData.company_id &&
                companies.length > 0 && (
                  <FormHelperText color="yellow.400">
                    Company is required for Supplier role.
                  </FormHelperText>
                )}
            </FormControl>

            <FormControl isInvalid={!!errors.visible_status}>
              <FormLabel>Visible Status</FormLabel>
              <CommonSelect
                name="visible_status"
                value={formData.visible_status}
                onChange={handleChange}
                options={statusOptions}
                placeholder="Select status"
                error={errors.visible_status}
                size="md"
              />
              <FormErrorMessage>{errors.visible_status}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.note}>
              <FormLabel>Note</FormLabel>
              <Textarea
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                bg="rgb(241,241,241)"
                  borderColor="gray.300"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "gray.300",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                rows={3}
              />
              <FormErrorMessage>{errors.note}</FormErrorMessage>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter borderTopWidth="1px" borderColor="gray.200">
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "black" }}
            size="sm"
            leftIcon={<FaSave />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            mr={3}
          >
            Save Changes
          </Button>
          <Button
            color="black"
            bg='transparent'
            size="sm"
            leftIcon={<FaTimes />}
            onClick={onClose}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditAccountModal;
