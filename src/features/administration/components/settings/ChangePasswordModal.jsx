import { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast,
    Spinner,
} from "@chakra-ui/react";
import { administrationService } from '../../services/administrationService';
import { customToastContainerStyle } from '../../../../commons/toastStyles';
import { handleApiError } from '../../../../commons/handleApiError';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const resetForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast({
                description: 'Please fill in all fields',
                status: 'error',
                duration: 3000,
                isClosable: true,
                variant: 'custom',
                containerStyle: customToastContainerStyle,
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                description: 'New passwords do not match',
                status: 'error',
                duration: 3000,
                isClosable: true,
                variant: 'custom',
                containerStyle: customToastContainerStyle,
            });
            return;
        }
        setIsLoading(true);
        try {
            const response = await administrationService.changePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            toast({
                description: response.data.message,
                status: 'success',
                duration: 3000,
                isClosable: true,
                variant: 'custom',
                containerStyle: customToastContainerStyle,
            });
            resetForm();
            onClose();
        } catch (error) {
            handleApiError(error, toast);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
            <ModalOverlay />
            <ModalContent bg="rgb(241, 241, 241)" color="gray.900">
                <ModalHeader
                    borderBottomWidth="1px"
                    borderColor="gray.300"
                    fontFamily="Inter"
                    fontSize="md"
                    fontWeight="400"
                    color="gray.900"
                >
                    Change Password
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel
                            fontSize="xs"
                            fontWeight="400"
                            color="gray.900"
                            fontFamily="Inter"
                        >
                            Current Password
                        </FormLabel>
                        <Input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            bg="rgb(255,255,255)"
                            borderColor="gray.400"
                            size="sm"
                            rounded="lg"
                            _hover={{ borderColor: 'gray.400' }}
                            fontFamily="Inter"
                            placeholder='Please enter your current password'
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel
                            fontSize="xs"
                            fontWeight="400"
                            color="gray.900"
                            fontFamily="Inter"
                        >
                            New Password
                        </FormLabel>
                        <Input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            bg="rgb(255,255,255)"
                            borderColor="gray.400"
                            size="sm"
                            rounded="lg"
                            _hover={{ borderColor: 'gray.400' }}
                            fontFamily="Inter"
                            placeholder='Please enter your new password'
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel
                            fontSize="xs"
                            fontWeight="400"
                            color="gray.900"
                            fontFamily="Inter"
                        >
                            Confirm New Password
                        </FormLabel>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            bg="rgb(255,255,255)"
                            borderColor="gray.400"
                            size="sm"
                            rounded="lg"
                            _hover={{ borderColor: 'gray.400' }}
                            fontFamily="Inter"
                            placeholder='Please enter your new password'
                        />
                    </FormControl>
                </ModalBody>

                <ModalFooter borderTopWidth="1px" borderColor="gray.300">
                    <Button
                        onClick={handleClose}
                        mr={3}
                        size="sm"
                        fontFamily="Inter"
                        fontSize="xs"
                        bg='transparent'
                        _hover={{ bg: "rgba(255,255,255,0.05)" }}
                        color='gray.900'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        bg="black"
                        _hover={{ bg: 'gray.800' }}
                        size="sm"
                        isLoading={isLoading}
                        fontFamily="Inter"
                        fontSize="xs"
                        color='white'
                    >
                        {isLoading ? <Spinner size="sm" /> : 'Change password'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ChangePasswordModal;