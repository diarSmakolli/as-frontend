import React, { useState, useEffect } from 'react';
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
  useToast,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { companiesService } from '../services/companiesService';
import { customToastContainerStyle } from '../../../commons/toastStyles';
import { handleApiError } from '../../../commons/handleApiError';
import CommonSelect from '../../../commons/components/CommonSelect';

const CompanyUpdateModal = ({ isOpen, onClose, companyId, refreshList }) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (isOpen && companyId) {
      fetchCompanyDetails();
    }
  }, [isOpen, companyId]);

  const fetchCompanyDetails = async () => {
    try {
      setIsLoading(true);
      const response = await companiesService.getCompanyInfo(companyId);
      setCompany(response.data.data);
    } catch (error) {
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Validate required fields
      if (!company.business_name || !company.market_name) {
        toast({
          title: "Required fields missing",
          description: "Business name and market name are required",
          status: "error",
          duration: 5000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
        setIsSubmitting(false);
        return;
      }
      
      const result = await companiesService.updateCompany(companyId, company);
      
      toast({
        description: result.data.message || 'Company updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      
      if (refreshList) refreshList();
      onClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Update Company</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" py={10}>
            <Spinner size="xl" />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  if (!company) {
    return null;
  }

  const businessTypeOptions = [
    { value: "Retailer", label: "Retailer" },
    { value: "Manufacturer", label: "Manufacturer" },
    { value: "Distributor", label: "Distributor" },
    { value: "Service Provider", label: "Service Provider" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" rounded="xl">
        <ModalHeader>Update Company: {company.business_name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Business Name</FormLabel>
                <Input
                  name="business_name"
                  value={company.business_name || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Market Name</FormLabel>
                <Input
                  name="market_name"
                  value={company.market_name || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Type of Business</FormLabel>
                <CommonSelect
                  name="type_of_business"
                  value={company.type_of_business}
                  onChange={handleChange}
                  options={businessTypeOptions}
                  placeholder="Select business type"
                  size="md"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Unique Business Identifier</FormLabel>
                <Input
                  name="number_unique_identifier"
                  value={company.number_unique_identifier || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Fiscal Number</FormLabel>
                <Input
                  name="fiscal_number"
                  value={company.fiscal_number || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value={company.country || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  value={company.city || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  name="postal_code"
                  value={company.postal_code || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                name="address"
                value={company.address || ""}
                onChange={handleChange}
                bg="rgb(241,241,241)"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  name="phone_number"
                  value={company.phone_number || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Website URL</FormLabel>
                <Input
                  name="website_url"
                  value={company.website_url || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Contact Person</FormLabel>
              <Input
                name="contact_person"
                value={company.contact_person || ""}
                onChange={handleChange}
                bg="rgb(241,241,241)"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
              />
            </FormControl>

            <HStack spacing={4}>
              <FormControl>
                <FormLabel>Contact Email</FormLabel>
                <Input
                  name="contact_person_email"
                  value={company.contact_person_email || ""}
                  onChange={handleChange}
                  type="email"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Contact Phone</FormLabel>
                <Input
                  name="contact_person_phone"
                  value={company.contact_person_phone || ""}
                  onChange={handleChange}
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel>Internal Notes</FormLabel>
              <Textarea
                name="notes_internal"
                value={company.notes_internal || ""}
                onChange={handleChange}
                rows={3}
                bg="rgb(241,241,241)"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            onClick={onClose}
            bg="transparent"
            color="gray.900"
            _hover={{ bg: "transparent" }}
            size="sm"
          >
            Cancel
          </Button>
          <Button
            bg='black'
            color='white'
            _hover={{ bg: 'gray.800' }}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            size="sm"
          >
            Update Company
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompanyUpdateModal;
