import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Table, Tbody, Tr, Td, Button, Container } from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";

export default function CheckoutSuccess() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderNumber = params.get("order_id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!orderNumber) {
    setLoading(false);
    return;
  }
  setLoading(true);
  axios
    .get(`https://api.assolutionsfournitures.fr/api/orders/public/orders/by-number/${orderNumber}`)
    .then((res) => setOrder(res.data.data))
    .catch(() => setOrder(null))
    .finally(() => setLoading(false));
}, [orderNumber]);

  return (
    <Box bg="white" borderRadius="md">
      <Navbar />

      <Container maxW="7xl">
        <Box
            mt={5}
        >
          <Heading as="h1" size="lg" mb={4} 
          color="green.600" fontFamily='Bogle'
          >
            Merci pour votre commande !
          </Heading>
          <Text fontSize="lg" mb={6} fontFamily='Bogle'>
            Votre commande a été reçue avec succès. Nous vous remercions pour
            votre achat.
          </Text>
          {loading ? (
            <Spinner size="lg" />
          ) : order ? (
            <>
              <Table variant="simple" size="sm" mb={6}>
                <Tbody>
                  <Tr>
                    <Td fontWeight="bold">Numéro de commande</Td>
                    <Td>{order.order_number}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Date</Td>
                    <Td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : ""}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Montant total</Td>
                    <Td>€{parseFloat(order.total).toFixed(2)}</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Statut</Td>
                    <Td>
                        {order.status === "pending" ? "En attente" : null}
                        {order.status === "processing" ? "En cours de traitement" : null}
                        {order.status === "paid" ? "Payée" : null}
                        {order.status === "shipped" ? "Expédiée" : null}
                        {order.status === "on_delivery" ? "En livraison" : null}
                        {order.status === "in_transit" ? "En transit" : null}
                        {order.status === "in_customs" ? "En douane" : null}
                        {order.status === "completed" ? "Terminée" : null}
                        {order.status === "cancelled" ? "Annulée" : null}
                        {order.status === "pending_payment" ? "En attente de paiement" : null}
                        {order.status === "order_cancel_request" ? "Demande d'annulation de commande" : null}
                        {order.status === "cancelled" ? "Annulée" : null} 
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="bold">Email</Td>
                    <Td>{order.customer?.email}</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Button
                as={Link}
                to="/account/profile"
                colorScheme="blue"
                variant="solid"
              >
                Voir mes commandes
              </Button>
            </>
          ) : (
            <Text color="red.500">
              Impossible de charger les détails de la commande.
            </Text>
          )}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}