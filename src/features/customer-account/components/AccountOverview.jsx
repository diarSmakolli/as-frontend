import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Flex,
  Button,
  Avatar,
  Badge,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  SimpleGrid,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";

const AccountOverview = ({ 
  customer, 
  form, 
  handleChange, 
  editMode, 
  setEditMode, 
  handleSubmit, 
  updating, 
  errors,
  customToastContainerStyle 
}) => {
  return (
    <VStack spacing={6} align="stretch">
      <Box
        bg="white"
        p={{ base: 4, md: 6 }}
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
      >
        <VStack spacing={4} align="stretch">
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <HStack spacing={4} w="full">
              <Avatar
                size={{ base: "md", md: "lg" }}
                name={`${customer?.first_name} ${customer?.last_name}`}
                bg="purple.500"
                color="white"
                src={customer?.profile_picture_url}
              />
              <VStack align="flex-start" spacing={1} flex={1}>
                <Text
                  fontSize={{ base: "lg", md: "xl" }}
                  fontWeight="600"
                  color="gray.800"
                  lineHeight="1.2"
                >
                  {customer?.first_name} {customer?.last_name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {customer?.email}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Member since{" "}
                  {customer?.created_at
                    ? new Date(customer.created_at).toLocaleDateString(
                        "en-US"
                      )
                    : "-"}
                </Text>
              </VStack>
            </HStack>

            <Button
              leftIcon={<FaEdit />}
              onClick={() => setEditMode(!editMode)}
              size={{ base: "sm", md: "sm" }}
              bg="#fff"
              color="rgba(48, 51, 57, 1)"
              fontSize={"sm"}
              border="1.5px solid rgba(145, 158, 171, 0.2)"
              rounded="full"
              fontWeight={"500"}
              px={6}
              py={4}
              w={{ base: "full", md: "auto" }}
            >
              {editMode ? "Annuler" : "Modifier"}
            </Button>
          </Flex>

          <VStack spacing={3} align="stretch">
            <Flex
              wrap="wrap"
              gap={2}
              direction={{ base: "column", sm: "row" }}
              align={{ base: "stretch", sm: "flex-start" }}
            >
              <Badge
                colorScheme={customer?.is_active ? "green" : "red"}
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                borderRadius="md"
                textAlign="center"
              >
                {customer?.is_active ? "Active" : "Inactive"}
              </Badge>
              <Badge
                colorScheme={
                  customer?.email_verified ? "green" : "yellow"
                }
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                borderRadius="md"
                textAlign="center"
              >
                {customer?.email_verified
                  ? "E-mail vérifié"
                  : "E-mail non vérifié"}
              </Badge>
              <Badge
                colorScheme={
                  customer?.is_email_notifications_enabled
                    ? "orange"
                    : "gray"
                }
                fontSize={{ base: "xs", md: "sm" }}
                px={3}
                py={1}
                borderRadius="md"
                textAlign="center"
              >
                {customer?.is_email_notifications_enabled
                  ? "Notifications par e-mail activées"
                  : "Notifications par e-mail désactivées"}
              </Badge>
            </Flex>
          </VStack>

          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            spacing={{ base: 4, md: 8 }}
            mt={4}
          >
            <VStack spacing={0} align="flex-start">
              <Text fontSize="sm" color="gray.500">
                Total des commandes
              </Text>
              <Text
                fontWeight="bold"
                color="orange.500"
                fontSize={{ base: "lg", md: "xl" }}
              >
                {customer?.total_orders ?? 0}
              </Text>
            </VStack>
            <VStack spacing={0} align="flex-start">
              <Text fontSize="sm" color="gray.500">
                Total dépensé
              </Text>
              <Text
                fontWeight="bold"
                color="orange.500"
                fontSize={{ base: "lg", md: "xl" }}
              >
                €{customer?.total_spent ?? "0.00"}
              </Text>
            </VStack>
          </SimpleGrid>
        </VStack>
      </Box>

      {editMode && (
        <Box
          bg="white"
          p={{ base: 4, md: 6 }}
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={6} align="stretch">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              gap={4}
            >
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="600"
                color="gray.800"
              >
                Informations personnelles
              </Text>
              <Button
                onClick={handleSubmit}
                isLoading={updating}
                loadingText="Updating..."
                size="sm"
                bg="#fff"
                color="rgba(48, 51, 57, 1)"
                fontSize={"sm"}
                border="1.5px solid rgba(145, 158, 171, 0.2)"
                rounded="full"
                fontWeight={"500"}
                px={6}
                py={4}
                w={{ base: "full", md: "auto" }}
              >
                Enregistrer les modifications
              </Button>
            </Flex>

            <form onSubmit={handleSubmit}>
              <VStack spacing={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.first_name}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                    >
                      Prénom
                    </FormLabel>
                    <Input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      placeholder="Entrez le prénom"
                      borderRadius="md"
                      size={{ base: "md", md: "md" }}
                    />
                    <FormErrorMessage>
                      {errors.first_name}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.last_name}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                    >
                      Nom de famille
                    </FormLabel>
                    <Input
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      placeholder="Entrez le nom de famille"
                      borderRadius="md"
                      size={{ base: "md", md: "md" }}
                    />
                    <FormErrorMessage>
                      {errors.last_name}
                    </FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.date_of_birth}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                    >
                      Date de naissance
                    </FormLabel>
                    <Input
                      name="date_of_birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      borderRadius="md"
                      size={{ base: "md", md: "md" }}
                    />
                    <FormErrorMessage>
                      {errors.date_of_birth}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="600"
                      color="gray.700"
                    >
                      Genre
                    </FormLabel>
                    <RadioGroup
                      value={form.gender}
                      onChange={(value) =>
                        handleChange({ target: { name: 'gender', value } })
                      }
                    >
                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        spacing={{ base: 3, sm: 6 }}
                      >
                        <Radio value="male">Mâle</Radio>
                        <Radio value="female">Femelle</Radio>
                        <Radio value="other">Autre</Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                  >
                    Type de client
                  </FormLabel>
                  <Select
                    name="customer_type"
                    value={form.customer_type}
                    onChange={handleChange}
                    borderRadius="md"
                    size={{ base: "md", md: "md" }}
                  >
                    <option value="client">Cliente</option>
                    <option value="business">Entreprise</option>
                  </Select>
                </FormControl>

                {form.customer_type === "business" && (
                  <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Nom de l'entreprise
                        </FormLabel>
                        <Input
                          name="business_name"
                          value={form.business_name}
                          onChange={handleChange}
                          placeholder="Enter business name"
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Numéro d'enregistrement d'entreprise
                        </FormLabel>
                        <Input
                          name="business_registration_number"
                          value={form.business_registration_number}
                          onChange={handleChange}
                          placeholder="Enter registration number"
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Numéro de TVA
                        </FormLabel>
                        <Input
                          name="vat_number"
                          value={form.vat_number}
                          onChange={handleChange}
                          placeholder="Enter VAT number"
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Type d'entreprise
                        </FormLabel>
                        <Input
                          name="business_type"
                          value={form.business_type}
                          onChange={handleChange}
                          placeholder="Enter business type"
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
                        />
                      </FormControl>
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Téléphone professionnel
                        </FormLabel>
                        <Input
                          name="business_phone"
                          value={form.business_phone}
                          onChange={handleChange}
                          placeholder="Enter business phone"
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel
                          fontSize="sm"
                          fontWeight="600"
                          color="gray.700"
                        >
                          Adresse de l'entreprise
                        </FormLabel>
                        <Input
                          name="business_address"
                          value={form.business_address}
                          onChange={handleChange}
                          placeholder="Enter business address"
                          borderRadius="md"
                          size={{ base: "md", md: "md" }}
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

export default AccountOverview;