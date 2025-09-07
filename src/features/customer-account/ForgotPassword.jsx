import React, { useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Button,
  useToast,
  Link,
  HStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Navbar from "../../shared-customer/components/Navbar";
import { customerAccountService } from "./customerAccountService";
import { customToastContainerStyle } from "../../commons/toastStyles";

export default function ForgotPassword() {
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setServerMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Entrez votre email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Entrez une adresse e-mail valide";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await customerAccountService.requestForgotPassword(form.email);
      setServerMessage(res.message || "Si cet email existe, un lien de réinitialisation a été envoyé.");
      toast({
        title: "Demande envoyée !",
        description: res.message || "Si cet email existe, un lien de réinitialisation a été envoyé.",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (err) {
      setServerMessage(err.message || "Échec de l'envoi du lien de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Box minH="100vh" bg="#f3f3f3" py={8}>
        <Container maxW="350px">
          <VStack spacing={0} align="stretch">

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
                  size="md"
                  color="#0F1111"
                  fontWeight="400"
                  fontFamily="Airbnb Cereal VF, sans-serif"
                  mb={2}
                >
                  Mot de passe oublié
                </Heading>

                {serverMessage && (
                  <Alert status="info" borderRadius="md" fontSize="13px">
                    <AlertIcon />
                    <Box flex="1">{serverMessage}</Box>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    {/* Email */}
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel
                        fontSize="13px"
                        fontWeight="700"
                        color="#0F1111"
                        fontFamily="Arial, sans-serif"
                      >
                        Email
                      </FormLabel>
                      <Input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Entrez votre email"
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
                        {errors.email}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      bg="#FFD814"
                      color="#0F1111"
                      fontSize="13px"
                      fontWeight="400"
                      h="29px"
                      borderRadius="3px"
                      border="1px solid #FCD200"
                      isLoading={loading}
                      loadingText="Sending..."
                      isDisabled={loading}
                      _hover={{
                        bg: "#F7CA00",
                        borderColor: "#F2C200",
                      }}
                      _active={{
                        bg: "#F0B800",
                      }}
                      fontFamily="Arial, sans-serif"
                    >
                      Envoyer le lien de réinitialisation
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </Box>

            {/* Login Link */}
            <Box mt={6} textAlign="center">
              <Text fontSize="12px" color="#767676">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link
                  href="/account/signin"
                  color="#007185"
                  fontWeight="400"
                  _hover={{ textDecoration: "underline", color: "#C7511F" }}
                >
                  Se connecter
                </Link>
              </Text>
            </Box>

            {/* Footer */}
            <Box mt={8} pt={4} borderTop="1px solid #ddd">
              <HStack justify="center" spacing={6} fontSize="11px" color="#555">
                <Link href="/conditions" _hover={{ textDecoration: "underline", color: "#007185" }}>
                  Conditions d'utilisation
                </Link>
                <Link href="/privacy" _hover={{ textDecoration: "underline", color: "#007185" }}>
                  Avis de confidentialité
                </Link>
              </HStack>
              <Text textAlign="center" fontSize="11px" color="#555" mt={2}>
                As Solutions, Inc. or its affiliates
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}