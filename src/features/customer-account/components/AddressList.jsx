// filepath: /Users/bashclay/Desktop/dev/dev-local/as-solutions-fourniture-e-commerce-system/client/src/features/customer-account/components/AddressList.jsx
import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Icon,
  Flex,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  FormErrorMessage,
  useDisclosure,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaPhone, FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";

const AddressList = ({
  addresses,
  newAddress,
  handleAddressChange,
  handleAddAddress,
  handleDeleteAddress,
  editAddressModal,
  setEditAddressModal,
  handleEditAddressChange,
  handleEditAddressSubmit,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Colors for theming
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtleColor = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const headerBg = useColorModeValue("blue.50", "blue.900");
  const buttonBg = useColorModeValue("blue.500", "blue.400");
  const buttonText = useColorModeValue("white", "white");
  const defaultBadgeBg = useColorModeValue("blue.500", "blue.400");

  return (
    <>
      <Box
        bg={cardBg}
        p={6}
        borderRadius="xl"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={6} align="stretch">
          {/* Mobile Add Button */}
          <Button
            leftIcon={<Icon as={FaPlusCircle} />}
            colorScheme="blue"
            size="md"
            borderRadius="lg"
            w="100%"
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
          >
            Ajouter une nouvelle adresse
          </Button>

          {/* Header with Desktop Add Button */}
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Icon as={FaMapMarkerAlt} color={accentColor} boxSize="5" />
              <Text fontSize="xl" fontWeight="600" color={textColor}>
                Adresses de livraison
              </Text>
            </HStack>
            <Button
              leftIcon={<Icon as={FaPlusCircle} />}
              colorScheme="blue"
              size="md"
              borderRadius="lg"
              onClick={onOpen}
              display={{ base: "none", md: "flex" }}
            >
              Ajouter une nouvelle adresse
            </Button>
          </Flex>

          {addresses && addresses.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={4}
              align="stretch"
            >
              {addresses.map((address, index) => (
                <Box
                  key={index}
                  p={5}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="xl"
                  position="relative"
                  boxShadow="sm"
                  transition="all 0.2s"
                  _hover={{ 
                    boxShadow: "md", 
                    transform: "translateY(-2px)",
                    borderColor: accentColor
                  }}
                  bg={address.is_default ? headerBg : cardBg}
                >
                  {address.is_default && (
                    <Badge
                      position="absolute"
                      top={3}
                      right={3}
                      fontSize="xs"
                      bg={defaultBadgeBg}
                      color="white"
                      py={1}
                      px={3}
                      borderRadius="md"
                      fontWeight="500"
                    >
                      Par défaut
                    </Badge>
                  )}

                  <VStack align="flex-start" spacing={3}>
                    <HStack spacing={2}>
                      <Icon as={FaMapMarkerAlt} color={accentColor} />
                      <Text
                        fontWeight="600"
                        fontSize="lg"
                        color={textColor}
                      >
                        {address.label}
                      </Text>
                    </HStack>

                    <Box pl={1}>
                      <Text fontSize="md" color={textColor} mb={1}>
                        {address.street}
                      </Text>

                      <Text fontSize="md" color={subtleColor} mb={1}>
                        {address.city}, {address.postal_code}
                      </Text>

                      <Text fontSize="md" color={subtleColor} mb={2}>
                        {address.country}
                      </Text>

                      {address.phone && (
                        <HStack spacing={2} mt={1} color={subtleColor}>
                          <Icon as={FaPhone} size="sm" />
                          <Text fontSize="sm">
                            {address.phone}
                          </Text>
                        </HStack>
                      )}
                    </Box>

                    <HStack spacing={3} mt={2} width="100%">
                      <Button
                        size="sm"
                        leftIcon={<Icon as={FaEdit} />}
                        colorScheme="blue"
                        variant="outline"
                        flex={1}
                        onClick={() =>
                          setEditAddressModal({
                            isOpen: true,
                            addressIdentifier: address.label,
                            values: { ...address },
                            errors: {},
                          })
                        }
                      >
                        Modifier
                      </Button>
                      {!address.is_default && (
                        <Button
                          size="sm"
                          leftIcon={<Icon as={FaTrash} />}
                          colorScheme="red"
                          variant="outline"
                          flex={1}
                          onClick={() => handleDeleteAddress(address.label)}
                        >
                          Supprimer
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box 
              textAlign="center" 
              py={12}
              bg={headerBg}
              borderRadius="xl"
              border="1px dashed"
              borderColor={borderColor}
            >
              <Icon
                as={FaMapMarkerAlt}
                boxSize="16"
                color={accentColor}
                mb={4}
                opacity={0.5}
              />
              <Text fontSize="xl" fontWeight="600" color={textColor} mb={2}>
                Aucune adresse enregistrée
              </Text>
              <Text fontSize="md" color={subtleColor} mb={6}>
                Ajoutez une adresse pour faciliter l'expédition de vos commandes.
              </Text>
              <Button
                colorScheme="blue"
                size="lg"
                borderRadius="lg"
                leftIcon={<Icon as={FaPlusCircle} />}
                onClick={onOpen}
              >
                Ajouter une adresse
              </Button>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Add Address Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={headerBg} borderTopRadius="xl">Ajouter une nouvelle adresse</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Étiquette d'adresse
                </FormLabel>
                <Input
                  name="label"
                  value={newAddress.label}
                  onChange={handleAddressChange}
                  placeholder="ex: Domicile, Bureau, Travail"
                  borderRadius="md"
                  isRequired={true}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Adresse de la rue
                </FormLabel>
                <Input
                  name="street"
                  value={newAddress.street}
                  onChange={handleAddressChange}
                  placeholder="Entrez l'adresse postale"
                  borderRadius="md"
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                    Ville
                  </FormLabel>
                  <Input
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    placeholder="Entrez la ville"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                    Code Postal
                  </FormLabel>
                  <Input
                    name="postal_code"
                    value={newAddress.postal_code}
                    onChange={handleAddressChange}
                    placeholder="Entrez le code postal"
                    borderRadius="md"
                  />
                </FormControl>
              </SimpleGrid>

              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Pays
                </FormLabel>
                <Select
                  name="country"
                  value={newAddress.country}
                  onChange={handleAddressChange}
                  placeholder="Sélectionnez le pays"
                  borderRadius="md"
                >
                  <option value="France">France</option>
                  <option value="Belgium">Belgique</option>
                  <option value="Switzerland">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Numéro de téléphone
                </FormLabel>
                <Input
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleAddressChange}
                  placeholder="Entrez le numéro de téléphone"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl>
                <Checkbox
                  name="is_default"
                  isChecked={newAddress.is_default}
                  onChange={handleAddressChange}
                  colorScheme="blue"
                  size="lg"
                >
                  Définir comme adresse par défaut
                </Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Annuler
            </Button>
            <Button
              bg={buttonBg}
              color={buttonText}
              onClick={handleAddAddress}
              borderRadius="lg"
              _hover={{ bg: useColorModeValue("blue.600", "blue.500") }}
            >
              Ajouter l'adresse
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Address Modal */}
      <Modal
        isOpen={editAddressModal.isOpen}
        onClose={() =>
          setEditAddressModal((prev) => ({ ...prev, isOpen: false }))
        }
        size="lg"
      >
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader bg={headerBg} borderTopRadius="xl">Modifier l'adresse</ModalHeader>
          <ModalCloseButton />
          <ModalBody pt={6}>
            <VStack spacing={4} align="stretch">
              <FormControl
                isRequired
                isInvalid={!!editAddressModal.errors.label}
              >
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Étiquette d'adresse
                </FormLabel>
                <Input
                  name="label"
                  value={editAddressModal.values.label}
                  onChange={handleEditAddressChange}
                  placeholder="ex: Domicile, Bureau, Travail"
                  borderRadius="md"
                />
                <FormErrorMessage>
                  {editAddressModal.errors.label}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!editAddressModal.errors.street}
              >
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Adresse de la rue
                </FormLabel>
                <Input
                  name="street"
                  value={editAddressModal.values.street}
                  onChange={handleEditAddressChange}
                  placeholder="Entrez l'adresse postale"
                  borderRadius="md"
                />
                <FormErrorMessage>
                  {editAddressModal.errors.street}
                </FormErrorMessage>
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl
                  isRequired
                  isInvalid={!!editAddressModal.errors.city}
                >
                  <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                    Ville
                  </FormLabel>
                  <Input
                    name="city"
                    value={editAddressModal.values.city}
                    onChange={handleEditAddressChange}
                    placeholder="Entrez la ville"
                    borderRadius="md"
                  />
                  <FormErrorMessage>
                    {editAddressModal.errors.city}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={!!editAddressModal.errors.postal_code}
                >
                  <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                    Code Postal
                  </FormLabel>
                  <Input
                    name="postal_code"
                    value={editAddressModal.values.postal_code}
                    onChange={handleEditAddressChange}
                    placeholder="Entrez le code postal"
                    borderRadius="md"
                  />
                  <FormErrorMessage>
                    {editAddressModal.errors.postal_code}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <FormControl
                isRequired
                isInvalid={!!editAddressModal.errors.country}
              >
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Pays
                </FormLabel>
                <Select
                  name="country"
                  value={editAddressModal.values.country}
                  onChange={handleEditAddressChange}
                  placeholder="Sélectionnez le pays"
                  borderRadius="md"
                >
                  <option value="France">France</option>
                  <option value="Belgium">Belgique</option>
                  <option value="Switzerland">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </Select>
                <FormErrorMessage>
                  {editAddressModal.errors.country}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!editAddressModal.errors.phone}
              >
                <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                  Numéro de téléphone
                </FormLabel>
                <Input
                  name="phone"
                  value={editAddressModal.values.phone}
                  onChange={handleEditAddressChange}
                  placeholder="Entrez le numéro de téléphone"
                  borderRadius="md"
                />
                <FormErrorMessage>
                  {editAddressModal.errors.phone}
                </FormErrorMessage>
              </FormControl>

              <FormControl>
                <Checkbox
                  name="is_default"
                  isChecked={editAddressModal.values.is_default}
                  onChange={handleEditAddressChange}
                  colorScheme="blue"
                  size="lg"
                >
                  Définir comme adresse par défaut
                </Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() =>
                setEditAddressModal((prev) => ({ ...prev, isOpen: false }))
              }
            >
              Annuler
            </Button>
            <Button
              bg={buttonBg}
              color={buttonText}
              onClick={handleEditAddressSubmit}
              borderRadius="lg"
              _hover={{ bg: useColorModeValue("blue.600", "blue.500") }}
            >
              Enregistrer les modifications
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddressList;