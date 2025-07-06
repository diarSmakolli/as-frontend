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
  Input,
  Textarea,
  VStack,
  HStack,
  useToast,
  Box,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import CommonSelect from "../../../commons/components/CommonSelect";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const ASSET_CATEGORIES = [
  {
    label: "Furniture",
    value: "Furniture",
  },
  {
    label: "Electronics",
    value: "Electronics",
  },
  {
    label: "Office Equipment",
    value: "Office Equipment",
  },
  {
    label: "Machinery",
    value: "Machinery",
  },
  {
    label: "Real Estate",
    value: "Real Estate",
  },
  {
    label: "IT Equipment",
    value: "IT Equipment",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const ASSET_STATUSES = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Inactive",
    value: "inactive",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Verified",
    value: "verified",
  },
];

const AssetEditModal = ({ isOpen, onClose, companyId, asset, onSuccess }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    asset_name: "",
    asset_tag: "",
    category: "",
    serial_number: "",
    model: "",
    location: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (asset && isOpen) {
      setFormData({
        asset_name: asset.asset_name || "",
        asset_tag: asset.asset_tag || "",
        category: asset.category || "",
        serial_number: asset.serial_number || "",
        model: asset.model || "",
        location: asset.location || "",
        description: asset.description || "",
        status: asset.status || "active",
      });
    }
  }, [asset, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.asset_name.trim() || !formData.asset_tag.trim()) {
      toast({
        description: "Asset name and asset tag are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await companiesService.updateCompanyAsset(companyId, asset.id, formData);
      
      toast({
        description: result.data.message || "Asset updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle
      });
      
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !asset) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="rgb(255,255,255)" color="gray.900" rounded="xl">
          <ModalHeader>Edit Asset</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center" py={10}>
            <Spinner size="xl" color="blue.400" />
            <Text mt={4}>Loading asset details...</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" rounded="xl">
        <ModalHeader>Edit Asset</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Asset Name</FormLabel>
                <Input
                  name="asset_name"
                  value={formData.asset_name}
                  onChange={handleChange}
                  placeholder="Asset name"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Asset Tag</FormLabel>
                <Input
                  name="asset_tag"
                  value={formData.asset_tag}
                  onChange={handleChange}
                  placeholder="Unique identifier"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <CommonSelect
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={ASSET_CATEGORIES}
                  placeholder="Select category"
                  isSearchable={false}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <CommonSelect
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={ASSET_STATUSES}
                  placeholder="Select status"
                  isSearchable={false} 
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Serial Number</FormLabel>
                <Input
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="Serial number"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Model</FormLabel>
                <Input
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Model"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Asset location"
                bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Asset description"
                rows={3}
                bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
              />
            </FormControl>

            {/* Note about images */}
            <Box bg="rgb(241,241,241)" p={3} borderRadius="md">
              <Text fontSize="sm">
                Note: Images cannot be modified through this form. Images can only be added when creating a new asset.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            onClick={onClose}
            bg="transparent"
            color="gray.900"
            _hover={{ bg: "transparent", color: "black" }}
            size='sm'
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            size='sm'
            bg='black'
            color='white'
            _hover={{ bg: "gray.800" }}
          >
            Update Asset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssetEditModal;
