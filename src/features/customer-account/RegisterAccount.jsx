import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // ✅ ADD useLocation
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Button,
  Checkbox,
  Divider,
  useToast,
  Link,
  Icon,
  Alert,
  AlertIcon,
  Progress,
  SimpleGrid,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { 
  ViewIcon, 
  ViewOffIcon, 
  CheckIcon, 
  WarningIcon, 
  InfoIcon,
  ArrowBackIcon,
  ArrowForwardIcon,
} from "@chakra-ui/icons";
import { customerAccountService } from "./customerAccountService";
import Navbar from "../../shared-customer/components/Navbar";
import { handleApiError } from "../../commons/handleApiError";
import { customToastContainerStyle } from "../../commons/toastStyles";

const initialState = {
  customer_type: "client",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone_primary: "",
  gender: "",
  date_of_birth: "",
  addresses: [
    {
      label: "Home",
      street: "",
      city: "",
      postal_code: "",
      country: "France",
      phone: "",
      is_default: true,
    },
  ],
  business_name: "",
  business_registration_number: "",
  vat_number: "",
  business_type: "SARL",
  business_phone: "",
  business_email: "",
  business_address: "",
};

export default function RegisterAccount() {
  const [form, setForm] = useState(initialState);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const toast = useToast();

  const [referralCode, setReferralCode] = useState("");
  const [referralInfo, setReferralInfo] = useState(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const refCode = urlParams.get('ref');
    
    if (refCode) {
      setReferralCode(refCode);
      validateReferralCode(refCode);
    }
  }, [location]);

  const validateReferralCode = async (code) => {
    if (!code || code.trim() === '') {
      setReferralInfo(null);
      return;
    }

    setReferralLoading(true);
    try {
      const result = await customerAccountService.validateReferralCode(code);
      
      if (result.data.valid) {
        setReferralInfo({
          valid: true,
          referrerName: result.data.referrer_name,
          commissionRate: result.data.commission_rate
        });
        
        toast({
          title: "🎉 Code de parrainage valide!",
          description: `Vous avez été parrainé par ${result.data.referrer_name}`,
          status: "success",
          duration: 4000,
          isClosable: true,
          variant: 'custom',
          containerStyle: customToastContainerStyle
        });
      } else {
        setReferralInfo({ valid: false });
        toast({
          title: "Code de parrainage invalide",
          description: result.data.message || "Ce code n'est pas valide ou a expiré",
          status: "error",
          duration: 4000,
          isClosable: true,
          variant: 'custom',
          containerStyle: customToastContainerStyle
        });
      }
    } catch (error) {
      setReferralInfo({ valid: false });
      toast({
        title: "Erreur de validation",
        description: "Impossible de valider le code de parrainage",
        status: "error",
        duration: 4000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle
      });
    } finally {
      setReferralLoading(false);
    }
  };

  // Define steps based on account type
  const steps = useMemo(() => {
    if (form.customer_type === "business") {
      return [
        { title: "Account", description: "Informations de base" },
        { title: "Business", description: "Détails de l'entreprise" },
        { title: "Address", description: "Adresse de livraison" },
      ];
    }
    return [
      { title: "Account", description: "Informations de base" },
      { title: "Address", description: "Basic information" },
    ];
  }, [form.customer_type]);

  const progressValue = ((currentStep + 1) / steps.length) * 100;

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;

  //   // Clear errors when user starts typing
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: null }));
  //   }

  //   // Handle address fields
  //   if (name.startsWith("address_")) {
  //     const field = name.replace("address_", "");
  //     setForm((prev) => {
  //       const addresses = [...prev.addresses];
  //       addresses[0] = { ...addresses[0], [field]: type === "checkbox" ? checked : value };
  //       return { ...prev, addresses };
  //     });
  //     return;
  //   }

  //   setForm((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  // Handle address fields
  if (name.startsWith("address_")) {
    const field = name.replace("address_", "");
    
    // ✅ Clear errors for address fields using the correct error key
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    
    setForm((prev) => {
      const addresses = [...prev.addresses];
      addresses[0] = { ...addresses[0], [field]: type === "checkbox" ? checked : value };
      return { ...prev, addresses };
    });
    return;
  }

  // Clear errors when user starts typing for regular fields
  if (errors[name]) {
    setErrors((prev) => ({ ...prev, [name]: null }));
  }

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};

  // const validateStep = (stepIndex) => {
  //   const newErrors = {};

  //   // Step 0: Account Information
  //   if (stepIndex === 0) {
  //     if (!form.first_name.trim()) newErrors.first_name = "Entrez votre prénom";
  //     if (!form.last_name.trim()) newErrors.last_name = "Entrez votre nom de famille";
  //     if (!form.email.trim()) newErrors.email = "Entrez votre email";
  //     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Entrez une adresse e-mail valide";
  //     if (!form.password) newErrors.password = "Entrez votre mot de passe";
  //     else if (form.password.length < 6) newErrors.password = "Les mots de passe doivent comporter au moins 6 caractères.";
  //     if (!confirmPassword) newErrors.confirmPassword = "Tapez à nouveau votre mot de passe";
  //     else if (confirmPassword !== form.password) newErrors.confirmPassword = "Les mots de passe doivent correspondre";
  //   }

  //   // Step 1: Business Information (if business account)
  //   if (form.customer_type === "business" && stepIndex === 1) {
  //     if (!form.business_name.trim()) newErrors.business_name = "Entrez le nom de votre entreprise";
  //     if (!form.business_registration_number.trim()) newErrors.business_registration_number = "Entrez le numéro d'enregistrement";
  //     if (!form.vat_number.trim()) newErrors.vat_number = "Entrez le numéro de TVA";
  //     if (!form.business_type) newErrors.business_type = "Sélectionnez le type d'entreprise";
  //   }

  //   // Last Step: Address Information
  //   const addressStepIndex = form.customer_type === "business" ? 2 : 1;
  //   if (stepIndex === addressStepIndex) {
  //     if (!form.addresses[0].street.trim()) newErrors.street = "Entrez votre adresse postale";
  //     if (!form.addresses[0].city.trim()) newErrors.city = "Entrez votre ville";
  //     if (!form.addresses[0].country.trim()) newErrors.country = "Entrez votre pays";
  //     if (!agree) newErrors.agree = "Vous devez accepter de continuer";
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    // Step 0: Account Information
    if (stepIndex === 0) {
      if (!form.first_name.trim()) newErrors.first_name = "Entrez votre prénom";
      if (!form.last_name.trim())
        newErrors.last_name = "Entrez votre nom de famille";
      if (!form.email.trim()) newErrors.email = "Entrez votre email";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Entrez une adresse e-mail valide";
      if (!form.password) newErrors.password = "Entrez votre mot de passe";
      else if (form.password.length < 6)
        newErrors.password =
          "Les mots de passe doivent comporter au moins 6 caractères.";
      if (!confirmPassword)
        newErrors.confirmPassword = "Tapez à nouveau votre mot de passe";
      else if (confirmPassword !== form.password)
        newErrors.confirmPassword = "Les mots de passe doivent correspondre";
    }

    // Step 1: Business Information (if business account)
    if (form.customer_type === "business" && stepIndex === 1) {
      if (!form.business_name.trim())
        newErrors.business_name = "Entrez le nom de votre entreprise";
      if (!form.business_registration_number.trim())
        newErrors.business_registration_number =
          "Entrez le numéro d'enregistrement";
      if (!form.vat_number.trim())
        newErrors.vat_number = "Entrez le numéro de TVA";
      if (!form.business_type)
        newErrors.business_type = "Sélectionnez le type d'entreprise";
    }

    // Last Step: Address Information
    const addressStepIndex = form.customer_type === "business" ? 2 : 1;
    if (stepIndex === addressStepIndex) {
      // ✅ Use consistent error keys that match the field names used in handleChange
      if (!form.addresses[0].street.trim())
        newErrors.street = "Entrez votre adresse postale";
      if (!form.addresses[0].city.trim()) newErrors.city = "Entrez votre ville";
      if (!form.addresses[0].postal_code.trim())
        newErrors.postal_code = "Entrez votre code postal";
      if (!form.addresses[0].country.trim())
        newErrors.country = "Sélectionnez votre pays";
      if (!agree) newErrors.agree = "Vous devez accepter de continuer";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {
      const payload = { ...form };
      
      // ✅ ADD REFERRAL CODE TO PAYLOAD
      if (referralCode && referralInfo?.valid) {
        payload.referral_code = referralCode;
      }
      
      if (form.customer_type !== "business") {
        delete payload.business_name;
        delete payload.business_registration_number;
        delete payload.vat_number;
        delete payload.business_type;
        delete payload.business_phone;
        delete payload.business_email;
        delete payload.business_address;
      }
      
      const result = await customerAccountService.registerAccount(payload);
      
      let successMessage = "Bienvenue! Vous pouvez désormais commencer vos achats.";
      
      // ✅ SHOW REFERRAL SUCCESS MESSAGE
      if (referralCode && referralInfo?.valid) {
        successMessage = `Bienvenue! Votre parrainage par ${referralInfo.referrerName} a été confirmé.`;
      }
      
      toast({
        title: "Compte créé avec succès! 🎉",
        description: successMessage,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: 'custom',
        containerStyle: customToastContainerStyle
      });
      
      // Reset form
      setForm(initialState);
      setConfirmPassword("");
      setAgree(false);
      setCurrentStep(0);
      setReferralCode("");
      setReferralInfo(null);

      window.location.href = '/account/signin';
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Une erreur s'est produite. Veuillez réessayer.";
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderAccountStep = () => (
    <VStack spacing={4} align="stretch">
      {/* Account Type */}
      <FormControl>
        <FormLabel 
          fontSize="13px" 
          fontWeight="700" 
          color="#0F1111"
          fontFamily="Arial, sans-serif"
        >
          Type de compte
        </FormLabel>
        <Select
          name="customer_type"
          value={form.customer_type}
          onChange={handleChange}
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{ 
            borderColor: "#007185", 
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none"
          }}
        >
          <option value="client">Compte personnel</option>
          <option value="business">Compte professionnel</option>
        </Select>
      </FormControl>

      {/* Name Fields */}
      <FormControl isInvalid={!!errors.first_name || !!errors.last_name}>
        <FormLabel 
          fontSize="13px" 
          fontWeight="700" 
          color="#0F1111"
          fontFamily="Arial, sans-serif"
        >
          Votre nom
        </FormLabel>
        <HStack spacing={2}>
          <Input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Prénom"
            bg="white"
            border="1px solid #a6a6a6"
            borderRadius="3px"
            fontSize="13px"
            h="31px"
            _hover={{ borderColor: "#007185" }}
            _focus={{ 
              borderColor: "#007185", 
              boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
              outline: "none"
            }}
          />
          <Input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Nom de famille"
            bg="white"
            border="1px solid #a6a6a6"
            borderRadius="3px"
            fontSize="13px"
            h="31px"
            _hover={{ borderColor: "#007185" }}
            _focus={{ 
              borderColor: "#007185", 
              boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
              outline: "none"
            }}
          />
        </HStack>
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.first_name || errors.last_name}
        </FormErrorMessage>
      </FormControl>

      {/* Email */}
      <FormControl isInvalid={!!errors.email}>
        <FormLabel 
          fontSize="13px" 
          fontWeight="700" 
          color="#0F1111"
          fontFamily="Arial, sans-serif"
        >
          Enter mobile number or email
        </FormLabel>
        <Input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{ 
            borderColor: "#007185", 
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none"
          }}
        />
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.email}
        </FormErrorMessage>
      </FormControl>

      {/* Password */}
      <FormControl isInvalid={!!errors.password}>
        <FormLabel 
          fontSize="13px" 
          fontWeight="700" 
          color="#0F1111"
          fontFamily="Arial, sans-serif"
        >
          Mot de passe (au moins 6 caractères)
        </FormLabel>
        <InputGroup>
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            bg="white"
            border="1px solid #a6a6a6"
            borderRadius="3px"
            fontSize="13px"
            h="31px"
            pr="40px"
            _hover={{ borderColor: "#007185" }}
            _focus={{ 
              borderColor: "#007185", 
              boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
              outline: "none"
            }}
          />
          <InputRightElement h="31px">
            <IconButton
              variant="ghost"
              size="xs"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShowPassword(!showPassword)}
              color="gray.500"
            />
          </InputRightElement>
        </InputGroup>
        {form.password && (
          <HStack mt={1} spacing={1} alignItems="center">
            <InfoIcon boxSize="12px" color="#007185" />
            <Text fontSize="12px" color="#0F1111">
              Les mots de passe doivent comporter au moins 6 caractères.
            </Text>
          </HStack>
        )}
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.password}
        </FormErrorMessage>
      </FormControl>

      {/* Confirm Password */}
      <FormControl isInvalid={!!errors.confirmPassword}>
        <FormLabel 
          fontSize="13px" 
          fontWeight="700" 
          color="#0F1111"
          fontFamily="Arial, sans-serif"
        >
          Entrez à nouveau le mot de passe
        </FormLabel>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Entrez à nouveau le mot de passe"
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{ 
            borderColor: "#007185", 
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none"
          }}
        />
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.confirmPassword}
        </FormErrorMessage>
      </FormControl>
    </VStack>
  );

  const renderBusinessStep = () => (
    <VStack spacing={4} align="stretch">
      <Box>
        <Text fontSize="13px" fontWeight="700" color="#0F1111" mb={3}>
          Informations commerciales
        </Text>
        <Text fontSize="12px" color="#767676" mb={4}>
          Parlez-nous de votre entreprise pour la facturation et la fiscalité
        </Text>
      </Box>

      <FormControl isInvalid={!!errors.business_name}>
        <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
          Nom de l'entreprise
        </FormLabel>
        <Input
          name="business_name"
          value={form.business_name}
          onChange={handleChange}
          placeholder="Votre Société SARL"
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{ 
            borderColor: "#007185", 
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none"
          }}
        />
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.business_name}
        </FormErrorMessage>
      </FormControl>

      <HStack spacing={2}>
        <FormControl isInvalid={!!errors.business_registration_number}>
          <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
            N° d'enregistrement
          </FormLabel>
          <Input
            name="business_registration_number"
            value={form.business_registration_number}
            onChange={handleChange}
            placeholder="123456789"
            bg="white"
            border="1px solid #a6a6a6"
            borderRadius="3px"
            fontSize="13px"
            h="31px"
            _hover={{ borderColor: "#007185" }}
            _focus={{ 
              borderColor: "#007185", 
              boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
              outline: "none"
            }}
          />
          <FormErrorMessage fontSize="12px" color="#C40000">
            {errors.business_registration_number}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.vat_number}>
          <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
            N° de TVA
          </FormLabel>
          <Input
            name="vat_number"
            value={form.vat_number}
            onChange={handleChange}
            placeholder="FR123456789"
            bg="white"
            border="1px solid #a6a6a6"
            borderRadius="3px"
            fontSize="13px"
            h="31px"
            _hover={{ borderColor: "#007185" }}
            _focus={{ 
              borderColor: "#007185", 
              boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
              outline: "none"
            }}
          />
          <FormErrorMessage fontSize="12px" color="#C40000">
            {errors.vat_number}
          </FormErrorMessage>
        </FormControl>
      </HStack>

      <FormControl isInvalid={!!errors.business_type}>
        <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
          Type d'entreprise
        </FormLabel>
        <Select
          name="business_type"
          value={form.business_type}
          onChange={handleChange}
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{ 
            borderColor: "#007185", 
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none"
          }}
        >
          <option value="SARL">SARL</option>
          <option value="SAS">SAS</option>
          <option value="SA">SA</option>
          <option value="EURL">EURL</option>
          <option value="SNC">SNC</option>
          <option value="Other">Autre</option>
        </Select>
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.business_type}
        </FormErrorMessage>
      </FormControl>
    </VStack>
  );

  const renderReferralInfo = () => {
    if (!referralCode) return null;

    return (
      <Box mb={4} bg="white" p={4} borderRadius="4px" border="1px solid #ddd">
        {referralLoading ? (
          <HStack spacing={3} align="center">
            <Spinner size="sm" color="#007185" />
            <Text fontSize="13px" color="#0F1111">
              Validation du code de parrainage...
            </Text>
          </HStack>
        ) : referralInfo?.valid ? (
          <Alert status="success" variant="subtle" borderRadius="4px">
            <AlertIcon />
            <VStack align="start" spacing={1} flex="1">
              <Text fontSize="13px" fontWeight="bold" color="green.700">
                🎉 Code de parrainage valide!
              </Text>
              <Text fontSize="12px" color="green.600">
                Vous avez été parrainé par <strong>{referralInfo.referrerName}</strong>
                {referralInfo.commissionRate && (
                  <> (Commission: {referralInfo.commissionRate}%)</>
                )}
              </Text>
              <HStack spacing={2} mt={1}>
                <Badge colorScheme="green" fontSize="10px">
                  Code: {referralCode}
                </Badge>
              </HStack>
            </VStack>
          </Alert>
        ) : referralInfo?.valid === false ? (
          <Alert status="error" variant="subtle" borderRadius="4px">
            <AlertIcon />
            <VStack align="start" spacing={1} flex="1">
              <Text fontSize="13px" fontWeight="bold" color="red.700">
                Code de parrainage invalide
              </Text>
              <Text fontSize="12px" color="red.600">
                Ce code n'est pas valide ou a expiré: <strong>{referralCode}</strong>
              </Text>
              <Button
                size="xs"
                variant="ghost"
                color="red.600"
                onClick={() => {
                  setReferralCode("");
                  setReferralInfo(null);
                  // Remove ref parameter from URL
                  const newUrl = window.location.pathname;
                  window.history.replaceState({}, '', newUrl);
                }}
              >
                Ignorer le code
              </Button>
            </VStack>
          </Alert>
        ) : null}
      </Box>
    );
  };

  // const renderAddressStep = () => (
  //   <VStack spacing={4} align="stretch">
  //     <Box>
  //       <Text fontSize="13px" fontWeight="700" color="#0F1111" mb={3}>
  //         Adresse de livraison
  //       </Text>
  //       <Text fontSize="12px" color="#767676" mb={4}>
  //         Où souhaitez-vous recevoir vos commandes ?
  //       </Text>
  //     </Box>

  //     <FormControl isInvalid={!!errors.street}>
  //       <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
  //         Adresse postale
  //       </FormLabel>
  //       <Input
  //         name="address_street"
  //         value={form.addresses[0].street}
  //         onChange={handleChange}
  //         placeholder="123 Rue Principale, Apt 4B"
  //         bg="white"
  //         border="1px solid #a6a6a6"
  //         borderRadius="3px"
  //         fontSize="13px"
  //         h="31px"
  //         _hover={{ borderColor: "#007185" }}
  //         _focus={{
  //           borderColor: "#007185",
  //           boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
  //           outline: "none",
  //         }}
  //       />
  //       <FormErrorMessage fontSize="12px" color="#C40000">
  //         {errors.street}
  //       </FormErrorMessage>
  //     </FormControl>

  //     <SimpleGrid columns={2} spacing={2}>
  //       <FormControl isInvalid={!!errors.city}>
  //         <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
  //           Ville
  //         </FormLabel>
  //         <Input
  //           name="address_city"
  //           value={form.addresses[0].city}
  //           onChange={handleChange}
  //           placeholder="Ville"
  //           bg="white"
  //           border="1px solid #a6a6a6"
  //           borderRadius="3px"
  //           fontSize="13px"
  //           h="31px"
  //           _hover={{ borderColor: "#007185" }}
  //           _focus={{
  //             borderColor: "#007185",
  //             boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
  //             outline: "none",
  //           }}
  //         />
  //         <FormErrorMessage fontSize="12px" color="#C40000">
  //           {errors.city}
  //         </FormErrorMessage>
  //       </FormControl>

  //       <FormControl>
  //         <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
  //           Code postal
  //         </FormLabel>
  //         <Input
  //           name="address_postal_code"
  //           value={form.addresses[0].postal_code}
  //           onChange={handleChange}
  //           placeholder="12345"
  //           bg="white"
  //           border="1px solid #a6a6a6"
  //           borderRadius="3px"
  //           fontSize="13px"
  //           h="31px"
  //           _hover={{ borderColor: "#007185" }}
  //           _focus={{
  //             borderColor: "#007185",
  //             boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
  //             outline: "none",
  //           }}
  //         />
  //       </FormControl>
  //     </SimpleGrid>

  //     <FormControl isInvalid={!!errors.country}>
  //       <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
  //         Pays
  //       </FormLabel>
  //       <Select
  //         name="address_country"
  //         value={form.addresses[0].country}
  //         onChange={handleChange}
  //         placeholder="Sélectionnez le pays"
  //         bg="white"
  //         border="1px solid #a6a6a6"
  //         borderRadius="3px"
  //         fontSize="13px"
  //         h="31px"
  //         _hover={{ borderColor: "#007185" }}
  //         _focus={{
  //           borderColor: "#007185",
  //           boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
  //           outline: "none",
  //         }}
  //       >
  //         <option value="France">France</option>
  //       </Select>
  //       <FormErrorMessage fontSize="12px" color="#C40000">
  //         {errors.country}
  //       </FormErrorMessage>
  //     </FormControl>

  //     <FormControl>
  //       <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
  //         Numéro de téléphone (optionnel)
  //       </FormLabel>
  //       <Input
  //         name="address_phone"
  //         value={form.addresses[0].phone}
  //         onChange={handleChange}
  //         placeholder="Pour la coordination de la livraison"
  //         bg="white"
  //         border="1px solid #a6a6a6"
  //         borderRadius="3px"
  //         fontSize="13px"
  //         h="31px"
  //         _hover={{ borderColor: "#007185" }}
  //         _focus={{
  //           borderColor: "#007185",
  //           boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
  //           outline: "none",
  //         }}
  //       />
  //     </FormControl>

  //     {/* Terms Agreement - Only on last step */}
  //     <FormControl isInvalid={!!errors.agree} mt={4}>
  //       <Text fontSize="12px" color="#0F1111" lineHeight="1.4" mb={2}>
  //         En créant un compte, vous acceptez les{" "}
  //         <Link
  //           color="#007185"
  //           _hover={{ textDecoration: "underline", color: "#C7511F" }}
  //         >
  //           Conditions d'utilisation
  //         </Link>{" "}
  //         et la{" "}
  //         <Link
  //           color="#007185"
  //           _hover={{ textDecoration: "underline", color: "#C7511F" }}
  //         >
  //           Politique de confidentialité
  //         </Link>{" "}
  //         d'As Solutions.
  //       </Text>
  //       <Checkbox
  //         isChecked={agree}
  //         onChange={(e) => setAgree(e.target.checked)}
  //         size="sm"
  //         colorScheme="orange"
  //       >
  //         <Text fontSize="12px" color="#0F1111">
  //           J'accepte les conditions générales
  //         </Text>
  //       </Checkbox>
  //       <FormErrorMessage fontSize="12px" color="#C40000">
  //         {errors.agree}
  //       </FormErrorMessage>
  //     </FormControl>
  //   </VStack>
  // );

  const renderAddressStep = () => (
  <VStack spacing={4} align="stretch">
    <Box>
      <Text fontSize="13px" fontWeight="700" color="#0F1111" mb={3}>
        Adresse de livraison
      </Text>
      <Text fontSize="12px" color="#767676" mb={4}>
        Où souhaitez-vous recevoir vos commandes ?
      </Text>
    </Box>

    <FormControl isInvalid={!!errors.street}>
      <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
        Adresse postale
      </FormLabel>
      <Input
        name="address_street"
        value={form.addresses[0].street}
        onChange={handleChange}
        placeholder="123 Rue Principale, Apt 4B"
        bg="white"
        border="1px solid #a6a6a6"
        borderRadius="3px"
        fontSize="13px"
        h="31px"
        _hover={{ borderColor: "#007185" }}
        _focus={{
          borderColor: "#007185",
          boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
          outline: "none",
        }}
      />
      <FormErrorMessage fontSize="12px" color="#C40000">
        {errors.street}
      </FormErrorMessage>
    </FormControl>

    <SimpleGrid columns={2} spacing={2}>
      <FormControl isInvalid={!!errors.city}>
        <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
          Ville
        </FormLabel>
        <Input
          name="address_city"
          value={form.addresses[0].city}
          onChange={handleChange}
          placeholder="Ville"
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{
            borderColor: "#007185",
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none",
          }}
        />
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.city}
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.postal_code}>
        <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
          Code postal
        </FormLabel>
        <Input
          name="address_postal_code"
          value={form.addresses[0].postal_code}
          onChange={handleChange}
          placeholder="12345"
          bg="white"
          border="1px solid #a6a6a6"
          borderRadius="3px"
          fontSize="13px"
          h="31px"
          _hover={{ borderColor: "#007185" }}
          _focus={{
            borderColor: "#007185",
            boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
            outline: "none",
          }}
        />
        <FormErrorMessage fontSize="12px" color="#C40000">
          {errors.postal_code}
        </FormErrorMessage>
      </FormControl>
    </SimpleGrid>

    <FormControl isInvalid={!!errors.country}>
  <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
    Pays
  </FormLabel>
  <Select
    name="address_country"
    value={form.addresses[0].country}
    onChange={handleChange}
    bg="white"
    border="1px solid #a6a6a6"
    borderRadius="3px"
    fontSize="13px"
    h="31px"
    _hover={{ borderColor: "#007185" }}
    _focus={{
      borderColor: "#007185",
      boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
      outline: "none",
    }}
  >
    <option value="France">France</option>
  </Select>
  <FormErrorMessage fontSize="12px" color="#C40000">
    {errors.country}
  </FormErrorMessage>
</FormControl>

    <FormControl>
      <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
        Numéro de téléphone (optionnel)
      </FormLabel>
      <Input
        name="address_phone"
        value={form.addresses[0].phone}
        onChange={handleChange}
        placeholder="Pour la coordination de la livraison"
        bg="white"
        border="1px solid #a6a6a6"
        borderRadius="3px"
        fontSize="13px"
        h="31px"
        _hover={{ borderColor: "#007185" }}
        _focus={{
          borderColor: "#007185",
          boxShadow: "0 0 3px 2px rgb(228 121 17 / 50%)",
          outline: "none",
        }}
      />
    </FormControl>

    {/* Terms Agreement - Only on last step */}
    <FormControl isInvalid={!!errors.agree} mt={4}>
      <Text fontSize="12px" color="#0F1111" lineHeight="1.4" mb={2}>
        En créant un compte, vous acceptez les{" "}
        <Link
          color="#007185"
          _hover={{ textDecoration: "underline", color: "#C7511F" }}
        >
          Conditions d'utilisation
        </Link>{" "}
        et la{" "}
        <Link
          color="#007185"
          _hover={{ textDecoration: "underline", color: "#C7511F" }}
        >
          Politique de confidentialité
        </Link>{" "}
        d'As Solutions.
      </Text>
      <Checkbox
        isChecked={agree}
        onChange={(e) => setAgree(e.target.checked)}
        size="sm"
        colorScheme="orange"
      >
        <Text fontSize="12px" color="#0F1111">
          J'accepte les conditions générales
        </Text>
      </Checkbox>
      <FormErrorMessage fontSize="12px" color="#C40000">
        {errors.agree}
      </FormErrorMessage>
    </FormControl>
  </VStack>
);

  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      <Navbar />
      <Box minH="100vh" bg="#f3f3f3" py={8}>
        <Container maxW="500px">
          <VStack spacing={0} align="stretch">
            {renderReferralInfo()}

            {/* Progress Indicator */}
            <Box mb={6} bg="white" p={4} borderRadius="4px" border="1px solid #ddd">
              <VStack spacing={3}>
                <HStack justify="space-between" w="full">
                  {steps.map((step, idx) => (
                    <HStack key={step.title} spacing={2} flex="1">
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="50%"
                        bg={
                          idx < currentStep
                            ? "#007185"
                            : idx === currentStep
                            ? "#FFD814"
                            : "#DDD"
                        }
                        color={
                          idx < currentStep
                            ? "white"
                            : idx === currentStep
                            ? "#0F1111"
                            : "#767676"
                        }
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="11px"
                        fontWeight="bold"
                      >
                        {idx < currentStep ? <CheckIcon boxSize="10px" /> : idx + 1}
                      </Box>
                      <VStack spacing={0} align="start" flex="1">
                        <Text fontSize="12px" fontWeight="bold" color="#0F1111">
                          {step.title}
                        </Text>
                        <Text fontSize="10px" color="#767676">
                          {step.description}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </HStack>
                <Progress
                  value={progressValue}
                  size="sm"
                  colorScheme="orange"
                  bg="#DDD"
                  w="full"
                  borderRadius="full"
                />
              </VStack>
            </Box>

            {/* Main Form Card */}
            <Box
              bg="white"
              p={6}
              borderRadius="4px"
              border="1px solid #ddd"
              boxShadow="0 2px 4px rgba(0,0,0,.1)"
            >
              <VStack spacing={4} align="stretch">
                <Heading 
                  fontSize="lg"
                  color="#0F1111" 
                  fontWeight="400"
                  fontFamily="Arial, sans-serif"
                  mb={2}
                >
                  {currentStep === 0 && "Create your account"}
                  {currentStep === 1 && form.customer_type === "business" && "Business information"}
                  {(currentStep === 1 && form.customer_type === "client") || (currentStep === 2 && form.customer_type === "business") && "Où devons-nous livrer?"}
                </Heading>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    {/* Step Content */}
                    {currentStep === 0 && renderAccountStep()}
                    {currentStep === 1 && form.customer_type === "business" && renderBusinessStep()}
                    {((currentStep === 1 && form.customer_type === "client") || 
                      (currentStep === 2 && form.customer_type === "business")) && renderAddressStep()}

                    {/* Navigation Buttons */}
                    <HStack justify="space-between" mt={6}>
                      <Button
                        variant="ghost"
                        onClick={prevStep}
                        isDisabled={currentStep === 0}
                        leftIcon={<ArrowBackIcon />}
                        fontSize="13px"
                        color="#007185"
                        _hover={{ bg: "#f0f2f2" }}
                      >
                        Back
                      </Button>

                      {!isLastStep ? (
                        <Button
                          onClick={nextStep}
                          bg="#FFD814"
                          color="#0F1111"
                          fontSize="13px"
                          fontWeight="400"
                          h="29px"
                          px={6}
                          borderRadius="3px"
                          border="1px solid #FCD200"
                          rightIcon={<ArrowForwardIcon />}
                          _hover={{ 
                            bg: "#F7CA00",
                            borderColor: "#F2C200"
                          }}
                        >
                          Continue
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          bg="#FFD814"
                          color="#0F1111"
                          fontSize="13px"
                          fontWeight="400"
                          h="29px"
                          px={6}
                          borderRadius="3px"
                          border="1px solid #FCD200"
                          isLoading={loading}
                          loadingText="Creating account..."
                          isDisabled={loading}
                          _hover={{ 
                            bg: "#F7CA00",
                            borderColor: "#F2C200"
                          }}
                        >
                          Create Account
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </form>
              </VStack>
            </Box>

            {/* Sign In Link */}
            <Box mt={6} textAlign="center">
              <Text fontSize="12px" color="#767676">
                Already have an account?{" "}
                <Link 
                  href="/account/signin" 
                  color="#007185" 
                  fontWeight="400"
                  _hover={{ textDecoration: "underline", color: "#C7511F" }}
                >
                  Sign in
                </Link>
              </Text>
            </Box>

            {/* Footer */}
            <Box mt={8} pt={4} borderTop="1px solid #ddd">
              <HStack justify="center" spacing={6} fontSize="11px" color="#555">
                <Link href="/conditions" _hover={{ textDecoration: "underline", color: "#007185" }}>
                  Conditions of Use
                </Link>
                <Link href="/privacy" _hover={{ textDecoration: "underline", color: "#007185" }}>
                  Privacy Notice
                </Link>
                <Link href="/help" _hover={{ textDecoration: "underline", color: "#007185" }}>
                  Help
                </Link>
              </HStack>
              <Text textAlign="center" fontSize="11px" color="#555" mt={2}>
                © 1996-2024, As Solutions, Inc. or its affiliates
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}