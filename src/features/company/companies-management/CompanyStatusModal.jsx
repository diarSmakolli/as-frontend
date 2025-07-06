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
  useToast,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { companiesService } from "../services/companiesService";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const CompanyStatusModal = ({
  isOpen,
  onClose,
  company,
  action,
  refreshList,
}) => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isActivating = action === "activate";

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      let result;

      if (isActivating) {
        result = await companiesService.markCompanyActive(company.id);
      } else {
        result = await companiesService.markCompanyInactive(company.id);
      }

      toast({
        description: result.data.message || `Company ${
          isActivating ? "activated" : "deactivated"
        } successfully`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: 'custom',
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

  if (!company) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="rgb(255,255,255)" color="gray.900" rounded='xl'>
        <ModalHeader>
          {isActivating ? "Activate Company" : "Deactivate Company"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="center">
            <Icon
              as={isActivating ? FiCheckCircle : FiAlertTriangle}
              color={isActivating ? "green.400" : "red.400"}
              boxSize={12}
            />
            <Text>
              Are you sure you want to{" "}
              {isActivating ? "activate" : "deactivate"} the company{" "}
              <strong>{company.business_name}</strong>?
            </Text>
            {!isActivating && (
              <Text color="red.300" fontSize="sm">
                Deactivating this company will prevent users from accessing its
                resources and services until reactivated.
              </Text>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose} size='sm' color='gray.900' bg='transparent' _hover={{ bg: 'transparent' }}>
            Cancel
          </Button>
          <Button
            colorScheme={isActivating ? "green" : "red"}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            size='sm'
          >
            {isActivating ? "Activate" : "Deactivate"} Company
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompanyStatusModal;
