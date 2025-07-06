import React, { useState } from "react";
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
  Select,
  Textarea,
  VStack,
  HStack,
  Box,
  SimpleGrid,
  Text,
  Image,
  Icon,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { FiImage, FiUpload, FiX, FiPaperclip } from "react-icons/fi";
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

const AssetCreateModal = ({ isOpen, onClose, companyId, onSuccess }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
    if (e.target) {
      e.target.value = null;
    }
  };


  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) {
        return;
    }
    setIsDragging(false);
  };

  const removeImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({
      asset_name: "",
      asset_tag: "",
      category: "",
      serial_number: "",
      model: "",
      location: "",
      description: "",
      status: "",
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setIsDragging(false);
  };

  // handle submit
  const handleSubmit = async () => {
    if (!formData.asset_name.trim() || !formData.asset_tag.trim()) {
      toast({
        description: "Asset name and asset tag are required.",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await companiesService.createCompanyAsset(
        companyId,
        formData,
        selectedImages
      );

      toast({
        description: result.data.message || "Asset created successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      resetForm();
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  // process files
  const processFiles = (filesArray) => {
    const validFiles = filesArray.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== filesArray.length) {
      toast({
        description: "Only images under 10MB are allowed.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    }

    if (validFiles.length) {
      const newFiles = validFiles.filter(
        (vf) =>
          !selectedImages.some(
            (sf) => sf.name === vf.name && sf.size === vf.size
          )
      );

      if (newFiles.length !== validFiles.length) {
        toast({
          description: "Some of the selected images were already added.",
          status: "info",
          duration: 3000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      }

      setSelectedImages((prev) => [...prev, ...newFiles]);

      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" rounded="xl">
        <ModalHeader>Add New Asset</ModalHeader>
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
                  options={ASSET_CATEGORIES.map((category) => ({
                    label: category.label,
                    value: category.value,
                  }))}
                  placeholder="Select category"
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

             <FormControl>
              <FormLabel>Asset Images</FormLabel>
              <Box
                borderWidth={2}
                borderColor={isDragging ? "blue.400" : "gray.400"}
                borderStyle="dashed"
                rounded="lg" 
                p={6} 
                textAlign="center"
                bg={isDragging ? "rgba(66, 153, 225, 0.1)" : "rgb(241,241,241)"}
                _hover={{ borderColor: "blue.400", bg: "rgba(66, 153, 225, 0.05)" }}
                cursor="pointer"
                onClick={() => document.getElementById("asset-images-input")?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                transition="background-color 0.2s ease, border-color 0.2s ease" 
              >
                <Input
                  id="asset-images-input"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  display="none"
                />
                <Icon as={isDragging ? FiPaperclip : FiUpload} boxSize={10} color={isDragging ? "blue.400" : "gray.900"} mb={3} />
                <Text fontWeight="medium" mb={1} color={isDragging ? "blue.300" : "gray.900"}>
                  {isDragging ? "Drop images here" : "Click or Drag & Drop to Upload"}
                </Text>
                <Text fontSize="xs" color="gray.900">
                  Up to 10 images, each less than 10MB (JPEG, PNG, GIF)
                </Text>
              </Box>
            </FormControl>

            {imagePreviews.length > 0 && (
              <Box>
                <Text fontWeight="medium" mb={2}>
                  Selected Images ({imagePreviews.length})
                </Text>
                <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing={3}>
                  {imagePreviews.map((preview, index) => (
                    <Box
                      key={index}
                      position="relative"
                      borderRadius="md"
                      overflow="hidden"
                      boxShadow="md"
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        objectFit="cover"
                        height="100px"
                        width="100%"
                      />
                      <Box
                        position="absolute"
                        top={1}
                        right={1}
                        backgroundColor="blackAlpha.700"
                        borderRadius="full"
                      >
                        <Icon
                          as={FiX}
                          color="white"
                          boxSize={5}
                          cursor="pointer"
                          p={1}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}
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
            bg='black'
            color='white'
            _hover={{ bg: "gray.800" }}
            size='sm'
          >
            Add Asset
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssetCreateModal;
