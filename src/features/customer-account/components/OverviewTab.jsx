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
  Badge,
  Flex,
  Radio,
  RadioGroup,
  Stack,
  Select,
  SimpleGrid,
  Grid,
  Divider,
  useColorModeValue,
  Icon,
  Container,
  Image,
  Heading,
  Tooltip
} from "@chakra-ui/react";
import { FaEdit, FaUser, FaShoppingBag, FaCreditCard, FaBell, FaStar, FaRegCalendarAlt } from "react-icons/fa";

const OverviewTab = ({ 
  customer, 
  editMode, 
  setEditMode, 
  form, 
  setForm, 
  errors, 
  handleChange, 
  handleSubmit, 
  updating 
}) => {
  // Color scheme for better visual hierarchy
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headerBg = useColorModeValue("gray.50", "gray.900");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const subtleText = useColorModeValue("gray.500", "gray.500");
  const statBg = useColorModeValue("orange.50", "orange.900");
  const statText = useColorModeValue("orange.600", "orange.200");

  return (
    <Container maxW="full" p={0} mb={8}>
      {/* User Header - Amazon/eBay inspired header with clear hierarchy */}
      <Box
        bg={cardBg}
        borderRadius="lg"
        boxShadow="sm"
        overflow="hidden"
        mb={6}
      >
        {/* Header Section */}
        <Box 
          bg={headerBg} 
          py={6} 
          px={{ base: 4, md: 8 }}
          borderBottom="1px" 
          borderColor={borderColor}
        >
          <Flex 
            direction={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "center", md: "flex-start" }}
          >
            <HStack spacing={6} align="center" mb={{ base: 4, md: 0 }}>
              <Box position="relative">
                <Avatar
                  size="xl"
                  name={`${customer?.first_name} ${customer?.last_name}`}
                  bg="purple.500"
                  color="white"
                  src={customer?.profile_picture_url}
                  border="3px solid white"
                  boxShadow="md"
                />
                {!editMode && (
                  <Tooltip label="Modifier votre profil" placement="top">
                    <Button
                      position="absolute"
                      bottom="-2px"
                      right="-2px"
                      size="xs"
                      rounded="full"
                      colorScheme="blue"
                      onClick={() => setEditMode(true)}
                    >
                      <Icon as={FaEdit} />
                    </Button>
                  </Tooltip>
                )}
              </Box>
              <VStack align="flex-start" spacing={1}>
                <Text
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  color="gray.800"
                >
                  {customer?.first_name} {customer?.last_name}
                </Text>
                <HStack>
                  <Icon as={FaRegCalendarAlt} color={subtleText} />
                  <Text fontSize="sm" color={subtleText}>
                    Membre depuis{" "}
                    {customer?.created_at
                      ? new Date(customer.created_at).toLocaleDateString(
                          "en-US",
                          { year: 'numeric', month: 'long', day: 'numeric' }
                        )
                      : "-"}
                  </Text>
                </HStack>
                <Text fontSize="sm" color={subtleText}>
                  {customer?.email}
                </Text>
              </VStack>
            </HStack>

            {editMode ? (
              <Button
                onClick={() => setEditMode(false)}
                size="sm"
                variant="outline"
                colorScheme="gray"
                rounded="full"
                px={6}
                fontWeight="500"
              >
                Annuler
              </Button>
            ) : (
              <Button
                leftIcon={<FaEdit />}
                onClick={() => setEditMode(true)}
                size="sm"
                colorScheme="blue"
                rounded="full"
                px={6}
                fontWeight="500"
                display={{ base: "none", md: "flex" }}
              >
                Modifier le profil
              </Button>
            )}
          </Flex>
        </Box>

        {/* Account Status Section */}
        <Box py={5} px={{ base: 4, md: 8 }}>
          <HStack
            spacing={3}
            flexWrap={{ base: "wrap", md: "nowrap" }}
            gap={{ base: 2, md: 0 }}
            justify={{ base: "center", md: "flex-start" }}
          >
            <Badge
              colorScheme={customer?.is_active ? "green" : "red"}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
              textTransform="capitalize"
              fontWeight="500"
            >
              {customer?.is_active ? "Compte actif" : "Compte inactif"}
            </Badge>
            <Badge
              colorScheme={customer?.email_verified ? "green" : "yellow"}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
              textTransform="capitalize"
              fontWeight="500"
            >
              {customer?.email_verified
                ? "E-mail vérifié"
                : "E-mail non vérifié"}
            </Badge>
            <Badge
              colorScheme={
                customer?.is_email_notifications_enabled ? "purple" : "gray"
              }
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="full"
              textTransform="capitalize"
              fontWeight="500"
            >
              {customer?.is_email_notifications_enabled
                ? "Notifications activées"
                : "Notifications désactivées"}
            </Badge>
          </HStack>
        </Box>

        {/* Account Stats - Amazon inspired statistics cards */}
        <Grid 
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={4} 
          p={{ base: 4, md: 8 }}
          pt={0}
        >
          <Box 
            bg={statBg} 
            p={4} 
            borderRadius="md"
            textAlign="center"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-2px)" }}
          >
            <Icon as={FaShoppingBag} w={6} h={6} mb={2} color={statText} />
            <Text color={subtleText} fontSize="sm" mb={1}>Commandes totales</Text>
            <Text fontSize="2xl" fontWeight="bold" color={statText}>
              {customer?.total_orders ?? 0}
            </Text>
          </Box>
          
          <Box 
            bg={statBg} 
            p={4} 
            borderRadius="md"
            textAlign="center"
            transition="transform 0.2s"
            _hover={{ transform: "translateY(-2px)" }}
          >
            <Icon as={FaCreditCard} w={6} h={6} mb={2} color={statText} />
            <Text color={subtleText} fontSize="sm" mb={1}>Total dépensé</Text>
            <Text fontSize="2xl" fontWeight="bold" color={statText}>
              €{customer?.total_spent ?? "0.00"}
            </Text>
          </Box>          
          
        </Grid>
      </Box>

      {/* Personal Information Form - Only show if in edit mode */}
      {editMode && (
        <Box
          bg={cardBg}
          borderRadius="lg"
          boxShadow="sm"
          overflow="hidden"
        >
          <Box 
            bg={headerBg} 
            py={4} 
            px={{ base: 4, md: 8 }}
            borderBottom="1px" 
            borderColor={borderColor}
          >
            <Flex 
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align={{ base: "flex-start", md: "center" }}
              gap={4}
            >
              <Heading size="md" fontWeight="600">
                Informations personnelles
              </Heading>
              <Button
                onClick={handleSubmit}
                isLoading={updating}
                loadingText="Mise à jour..."
                colorScheme="blue"
                size="md"
                rounded="md"
                px={6}
                fontWeight="500"
              >
                Enregistrer les modifications
              </Button>
            </Flex>
          </Box>

          <Box p={{ base: 4, md: 8 }}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={8} align="stretch">
                {/* Basic Information Section */}
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={secondaryText}
                    mb={4}
                  >
                    Informations de base
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isInvalid={!!errors.first_name}>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Prénom
                      </FormLabel>
                      <Input
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder="Entrez le prénom"
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      />
                      <FormErrorMessage>
                        {errors.first_name}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.last_name}>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Nom de famille
                      </FormLabel>
                      <Input
                        name="last_name"
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder="Entrez le nom de famille"
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      />
                      <FormErrorMessage>
                        {errors.last_name}
                      </FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Personal Details Section */}
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={secondaryText}
                    mb={4}
                  >
                    Détails personnels
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isInvalid={!!errors.date_of_birth}>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Date de naissance
                      </FormLabel>
                      <Input
                        name="date_of_birth"
                        type="date"
                        value={form.date_of_birth}
                        onChange={handleChange}
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      />
                      <FormErrorMessage>
                        {errors.date_of_birth}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Genre
                      </FormLabel>
                      <RadioGroup
                        value={form.gender}
                        onChange={(value) =>
                          setForm((prev) => ({ ...prev, gender: value }))
                        }
                      >
                        <Stack
                          direction={{ base: "column", sm: "row" }}
                          spacing={{ base: 3, sm: 6 }}
                        >
                          <Radio colorScheme="blue" value="male">Homme</Radio>
                          <Radio colorScheme="blue" value="female">Femme</Radio>
                          <Radio colorScheme="blue" value="other">Autre</Radio>
                        </Stack>
                      </RadioGroup>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Contact Information Section */}
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={secondaryText}
                    mb={4}
                  >
                    Coordonnées
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel fontSize="sm" fontWeight="500">
                        E-mail
                      </FormLabel>
                      <Input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Votre e-mail"
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      />
                      <FormErrorMessage>
                        {errors.email}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone_primary}>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Téléphone
                      </FormLabel>
                      <Input
                        name="phone_primary"
                        value={form.phone_primary}
                        onChange={handleChange}
                        placeholder="Votre numéro de téléphone"
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      />
                      <FormErrorMessage>
                        {errors.phone_primary}
                      </FormErrorMessage>
                    </FormControl>
                  </SimpleGrid>
                </Box>

                <Divider />

                {/* Customer Type Section */}
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={secondaryText}
                    mb={4}
                  >
                    Type de compte
                  </Text>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="500">
                      Type de client
                    </FormLabel>
                    <Select
                      name="customer_type"
                      value={form.customer_type}
                      onChange={handleChange}
                      borderRadius="md"
                      size="md"
                      borderColor={borderColor}
                      _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      mb={4}
                    >
                      <option value="client">Client individuel</option>
                      <option value="business">Entreprise</option>
                    </Select>
                  </FormControl>
                </Box>

                {/* Business fields, only show if business */}
                {form.customer_type === "business" && (
                  <>
                    <Divider />
                    <Box>
                      <Text
                        fontSize="md"
                        fontWeight="600"
                        color={secondaryText}
                        mb={4}
                      >
                        Informations d'entreprise
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Nom de l'entreprise
                          </FormLabel>
                          <Input
                            name="business_name"
                            value={form.business_name}
                            onChange={handleChange}
                            placeholder="Nom de l'entreprise"
                            borderRadius="md"
                            size="md"
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Numéro d'enregistrement
                          </FormLabel>
                          <Input
                            name="business_registration_number"
                            value={form.business_registration_number}
                            onChange={handleChange}
                            placeholder="Numéro d'enregistrement"
                            borderRadius="md"
                            size="md"
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Numéro de TVA
                          </FormLabel>
                          <Input
                            name="vat_number"
                            value={form.vat_number}
                            onChange={handleChange}
                            placeholder="Numéro de TVA"
                            borderRadius="md"
                            size="md"
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Type d'entreprise
                          </FormLabel>
                          <Input
                            name="business_type"
                            value={form.business_type}
                            onChange={handleChange}
                            placeholder="Type d'entreprise"
                            borderRadius="md"
                            size="md"
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Téléphone professionnel
                          </FormLabel>
                          <Input
                            name="business_phone"
                            value={form.business_phone}
                            onChange={handleChange}
                            placeholder="Téléphone professionnel"
                            borderRadius="md"
                            size="md"
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="500">
                            Adresse de l'entreprise
                          </FormLabel>
                          <Input
                            name="business_address"
                            value={form.business_address}
                            onChange={handleChange}
                            placeholder="Adresse de l'entreprise"
                            borderRadius="md"
                            size="md"
                            borderColor={borderColor}
                            _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                          />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                  </>
                )}

                {/* Preferences Section */}
                <Divider />
                <Box>
                  <Text
                    fontSize="md"
                    fontWeight="600"
                    color={secondaryText}
                    mb={4}
                  >
                    Préférences
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Langue préférée
                      </FormLabel>
                      <Select
                        name="preferred_language"
                        value={form.preferred_language}
                        onChange={handleChange}
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      >
                        <option value="fr">Français</option>
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontSize="sm" fontWeight="500">
                        Devise préférée
                      </FormLabel>
                      <Select
                        name="preferred_currency"
                        value={form.preferred_currency}
                        onChange={handleChange}
                        borderRadius="md"
                        size="md"
                        borderColor={borderColor}
                        _focus={{ borderColor: accentColor, boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)" }}
                      >
                        <option value="EUR">Euro (€)</option>
                      </Select>
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </VStack>
            </form>
          </Box>
        </Box>
      )}

      {/* Account Activity Section - Only shows when not in edit mode */}
      {!editMode && (
        <Box
          bg={cardBg}
          borderRadius="lg"
          boxShadow="sm"
          overflow="hidden"
          mb={6}
        >
          <Box 
            bg={headerBg} 
            py={4} 
            px={{ base: 4, md: 8 }}
            borderBottom="1px" 
            borderColor={borderColor}
          >
            <Heading size="md" fontWeight="600">
              Détails du compte
            </Heading>
          </Box>
          
          <Box p={{ base: 4, md: 8 }}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 8 }}>
              {/* Personal Information */}
              <Box>
                <Text 
                  fontSize="md" 
                  fontWeight="600" 
                  mb={3} 
                  pb={2} 
                  borderBottom="1px" 
                  borderColor={borderColor}
                >
                  Information personnelle
                </Text>
                <VStack spacing={3} align="stretch" mb={6}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Nom complet</Text>
                    <Text fontSize="sm" fontWeight="500">{customer?.first_name} {customer?.last_name}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>E-mail</Text>
                    <Text fontSize="sm" fontWeight="500">{customer?.email}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Téléphone</Text>
                    <Text fontSize="sm" fontWeight="500">{customer?.phone_primary || "-"}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Date de naissance</Text>
                    <Text fontSize="sm" fontWeight="500">
                      {customer?.date_of_birth 
                        ? new Date(customer.date_of_birth).toLocaleDateString() 
                        : "-"}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Genre</Text>
                    <Text fontSize="sm" fontWeight="500" textTransform="capitalize">
                      {customer?.gender || "-"}
                    </Text>
                  </HStack>
                </VStack>
                
                {/* Business Information if applicable */}
                {customer?.customer_type === "business" && (
                  <>
                    <Text 
                      fontSize="md" 
                      fontWeight="600" 
                      mb={3} 
                      pb={2} 
                      borderBottom="1px" 
                      borderColor={borderColor}
                    >
                      Informations d'entreprise
                    </Text>
                    <VStack spacing={3} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={subtleText}>Nom de l'entreprise</Text>
                        <Text fontSize="sm" fontWeight="500">{customer?.business_name || "-"}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={subtleText}>Numéro d'enregistrement</Text>
                        <Text fontSize="sm" fontWeight="500">{customer?.business_registration_number || "-"}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color={subtleText}>Numéro de TVA</Text>
                        <Text fontSize="sm" fontWeight="500">{customer?.vat_number || "-"}</Text>
                      </HStack>
                    </VStack>
                  </>
                )}
              </Box>
              
              {/* Preferences & Account Activity */}
              <Box>
                <Text 
                  fontSize="md" 
                  fontWeight="600" 
                  mb={3} 
                  pb={2} 
                  borderBottom="1px" 
                  borderColor={borderColor}
                >
                  Préférences
                </Text>
                <VStack spacing={3} align="stretch" mb={6}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Langue préférée</Text>
                    <Text fontSize="sm" fontWeight="500">
                      {customer?.preferred_language === "fr" ? "Français" : 
                       customer?.preferred_language === "en" ? "English" :
                       customer?.preferred_language === "de" ? "Deutsch" :
                       customer?.preferred_language === "es" ? "Español" :
                       customer?.preferred_language || "Français"}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Devise préférée</Text>
                    <Text fontSize="sm" fontWeight="500">
                      {customer?.preferred_currency === "EUR" ? "Euro (€)" :
                       customer?.preferred_currency === "USD" ? "US Dollar ($)" :
                       customer?.preferred_currency === "GBP" ? "British Pound (£)" :
                       customer?.preferred_currency === "CHF" ? "Swiss Franc (CHF)" :
                       customer?.preferred_currency || "Euro (€)"}
                    </Text>
                  </HStack>
                </VStack>
                
                <Text 
                  fontSize="md" 
                  fontWeight="600" 
                  mb={3} 
                  pb={2} 
                  borderBottom="1px" 
                  borderColor={borderColor}
                >
                  Activité récente
                </Text>
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Dernière connexion</Text>
                    <Text fontSize="sm" fontWeight="500">
                      {customer?.last_login_at 
                        ? new Date(customer.last_login_at).toLocaleString() 
                        : "Jamais"}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Dernière commande</Text>
                    <Text fontSize="sm" fontWeight="500">
                      {customer?.last_order_date 
                        ? new Date(customer.last_order_date).toLocaleDateString() 
                        : "Aucune commande"}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color={subtleText}>Statut du compte</Text>
                    <Badge 
                      colorScheme={customer?.is_active ? "green" : "red"}
                      fontSize="xs"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      {customer?.is_active ? "Actif" : "Inactif"}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default OverviewTab;