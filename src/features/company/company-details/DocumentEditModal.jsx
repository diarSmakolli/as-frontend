import React, { useState, useEffect, version } from "react";
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
  Switch,
  VStack,
  HStack,
  Box,
  Text,
  useToast,
  FormHelperText,
  Icon,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  Progress,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FiFile,
  FiUpload,
  FiPlus,
  FiX,
  FiInfo,
  FiAlertCircle,
  FiFileText,
  FiImage,
} from "react-icons/fi";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";

// Helper to get icon based on file type
const getFileIcon = (file) => {
  if (!file) return FiFile;

  if (typeof file === "string") {
    const ext = file.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return FiImage;
    if (["pdf"].includes(ext)) return FiFileText;
    if (["doc", "docx", "txt"].includes(ext)) return FiFileText;
    return FiFile;
  }

  const type = file.type;
  if (type.startsWith("image/")) return FiImage;
  if (type.startsWith("application/pdf")) return FiFileText;
  if (type.includes("word") || type.includes("document")) return FiFileText;

  return FiFile;
};

const DocumentEditModal = ({
  isOpen,
  onClose,
  companyId,
  document,
  onSuccess,
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    document_name: "",
    is_confidential: false,
    tags: [],
    version: "",
    expiration_date: "",
  });

  const [newDocumentFile, setNewDocumentFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [wasConfidential, setWasConfidential] = useState(false);
  const cancelRef = React.useRef();

  useEffect(() => {
    if (document && isOpen) {
      try {
        let parsedTags = [];

        if (Array.isArray(document.tags)) {
          parsedTags = document.tags;
        } else if (document.tags) {
          try {
            parsedTags = JSON.parse(document.tags);
          } catch (e) {
            parsedTags = [];
          }
        }

        // Format expiration_date for input type="date"
        let formattedExpirationDate = "";
        if (document.expiration_date) {
          try {
            formattedExpirationDate = new Date(document.expiration_date)
              .toISOString()
              .split("T")[0];
          } catch (e) {
            formattedExpirationDate = "";
          }
        }

        setFormData({
          document_name: document.document_name || "",
          is_confidential: document.is_confidential || false,
          tags: parsedTags || [],
          version: document.version || "",
          expiration_date: formattedExpirationDate || "",
        });

        setWasConfidential(document.is_confidential || false);
        setNewDocumentFile(null);
        setUploadProgress(0);
      } catch (error) {
        handleApiError(error, toast);
      }
    }
  }, [document, isOpen, toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 25MB",
        status: "error",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    setNewDocumentFile(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Check if tag already exists
      if (formData.tags.includes(tagInput.trim())) {
        toast({
          description: "This tag has already been added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
        return;
      }

      // Max 10 tags
      if (formData.tags.length >= 10) {
        toast({
          description: "You can add up to 10 tags per document",
          status: "warning",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
        return;
      }

      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const validateForm = () => {
    if (!formData.document_name.trim()) {
      toast({
        description: "Please enter a name for this document",
        status: "error",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      return false;
    }

    return true;
  };

  const handleConfirmButtonClick = () => {
    if (!validateForm()) return;

    if (!wasConfidential && formData.is_confidential) {
      setIsConfirmDialogOpen(true);
    } else if (wasConfidential && !formData.is_confidential) {
      setIsConfirmDialogOpen(true);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const documentDataToSend = {
        document_name: formData.document_name,
        is_confidential: formData.is_confidential,
        tags: JSON.stringify(formData.tags),
        version: document.version,
        expiration_date: formData.expiration_date,
      };

      const uploadConfig = newDocumentFile
        ? {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        : undefined;

      await companiesService.updateCompanyDocument(
        companyId,
        document.id,
        documentDataToSend,
        newDocumentFile,
        uploadConfig
      );

      toast({
        description: "Document has been updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
      setIsConfirmDialogOpen(false);
    }
  };

  if (!document) return null;

  const fileName = document.file_url
    ? document.file_url.split("/").pop()
    : "Unknown";
  const fileExt = document.file_url
    ? document.file_url.split(".").pop().toUpperCase()
    : "";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={isSubmitting ? undefined : onClose}
        size="lg"
        closeOnOverlayClick={!isSubmitting}
        closeOnEsc={!isSubmitting}
      >
        <ModalOverlay />
        <ModalContent
          bg="rgb(255,255,255)"
          color="gray.900"
          rounded="xl"
          shadow="xl"
        >
          <ModalHeader>Edit Document</ModalHeader>
          {!isSubmitting && <ModalCloseButton />}
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Document Name</FormLabel>
                <Input
                  name="document_name"
                  value={formData.document_name}
                  onChange={handleChange}
                  placeholder="Enter document name"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  isDisabled={isSubmitting}
                />
              </FormControl>

              <HStack spacing={4}>
                <FormControl>
                  <FormLabel>Version</FormLabel>
                  <Input
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    placeholder="E.g., 1.0 (optional)"
                    bg="rgb(241,241,241)"
                    borderColor="gray.400"
                    _hover={{ borderColor: "gray.400" }}
                    isDisabled={isSubmitting}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Expiration Date</FormLabel>
                  <Input
                    name="expiration_date"
                    type="date"
                    value={formData.expiration_date}
                    onChange={handleChange}
                    placeholder="Select date (optional)"
                    bg="rgb(241,241,241)"
                    borderColor="gray.400"
                    _hover={{ borderColor: "gray.400" }}
                    isDisabled={isSubmitting}
                    sx={{
                      "::-webkit-calendar-picker-indicator": {
                        filter: "invert(0.6)",
                      },
                    }}
                  />
                </FormControl>
              </HStack>

              <FormControl>
                <FormLabel>Tags</FormLabel>
                <InputGroup>
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add tags and press Enter"
                    bg="rgb(241,241,241)"
                    borderColor="gray.400"
                    _hover={{ borderColor: "gray.400" }}
                    isDisabled={isSubmitting}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={<FiPlus />}
                      size="sm"
                      onClick={handleAddTag}
                      isDisabled={!tagInput.trim() || isSubmitting}
                      aria-label="Add tag"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>
                  Tags help with document organization and search (max 10 tags)
                </FormHelperText>

                {formData.tags.length > 0 && (
                  <Box mt={2}>
                    <Flex wrap="wrap" gap={2}>
                      {formData.tags.map((tag, index) => (
                        <Tag
                          key={index}
                          size="md"
                          borderRadius="full"
                          variant="subtle"
                          colorScheme="blue"
                        >
                          <TagLabel>{tag}</TagLabel>
                          <TagCloseButton
                            onClick={() => handleRemoveTag(index)}
                            isDisabled={isSubmitting}
                          />
                        </Tag>
                      ))}
                    </Flex>
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>Confidential Document</FormLabel>
                  <Switch
                    name="is_confidential"
                    isChecked={formData.is_confidential}
                    onChange={handleChange}
                    colorScheme="red"
                    size="md"
                    isDisabled={isSubmitting}
                  />
                </HStack>
                <FormHelperText>
                  Mark as confidential if this document contains sensitive
                  information
                </FormHelperText>
                {formData.is_confidential && !wasConfidential && (
                  <HStack
                    mt={2}
                    bg="red.900"
                    p={2}
                    borderRadius="md"
                    opacity={0.9}
                  >
                    <Icon as={FiAlertCircle} color="red.200" />
                    <Text fontSize="sm" color="red.200">
                      Marking this document as confidential will restrict access
                    </Text>
                  </HStack>
                )}
                {!formData.is_confidential && wasConfidential && (
                  <HStack
                    mt={2}
                    bg="yellow.900"
                    p={2}
                    borderRadius="md"
                    opacity={0.9}
                  >
                    <Icon as={FiAlertCircle} color="yellow.200" />
                    <Text fontSize="sm" color="yellow.200">
                      Removing confidential status will make this document more
                      accessible
                    </Text>
                  </HStack>
                )}
              </FormControl>

              <Divider borderColor="gray.200" />

              <Box p={3} bg="transparent" borderRadius="md">
                <HStack spacing={2} align="flex-start">
                  <Icon
                    as={getFileIcon(document.file_url)}
                    color="blue.300"
                    mt={1}
                    flexShrink={0}
                    boxSize="20px"
                  />
                  <Box>
                    <HStack>
                      <Text fontSize="sm" fontWeight="medium" mb={1}>
                        Current File:
                      </Text>
                      <Badge colorScheme="blue">{fileExt}</Badge>
                    </HStack>
                    <Text fontSize="sm" noOfLines={1} fontWeight="medium">
                      {fileName}
                    </Text>
                    <Text fontSize="xs">
                      You can replace the current file by uploading a new one
                      below. If you don't upload a new file, the current file
                      will be kept.
                    </Text>
                  </Box>
                </HStack>
              </Box>

              <FormControl>
                <FormLabel>Replace File (Optional)</FormLabel>
                <Box
                  borderWidth={2}
                  borderColor={newDocumentFile ? "blue.500" : "gray.400"}
                  borderStyle="dashed"
                  rounded="md"
                  p={4}
                  textAlign="center"
                  bg="rgb(241,241,241)"
                  _hover={{
                    borderColor: newDocumentFile ? "blue.400" : "gray.400",
                  }}
                  cursor={isSubmitting ? "not-allowed" : "pointer"}
                  onClick={() =>
                    !isSubmitting &&
                    document.getElementById("document-file-input").click()
                  }
                  position="relative"
                  transition="all 0.2s"
                >
                  <Input
                    id="document-file-input"
                    type="file"
                    onChange={handleFileChange}
                    display="none"
                    isDisabled={isSubmitting}
                  />

                  {isSubmitting && newDocumentFile ? (
                    <VStack spacing={3}>
                      <Icon as={FiUpload} boxSize={8} color="blue.400" />
                      <Text fontWeight="medium">Uploading new file...</Text>
                      <Progress
                        value={uploadProgress}
                        size="sm"
                        width="100%"
                        colorScheme="blue"
                        borderRadius="full"
                      />
                      <Text fontSize="sm" color="blue.400">
                        {uploadProgress}% complete
                      </Text>
                    </VStack>
                  ) : newDocumentFile ? (
                    <>
                      <Icon
                        as={getFileIcon(newDocumentFile)}
                        boxSize={8}
                        color="blue.400"
                        mb={2}
                      />
                      <Text fontWeight="medium" mb={1}>
                        {newDocumentFile.name}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {newDocumentFile.type || "Unknown type"} •{" "}
                        {(newDocumentFile.size / (1024 * 1024)).toFixed(2)} MB
                      </Text>

                      <HStack mt={2} justify="center">
                        <IconButton
                          icon={<FiX />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewDocumentFile(null);
                          }}
                          aria-label="Remove selected file"
                          isDisabled={isSubmitting}
                        />
                      </HStack>
                    </>
                  ) : (
                    <>
                      <Icon as={FiUpload} boxSize={8} color="gray.500" mb={2} />
                      <Text fontWeight="medium" mb={1}>
                        Click to select a replacement file
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Maximum file size: 25MB. Supported formats: PDF, DOC,
                        DOCX, XLS, XLSX, TXT, CSV, ZIP, RAR, and images
                      </Text>
                    </>
                  )}
                </Box>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={onClose}
              variant="ghost"
              color="gray.900"
              _hover={{ bg: "transparent", color: "black" }}
              size="sm"
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              bg='black'
              color='white'
              _hover={{ bg: "gray.800" }}
              onClick={handleConfirmButtonClick}
              isLoading={isSubmitting}
              loadingText={newDocumentFile ? "Uploading..." : "Updating..."}
              isDisabled={isSubmitting || !formData.document_name.trim()}
              leftIcon={<FiUpload />}
              size="sm"
            >
              Update Document
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirmation Dialog for Confidentiality Changes */}
      <AlertDialog
        isOpen={isConfirmDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsConfirmDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.800" color="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <Icon
                  as={FiAlertCircle}
                  color={wasConfidential ? "yellow.400" : "red.400"}
                />
                <Text>Confirm Confidentiality Change</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              {wasConfidential && !formData.is_confidential ? (
                <Text mb={4}>
                  You're about to remove the <strong>confidential</strong>{" "}
                  status from this document. This will make it more accessible
                  to users who previously couldn't view it.
                </Text>
              ) : (
                <Text mb={4}>
                  You're about to mark this document as{" "}
                  <strong>confidential</strong>. This will restrict access to
                  only authorized users.
                </Text>
              )}
              <Text>Are you sure you want to continue with this change?</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsConfirmDialogOpen(false)}
                size="sm"
              >
                Cancel
              </Button>
              <Button
                colorScheme={wasConfidential ? "yellow" : "red"}
                onClick={handleSubmit}
                ml={3}
                size="sm"
              >
                Confirm Change
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DocumentEditModal;
