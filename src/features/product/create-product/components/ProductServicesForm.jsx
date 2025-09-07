import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  useToast,
  FormHelperText,
  FormErrorMessage,
  Divider,
  Tag,
  TagLabel,
  TagCloseButton,
  Collapse,
  useDisclosure,
  Alert,
  AlertIcon,
  Flex,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiTool,
  FiDollarSign,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { customErrorToastContainerStyle } from "../../../../commons/toastStyles";

const MotionBox = motion.create(Box);

const ProductServicesForm = ({ companies, services, onServicesChange }) => {
  const toast = useToast();
  const { isOpen: isFormOpen, onToggle: toggleForm } = useDisclosure({
    defaultIsOpen: true,
  });
  const [currentService, setCurrentService] = useState({
    title: "",
    description: "",
    full_description: "",
    price: "",
    company_id: "",
    service_type: "service",
    is_required: false,
    is_active: true,
    standalone: false,
  });
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const serviceTypes = [
    { value: "service", label: "General Service", color: "blue" },
    { value: "support", label: "Customer Support", color: "green" },
    { value: "installation", label: "Installation", color: "orange" },
    { value: "transport", label: "Transportation", color: "purple" },
    { value: "setup", label: "Setup & Configuration", color: "teal" },
    { value: "training", label: "Training", color: "cyan" },
    { value: "other", label: "Other", color: "gray" },
  ];

  const handleInputChange = (name, value) => {
    setCurrentService((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateService = () => {
    const newErrors = {};

    if (!currentService.title?.trim()) {
      newErrors.title = "Service title is required";
    }

    if (!currentService.price || parseFloat(currentService.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!currentService.company_id) {
      newErrors.company_id = "Please select a company";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOrUpdateService = () => {
    if (!validateService()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before adding the service",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customErrorToastContainerStyle,
      });
      return;
    }

    const serviceData = {
      title: currentService.title,
      description: currentService.description || "",
      full_description: currentService.full_description || "",
      price: parseFloat(currentService.price),
      company_id: currentService.company_id,
      service_type: currentService.service_type,
      is_required: currentService.is_required || false,
      is_active:
        currentService.is_active !== undefined
          ? currentService.is_active
          : true,
      standalone: currentService.standalone || false,
    };

    let newServices;
    if (editingIndex !== null) {
      // Update existing service
      newServices = [...services];
      newServices[editingIndex] = serviceData;
      setEditingIndex(null);
    } else {
      // Add new service
      newServices = [...services, serviceData];
    }

    onServicesChange(newServices);
    resetForm();

    toast({
      title: editingIndex !== null ? "Service Updated" : "Service Added",
      description: `${serviceData.title} has been ${
        editingIndex !== null ? "updated" : "added"
      } successfully`,
      status: "success",
      duration: 2000,
      isClosable: true,
      variant: "custom",
      containerStyle: customToastContainerStyle,
    });
  };

  const resetForm = () => {
    setCurrentService({
      title: "",
      description: "",
      full_description: "",
      price: "",
      company_id: "",
      service_type: "service",
      is_required: false,
      is_active: true,
      standalone: false,
    });
    setErrors({});
    setEditingIndex(null);
  };

  const editService = (index) => {
    const service = services[index];
    setCurrentService(service);
    setEditingIndex(index);
    if (!isFormOpen) toggleForm();
  };

  const removeService = (index) => {
    const newServices = services.filter((_, i) => i !== index);
    onServicesChange(newServices);

    toast({
      title: "Service Removed",
      description: "Service has been removed successfully",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: "custom",
      containerStyle: customToastContainerStyle,
    });
  };

  const getServiceTypeConfig = (type) => {
    return serviceTypes.find((st) => st.value === type) || serviceTypes[0];
  };

  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company?.business_name || company?.name || "Unknown Company";
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header with Add Service Button */}
      <HStack justify="space-between" align="center">
        <HStack>
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            Product Services
          </Text>
          {services.length > 0 && (
            <Badge colorScheme="blue" variant="subtle">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </HStack>
        <Button
          leftIcon={<FiPlus />}
          size="sm"
          colorScheme="blue"
          onClick={toggleForm}
          variant={isFormOpen ? "outline" : "solid"}
        >
          {isFormOpen ? "Hide Form" : "Add Service"}
        </Button>
      </HStack>

      {/* Service Form */}
      <Collapse in={isFormOpen} animateOpacity>
        <Card variant="outline" borderColor="blue.200">
          <CardHeader bg="blue.50" py={4}>
            <HStack>
              <FiTool />
              <Text fontWeight="medium" color="blue.800">
                {editingIndex !== null ? "Edit Service" : "Add New Service"}
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.title}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Service Title *
                  </FormLabel>
                  <Input
                    value={currentService.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., Professional Assembly Service"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  />
                  <FormErrorMessage>{errors.title}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.price}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Price *
                  </FormLabel>
                  <NumberInput
                    value={currentService.price}
                    onChange={(value) => handleInputChange("price", value)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.200"
                      _hover={{ borderColor: "gray.300" }}
                      _focus={{
                        borderColor: "blue.400",
                        boxShadow: "0 0 0 1px #3182ce",
                      }}
                      placeholder="0.00"
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.company_id}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Service Provider *
                  </FormLabel>
                  <Select
                    value={currentService.company_id}
                    onChange={(e) =>
                      handleInputChange("company_id", e.target.value)
                    }
                    placeholder="Select company"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  >
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.business_name || company.name}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage>{errors.company_id}</FormErrorMessage>
                  <FormHelperText>
                    Company that will provide this service
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Service Type
                  </FormLabel>
                  <Select
                    value={currentService.service_type}
                    onChange={(e) =>
                      handleInputChange("service_type", e.target.value)
                    }
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "blue.400",
                      boxShadow: "0 0 0 1px #3182ce",
                    }}
                  >
                    {serviceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              {/* Descriptions */}
              <FormControl>
                <FormLabel color="gray.700" fontWeight="500">
                  Short Description
                </FormLabel>
                <Textarea
                  value={currentService.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the service"
                  rows={2}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px #3182ce",
                  }}
                />
                <FormHelperText>Used for service previews</FormHelperText>
              </FormControl>

              <FormControl>
                <FormLabel color="gray.700" fontWeight="500">
                  Detailed Description
                </FormLabel>
                <Textarea
                  value={currentService.full_description}
                  onChange={(e) =>
                    handleInputChange("full_description", e.target.value)
                  }
                  placeholder="Detailed description including what's included, duration, etc."
                  rows={4}
                  bg="gray.50"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px #3182ce",
                  }}
                />
                <FormHelperText>
                  Complete service details for customers
                </FormHelperText>
              </FormControl>

              {/* Service Options */}
              <Box>
                <Text color="gray.700" fontWeight="500" mb={4}>
                  Service Options
                </Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel
                      htmlFor="is_required"
                      mb="0"
                      mr={3}
                      color="gray.700"
                    >
                      Required Service
                    </FormLabel>
                    <Switch
                      id="is_required"
                      colorScheme="red"
                      isChecked={currentService.is_required}
                      onChange={(e) =>
                        handleInputChange("is_required", e.target.checked)
                      }
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel
                      htmlFor="standalone"
                      mb="0"
                      mr={3}
                      color="gray.700"
                    >
                      Standalone Service
                    </FormLabel>
                    <Switch
                      id="standalone"
                      colorScheme="orange"
                      isChecked={currentService.standalone}
                      onChange={(e) =>
                        handleInputChange("standalone", e.target.checked)
                      }
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel
                      htmlFor="is_active"
                      mb="0"
                      mr={3}
                      color="gray.700"
                    >
                      Active
                    </FormLabel>
                    <Switch
                      id="is_active"
                      colorScheme="green"
                      isChecked={currentService.is_active}
                      onChange={(e) =>
                        handleInputChange("is_active", e.target.checked)
                      }
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Action Buttons */}
              <HStack
                justify="flex-end"
                pt={4}
                borderTop="1px"
                borderColor="gray.200"
              >
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={addOrUpdateService}
                  leftIcon={editingIndex !== null ? <FiEdit /> : <FiPlus />}
                >
                  {editingIndex !== null ? "Update Service" : "Add Service"}
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Collapse>

      {/* Services List */}
      {services.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            Added Services ({services.length})
          </Text>

          {services.map((service, index) => {
            const serviceTypeConfig = getServiceTypeConfig(
              service.service_type
            );

            return (
              <MotionBox
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="outline" _hover={{ shadow: "md" }}>
                  <CardBody>
                    <Flex justify="space-between" align="flex-start">
                      <VStack align="start" spacing={3} flex={1}>
                        <HStack spacing={3} wrap="wrap">
                          <Text
                            fontWeight="bold"
                            color="gray.900"
                            fontSize="lg"
                          >
                            {service.title}
                          </Text>
                          <Badge
                            colorScheme={serviceTypeConfig.color}
                            variant="solid"
                            borderRadius="full"
                          >
                            {serviceTypeConfig.label}
                          </Badge>
                          <Badge
                            colorScheme="green"
                            variant="outline"
                            borderRadius="full"
                          >
                            <FiDollarSign style={{ marginRight: "4px" }} />$
                            {parseFloat(service.price).toFixed(2)}
                          </Badge>
                        </HStack>

                        <Text color="gray.600" fontSize="sm">
                          <FiUser
                            style={{ display: "inline", marginRight: "4px" }}
                          />
                          Provider: {getCompanyName(service.company_id)}
                        </Text>

                        {service.description && (
                          <Text color="gray.700" fontSize="sm">
                            {service.description}
                          </Text>
                        )}

                        <HStack spacing={2} wrap="wrap">
                          {service.is_required && (
                            <Tag size="sm" colorScheme="red" variant="solid">
                              Required
                            </Tag>
                          )}
                          {service.standalone && (
                            <Tag size="sm" colorScheme="orange" variant="solid">
                              Standalone
                            </Tag>
                          )}
                          {!service.is_active && (
                            <Tag size="sm" colorScheme="gray" variant="solid">
                              Inactive
                            </Tag>
                          )}
                        </HStack>
                      </VStack>

                      <VStack spacing={2} ml={4}>
                        <IconButton
                          icon={<FiEdit />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => editService(index)}
                          aria-label="Edit service"
                          title="Edit service"
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeService(index)}
                          aria-label="Remove service"
                          title="Remove service"
                        />
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>
              </MotionBox>
            );
          })}
        </VStack>
      ) : (
        <Box
          p={8}
          textAlign="center"
          borderRadius="md"
          bg="gray.50"
          border="1px dashed"
          borderColor="gray.200"
        >
          <VStack spacing={3}>
            <FiTool size="2em" color="gray.400" />
            <Text fontWeight="medium" color="gray.600">
              No Services Added Yet
            </Text>
            <Text color="gray.500" fontSize="sm">
              Add services that customers can purchase with this product
            </Text>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              size="sm"
              onClick={toggleForm}
            >
              Add First Service
            </Button>
          </VStack>
        </Box>
      )}

      {/* Help Information */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertDescription fontSize="sm">
            <strong>Service Types:</strong> Installation services help with
            setup, Support services provide ongoing assistance, Transport
            handles delivery, and Training helps customers learn to use the
            product.
          </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
};

export default ProductServicesForm;
