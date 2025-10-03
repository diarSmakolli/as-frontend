import * as chakra from "@chakra-ui/react";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";
import React from "react";

export default function PrivacyTOS() {
    return (
      <chakra.Box>
        <Navbar />

        <chakra.Container maxW="6xl">
          <chakra.Text py={6}>
            <chakra.Text as='span' fontSize='xl'>Politique de Confidentialité</chakra.Text>
            <br/><br/>
            AS SOLUTIONS Fournitures – assolutionsfournitures.fr
            <br />
            La protection de vos données personnelles est une priorité pour AS SOLUTIONS Fournitures.
            Cette Politique de Confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre site assolutionsfournitures.fr.
            <br /><br />

            1. Collecte des données

            <br />
            Nous collectons des informations vous concernant lorsque :
            <br />
            - Vous créez un compte client.
            <br />
            - Vous passez une commande.
            <br />
            - Vous vous inscrivez à notre newsletter.
            <br />
            - Vous nous contactez via le formulaire ou par e-mail.
            <br />
            Les données collectées peuvent inclure : nom, prénom, adresse postale, numéro de téléphone, adresse e-mail, informations de paiement, historique de commandes.
            <br /><br />
            2. Utilisation des données
            <br />
            Vos données sont utilisées pour :
            <br />
            - Traiter et livrer vos commandes.
            <br />
            - Vous envoyer des confirmations, factures et documents liés à vos achats.
            <br />
            - Répondre à vos demandes via le service client.
            <br />
            - Vous informer sur nos nouveautés, promotions et offres (si vous y avez consenti).
            <br />
            - Améliorer la navigation et l’expérience utilisateur sur notre site.
            <br /><br />
            3. Base légale du traitement
            <br />
            Le traitement de vos données est fondé sur :
            <br />
            - Votre consentement (inscription à la newsletter, offres commerciales).
            <br />
            - Votre consentement (inscription à la newsletter, offres commerciales).
            <br />
            - L’obligation légale (facturation, comptabilité).
            <br /><br />
            4. Partage des données
            <br />
            Nous ne vendons ni ne louons vos données personnelles.
            <br/>
            Nous pouvons partager certaines informations uniquement avec :
            <br />
            - Nos prestataires logistiques (transporteurs, services de livraison).
            <br />
            - Nos prestataires techniques (hébergeur, solution de paiement sécurisé).
            <br />
            - Les autorités compétentes en cas d’obligation légale.
            <br /><br />
            5. Conservation des données
            <br />
            Vos données sont conservées :
            <br />
            - Pendant la durée nécessaire à la gestion de la relation commerciale.
            <br />
            - Jusqu’à 3 ans après la fin de la relation commerciale pour des actions marketing (sauf opposition).
            <br />
            - Jusqu’à 10 ans pour les documents comptables et fiscaux.
            <br /><br />
            6. Sécurité des données
            <br />
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données contre la perte, l’accès non autorisé ou l’utilisation abusive.
            <br/>
            Les paiements en ligne sont sécurisés via des protocoles conformes aux normes SSL/TLS.
            <br /><br />
           
            7. Garanties légales
            <br />
            Conformément au RGPD et à la loi « Informatique et Libertés » :
            <br />
            - Vous pouvez demander l’accès, la rectification ou la suppression de vos données.
            <br />
            - Vous pouvez limiter ou vous opposer à leur traitement.
            <br />
            - Vous pouvez demander la portabilité de vos données.
            <br />
            - Vous pouvez retirer votre consentement à tout moment (newsletter, offres commerciales).
            <br /><br />
            8. Cookies
            <br />
            Notre site utilise des cookies pour améliorer la navigation et mesurer l’audience.
            <br />
            Vous pouvez configurer votre navigateur pour accepter ou refuser les cookies.
            <br />
            <br /><br />
            9. Modifications
            <br />
            AS SOLUTIONS Fournitures se réserve le droit de modifier cette Politique de Confidentialité à tout moment.
            <br />
            La version la plus récente est toujours disponible sur cette page.
          </chakra.Text>
        </chakra.Container>

        <Footer />
      </chakra.Box>
    );
}