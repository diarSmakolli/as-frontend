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
  useToast,
  Text,
  Box,
  Image,
} from "@chakra-ui/react";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";
import CommonSelect from "../../../commons/components/CommonSelect";

const CompanyCreateModal = ({ isOpen, onClose, refreshList }) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    market_name: "",
    type_of_business: "",
    number_unique_identifier: "",
    fiscal_number: "",
    city: "",
    country: "",
    address: "",
    postal_code: "",
    phone_number: "",
    contact_person: "",
    contact_person_email: "",
    contact_person_phone: "",
    website_url: "",
    notes_internal: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!formData.business_name || !formData.market_name) {
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

      const response = await companiesService.createCompany(formData);

      toast({
        description: response.data.message || "Company created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });

      // Reset form and close modal
      setFormData({
        business_name: "",
        market_name: "",
        type_of_business: "",
        number_unique_identifier: "",
        fiscal_number: "",
        city: "",
        country: "",
        address: "",
        postal_code: "",
        phone_number: "",
        contact_person: "",
        contact_person_email: "",
        contact_person_phone: "",
        website_url: "",
        notes_internal: "",
      });
      setLogoFile(null);
      setLogoPreview(null);

      // Refresh the companies list
      if (refreshList) refreshList();

      onClose();
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <ModalHeader>Create New Company</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Business Name</FormLabel>
                <Input
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Official business name"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Market Name</FormLabel>
                <Input
                  name="market_name"
                  value={formData.market_name}
                  onChange={handleChange}
                  placeholder="Trading as name"
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
                  value={formData.type_of_business}
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
                  value={formData.number_unique_identifier}
                  onChange={handleChange}
                  placeholder="Unique ID number"
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
                  value={formData.fiscal_number}
                  onChange={handleChange}
                  placeholder="Tax ID or fiscal number"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
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
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Postal Code</FormLabel>
                <Input
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="Postal/ZIP code"
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
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
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
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Company phone number"
                  bg="rgb(241,241,241)"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Website URL</FormLabel>
                <Input
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  placeholder="https://example.com"
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
                value={formData.contact_person}
                onChange={handleChange}
                placeholder="Primary contact name"
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
                  value={formData.contact_person_email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
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
                  value={formData.contact_person_phone}
                  onChange={handleChange}
                  placeholder="Contact phone number"
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
                value={formData.notes_internal}
                onChange={handleChange}
                placeholder="Notes for internal use only"
                rows={3}
                bg="rgb(241,241,241)"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Company Logo</FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                p={1}
                bg="rgb(241,241,241)"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
              />
              {logoPreview && (
                <Box mt={2}>
                  <Text mb={1}>Preview:</Text>
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    maxHeight="100px"
                    borderRadius="md"
                  />
                </Box>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            mr={3}
            onClick={onClose}
            size="sm"
            color="gray.900"
            bg="transparent"
            _hover={{ bg: "transparent" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            size="sm"
            bg='black'
            color='white'
            _hover={{ bg: 'gray.800' }}
          >
            Create Company
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompanyCreateModal;
