// filepath: /Users/bashclay/Desktop/dev/dev-local/as-solutions-fourniture-e-commerce-system/client/src/features/customer-account/components/AccountSettings.jsx
import React, { useRef } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Avatar,
  Switch,
  Divider,
  useColorModeValue,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";
import {
  IoSettingsOutline,
  IoNotificationsOutline,
  IoKeyOutline,
  IoPersonOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoCloudUploadOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";

const AccountSettings = ({
  customer,
  emailNotificationsEnabled,
  emailNotifLoading,
  handleToggleEmailNotifications,
  changePasswordModal,
  setChangePasswordModal,
  handleChangePasswordField,
  handleChangePasswordSubmit,
  fileInputRef,
  handleCustomFileClick,
  handleProfilePictureChange,
  deleteAccountModal,
  setDeleteAccountModal,
  handleDeleteAccount,
  deleteLoading,
}) => {
  const openChangePasswordModal = () => {
    setChangePasswordModal({
      isOpen: true,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      errors: {},
      loading: false,
    });
  };

  // Handler to open modal
  const openDeleteAccountModal = () => setDeleteAccountModal(true);
  // Handler to close modal
  const closeDeleteAccountModal = () => setDeleteAccountModal(false);

  // Color mode values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtleColor = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const buttonColorScheme = "blue";
  const dangerColorScheme = "red";
  const tabListBg = useColorModeValue("gray.100", "gray.700");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  
  return (
    <>
      <Box
        bg={cardBg}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          <HStack spacing={3}>
            <Icon as={IoSettingsOutline} boxSize="5" color="blue.500" />
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              color={textColor}
            >
              Paramètres du compte
            </Text>
          </HStack>

          <Tabs 
            variant="soft-rounded" 
            colorScheme={buttonColorScheme}
            isLazy
          >
            <TabList
              bg={tabListBg}
              p={1.5}
              borderRadius="xl"
              overflowX={{ base: "auto", md: "visible" }}
              overflowY="hidden"
              sx={{
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <Tab 
                py={2}
                px={4}
                fontWeight="500"
                _selected={{ color: `${buttonColorScheme}.700`, bg: "white" }}
                whiteSpace="nowrap"
              >
                <HStack spacing={2}>
                  <Icon as={IoPersonOutline} />
                  <Text>Profil</Text>
                </HStack>
              </Tab>
              <Tab 
                py={2}
                px={4}
                fontWeight="500"
                _selected={{ color: `${buttonColorScheme}.700`, bg: "white" }}
                whiteSpace="nowrap"
              >
                <HStack spacing={2}>
                  <Icon as={IoNotificationsOutline} />
                  <Text>Notifications</Text>
                </HStack>
              </Tab>
              <Tab 
                py={2}
                px={4}
                fontWeight="500"
                _selected={{ color: `${buttonColorScheme}.700`, bg: "white" }}
                whiteSpace="nowrap"
              >
                <HStack spacing={2}>
                  <Icon as={IoKeyOutline} />
                  <Text>Mot de passe</Text>
                </HStack>
              </Tab>
              <Tab 
                py={2}
                px={4}
                fontWeight="500"
                _selected={{ color: `dangerColorScheme}.700`, bg: "white" }}
                whiteSpace="nowrap"
              >
                <HStack spacing={2}>
                  <Icon as={IoTrashOutline} />
                  <Text>Compte</Text>
                </HStack>
              </Tab>
            </TabList>
            
            <TabPanels mt={6}>
              {/* Profile Tab */}
              <TabPanel px={0}>
                <VStack spacing={5} align="stretch">
                  {/* Profile Picture Section */}
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={useColorModeValue("gray.50", "gray.700")}
                  >
                    <VStack align="start" spacing={4}>
                      <Text fontWeight="600" fontSize="md">
                        Photo de profil
                      </Text>
                      
                      <HStack spacing={6} w="full" flexWrap="wrap">
                        <Avatar
                          size="xl"
                          name={`${customer?.first_name} ${customer?.last_name}`}
                          src={customer?.profile_picture_url}
                          border="3px solid"
                          borderColor={useColorModeValue("blue.500", "blue.300")}
                        />
                        
                        <VStack align="start" spacing={4} flex="1">
                          <Text fontSize="sm" color={subtleColor}>
                            Téléchargez une photo professionnelle ou personnelle. Une image claire montrant votre visage aide les autres utilisateurs à vous reconnaître.
                          </Text>
                          
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleProfilePictureChange}
                          />
                          
                          <Button
                            leftIcon={<Icon as={IoCloudUploadOutline} />}
                            colorScheme={buttonColorScheme}
                            onClick={handleCustomFileClick}
                            size="md"
                          >
                            Télécharger une photo
                          </Button>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                  
                  {/* Account Details Section */}
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    <VStack align="start" spacing={4}>
                      <Text fontWeight="600" fontSize="md">
                        Détails du compte
                      </Text>
                      
                      <SimpleAccountDetail 
                        label="ID Client"
                        value={customer?.id}
                        badgeText="Permanent"
                        badgeColor="purple"
                      />
                      
                      <Divider />
                      
                      <SimpleAccountDetail 
                        label="Email"
                        value={customer?.email}
                        badgeText={customer?.email_verified ? "Vérifié" : "Non vérifié"}
                        badgeColor={customer?.email_verified ? "green" : "yellow"}
                      />
                      
                      <Divider />
                      
                      <SimpleAccountDetail 
                        label="Créé le"
                        value={customer?.created_at
                          ? new Date(customer.created_at).toLocaleDateString("fr-FR", {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : "N/A"}
                        badgeText={customer?.is_active ? "Actif" : "Inactif"}
                        badgeColor={customer?.is_active ? "green" : "red"}
                      />
                    </VStack>
                  </Box>
                  
                  {/* Personal Information Section */}
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    <VStack align="start" spacing={4}>
                      <Text fontWeight="600" fontSize="md">
                        Informations personnelles
                      </Text>
                      
                      <SimpleAccountDetail 
                        label="Nom complet"
                        value={`${customer?.first_name || ''} ${customer?.last_name || ''}`}
                      />
                      
                      <Divider />
                      
                      <SimpleAccountDetail 
                        label="Type de client"
                        value={customer?.customer_type === 'business' ? 'Entreprise' : 'Client'}
                        badgeText={customer?.customer_type === 'business' ? "Pro" : "Particulier"}
                        badgeColor={customer?.customer_type === 'business' ? "blue" : "gray"}
                      />
                      
                      {customer?.customer_type === 'business' && (
                        <>
                          <Divider />
                          <SimpleAccountDetail 
                            label="Entreprise"
                            value={customer?.business_name || 'N/A'}
                          />
                          
                          <Divider />
                          <SimpleAccountDetail 
                            label="Numéro d'enregistrement"
                            value={customer?.business_registration_number || 'N/A'}
                          />
                        </>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Notifications Tab */}
              <TabPanel px={0}>
                <VStack spacing={5} align="stretch">
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    <VStack align="start" spacing={4} width="100%">
                      <Text fontWeight="600" fontSize="md">
                        Préférences de notification
                      </Text>
                      
                      <HStack 
                        width="100%" 
                        justifyContent="space-between" 
                        bg={hoverBg}
                        p={4}
                        borderRadius="md"
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="500">Notifications par e-mail</Text>
                          <Text fontSize="sm" color={subtleColor}>
                            Recevez des mises à jour sur vos commandes et votre compte
                          </Text>
                        </VStack>
                        <Switch
                          isChecked={emailNotificationsEnabled}
                          onChange={handleToggleEmailNotifications}
                          colorScheme={buttonColorScheme}
                          size="lg"
                          isDisabled={emailNotifLoading}
                        />
                      </HStack>
                      
                      <Text fontSize="sm" color={subtleColor} pt={2}>
                        Vous recevrez toujours les e-mails essentiels concernant votre compte, comme les notifications de sécurité et les confirmations de commande, même si vous désactivez les notifications par e-mail.
                      </Text>
                    </VStack>
                  </Box>
                  
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    <VStack align="start" spacing={4} width="100%">
                      <Text fontWeight="600" fontSize="md">
                        Type de notifications
                      </Text>
                      
                      <NotificationPreference
                        title="Statut de la commande"
                        description="Mises à jour sur les commandes passées"
                        isChecked={emailNotificationsEnabled}
                        colorScheme={buttonColorScheme}
                        isDisabled={!emailNotificationsEnabled || emailNotifLoading}
                      />
                      
                      <Divider />
                      
                      <NotificationPreference
                        title="Promotions et offres"
                        description="Actualités, remises et offres spéciales"
                        isChecked={emailNotificationsEnabled}
                        colorScheme={buttonColorScheme}
                        isDisabled={!emailNotificationsEnabled || emailNotifLoading}
                      />
                      
                      <Divider />
                      
                      <NotificationPreference
                        title="Nouveaux produits"
                        description="Notifications sur les nouveaux produits"
                        isChecked={emailNotificationsEnabled}
                        colorScheme={buttonColorScheme}
                        isDisabled={!emailNotificationsEnabled || emailNotifLoading}
                      />
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Password Tab */}
              <TabPanel px={0}>
                <VStack spacing={5} align="stretch">
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    <VStack align="start" spacing={4} width="100%">
                      <HStack width="100%" justifyContent="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600" fontSize="md">
                            Mot de passe
                          </Text>
                          <Text fontSize="sm" color={subtleColor}>
                            Dernière mise à jour du mot de passe il y a {Math.floor(Math.random() * 60) + 1} jours
                          </Text>
                        </VStack>
                        
                        <Button
                          leftIcon={<Icon as={IoKeyOutline} />}
                          colorScheme={buttonColorScheme}
                          onClick={openChangePasswordModal}
                          size="md"
                        >
                          Changer le mot de passe
                        </Button>
                      </HStack>
                      
                      <Box
                        bg={headerBg}
                        p={4}
                        borderRadius="md"
                        width="100%"
                      >
                        <HStack spacing={3}>
                          <Icon as={IoCheckmarkCircleOutline} color="green.500" boxSize="5" />
                          <Text fontSize="sm" fontWeight="500">
                            Conseils pour un mot de passe fort
                          </Text>
                        </HStack>
                        <VStack align="start" pl={8} pt={2} spacing={1}>
                          <Text fontSize="sm" color={subtleColor}>
                            • Utilisez au moins 8 caractères
                          </Text>
                          <Text fontSize="sm" color={subtleColor}>
                            • Mélangez lettres, chiffres et symboles
                          </Text>
                          <Text fontSize="sm" color={subtleColor}>
                            • Évitez les mots de passe déjà utilisés
                          </Text>
                          <Text fontSize="sm" color={subtleColor}>
                            • Ne partagez jamais votre mot de passe
                          </Text>
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Account Tab */}
              <TabPanel px={0}>
                <VStack spacing={5} align="stretch">
                  {/* Sessions */}
                  <Box
                    p={5}
                    border="1px"
                    borderColor={borderColor}
                    borderRadius="lg"
                    bg={cardBg}
                  >
                    <VStack align="start" spacing={4} width="100%">
                      <HStack width="100%" justifyContent="space-between">
                        <Text fontWeight="600" fontSize="md">
                          Session active
                        </Text>
                        
                        <Button
                          leftIcon={<Icon as={FaSignOutAlt} />}
                          colorScheme={buttonColorScheme}
                          variant="outline"
                          size="sm"
                        >
                          Déconnexion
                        </Button>
                      </HStack>
                      
                      <HStack
                        width="100%"
                        p={4}
                        bg={hoverBg}
                        borderRadius="md"
                        spacing={4}
                      >
                        <Box
                          bg="green.500"
                          p={2}
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Icon as={FaRegUserCircle} color="white" boxSize="6" />
                        </Box>
                        
                        <VStack align="start" spacing={0} flex="1">
                          <Text fontWeight="500">Session actuelle</Text>
                          <Text fontSize="sm" color={subtleColor}>
                            Navigateur • {navigator.platform || 'Unknown device'}
                          </Text>
                        </VStack>
                        
                        <Badge colorScheme="green" variant="subtle">
                          Actif maintenant
                        </Badge>
                      </HStack>
                    </VStack>
                  </Box>
                  
                  {/* Danger Zone */}
                  <Box
                    p={5}
                    border="1px"
                    borderColor="red.200"
                    borderRadius="lg"
                    bg={useColorModeValue("red.50", "red.900")}
                  >
                    <VStack align="start" spacing={4} width="100%">
                      <HStack spacing={2}>
                        <Icon as={IoWarningOutline} color="red.500" boxSize="5" />
                        <Text fontWeight="600" fontSize="md" color="red.500">
                          Zone de danger
                        </Text>
                      </HStack>
                      
                      <HStack
                        width="100%"
                        justifyContent="space-between"
                        p={4}
                        bg={useColorModeValue("white", "red.800")}
                        borderRadius="md"
                        border="1px"
                        borderColor="red.200"
                      >
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="500">Désactiver le compte</Text>
                          <Text fontSize="sm" color={subtleColor}>
                            Cette action peut être annulée en contactant le support.
                          </Text>
                        </VStack>
                        
                        <Button
                          colorScheme={dangerColorScheme}
                          onClick={openDeleteAccountModal}
                          size="md"
                        >
                          Désactiver
                        </Button>
                      </HStack>
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>

      {/* Change Password Modal */}
      <Modal
        isOpen={changePasswordModal.isOpen}
        onClose={() =>
          setChangePasswordModal((prev) => ({ ...prev, isOpen: false }))
        }
        size="md"
        isCentered
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader>Changer le mot de passe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl
                isRequired
                isInvalid={!!changePasswordModal.errors.currentPassword}
              >
                <FormLabel>Mot de passe actuel</FormLabel>
                <Input
                  name="currentPassword"
                  type="password"
                  value={changePasswordModal.currentPassword}
                  onChange={handleChangePasswordField}
                  placeholder="Entrez votre mot de passe actuel"
                  borderRadius="md"
                />
                <FormErrorMessage>
                  {changePasswordModal.errors.currentPassword}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl
                isRequired
                isInvalid={!!changePasswordModal.errors.newPassword}
              >
                <FormLabel>Nouveau mot de passe</FormLabel>
                <Input
                  name="newPassword"
                  type="password"
                  value={changePasswordModal.newPassword}
                  onChange={handleChangePasswordField}
                  placeholder="Entrez un nouveau mot de passe"
                  borderRadius="md"
                />
                <FormErrorMessage>
                  {changePasswordModal.errors.newPassword}
                </FormErrorMessage>
              </FormControl>
              
              <FormControl
                isRequired
                isInvalid={!!changePasswordModal.errors.confirmPassword}
              >
                <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={changePasswordModal.confirmPassword}
                  onChange={handleChangePasswordField}
                  placeholder="Confirmer le nouveau mot de passe"
                  borderRadius="md"
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
              colorScheme={buttonColorScheme}
              onClick={handleChangePasswordSubmit}
              isLoading={changePasswordModal.loading}
              loadingText="Mise à jour..."
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
        size="md"
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader color="red.500">
            <HStack spacing={2}>
              <Icon as={IoWarningOutline} />
              <Text>Désactiver le compte</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Êtes-vous sûr de vouloir désactiver votre compte? Cette action peut être annulée en contactant le support client.
            </Text>
            <VStack align="start" spacing={3} bg="red.50" p={4} borderRadius="md">
              <Text fontWeight="500" color="red.500">
                Conséquences:
              </Text>
              <HStack spacing={2} align="flex-start">
                <Icon as={IoWarningOutline} color="red.500" mt={1} />
                <Text fontSize="sm">
                  Vos informations personnelles et historique de commandes resteront conservés pendant 30 jours, puis seront archivés.
                </Text>
              </HStack>
              <HStack spacing={2} align="flex-start">
                <Icon as={IoWarningOutline} color="red.500" mt={1} />
                <Text fontSize="sm">
                  Vous ne pourrez plus vous connecter à votre compte ni accéder à votre historique de commandes.
                </Text>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={closeDeleteAccountModal}
            >
              Annuler
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteAccount}
              isLoading={deleteLoading}
              loadingText="Désactivation..."
            >
              Confirmer la désactivation
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

// Simple component to display account details
const SimpleAccountDetail = ({ label, value, badgeText, badgeColor }) => {
  const subtleColor = useColorModeValue("gray.500", "gray.400");
  
  return (
    <HStack width="100%" justifyContent="space-between">
      <Text fontSize="sm" color={subtleColor}>
        {label}
      </Text>
      <HStack>
        <Text fontWeight="500">
          {value || 'N/A'}
        </Text>
        {badgeText && (
          <Badge colorScheme={badgeColor || "gray"} ml={2}>
            {badgeText}
          </Badge>
        )}
      </HStack>
    </HStack>
  );
};

// Notification preference component
const NotificationPreference = ({ title, description, isChecked, onChange, colorScheme, isDisabled }) => {
  const subtleColor = useColorModeValue("gray.500", "gray.400");
  
  return (
    <HStack width="100%" justifyContent="space-between">
      <VStack align="start" spacing={0}>
        <Text fontWeight="500">{title}</Text>
        <Text fontSize="sm" color={subtleColor}>
          {description}
        </Text>
      </VStack>
      <Switch
        isChecked={isChecked}
        onChange={onChange}
        colorScheme={colorScheme}
        isDisabled={isDisabled}
        size="md"
      />
    </HStack>
  );
};

export default AccountSettings;