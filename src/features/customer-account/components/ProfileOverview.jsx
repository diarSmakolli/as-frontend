// filepath: /Users/bashclay/Desktop/dev/dev-local/as-solutions-fourniture-e-commerce-system/client/src/features/customer-account/components/ProfileOverview.jsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Avatar,
  Badge,
  SimpleGrid,
  Flex,
  Icon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  RadioGroup,
  Stack,
  Radio,
  Select,
  useColorModeValue
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

const ProfileOverview = ({ 
  customer, 
  editMode, 
  setEditMode, 
  form, 
  handleChange, 
  errors, 
  handleSubmit, 
  updating 
}) => {
  const cardBgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const subtleColor = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const sectionBgColor = useColorModeValue("white", "gray.700");

  return (
    <VStack spacing={6} align="stretch">
      {/* User Header */}
      <Box
        bg={cardBgColor}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <VStack spacing={4} align="stretch">
          {/* Profile Header */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <HStack spacing={4} w="full">
              <Avatar
                size={{ base: "lg", md: "xl" }}
                name={`${customer?.first_name} ${customer?.last_name}`}
                src={customer?.profile_picture_url}
                border="3px solid"
                borderColor={accentColor}
              />
              <VStack align="flex-start" spacing={1} flex={1}>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="600"
                  color={textColor}
                  lineHeight="1.2"
                >
                  {customer?.first_name} {customer?.last_name}
                </Text>
                <Text fontSize="md" color={subtleColor}>
                  {customer?.email}
                </Text>
                <Text fontSize="sm" color={subtleColor}>
                  Membre depuis{" "}
                  {customer?.created_at
                    ? new Date(customer.created_at).toLocaleDateString("fr-FR", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "-"}
                </Text>
              </VStack>
            </HStack>

            {/* Edit Button */}
            <Button
              leftIcon={<Icon as={FaEdit} />}
              onClick={() => setEditMode(!editMode)}
              size={{ base: "md", md: "md" }}
              colorScheme="blue"
              variant="outline"
              borderRadius="lg"
              px={6}
            >
              {editMode ? "Annuler" : "Modifier"}
            </Button>
          </Flex>

          {/* Badges */}
          <Flex
            wrap="wrap"
            gap={3}
            direction={{ base: "column", sm: "row" }}
            align={{ base: "stretch", sm: "flex-start" }}
            mt={2}
          >
            <Badge
              colorScheme={customer?.is_active ? "green" : "red"}
              fontSize="sm"
              px={3}
              py={1.5}
              borderRadius="md"
              textAlign="center"
              textTransform="capitalize"
            >
              {customer?.is_active ? "Actif" : "Inactif"}
            </Badge>
            <Badge
              colorScheme={customer?.email_verified ? "blue" : "yellow"}
              fontSize="sm"
              px={3}
              py={1.5}
              borderRadius="md"
              textAlign="center"
              textTransform="capitalize"
            >
              {customer?.email_verified ? "E-mail vérifié" : "E-mail non vérifié"}
            </Badge>
            <Badge
              colorScheme={customer?.is_email_notifications_enabled ? "purple" : "gray"}
              fontSize="sm"
              px={3}
              py={1.5}
              borderRadius="md"
              textAlign="center"
              textTransform="capitalize"
            >
              {customer?.is_email_notifications_enabled
                ? "Notifications activées"
                : "Notifications désactivées"}
            </Badge>
          </Flex>

          {/* Stats */}
          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            spacing={{ base: 4, md: 8 }}
            mt={4}
            bg={useColorModeValue("gray.50", "gray.700")}
            p={4}
            borderRadius="lg"
          >
            <VStack 
              spacing={0} 
              align="flex-start"
              bg={cardBgColor}
              p={4}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-2px)" }}
            >
              <Text fontSize="sm" color={subtleColor}>
                Total des commandes
              </Text>
              <Text
                fontWeight="bold"
                color={accentColor}
                fontSize={{ base: "xl", md: "2xl" }}
              >
                {customer?.total_orders ?? 0}
              </Text>
            </VStack>
            <VStack 
              spacing={0} 
              align="flex-start"
              bg={cardBgColor}
              p={4}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-2px)" }}
            >
              <Text fontSize="sm" color={subtleColor}>
                Total dépensé
              </Text>
              <Text
                fontWeight="bold"
                color={accentColor}
                fontSize={{ base: "xl", md: "2xl" }}
              >
                €{customer?.total_spent ?? "0.00"}
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Personal Information Form - Only show when in edit mode */}
      {editMode && (
        <Box
          bg={sectionBgColor}
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          boxShadow="sm"
          border="1px"
          borderColor={borderColor}
        >
          <VStack spacing={6} align="stretch">
            {/* Header */}
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              gap={4}
            >
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                fontWeight="600"
                color={textColor}
              >
                Informations personnelles
              </Text>
              <Button
                onClick={handleSubmit}
                isLoading={updating}
                loadingText="Mise à jour..."
                colorScheme="blue"
                size="md"
                borderRadius="lg"
              >
                Enregistrer les modifications
              </Button>
            </Flex>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.first_name}>
                    <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                      Prénom
                    </FormLabel>
                    <Input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="Entrez le prénom"
                      borderRadius="md"
                      bg={cardBgColor}
                    />
                    <FormErrorMessage>
                      {errors.first_name}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.last_name}>
                    <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                      Nom de famille
                    </FormLabel>
                    <Input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Entrez le nom de famille"
                      borderRadius="md"
                      bg={cardBgColor}
                    />
                    <FormErrorMessage>
                      {errors.last_name}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.date_of_birth}>
                    <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                      Date de naissance
                    </FormLabel>
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      borderRadius="md"
                      bg={cardBgColor}
                    />
                    <FormErrorMessage>
                      {errors.date_of_birth}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                      Genre
                    </FormLabel>
                    <RadioGroup
                      value={form.gender}
                      onChange={(value) => handleChange({ 
                        target: { name: "gender", value }
                      })}
                    >
                      <Stack direction={{ base: "column", sm: "row" }} spacing={{ base: 3, sm: 6 }}>
                        <Radio value="male" colorScheme="blue">Homme</Radio>
                        <Radio value="female" colorScheme="pink">Femme</Radio>
                        <Radio value="other" colorScheme="purple">Autre</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                    Type de client
                  </FormLabel>
                  <Select
                    name="customer_type"
                    value={form.customer_type}
                    onChange={handleChange}
                    borderRadius="md"
                    bg={cardBgColor}
                  >
                    <option value="client">Client</option>
                    <option value="business">Entreprise</option>
                  </Select>
                </FormControl>

                {/* Business fields, only show if business */}
                {form.customer_type === "business" && (
                  <VStack spacing={6} align="stretch" 
                    p={5} 
                    bg={useColorModeValue("blue.50", "blue.900")}
                    borderRadius="md"
                  >
                    <Text fontWeight="600" color={textColor}>
                      Informations d'entreprise
                    </Text>
                    
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                          Nom de l'entreprise
                        </FormLabel>
                        <Input
                          name="business_name"
                          value={form.business_name}
                          onChange={handleChange}
                          placeholder="Nom de l'entreprise"
                          borderRadius="md"
                          bg={cardBgColor}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                          Numéro d'enregistrement
                        </FormLabel>
                        <Input
                          name="business_registration_number"
                          value={form.business_registration_number}
                          onChange={handleChange}
                          placeholder="Numéro d'enregistrement"
                          borderRadius="md"
                          bg={cardBgColor}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                          Numéro de TVA
                        </FormLabel>
                        <Input
                          name="vat_number"
                          value={form.vat_number}
                          onChange={handleChange}
                          placeholder="Numéro de TVA"
                          borderRadius="md"
                          bg={cardBgColor}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                          Type d'entreprise
                        </FormLabel>
                        <Input
                          name="business_type"
                          value={form.business_type}
                          onChange={handleChange}
                          placeholder="Type d'entreprise"
                          borderRadius="md"
                          bg={cardBgColor}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                          Téléphone professionnel
                        </FormLabel>
                        <Input
                          name="business_phone"
                          value={form.business_phone}
                          onChange={handleChange}
                          placeholder="Téléphone professionnel"
                          borderRadius="md"
                          bg={cardBgColor}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel fontSize="sm" fontWeight="600" color={textColor}>
                          Adresse de l'entreprise
                        </FormLabel>
                        <Input
                          name="business_address"
                          value={form.business_address}
                          onChange={handleChange}
                          placeholder="Adresse de l'entreprise"
                          borderRadius="md"
                          bg={cardBgColor}
                        />
                      </FormControl>
                    </SimpleGrid>
                  </VStack>
                )}
              </VStack>
            </form>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};

export default ProfileOverview;