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
  Text,
  VStack,
  HStack,
  Box,
  Icon,
  Badge,
  Divider,
  Flex,
  Tag,
  SimpleGrid,
  Link,
  useToast,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  AspectRatio,
  Image,
  Tooltip,
  ButtonGroup,
  IconButton,
  Center,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogCloseButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiDownload,
  FiFile,
  FiFileText,
  FiLock,
  FiTag,
  FiUser,
  FiEye,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiImage,
  FiPackage,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import { formatRelativeTime } from "../../../commons/formatOptions";
import DocumentFallback from "./DocumentFallback";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const getFileTypeInfo = (fileName) => {
  if (!fileName) return { icon: FiFile, color: "gray.500" };
  const ext = fileName.split(".").pop().toLowerCase();

  // Document types
  if (["pdf"].includes(ext)) return { icon: FiFileText, color: "red.400" };
  if (["doc", "docx", "txt", "rtf"].includes(ext))
    return { icon: FiFileText, color: "blue.400" };
  if (["xls", "xlsx", "csv"].includes(ext))
    return { icon: FiFileText, color: "green.400" };
  if (["ppt", "pptx"].includes(ext))
    return { icon: FiFileText, color: "orange.400" };

  // Images
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext))
    return { icon: FiImage, color: "purple.400" };

  // Compressed
  if (["zip", "rar", "tar", "gz", "7z"].includes(ext))
    return { icon: FiPackage, color: "yellow.400" };

  return { icon: FiFile, color: "gray.500" };
};

const isPreviewable = (fileName) => {
  if (!fileName) return false;
  const ext = fileName.split(".").pop().toLowerCase();

  return ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext);
};

const DocumentViewModal = ({
  isOpen,
  onClose,
  companyId,
  document,
  onEdit,
  onDelete,
}) => {
  const toast = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [imageError, setImageError] = useState(false);
  const deleteDialog = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(0);
      setImageError(false);
    }
  }, [isOpen]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await companiesService.downloadCompanyDocument(
        companyId,
        document.id
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = window.document.createElement("a");
      link.href = url;

      const fileName = document.document_name;
      const fileExt = document.file_url
        ? document.file_url.split(".").pop()
        : "";
      link.setAttribute("download", `${fileName}.${fileExt}`);

      window.document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        description: `Downloading ${fileName}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConfirmDelete = () => {
    onDelete(document);
    deleteDialog.onClose();
    onClose();
  };

  if (!document) return null;

  // Parse tags
  const tags = Array.isArray(document.tags)
    ? document.tags
    : document.tags
    ? JSON.parse(document.tags)
    : [];

  // Get file info
  const fileTypeInfo = getFileTypeInfo(document.file_url);
  const fileName = document.file_url
    ? document.file_url.split("/").pop()
    : "Unknown";
  const fileExt = document.file_url
    ? document.file_url.split(".").pop().toUpperCase()
    : "";

  // Check if file is previewable
  const canPreview = isPreviewable(document.file_url) && !imageError;

  // Construct file URL for preview
  const fileUrl = document.file_url
    ? `http://localhost:8086${document.file_url}`
    : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={canPreview ? "2xl" : "lg"}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent
          bg="rgb(255,255,255)"
          color="gray.900"
          rounded="xl"
          shadow="xl"
        >
          <ModalHeader pr={12}>
            <HStack>
              <Icon
                as={fileTypeInfo.icon}
                color={fileTypeInfo.color}
                boxSize={5}
                mr={2}
              />
              <Text noOfLines={1}>{document.document_name}</Text>
            </HStack>
            {document.is_confidential && (
              <Badge colorScheme="red" ml={7} mt={1}>
                CONFIDENTIAL
              </Badge>
            )}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Tabs
              variant="soft-rounded"
              colorScheme="blue"
              isFitted
              index={activeTab}
              onChange={setActiveTab}
              mb={4}
            >
              <TabList mb={3}>
                <Tab>Details</Tab>
                {canPreview && <Tab>Preview</Tab>}
              </TabList>
              <TabPanels>
                {/* Details Tab */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    {/* File info */}
                    <Box bg="rgb(241,241,241)" p={4} borderRadius="md">
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <HStack spacing={3}>
                          <Icon as={FiFile} color="gray.900" boxSize={5} />
                          <Box>
                            <Text fontSize="sm" color="gray.900">
                              File Name
                            </Text>
                            <Text fontWeight="medium" noOfLines={1}>
                              {fileName}
                            </Text>
                          </Box>
                        </HStack>

                        <HStack spacing={3}>
                          <Box
                            textAlign="center"
                            bg="gray.200"
                            p={1}
                            borderRadius="md"
                            width="auto"
                            height="auto"
                          >
                            <Text fontWeight="bold" fontSize="md">
                              {fileExt}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.900">
                              File Size
                            </Text>
                            <Text fontWeight="medium">
                              {formatFileSize(document.file_size)}
                            </Text>
                          </Box>
                        </HStack>
                      </SimpleGrid>
                    </Box>

                    {/* Description */}
                    {document.description && (
                      <Box>
                        <Text fontSize="sm" color="gray.900" mb={1}>
                          Description
                        </Text>
                        <Text>{document.description}</Text>
                      </Box>
                    )}

                    {/* Tags */}
                    {tags.length > 0 && (
                      <Box>
                        <HStack spacing={2} mb={2}>
                          <Icon as={FiTag} color="gray.900" />
                          <Text fontSize="sm" color="gray.900">
                            Tags
                          </Text>
                        </HStack>
                        <Flex wrap="wrap" gap={2}>
                          {tags.map((tag, index) => (
                            <Tag
                              key={index}
                              size="md"
                              borderRadius="full"
                              variant="subtle"
                              colorScheme="blue"
                            >
                              {tag}
                            </Tag>
                          ))}
                        </Flex>
                      </Box>
                    )}

                    <Divider borderColor="gray.200" />

                    {/* Metadata */}
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <HStack spacing={3} align="flex-start">
                        <Icon as={FiCalendar} color="gray.500" mt={1} />
                        <Box>
                          <Text fontSize="sm" color="gray.500">
                            Uploaded
                          </Text>
                          <Text>
                            {document.created_at
                              ? new Date(
                                  document.created_at
                                ).toLocaleDateString()
                              : "Unknown"}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {document.created_at
                              ? formatRelativeTime(document.created_at)
                              : ""}
                          </Text>
                        </Box>
                      </HStack>

                      <HStack spacing={3} align="flex-start">
                        <Icon as={FiUser} color="gray.500" mt={1} />
                        <Box>
                          <Text fontSize="sm" color="gray.500">
                            Uploaded By
                          </Text>
                          <Text>
                            {document.uploader_name || "Unknown User"}
                          </Text>
                        </Box>
                      </HStack>
                    </SimpleGrid>

                    {document.is_confidential && (
                      <HStack
                        bg="red.900"
                        p={3}
                        borderRadius="md"
                        opacity={0.9}
                        spacing={3}
                      >
                        <Icon
                          as={FiLock}
                          color="red.200"
                          boxSize={5}
                          flexShrink={0}
                        />
                        <Text fontSize="sm" color="red.100">
                          This is a confidential document with restricted
                          access. Please handle with care.
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </TabPanel>

                {/* Preview Tab (shown only for previewable files) */}
                {canPreview && (
                  <TabPanel p={0}>
                    <Box
                      borderWidth="1px"
                      borderColor="gray.400"
                      borderRadius="md"
                      overflow="hidden"
                      bg="gray.200"
                    >
                      <AspectRatio ratio={16 / 9} maxH="500px">
                        <Image
                          src={fileUrl}
                          alt={document.document_name}
                          objectFit="contain"
                          onError={() => setImageError(true)}
                          fallback={
                            <Center>
                              <Spinner
                                size="xl"
                                color="blue.400"
                                thickness="4px"
                              />
                            </Center>
                          }
                        />
                      </AspectRatio>
                    </Box>

                    <HStack justify="center" mt={4}>
                      <Button
                        size="sm"
                        leftIcon={<FiExternalLink />}
                        colorScheme="blue"
                        variant="ghost"
                        as="a"
                        href={fileUrl}
                        target="_blank"
                      >
                        Open In New Tab
                      </Button>
                      <Button
                        size="sm"
                        leftIcon={<FiDownload />}
                        colorScheme="blue"
                        onClick={handleDownload}
                        isLoading={isDownloading}
                      >
                        Download
                      </Button>
                    </HStack>
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>

            {!canPreview && activeTab === 0 && (
              <Center my={4}>
                <DocumentFallback
                  fileType={fileExt}
                  fileName={document.document_name}
                  size="md"
                />
              </Center>
            )}
          </ModalBody>

          <ModalFooter>
            <ButtonGroup spacing={2}>
              {onEdit && (
                <Button
                  colorScheme="blue"
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiEdit />}
                  onClick={() => {
                    onClose();
                    onEdit(document);
                  }}
                >
                  Edit
                </Button>
              )}

              {onDelete && (
                <Button
                  colorScheme="red"
                  variant="ghost"
                  size="sm"
                  leftIcon={<FiTrash2 />}
                  onClick={deleteDialog.onOpen}
                >
                  Delete
                </Button>
              )}

              <Button
                colorScheme="blue"
                leftIcon={<FiDownload />}
                onClick={handleDownload}
                isLoading={isDownloading}
                size="sm"
              >
                Download
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete confirmation dialog */}
      <AlertDialog
        isOpen={deleteDialog.isOpen}
        leastDestructiveRef={cancelRef}
        onClose={deleteDialog.onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="rgb(255,255,255)" color="black">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              <HStack>
                <Icon as={FiAlertTriangle} color="red.400" />
                <Text>Delete Document</Text>
              </HStack>
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>
                Are you sure you want to delete "{document?.document_name}"?
                This action cannot be undone.
              </Text>
              {document?.is_confidential && (
                <HStack mt={4} bg="red.900" p={2} borderRadius="md">
                  <Icon as={FiLock} color="red.200" />
                  <Text fontSize="sm" color="red.200">
                    This is a confidential document. Deletion will remove all
                    access to it.
                  </Text>
                </HStack>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button size="sm" ref={cancelRef} onClick={deleteDialog.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                size="sm"
                ml={3}
                leftIcon={<FiTrash2 />}
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DocumentViewModal;
