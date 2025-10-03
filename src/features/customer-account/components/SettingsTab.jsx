import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

const SettingsTab = ({
  customer,
  emailNotificationsEnabled,
  emailNotifLoading,
  handleToggleEmailNotifications,
  changePasswordModal,
  setChangePasswordModal,
  handleChangePasswordField,
  handleChangePasswordSubmit,
  openChangePasswordModal,
  fileInputRef,
  handleProfilePictureChange,
  handleCustomFileClick,
  deleteAccountModal,
  openDeleteAccountModal,
  closeDeleteAccountModal,
  handleDeleteAccount,
  deleteLoading,
}) => {
  return (
    <>
      <Box
        bg="rgb(255,255,255)"
        p={6}
        borderRadius="2xl"
        fontFamily="Airbnb Cereal VF"
        border="1px solid rgba(145, 158, 171, 0.2)"
      >
        <VStack spacing={6} align="stretch">
          <Text
            fontSize="lg"
            fontWeight="500"
            color="rgba(10, 9, 9, 1)"
            fontFamily="Airbnb Cereal VF"
          >
            Paramètres du compte
          </Text>

          <VStack spacing={4} align="stretch">
            <Box
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <VStack align="flex-start" spacing={1}>
                  <Text
                    fontWeight="500"
                    fontFamily="Airbnb Cereal VF"
                    color="rgba(67, 76, 80, 1)"
                  >
                    Notifications par e-mail
                  </Text>
                  <Text
                    fontSize="sm"
                    color="rgba(67, 76, 80, 1)"
                    fontFamily="Airbnb Cereal VF"
                  >
                    Recevez des mises à jour sur vos commandes et votre
                    compte
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  color="rgb(99, 115, 129)"
                  rounded="50px"
                  border="1px solid rgba(145, 158, 171, 0.2)"
                  p="18px 18px"
                  bg="#fff"
                  fontWeight={"500"}
                  fontFamily="Airbnb Cereal VF"
                  isLoading={emailNotifLoading}
                  onClick={handleToggleEmailNotifications}
                >
                  {emailNotificationsEnabled ? "Activé" : "Désactivé"}
                </Button>
              </HStack>
            </Box>

            <Box
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <VStack align="flex-start" spacing={1}>
                  <Text fontWeight="500">Mot de passe</Text>
                  <Text fontSize="sm" color="gray.500">
                    Changer le mot de passe de votre compte
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  color="rgb(99, 115, 129)"
                  rounded="50px"
                  border="1px solid rgba(145, 158, 171, 0.2)"
                  p="18px 18px"
                  bg="#fff"
                  fontWeight={"500"}
                  fontFamily="Airbnb Cereal VF"
                  onClick={openChangePasswordModal}
                >
                  Changement
                </Button>
              </HStack>
            </Box>

            <Box
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <VStack align="flex-start" spacing={1}>
                  <Text fontWeight="500">Profile Picture</Text>
                  <Text fontSize="sm" color="gray.500">
                    Télécharger une nouvelle photo de profil
                  </Text>
                  <HStack spacing={4} mt={2}>
                    <Avatar
                      size="lg"
                      name={`${customer?.first_name} ${customer?.last_name}`}
                      src={customer?.profile_picture_url}
                    />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleProfilePictureChange}
                    />
                    <Button
                      size="sm"
                      color="rgb(99, 115, 129)"
                      rounded="50px"
                      border="1px solid rgba(145, 158, 171, 0.2)"
                      p="18px 18px"
                      bg="#fff"
                      fontWeight={"500"}
                      fontFamily="Airbnb Cereal VF"
                      onClick={handleCustomFileClick}
                    >
                      Télécharger une photo
                    </Button>
                  </HStack>
                </VStack>
              </HStack>
            </Box>

            <Box
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
            >
              <HStack justify="space-between">
                <VStack align="flex-start" spacing={1}>
                  <Text fontWeight="500">Delete Account</Text>
                  <Text fontSize="sm" color="gray.500">
                    Réussir à désactiver votre compte
                  </Text>
                </VStack>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  rounded="full"
                  onClick={openDeleteAccountModal}
                >
                  Désactiver
                </Button>
              </HStack>
            </Box>
          </VStack>
        </VStack>
      </Box>

      {/* Change password modal */}
      <Modal
        isOpen={changePasswordModal.isOpen}
        onClose={() =>
          setChangePasswordModal((prev) => ({ ...prev, isOpen: false }))
        }
        size="md"
      >
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader
            fontFamily={"Airbnb Cereal VF"}
            fontSize={"lg"}
            fontWeight={"500"}
          >
            Changer le mot de passe
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl
                isRequired
                isInvalid={!!changePasswordModal.errors.currentPassword}
              >
                <FormLabel
                  color="rgb(99, 115, 129)"
                  fontWeight={"normal"}
                >
                  Mot de passe actuel
                </FormLabel>
                <Input
                  name="currentPassword"
                  type="password"
                  border="1.5px solid rgba(145, 158, 171, 0.2)"
                  rounded="25px"
                  fontSize="sm"
                  value={changePasswordModal.currentPassword}
                  onChange={handleChangePasswordField}
                  placeholder="Entrez le mot de passe actuel"
                />
                <FormErrorMessage>
                  {changePasswordModal.errors.currentPassword}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!changePasswordModal.errors.newPassword}
              >
                <FormLabel
                  color="rgb(99, 115, 129)"
                  fontWeight={"normal"}
                >
                  Nouveau mot de passe
                </FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  border="1.5px solid rgba(145, 158, 171, 0.2)"
                  rounded="25px"
                  fontSize="sm"
                  value={changePasswordModal.newPassword}
                  onChange={handleChangePasswordField}
                  placeholder="Entrez un nouveau mot de passe"
                />
                <FormErrorMessage>
                  {changePasswordModal.errors.newPassword}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={!!changePasswordModal.errors.confirmPassword}
              >
                <FormLabel
                  color="rgb(99, 115, 129)"
                  fontWeight={"normal"}
                >
                  Confirmer le nouveau mot de passe
                </FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  border="1.5px solid rgba(145, 158, 171, 0.2)"
                  rounded="25px"
                  fontSize="sm"
                  value={changePasswordModal.confirmPassword}
                  onChange={handleChangePasswordField}
                  placeholder="Confirmer le nouveau mot de passe"
                />
                <FormErrorMessage>
                  {changePasswordModal.errors.confirmPassword}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              fontWeight={"500"}
              mr={3}
              onClick={() =>
                setChangePasswordModal((prev) => ({
                  ...prev,
                  isOpen: false,
                }))
              }
            >
              Annuler
            </Button>
            <Button
              bg="#fff"
              color="rgba(48, 51, 57, 1)"
              fontSize={"sm"}
              border="1.5px solid rgba(145, 158, 171, 0.2)"
              rounded="full"
              fontWeight={"500"}
              onClick={handleChangePasswordSubmit}
              isLoading={changePasswordModal.loading}
            >
              Changer le mot de passe
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteAccountModal}
        onClose={closeDeleteAccountModal}
        isCentered
      >
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader>Désactiver le compte</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Êtes-vous sûr de vouloir désactiver votre compte ? Cette action peut être annulée en contactant le support.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={closeDeleteAccountModal}
            >
              Annuler
            </Button>
            <Button
              colorScheme="red"
              rounded="full"
              onClick={handleDeleteAccount}
              isLoading={deleteLoading}
            >
              Désactiver
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingsTab;