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
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  useToast,
  FormHelperText,
  FormErrorMessage,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Collapse,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiInfo,
  FiTag,
  FiEye,
  FiSettings,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { customToastContainerStyle } from "../../../../commons/toastStyles";

const MotionBox = motion.create(Box);

const CustomDetailsForm = ({ customDetails, onCustomDetailsChange }) => {
  const toast = useToast();
  const { isOpen: isFormOpen, onToggle: toggleForm } = useDisclosure({
    defaultIsOpen: true,
  });
  const { isOpen: isPreviewOpen, onToggle: togglePreview } = useDisclosure();

  const [currentDetail, setCurrentDetail] = useState({
    // key: '',
    label: "",
    value: "",
  });
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

  const commonDetails = [
    {
      key: "material",
      label: "Material",
      placeholder: "e.g., Wood, Metal, Plastic",
      icon: "🔧",
    },
    {
      key: "color",
      label: "Color",
      placeholder: "e.g., Black, White, Red",
      icon: "🎨",
    },
    {
      key: "brand",
      label: "Brand",
      placeholder: "e.g., Sony, Apple, Samsung",
      icon: "🏷️",
    },
    { key: "model", label: "Model", placeholder: "e.g., XYZ-123", icon: "📱" },
    {
      key: "warranty",
      label: "Warranty",
      placeholder: "e.g., 2 Years",
      icon: "🛡️",
    },
    {
      key: "country_of_origin",
      label: "Country of Origin",
      placeholder: "e.g., Germany",
      icon: "🌍",
    },
    {
      key: "certification",
      label: "Certification",
      placeholder: "e.g., CE, FCC",
      icon: "✅",
    },
    {
      key: "energy_rating",
      label: "Energy Rating",
      placeholder: "e.g., A++",
      icon: "⚡",
    },
    {
      key: "dimensions",
      label: "Dimensions",
      placeholder: "e.g., 50x30x20 cm",
      icon: "📏",
    },
    {
      key: "weight_capacity",
      label: "Weight Capacity",
      placeholder: "e.g., 150 kg",
      icon: "⚖️",
    },
  ];

  const handleInputChange = (name, value) => {
    setCurrentDetail((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateDetail = () => {
    const newErrors = {};

    if (!currentDetail.label?.trim()) {
      newErrors.label = "Label is required";
    }

    if (!currentDetail.value?.trim()) {
      newErrors.value = "Value is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addOrUpdateDetail = () => {
    if (!validateDetail()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before adding the detail",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    const detailData = {
      label: currentDetail.label,
      value: currentDetail.value,
    };

    let newDetails;
    if (editingIndex !== null) {
      newDetails = [...customDetails];
      newDetails[editingIndex] = {
        ...customDetails[editingIndex],
        ...detailData,
      };
      setEditingIndex(null);
    } else {
      newDetails = [...customDetails, detailData];
    }

    onCustomDetailsChange(newDetails);
    resetForm();

    toast({
      title: editingIndex !== null ? "Detail Updated" : "Detail Added",
      description: `${detailData.label} has been ${
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
    setCurrentDetail({
      label: "",
      value: "",
    });
    setErrors({});
    setEditingIndex(null);
  };

  const useCommonDetail = (detail) => {
    setCurrentDetail({
      label: detail.label,
      value: "",
    });
    if (!isFormOpen) toggleForm();
  };

  const editDetail = (index) => {
    const detail = customDetails[index];
    setCurrentDetail(detail);
    setEditingIndex(index);
    if (!isFormOpen) toggleForm();
  };

  const removeDetail = (index) => {
    const newDetails = customDetails.filter((_, i) => i !== index);
    onCustomDetailsChange(newDetails);

    toast({
      title: "Detail Removed",
      description: "Custom detail has been removed successfully",
      status: "info",
      duration: 2000,
      isClosable: true,
      variant: "custom",
      containerStyle: customToastContainerStyle,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <HStack>
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            Custom Product Details
          </Text>
          {customDetails.length > 0 && (
            <Badge colorScheme="green" variant="subtle">
              {customDetails.length} detail
              {customDetails.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </HStack>
        <HStack>
          {customDetails.length > 0 && (
            <Button
              leftIcon={<FiEye />}
              size="sm"
              variant="ghost"
              onClick={togglePreview}
            >
              {isPreviewOpen ? "Hide Preview" : "Preview"}
            </Button>
          )}
          <Button
            leftIcon={<FiPlus />}
            size="sm"
            colorScheme="blue"
            onClick={toggleForm}
            variant={isFormOpen ? "outline" : "solid"}
          >
            {isFormOpen ? "Hide Form" : "Add Detail"}
          </Button>
        </HStack>
      </HStack>

      {/* Quick Add Common Details */}
      {customDetails.length === 0 && (
        <Box>
          <Text fontSize="md" fontWeight="medium" color="gray.700" mb={3}>
            Quick Add Common Details
          </Text>
          <Wrap spacing={2}>
            {commonDetails.map((detail) => (
              <WrapItem key={detail.key}>
                <Tooltip label={detail.placeholder} placement="top">
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => useCommonDetail(detail)}
                    leftIcon={<span>{detail.icon}</span>}
                  >
                    {detail.label}
                  </Button>
                </Tooltip>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      {/* Custom Detail Form */}
      <Collapse in={isFormOpen} animateOpacity>
        <Card variant="outline" borderColor="green.200">
          <CardHeader bg="green.50" py={4}>
            <HStack>
              <FiTag />
              <Text fontWeight="medium" color="green.800">
                {editingIndex !== null
                  ? "Edit Custom Detail"
                  : "Add Custom Detail"}
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <FormControl isInvalid={!!errors.label}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Display Label *
                  </FormLabel>
                  <Input
                    value={currentDetail.label}
                    onChange={(e) => handleInputChange("label", e.target.value)}
                    placeholder="e.g., Material"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "green.400",
                      boxShadow: "0 0 0 1px #38a169",
                    }}
                  />
                  <FormErrorMessage>{errors.label}</FormErrorMessage>
                  <FormHelperText>Label shown to customers</FormHelperText>
                </FormControl>

                <FormControl isInvalid={!!errors.value}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Value *
                  </FormLabel>
                  <Input
                    value={currentDetail.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    placeholder="e.g., Premium Wood"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{
                      borderColor: "green.400",
                      boxShadow: "0 0 0 1px #38a169",
                    }}
                  />
                  <FormErrorMessage>{errors.value}</FormErrorMessage>
                  <FormHelperText>The actual detail content</FormHelperText>
                </FormControl>
              </SimpleGrid>
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
                  colorScheme="green"
                  onClick={addOrUpdateDetail}
                  leftIcon={editingIndex !== null ? <FiEdit /> : <FiPlus />}
                >
                  {editingIndex !== null ? "Update Detail" : "Add Detail"}
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Collapse>

      {/* Custom Details List */}
      {customDetails.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            Added Details ({customDetails.length})
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {customDetails.map((detail, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Card variant="outline" _hover={{ shadow: "md" }}>
                  <CardBody>
                    <Flex justify="space-between" align="flex-start">
                      <VStack align="start" spacing={2} flex={1}>
                        <HStack>
                          <Text fontWeight="bold" color="gray.900">
                            {detail.label}
                          </Text>
                        </HStack>
                        <Text color="gray.600" fontSize="sm">
                          {detail.value}
                        </Text>
                      </VStack>

                      <VStack spacing={1} ml={4}>
                        <IconButton
                          icon={<FiEdit />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={() => editDetail(index)}
                          aria-label="Edit detail"
                          title="Edit detail"
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeDetail(index)}
                          aria-label="Remove detail"
                          title="Remove detail"
                        />
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>
              </MotionBox>
            ))}
          </SimpleGrid>
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
            <FiInfo size="2em" color="gray.400" />
            <Text fontWeight="medium" color="gray.600">
              No Custom Details Added Yet
            </Text>
            <Text color="gray.500" fontSize="sm">
              Add custom product specifications and features
            </Text>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              size="sm"
              onClick={toggleForm}
            >
              Add First Detail
            </Button>
          </VStack>
        </Box>
      )}

      {/* Preview Section */}
      <Collapse in={isPreviewOpen && customDetails.length > 0} animateOpacity>
        <Card variant="filled" bg="blue.50">
          <CardHeader>
            <HStack>
              <FiEye />
              <Text fontWeight="medium" color="blue.800">
                Customer Preview
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <Box
              bg="white"
              p={4}
              borderRadius="md"
              border="1px"
              borderColor="blue.200"
            >
              <Text fontSize="md" fontWeight="bold" color="gray.900" mb={3}>
                Product Specifications
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                {customDetails.map((detail, index) => (
                  <Flex key={index} justify="space-between" align="center">
                    <Text fontWeight="medium" color="gray.700" fontSize="sm">
                      {detail.label}:
                    </Text>
                    <Text color="gray.900" fontSize="sm">
                      {detail.value}
                    </Text>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>
          </CardBody>
        </Card>
      </Collapse>

      {/* Help Information */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertDescription fontSize="sm">
            <strong>Custom Details</strong> help customers understand your
            product better. Add specifications like materials, dimensions,
            certifications, or any unique features that make your product
            special.
          </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
};

export default CustomDetailsForm;
