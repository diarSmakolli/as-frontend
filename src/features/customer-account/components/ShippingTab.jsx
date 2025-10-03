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
  Badge,
  Flex,
  SimpleGrid,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Checkbox,
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

const ShippingTab = ({ 
  addresses, 
  isOpen, 
  onOpen, 
  onClose, 
  newAddress, 
  handleAddressChange, 
  handleAddAddress, 
  editAddressModal, 
  setEditAddressModal,
  openEditAddressModal,
  handleEditAddressChange,
  handleEditAddressSubmit,
  handleDeleteAddress,
}) => {
  return (
    <>
      <Box
        bg="rgb(255,255,255)"
        p={6}
        borderRadius="xl"
        border="1px solid rgba(145, 158, 171, 0.2)"
      >
        <VStack spacing={6} align="stretch">
          <Button
            size="sm"
            color="rgba(223, 240, 255, 1)"
            rounded="10px"
            border="1px solid rgba(148, 145, 171, 0.2)"
            w="100%"
            bg="#3167a8ff"
            _hover={{ color: "white" }}
            fontWeight={"500"}
            fontFamily="Airbnb Cereal VF"
            onClick={onOpen}
            display={{ base: "flex", md: "none" }}
          >
            Ajouter une nouvelle adresse
          </Button>

          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="500" color="gray.800">
              Adresses de livraison
            </Text>
            <Button
              size="sm"
              color="rgba(223, 240, 255, 1)"
              rounded="10px"
              border="1px solid rgba(148, 145, 171, 0.2)"
              p="18px 18px"
              bg="#3167a8ff"
              _hover={{ color: "white" }}
              fontWeight={"500"}
              fontFamily="Airbnb Cereal VF"
              onClick={onOpen}
              display={{ base: "none", md: "flex" }}
            >
              Ajouter une nouvelle adresse
            </Button>
          </Flex>

          {addresses && addresses.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={4}
              align="stretch"
            >
              {addresses.map((address, index) => (
                <Box
                  key={index}
                  p={4}
                  border="1px solid rgba(145, 158, 171, 0.2)"
                  borderRadius="xl"
                  position="relative"
                  _hover={{ shadow: "md" }}
                  transition="all 0.2s"
                >
                  {address.is_default && (
                    <Badge
                      position="absolute"
                      top={2}
                      right={2}
                      fontSize="xs"
                      textDecoration={"none"}
                      textTransform={"none"}
                      py={1}
                      px={4}
                      rounded={"lg"}
                      bg="#3167a8ff"
                      color={"gray.100"}
                      fontWeight={"500"}
                    >
                      Défaut
                    </Badge>
                  )}

                  <VStack align="flex-start" spacing={2}>
                    <HStack spacing={2}>
                      <Icon as={FaMapMarkerAlt} color="blue.500" />
                      <Text
                        fontWeight="600"
                        fontSize="md"
                        color="gray.800"
                      >
                        {address.label}
                      </Text>
                    </HStack>

                    <Text fontSize="sm" color="gray.600">
                      {address.street}
                    </Text>

                    <Text fontSize="sm" color="gray.600">
                      {address.city}, {address.postal_code}
                    </Text>

                    <Text fontSize="sm" color="gray.600">
                      {address.country}
                    </Text>

                    {address.phone && (
                      <HStack spacing={2}>
                        <Icon as={FaPhone} color="gray.500" size="sm" />
                        <Text fontSize="sm" color="gray.600">
                          {address.phone}
                        </Text>
                      </HStack>
                    )}
                  </VStack>

                  <HStack spacing={2} mt={4}>
                    <Button
                      size="sm"
                      color="rgba(223, 240, 255, 1)"
                      rounded="10px"
                      border="1px solid rgba(148, 145, 171, 0.2)"
                      bg="#3167a8ff"
                      px={6}
                      py={0}
                      _hover={{ color: "white" }}
                      fontWeight={"500"}
                      fontFamily="Airbnb Cereal VF"
                      onClick={() =>
                        openEditAddressModal(address, address.label)
                      }
                    >
                      Modifier
                    </Button>
                    {!address.is_default && (
                      <Button
                        size="sm"
                        color="rgba(223, 240, 255, 1)"
                        rounded="10px"
                        border="1px solid rgba(148, 145, 171, 0.2)"
                        bg="#3167a8ff"
                        _hover={{ color: "white" }}
                        fontWeight={"500"}
                        fontFamily="Airbnb Cereal VF"
                        onClick={() => handleDeleteAddress(address.label)}
                      >
                        Supprimer
                      </Button>
                    )}
                  </HStack>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={12}>
              <Icon
                as={FaMapMarkerAlt}
                size="4xl"
                color="gray.300"
                mb={4}
              />
              <Text fontSize="lg" color="gray.500" mb={2}>
                Aucune adresse enregistrée
              </Text>
              <Text fontSize="sm" color="gray.400">
                Ajoutez une adresse pour faciliter l'expédition.
              </Text>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Add Address Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent rounded="2xl">
          <ModalHeader>Ajouter une nouvelle adresse</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
                  Étiquette d'adresse
                </FormLabel>
                <Input
                  name="label"
                  value={newAddress.label}
                  onChange={handleAddressChange}
                  placeholder="e.g., Home, Work, Office"
                  borderRadius="md"
                  isRequired={true}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
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
                  
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                  >
                    Ville
                  </FormLabel>
                  <Input
                    name="city"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    placeholder="Entrez ville"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                  >
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
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
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
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
                  Numéro de téléphone
                </FormLabel>
                <Input
                  name="phone"
                  value={newAddress.phone}
                  onChange={handleAddressChange}
                  placeholder="Enter phone number"
                  borderRadius="md"
                />
              </FormControl>

              <FormControl>
                <Checkbox
                  name="is_default"
                  isChecked={newAddress.is_default}
                  onChange={handleAddressChange}
                  colorScheme="orange"
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
              onClick={onClose}
              fontWeight="400"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              color="rgba(223, 240, 255, 1)"
              rounded="10px"
              border="1px solid rgba(148, 145, 171, 0.2)"
              p="18px 18px"
              bg="#3167a8ff"
              _hover={{ color: "white" }}
              fontWeight={"500"}
              fontFamily="Airbnb Cereal VF"
              onClick={handleAddAddress}
            >
              Ajouter une adresse
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
        <ModalContent rounded="2xl">
          <ModalHeader>Edit Address</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl
                isRequired
                isInvalid={!!editAddressModal.errors.label}
              >
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
                  Étiquette d'adresse
                </FormLabel>
                <Input
                  name="label"
                  value={editAddressModal.values.label}
                  onChange={handleEditAddressChange}
                  placeholder="e.g., Home, Work, Office"
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
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
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
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                  >
                    Ville
                  </FormLabel>
                  <Input
                    name="city"
                    value={editAddressModal.values.city}
                    onChange={handleEditAddressChange}
                    placeholder="Entrez Ville"
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
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                  >
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
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
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
                </Select>
                <FormErrorMessage>
                  {editAddressModal.errors.country}
                </FormErrorMessage>
              </FormControl>

              <FormControl
                isRequired
                isInvalid={!!editAddressModal.errors.phone}
              >
                <FormLabel
                  fontSize="sm"
                  fontWeight="600"
                  color="gray.700"
                >
                  Numéro de téléphone
                </FormLabel>
                <Input
                  name="phone"
                  value={editAddressModal.values.phone}
                  onChange={handleEditAddressChange}
                  placeholder="Entrez Numéro de téléphone"
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
                  colorScheme="orange"
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
                setEditAddressModal((prev) => ({
                  ...prev,
                  isOpen: false,
                }))
              }
              fontWeight={"400"}
            >
              Annuler
            </Button>
            <Button
              size="sm"
              color="rgba(223, 240, 255, 1)"
              rounded="10px"
              border="1px solid rgba(148, 145, 171, 0.2)"
              p="18px 18px"
              bg="#3167a8ff"
              _hover={{ color: "white" }}
              fontWeight={"500"}
              fontFamily="Airbnb Cereal VF"
              onClick={handleEditAddressSubmit}
            >
              Enregistrer les modifications
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShippingTab;