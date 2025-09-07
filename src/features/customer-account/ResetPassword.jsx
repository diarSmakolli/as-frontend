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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../shared-customer/components/Navbar";
import { customerAccountService } from "./customerAccountService";
import { customToastContainerStyle } from "../../commons/toastStyles";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const toast = useToast();

  const token = searchParams.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setServerMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.newPassword) newErrors.newPassword = "Entrez un nouveau mot de passe";
    if (form.newPassword && form.newPassword.length < 6)
      newErrors.newPassword = "Le mot de passe doit contenir au moins 6 caractères";
    if (!form.confirmPassword) newErrors.confirmPassword = "Confirmez votre mot de passe";
    if (form.newPassword !== form.confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await customerAccountService.resetPassword(token, form.newPassword);
      setServerMessage(res.message || "Le mot de passe a été réinitialisé.");
      setSuccess(true);
      toast({
        title: "Mot de passe réinitialisé !",
        description: res.message || "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.",
        status: "success",
        duration: 4000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (err) {
      setServerMessage(err.message || "Échec de la réinitialisation du mot de passe.");
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
            <Box
              bg="white"
              p={6}
              borderRadius="4px"
              border="1px solid #ddd"
              boxShadow="0 2px 4px rgba(0,0,0,.1)"
              mt={8}
            >
              <VStack spacing={4} align="stretch">
                <Heading
                  size="md"
                  color="#0F1111"
                  fontWeight="400"
                  fontFamily="Airbnb Cereal VF, sans-serif"
                  mb={2}
                >
                  Réinitialiser le mot de passe
                </Heading>

                {serverMessage && (
                  <Alert status={success ? "success" : "info"} borderRadius="md" fontSize="13px">
                    <AlertIcon />
                    <Box flex="1">{serverMessage}</Box>
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isInvalid={!!errors.newPassword}>
                      <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
                        Nouveau mot de passe
                      </FormLabel>
                      <Input
                        name="newPassword"
                        type="password"
                        value={form.newPassword}
                        onChange={handleChange}
                        placeholder="Entrez un nouveau mot de passe"
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
                        {errors.newPassword}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel fontSize="13px" fontWeight="700" color="#0F1111">
                        Confirmer le mot de passe
                      </FormLabel>
                      <Input
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirmer le nouveau mot de passe"
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
                        {errors.confirmPassword}
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
                      loadingText="Resetting..."
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
                      Réinitialiser le mot de passe
                    </Button>
                  </VStack>
                </form>
                {success && (
                  <Button
                    as={Link}
                    href="/account/signin"
                    bg="#FFD814"
                    color="#0F1111"
                    fontSize="13px"
                    fontWeight="400"
                    h="29px"
                    borderRadius="3px"
                    border="1px solid #FCD200"
                    _hover={{
                      bg: "#F7CA00",
                      borderColor: "#F2C200",
                    }}
                    _active={{
                      bg: "#F0B800",
                    }}
                    fontFamily="Arial, sans-serif"
                    mt={2}
                  >
                    Se connecter
                  </Button>
                )}
              </VStack>
            </Box>
            <Box mt={8} pt={4} borderTop="1px solid #ddd">
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