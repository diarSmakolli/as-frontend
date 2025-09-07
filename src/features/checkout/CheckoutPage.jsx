// WORKING WELL
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Text,
  Button,
  VStack,
  HStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Radio,
  RadioGroup,
  Stack,
  Divider,
  Badge,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Spinner,
  Icon,
  Spacer,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCreditCard,
  FaUniversity,
  FaTag,
  FaGift,
  FaTimes,
  FaEdit,
} from "react-icons/fa";
import { homeService } from "../home/services/homeService";
import { customerAccountService } from "../customer-account/customerAccountService";
import { useCustomerAuth } from "../customer-account/auth-context/customerAuthContext";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";

// Constants
const PAYMENT_METHODS = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
};

const ADDRESS_MODES = {
  VIEW: "view",
  EDIT: "edit",
  ADD: "add",
  CHOOSE: "choose",
};

const REQUIRED_ADDRESS_FIELDS = [
  "first_name",
  "last_name",
  "street",
  "city",
  "postal_code",
  "phone",
];

const COUNTRY_NAME_TO_ISO = {
  France: "fr",
  Germany: "de",
  Italy: "it",
  Netherlands: "nl",
  Belgium: "be",
  Switzerland: "ch",
  Spain: "es",
  Hungary: "hu"
};

function getIsoCountry(countryName) {
  return COUNTRY_NAME_TO_ISO[countryName] || "fr"; // default to "fr"
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { customer, refreshCustomer } = useCustomerAuth();
  // Core state
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Form state
  const [paymentMethod, setPaymentMethod] = useState("");
  const [specialNote, setSpecialNote] = useState("");
  const [useSameAddressForBilling, setUseSameAddressForBilling] =
    useState(true);
  const [billingType, setBillingType] = useState("client"); // 'client' or 'business'
  // Address state - simplified billing
  const [selectedShippingAddress, setSelectedShippingAddress] = useState("");
  const [addressMode, setAddressMode] = useState(ADDRESS_MODES.VIEW);
  const [editingAddress, setEditingAddress] = useState(null);
  const [billingFormData, setBillingFormData] = useState({
    first_name: "",
    last_name: "",
    company: "",
    street: "",
    city: "",
    postal_code: "",
    country: "France",
    phone: "",
    business_registration_number: "",
    vat_number: "",
    fiscal_number: "",
  });
  // Promotion state
  const [promotionCode, setPromotionCode] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [giftCardLoading, setGiftCardLoading] = useState(false);
  // shipping cost
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  // Address functions (moved before useMemo)
  const getAddressById = useCallback(
    (addressId) => {
      if (!addressId || addressId === "new" || !customer?.addresses) {
        return null;
      }

      const addressIndex = parseInt(addressId);
      if (!isNaN(addressIndex) && customer.addresses[addressIndex]) {
        return customer.addresses[addressIndex];
      }

      return (
        customer.addresses.find(
          (addr) => addr.id === addressId || addr.label === addressId
        ) || customer.addresses[0]
      );
    },
    [customer?.addresses]
  );

  // fetch cart one time 1st
  useEffect(() => {
    if (!customer) return;
    const fetchInitialCart = async () => {
      setLoading(true);
      try {
        const response = await homeService.getActiveCart();
        setCartData(response);
        if (!response.items || response.items.length === 0) {
          navigate("/cart");
        }
      } catch (err) {
        handleError("Erreur lors du chargement du panier", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCart();
  }, [customer, navigate]);

  // calculate shipping costs
  // useEffect(() => {
  //   // Get postal code and country from the selected shipping address or editing form
  //   const postalCode =
  //     editingAddress?.postal_code || billingFormData?.postal_code;
  //   const countryName =
  //     editingAddress?.country || billingFormData?.country || "France";
  //   const isoCountry = getIsoCountry(countryName);

  //   if (postalCode && isoCountry && cartData?.items?.length > 0) {
  //     (async () => {
  //       try {
  //         const cart = await homeService.getActiveCart(isoCountry, postalCode);
  //         setCartData(cart);

  //         const options = cart.bigbuy_shipping_details?.all_options || [];
  //         setShippingOptions(options);

  //         if (options.length > 0) {
  //           const lowest = options.reduce(
  //             (min, opt) => (opt.cost < min.cost ? opt : min),
  //             options[0]
  //           );
  //           setSelectedShippingOption(lowest);
  //           setShippingFee(lowest.cost);
  //         } else {
  //           setSelectedShippingOption(null);
  //           setShippingFee(0);
  //         }
  //       } catch (err) {
  //         setShippingOptions([]);
  //         setSelectedShippingOption(null);
  //         setShippingFee(0);
  //       }
  //     })();
  //   }
  // }, [editingAddress?.postal_code, editingAddress?.country, cartData]);

  // 2. Fetch shipping options ONLY when address changes
  useEffect(() => {
    // Only run if we have a postal code, country, and cartData with items
    const postalCode =
      editingAddress?.postal_code || billingFormData?.postal_code;
    const countryName =
      editingAddress?.country || billingFormData?.country || "France";
    const isoCountry = getIsoCountry(countryName);

    if (postalCode && isoCountry && cartData?.items?.length > 0) {
      let cancelled = false;
      (async () => {
        try {
          const cart = await homeService.getActiveCart(isoCountry, postalCode);
          if (cancelled) return;
          setCartData(cart);

          const options = cart.bigbuy_shipping_details?.all_options || [];
          setShippingOptions(options);

          if (options.length > 0) {
            const lowest = options.reduce(
              (min, opt) => (opt.cost < min.cost ? opt : min),
              options[0]
            );
            setSelectedShippingOption(lowest);
            setShippingFee(lowest.cost);
          } else {
            setSelectedShippingOption(null);
            setShippingFee(0);
          }
        } catch (err) {
          if (cancelled) return;
          setShippingOptions([]);
          setSelectedShippingOption(null);
          setShippingFee(0);
        }
      })();
      return () => {
        cancelled = true;
      };
    }
    // IMPORTANT: Remove cartData from dependency array!
  }, [
    editingAddress?.postal_code,
    editingAddress?.country,
    billingFormData?.postal_code,
    billingFormData?.country,
  ]);

  // ✅ NEW: Calculate shipping when addresses are first loaded/selected
useEffect(() => {
  // Only run after customer and addresses are loaded, and we have cart data
  if (customer?.addresses && selectedShippingAddress && cartData?.items?.length > 0 && !editingAddress) {
    const addressData = getAddressById(selectedShippingAddress);
    
    if (addressData?.postal_code && addressData?.country) {
      const isoCountry = getIsoCountry(addressData.country);
      
      console.log(`[InitShipping] Calculating for default address: ${addressData.country} (${isoCountry}), ${addressData.postal_code}`);
      
      let cancelled = false;
      (async () => {
        try {
          const cart = await homeService.getActiveCart(isoCountry, addressData.postal_code);
          if (cancelled) return;
          
          setCartData(cart);
          
          const options = cart.bigbuy_shipping_details?.all_options || [];
          setShippingOptions(options);

          if (options.length > 0) {
            const lowest = options.reduce(
              (min, opt) => (opt.cost < min.cost ? opt : min),
              options[0]
            );
            setSelectedShippingOption(lowest);
            setShippingFee(lowest.cost);
            
            console.log(`[InitShipping] Default shipping calculated: €${lowest.cost}`);
          }
        } catch (err) {
          if (cancelled) return;
          console.error('[InitShipping] Failed:', err);
        }
      })();
      
      return () => {
        cancelled = true;
      };
    }
  }
}, [
  customer?.addresses, 
  selectedShippingAddress, 
  cartData?.items?.length,
  editingAddress // Don't run this when user is editing (let the other useEffect handle it)
]);

  // Computed values
  const hasAddresses = useMemo(
    () => customer?.addresses && customer.addresses.length > 0,
    [customer?.addresses]
  );

  const defaultAddress = useMemo(
    () =>
      customer?.addresses?.find((addr) => addr.is_default) ||
      customer?.addresses?.[0],
    [customer?.addresses]
  );

  const selectedShippingAddressData = useMemo(
    () => getAddressById(selectedShippingAddress),
    [selectedShippingAddress, getAddressById]
  );

  const initializeAddresses = useCallback(() => {
    if (!customer) return;

    if (hasAddresses) {
      const addressId = defaultAddress?.id || defaultAddress?.label || "";
      setSelectedShippingAddress(addressId);
    } else {
      setSelectedShippingAddress("new");
    }

    // ✅ Enhanced billing form initialization with customer business data
    setBillingFormData({
      first_name: customer?.first_name || "",
      last_name: customer?.last_name || "",
      company:
        customer?.customer_type === "business"
          ? customer?.business_name || ""
          : "",
      street: "",
      city: "",
      postal_code: "",
      country: "France",
      phone: customer?.phone_primary || "",
      // ✅ Include customer business data for billing
      business_registration_number:
        customer?.customer_type === "business"
          ? customer?.business_registration_number || ""
          : "",
      vat_number:
        customer?.customer_type === "business"
          ? customer?.vat_number || ""
          : "",
      fiscal_number: "",
    });

    // ✅ Set billing type based on customer type
    setBillingType(
      customer?.customer_type === "business" ? "business" : "client"
    );
  }, [customer, hasAddresses, defaultAddress]);

  useEffect(() => {
    if (!customer) {
      navigate("/account/signin");
      return;
    }

    initializeCheckout();
  }, [customer, navigate]);

  // Watch for customer updates - improve dependency tracking
  useEffect(() => {
    if (customer?.addresses) {
      initializeAddresses();
    }
  }, [customer?.addresses?.length, initializeAddresses]);

  // Core functions
  const initializeCheckout = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchCartData(),
        // Small delay to ensure customer data is loaded
        new Promise((resolve) => setTimeout(resolve, 100)),
      ]);
      initializeAddresses();
    } catch (err) {
      handleError("Une erreur est survenue", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartData = async () => {
    const response = await homeService.getActiveCart();
    setCartData(response);

    if (!response.items || response.items.length === 0) {
      navigate("/cart");
    }
  };

  // Enhanced refresh customer data function
  const refreshCustomerData = async () => {
    try {
      if (refreshCustomer) {
        await refreshCustomer();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Address functions
  const createEmptyAddress = () => ({
    label: "",
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    company:
      customer?.customer_type === "business"
        ? customer?.business_name || ""
        : "",
    street: "",
    city: "",
    postal_code: "",
    country: "France",
    phone: customer?.phone_primary || "",
    is_default: false,
    // Business fields for shipping address
    business_registration_number:
      customer?.customer_type === "business"
        ? customer?.business_registration_number || ""
        : "",
    vat_number:
      customer?.customer_type === "business" ? customer?.vat_number || "" : "",
    fiscal_number: "",
  });

  // ✅ UPDATED: More flexible required fields function
  const getRequiredAddressFields = (customerType, isShipping = true) => {
    const baseFields = [
      "first_name",
      "last_name",
      "street",
      "city",
      "postal_code",
      "phone",
    ];

    // ✅ CHANGED: Only require company for NEW addresses, not existing ones
    // This prevents validation errors when using existing addresses without company field
    if (
      customerType === "business" &&
      isShipping &&
      selectedShippingAddress === "new"
    ) {
      return [...baseFields, "company"];
    }

    return baseFields;
  };

  const validateAddress = (
    address,
    customerType = "client",
    isShipping = true
  ) => {
    const requiredFields = getRequiredAddressFields(customerType, isShipping);
    const missingFields = requiredFields.filter(
      (field) => !address[field]?.trim()
    );
    return { isValid: missingFields.length === 0, missingFields };
  };

  const formatAddress = (address) => {
    if (!address) return "Aucune adresse disponible";
    return `${address.street}, ${address.city}, ${address.postal_code}, ${address.country}`;
  };

  const handleAddressSelection = (addressId) => {
    // Immediately update selected address
    setSelectedShippingAddress(addressId);

    // Update editing address for consistency
    const selectedAddr = getAddressById(addressId);
    if (selectedAddr) {
      setEditingAddress({
        ...selectedAddr,
        first_name: customer.first_name || selectedAddr.first_name || "",
        last_name: customer.last_name || selectedAddr.last_name || "",
        phone: selectedAddr.phone || customer.phone_primary || "",
      });
    }

    setAddressMode(ADDRESS_MODES.VIEW);
  };

  const handleEditAddress = () => {
    const addressObj = getAddressById(selectedShippingAddress);
    if (addressObj) {
      setEditingAddress({
        ...addressObj,
        first_name: customer.first_name || addressObj.first_name || "",
        last_name: customer.last_name || addressObj.last_name || "",
        phone: addressObj.phone || customer.phone_primary || "",
      });
      setAddressMode(ADDRESS_MODES.EDIT);
    }
  };

  const handleAddNewAddress = () => {
    setEditingAddress(createEmptyAddress());
    setSelectedShippingAddress("new");
    setAddressMode(ADDRESS_MODES.ADD);
  };

  // Enhanced manual refresh function
  const handleManualRefresh = async () => {
    try {
      setSubmitting(true);
      const success = await refreshCustomerData();

      if (success) {
        showToast(
          "Adresses rafraîchies",
          "Liste des adresses mise à jour avec succès",
          "success"
        );
      } else {
        showToast(
          "Échec du rafraîchissement",
          "Impossible de mettre à jour la liste des adresses",
          "warning"
        );
      }
    } catch (error) {
      showToast(
        "Erreur de rafraîchissement",
        "Une erreur est survenue lors du rafraîchissement",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const saveAddress = async () => {
    const { isValid, missingFields } = validateAddress(
      editingAddress,
      customer?.customer_type,
      true
    );

    if (!isValid) {
      showToast(
        "Informations d'adresse manquantes",
        `Veuillez remplir : ${missingFields.join(", ")}`,
        "error"
      );
      return;
    }

    // ✅ Additional validation for business customers
    if (customer?.customer_type === "business") {
      if (!editingAddress.company?.trim()) {
        showToast(
          "Nom de l'entreprise requis",
          "Veuillez entrer le nom de votre entreprise pour l'adresse de livraison",
          "error"
        );
        return;
      }
    }

    try {
      setSubmitting(true);

      const addressToSave = {
        ...editingAddress,
        label:
          editingAddress.label?.trim() ||
          `${editingAddress.city}, ${editingAddress.street}`.substring(0, 50),
      };

      let result;
      if (addressMode === ADDRESS_MODES.ADD) {
        result = await customerAccountService.addAddress({
          ...addressToSave,
          is_default: !hasAddresses,
        });

        showToast(
          "Adresse ajoutée",
          "L'adresse a été enregistrée dans votre compte",
          "success"
        );

        const refreshSuccess = await refreshCustomerData();

        if (refreshSuccess) {
          setTimeout(() => {
            setSelectedShippingAddress(result.id);
            setAddressMode(ADDRESS_MODES.VIEW);
          }, 100);
        } else {
          setSelectedShippingAddress(result.id);
          setAddressMode(ADDRESS_MODES.VIEW);
        }
      } else {
        result = await customerAccountService.editAddress(
          selectedShippingAddress,
          addressToSave
        );

        showToast(
          "Adresse mise à jour",
          "L'adresse a été mise à jour",
          "success"
        );
        await refreshCustomerData();

        setTimeout(() => {
          setAddressMode(ADDRESS_MODES.VIEW);
        }, 100);
      }
    } catch (err) {
      handleError("Échec de l'enregistrement de l'adresse", err);
    } finally {
      setSubmitting(false);
    }
  };

  const applyPromotion = async () => {
    if (!promotionCode.trim()) return;

    try {
      setPromotionLoading(true);
      await homeService.applyPromotionCode(promotionCode);
      setPromotionCode("");
      await fetchCartData();
      showToast(
        "Promotion appliquée",
        "Le code de promotion a été appliqué avec succès",
        "success"
      );
    } catch (err) {
      handleError("Erreur lors de l'application de la promotion", err);
    } finally {
      setPromotionLoading(false);
    }
  };

  const removePromotion = async () => {
    try {
      await homeService.removePromotion();
      await fetchCartData();
      showToast(
        "Promotion supprimée",
        "La promotion a été supprimée",
        "success"
      );
    } catch (err) {
      handleError("Erreur lors de la suppression de la promotion", err);
    }
  };

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) return;

    try {
      setGiftCardLoading(true);
      await homeService.applyGiftCard(giftCardCode);
      setGiftCardCode("");
      await fetchCartData();
      showToast(
        "Carte-cadeau appliquée",
        "Carte-cadeau appliquée avec succès",
        "success"
      );
    } catch (err) {
      handleError("Erreur lors de l'application de la carte-cadeau", err);
    } finally {
      setGiftCardLoading(false);
    }
  };

  const removeGiftCard = async () => {
    try {
      await homeService.removeGiftCard();
      await fetchCartData();
      showToast(
        "Carte-cadeau supprimée",
        "La carte-cadeau a été supprimée",
        "success"
      );
    } catch (err) {
      handleError("Erreur lors de la suppression de la carte-cadeau", err);
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      showToast(
        "Méthode de paiement requise",
        "Veuillez sélectionner une méthode de paiement",
        "error"
      );
      return;
    }

    const shippingAddress =
      selectedShippingAddress === "new"
        ? editingAddress
        : selectedShippingAddressData;

    if (!shippingAddress) {
      showToast(
        "Adresse requise",
        "Veuillez sélectionner ou ajouter une adresse de livraison",
        "error"
      );
      return;
    }

    // ✅ Enhanced shipping address validation
    const { isValid: shippingValid, missingFields: shippingMissing } =
      validateAddress(shippingAddress, customer?.customer_type, true);

    if (!shippingValid) {
      showToast(
        "Adresse de livraison incomplète",
        `Veuillez remplir : ${shippingMissing.join(", ")}`,
        "error"
      );
      return;
    }

    // ✅ REMOVED: Business validation that was causing the issue
    // We'll handle business data enhancement automatically below instead of requiring it

    // ✅ SMART BILLING ADDRESS HANDLING
    let billingAddress;
    if (useSameAddressForBilling) {
      // ✅ Use shipping address and enhance with customer business data if available
      billingAddress = {
        ...shippingAddress,
        // ✅ Enhance with customer business data if customer is business
        ...(customer?.customer_type === "business" && {
          company:
            shippingAddress.company ||
            customer?.business_name ||
            customer?.first_name + " " + customer?.last_name,
          business_registration_number:
            shippingAddress.business_registration_number ||
            customer?.business_registration_number ||
            "",
          vat_number: shippingAddress.vat_number || customer?.vat_number || "",
          fiscal_number: shippingAddress.fiscal_number || "",
          customer_type: "business",
        }),
        // ✅ For client customers, mark as client
        ...(customer?.customer_type === "client" && {
          customer_type: "client",
        }),
      };
    } else {
      // ✅ SEPARATE BILLING ADDRESS - Enhanced validation
      const requiredBillingFields = [
        "first_name",
        "last_name",
        "street",
        "city",
        "postal_code",
        "phone",
      ];
      const missingBillingFields = requiredBillingFields.filter(
        (field) => !billingFormData[field]?.trim()
      );

      if (missingBillingFields.length > 0) {
        showToast(
          "Adresse de facturation incomplète",
          `Veuillez remplir : ${missingBillingFields.join(", ")}`,
          "error"
        );
        return;
      }

      // ✅ SMART BUSINESS VALIDATION for billing
      if (billingType === "business") {
        if (!billingFormData.company?.trim()) {
          showToast(
            "Nom de l'entreprise requis",
            "Veuillez entrer le nom de votre entreprise pour la facturation",
            "error"
          );
          return;
        }
      }

      billingAddress = {
        ...billingFormData,
        customer_type: billingType, // Include billing type (client or business)
      };
    }

    try {
      setSubmitting(true);

      // ✅ ENHANCED SHIPPING ADDRESS with customer business data
      const enhancedShippingAddress = {
        ...shippingAddress,
        // ✅ Always include customer type
        customer_type: customer?.customer_type,
        // ✅ For business customers, ensure business data is included with smart fallbacks
        ...(customer?.customer_type === "business" && {
          company:
            shippingAddress.company ||
            customer?.business_name ||
            `${customer?.first_name} ${customer?.last_name}`,
          business_registration_number:
            shippingAddress.business_registration_number ||
            customer?.business_registration_number ||
            "",
          vat_number: shippingAddress.vat_number || customer?.vat_number || "",
          fiscal_number: shippingAddress.fiscal_number || "",
        }),
      };

      const checkoutData = {
        customer_id: customer.id,
        shipping_address: enhancedShippingAddress,
        billing_address: billingAddress,
        payment_method: paymentMethod,
        special_note: specialNote,
      };

      console.log("=== CHECKOUT DATA DEBUG ===");
      console.log("Customer Type:", customer?.customer_type);
      console.log("Original Shipping Address:", shippingAddress);
      console.log("Enhanced Shipping Address:", enhancedShippingAddress);
      console.log("Billing Address:", billingAddress);
      console.log("Use Same Address:", useSameAddressForBilling);
      console.log("============================");

      const result = await homeService.checkout(checkoutData);

      if (
        result.payment_link &&
        paymentMethod === PAYMENT_METHODS.CREDIT_CARD
      ) {
        window.location.href = result.payment_link;
      } else {
        showToast(
          "Commande passée avec succès!",
          `Numéro de commande: ${result.order_number}`,
          "success"
        );
        navigate(`/order-success/${result.order_id}`);
      }
    } catch (err) {
      handleError("Échec du paiement", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Utility functions
  const showToast = (title, description, status) => {
    toast({
      title,
      description,
      status,
      duration: status === "error" ? 5000 : 3000,
      isClosable: true,
    });
  };

  const handleError = (title, error) => {
    console.error(title, error);
    showToast(title, error.message || "Une erreur s'est produite.", "error");
  };

  const renderAddressForm = () => (
    <VStack spacing={4} align="stretch">
      <FormControl>
        <FormLabel fontSize="sm">Étiquette d'adresse (facultatif)</FormLabel>
        <Input
          value={editingAddress?.label || ""}
          onChange={(e) =>
            setEditingAddress((prev) => ({ ...prev, label: e.target.value }))
          }
          placeholder="e.g., Home, Office, Main Address"
          size="sm"
        />
      </FormControl>

      <Grid templateColumns="1fr 1fr 1fr" gap={4}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Prénom</FormLabel>
          <Input
            value={editingAddress?.first_name || ""}
            onChange={(e) =>
              setEditingAddress((prev) => ({
                ...prev,
                first_name: e.target.value,
              }))
            }
            size="sm"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Nom de famille</FormLabel>
          <Input
            value={editingAddress?.last_name || ""}
            onChange={(e) =>
              setEditingAddress((prev) => ({
                ...prev,
                last_name: e.target.value,
              }))
            }
            size="sm"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Téléphone</FormLabel>
          <Input
            value={editingAddress?.phone || ""}
            onChange={(e) =>
              setEditingAddress((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Entrez le numéro de téléphone"
            size="sm"
          />
        </FormControl>
      </Grid>

      {/* ✅ BUSINESS FIELDS FOR SHIPPING ADDRESS */}
      {customer?.customer_type === "business" && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
            Informations sur l'entreprise
          </Text>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Nom de l'entreprise</FormLabel>
              <Input
                value={editingAddress?.company || ""}
                onChange={(e) =>
                  setEditingAddress((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Entrez le nom de l'entreprise"
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Numéro d'enregistrement</FormLabel>
              <Input
                value={editingAddress?.business_registration_number || ""}
                onChange={(e) =>
                  setEditingAddress((prev) => ({
                    ...prev,
                    business_registration_number: e.target.value,
                  }))
                }
                placeholder="Entrez le numéro d'enregistrement"
                size="sm"
              />
            </FormControl>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap={4} mt={3}>
            <FormControl>
              <FormLabel fontSize="sm">Numéro de TVA</FormLabel>
              <Input
                value={editingAddress?.vat_number || ""}
                onChange={(e) =>
                  setEditingAddress((prev) => ({
                    ...prev,
                    vat_number: e.target.value,
                  }))
                }
                placeholder="Entrez le numéro de TVA"
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Numéro fiscal</FormLabel>
              <Input
                value={editingAddress?.fiscal_number || ""}
                onChange={(e) =>
                  setEditingAddress((prev) => ({
                    ...prev,
                    fiscal_number: e.target.value,
                  }))
                }
                placeholder="Entrez le numéro fiscal"
                size="sm"
              />
            </FormControl>
          </Grid>
        </Box>
      )}

      <Grid templateColumns="1fr 1fr" gap={4}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Ville</FormLabel>
          <Input
            value={editingAddress?.city || ""}
            onChange={(e) =>
              setEditingAddress((prev) => ({ ...prev, city: e.target.value }))
            }
            size="sm"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Adresse de la rue</FormLabel>
          <Input
            value={editingAddress?.street || ""}
            onChange={(e) => {
              setEditingAddress((prev) => ({
                ...prev,
                street: e.target.value,
              }));
            }}
            size="sm"
          />
        </FormControl>
      </Grid>

      <Grid templateColumns="1fr 1fr" gap={4}>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Code Postal</FormLabel>
          <Input
            value={editingAddress?.postal_code || ""}
            onChange={(e) =>
              setEditingAddress((prev) => ({
                ...prev,
                postal_code: e.target.value,
              }))
            }
            size="sm"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm">Pays</FormLabel>
          <Select
            value={editingAddress?.country || "France"}
            onChange={(e) =>
              setEditingAddress((prev) => ({
                ...prev,
                country: e.target.value,
              }))
            }
            size="sm"
            bg="gray.50"
          >
            <option value="France">France</option>
          </Select>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Actuellement, nous livrons uniquement en France
          </Text>
        </FormControl>
      </Grid>

      <HStack>
        <Button
          size="sm"
          color="rgb(99, 115, 129)"
          rounded="50px"
          border="1px solid rgba(145, 158, 171, 0.2)"
          p="18px 18px"
          bg="#fff"
          fontWeight={"500"}
          fontFamily="Airbnb Cereal VF"
          onClick={saveAddress}
          isLoading={submitting}
        >
          {addressMode === ADDRESS_MODES.ADD
            ? "Ajouter une adresse"
            : "Mettre à jour l'adresse"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          color="gray.600"
          fontWeight="400"
          onClick={() => setAddressMode(ADDRESS_MODES.VIEW)}
        >
          Annuler
        </Button>
      </HStack>
    </VStack>
  );

  const renderAddressSelector = () => (
    <Box>
      <Text fontSize="sm" color="gray.600" mb={3}>
        Select an address from your saved addresses: (
        {customer?.addresses?.length || 0} addresses)
      </Text>

      {/* Show loading state during refresh */}
      {submitting && (
        <Box mb={3} p={2} bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.600">
            Mise à jour des adresses...
          </Text>
        </Box>
      )}

      <RadioGroup
        value={selectedShippingAddress}
        onChange={handleAddressSelection}
        mb={4}
      >
        <Stack spacing={3}>
          {customer?.addresses?.map((address, idx) => (
            <Radio
              key={`address-${address.id || address.label || idx}-${
                customer?.addresses?.length
              }`}
              value={address.id || address.label}
            >
              <Box>
                <Text fontWeight="semibold">
                  {address.label || `Address ${idx + 1}`}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {formatAddress(address)}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  Téléphone: {address.phone || customer.phone_primary}
                </Text>
              </Box>
            </Radio>
          ))}
        </Stack>
      </RadioGroup>

      <HStack>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setAddressMode(ADDRESS_MODES.VIEW)}
        >
          Annuler
        </Button>
        <Button
          size="sm"
          colorScheme="orange"
          onClick={handleManualRefresh}
          isLoading={submitting}
        >
          Actualiser la liste
        </Button>
        <Button
          size="sm"
          colorScheme="green"
          onClick={() => {
            setEditingAddress(createEmptyAddress());
            setSelectedShippingAddress("new");
            setAddressMode(ADDRESS_MODES.ADD);
          }}
        >
          Ajouter une nouvelle adresse
        </Button>
      </HStack>
    </Box>
  );

  // Enhanced address summary with better error handling
  const renderAddressSummary = () => {
    const currentAddress = selectedShippingAddressData;

    if (!currentAddress && selectedShippingAddress !== "new") {
      return (
        <Box
          p={4}
          border="1px"
          borderColor="red.200"
          borderRadius="md"
          bg="red.50"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="semibold" color="red.600">
              Adresse non trouvée
            </Text>
            <Text fontSize="sm" color="red.500">
              L'adresse sélectionnée n'a pas pu être chargée. Veuillez
              sélectionner une autre adresse ou en ajouter une nouvelle.
            </Text>
            <HStack>
              <Button
                size="sm"
                colorScheme="orange"
                onClick={() => setAddressMode(ADDRESS_MODES.CHOOSE)}
              >
                Choisir une adresse
              </Button>
              <Button
                size="sm"
                colorScheme="green"
                onClick={handleAddNewAddress}
              >
                Ajouter une nouvelle adresse
              </Button>
            </HStack>
          </VStack>
        </Box>
      );
    }

    if (selectedShippingAddress === "new" || !currentAddress) {
      return (
        <Box
          p={4}
          border="1px"
          borderColor="orange.200"
          borderRadius="md"
          bg="orange.50"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="semibold" color="orange.600">
              New address required
            </Text>
            <Text fontSize="sm" color="orange.500">
              Please fill in the address form below to continue.
            </Text>
          </VStack>
        </Box>
      );
    }

    return (
      <Box
        p={4}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="gray.50"
      >
        <VStack align="start" spacing={2}>
          <Text fontWeight="semibold">
            {customer?.customer_type === "business"
              ? customer?.business_name ||
                `${customer?.first_name} ${customer?.last_name}`
              : `${customer?.first_name} ${customer?.last_name}`}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {formatAddress(currentAddress)}
          </Text>
          {customer?.customer_type === "business" &&
            customer?.business_registration_number && (
              <Text fontSize="sm" color="gray.500">
                Reg. Nr: {customer.business_registration_number}
              </Text>
            )}
          {customer?.customer_type === "business" && customer?.vat_number && (
            <Text fontSize="sm" color="gray.500">
              VAT: {customer.vat_number}
            </Text>
          )}
          <Text fontSize="sm" color="gray.500">
            Phone: {currentAddress?.phone || customer?.phone_primary}
          </Text>
        </VStack>
      </Box>
    );
  };

  const renderBillingForm = () => (
    <VStack spacing={4} align="stretch">
      {/* Client/Business Toggle */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
          Type de facturation
        </Text>
        <HStack spacing={4}>
          <Button
            size="sm"
            colorScheme={billingType === "client" ? "orange" : "gray"}
            variant={billingType === "client" ? "solid" : "outline"}
            onClick={() => setBillingType("client")}
            minW="100px"
          >
            Client
          </Button>
          <Button
            size="sm"
            colorScheme={billingType === "business" ? "orange" : "gray"}
            variant={billingType === "business" ? "solid" : "outline"}
            onClick={() => setBillingType("business")}
            minW="100px"
          >
            Entreprise
          </Button>
        </HStack>
      </Box>

      {/* Personal Information */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
          Informations personnelles{" "}
          <Text as="span" color="red.500">
            *
          </Text>
        </Text>
        <Grid templateColumns="1fr 1fr" gap={4}>
          <FormControl isRequired>
            <FormLabel fontSize="sm">
              Prénom{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              value={billingFormData.first_name}
              onChange={(e) =>
                setBillingFormData((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
              size="sm"
              placeholder="Prénom requis"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="sm">
              Nom{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              value={billingFormData.last_name}
              onChange={(e) =>
                setBillingFormData((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
              size="sm"
              placeholder="Nom requis"
            />
          </FormControl>
        </Grid>

        <FormControl isRequired mt={3}>
          <FormLabel fontSize="sm">
            Téléphone{" "}
            <Text as="span" color="red.500">
              *
            </Text>
          </FormLabel>
          <Input
            value={billingFormData.phone}
            onChange={(e) =>
              setBillingFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Téléphone requis"
            size="sm"
          />
        </FormControl>
      </Box>

      {/* Business Information - Show only if business type is selected */}
      {billingType === "business" && (
        <Box>
          <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
            Informations sur l'entreprise{" "}
            <Text as="span" color="red.500">
              *
            </Text>
          </Text>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">
                Nom de l'entreprise{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </FormLabel>
              <Input
                value={billingFormData.company}
                onChange={(e) =>
                  setBillingFormData((prev) => ({
                    ...prev,
                    company: e.target.value,
                  }))
                }
                placeholder="Nom de l'entreprise requis"
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Numéro d'enregistrement</FormLabel>
              <Input
                value={billingFormData.business_registration_number}
                onChange={(e) =>
                  setBillingFormData((prev) => ({
                    ...prev,
                    business_registration_number: e.target.value,
                  }))
                }
                placeholder="Numéro d'enregistrement"
                size="sm"
              />
            </FormControl>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap={4} mt={3}>
            <FormControl>
              <FormLabel fontSize="sm">Numéro de TVA</FormLabel>
              <Input
                value={billingFormData.vat_number}
                onChange={(e) =>
                  setBillingFormData((prev) => ({
                    ...prev,
                    vat_number: e.target.value,
                  }))
                }
                placeholder="Numéro de TVA"
                size="sm"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Numéro fiscal</FormLabel>
              <Input
                value={billingFormData.fiscal_number}
                onChange={(e) =>
                  setBillingFormData((prev) => ({
                    ...prev,
                    fiscal_number: e.target.value,
                  }))
                }
                placeholder="Numéro fiscal"
                size="sm"
              />
            </FormControl>
          </Grid>
        </Box>
      )}

      {/* Address Information */}
      <Box>
        <Text fontSize="sm" fontWeight="semibold" mb={3} color="gray.700">
          Adresse de facturation{" "}
          <Text as="span" color="red.500">
            *
          </Text>
        </Text>
        <Grid templateColumns="1fr 1fr" gap={4}>
          <FormControl isRequired>
            <FormLabel fontSize="sm">
              Ville{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              value={billingFormData.city}
              onChange={(e) =>
                setBillingFormData((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              size="sm"
              placeholder="Ville requise"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="sm">
              Adresse de la rue{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              value={billingFormData.street}
              onChange={(e) =>
                setBillingFormData((prev) => ({
                  ...prev,
                  street: e.target.value,
                }))
              }
              size="sm"
              placeholder="Adresse requise"
            />
          </FormControl>
        </Grid>

        <Grid templateColumns="1fr 1fr" gap={4} mt={3}>
          <FormControl isRequired>
            <FormLabel fontSize="sm">
              Code Postal{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Input
              value={billingFormData.postal_code}
              onChange={(e) =>
                setBillingFormData((prev) => ({
                  ...prev,
                  postal_code: e.target.value,
                }))
              }
              size="sm"
              placeholder="Code postal requis"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize="sm">
              
              {" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </FormLabel>
            <Select
              value={billingFormData.country}
              onChange={(e) =>
                setBillingFormData((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
              }
              size="sm"
              bg="gray.50"
            >
              <option value="France">France</option>
            </Select>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Actuellement, nous livrons uniquement en France
            </Text>
          </FormControl>
        </Grid>
      </Box>

      {/* Validation Summary */}
      <Box
        p={3}
        bg="blue.50"
        borderRadius="md"
        border="1px solid"
        borderColor="blue.200"
      >
        <Text fontSize="xs" color="blue.700">
          <Text as="span" color="red.500">
            *
          </Text>{" "}
          Champs obligatoires.
          {billingType === "business" &&
            " Le nom de l'entreprise est requis pour la facturation d'entreprise."}
        </Text>
      </Box>
    </VStack>
  );

  const renderBillingSummary = () => {
    if (!useSameAddressForBilling) {
      const hasRequiredData =
        billingFormData.first_name &&
        billingFormData.last_name &&
        billingFormData.street &&
        billingFormData.city;

      if (!hasRequiredData) {
        return (
          <Box
            p={4}
            border="1px"
            borderColor="orange.200"
            borderRadius="md"
            bg="orange.50"
          >
            <Text fontWeight="semibold" color="orange.600" mb={2}>
              Veuillez remplir les informations de facturation
            </Text>
            <Text fontSize="sm" color="orange.500">
              Remplissez le formulaire de facturation ci-dessous pour continuer
              votre commande.
            </Text>
          </Box>
        );
      }

      return (
        <Box
          p={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="gray.50"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="semibold">
              {billingType === "business" && billingFormData.company
                ? billingFormData.company
                : `${billingFormData.first_name} ${billingFormData.last_name}`}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {billingFormData.street}, {billingFormData.city},{" "}
              {billingFormData.postal_code}, {billingFormData.country}
            </Text>
            {billingType === "business" && (
              <>
                {billingFormData.business_registration_number && (
                  <Text fontSize="sm" color="gray.500">
                    Numéro d'enregistrement:{" "}
                    {billingFormData.business_registration_number}
                  </Text>
                )}
                {billingFormData.vat_number && (
                  <Text fontSize="sm" color="gray.500">
                    TVA: {billingFormData.vat_number}
                  </Text>
                )}
                {billingFormData.fiscal_number && (
                  <Text fontSize="sm" color="gray.500">
                    Numéro fiscal: {billingFormData.fiscal_number}
                  </Text>
                )}
              </>
            )}
            <Text fontSize="sm" color="gray.500">
              Téléphone: {billingFormData.phone}
            </Text>
          </VStack>
        </Box>
      );
    }

    // ✅ ENHANCED: When using same address, show enhanced business data
    const currentAddress = selectedShippingAddressData;

    if (!currentAddress && selectedShippingAddress !== "new") {
      return (
        <Box
          p={4}
          border="1px"
          borderColor="red.200"
          borderRadius="md"
          bg="red.50"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="semibold" color="red.600">
              Adresse non trouvée
            </Text>
            <Text fontSize="sm" color="red.500">
              L'adresse sélectionnée n'a pas pu être chargée pour la
              facturation.
            </Text>
          </VStack>
        </Box>
      );
    }

    if (selectedShippingAddress === "new" || !currentAddress) {
      return (
        <Box
          p={4}
          border="1px"
          borderColor="orange.200"
          borderRadius="md"
          bg="orange.50"
        >
          <VStack align="start" spacing={2}>
            <Text fontWeight="semibold" color="orange.600">
              Même adresse que la livraison
            </Text>
            <Text fontSize="sm" color="orange.500">
              L'adresse de facturation sera la même que l'adresse de livraison.
            </Text>
          </VStack>
        </Box>
      );
    }

    // ✅ ENHANCED: Show business data from customer profile when using same address
    const displayBusinessName =
      currentAddress.company || customer?.business_name || "";
    const displayBusinessReg =
      currentAddress.business_registration_number ||
      customer?.business_registration_number ||
      "";
    const displayVatNumber =
      currentAddress.vat_number || customer?.vat_number || "";

    return (
      <Box
        p={4}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        bg="gray.50"
      >
        <VStack align="start" spacing={2}>
          <Text fontWeight="semibold">
            {customer?.customer_type === "business" && displayBusinessName
              ? displayBusinessName
              : `${customer?.first_name} ${customer?.last_name}`}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {formatAddress(currentAddress)}
          </Text>

          {/* ✅ Show business data for business customers */}
          {customer?.customer_type === "business" && (
            <>
              {displayBusinessReg && (
                <Text fontSize="sm" color="gray.500">
                  Reg. Nr: {displayBusinessReg}
                </Text>
              )}
              {displayVatNumber && (
                <Text fontSize="sm" color="gray.500">
                  VAT: {displayVatNumber}
                </Text>
              )}
              {currentAddress?.fiscal_number && (
                <Text fontSize="sm" color="gray.500">
                  Fiscal Nr: {currentAddress.fiscal_number}
                </Text>
              )}
            </>
          )}

          <Text fontSize="sm" color="gray.500">
            Phone: {currentAddress?.phone || customer?.phone_primary}
          </Text>

          {/* ✅ Show billing type indicator */}
          <Badge
            colorScheme={
              customer?.customer_type === "business" ? "blue" : "green"
            }
            size="sm"
          >
            Facturation:{" "}
            {customer?.customer_type === "business"
              ? "Entreprise"
              : "Particulier"}
          </Badge>
        </VStack>
      </Box>
    );
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <Container maxW="7xl" py={8}>
          <VStack spacing={6} align="center" py={20}>
            <Spinner size="xl" />
            <Text>Chargement du paiement...</Text>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  // Empty cart state
  if (!cartData?.items?.length) {
    return (
      <>
        <Navbar />
        <Container maxW="6xl" py={8}>
          <VStack spacing={8} align="center" py={20}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.600">
              Votre panier est vide.
            </Text>
            <Button colorScheme="orange" onClick={() => navigate("/")}>
              Continuer vos achats
            </Button>
          </VStack>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Box bg="rgba(252, 252, 253, 1)" minH="calc(100vh - 200px)">
        <Container maxW="7xl" py={8}>
          {error && (
            <Alert status="error" mb={6} borderRadius="xl">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
            {/* Left Column - Checkout Form */}
            <VStack spacing={6} align="stretch">
              <Accordion defaultIndex={[0]} allowMultiple>
                {/* Shipping and Billing Section */}
                <AccordionItem
                  bg="white"
                  borderRadius="xl"
                  border="1px solid rgba(145, 158, 171, 0.2)"
                >
                  <AccordionButton py={4} px={6}>
                    <HStack spacing={4} flex={1}>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="bold" color="gray.800">
                          Expédition et facturation
                        </Text>
                      </VStack>
                      <Spacer />

                      {hasAddresses && (
                        <>
                          <Button
                            size="sm"
                            color="rgba(223, 240, 255, 1)"
                            rounded="10px"
                            border="1px solid rgba(148, 145, 171, 0.2)"
                            p="18px 18px"
                            bg="#3167a8ff"
                            _hover={{ color: "white" }}
                            fontWeight={"500"}
                            fontFamily="Airbnb Cereal VF"
                            leftIcon={<FaEdit />}
                            onClick={handleEditAddress}
                            isDisabled={
                              !selectedShippingAddressData ||
                              selectedShippingAddress === "new"
                            }
                          >
                            Modifier l'adresse
                          </Button>
                          <Button
                            size="sm"
                            color="rgba(223, 240, 255, 1)"
                            rounded="10px"
                            border="1px solid rgba(148, 145, 171, 0.2)"
                            p="18px 18px"
                            bg="#3167a8ff"
                            _hover={{ color: "white" }}
                            fontWeight={"500"}
                            fontFamily="Airbnb Cereal VF"
                            onClick={() => setAddressMode(ADDRESS_MODES.CHOOSE)}
                          >
                            Choisir une autre adresse (
                            {customer?.addresses?.length})
                          </Button>
                        </>
                      )}

                      <Button
                        size="sm"
                        color="rgba(223, 240, 255, 1)"
                        rounded="10px"
                        border="1px solid rgba(148, 145, 171, 0.2)"
                        p="18px 18px"
                        bg="#3167a8ff"
                        _hover={{ color: "white" }}
                        fontWeight={"500"}
                        fontFamily="Airbnb Cereal VF"
                        onClick={handleAddNewAddress}
                      >
                        Ajouter une nouvelle adresse
                      </Button>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel px={6} pb={6}>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <Text fontWeight="semibold" mb={4} color="gray.700">
                          Adresse de livraison:
                        </Text>

                        {addressMode === ADDRESS_MODES.CHOOSE
                          ? renderAddressSelector()
                          : addressMode === ADDRESS_MODES.EDIT ||
                            addressMode === ADDRESS_MODES.ADD
                          ? renderAddressForm()
                          : renderAddressSummary()}
                      </Box>

                      {/* Billing Address */}
                      <Box>
                        <Text fontWeight="semibold" mb={4} color="gray.700">
                          Adresse de facturation:
                        </Text>
                        <Checkbox
                          isChecked={useSameAddressForBilling}
                          onChange={(e) => {
                            setUseSameAddressForBilling(e.target.checked);
                            if (e.target.checked) {
                              // Reset billing form when using same address
                              setBillingFormData((prev) => ({
                                ...prev,
                                first_name: customer?.first_name || "",
                                last_name: customer?.last_name || "",
                                phone: customer?.phone_primary || "",
                              }));
                            }
                          }}
                          mb={4}
                        >
                          <Text fontSize="sm">Facturer à la même adresse</Text>
                        </Checkbox>

                        {!useSameAddressForBilling
                          ? renderBillingForm()
                          : renderBillingSummary()}
                      </Box>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>

                {/* Payment Method Section */}
                <AccordionItem
                  bg="white"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.200"
                  mt={4}
                >
                  <AccordionButton py={4} px={6}>
                    <HStack spacing={4} flex={1}>
                      <Box
                        w={8}
                        h={8}
                        borderRadius="full"
                        bg={paymentMethod ? "green.500" : "gray.300"}
                        color="white"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        {paymentMethod ? <FaCheck /> : "2"}
                      </Box>
                      <Text fontWeight="bold" color="gray.800">
                        Mode de paiement
                      </Text>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel px={6} pb={6}>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      Choisissez le mode de paiement
                    </Text>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                    >
                      <Stack spacing={4}>
                        <Box
                          p={4}
                          border="2px"
                          borderColor={
                            paymentMethod === PAYMENT_METHODS.CREDIT_CARD
                              ? "orange.500"
                              : "gray.200"
                          }
                          borderRadius="md"
                        >
                          <Radio value={PAYMENT_METHODS.CREDIT_CARD}>
                            <HStack spacing={3}>
                              <Icon as={FaCreditCard} color="blue.500" />
                              <Text fontWeight="semibold">
                                Payer en ligne (carte de crédit - Stripe)
                              </Text>
                            </HStack>
                          </Radio>
                          {paymentMethod === PAYMENT_METHODS.CREDIT_CARD && (
                            <Box mt={3} pl={6}>
                              <Alert status="info" size="sm" borderRadius="md">
                                <AlertIcon />
                                <Text fontSize="sm">
                                  Paiement sécurisé avec Stripe. Vous serez
                                  redirigé pour finaliser le paiement.
                                </Text>
                              </Alert>
                            </Box>
                          )}
                        </Box>

                        <Box
                          p={4}
                          border="2px"
                          borderColor={
                            paymentMethod === PAYMENT_METHODS.BANK_TRANSFER
                              ? "orange.500"
                              : "gray.200"
                          }
                          borderRadius="md"
                        >
                          <Radio value={PAYMENT_METHODS.BANK_TRANSFER}>
                            <HStack spacing={3}>
                              <Icon as={FaUniversity} color="green.500" />
                              <Text fontWeight="semibold">
                                Payer par virement bancaire
                              </Text>
                            </HStack>
                          </Radio>
                          {paymentMethod === PAYMENT_METHODS.BANK_TRANSFER && (
                            <Box mt={3} pl={6}>
                              <Alert status="info" size="sm" borderRadius="md">
                                <AlertIcon />
                                <Text fontSize="sm">
                                  Les détails du virement bancaire seront
                                  fournis après la confirmation de la commande.
                                </Text>
                              </Alert>
                            </Box>
                          )}
                        </Box>
                      </Stack>
                    </RadioGroup>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

              {/* Special Notes */}
              <Box
                bg="white"
                borderRadius="xl"
                p={6}
                border="1px"
                borderColor="gray.200"
              >
                <FormControl>
                  <FormLabel fontWeight="semibold" color="gray.700">
                    Si vous souhaitez laisser un commentaire, vous pouvez
                    l'écrire ici
                  </FormLabel>
                  <Textarea
                    value={specialNote}
                    onChange={(e) => setSpecialNote(e.target.value)}
                    placeholder="Entrez vos notes spéciales ici..."
                    rows={4}
                    resize="none"
                  />
                </FormControl>
              </Box>

              {/* Terms */}
              <Box bg="white" borderRadius="xl" p={6}>
                <Stack
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "stretch", md: "center" }}
                  spacing={4}
                >
                  {/* Left side - Terms text */}
                  <Text fontSize="sm" color="gray.600" flex="1">
                    En cliquant sur 'Acheter', j'accepte les Conditions
                    d'Utilisation.{" "}
                    <Text
                      as="span"
                      color="orange.500"
                      textDecoration="underline"
                      cursor="pointer"
                    >
                      Lire ici
                    </Text>
                  </Text>

                  {/* Right side - Submit Button */}
                  <Button
                    size="sm"
                    color="rgba(223, 240, 255, 1)"
                    rounded="10px"
                    border="1px solid rgba(148, 145, 171, 0.2)"
                    p="18px 18px"
                    bg="#3167a8ff"
                    _hover={{ color: "white" }}
                    fontWeight={"500"}
                    fontFamily="Airbnb Cereal VF"
                    onClick={handleCheckout}
                    isLoading={submitting}
                    loadingText="Traitement..."
                    isDisabled={!paymentMethod}
                    flexShrink={0}
                    w={{ base: "full", md: "auto" }}
                  >
                    Acheter
                  </Button>
                </Stack>
              </Box>
            </VStack>

            {/* Right Column - Order Summary */}
            <Box
              bg="white"
              borderRadius="xl"
              p={6}
              border="1px"
              borderColor="gray.200"
              h="fit-content"
            >
              <Text fontSize="xl" fontWeight="500" mb={6} color="gray.800">
                Total de la commande
              </Text>

              {/* Promotion Code */}
              <Box mb={6}>
                <Text fontSize="sm" fontWeight="500" mb={3} color="gray.700">
                  Code de réduction
                </Text>
                <InputGroup size="md">
                  <Input
                    placeholder="Nouveau code de réduction"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                    _focus={{ color: "black" }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={applyPromotion}
                      isLoading={promotionLoading}
                      isDisabled={!promotionCode.trim()}
                      bg="black"
                      color="white"
                      _hover={{ color: "white" }}
                      fontSize="xs"
                    >
                      Appliquer
                    </Button>
                  </InputRightElement>
                </InputGroup>

                {cartData.applied_promotion_code && (
                  <HStack
                    mt={2}
                    p={2}
                    bg="green.50"
                    borderRadius="md"
                    justify="space-between"
                  >
                    <HStack spacing={2}>
                      <FaTag color="green" size={12} />
                      <Text fontSize="sm" color="green.700">
                        {cartData.applied_promotion_code}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<FaTimes />}
                      size="xs"
                      onClick={removePromotion}
                      colorScheme="red"
                      variant="ghost"
                    />
                  </HStack>
                )}
              </Box>

              {/* Gift Card */}
              <Box mb={6}>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  mb={3}
                  color="gray.700"
                >
                  Cartes-cadeaux / Bons
                </Text>
                <InputGroup size="md">
                  <Input
                    placeholder="Cartes-cadeaux / Bons"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value)}
                    borderRadius="md"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                    _focus={{ borderColor: "orange.400", bg: "white" }}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={applyGiftCard}
                      isLoading={giftCardLoading}
                      isDisabled={!giftCardCode.trim()}
                      bg="black"
                      color="white"
                      _hover={{ color: "white" }}
                      fontSize="xs"
                    >
                      Appliquer
                    </Button>
                  </InputRightElement>
                </InputGroup>

                {cartData.applied_gift_card_code && (
                  <HStack
                    mt={2}
                    p={2}
                    bg="purple.50"
                    borderRadius="md"
                    justify="space-between"
                  >
                    <HStack spacing={2}>
                      <FaGift color="purple" size={12} />
                      <Text fontSize="sm" color="purple.700">
                        {cartData.applied_gift_card_code}
                      </Text>
                    </HStack>
                    <IconButton
                      icon={<FaTimes />}
                      size="xs"
                      onClick={removeGiftCard}
                      colorScheme="red"
                      variant="ghost"
                    />
                  </HStack>
                )}
              </Box>

              <Divider my={4} />

              {/* Summary Details */}
              <VStack spacing={3} align="stretch" mb={6}>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Total:
                  </Text>
                  <Text fontWeight="semibold">
                    {cartData.subtotal?.toFixed(2)} €
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">
                    Transport:
                  </Text>
                  <Text fontWeight="semibold">
                    {(cartData.shipping_fee || 0).toFixed(2)} €
                  </Text>
                </HStack>

                {/* {shippingOptions.length > 0 && (
                  <Box mt={4}>
                    <Text fontWeight="semibold" mb={2}>
                      Choisissez une option de livraison :
                    </Text>
                    <RadioGroup
                      value={selectedShippingOption?.shippingService?.id || ""}
                      onChange={(id) => {
                        const option = shippingOptions.find(
                          (opt) => String(opt.shippingService.id) === String(id)
                        );
                        setSelectedShippingOption(option);
                        setShippingFee(option?.cost || 0);
                      }}
                    >
                      <Stack>
                        {shippingOptions.map((opt) => (
                          <Radio
                            key={opt.shippingService.id}
                            value={String(opt.shippingService.id)}
                          >
                            {opt.shippingService.name} (
                            {opt.shippingService.delay}) - {opt.cost}€
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                    <Text mt={2} color="gray.600">
                      Frais de livraison sélectionnés : <b>{shippingFee} €</b>
                    </Text>
                  </Box>
                )} */}

                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600" fontStyle="italic">
                    TVA 20%
                  </Text>
                  <Text fontWeight="semibold" color="gray.600">
                    {(cartData.tax || 0).toFixed(2)} €
                  </Text>
                </HStack>

                {cartData.promotion_discount > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="gray.600">
                      Réduction promotionnelle:
                    </Text>
                    <Text fontWeight="semibold" color="gray.700">
                      -{cartData.promotion_discount.toFixed(2)} €
                    </Text>
                  </HStack>
                )}

                {cartData.gift_card_discount > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="purple.600">
                      Réduction de la carte-cadeau:
                    </Text>
                    <Text fontWeight="semibold" color="purple.600">
                      -{cartData.gift_card_discount.toFixed(2)} €
                    </Text>
                  </HStack>
                )}

                {cartData.shipping_discount > 0 && (
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="blue.600">
                      Réduction du transport:
                    </Text>
                    <Text fontWeight="semibold" color="blue.600">
                      -{cartData.shipping_discount.toFixed(2)} €
                    </Text>
                  </HStack>
                )}
              </VStack>

              <Divider my={4} />

              {/* Total */}
              <HStack justify="space-between" mb={6}>
                <Text fontSize="lg" fontWeight="500" color="gray.800">
                  Total:
                </Text>
                <Text fontSize="2xl" fontWeight="500" color="gray.900">
                  {cartData.total?.toFixed(2)} €
                </Text>
              </HStack>

              <Divider my={4} />

              {/* Products Summary */}
              <Text fontWeight="semibold" mb={4} color="gray.700">
                Produits dans le panier: ({cartData.items?.length})
              </Text>

              <VStack spacing={3} align="stretch">
                {cartData.items?.slice(0, 3).map((item) => (
                  <HStack key={item.id} spacing={3}>
                    <Image
                      src={
                        item.product_snapshot?.main_image_url ||
                        "/default-product.jpg"
                      }
                      alt={item.product_snapshot?.title}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                      bg="gray.100"
                    />
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontSize="sm" fontWeight="semibold" noOfLines={2}>
                        {item.product_snapshot?.title}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {item.quantity} x{" "}
                        {parseFloat(item.unit_price).toFixed(2)} €
                      </Text>
                    </VStack>
                    <Text fontSize="sm" fontWeight="bold">
                      {parseFloat(item.total_price).toFixed(2)} €
                    </Text>
                  </HStack>
                ))}

                {cartData.items?.length > 3 && (
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    ...and {cartData.items.length - 3} more items
                  </Text>
                )}
              </VStack>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default CheckoutPage;
