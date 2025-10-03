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
  InputGroup,
  InputRightElement,
  IconButton,
  Button,
  useToast,
  Link,
  HStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { customerAccountService } from "./customerAccountService";
import Navbar from "../../shared-customer/components/Navbar";
import { handleApiError } from "../../commons/handleApiError";
import { customToastContainerStyle } from "../../commons/toastStyles";

export default function LoginAccount() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [resend, setResend] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setServerError("");
    setResend(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) newErrors.email = "Entrez votre email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Entrez une adresse e-mail valide";
    if (!form.password) newErrors.password = "Entrez votre mot de passe";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setResend(false);
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await customerAccountService.loginAccount(form);
      toast({
        title: "Connexion réussie !",
        description: "Content de te revoir.",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      
      // redirect to home page
      window.location.href = '/';
    } catch (err) {
      setServerError(err.message || "La connexion a échoué.");
      setResend(!!err.resend);
      handleApiError(err);
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
                  Se connecter
                </Heading>

                {serverError && (
                  <Alert status="error" borderRadius="md" fontSize="13px">
                    <AlertIcon />
                    <Box flex="1">{serverError}</Box>
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

                    {/* Password */}
                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel
                        fontSize="13px"
                        fontWeight="700"
                        color="#0F1111"
                        fontFamily="Arial, sans-serif"
                      >
                        Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Entrez votre mot de passe"
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
                            outline: "none",
                          }}
                        />
                        <InputRightElement h="31px">
                          <IconButton
                            variant="ghost"
                            size="xs"
                            aria-label={
                              showPassword
                                ? "Masquer le mot de passe"
                                : "Afficher le mot de passe"
                            }
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            color="gray.500"
                          />
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage fontSize="12px" color="#C40000">
                        {errors.password}
                      </FormErrorMessage>
                    </FormControl>

                    <Button
                      type="submit"
                      size="sm"
                      color="rgba(223, 240, 255, 1)"
                      rounded="5px"
                      border="1px solid rgba(148, 145, 171, 0.2)"
                      p="18px 18px"
                      bg="#3167a8ff"
                      _hover={{ color: "white" }}
                      fontWeight={"500"}
                      fontFamily="Airbnb Cereal VF"
                      isLoading={loading}
                      loadingText="Se connecter..."
                      isDisabled={loading}
                    >
                      Se connecter
                    </Button>

                    {resend && (
                      <Alert status="info" borderRadius="md" fontSize="13px">
                        <AlertIcon />
                        Veuillez vérifier votre courrier électronique pour un
                        lien de confirmation pour activer votre compte.
                      </Alert>
                    )}
                  </VStack>
                </form>
              </VStack>
            </Box>

            {/* Register Link */}
            <Box mt={6} textAlign="center">
              <Text fontSize="12px" color="#767676">
                Nouveau chez As Solutions?{" "}
                <Link
                  href="/account/register"
                  color="#007185"
                  fontWeight="400"
                  _hover={{ textDecoration: "underline", color: "#C7511F" }}
                >
                  Créez votre compte
                </Link>
              </Text>
            </Box>

             <Box mt={6} textAlign="center">
              <Text fontSize="12px" color="#767676">
                Récupérer le compte?{" "}
                <Link
                  href="/account/forgot-password"
                  color="#007185"
                  fontWeight="400"
                  _hover={{ textDecoration: "underline", color: "#C7511F" }}
                >
                  Mot de passe oublié
                </Link>
              </Text>
            </Box>

            {/* Footer */}
            <Box mt={8} pt={4} borderTop="1px solid #ddd">
              <HStack justify="center" spacing={6} fontSize="11px" color="#555">
                <Link
                  href="/conditions"
                  _hover={{ textDecoration: "underline", color: "#007185" }}
                >
                  Conditions d'utilisation
                </Link>
                <Link
                  href="/privacy"
                  _hover={{ textDecoration: "underline", color: "#007185" }}
                >
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