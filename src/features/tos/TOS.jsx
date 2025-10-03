import * as chakra from "@chakra-ui/react";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";
import React from "react";

export default function TOS() {
    return (
      <chakra.Box>
        <Navbar />

        <chakra.Container maxW="6xl">
          <chakra.Text py={6}>
            Conditions Générales de Vente (CGV)
            <br /><br />

            AS SOLUTIONS Fournitures – assolutionsfournitures.fr
            <br /><br />

            1. Objet
            <br />
            Les présentes Conditions Générales de Vente (CGV) définissent les droits et obligations de la société AS SOLUTIONS 
            Fournitures et de ses clients dans le cadre de la vente de produits proposés sur le site assolutionsfournitures.fr.
            Toute commande passée sur le site implique l’acceptation sans réserve des présentes CGV.
            <br /><br />
            2. Produits et disponibilités
            <br />
            Les produits présentés sur le site sont décrits et illustrés avec la plus grande exactitude possible. Toutefois, des différences 
            mineures peuvent exister entre les photos et le produit livré (coloris, finitions, dimensions).
            Les offres sont valables tant qu’elles sont visibles sur le site, dans la limite des stocks disponibles.
            <br /><br />
            3. Commandes
            <br />
            Le client valide sa commande après avoir renseigné les informations nécessaires et accepté les présentes CGV.
            AS SOLUTIONS Fournitures se réserve le droit d’annuler ou de refuser toute commande en cas de litige avec un client, défaut de paiement, ou suspicion de fraude.
            <br /><br />
            4. Prix et paiement
            <br />
            Les prix affichés sont indiqués en euros, toutes taxes comprises (TTC), hors frais de livraison.
            Les frais de transport sont calculés et précisés avant la validation finale de la commande.
            Le paiement est exigible immédiatement à la commande et peut être effectué par carte bancaire ou tout autre moyen proposé sur le site.
            <br /><br />
            5. Livraison
            <br />
            Les délais de livraison sont communiqués à titre indicatif.
            AS SOLUTIONS Fournitures ne saurait être tenue responsable en cas de retard lié à un transporteur, à un cas de force majeure ou à une rupture de stock imprévue.
            La livraison est effectuée à l’adresse indiquée par le client lors de la commande.
            <br /><br />
            6. Droit de rétractation et retours
            <br />
            Conformément au Code de la consommation, le client dispose d’un délai légal de 14 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier de motif ni à payer de pénalités.
            Les produits doivent être retournés dans leur état d’origine, non utilisés et dans leur emballage complet.
            Les frais de retour sont à la charge du client, sauf erreur imputable à AS SOLUTIONS Fournitures.
            <br /><br />
            ⚠️ Exception : produits personnalisés et préfabriqués
            Tout produit réalisé sur mesure, personnalisé ou préfabriqué selon les spécifications du client (dimensions, couleurs, finitions, 
            aménagements spécifiques, etc.) est exclu du droit de rétractation (article L221-28 du Code de la consommation).
            Ces produits ne peuvent ni être retournés, ni échangés, ni remboursés, sauf défaut avéré imputable au fabricant.
            <br /><br />
            7. Garanties légales
            <br />
            Tous les produits bénéficient des garanties légales :
            Garantie légale de conformité (articles L217-3 et suivants du Code de la consommation).
            Garantie des vices cachés (articles 1641 et suivants du Code civil).
            En cas de produit défectueux, le client doit en informer le service client dans les meilleurs délais.
            <br /><br />
            8. Responsabilité
            <br />
            AS SOLUTIONS Fournitures ne saurait être tenue responsable des dommages indirects ou immatériels résultant de l’utilisation du produit.
            La responsabilité de la société est limitée au montant de la commande.
            <br /><br />
            9. Données personnelles
            <br />
            Les informations collectées sont nécessaires au traitement de la commande et sont traitées conformément au Règlement Général sur la Protection des Données (RGPD).
            Le client dispose d’un droit d’accès, de rectification et de suppression de ses données personnelles.
            <br /><br />
            10. Droit applicable et litiges
            <br />
            Les présentes CGV sont soumises au droit français.
            En cas de litige, une solution amiable sera recherchée avant tout recours judiciaire. À défaut, le litige sera porté devant les juridictions compétentes.
          </chakra.Text>
        </chakra.Container>

        <Footer />
      </chakra.Box>
    );
}