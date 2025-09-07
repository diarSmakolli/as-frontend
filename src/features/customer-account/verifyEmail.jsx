import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../../shared-customer/components/Navbar";
import { customerAccountService } from "./customerAccountService";
import { customToastContainerStyle } from "../../commons/toastStyles";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Requête invalide.");
      return;
    }
    const verify = async () => {
      try {
        const res = await customerAccountService.verifyEmail(token);
        setStatus("success");
        setMessage(res.message || "Votre adresse e-mail a été vérifiée !");
        toast({
          title: "E-mail vérifié !",
          status: "success",
          duration: 4000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "Échec de la vérification. Veuillez réessayer.");
      }
    };
    verify();
    // eslint-disable-next-line
  }, []);

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
                  Vérification de l'e-mail
                </Heading>

                {status === "loading" && (
                  <VStack py={6}>
                    <Spinner color="orange.500" size="lg" />
                    <Text fontSize="sm" color="gray.500" mt={2}>
                      Vérification de votre e-mail...
                    </Text>
                  </VStack>
                )}

                {status === "success" && (
                  <Alert status="success" borderRadius="md" fontSize="13px">
                    <AlertIcon />
                    <Box flex="1">{message}</Box>
                  </Alert>
                )}

                {status === "error" && (
                  <Alert status="error" borderRadius="md" fontSize="13px">
                    <AlertIcon />
                    <Box flex="1">{message}</Box>
                  </Alert>
                )}

                {status === "success" && (
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
                    mt={4}
                  >
                    Aller à la connexion
                  </Button>
                )}
              </VStack>
            </Box>
            <Box mt={8} pt={4} borderTop="1px solid #ddd">
              <Text textAlign="center" fontSize="11px" color="#555" mt={2}>
                As Solutions, Inc. ou ses affiliés
              </Text>
            </Box>
          </VStack>
        </Container>
      </Box>
    </>
  );
}
