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
  Icon,
  VStack,
  Text,
  HStack,
  Box,
  useToast,
  Badge,
  Flex,
  Tag,
  Divider,
} from "@chakra-ui/react";
import { 
  FiAlertTriangle, 
  FiFileText, 
  FiFile, 
  FiLock, 
  FiTrash2,
  FiImage
} from "react-icons/fi";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";

// Helper function to get appropriate icon based on file extension
const getFileIcon = (fileName) => {
  if (!fileName) return FiFile;
  
  const ext = fileName.split('.').pop().toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return FiImage;
  if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(ext)) return FiFileText;
  
  return FiFile;
};

const DocumentDeleteModal = ({ isOpen, onClose, companyId, document, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!document || !companyId) return;
    
    setIsDeleting(true);
    try {
      const result = await companiesService.deleteCompanyDocument(companyId, document.id);
      
      toast({
        description: result.data.message || "Document has been permanently removed",
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
      setIsDeleting(false);
    }
  };

  if (!document) return null;

  // Parse tags if necessary
  let tags = [];
  if (document.tags) {
    if (Array.isArray(document.tags)) {
      tags = document.tags;
    } else {
      try {
        tags = JSON.parse(document.tags);
      } catch (e) {
        tags = [];
      }
    }
  }

  // Get file extension for display
  const fileExt = document.file_url ? document.file_url.split('.').pop().toUpperCase() : "";
  const fileName = document.file_url ? document.file_url.split('/').pop() : "Unknown";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="black">
        <ModalHeader>
          <HStack>
            <Icon as={FiAlertTriangle} color="red.400" />
            <Text>Delete Document</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text>
              Are you sure you want to delete "<strong>{document.document_name}</strong>"? 
              This action cannot be undone.
            </Text>

            <Box bg="gray.700" p={3} borderRadius="md">
              <HStack spacing={3} mb={2}>
                <Icon as={getFileIcon(document.file_url)} color="blue.300" boxSize={6} />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">{document.document_name}</Text>
                  <HStack>
                    <Badge colorScheme="blue">{fileExt}</Badge>
                    {document.file_size && (
                      <Text fontSize="xs" color="gray.400">
                        {(document.file_size / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </HStack>
              
              {document.description && (
                <Text fontSize="sm" color="gray.900" mt={2}>
                  {document.description}
                </Text>
              )}
              
              {tags.length > 0 && (
                <Box mt={2}>
                  <Flex wrap="wrap" gap={1}>
                    {tags.map((tag, index) => (
                      <Tag key={index} size="sm" colorScheme="blue" variant="subtle">
                        {tag}
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              )}
            </Box>
            
            <Divider borderColor="gray.200" />

            {document.is_confidential && (
              <HStack bg="red.900" p={3} borderRadius="md" spacing={3}>
                <Icon as={FiLock} color="red.200" boxSize={5} flexShrink={0} />
                <Text fontSize="sm" color="red.100">
                  This is a confidential document. Deletion will remove all access to it.
                </Text>
              </HStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button 
            color='black'
            mr={3} 
            onClick={onClose}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={handleDelete}
            isLoading={isDeleting}
            size="sm"
          >
            Delete Document
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DocumentDeleteModal;
