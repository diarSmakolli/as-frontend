import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  HStack,
  Badge,
  Text,
  Flex,
  Icon,
  Tooltip,
  Tag,
  Button,
  useToast,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {
  FiDownload,
  FiEdit,
  FiEye,
  FiFile,
  FiFilePlus,
  FiFileText,
  FiLock,
  FiTrash2,
  FiUnlock,
  FiAlertTriangle,
  FiImage,
  FiPackage,
} from "react-icons/fi";
import { formatRelativeTime } from "../../../commons/formatOptions";
import { handleApiError } from "../../../commons/handleApiError";
import { companiesService } from "../services/companiesService";
import { customToastContainerStyle } from "../../../commons/toastStyles";

// Helper function to determine file type icon
const getFileTypeIcon = (fileName) => {
  if (!fileName) return FiFile;
  const ext = fileName.split('.').pop().toLowerCase();
  
  // Document types
  if (['pdf'].includes(ext)) return FiFileText;
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return FiFileText;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return FiFileText;
  if (['ppt', 'pptx'].includes(ext)) return FiFileText;
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return FiImage;
  
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return FiPackage;
  
  return FiFile;
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

const getFilenameFromHeaders = (headers, fallbackName = 'document') => {
  const contentDisposition = headers['content-disposition'];
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1].replace(/['"]/g, '');
    }
  }
  return fallbackName;
};

// Helper function to create and trigger download
const triggerFileDownload = (blob, filename, contentType) => {
  const blobWithType = new Blob([blob], { 
    type: contentType || 'application/octet-stream' 
  });
  
  const url = window.URL.createObjectURL(blobWithType);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  
  // Append to body and click to trigger download
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  link.remove();
  window.URL.revokeObjectURL(url);
};

const DocumentsList = ({ 
  documents, 
  onEdit, 
  onDelete, 
  onView, 
  onUpload, 
  refreshDocuments,
  isLoading = false
}) => {
  const toast = useToast();
  const [downloadingId, setDownloadingId] = useState(null);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const handleDownload = async (doc) => {
    if (downloadingId) return;
    try {
      setDownloadingId(doc.id);
      
      const response = await companiesService.downloadCompanyDocument(
        doc.company_id, 
        doc.id
      );
      
      const filename = getFilenameFromHeaders(
        response.headers, 
        doc.document_name
      );
      
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      
      triggerFileDownload(response.data, filename, contentType);
      
      toast({
        description: `Downloaded ${filename} successfully (${formatFileSize(response.data.size || 0)})`,
        status: "success",
        duration: 3000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDeleteDialog = (document) => {
    setDocumentToDelete(document);
    onOpen();
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      onDelete(documentToDelete);
    }
    onClose();
  };

  if (isLoading) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderRadius="md"
        bg="gray.800"
        border="1px dashed"
        borderColor="gray.700"
      >
        <Spinner size="xl" color="blue.400" thickness="4px" mb={4} />
        <Text color="white" fontWeight="medium">
          Loading documents...
        </Text>
      </Box>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderRadius="md"
        bg="gray.800"
        border="1px dashed"
        borderColor="gray.700"
      >
        <Icon as={FiFileText} fontSize="3xl" color="gray.900" mb={3} />
        <Text fontWeight="bold" color="black" mb={1}>
          No Documents Found
        </Text>
        <Text color="gray.900" mb={4}>
          This company doesn't have any documents uploaded yet.
        </Text>
        <Button 
          leftIcon={<FiFilePlus />} 
          colorScheme="blue" 
          onClick={onUpload}
          size="md"
          shadow="md"
          _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
        >
          Upload Document
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Box overflowX="auto">
        <Table variant="simple" size="md" colorScheme="whiteAlpha">
          <Thead bg="rgb(255,255,255)">
            <Tr>
              <Th color="gray.900" borderColor="gray.200">Document Name</Th>
              <Th color="gray.900" borderColor="gray.200">Type</Th>
              <Th color="gray.900" borderColor="gray.200">Size</Th>
              <Th color="gray.900" borderColor="gray.200">Uploaded</Th>
              <Th color="gray.900" borderColor="gray.200">Status</Th>
              <Th color="gray.900" borderColor="gray.200" width="120px" textAlign="center">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {documents.map((doc) => (
              <Tr key={doc.id} _hover={{ bg: "rgb(241,241,241)" }}>
                <Td borderColor="gray.200">
                  <HStack>
                    <Icon 
                      as={getFileTypeIcon(doc.file_url)} 
                      color={doc.is_confidential ? "red.400" : "blue.400"} 
                      boxSize={5} 
                    />
                    <Box>
                      <Text color="black" fontWeight="medium" noOfLines={1}>
                        {doc.document_name}
                      </Text>
                      {doc.description && (
                        <Text color="gray.900" fontSize="xs" noOfLines={1}>
                          {doc.description}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                </Td>
                <Td borderColor="gray.200">
                  <Tag size="sm" colorScheme="blue" borderRadius="full">
                    {doc.file_url ? doc.file_url.split('.').pop().toUpperCase() : "N/A"}
                  </Tag>
                </Td>
                <Td borderColor="gray.200" fontSize="sm" color="gray.900">
                  {formatFileSize(doc.file_size)}
                </Td>
                <Td borderColor="gray.200" fontSize="sm" color="gray.900">
                  <Tooltip 
                    label={new Date(doc.created_at).toLocaleString()} 
                    placement="top" 
                    hasArrow
                  >
                    <Text>{formatRelativeTime(doc.created_at)}</Text>
                  </Tooltip>
                </Td>
                <Td borderColor="gray.200">
                  {doc.is_confidential ? (
                    <Badge colorScheme="red" borderRadius="full" px={2} display="flex" alignItems="center" width="fit-content">
                      <Icon as={FiLock} mr={1} boxSize={3} />
                      Confidential
                    </Badge>
                  ) : (
                    <Badge colorScheme="green" borderRadius="full" px={2} display="flex" alignItems="center" width="fit-content">
                      <Icon as={FiUnlock} mr={1} boxSize={3} />
                      Public
                    </Badge>
                  )}
                </Td>
                <Td borderColor="gray.200">
                  <Flex justify="center">
                    <HStack spacing={1}>
                      <Tooltip label="View Details" placement="top">
                        <IconButton
                          icon={<FiEye />}
                          aria-label="View document details"
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => onView(doc)}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Download" placement="top">
                        <IconButton
                          icon={downloadingId === doc.id ? <Spinner size="sm" /> : <FiDownload />}
                          aria-label="Download document"
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          isDisabled={downloadingId !== null}
                          onClick={() => handleDownload(doc)}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Edit" placement="top">
                        <IconButton
                          icon={<FiEdit />}
                          aria-label="Edit document"
                          size="sm"
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => onEdit(doc)}
                        />
                      </Tooltip>
                      
                      <Tooltip label="Delete" placement="top">
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Delete document"
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDeleteDialog(doc)}
                        />
                      </Tooltip>
                    </HStack>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Confirmation Dialog for Document Deletion */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
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
                Are you sure you want to delete "{documentToDelete?.document_name}"? This action cannot be undone.
              </Text>
              {documentToDelete?.is_confidential && (
                <HStack mt={4} bg="red.900" p={2} borderRadius="md">
                  <Icon as={FiLock} color="red.200" />
                  <Text fontSize="sm" color="red.200">
                    This is a confidential document. Deletion will remove all access to it.
                  </Text>
                </HStack>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={confirmDelete} 
                ml={3}
                leftIcon={<FiTrash2 />}
                size="sm"
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

export default DocumentsList;
