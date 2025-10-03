import React from "react";
import { Box, Heading, Text, Button, Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";

export default function OrderCancelled() {
  return (
    <Box bg="white" minH="120vh">
      <Navbar />

      <Container maxW="7xl">
        <Box mt={5} pt={8} pb={8}>
          <Heading as="h1" size="lg" mb={4} color="red.600" fontFamily="Bogle">
            Paiement échoué ou annulé
          </Heading>
          <Text fontSize="lg" mb={6} fontFamily="Bogle">
            Votre commande a bien été créée, mais le paiement n'a pas abouti.
            <br />
            Aucun montant n'a été débité.
            <br />
            Vous pouvez réessayer le paiement depuis votre espace client, ou
            contacter notre support si besoin.
            <br />
            <br />
            Si vous avez des questions, n'hésitez pas à nous contacter.
          </Text>
          <Button
            as={Link}
            to="/account/profile"
            colorScheme="blue"
            variant="solid"
            mr={3}
          >
            Voir mes commandes
          </Button>
          <Button as={Link} to="/" variant="ghost">
            Accueil
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}
