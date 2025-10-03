import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Select,
  IconButton,
  chakra,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Textarea,
  List,
  ListItem,
  FormHelperText,
  Grid,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaSyncAlt, FaSearch } from "react-icons/fa";
import { homeService } from "../home/services/homeService";
import SidebarContent from "../administration/layouts/SidebarContent";
import MobileNav from "../administration/layouts/MobileNav";
import { useAuth } from "../administration/authContext/authContext";
import { productService } from "../product/services/productService";

const initialFilters = {
  page: 1,
  limit: 20,
  status: "",
  payment_status: "",
  payment_method: "",
  customer_email: "",
  customer_name: "",
  order_number: "",
  fromDate: "",
  toDate: "",
  min_total: "",
  max_total: "",
  search: "",
};

export default function OrderList() {
  const { account, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState(initialFilters);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [creating, setCreating] = useState(false);

  // Customer search and selection
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [creatingCustomer, setCreatingCustomer] = useState(false);

  // Customer fields (for new or selected)
  const [customerFields, setCustomerFields] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    billing_address: "",
    shipping_address: "",
  });

  // Product search and item builder - EXACT SAME STRUCTURE AS CustomerProductPage
  const [orderItems, setOrderItems] = useState([
    {
      product: null,
      productId: "",
      productTitleInput: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      selectedOptions: [],
      customDimensions: {
        width: "",
        height: "",
        depth: "",
        length: "",
      },
      productOptions: [],
      product_snapshot: { title: "" },
      customOptions: [],
      pricingConfig: null,
      pricingBreakdown: null,
      selectedCustomOptions: {},
      pricingData: null,
      isCalculating: false,
      calculationError: "",
      // Remove dimensionTimeout: null
    },
  ]);

  // Order form (addresses, payment, etc.)
  const [orderForm, setOrderForm] = useState({
    billing_address: {
      label: "",
      street: "",
      city: "",
      postal_code: "",
      country: "",
      phone: "",
      company: "",
      first_name: "",
      last_name: "",
      is_default: true,
      vat_number: "",
      customer_type: "",
      fiscal_number: "",
      business_registration_number: "",
    },
    shipping_address: {
      label: "",
      street: "",
      city: "",
      postal_code: "",
      country: "",
      phone: "",
      company: "",
      first_name: "",
      last_name: "",
      is_default: true,
      vat_number: "",
      customer_type: "",
      fiscal_number: "",
      business_registration_number: "",
    },
    payment_method: "bank_transfer",
    payment_status: "pending",
    status: "pending",
    special_note: "",
  });

  // Fetch orders
  const fetchOrders = async (params = {}) => {
    setOrderLoading(true);
    try {
      const res = await homeService.getAllOrders({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...filters,
        ...params.filters,
      });
      setOrders(res.orders || []);
      setPagination(
        res.pagination || { page: 1, limit: 20, totalPages: 1, total: 0 }
      );
    } catch (error) {
      toast({
        title: "Error loading orders.",
        description: error?.message || "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setOrders([]);
      setPagination({ page: 1, limit: 20, totalPages: 1, total: 0 });
    } finally {
      setOrderLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle search/filter submit
  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders({ page: 1 });
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    fetchOrders({ page: newPage });
  };

  // --- Customer Search & Creation ---
  const handleCustomerSearch = async () => {
    if (!customerSearch.trim()) {
      setCustomerResults([]);
      return;
    }
    setCustomerSearchLoading(true);
    try {
      const res = await homeService.getAllCustomers({
        search: customerSearch.trim(),
        limit: 10,
      });
      const customers = res.data || res.customers || [];
      setCustomerResults(customers);
    } catch {
      setCustomerResults([]);
    } finally {
      setCustomerSearchLoading(false);
    }
  };

  const handleSelectCustomer = async (cust) => {
    setSelectedCustomer(cust);
    setCustomerSearch(`${cust.first_name} ${cust.last_name} (${cust.email})`);
    setCustomerResults([]);
    setCreatingCustomer(false);

    try {
      const res = await homeService.getCustomerById(cust.id);
      const customer = res.data || res.customer || cust;

      let billing = null;
      let shipping = null;

      if (Array.isArray(customer.addresses)) {
        const defaultBilling = customer.addresses.find(
          (a) =>
            a.is_default && a.label && a.label.toLowerCase().includes("bill")
        );
        const defaultShipping = customer.addresses.find(
          (a) =>
            a.is_default && a.label && a.label.toLowerCase().includes("ship")
        );
        const anyDefault = customer.addresses.find((a) => a.is_default);

        billing = defaultBilling || anyDefault || null;
        shipping = defaultShipping || anyDefault || null;
      } else {
        billing = customer.default_billing_address || null;
        shipping = customer.default_shipping_address || null;
      }

      setCustomerFields({
        email: customer.email || "",
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone_primary || customer.phone || "",
        billing_address: billing || {},
        shipping_address: shipping || {},
      });

      setOrderForm((prev) => ({
        ...prev,
        billing_address: billing || {
          label: "",
          street: "",
          city: "",
          postal_code: "",
          country: "",
          phone: "",
          company: "",
          first_name: "",
          last_name: "",
          is_default: true,
          vat_number: "",
          customer_type: "",
          fiscal_number: "",
          business_registration_number: "",
        },
        shipping_address: shipping || {
          label: "",
          street: "",
          city: "",
          postal_code: "",
          country: "",
          phone: "",
          company: "",
          first_name: "",
          last_name: "",
          is_default: true,
          vat_number: "",
          customer_type: "",
          fiscal_number: "",
          business_registration_number: "",
        },
      }));
    } catch {
      setCustomerFields({
        email: cust.email || "",
        first_name: cust.first_name || "",
        last_name: cust.last_name || "",
        phone: cust.phone_primary || cust.phone || "",
        billing_address: {},
        shipping_address: {},
      });
      setOrderForm((prev) => ({
        ...prev,
        billing_address: {
          label: "",
          street: "",
          city: "",
          postal_code: "",
          country: "",
          phone: "",
          company: "",
          first_name: "",
          last_name: "",
          is_default: true,
          vat_number: "",
          customer_type: "",
          fiscal_number: "",
          business_registration_number: "",
        },
        shipping_address: {
          label: "",
          street: "",
          city: "",
          postal_code: "",
          country: "",
          phone: "",
          company: "",
          first_name: "",
          last_name: "",
          is_default: true,
          vat_number: "",
          customer_type: "",
          fiscal_number: "",
          business_registration_number: "",
        },
      }));
    }
  };

  function formatAddress(addr) {
    if (!addr) return "";
    return [
      addr.label,
      addr.street,
      addr.street2,
      addr.city,
      addr.postal_code,
      addr.country,
      addr.phone,
    ]
      .filter(Boolean)
      .join(", ");
  }

  const handleCustomerFieldsChange = (e) => {
    const { name, value } = e.target;
    setCustomerFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Product Search & Item Builder ---
  const handleProductSearch = useCallback(
    async (idx, query) => {
      if (!query || query.length < 2) {
        setOrderItems((prev) =>
          prev.map((item, i) =>
            i === idx ? { ...item, productOptions: [] } : item
          )
        );
        return;
      }
      try {
        const res = await homeService.searchProducts({ q: query, limit: 10 });
        let products = [];
        if (Array.isArray(res.products)) products = res.products;
        else if (Array.isArray(res.results)) products = res.results;
        else if (Array.isArray(res.data?.products))
          products = res.data.products;
        else if (Array.isArray(res.data?.results)) products = res.data.results;
        else if (Array.isArray(res.data)) products = res.data;
        setOrderItems((prev) =>
          prev.map((item, i) =>
            i === idx ? { ...item, productOptions: products } : item
          )
        );
      } catch (err) {
        setOrderItems((prev) =>
          prev.map((item, i) =>
            i === idx ? { ...item, productOptions: [] } : item
          )
        );
        toast({
          title: "Product search failed",
          description: err?.message || "Could not fetch products.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const calculatePricing = useCallback(
    async (itemIndex) => {
      // Get the current item state directly from the function parameter
      setOrderItems((prev) => {
        const currentItems = [...prev];
        const item = currentItems[itemIndex];

        if (!item?.productId) return prev;

        // Set calculating state
        currentItems[itemIndex] = {
          ...item,
          isCalculating: true,
          calculationError: "",
        };

        // Perform calculation asynchronously
        const performCalculation = async () => {
          try {
            const config = {
              dimensions: item.customDimensions,
              selectedOptions: homeService.formatSelectedOptionsForAPI(
                item.selectedCustomOptions
              ),
              quantity: item.quantity,
            };

            const response = await homeService.calculateProductPricing(
              item.productId,
              config
            );

            if (response.success) {
              const finalPrice = response.pricing?.final?.unit_price_gross || 0;
              const totalPrice = finalPrice * item.quantity;

              setOrderItems((prevItems) =>
                prevItems.map((it, i) =>
                  i === itemIndex
                    ? {
                        ...it,
                        pricingData: response,
                        unit_price: finalPrice,
                        total_price: totalPrice,
                        pricingBreakdown: response.pricing,
                        isCalculating: false,
                      }
                    : it
                )
              );
            }
          } catch (error) {
            setOrderItems((prevItems) =>
              prevItems.map((it, i) =>
                i === itemIndex
                  ? {
                      ...it,
                      pricingData: null,
                      unit_price: 0,
                      total_price: 0,
                      pricingBreakdown: null,
                      isCalculating: false,
                      calculationError:
                        error.message || "Pricing calculation failed",
                    }
                  : it
              )
            );
          }
        };

        // Execute calculation
        performCalculation();

        return currentItems;
      });
    },
    [] // Remove orderItems dependency
  );

  const handleDimensionChange = useCallback(
    (itemIndex, dimension, value) => {

      setOrderItems((prev) => {
        const newItems = prev.map((item, i) =>
          i === itemIndex
            ? {
                ...item,
                customDimensions: {
                  ...item.customDimensions,
                  [dimension]: value,
                },
              }
            : item
        );

        // Debounce pricing calculation - only if we have a valid value
        if (value && value.trim() !== "") {
          setTimeout(() => {
            calculatePricing(itemIndex);
          }, 800);
        }

        return newItems;
      });
    },
    [calculatePricing]
  );

  const handleQuantityChange = useCallback(
    (itemIndex, newQuantity) => {
      setOrderItems((prev) => {
        const currentItems = [...prev];
        const item = currentItems[itemIndex];
        const parsedQuantity = parseInt(newQuantity) || 1;

        // Get constraints from pricing config
        const minOrderQty =
          item.pricingConfig?.quantity_constraints?.min_order_quantity || 1;
        const maxOrderQty =
          item.pricingConfig?.quantity_constraints?.max_order_quantity || 9999;

        if (parsedQuantity < minOrderQty) {
          currentItems[itemIndex] = {
            ...item,
            calculationError: `La quantité minimum de commande est ${minOrderQty}`,
          };
          return currentItems;
        }

        if (parsedQuantity > maxOrderQty) {
          currentItems[itemIndex] = {
            ...item,
            calculationError: `La quantité maximale de commande est ${maxOrderQty}`,
          };
          return currentItems;
        }

        currentItems[itemIndex] = {
          ...item,
          calculationError: "",
          quantity: parsedQuantity,
        };

        // Trigger pricing calculation after quantity change
        setTimeout(() => {
          calculatePricing(itemIndex);
        }, 300);

        return currentItems;
      });
    },
    [calculatePricing]
  );

  const handleSelectProduct = async (idx, product) => {
    try {

      const productRes = await productService.getProductById(product.id);
      const fullProduct =
        productRes.data?.data?.product || productRes.data || product;


      const configRes = await homeService.getProductPricingConfig(
        fullProduct.id
      );
      const pricingConfig = configRes.data || configRes || {};

      

      const customOptions = pricingConfig.custom_options || [];

      const initialSelectedCustomOptions = {};
      customOptions.forEach((option) => {
        const defaultValue = option.option_values?.find(
          (val) => val.is_default
        );
        if (defaultValue) {
          initialSelectedCustomOptions[option.id] = {
            valueId: defaultValue.id,
            value: defaultValue.option_value,
            price_modifier: defaultValue.price_modifier,
            price_modifier_type: defaultValue.price_modifier_type,
          };
        }
      });

      const initialCustomDimensions = {
        width: "",
        height: "",
        depth: "",
        length: "",
      };

      const dimensionConstraints = {};
      if (
        pricingConfig.required_dimensions &&
        pricingConfig.required_dimensions.length > 0
      ) {
        pricingConfig.required_dimensions.forEach((dim) => {
          dimensionConstraints[dim] = {
            min: fullProduct[`min_${dim}`] || 0,
            max: fullProduct[`max_${dim}`] || null,
            unit: fullProduct.measures_unit || "cm",
          };
        });
      }


      const enhancedPricingConfig = {
        ...pricingConfig,
        dimension_constraints: dimensionConstraints,
      };


      setOrderItems((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                product: fullProduct,
                productId: fullProduct.id,
                productTitleInput: fullProduct.title,
                customOptions,
                selectedCustomOptions: initialSelectedCustomOptions,
                customDimensions: initialCustomDimensions,
                quantity: 1,
                unit_price: 0,
                total_price: 0,
                pricingConfig: enhancedPricingConfig,
                product_snapshot: fullProduct,
                productOptions: [],
                pricingBreakdown: null,
                pricingData: null,
                isCalculating: false,
                calculationError: "",
                // Remove dimensionTimeout: null
              }
            : item
        )
      );

      // Calculate initial pricing after product selection
      setTimeout(() => {
        calculatePricing(idx);
      }, 100);
    } catch (err) {
      toast({
        title: "Failed to load product details",
        description: err?.message || "Unknown error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleCustomOptionChange = useCallback(
    (
      idx,
      optionId,
      valueId,
      value,
      priceModifier = 0,
      priceModifierType = "fixed"
    ) => {
      setOrderItems((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                selectedCustomOptions: {
                  ...item.selectedCustomOptions,
                  [optionId]: {
                    valueId,
                    value,
                    price_modifier: priceModifier,
                    price_modifier_type: priceModifierType,
                  },
                },
              }
            : item
        )
      );

      setTimeout(() => {
        calculatePricing(idx);
      }, 300);
    },
    [calculatePricing]
  );

  const addOrderItem = () => {
    setOrderItems((prev) => [
      ...prev,
      {
        product: null,
        productId: "",
        productTitleInput: "",
        quantity: 1,
        unit_price: 0,
        total_price: 0,
        selectedOptions: [],
        selectedCustomOptions: {},
        customDimensions: {
          width: "",
          height: "",
          depth: "",
          length: "",
        },
        productOptions: [],
        product_snapshot: { title: "" },
        customOptions: [],
        pricingConfig: null,
        pricingBreakdown: null,
        pricingData: null,
        isCalculating: false,
        calculationError: "",
      },
    ]);
  };

  const removeOrderItem = (idx) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // --- Order Form ---
  const handleOrderFormChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateOrder = async () => {
    setCreating(true);
    try {
      let customerPayload = selectedCustomer
        ? {
            email: selectedCustomer.email,
            first_name: selectedCustomer.first_name,
            last_name: selectedCustomer.last_name,
            phone:
              selectedCustomer.phone_primary || selectedCustomer.phone || "",
          }
        : {
            email: customerFields.email,
            first_name: customerFields.first_name,
            last_name: customerFields.last_name,
            phone: customerFields.phone,
          };

      const payload = {
        customer: customerPayload,
        billing_address: orderForm.billing_address,
        shipping_address: orderForm.shipping_address,
        payment_method: orderForm.payment_method,
        payment_status: orderForm.payment_status,
        status: orderForm.status,
        special_note: orderForm.special_note,
        items: orderItems.map((item) => ({
          product_id: item.productId,
          quantity: parseInt(item.quantity, 10),
          unit_price: parseFloat(item.unit_price),
          total_price: parseFloat(item.total_price),
          selected_options: item.selectedCustomOptions || {},
          selected_services: {},
          dimensions: item.customDimensions,
          pricing_breakdown: item.pricingBreakdown,
          product_snapshot: {
            sku: item.product?.sku,
            slug: item.product?.slug,
            title: item.product?.title || item.product_snapshot?.title,
            main_image_url: item.product?.main_image_url,
          },
        })),
      };


      await homeService.createOrderByAdmin(payload);
      toast({
        title: "Order created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchOrders();

      // Reset modal state
      setSelectedCustomer(null);
      setCustomerSearch("");
      setOrderItems([
        {
          product: null,
          productId: "",
          productTitleInput: "",
          quantity: 1,
          unit_price: 0,
          total_price: 0,
          selectedOptions: [],
          selectedCustomOptions: {},
          customDimensions: {
            width: "",
            height: "",
            depth: "",
            length: "",
          },
          productOptions: [],
          product_snapshot: { title: "" },
          customOptions: [],
          pricingConfig: null,
          pricingBreakdown: null,
          pricingData: null,
          isCalculating: false,
          calculationError: "",
        },
      ]);
      setOrderForm({
        billing_address: "",
        shipping_address: "",
        payment_method: "bank_transfer",
        payment_status: "pending",
        status: "pending",
        special_note: "",
      });
      setCustomerFields({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        billing_address: "",
        shipping_address: "",
      });
      setCreatingCustomer(false);
    } catch (error) {
      toast({
        title: "Error creating order",
        description: error.message || "Failed to create order.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) return <Spinner size="xl" />;

  return (
    <Box minH="100vh" bg="#f4f6fa">
      <chakra.Box display={{ base: "none", md: "block" }}>
        <SidebarContent />
      </chakra.Box>
      <chakra.Box
        display={{ base: isSidebarOpen ? "block" : "none", md: "none" }}
        position="fixed"
        zIndex={999}
      >
        <SidebarContent onClose={() => setIsSidebarOpen(false)} />
      </chakra.Box>
      <MobileNav onOpen={() => setIsSidebarOpen(true)} />

      <Box ml={{ base: 0, md: 60 }} p={{ base: 2, md: 8 }}>
        <Flex
          align="center"
          justify="space-between"
          mb={8}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Heading size="lg" color="#1a2947" fontWeight="700">
            Orders
          </Heading>
        </Flex>

        <Flex align="center" justify="flex-end" mb={4}>
          <Button
            colorScheme="green"
            borderRadius="full"
            fontWeight="600"
            onClick={onOpen}
          >
            + Create Order
          </Button>
        </Flex>

        <Box mb={6} bg="white" p={4} borderRadius="xl" boxShadow="sm">
          <form onSubmit={handleSearch}>
            <Flex
              wrap="wrap"
              gap={4}
              align="center"
              direction={{ base: "column", md: "row" }}
            >
              <Input
                name="order_number"
                placeholder="Order number"
                value={filters.order_number}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "180px" }}
                bg="#f7fafc"
                borderRadius="full"
                fontWeight="500"
              />
              <Input
                name="customer_email"
                placeholder="Customer email"
                value={filters.customer_email}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "180px" }}
                bg="#f7fafc"
                borderRadius="full"
                fontWeight="500"
              />
              <Input
                name="customer_name"
                placeholder="Customer name"
                value={filters.customer_name}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "180px" }}
                bg="#f7fafc"
                borderRadius="full"
                fontWeight="500"
              />
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "150px" }}
                borderRadius="full"
                placeholder="Status"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="on_delivery">On Delivery</option>
                <option value="in_customs">In Customs</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending_payment">Pending Payment</option>
                <option value="order_cancel_request">Cancel Request</option>
              </Select>
              <Select
                name="payment_status"
                value={filters.payment_status}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "150px" }}
                borderRadius="full"
                placeholder="Payment status"
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
                <option value="failed">Failed</option>
              </Select>
              <Select
                name="payment_method"
                value={filters.payment_method}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "150px" }}
                borderRadius="full"
                placeholder="Payment method"
              >
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </Select>
              <Input
                name="fromDate"
                type="date"
                value={filters.fromDate}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "160px" }}
                borderRadius="full"
              />
              <Input
                name="toDate"
                type="date"
                value={filters.toDate}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "160px" }}
                borderRadius="full"
              />
              <Input
                name="min_total"
                type="number"
                placeholder="Min total"
                value={filters.min_total}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "120px" }}
                bg="#f7fafc"
                borderRadius="full"
              />
              <Input
                name="max_total"
                type="number"
                placeholder="Max total"
                value={filters.max_total}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "120px" }}
                bg="#f7fafc"
                borderRadius="full"
              />
              <Input
                name="search"
                placeholder="Global search"
                value={filters.search}
                onChange={handleFilterChange}
                width={{ base: "100%", md: "180px" }}
                bg="#f7fafc"
                borderRadius="full"
                fontWeight="500"
              />
              <Button
                leftIcon={<FaSearch />}
                colorScheme="blue"
                type="submit"
                borderRadius="full"
                fontWeight="600"
                px={6}
              >
                Search
              </Button>
              <IconButton
                icon={<FaSyncAlt />}
                aria-label="Refresh"
                size="md"
                onClick={() => fetchOrders()}
                isLoading={orderLoading}
                borderRadius="full"
                colorScheme="gray"
              />
            </Flex>
          </form>
        </Box>

        <Box bg="white" borderRadius="xl" boxShadow="sm" p={4} overflowX="auto">
          <Table size="md" variant="simple">
            <Thead bg="#f4f6fa">
              <Tr>
                <Th color="#1a2947" fontWeight="700">
                  Order #
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Status
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Payment
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Customer
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Email
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Total
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Date
                </Th>
                <Th color="#1a2947" fontWeight="700">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderLoading ? (
                <Tr>
                  <Td colSpan={8}>
                    <Spinner size="sm" /> Loading...
                  </Td>
                </Tr>
              ) : orders.length === 0 ? (
                <Tr>
                  <Td colSpan={8}>
                    <Text color="gray.500">No orders found.</Text>
                  </Td>
                </Tr>
              ) : (
                orders.map((order) => (
                  <Tr key={order.id}>
                    <Td fontWeight="600" color="#1a2947">
                      {order.order_number}
                    </Td>
                    <Td>{order.status}</Td>
                    <Td>
                      {order.payment_status} <br />
                      <small>{order.payment_method}</small>
                    </Td>
                    <Td>
                      {order.customer?.first_name} {order.customer?.last_name}
                    </Td>
                    <Td>{order.customer?.email}</Td>
                    <Td>€{parseFloat(order.total).toFixed(2)}</Td>
                    <Td>
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "-"}
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        borderRadius="full"
                        fontWeight="600"
                        as="a"
                        href={`/order-details/${order.id}`}
                        target="_blank"
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
          <Flex mt={4} justify="flex-end" align="center" gap={2}>
            <Button
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              isDisabled={pagination.page <= 1 || orderLoading}
              borderRadius="full"
              colorScheme="gray"
              fontWeight="600"
            >
              Previous
            </Button>
            <Text fontSize="sm" color="#1a2947" fontWeight="600">
              Page {pagination.page} / {pagination.totalPages}
            </Text>
            <Button
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              isDisabled={
                pagination.page >= pagination.totalPages || orderLoading
              }
              borderRadius="full"
              colorScheme="gray"
              fontWeight="600"
            >
              Next
            </Button>
          </Flex>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent maxW="6xl" w="100%" rounded="xl">
            <ModalHeader>Create Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {/* Customer Information Section - Previous code unchanged */}
              <Box mb={6} p={4} bg="gray.50" borderRadius="lg" boxShadow="sm">
                <Heading size="md" mb={4} color="blue.900" fontWeight="700">
                  Customer Information
                </Heading>
                <Flex gap={4} align="flex-end" wrap="wrap">
                  <FormControl flex="1" minW="250px">
                    <FormLabel>Search Customer</FormLabel>
                    <Flex gap={2}>
                      <Input
                        placeholder="Type email or name"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        autoComplete="off"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleCustomerSearch();
                          }
                        }}
                      />
                      <Button
                        leftIcon={<FaSearch />}
                        colorScheme="blue"
                        onClick={handleCustomerSearch}
                        isLoading={customerSearchLoading}
                        minW="120px"
                      >
                        Search
                      </Button>
                    </Flex>
                    {customerResults.length > 0 && (
                      <List
                        border="1px solid #eee"
                        borderRadius="md"
                        mt={1}
                        bg="white"
                        zIndex={10}
                        position="absolute"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {customerResults.map((cust) => (
                          <ListItem
                            key={cust.id}
                            px={3}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.100" }}
                            onClick={() => handleSelectCustomer(cust)}
                          >
                            {cust.first_name} {cust.last_name} ({cust.email})
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </FormControl>
                  <Box>
                    {!selectedCustomer && (
                      <Button
                        onClick={() => setCreatingCustomer(true)}
                        mt={6}
                        size="sm"
                        colorScheme="gray"
                      >
                        Create New Customer
                      </Button>
                    )}
                    {selectedCustomer && (
                      <Text mt={6} color="green.600" fontWeight="600">
                        Selected: {selectedCustomer.first_name}{" "}
                        {selectedCustomer.last_name} ({selectedCustomer.email})
                      </Text>
                    )}
                  </Box>
                </Flex>
                {(creatingCustomer || !selectedCustomer) && (
                  <Flex gap={4} mt={6} wrap="wrap">
                    <FormControl flex="1" minW="220px">
                      <FormLabel>Email</FormLabel>
                      <Input
                        name="email"
                        value={customerFields.email}
                        onChange={handleCustomerFieldsChange}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl flex="1" minW="180px">
                      <FormLabel>First Name</FormLabel>
                      <Input
                        name="first_name"
                        value={customerFields.first_name}
                        onChange={handleCustomerFieldsChange}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl flex="1" minW="180px">
                      <FormLabel>Last Name</FormLabel>
                      <Input
                        name="last_name"
                        value={customerFields.last_name}
                        onChange={handleCustomerFieldsChange}
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormControl flex="1" minW="180px">
                      <FormLabel>Phone</FormLabel>
                      <Input
                        name="phone"
                        value={customerFields.phone}
                        onChange={handleCustomerFieldsChange}
                        autoComplete="off"
                      />
                    </FormControl>
                  </Flex>
                )}
              </Box>
              {/* Address sections - Previous code unchanged */}

              <FormControl>
                <FormLabel>Customer Type</FormLabel>
                <Select
                  value={orderForm.billing_address.customer_type}
                  onChange={(e) => {
                    const type = e.target.value;
                    setOrderForm((prev) => ({
                      ...prev,
                      billing_address: {
                        ...prev.billing_address,
                        customer_type: type,
                      },
                      shipping_address: {
                        ...prev.shipping_address,
                        customer_type: type,
                      },
                    }));
                  }}
                >
                  <option value="">Select type</option>
                  <option value="client">Client</option>
                  <option value="business">Business</option>
                </Select>
              </FormControl>
              
              <Flex gap={8} mb={6} wrap="wrap">
                <Box
                  flex="1"
                  minW="320px"
                  bg="gray.50"
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Heading size="sm" mb={2} color="blue.800" fontWeight="700">
                    Billing Address
                  </Heading>
                  <Flex gap={2} wrap="wrap">
                    <FormControl flex="2" mb={2}>
                      <FormLabel>Street</FormLabel>
                      <Input
                        name="billing_street"
                        value={orderForm.billing_address.street}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            billing_address: {
                              ...prev.billing_address,
                              street: e.target.value,
                            },
                          }))
                        }
                        placeholder="Street address"
                      />
                    </FormControl>
                    <FormControl flex="1" mb={2}>
                      <FormLabel>Postal Code</FormLabel>
                      <Input
                        name="billing_postal_code"
                        value={orderForm.billing_address.postal_code}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            billing_address: {
                              ...prev.billing_address,
                              postal_code: e.target.value,
                            },
                          }))
                        }
                        placeholder="Postal code"
                      />
                    </FormControl>
                  </Flex>
                  <Flex gap={2} wrap="wrap">
                    <FormControl flex="2" mb={2}>
                      <FormLabel>City</FormLabel>
                      <Input
                        name="billing_city"
                        value={orderForm.billing_address.city}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            billing_address: {
                              ...prev.billing_address,
                              city: e.target.value,
                            },
                          }))
                        }
                        placeholder="City"
                      />
                    </FormControl>
                    <FormControl flex="2" mb={2}>
                      <FormLabel>Country</FormLabel>
                      <Input
                        name="billing_country"
                        value={orderForm.billing_address.country}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            billing_address: {
                              ...prev.billing_address,
                              country: e.target.value,
                            },
                          }))
                        }
                        placeholder="Country"
                      />
                    </FormControl>
                  </Flex>
                  <FormControl mb={2}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="billing_phone"
                      value={orderForm.billing_address.phone}
                      onChange={(e) =>
                        setOrderForm((prev) => ({
                          ...prev,
                          billing_address: {
                            ...prev.billing_address,
                            phone: e.target.value,
                          },
                        }))
                      }
                      placeholder="Phone"
                    />
                  </FormControl>
                  {selectedCustomer && (
                    <Button
                      size="xs"
                      mt={2}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        if (
                          selectedCustomer.addresses &&
                          Array.isArray(selectedCustomer.addresses)
                        ) {
                          const billing =
                            selectedCustomer.addresses.find(
                              (a) =>
                                a.is_default &&
                                a.label &&
                                a.label.toLowerCase().includes("bill")
                            ) || selectedCustomer.addresses[0];
                          if (billing) {
                            setOrderForm((prev) => ({
                              ...prev,
                              billing_address: { ...billing },
                            }));
                          }
                        }
                      }}
                    >
                      Autofill from customer
                    </Button>
                  )}
                </Box>
                <Box
                  flex="1"
                  minW="320px"
                  bg="gray.50"
                  p={4}
                  borderRadius="lg"
                  boxShadow="sm"
                >
                  <Heading size="sm" mb={2} color="blue.800" fontWeight="700">
                    Shipping Address
                  </Heading>
                  <Flex gap={2} wrap="wrap">
                    <FormControl flex="2" mb={2}>
                      <FormLabel>Street</FormLabel>
                      <Input
                        name="shipping_street"
                        value={orderForm.shipping_address.street}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            shipping_address: {
                              ...prev.shipping_address,
                              street: e.target.value,
                            },
                          }))
                        }
                        placeholder="Street address"
                      />
                    </FormControl>
                    <FormControl flex="1" mb={2}>
                      <FormLabel>Postal Code</FormLabel>
                      <Input
                        name="shipping_postal_code"
                        value={orderForm.shipping_postal_code || ""}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            shipping_postal_code: e.target.value,
                          }))
                        }
                        placeholder="Postal code"
                      />
                    </FormControl>
                  </Flex>
                  <Flex gap={2} wrap="wrap">
                    <FormControl flex="2" mb={2}>
                      <FormLabel>City</FormLabel>
                      <Input
                        name="shipping_city"
                        value={orderForm.shipping_city || ""}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            shipping_city: e.target.value,
                          }))
                        }
                        placeholder="City"
                      />
                    </FormControl>
                    <FormControl flex="2" mb={2}>
                      <FormLabel>Country</FormLabel>
                      <Input
                        name="shipping_country"
                        value={orderForm.shipping_country || ""}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            shipping_country: e.target.value,
                          }))
                        }
                        placeholder="Country"
                      />
                    </FormControl>
                  </Flex>
                  <FormControl mb={2}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="shipping_phone"
                      value={
                        orderForm.shipping_phone || customerFields.phone || ""
                      }
                      onChange={(e) =>
                        setOrderForm((prev) => ({
                          ...prev,
                          shipping_phone: e.target.value,
                        }))
                      }
                      placeholder="Phone"
                    />
                  </FormControl>
                  {selectedCustomer && (
                    <Button
                      size="xs"
                      mt={2}
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => {
                        if (
                          selectedCustomer.addresses &&
                          Array.isArray(selectedCustomer.addresses)
                        ) {
                          const shipping =
                            selectedCustomer.addresses.find(
                              (a) =>
                                a.is_default &&
                                a.label &&
                                a.label.toLowerCase().includes("ship")
                            ) || selectedCustomer.addresses[0];
                          if (shipping) {
                            setOrderForm((prev) => ({
                              ...prev,
                              shipping_address: { ...shipping },
                            }));
                          }
                        }
                      }}
                    >
                      Autofill from customer
                    </Button>
                  )}
                </Box>
              </Flex>
              {/* Order form sections - Previous code unchanged */}
              <Flex gap={4} mb={6} wrap="wrap">
                <FormControl minW="220px">
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    name="payment_method"
                    value={orderForm.payment_method}
                    onChange={handleOrderFormChange}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="credit_card">Credit Card</option>
                  </Select>
                </FormControl>
                <FormControl minW="220px">
                  <FormLabel>Payment Status</FormLabel>
                  <Select
                    name="payment_status"
                    value={orderForm.payment_status}
                    onChange={handleOrderFormChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </Select>
                </FormControl>
                <FormControl minW="220px">
                  <FormLabel>Order Status</FormLabel>
                  <Select
                    name="status"
                    value={orderForm.status}
                    onChange={handleOrderFormChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="on_delivery">On Delivery</option>
                    <option value="in_customs">In Customs</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="order_cancel_request">Cancel Request</option>
                  </Select>
                </FormControl>
                <FormControl flex="2">
                  <FormLabel>Special Note</FormLabel>
                  <Textarea
                    name="special_note"
                    value={orderForm.special_note}
                    onChange={handleOrderFormChange}
                    placeholder="Any special instructions for this order"
                  />
                </FormControl>
              </Flex>
              {/* Order Items Section - COMPLETELY REWRITTEN TO MATCH CustomerProductPage */}
              {/* <Box mt={4} bg="gray.50" p={4} borderRadius="lg" boxShadow="sm">
                <Text fontWeight="bold" mb={2} fontSize="lg" color="blue.900">
                  Order Items
                </Text>
                {orderItems.map((item, idx) => (
                  <Box
                    key={idx}
                    mb={4}
                    borderWidth={1}
                    borderRadius="md"
                    p={3}
                    bg="white"
                  >
                    <Flex gap={4} wrap="wrap" align="flex-end">
                      <FormControl flex="2" mb={2} position="relative">
                        <FormLabel>Search Product</FormLabel>
                        <Input
                          placeholder="Type product name or SKU"
                          value={item.productTitleInput || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setOrderItems((prev) =>
                              prev.map((itm, i) =>
                                i === idx
                                  ? { ...itm, productTitleInput: value }
                                  : itm
                              )
                            );
                            handleProductSearch(idx, value);
                          }}
                          autoComplete="off"
                        />
                        {item.productOptions &&
                          item.productOptions.length > 0 && (
                            <List
                              border="1px solid #eee"
                              borderRadius="md"
                              mt={1}
                              bg="white"
                              zIndex={10}
                              position="absolute"
                              maxH="200px"
                              overflowY="auto"
                            >
                              {item.productOptions.map((prod) => (
                                <ListItem
                                  key={prod.id}
                                  px={3}
                                  py={2}
                                  cursor="pointer"
                                  _hover={{ bg: "gray.100" }}
                                  onClick={() => handleSelectProduct(idx, prod)}
                                >
                                  {prod.title}
                                  {prod.sku ? (
                                    <Text
                                      as="span"
                                      ml={2}
                                      color="gray.500"
                                      fontSize="xs"
                                    >
                                      ({prod.sku})
                                    </Text>
                                  ) : null}
                                </ListItem>
                              ))}
                            </List>
                          )}
                      </FormControl>
                      <FormControl flex="1" mb={2}>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(idx, e.target.value)
                          }
                          min={1}
                        />
                      </FormControl>
                      <FormControl flex="1" mb={2}>
                        <FormLabel>Unit Price</FormLabel>
                        <Input
                          type="text"
                          placeholder="Unit Price"
                          value={
                            item.isCalculating
                              ? "Calculating..."
                              : `€${item.unit_price.toFixed(2)}`
                          }
                          isReadOnly
                          bg="#f7fafc"
                        />
                      </FormControl>
                      <FormControl flex="1" mb={2}>
                        <FormLabel>Total Price</FormLabel>
                        <Input
                          type="text"
                          placeholder="Total Price"
                          value={
                            item.isCalculating
                              ? "Calculating..."
                              : `€${item.total_price.toFixed(2)}`
                          }
                          isReadOnly
                          bg="#f7fafc"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeOrderItem(idx)}
                        disabled={orderItems.length === 1}
                        mt={6}
                      >
                        Remove
                      </Button>
                    </Flex>

                    {item.product?.is_dimensional_pricing &&
                      item.pricingConfig?.required_dimensions && (
                        <Box
                          mb={6}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          bg="gray.50"
                          mt={4}
                        >
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            mb={3}
                            fontFamily="Bogle"
                          >
                            Personnaliser les dimensions
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            mb={4}
                            fontFamily="Bogle"
                          >
                            Type de calcul:{" "}
                            {item.pricingConfig?.dimensional_calculation_type}
                          </Text>

                          <Grid
                            templateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                            gap={4}
                          >
                            {item.pricingConfig.required_dimensions.map(
                              (dimension) => (
                                <FormControl key={dimension}>
                                  <FormLabel textTransform="capitalize">
                                    {dimension} (cm)
                                  </FormLabel>
                                  <Input
                                    type="number"
                                    placeholder={`Enter ${dimension}`}
                                    value={
                                      item.customDimensions[dimension] || ""
                                    }
                                    onChange={(e) =>
                                      handleDimensionChange(
                                        idx,
                                        dimension,
                                        e.target.value
                                      )
                                    }
                                    min={
                                      item.pricingConfig
                                        .dimension_constraints?.[dimension]
                                        ?.min || 0
                                    }
                                    max={
                                      item.pricingConfig
                                        .dimension_constraints?.[dimension]
                                        ?.max || undefined
                                    }
                                  />
                                  {item.pricingConfig.dimension_constraints?.[
                                    dimension
                                  ] && (
                                    <FormHelperText>
                                      Min:{" "}
                                      {item.pricingConfig.dimension_constraints[
                                        dimension
                                      ].min || 0}{" "}
                                      - Max:{" "}
                                      {item.pricingConfig.dimension_constraints[
                                        dimension
                                      ].max || "No limit"}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              )
                            )}
                          </Grid>

                          {item.calculationError && (
                            <Alert status="error" mt={4}>
                              <AlertIcon />
                              {item.calculationError}
                            </Alert>
                          )}
                        </Box>
                      )}

                    {item.customOptions && item.customOptions.length > 0 && (
                      <Flex gap={4} wrap="wrap" mt={2}>
                        {item.customOptions.map((option) => (
                          <FormControl key={option.id} minW="180px" mb={2}>
                            <FormLabel>{option.option_name}</FormLabel>
                            <Select
                              placeholder={`Select ${option.option_name}`}
                              value={
                                item.selectedCustomOptions[option.id]
                                  ?.valueId || ""
                              }
                              onChange={(e) => {
                                const selectedValue = option.option_values.find(
                                  (val) => val.id === e.target.value
                                );
                                if (selectedValue) {
                                  handleCustomOptionChange(
                                    idx,
                                    option.id,
                                    selectedValue.id,
                                    selectedValue.option_value,
                                    selectedValue.price_modifier,
                                    selectedValue.price_modifier_type
                                  );
                                }
                              }}
                            >
                              {option.option_values.map((val) => {
                                const priceText =
                                  val.price_modifier &&
                                  parseFloat(val.price_modifier) !== 0
                                    ? ` (${
                                        parseFloat(val.price_modifier) > 0
                                          ? "+"
                                          : ""
                                      }€${parseFloat(
                                        val.price_modifier
                                      ).toFixed(2)})`
                                    : "";
                                return (
                                  <option key={val.id} value={val.id}>
                                    {val.display_name || val.option_value}
                                    {priceText}
                                  </option>
                                );
                              })}
                            </Select>
                          </FormControl>
                        ))}
                      </Flex>
                    )}

                    {item.pricingBreakdown && (
                      <Box
                        mt={2}
                        p={2}
                        bg="gray.50"
                        borderRadius="md"
                        fontSize="sm"
                      >
                        <Text fontWeight="bold" mb={2}>
                          Pricing Breakdown:
                        </Text>

                        {item.pricingBreakdown.base_product && (
                          <Box mb={2}>
                            <Text fontWeight="semibold">Base Product:</Text>
                            <Text ml={4}>
                              Price: €
                              {item.pricingBreakdown.base_product.gross?.toFixed(
                                2
                              ) || "0.00"}
                            </Text>
                            {item.pricingBreakdown.base_product
                              .calculation_details && (
                              <Text ml={4} fontSize="xs" color="gray.600">
                                {
                                  item.pricingBreakdown.base_product
                                    .calculation_details.calculation
                                }
                              </Text>
                            )}
                          </Box>
                        )}

                        {item.pricingBreakdown.custom_options &&
                          item.pricingBreakdown.custom_options.details &&
                          item.pricingBreakdown.custom_options.details.length >
                            0 && (
                            <Box mb={2}>
                              <Text fontWeight="semibold">Custom Options:</Text>
                              {item.pricingBreakdown.custom_options.details.map(
                                (opt, i) => (
                                  <Text key={i} ml={4} fontSize="xs">
                                    {opt.option_name}: {opt.value_name}
                                    {opt.amount > 0 &&
                                      ` (+€${opt.amount.toFixed(2)})`}
                                  </Text>
                                )
                              )}
                              <Text ml={4}>
                                Total: €
                                {item.pricingBreakdown.custom_options.gross?.toFixed(
                                  2
                                ) || "0.00"}
                              </Text>
                            </Box>
                          )}

                        <Box
                          pt={2}
                          borderTop="1px solid"
                          borderColor="gray.300"
                        >
                          <Text fontWeight="bold">
                            Final Price: €
                            {item.pricingBreakdown.final?.unit_price_gross?.toFixed(
                              2
                            ) || "0.00"}
                            {item.quantity > 1 && (
                              <span>
                                {" "}
                                × {item.quantity} = €
                                {item.total_price.toFixed(2)}
                              </span>
                            )}
                          </Text>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
                <Button
                  size="sm"
                  colorScheme="blue"
                  mt={2}
                  onClick={addOrderItem}
                >
                  + Add Item
                </Button>
              </Box> */}
              {/* Version 2 for mobile version compatible. */}
              <Box mt={4} bg="gray.50" p={4} borderRadius="lg" boxShadow="sm">
                <Text fontWeight="bold" mb={2} fontSize="lg" color="blue.900">
                  Order Items
                </Text>
                {orderItems.map((item, idx) => (
                  <Box
                    key={idx}
                    mb={4}
                    borderWidth={1}
                    borderRadius="md"
                    p={3}
                    bg="white"
                  >
                    <Flex
                      gap={4}
                      wrap="wrap"
                      align="flex-end"
                      direction={{ base: "column", md: "row" }}
                    >
                      <FormControl flex="2" mb={2} position="relative" w="100%">
                        <FormLabel>Search Product</FormLabel>
                        <Input
                          placeholder="Type product name or SKU"
                          value={item.productTitleInput || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            setOrderItems((prev) =>
                              prev.map((itm, i) =>
                                i === idx
                                  ? { ...itm, productTitleInput: value }
                                  : itm
                              )
                            );
                            handleProductSearch(idx, value);
                          }}
                          autoComplete="off"
                        />
                        {item.productOptions &&
                          item.productOptions.length > 0 && (
                            <List
                              border="1px solid #eee"
                              borderRadius="md"
                              mt={1}
                              bg="white"
                              zIndex={10}
                              position="absolute"
                              maxH="200px"
                              overflowY="auto"
                              w="100%"
                            >
                              {item.productOptions.map((prod) => (
                                <ListItem
                                  key={prod.id}
                                  px={3}
                                  py={2}
                                  cursor="pointer"
                                  _hover={{ bg: "gray.100" }}
                                  onClick={() => handleSelectProduct(idx, prod)}
                                >
                                  {prod.title}
                                  {prod.sku ? (
                                    <Text
                                      as="span"
                                      ml={2}
                                      color="gray.500"
                                      fontSize="xs"
                                    >
                                      ({prod.sku})
                                    </Text>
                                  ) : null}
                                </ListItem>
                              ))}
                            </List>
                          )}
                      </FormControl>
                      <FormControl flex="1" mb={2} w="100%">
                        <FormLabel>Quantity</FormLabel>
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(idx, e.target.value)
                          }
                          min={1}
                        />
                      </FormControl>
                      <FormControl flex="1" mb={2} w="100%">
                        <FormLabel>Unit Price</FormLabel>
                        <Input
                          type="text"
                          placeholder="Unit Price"
                          value={
                            item.isCalculating
                              ? "Calculating..."
                              : `€${item.unit_price.toFixed(2)}`
                          }
                          isReadOnly
                          bg="#f7fafc"
                        />
                      </FormControl>
                      <FormControl flex="1" mb={2} w="100%">
                        <FormLabel>Total Price</FormLabel>
                        <Input
                          type="text"
                          placeholder="Total Price"
                          value={
                            item.isCalculating
                              ? "Calculating..."
                              : `€${item.total_price.toFixed(2)}`
                          }
                          isReadOnly
                          bg="#f7fafc"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => removeOrderItem(idx)}
                        disabled={orderItems.length === 1}
                        mt={{ base: 2, md: 6 }}
                        w={{ base: "100%", md: "auto" }}
                      >
                        Remove
                      </Button>
                    </Flex>

                    {/* Dimensions Section */}
                    {item.product?.is_dimensional_pricing &&
                      item.pricingConfig?.required_dimensions && (
                        <Box
                          mb={6}
                          p={4}
                          borderWidth={1}
                          borderRadius="md"
                          bg="gray.50"
                          mt={4}
                        >
                          <Text
                            fontSize="lg"
                            fontWeight="semibold"
                            mb={3}
                            fontFamily="Bogle"
                          >
                            Personnaliser les dimensions
                          </Text>
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            mb={4}
                            fontFamily="Bogle"
                          >
                            Type de calcul:{" "}
                            {item.pricingConfig?.dimensional_calculation_type}
                          </Text>

                          <Grid
                            templateColumns={{
                              base: "1fr",
                              sm: "repeat(auto-fit, minmax(150px, 1fr))",
                              md: "repeat(auto-fit, minmax(150px, 1fr))",
                            }}
                            gap={4}
                          >
                            {item.pricingConfig.required_dimensions.map(
                              (dimension) => (
                                <FormControl key={dimension}>
                                  <FormLabel textTransform="capitalize">
                                    {dimension} (cm)
                                  </FormLabel>
                                  <Input
                                    type="number"
                                    placeholder={`Enter ${dimension}`}
                                    value={
                                      item.customDimensions[dimension] || ""
                                    }
                                    onChange={(e) =>
                                      handleDimensionChange(
                                        idx,
                                        dimension,
                                        e.target.value
                                      )
                                    }
                                    min={
                                      item.pricingConfig
                                        .dimension_constraints?.[dimension]
                                        ?.min || 0
                                    }
                                    max={
                                      item.pricingConfig
                                        .dimension_constraints?.[dimension]
                                        ?.max || undefined
                                    }
                                  />
                                  {item.pricingConfig.dimension_constraints?.[
                                    dimension
                                  ] && (
                                    <FormHelperText>
                                      Min:{" "}
                                      {item.pricingConfig.dimension_constraints[
                                        dimension
                                      ].min || 0}{" "}
                                      - Max:{" "}
                                      {item.pricingConfig.dimension_constraints[
                                        dimension
                                      ].max || "No limit"}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              )
                            )}
                          </Grid>

                          {item.calculationError && (
                            <Alert status="error" mt={4}>
                              <AlertIcon />
                              {item.calculationError}
                            </Alert>
                          )}
                        </Box>
                      )}

                    {/* Custom Options */}
                    {item.customOptions && item.customOptions.length > 0 && (
                      <Flex
                        gap={4}
                        wrap="wrap"
                        mt={2}
                        direction={{ base: "column", md: "row" }}
                      >
                        {item.customOptions.map((option) => (
                          <FormControl
                            key={option.id}
                            minW="180px"
                            mb={2}
                            w="100%"
                          >
                            <FormLabel>{option.option_name}</FormLabel>
                            <Select
                              placeholder={`Select ${option.option_name}`}
                              value={
                                item.selectedCustomOptions[option.id]
                                  ?.valueId || ""
                              }
                              onChange={(e) => {
                                const selectedValue = option.option_values.find(
                                  (val) => val.id === e.target.value
                                );
                                if (selectedValue) {
                                  handleCustomOptionChange(
                                    idx,
                                    option.id,
                                    selectedValue.id,
                                    selectedValue.option_value,
                                    selectedValue.price_modifier,
                                    selectedValue.price_modifier_type
                                  );
                                }
                              }}
                            >
                              {option.option_values.map((val) => {
                                const priceText =
                                  val.price_modifier &&
                                  parseFloat(val.price_modifier) !== 0
                                    ? ` (${
                                        parseFloat(val.price_modifier) > 0
                                          ? "+"
                                          : ""
                                      }€${parseFloat(
                                        val.price_modifier
                                      ).toFixed(2)})`
                                    : "";
                                return (
                                  <option key={val.id} value={val.id}>
                                    {val.display_name || val.option_value}
                                    {priceText}
                                  </option>
                                );
                              })}
                            </Select>
                          </FormControl>
                        ))}
                      </Flex>
                    )}

                    {item.pricingBreakdown && (
                      <Box
                        mt={2}
                        p={2}
                        bg="gray.50"
                        borderRadius="md"
                        fontSize="sm"
                      >
                        <Text fontWeight="bold" mb={2}>
                          Pricing Breakdown:
                        </Text>

                        {item.pricingBreakdown.base_product && (
                          <Box mb={2}>
                            <Text fontWeight="semibold">Base Product:</Text>
                            <Text ml={4}>
                              Price: €
                              {item.pricingBreakdown.base_product.gross?.toFixed(
                                2
                              ) || "0.00"}
                            </Text>
                            {item.pricingBreakdown.base_product
                              .calculation_details && (
                              <Text ml={4} fontSize="xs" color="gray.600">
                                {
                                  item.pricingBreakdown.base_product
                                    .calculation_details.calculation
                                }
                              </Text>
                            )}
                          </Box>
                        )}

                        {item.pricingBreakdown.custom_options &&
                          item.pricingBreakdown.custom_options.details &&
                          item.pricingBreakdown.custom_options.details.length >
                            0 && (
                            <Box mb={2}>
                              <Text fontWeight="semibold">Custom Options:</Text>
                              {item.pricingBreakdown.custom_options.details.map(
                                (opt, i) => (
                                  <Text key={i} ml={4} fontSize="xs">
                                    {opt.option_name}: {opt.value_name}
                                    {opt.amount > 0 &&
                                      ` (+€${opt.amount.toFixed(2)})`}
                                  </Text>
                                )
                              )}
                              <Text ml={4}>
                                Total: €
                                {item.pricingBreakdown.custom_options.gross?.toFixed(
                                  2
                                ) || "0.00"}
                              </Text>
                            </Box>
                          )}

                        <Box
                          pt={2}
                          borderTop="1px solid"
                          borderColor="gray.300"
                        >
                          <Text fontWeight="bold">
                            Final Price: €
                            {item.pricingBreakdown.final?.unit_price_gross?.toFixed(
                              2
                            ) || "0.00"}
                            {item.quantity > 1 && (
                              <span>
                                {" "}
                                × {item.quantity} = €
                                {item.total_price.toFixed(2)}
                              </span>
                            )}
                          </Text>
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
                <Button
                  size="sm"
                  colorScheme="blue"
                  mt={2}
                  onClick={addOrderItem}
                  w={{ base: "100%", md: "auto" }}
                >
                  + Add Item
                </Button>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={handleCreateOrder}
                isLoading={creating}
                size="lg"
                px={10}
              >
                Create Order
              </Button>
              <Button onClick={onClose} size="lg" px={10}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}
