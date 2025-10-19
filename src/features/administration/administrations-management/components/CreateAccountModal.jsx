import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Textarea,
  useToast,
  Flex,
  Text,
  IconButton,
  Alert,
  AlertIcon,
  Divider,
} from "@chakra-ui/react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaPhone,
  FaBuilding,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { administrationService } from "../../services/administrationService";
import { companyService } from "../../services/companyService";
import { customToastContainerStyle } from "../../../../commons/toastStyles";
import { handleApiError } from "../../../../commons/handleApiError";
import CommonSelect from "../../../../commons/components/CommonSelect";

const CreateAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const initialFormData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "administrator",
    phone_number: "",
    note: "",
    company_id: "",
    address: "",
    city: "",
    country: "",
    zip_code: "",
    passport_number: "",
    identification_number: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      setCompanies([]);
      try {
        const response = await companyService.getAllCompaniesForSelect();
        if (response.data && response.data.status === "success") {
          setCompanies(response.data.data || []);
        } else {
          setCompanies([]);
          toast({
            title: "Warning",
            description:
              response.data?.message ||
              "Could not load companies for selection.",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        setCompanies([]);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    if (isOpen) {
      fetchCompanies();
    } else {
      setFormData(initialFormData);
      setErrors({});
      setCompanies([]);
      setShowPassword(false);
    }
  }, [isOpen, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      newErrors.email = "Email address is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.role) newErrors.role = "Role is required";

    if (formData.role === "supplier" && !formData.company_id) {
      newErrors.company_id = "Company is required for Supplier role.";
    }

    if (formData.role === "sales-agent") {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
      if (!formData.zip_code.trim())
        newErrors.zip_code = "Zip code is required";
      if (
        !formData.passport_number.trim() &&
        !formData.identification_number.trim()
      ) {
        newErrors.passport_number =
          "Passport number or identification number is required";
        newErrors.identification_number =
          "Passport number or identification number is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const payload = { ...formData };
    try {
      let response;
      if (payload.role === "supplier") {
        response = await administrationService.createSupplierAdministration(
          payload
        );
      } else {
        response = await administrationService.createAccount(payload);
      }

      if (response.data && response.data.status === "success") {
        toast({
          description: response.data.message || "Account created successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
        onSuccess();
        handleCloseModal();
      } else {
        toast({
          description: response.data?.message || "Failed to create account.",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      toast({
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleCloseModal = () => {
    setFormData(initialFormData);
    setErrors({});
    setCompanies([]);
    setShowPassword(false);
    onClose();
  };

  const roleOptions = [
    { value: "global-administrator", label: "Global Administrator" },
    // { value: "administrator", label: "Administrator" },
    // { value: "supplier", label: "Supplier" },
    { value: "sales-agent", label: "Agent commercial" },
  ];

  const companyOptions = [
    { value: "", label: formData.role === "supplier" ? "Select company (Required)" : "No Company (Optional)" },
    ...companies.map(company => ({ value: company.id, label: `${company.business_name} (${company.market_name})` }))
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" borderRadius="xl">
        <ModalHeader borderBottomWidth="1px" borderColor="gray.200">
          <Flex alignItems="center" gap={2}>
            <FaUser />
            <Text fontSize={'lg'}>Create New Account</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6}>
          <Flex direction="column" gap={4}>
            <Alert status="info" borderRadius="md" bg="blue.900" mb={2}>
              <AlertIcon color="blue.200" />
              <Text fontSize="sm" color='blue.500'>
                Create a new user. You can optionally assign them to a company.
              </Text>
            </Alert>
            <Divider borderColor="gray.600" my={2} />

            <Flex gap={4} width="100%">
              <FormControl isInvalid={!!errors.first_name} isRequired flex={1}>
                <FormLabel display="flex" alignItems="center">
                  <FaUser style={{ marginRight: "8px" }} />
                  First Name
                </FormLabel>
                <Input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  bg="rgb(255,255,255)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <FormErrorMessage>{errors.first_name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.last_name} isRequired flex={1}>
                <FormLabel display="flex" alignItems="center">
                  <FaUser style={{ marginRight: "8px" }} />
                  Last Name
                </FormLabel>
                <Input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  bg="rgb(255,255,255)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <FormErrorMessage>{errors.last_name}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl isInvalid={!!errors.email} isRequired>
              <FormLabel display="flex" alignItems="center">
                <FaEnvelope style={{ marginRight: "8px" }} />
                Email Address
              </FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                bg="rgb(255,255,255)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.password} isRequired>
              <FormLabel display="flex" alignItems="center">
                <FaLock style={{ marginRight: "8px" }} />
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  bg="rgb(255,255,255)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    size="sm"
                    variant="ghost"
                    onClick={toggleShowPassword}
                    color="gray.400"
                    _hover={{ color: "gray.300" }}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <Flex gap={4} width="100%">
              <FormControl isInvalid={!!errors.role} isRequired flex={1}>
                <FormLabel display="flex" alignItems="center">
                  <FaShieldAlt style={{ marginRight: "8px" }} />
                  Role
                </FormLabel>
                <CommonSelect
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roleOptions}
                  placeholder="Select role"
                  error={errors.role}
                  size="md"
                  bgInput='rgb(255,255,255)'
                />
                <FormErrorMessage>{errors.role}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.phone_number} flex={1}>
                <FormLabel display="flex" alignItems="center">
                  <FaPhone style={{ marginRight: "8px" }} />
                  Phone Number
                </FormLabel>
                <Input
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  bg="rgb(255,255,255)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                />
                <FormErrorMessage>{errors.phone_number}</FormErrorMessage>
              </FormControl>
            </Flex>

            <FormControl isInvalid={!!errors.company_id}>
              <FormLabel display="flex" alignItems="center">
                <FaBuilding style={{ marginRight: "8px" }} />
                Assign to Company (Optional)
              </FormLabel>
              <CommonSelect
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
                placeholder={formData.role === "supplier" ? "Select company" : "Select company (Optional)"}
                // options={companies.map(company => ({ value: company.id, label: `${company.business_name} (${company.market_name})` }))}
                options={companyOptions}
                isLoading={isLoadingCompanies}
                isDisabled={isLoadingCompanies || (companies.length === 0 && !isLoadingCompanies)}
                isSearchable={false}
                size="md"
                noOptionsMessage={isLoadingCompanies ? "Loading..." : "No companies available"}
                loadingMessage="Loading companies..."
                error={errors.company_id}
                bgInput='rgb(255,255,255)'
              />
              <FormErrorMessage>{errors.company_id}</FormErrorMessage>
              {companies.length === 0 && !isLoadingCompanies && (
                <FormHelperText color="gray.400" mt={1} fontSize="xs">
                  No companies available to assign.
                </FormHelperText>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.note}>
              <FormLabel>Additional Notes</FormLabel>
              <Textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                bg="rgb(255,255,255)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
                  }}
                rows={3}
              />
              <FormErrorMessage>{errors.note}</FormErrorMessage>
            </FormControl>

            {formData.role === "sales-agent" && (
  <>
    <FormControl isInvalid={!!errors.address} isRequired>
      <FormLabel>Address</FormLabel>
      <Input
        name="address"
        value={formData.address}
        onChange={handleChange}
        bg="rgb(255,255,255)"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
        }}
      />
      <FormErrorMessage>{errors.address}</FormErrorMessage>
    </FormControl>
    <FormControl isInvalid={!!errors.city} isRequired>
      <FormLabel>City</FormLabel>
      <Input
        name="city"
        value={formData.city}
        onChange={handleChange}
        bg="rgb(255,255,255)"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
        }}
      />
      <FormErrorMessage>{errors.city}</FormErrorMessage>
    </FormControl>
    <FormControl isInvalid={!!errors.country} isRequired>
      <FormLabel>Country</FormLabel>
      <Input
        name="country"
        value={formData.country}
        onChange={handleChange}
        bg="rgb(255,255,255)"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
        }}
      />
      <FormErrorMessage>{errors.country}</FormErrorMessage>
    </FormControl>
    <FormControl isInvalid={!!errors.zip_code} isRequired>
      <FormLabel>Zip Code</FormLabel>
      <Input
        name="zip_code"
        value={formData.zip_code}
        onChange={handleChange}
        bg="rgb(255,255,255)"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
        }}
      />
      <FormErrorMessage>{errors.zip_code}</FormErrorMessage>
    </FormControl>
    <FormControl
      isInvalid={!!errors.passport_number && !!errors.identification_number}
      isRequired
    >
      <FormLabel>
        Passport Number <b>or</b> Identification Number
      </FormLabel>
      <Input
        name="passport_number"
        placeholder="Passport Number"
        value={formData.passport_number}
        onChange={handleChange}
        mb={2}
        bg="rgb(255,255,255)"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
        }}
      />
      <Input
        name="identification_number"
        placeholder="Identification Number"
        value={formData.identification_number}
        onChange={handleChange}
        bg="rgb(255,255,255)"
        borderColor="gray.400"
        _hover={{ borderColor: "gray.400" }}
        _focus={{
          borderColor: "blue.400",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.6)",
        }}
      />
      <FormErrorMessage>
        {errors.passport_number || errors.identification_number}
      </FormErrorMessage>
    </FormControl>
  </>
)}

          </Flex>
        </ModalBody>
        <ModalFooter borderTopWidth="1px" borderColor="gray.200">
          <Button
            bg='black'
            color='white'
            _hover={{bg: 'black'}}
            size="sm"
            leftIcon={<FaSave />}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            mr={3}
          >
            Create Account
          </Button>
          <Button
            size="sm"
            color='black'
            bg='transparent'
            leftIcon={<FaTimes />}
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccountModal;
