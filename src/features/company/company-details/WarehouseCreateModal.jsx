import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  VStack,
  HStack,
  useToast,
  SimpleGrid,
  Text,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { companiesService } from '../services/companiesService';
import { handleApiError } from '../../../commons/handleApiError';
import { customToastContainerStyle } from '../../../commons/toastStyles';

const WarehouseCreateModal = ({ isOpen, onClose, companyId, onSuccess }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'main',
    address: '',
    city: '',
    country: '',
    postal_code: '',
    contact_email: '',
    contact_phone: '',
    is_active: true,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        description: 'Warehouse name is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await companiesService.createWarehouseMain(companyId, formData);
      
      toast({
        description: result.data.message || 'Warehouse created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      type: 'main',
      address: '',
      city: '',
      country: '',
      postal_code: '',
      contact_email: '',
      contact_phone: '',
      is_active: true,
      notes: ''
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Warehouse</ModalHeader>
        <ModalCloseButton />
        
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="sm">
                  Creating a main warehouse for centralized inventory management.
                </Text>
              </Alert>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Warehouse Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter warehouse name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Type</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="main">Main Warehouse</option>
                    <option value="outlet">Outlet</option>
                    <option value="write_off">Write-off</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Address</FormLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Country</FormLabel>
                  <Input
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Postal Code</FormLabel>
                  <Input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="Enter contact email"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Contact Phone</FormLabel>
                  <Input
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleChange}
                    placeholder="Enter contact phone"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>Active Status</FormLabel>
                  <Switch
                    name="is_active"
                    isChecked={formData.is_active}
                    onChange={handleChange}
                    colorScheme="blue"
                  />
                </HStack>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Create Warehouse
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default WarehouseCreateModal;
