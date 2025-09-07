import { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";

export default function EditPercentageModal({ isOpen, onClose, user, onSuccess, administrationService }) {
  const [percentage, setPercentage] = useState(user?.commission || "");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSave = async () => {
    setLoading(true);
    try {
      await administrationService.editPercentageCommission(user.id, percentage);
      toast({
        title: "Success",
        description: "Commission updated!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update commission",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Commission Percentage</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Commission (%)</FormLabel>
            <Input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              min={0}
              max={100}
              step={0.01}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} mr={3} variant="ghost">
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}