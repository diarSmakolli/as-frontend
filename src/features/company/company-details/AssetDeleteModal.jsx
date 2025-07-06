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
  Text,
  Box,
  Icon,
  VStack,
  useToast,
  SimpleGrid,
  Image,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { FiAlertTriangle, FiImage, FiInfo } from "react-icons/fi";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import NoImage from "../../../assets/no-image.svg";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const AssetDeleteModal = ({ isOpen, onClose, companyId, asset, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const handleDelete = async () => {
    if (!asset || !companyId) return;
    
    setIsDeleting(true);
    try {
      const result = await companiesService.deleteCompanyAsset(companyId, asset.id);
      
      toast({
        description: result.data.message || "Asset deleted successfully.",
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

  if (!asset) return null;

  const hasImages = asset.images && asset.images.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" rounded="xl">
        <ModalHeader fontSize={'lg'}>Delete Asset</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} align="center">
              <Box 
                color="red.500" 
                fontSize="4xl" 
                bg="red.900" 
                p={3} 
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FiAlertTriangle} />
              </Box>
              <Box>
                <Text fontWeight="bold" fontSize="md">
                  Confirm Deletion
                </Text>
                <Text fontSize="sm" color="gray.400">
                  This action cannot be undone
                </Text>
              </Box>
            </HStack>

            <Box p={3} borderRadius="md">
              <Text fontWeight="medium" mb={1}>
                Asset Details:
              </Text>
              <Text>
                <strong>Name:</strong> {asset.asset_name}
              </Text>
              <Text>
                <strong>ID:</strong> {asset.asset_tag}
              </Text>
              {asset.category && (
                <Text>
                  <strong>Category:</strong> {asset.category}
                </Text>
              )}
            </Box>
            
            {hasImages && (
              <Box>
                <HStack mb={2}>
                  <Icon as={FiImage} color="red.400" />
                  <Text fontWeight="medium" color="red.400">
                    {asset.images.length} image{asset.images.length !== 1 ? 's' : ''} will be permanently deleted:
                  </Text>
                </HStack>
                <SimpleGrid columns={3} spacing={2}>
                  {asset.images.map((img, index) => (
                    <Box 
                      key={index} 
                      height="60px" 
                      borderRadius="md" 
                      overflow="hidden"
                      border="1px solid"
                      borderColor="gray.700"
                    >
                      <Image
                        src={`http://localhost:8086${img.url}`}
                        alt={`Asset image ${index + 1}`}
                        height="100%"
                        width="100%"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            )}
            
            <Divider borderColor="gray.700" />
            
            <HStack 
              bg="red.900" 
              p={3} 
              borderRadius="md" 
              opacity={0.9}
              spacing={3}
            >
              <Icon as={FiInfo} color="red.200" boxSize={5} flexShrink={0} />
              <Text fontSize="sm" color="red.100">
                Warning: Deleting this asset will remove all associated data, including images, from the system permanently.
              </Text>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="gray.900"
            _hover={{ bg: "transparent", color: "black" }}
            size='sm'
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={<FiAlertTriangle />}
            size='sm'
          >
            Confirm Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssetDeleteModal;
