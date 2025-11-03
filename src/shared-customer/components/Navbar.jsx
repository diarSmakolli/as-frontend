import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  VStack,
  HStack,
  Badge,
  Icon,
  SimpleGrid,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Divider,
  PopoverArrow,
  PopoverCloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Avatar,
} from "@chakra-ui/react";
import {
  FaShieldAlt,
  FaChevronRight,
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaBox,
  FaChevronDown,
  FaChevronRight as FaChevronRightIcon,
  FaTags,
  FaFire,
  FaBell,
  FaPercent,
  FaHotjar,
  FaGift,
  FaGamepad,
  FaHome,
  FaTshirt,
  FaBaby,
  FaLaptop,
  FaCar,
  FaUtensils,
  FaCamera,
  FaDumbbell,
  FaMusic,
  FaPalette,
  FaUser,
  FaHeadset,
  FaRegHeart,
} from "react-icons/fa";
import { RiHome5Line } from "react-icons/ri";
import LogoTwo from "../../assets/ASLOGO.svg";
import { BsCollection } from "react-icons/bs";
import { IoChatbubbleEllipsesOutline, IoCartOutline } from "react-icons/io5";
import { CiTrash } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import MobileCategoryNavigation from "./MobileCategoryNavigation";
import { homeService } from "../../features/home/services/homeService";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "../../features/customer-account/auth-context/customerAuthContext";

function Navbar() {
  const { customer, logout } = useCustomerAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [hoveredSubCategory, setHoveredSubCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [topCategories, setTopCategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryHoverTimeout, setCategoryHoverTimeout] = useState(null);
  const [hoveredMoreCategory, setHoveredMoreCategory] = useState(null);
  const [hoveredNestedPath, setHoveredNestedPath] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [cartPopoverOpen, setCartPopoverOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const {
    isOpen: isCategoryOpen,
    onOpen: onCategoryOpen,
    onClose: onCategoryClose,
  } = useDisclosure();
  const {
    isOpen: isMobileCategoryOpen,
    onOpen: onMobileCategoryOpen,
    onClose: onMobileCategoryClose,
  } = useDisclosure();
  const {
    isOpen: isMobileAccountOpen,
    onOpen: onMobileAccountOpen,
    onClose: onMobileAccountClose,
  } = useDisclosure();

  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const columns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5, xl: 6 });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCartCount();
    if (cartPopoverOpen) {
      fetchCartItems();
    }
  }, [cartPopoverOpen]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await homeService.getAllCategories();
      const categoriesData = response.data || [];
      setCategories(categoriesData);

      const rootCategories = categoriesData.filter(
        (cat) => !cat.parent_id || cat.parent_id === null
      );
      setTopCategories(rootCategories);
    } catch (error) {
      setTopCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const CategoryDropdownContent = () => {
    const getRootCategories = (categories) => {
      if (!categories || categories.length === 0) {
        return [];
      }

      const hasChildrenProperty = categories.some(
        (cat) => cat.children !== undefined
      );

      if (hasChildrenProperty) {
        const rootCats = categories.filter(
          (cat) => !cat.parent_id || cat.parent_id === null
        );
        return rootCats;
      } else {
        const categoryMap = {};
        const rootCategories = [];

        categories.forEach((category) => {
          categoryMap[category.id] = { ...category, children: [] };
        });

        categories.forEach((category) => {
          if (category.parent_id && categoryMap[category.parent_id]) {
            categoryMap[category.parent_id].children.push(
              categoryMap[category.id]
            );
          } else {
            rootCategories.push(categoryMap[category.id]);
          }
        });

        return rootCategories;
      }
    };

    const rootCategories = getRootCategories(categories);
    const isMobileView = useBreakpointValue({ base: true, lg: false });

    // Add handlers to prevent infinite loops
    const handleCategoryMouseEnter = (categoryId) => {
      setExpandedCategories((prevExpanded) => {
        const newSet = new Set([categoryId]);
        // Only update if different
        if (prevExpanded.size !== 1 || !prevExpanded.has(categoryId)) {
          return newSet;
        }
        return prevExpanded;
      });
    };

    const handleMobileCategoryToggle = (categoryId) => {
      setExpandedCategories((prevExpanded) => {
        const newExpanded = new Set(prevExpanded);
        if (newExpanded.has(categoryId)) {
          newExpanded.delete(categoryId);
        } else {
          newExpanded.clear();
          newExpanded.add(categoryId);
        }
        return newExpanded;
      });
    };

    if (isMobileView) {
      // Mobile Layout - Single Column with Accordion-style
      return (
        <Box
          w="100vw"
          maxW="400px"
          bg="white"
          borderRadius="lg"
          shadow="xl"
          maxH="80vh"
          overflow="hidden"
          display={{ base: "none", md: "flex" }}
        >
          <Box
            maxH="80vh"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#f1f1f1",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#cbd5e0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#a0aec0",
              },
            }}
          >
            <VStack spacing={0} align="stretch">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Box
                      key={i}
                      p={4}
                      borderBottom="1px"
                      borderColor="gray.100"
                    >
                      <HStack spacing={3}>
                        <Skeleton w="6" h="6" borderRadius="md" />
                        <SkeletonText noOfLines={1} w="60%" />
                      </HStack>
                    </Box>
                  ))
                : rootCategories.map((category) => (
                    <Box key={category.id}>
                      <Button
                        w="full"
                        justifyContent="space-between"
                        variant="ghost"
                        py={4}
                        px={4}
                        borderRadius="none"
                        borderBottom="1px"
                        borderColor="gray.100"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => handleMobileCategoryToggle(category.id)}
                      >
                        <HStack spacing={3} flex={1}>
                          <Box w="6" h="6" flexShrink={0}>
                            {category.image_url ? (
                              <Image
                                src={category.image_url}
                                alt={category.name}
                                w="full"
                                h="full"
                                objectFit="cover"
                                borderRadius="md"
                              />
                            ) : (
                              <Icon
                                as={getCategoryIcon(category.name)}
                                color="rgb(239,48,84)"
                                fontSize="lg"
                              />
                            )}
                          </Box>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            textAlign="left"
                          >
                            {category.name}
                          </Text>
                        </HStack>
                        {category.children && category.children.length > 0 && (
                          <Icon
                            as={
                              expandedCategories.has(category.id)
                                ? FaChevronDown
                                : FaChevronRightIcon
                            }
                            fontSize="sm"
                            color="gray.400"
                            transition="transform 0.2s"
                          />
                        )}
                      </Button>

                      {/* Subcategories */}
                      {expandedCategories.has(category.id) &&
                        category.children && (
                          <Box
                            bg="white"
                            borderBottom="1px"
                            borderColor="gray.100"
                          >
                            <VStack spacing={0} align="stretch">
                              {category.children.slice(0, 10).map((subcat) => (
                                <Button
                                  key={subcat.id}
                                  variant="ghost"
                                  justifyContent="flex-start"
                                  py={3}
                                  px={8}
                                  borderRadius="none"
                                  fontSize="sm"
                                  color="gray.600"
                                  _hover={{
                                    color: "rgb(239,48,84)",
                                    bg: "white",
                                  }}
                                >
                                  {subcat.name}
                                </Button>
                              ))}
                              {category.children.length > 10 && (
                                <Button
                                  variant="ghost"
                                  justifyContent="flex-start"
                                  py={3}
                                  px={8}
                                  borderRadius="none"
                                  fontSize="sm"
                                  color="rgb(239,48,84)"
                                  fontWeight="medium"
                                >
                                  View all {category.children.length} items →
                                </Button>
                              )}
                            </VStack>
                          </Box>
                        )}
                    </Box>
                  ))}
            </VStack>
          </Box>
        </Box>
      );
    }

    // Desktop Layout - Two Column with Fixed Scrollbars
    return (
      <Box
        w="auto"
        maxW={{ base: "95vw", lg: "1200px" }}
        bg="white"
        rounded="2xl"
        overflow="hidden"
      >
        <HStack spacing={0} align="stretch">
          {/* Left Sidebar - Categories */}
          <Box
            w={{ base: "full", lg: "300px" }}
            h="auto"
            borderRight="0px"
            borderColor="gray.200"
            bg="white"
            position="relative"
            p={2}
          >
            <Box
              h="full"
              overflowY="auto"
              css={{
                scrollbarWidth: "thin",
                scrollbarColor: "#cbd5e0 #f1f5f9",
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f1f5f9",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#cbd5e0",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#9ca3af",
                },
              }}
            >
              <VStack spacing={0} align="stretch">
                {loading
                  ? Array.from({ length: 12 }).map((_, i) => (
                      <Box
                        key={i}
                        p={4}
                        borderBottom="1px"
                        borderColor="gray.200"
                      >
                        <HStack spacing={3}>
                          <Skeleton w="5" h="5" borderRadius="md" />
                          <SkeletonText noOfLines={1} w="70%" />
                        </HStack>
                      </Box>
                    ))
                  : rootCategories.map((category) => {
                      const isActive = expandedCategories.has(category.id);
                      return (
                        <Button
                          key={category.id}
                          justifyContent="flex-start"
                          py={4}
                          px={4}
                          borderRadius="none"
                          borderColor="gray.200"
                          bg={isActive ? "white" : "transparent"}
                          color={isActive ? "#0053e2" : "gray.700"}
                          fontWeight={isActive ? "semibold" : "normal"}
                          _hover={{
                            bg: "white",
                            color: "#0053e2",
                            transform: "translateX(2px)",
                          }}
                          transition="all 0.2s ease"
                          position="relative"
                          onMouseEnter={() =>
                            handleCategoryMouseEnter(category.id)
                          }
                          onClick={() => {
                            navigateToCategory(category.slug);
                          }}
                        >
                          <HStack spacing={3} w="full">
                            <Box
                              w="5"
                              h="5"
                              flexShrink={0}
                              as="a"
                              href={`/category/${category.slug}`}
                            >
                              {category.image_url ? (
                                <Image
                                  src={category.image_url}
                                  alt={category.name}
                                  w="100%"
                                  h="100%"
                                  objectFit="fill"
                                  borderRadius="xl"
                                />
                              ) : (
                                <Icon
                                  as={getCategoryIcon(category.name)}
                                  color="current"
                                  fontSize="lg"
                                />
                              )}
                            </Box>

                            <Text
                              fontSize="sm"
                              textAlign="left"
                              flex={1}
                              noOfLines={1}
                            >
                              {category.name}
                            </Text>
                            {/* {category.children && category.children.length > 0 && (
                            <Icon as={FaChevronRightIcon} fontSize="xs" opacity={0.6} />
                          )} */}
                          </HStack>
                          {isActive && (
                            <Box
                              position="absolute"
                              left="0"
                              top="0"
                              bottom="0"
                              w="3px"
                              bg="#0053e2"
                              borderRadius="0 2px 2px 0"
                            />
                          )}
                        </Button>
                      );
                    })}
              </VStack>
            </Box>
          </Box>


          {/* Right Content Panel */}
          {expandedCategories.size > 0 && (
            <Box
              flex="1"
              h="100%"
              minW={{ base: "0", lg: "600px" }}
              maxW="900px"
              bg="white"
              position="relative"
            >
              <Box
                h="full"
                overflowY="auto"
                css={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e0 #f8fafc",
                  "&::-webkit-scrollbar": {
                    width: "12px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f8fafc",
                    borderRadius: "6px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "linear-gradient(to bottom, #e2e8f0, #cbd5e0)",
                    borderRadius: "6px",
                    border: "2px solid #f8fafc",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: "linear-gradient(to bottom, #cbd5e0, #9ca3af)",
                  },
                }}
              >
                {(() => {
                  const expandedCategoryId = Array.from(expandedCategories)[0];
                  const expandedCategory = rootCategories.find(
                    (cat) => cat.id === expandedCategoryId
                  );

                  if (!expandedCategory) return null;

                  const categoriesWithChildren =
                    expandedCategory.children?.filter(
                      (cat) => cat.children && cat.children.length > 0
                    ) || [];

                  const categoriesWithoutChildren =
                    expandedCategory.children?.filter(
                      (cat) => !cat.children || cat.children.length === 0
                    ) || [];

                  return (
                    <Box p={6}>
                      {/* Categories with Children */}
                      {categoriesWithChildren.length > 0 && (
                        <Box mb={8}>
                          <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={6}
                          >
                            {categoriesWithChildren.map((subCategory) => (
                              <Box
                                key={subCategory.id}
                                // bg="gray.50"
                                borderRadius="lg"
                                p={0}
                                transition="all 0.2s ease"
                                // border="1px"
                                // borderColor="gray.200"
                              >
                                <VStack align="stretch" spacing={3}>
                                  <Button
                                    justifyContent="flex-start"
                                    bg="transparent"
                                    p={0}
                                    h="auto"
                                    fontWeight="bold"
                                    fontSize="sm"
                                    color="gray.800"
                                    _hover={{
                                      color: "rgb(239,48,84)",
                                      bg: "transparent",
                                    }}
                                    fontFamily="Bogle"
                                    onClick={() => {
                                      navigateToCategory(subCategory.slug);
                                    }}
                                  >
                                    <Text
                                      textAlign="left"
                                      w="full"
                                      noOfLines={2}
                                    >
                                      {subCategory.name}
                                    </Text>
                                  </Button>

                                  <Box
                                    maxH="150px"
                                    overflowY="auto"
                                    css={{
                                      scrollbarWidth: "thin",
                                      scrollbarColor: "#e2e8f0 transparent",
                                      "&::-webkit-scrollbar": {
                                        width: "4px",
                                      },
                                      "&::-webkit-scrollbar-track": {
                                        background: "transparent",
                                      },
                                      "&::-webkit-scrollbar-thumb": {
                                        background: "#e2e8f0",
                                        borderRadius: "2px",
                                      },
                                      "&::-webkit-scrollbar-thumb:hover": {
                                        background: "#cbd5e0",
                                      },
                                    }}
                                  >
                                    <VStack align="stretch" spacing={1}>
                                      {subCategory.children
                                        .slice(0, 15)
                                        .map((child) => (
                                          <Button
                                            key={child.id}
                                            variant="ghost"
                                            justifyContent="flex-start"
                                            size="sm"
                                            fontSize="xs"
                                            color="gray.600"
                                            fontWeight="normal"
                                            py={1}
                                            px={2}
                                            h="auto"
                                            _hover={{
                                              color: "rgb(239,48,84)",
                                              bg: "rgba(239,48,84,0.05)",
                                            }}
                                            borderRadius="md"
                                            fontFamily="Bogle"
                                            onClick={() => {
                                              navigateToCategory(child.slug);
                                            }}
                                          >
                                            <Text
                                              noOfLines={1}
                                              textAlign="left"
                                              w="full"
                                            >
                                              {child.name}
                                            </Text>
                                          </Button>
                                        ))}
                                      {subCategory.children.length > 15 && (
                                        <Button
                                          variant="ghost"
                                          justifyContent="center"
                                          size="sm"
                                          fontSize="xs"
                                          color="rgb(239,48,84)"
                                          fontWeight="semibold"
                                          py={2}
                                          mt={2}
                                          borderRadius="md"
                                          border="1px"
                                          borderColor="rgb(239,48,84)"
                                          _hover={{
                                            bg: "rgb(239,48,84)",
                                            color: "white",
                                          }}
                                        >
                                          +{subCategory.children.length - 15}{" "}
                                          more
                                        </Button>
                                      )}
                                    </VStack>
                                  </Box>
                                </VStack>
                              </Box>
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                      {/* Categories without Children */}
                      {categoriesWithoutChildren.length > 0 && (
                        <Box mb={8}>
                          <Heading
                            size="md"
                            color="gray.800"
                            mb={4}
                            fontFamily="Bogle"
                          >
                            Popular in {expandedCategory.name}
                          </Heading>
                          <SimpleGrid
                            columns={{ base: 2, md: 3, lg: 4, xl: 6 }}
                            spacing={3}
                          >
                            {categoriesWithoutChildren.map((category) => (
                              <Button
                                key={category.id}
                                as='a' href={`/category/${category.slug}`}
                                variant="outline"
                                size="sm"
                                borderColor="gray.300"
                                color="gray.600"
                                fontSize="xs"
                                fontWeight="medium"
                                px={3}
                                py={2}
                                h="auto"
                                borderRadius="full"
                                _hover={{
                                  color: "white",
                                  bg: "rgb(239,48,84)",
                                  borderColor: "rgb(239,48,84)",
                                  transform: "translateY(-1px)",
                                }}
                                transition="all 0.2s ease"
                              >
                                <Text noOfLines={2} lineHeight="1.2">
                                  {category.name}
                                </Text>
                              </Button>
                            ))}
                          </SimpleGrid>
                        </Box>
                      )}

                      {/* Empty State */}
                      {(!expandedCategory.children ||
                        expandedCategory.children.length === 0) && (
                        <VStack spacing={6} py={16}>
                          <Box
                            w="20"
                            h="20"
                            bg="gray.100"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon as={FaBox} fontSize="2xl" color="gray.400" />
                          </Box>
                          <VStack spacing={2}>
                            <Heading
                              size="md"
                              color="gray.600"
                              textAlign="center"
                            >
                              {expandedCategory.name}
                            </Heading>
                            <Text
                              fontSize="sm"
                              color="gray.400"
                              textAlign="center"
                            >
                              No subcategories available yet
                            </Text>
                          </VStack>
                        </VStack>
                      )}

                      {/* Extra spacing for scroll demonstration */}
                      <Box h="20" />
                    </Box>
                  );
                })()}
              </Box>
            </Box>
          )}
        </HStack>
      </Box>
    );
  };

  // Icon mapping for categories
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      electronics: FaLaptop,
      fashion: FaTshirt,
      home: FaHome,
      sports: FaDumbbell,
      beauty: FaPalette,
      automotive: FaCar,
      baby: FaBaby,
      hobbies: FaGamepad,
      music: FaMusic,
      camera: FaCamera,
      kitchen: FaUtensils,
      toys: FaGamepad,
      books: FaBox,
      health: FaShieldAlt,
      jewelry: FaPalette,
      shoes: FaTshirt,
      bags: FaTags,
      phones: FaLaptop,
      computers: FaLaptop,
      tablets: FaLaptop,
      gaming: FaGamepad,
      furniture: FaHome,
      garden: FaHome,
      clothing: FaTshirt,
      accessories: FaPalette,
      tools: FaBox,
      outdoor: FaDumbbell,
      fitness: FaDumbbell,
      art: FaPalette,
      crafts: FaPalette,
      supplies: FaBox,
      popular: FaFire,
      trending: FaHotjar,
      new: FaTags,
      deals: FaPercent,
      bundle: FaGift,
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return FaBox;
  };

  // Get category color based on index
  const getCategoryColor = (categoryName, index) => {
    const colors = [
      { color: "blue.500", bgColor: "blue.50" },
      { color: "purple.500", bgColor: "purple.50" },
      { color: "green.500", bgColor: "green.50" },
      { color: "red.500", bgColor: "red.50" },
      { color: "orange.500", bgColor: "orange.50" },
      { color: "pink.500", bgColor: "pink.50" },
      { color: "teal.500", bgColor: "teal.50" },
      { color: "cyan.500", bgColor: "cyan.50" },
    ];

    return colors[index % colors.length];
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();

    // Validate minimum 4 characters
    if (trimmedSearchTerm.length < 4) {
      // You can add a toast notification here if you want
      return;
    }

    if (trimmedSearchTerm) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
    }
  };

  // Add validation state for visual feedback
  const [searchError, setSearchError] = useState("");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear error when user types
    if (searchError && value.trim().length >= 4) {
      setSearchError("");
    }
  };

  const validateAndSearch = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm.length === 0) {
      setSearchError("Veuillez saisir un terme de recherche.");
      return;
    }

    if (trimmedSearchTerm.length < 4) {
      setSearchError("Le terme de recherche doit comporter au moins 4 caractères");
      return;
    }

    setSearchError("");
    navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
  };

  const navigateToCategory = (slug) => {
    navigate(`/category/${slug}`);
  };

  // CART STARTS
  const fetchCartCount = async () => {
    try {
      const res = await homeService.getCartItemCount();
      setCartCount(res.count || 0);
    } catch {
      setCartCount(0);
    }
  };

  const fetchCartItems = async () => {
    setCartLoading(true);
    try {
      const res = await homeService.getActiveCart();
      setCartItems(res.items || []);
      setCartTotal(res.total || 0);
    } catch {
      setCartItems([]);
      setCartTotal(0);
    }
    setCartLoading(false);
  };

  // Remove item from cart and refresh cart state
  const handleRemoveCartItem = async (cart_item_id) => {
    try {
      await homeService.removeFromCart(cart_item_id);
      fetchCartItems();
      fetchCartCount();
    } catch (error) {
    }
  };

  // Update quantity of a cart item
  const handleUpdateCartItemQuantity = async (cart_item_id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await homeService.updateCartItemQuantity(cart_item_id, newQuantity);
      fetchCartItems();
      fetchCartCount();
    } catch (error) {
    }
  };
  // CART END

  return (
    <>
      {/* Top Banner */}
      <Box bg="#131921" py={2} px={4} display={{ base: "none", md: "block" }}>
        <Container maxW="8xl">
          <HStack spacing={6} justify="center" align="center">
            <HStack spacing={2}>
              <Icon as={FaShieldAlt} color="white" fontSize="sm" />
              <Text fontSize="xs" color="white" fontWeight="medium">
                Garantie de remboursement de 30 jours
              </Text>
            </HStack>
            <Divider
              orientation="vertical"
              h="4"
              borderColor="whiteAlpha.400"
            />
            <HStack spacing={2}>
              <Icon as={FaHeadset} color="white" fontSize="sm" />
              <Text fontSize="xs" color="white" fontWeight="medium">
                Assistance client 24h/24 et 7j/7
              </Text>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Main Header */}
      <Box
        bg="#131921"
        shadow="none"
        position="sticky"
        top="0"
        zIndex="1000"
        display={{ base: "none", md: "flex" }}
      >
        <Container maxW="8xl">
          <Box display={{ base: "none", md: "block" }}>
            <Flex align="center" justify="space-between" py={4}>
              <Box
                flexShrink={0}
                mr={6}
                as="a"
                href="/"
                _hover={{ cursor: "pointer" }}
              >
                <Flex align="center">
                  <Image
                    src={LogoTwo}
                    alt="AS Solutions Logo"
                    height="60.9px"
                    width="auto"
                    objectFit="contain"
                  />
                </Flex>
              </Box>

              <Box flex="1" maxW="2xl">
                <form onSubmit={validateAndSearch}>
                  <InputGroup size="lg">
                    {/* <InputLeftElement>
                      <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement> */}
                    <Input
                      placeholder="Recherchez tout ce que vous voulez."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      rounded="5px"
                      border="1px"
                      borderColor={searchError ? "red.300" : "gray.200"}
                      focusBorderColor={
                        searchError ? "red.500" : "rgba(48, 99, 239, 1)"
                      }
                      bg="#ffffff"
                      px={6}
                      py={"20px"}
                      height="52px"
                      _placeholder={{ color: "gray.500" }}
                      fontSize="md"
                      _focus={{
                        borderColor: searchError
                          ? "red.500"
                          : "rgba(48, 99, 239, 1)",
                        shadow: searchError
                          ? "0 0 0 1px red.500"
                          : "0 0 0 1px rgba(48, 99, 239, 1)",
                      }}
                    />
                  </InputGroup>

                  {searchError && (
                    <Text
                      fontSize="sm"
                      color="white"
                      mt={2}
                      ml={0}
                      fontFamily="rewemato"
                    >
                      {searchError}
                    </Text>
                  )}
                </form>
              </Box>

              <HStack spacing={6} flexShrink={0} ml={6}>
                {/* Wishlist */}
                <HStack spacing={0} align="center">
                  <IconButton
                    icon={<FaRegHeart />}
                    color="gray.100"
                    _hover={{ bg: "transparent" }}
                    _focus={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    bg="transparent"
                    aria-label="Wishlist"
                    as="a"
                    href={customer ? "/account/wishlist" : "/account/signin"}
                  />
                  <Text
                    color="gray.100"
                    fontSize="sm"
                    fontWeight="bold"
                    fontFamily="Airbnb Cereal VF"
                    as="a"
                    href={customer ? "/account/wishlist" : "/account/signin"}
                  >
                    Ma liste de souhaits
                  </Text>
                </HStack>

                <Popover placement="bottom-end">
                  <PopoverTrigger>
                    <Button
                      variant="ghost"
                      display="flex"
                      alignItems="center"
                      aria-label="Ouvrir le menu compte"
                      px={2}
                      py={1}
                      bg="transparent"
                      _hover={{ bg: "gray.100" }}
                      _focus={{ boxShadow: "outline" }}
                      fontWeight="bold"
                      fontFamily="Airbnb Cereal VF"
                      color="gray.100"
                      leftIcon={<VscAccount />}
                    >
                      Account
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    w="220px"
                    rounded="xl"
                    mt={2}
                    borderWidth={"0px"}
                  >
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                      {customer ? (
                        <VStack align="stretch" spacing={2}>
                          <Text
                            fontWeight="bold"
                            fontSize="md"
                            fontFamily={"Airbnb Cereal VF"}
                          >
                            Hello, {customer.first_name || customer.email}
                          </Text>
                          <Button
                            bg="transparent"
                            color="black"
                            rounded="2xl"
                            size="sm"
                            onClick={() => navigate("/account/profile")}
                            fontFamily={"Airbnb Cereal VF"}
                            justifyContent={"flex-start"}
                          >
                            Profil personnel
                          </Button>
                          <Button
                            bg="transparent"
                            color="black"
                            rounded="2xl"
                            fontFamily={"Airbnb Cereal VF"}
                            size="sm"
                            onClick={() => navigate("/account/profile")}
                            justifyContent={"flex-start"}
                          >
                            Mes commandes
                          </Button>
                          <Button
                            bg="transparent"
                            color="black"
                            rounded="2xl"
                            fontFamily={"Airbnb Cereal VF"}
                            size="sm"
                            onClick={() => navigate("/account/wishlist")}
                            justifyContent={"flex-start"}
                          >
                            Ma liste de souhaits
                          </Button>
                          <Button
                            size="sm"
                            onClick={logout}
                            fontFamily={"Airbnb Cereal VF"}
                            colorScheme="red"
                            rounded="xl"
                          >
                            Déconnexion
                          </Button>
                        </VStack>
                      ) : (
                        <VStack align="stretch" spacing={2}>
                          <Button
                            size="sm"
                            onClick={() => navigate("/account/signin")}
                            bg="#0053e2"
                            _hover={{ bg: "#0053e2" }}
                            color="white"
                            rounded="2xl"
                            fontFamily={"Airbnb Cereal VF"}
                          >
                            Se connecter
                          </Button>
                          <Button
                            bg="transparent"
                            color="black"
                            rounded="2xl"
                            fontFamily={"Airbnb Cereal VF"}
                            size="sm"
                            onClick={() => navigate("/account/register")}
                            justifyContent={"flex-start"}
                          >
                            Mes commandes
                          </Button>
                          <Button
                            bg="transparent"
                            color="black"
                            rounded="2xl"
                            fontFamily={"Airbnb Cereal VF"}
                            size="sm"
                            onClick={() => navigate("/account/register")}
                            justifyContent={"flex-start"}
                          >
                            Ma liste de souhaits
                          </Button>
                        </VStack>
                      )}
                    </PopoverBody>
                  </PopoverContent>
                </Popover>

                <Popover
                  isOpen={cartPopoverOpen}
                  onOpen={() => setCartPopoverOpen(true)}
                  onClose={() => setCartPopoverOpen(false)}
                  placement="bottom-end"
                  closeOnBlur={true}
                >
                  <PopoverTrigger>
                    <Button
                      variant="ghost"
                      aria-label="Ouvrir le panier"
                      position="relative"
                      px={2}
                      py={1}
                      bg="transparent"
                      _hover={{ bg: "gray.100" }}
                      _focus={{ boxShadow: "outline" }}
                      color="gray.100"
                      leftIcon={<IoCartOutline />}
                    >
                      <Badge
                        p={0}
                        position="absolute"
                        top="0"
                        right="-0.5"
                        bg="rgb(255, 0, 0)"
                        color="white"
                        borderRadius="full"
                        fontSize="xs"
                        minW="16px"
                        h="16px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {cartCount}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    w="340px"
                    maxW="95vw"
                    p={0}
                    borderRadius="xl"
                    shadow="xl"
                  >
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody p={0}>
                      <Box p={4} pb={2}>
                        <Text fontWeight="600" fontSize="md">
                          {cartItems.length} produit(s)
                        </Text>
                      </Box>
                      <Divider />
                      <VStack
                        align="stretch"
                        spacing={0}
                        maxH="320px"
                        overflowY="auto"
                      >
                        {cartLoading ? (
                          Array.from({ length: 2 }).map((_, i) => (
                            <Box key={i} p={4}>
                              <Skeleton h="40px" w="full" borderRadius="md" />
                            </Box>
                          ))
                        ) : cartItems.length === 0 ? (
                          <Box p={4} textAlign="center" color="gray.500">
                            Le panier est vide.
                          </Box>
                        ) : (
                          cartItems.map((item) => (
                            <HStack
                              key={item.id}
                              align="flex-start"
                              spacing={3}
                              p={3}
                              borderBottom="1px solid #f1f1f1"
                            >
                              <Image
                                src={item.product_snapshot?.main_image_url}
                                alt={item.product_snapshot?.title}
                                boxSize="48px"
                                objectFit="cover"
                                borderRadius="md"
                                fallbackSrc="https://via.placeholder.com/48"
                              />
                              <Box flex="1" minW={0}>
                                <Text
                                  fontWeight="semibold"
                                  fontSize="sm"
                                  noOfLines={1}
                                >
                                  {item.product_snapshot?.title}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  Prix unitaire:{" "}
                                  <b>
                                    {Number(item.unit_price).toLocaleString(
                                      "sq-AL",
                                      {
                                        style: "currency",
                                        currency: "EUR",
                                        minimumFractionDigits: 2,
                                      }
                                    )}
                                  </b>
                                </Text>
                                <HStack spacing={2} mt={1}>
                                  <IconButton
                                    icon={<span>-</span>}
                                    aria-label="Decrease"
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateCartItemQuantity(
                                        item.id,
                                        item.quantity - 1
                                      )
                                    }
                                    isDisabled={item.quantity <= 1}
                                  />
                                  <Text fontSize="xs">{item.quantity}</Text>
                                  <IconButton
                                    icon={<span>+</span>}
                                    aria-label="Increase"
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                      handleUpdateCartItemQuantity(
                                        item.id,
                                        item.quantity + 1
                                      )
                                    }
                                  />
                                </HStack>
                              </Box>
                              <IconButton
                                icon={<CiTrash size="19.5px" />}
                                aria-label="Remove"
                                size="sm"
                                colorScheme="black"
                                variant="ghost"
                                onClick={() => handleRemoveCartItem(item.id)}
                              />
                            </HStack>
                          ))
                        )}
                      </VStack>
                      <Divider />
                      <Box p={4}>
                        <Button
                          w="full"
                          size="sm"
                          fontWeight="600"
                          fontFamily="Airbnb Cereal VF"
                          borderRadius="10px"
                          onClick={() => {
                            setCartPopoverOpen(false);
                            navigate("/cart");
                          }}
                          isDisabled={cartItems.length === 0}
                        >
                          Aller au panier (
                          {cartTotal.toLocaleString("sq-AL", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 2,
                          })}
                          )
                        </Button>
                      </Box>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            </Flex>
          </Box>

          {/* Mobile Header - Like reference design */}
          <Box display={{ base: "block", md: "none" }}>
            <Flex align="center" justify="space-between" py={3} px={2}>
              <Box
                flexShrink={0}
                mr={6}
                // Remove the as="a" and href="/" props here too
              >
                <Link to="/">
                  <Image
                    src={LogoTwo}
                    alt="AS Solutions Logo"
                    height="40px"
                    width="auto"
                    objectFit="contain"
                  />
                </Link>
              </Box>

              <HStack spacing={2}>
                <IconButton
                  icon={<FaBell />}
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ color: "rgb(239,48,84)" }}
                  aria-label="Notifications"
                />
                <Link to="/account/wishlist">
                  <IconButton
                    icon={<FaHeart />}
                    variant="ghost"
                    size="sm"
                    color="gray.600"
                    _hover={{ color: "red.500" }}
                    aria-label="Wishlist"
                  />
                </Link>
                <IconButton
                  icon={<FaShoppingCart />}
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ color: "rgb(239,48,84)" }}
                  aria-label="Cart"
                />
              </HStack>
            </Flex>

            <Box px={2} pb={3}>
              <InputGroup size="md">
                <InputLeftElement>
                  <Icon as={FaSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="5px"
                  border="1px"
                  borderColor="gray.300"
                  focusBorderColor="rgb(239,48,84)"
                  bg="gray.50"
                  _placeholder={{ color: "gray.500" }}
                  fontSize="sm"
                  _focus={{
                    borderColor: "rgb(239,48,84)",
                    shadow: "0 0 0 1px rgb(239,48,84)",
                    bg: "white",
                  }}
                />
              </InputGroup>
            </Box>

            <HStack spacing={2} px={2} pb={2} justify="space-between">
              <Button
                variant="ghost"
                size="sm"
                color="gray.100"
                _hover={{ color: "rgb(239,48,84)" }}
                fontSize="sm"
                fontFamily="Bogle"
              >
                Se connecter
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Mobile area Header */}
      <Box
        bg="#131921"
        shadow="none"
        position="sticky"
        top="0"
        zIndex="1000"
        display={{ base: "block", md: "none" }}
      >
        <Container maxW="8xl">
          <Box display={{ base: "block", md: "none" }}>
            {/* Main header row */}
            <Flex align="center" justify="space-between" py={3} px={4}>
              {/* Logo */}
              <Box
                flexShrink={0}
                mr={6}
                as="a"
                href="/"
                _hover={{ cursor: "pointer" }}
              >
                <Flex align="center">
                  <Image
                    src={LogoTwo}
                    alt="AS Solutions Logo"
                    height="40.9px"
                    width="auto"
                    objectFit="contain"
                  />
                </Flex>
              </Box>

              {/* Right side - Wishlist icon */}
              <Link to="/account/wishlist">
                <IconButton
                  icon={<FaRegHeart />}
                  variant="ghost"
                  size="md"
                  color="gray.100"
                  _hover={{ color: "red.500" }}
                  aria-label="Wishlist"
                  borderRadius="full"
                />
              </Link>
            </Flex>

            {/* Search Bar - Full width like reference */}
            <Box flex="1" maxW="2xl" mb={0} p={2}>
              <form onSubmit={validateAndSearch}>
                <InputGroup size="lg">
                  <Input
                    placeholder="Recherchez tout ce que vous voulez."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    rounded="5px"
                    border="1px"
                    borderColor={searchError ? "red.300" : "gray.200"}
                    focusBorderColor={
                      searchError ? "red.500" : "rgba(48, 99, 239, 1)"
                    }
                    bg="#ffffff"
                    px={6}
                    py={"20px"}
                    height="52px"
                    _placeholder={{ color: "gray.500" }}
                    fontSize="md"
                    _focus={{
                      borderColor: searchError
                        ? "red.500"
                        : "rgba(48, 99, 239, 1)",
                      shadow: searchError
                        ? "0 0 0 1px red.500"
                        : "0 0 0 1px rgba(48, 99, 239, 1)",
                    }}
                  />
                </InputGroup>
                {searchError && (
                  <Text fontSize="xs" color="white" mt={1} ml={4}>
                    {searchError}
                  </Text>
                )}
              </form>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom Navigation Bar For Mobile */}
      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        bottom="0"
        left="0"
        right="0"
        bg="#fff"
        borderTop="1px"
        borderColor="gray.200"
        shadow="lg"
        zIndex="1000"
        px={0}
      >
        <HStack spacing={0} justify="space-around" py={2} px={1}>
          {/* Home */}
          <VStack spacing={1} flex={1} py={2} cursor="pointer">
            <Icon as={RiHome5Line} fontSize="lg" color="black" />
            <Text
              fontSize="xs"
              color="black"
              fontWeight="semibold"
              textAlign="center"
              as="a"
              href="/"
            >
              Maison
            </Text>
          </VStack>

          {/* Categories */}
          <VStack
            spacing={1}
            flex={1}
            cursor="pointer"
            py={2}
            onClick={onMobileCategoryOpen}
          >
            <Icon as={BsCollection} fontSize="lg" color="black" />
            <Text fontSize="xs" color="black" textAlign="center">
              Collections
            </Text>
          </VStack>

          <MobileCategoryNavigation
            isOpen={isMobileCategoryOpen}
            onClose={onMobileCategoryClose}
            categories={categories}
            loading={loading}
          />

          {/* Cart */}
          <Link to={customer ? "/cart" : "/account/signin"}>
            <VStack
              spacing={1}
              flex={1}
              py={2}
              cursor="pointer"
              position="relative"
            >
              <Box position="relative">
                <Icon as={FaShoppingCart} fontSize="lg" color="black" />
                <Badge
                  position="absolute"
                  top="-1"
                  right="-1"
                  bg="rgb(255, 0, 0)"
                  color="white"
                  borderRadius="full"
                  fontSize="2xs"
                  minW="16px"
                  h="16px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {cartCount || 0}
                </Badge>
              </Box>
              <Text fontSize="xs" color="black" textAlign="center">
                Panier
              </Text>
            </VStack>
          </Link>

          {/* Chat */}
          <VStack
            spacing={1}
            flex={1}
            py={2}
            cursor="pointer"
            onClick={() => {
              if (window.fcWidget) {
                window.fcWidget.open();
              }
            }}
          >
            <Icon
              as={IoChatbubbleEllipsesOutline}
              fontSize="lg"
              color="black"
            />
            <Text fontSize="xs" color="black" textAlign="center">
              Chat
            </Text>
          </VStack>

          {/* Account */}
          <VStack
            spacing={1}
            flex={1}
            py={2}
            cursor="pointer"
            onClick={onMobileAccountOpen}
          >
            <Icon as={MdManageAccounts} fontSize="lg" color="black" />
            <Text fontSize="xs" color="black" textAlign="center">
              {customer ? customer.first_name : "Compte"}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Mobile Account Modal */}
      <Modal
        isOpen={isMobileAccountOpen}
        onClose={onMobileAccountClose}
        size="full"
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" />
        <ModalContent bg="gray.50" m={0} borderRadius={0}>
          <ModalHeader
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            px={6}
            py={4}
          >
            <HStack justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="600" color="gray.800">
                Mon Compte
              </Text>
              <ModalCloseButton position="relative" top="0" right="0" />
            </HStack>
          </ModalHeader>

          <ModalBody p={0}>
            {customer ? (
              // Logged in user view
              <VStack spacing={0} align="stretch">
                {/* User Profile Section */}
                <Box bg="white" p={6} borderBottom="1px" borderColor="gray.200">
                  <HStack spacing={4}>
                    <Avatar
                      size="lg"
                      name={`${customer.first_name} ${customer.last_name}`}
                      src={customer.profile_picture_url}
                      bg="blue.500"
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="600" color="gray.800">
                        {customer.first_name} {customer.last_name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {customer.email}
                      </Text>
                      {customer.phone && (
                        <Text fontSize="sm" color="gray.500">
                          {customer.phone}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </Box>

                {/* Menu Items */}
                <VStack spacing={0} align="stretch">
                  {/* Profile */}
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="60px"
                    px={6}
                    bg="white"
                    borderBottom="1px"
                    borderColor="gray.100"
                    borderRadius={0}
                    leftIcon={<Icon as={FaUser} color="gray.600" />}
                    onClick={() => {
                      onMobileAccountClose();
                      navigate("/account/profile");
                    }}
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack justify="space-between" w="full">
                      <Text fontSize="md" color="gray.700">
                        Profil personnel
                      </Text>
                      <Icon
                        as={FaChevronRight}
                        color="gray.400"
                        fontSize="sm"
                      />
                    </HStack>
                  </Button>

                  {/* Orders */}
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="60px"
                    px={6}
                    bg="white"
                    borderBottom="1px"
                    borderColor="gray.100"
                    borderRadius={0}
                    leftIcon={<Icon as={FaBox} color="gray.600" />}
                    onClick={() => {
                      onMobileAccountClose();
                      navigate("/account/profile");
                    }}
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack justify="space-between" w="full">
                      <Text fontSize="md" color="gray.700">
                        Mes commandes
                      </Text>
                      <Icon
                        as={FaChevronRight}
                        color="gray.400"
                        fontSize="sm"
                      />
                    </HStack>
                  </Button>

                  {/* Wishlist */}
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="60px"
                    px={6}
                    bg="white"
                    borderBottom="1px"
                    borderColor="gray.100"
                    borderRadius={0}
                    leftIcon={<Icon as={FaHeart} color="gray.600" />}
                    onClick={() => {
                      onMobileAccountClose();
                      navigate("/account/wishlist");
                    }}
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack justify="space-between" w="full">
                      <Text fontSize="md" color="gray.700">
                        Ma liste de souhaits
                      </Text>
                      <Icon
                        as={FaChevronRight}
                        color="gray.400"
                        fontSize="sm"
                      />
                    </HStack>
                  </Button>

                  {/* Addresses */}
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="60px"
                    px={6}
                    bg="white"
                    borderBottom="1px"
                    borderColor="gray.100"
                    borderRadius={0}
                    leftIcon={<Icon as={FaHome} color="gray.600" />}
                    onClick={() => {
                      onMobileAccountClose();
                      navigate("/account/profile");
                    }}
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack justify="space-between" w="full">
                      <Text fontSize="md" color="gray.700">
                        Mes adresses
                      </Text>
                      <Icon
                        as={FaChevronRight}
                        color="gray.400"
                        fontSize="sm"
                      />
                    </HStack>
                  </Button>

                  {/* Support */}
                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="60px"
                    px={6}
                    bg="white"
                    borderBottom="1px"
                    borderColor="gray.100"
                    borderRadius={0}
                    leftIcon={<Icon as={FaHeadset} color="gray.600" />}
                    onClick={() => {
                      if (window.fcWidget) {
                        window.fcWidget.open();
                      }
                      onMobileAccountClose();
                    }}
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack justify="space-between" w="full">
                      <Text fontSize="md" color="gray.700">
                        Centre d'aide
                      </Text>
                      <Icon
                        as={FaChevronRight}
                        color="gray.400"
                        fontSize="sm"
                      />
                    </HStack>
                  </Button>

                  <Button
                    variant="ghost"
                    justifyContent="flex-start"
                    h="60px"
                    px={6}
                    bg="white"
                    borderBottom="1px"
                    borderColor="gray.100"
                    borderRadius={0}
                    leftIcon={<Icon as={FaUser} />}
                    onClick={() => {
                      logout();
                      onMobileAccountClose();
                    }}
                    fontWeight="600"
                  >
                    Déconnexion
                  </Button>
                </VStack>
              </VStack>
            ) : (
              // Not logged in view
              <VStack spacing={6} p={6} align="stretch">
                <VStack spacing={4} textAlign="center">
                  <Avatar size="xl" bg="gray.300" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="500" color="gray.800">
                      Connectez-vous à votre compte
                    </Text>
                    <Text fontSize="sm" color="gray.500" textAlign="center">
                      Accédez à vos commandes, liste de souhaits et bien plus
                      encore
                    </Text>
                  </VStack>
                </VStack>

                <VStack spacing={3} align="stretch">
                  <Button
                    variant="outline"
                    size="sm"
                    borderRadius="xl"
                    onClick={() => {
                      onMobileAccountClose();
                      navigate("/account/signin");
                    }}
                  >
                    Se connecter
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    borderRadius="xl"
                    fontWeight="600"
                    onClick={() => {
                      onMobileAccountClose();
                      navigate("/account/register");
                    }}
                  >
                    Créer un compte
                  </Button>
                </VStack>

                {/* Guest Options */}
                <Box bg="gray.50" p={4} borderRadius="xl" mt={4}>
                  <Text fontSize="sm" fontWeight="600" color="gray.700" mb={3}>
                    Continuer en tant qu'invité
                  </Text>
                  <VStack spacing={2} align="stretch">
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      leftIcon={<Icon as={FaBox} color="gray.600" />}
                      onClick={() => {
                        onMobileAccountClose();
                        navigate("/order-tracking");
                      }}
                    >
                      Suivre une commande
                    </Button>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      size="sm"
                      leftIcon={<Icon as={FaHeadset} color="gray.600" />}
                      onClick={() => {
                        if (window.fcWidget) {
                          window.fcWidget.open();
                        }
                        onMobileAccountClose();
                      }}
                    >
                      Centre d'aide
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Category Navigation - Responsive for both desktop and mobile */}
      <Box
        bg="#131921"
        rounded="0"
        borderTop="0px"
        borderColor="gray.200"
        py={1}
        display="block" // Show on both desktop and mobile
      >
        <Container maxW="8xl">
          {/* Desktop Version */}
          <HStack
            spacing={2}
            align="center"
            py={1}
            justify="flex-start"
            w="full"
            display={{ base: "none", md: "flex" }}
          >
            <Popover
              isOpen={isCategoryOpen}
              onOpen={onCategoryOpen}
              onClose={onCategoryClose}
              placement="bottom-start"
              closeOnBlur={true}
              trigger="hover"
            >
              <PopoverTrigger>
                <Button
                  leftIcon={<Icon as={FaBars} />}
                  bg="white"
                  color="black"
                  _hover={{
                    bg: "white",
                    transform: "translateY(-1px)",
                    shadow: "lg",
                  }}
                  fontSize="sm"
                  rounded="full"
                  flexShrink={0}
                  px={4}
                  py={2}
                  h="auto"
                  transition="all 0.2s ease"
                  fontWeight="500"
                  fontFamily={"Airbnb Cereal VF"}
                  onMouseEnter={onCategoryOpen}
                >
                  Catégories
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  w="auto"
                  maxW="none"
                  border="1px"
                  borderColor="gray.200"
                  shadow="2xl"
                  borderRadius="xl"
                  p={0}
                  bg="white"
                  zIndex={1400}
                  _focus={{ boxShadow: "2xl" }}
                  onMouseEnter={() => {
                    onCategoryOpen();
                  }}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      setExpandedCategories(new Set());
                      setHoveredSubCategory(null);
                      setHoveredNestedPath([]);
                      onCategoryClose();
                    }, 200);
                  }}
                >
                  <PopoverBody p={0}>
                    {loading ? (
                      <Box w="1000px" p={8}>
                        <VStack spacing={6}>
                          <HStack w="full" spacing={6}>
                            <VStack w="250px" spacing={4}>
                              {[...Array(6)].map((_, i) => (
                                <HStack key={i} w="full" spacing={4}>
                                  <Skeleton w="6" h="6" borderRadius="md" />
                                  <SkeletonText noOfLines={1} w="full" />
                                </HStack>
                              ))}
                            </VStack>
                            <VStack w="750px" spacing={4}>
                              <SkeletonText noOfLines={2} w="full" />
                              <SimpleGrid columns={4} spacing={4} w="full">
                                {[...Array(12)].map((_, i) => (
                                  <Skeleton key={i} h="8" borderRadius="md" />
                                ))}
                              </SimpleGrid>
                            </VStack>
                          </HStack>
                        </VStack>
                      </Box>
                    ) : (
                      <CategoryDropdownContent />
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>

            <Button
              leftIcon={<Icon as={FaTags} color="gray.900" />}
              bg="white"
              color="black"
              _hover={{
                bg: "white",
                transform: "translateY(-1px)",
                shadow: "lg",
              }}
              fontSize="sm"
              rounded="full"
              flexShrink={0}
              px={4}
              py={2}
              h="auto"
              transition="all 0.2s ease"
              fontWeight="500"
              fontFamily={"Airbnb Cereal VF"}
              href="/flash-deals"
            >
              Centre des offres
            </Button>

            {loading ? (
              <HStack spacing={2}>
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} h="8" w="20" borderRadius="md" />
                ))}
              </HStack>
            ) : (
              topCategories.slice(0, 4).map((category, index) => {
                const colors = getCategoryColor(category.name, index);

                return (
                  <Box key={category.id} position="relative">
                    <Button
                      bg="white"
                      color="black"
                      _hover={{
                        bg: "white",
                        transform: "translateY(-1px)",
                        shadow: "lg",
                      }}
                      fontSize="sm"
                      rounded="full"
                      flexShrink={0}
                      px={4}
                      py={2}
                      h="auto"
                      transition="all 0.2s ease"
                      fontWeight="500"
                      fontFamily={"Airbnb Cereal VF"}
                      onClick={() => {
                        if (hoveredCategory === category.id) {
                          setHoveredCategory(null);
                        } else {
                          setHoveredCategory(category.id);
                        }
                      }}
                    >
                      {category.name}
                      <Icon
                        as={FaChevronDown}
                        ml={1}
                        fontSize="xs"
                        opacity={0.7}
                      />
                    </Button>

                    {hoveredCategory === category.id && (
                      <Box
                        position="absolute"
                        top="100%"
                        left={index >= 2 ? "-250px" : "0"}
                        mt={1}
                        p={2}
                        bg="#fff"
                        border="1px"
                        borderColor="gray.100"
                        borderRadius="2xl"
                        shadow="4xl"
                        zIndex={1300}
                        maxH="500px"
                        overflow="hidden"
                        onMouseEnter={() => {
                          setHoveredCategory(category.id);
                        }}
                        onMouseLeave={() => {
                          setTimeout(() => {
                            setHoveredCategory(null);
                            setHoveredSubCategory(null);
                          }, 200);
                        }}
                      >
                        <HStack align="start" spacing={0}>
                          <VStack
                            align="stretch"
                            spacing={0}
                            w="280px"
                            maxH="500px"
                            overflowY="auto"
                            bg="white"
                            css={{
                              "&::-webkit-scrollbar": {
                                width: "4px",
                              },
                              "&::-webkit-scrollbar-track": {
                                background: "#f1f1f1",
                              },
                              "&::-webkit-scrollbar-thumb": {
                                background: "#c1c1c1",
                                borderRadius: "2px",
                              },
                              "&::-webkit-scrollbar-thumb:hover": {
                                background: "#a8a8a8",
                              },
                            }}
                          >
                            {category.children &&
                            category.children.length > 0 ? (
                              category.children.map((subcat) => (
                                <Button
                                  key={subcat.id}
                                  variant="ghost"
                                  justifyContent="flex-start"
                                  h="auto"
                                  py={3}
                                  px={4}
                                  fontSize="sm"
                                  fontWeight="medium"
                                  color="gray.700"
                                  _hover={{
                                    bg: "rgba(255, 255, 255, 1)",
                                    color: "rgba(0, 26, 73, 1)",
                                  }}
                                  borderRadius="none"
                                  textAlign="left"
                                  w="full"
                                  borderBottom="0px"
                                  borderColor="gray.100"
                                  onMouseEnter={() => {
                                    setHoveredSubCategory(subcat.id);
                                  }}
                                  onMouseLeave={() => {
                                    setHoveredSubCategory(null);
                                  }}
                                  onClick={() => {
                                    navigateToCategory(subcat.slug);
                                  }}
                                >
                                  <HStack justify="space-between" w="full">
                                    <Text noOfLines={1}>{subcat.name}</Text>
                                    {subcat.children &&
                                      subcat.children.length > 0 && (
                                        <Icon
                                          as={FaChevronRight}
                                          fontSize="xs"
                                          color="gray.400"
                                        />
                                      )}
                                  </HStack>
                                </Button>
                              ))
                            ) : (
                              <VStack p={4} spacing={2}>
                                <Text
                                  fontSize="sm"
                                  color="gray.500"
                                  textAlign="center"
                                >
                                  Aucune sous-catégorie disponible!
                                </Text>
                              </VStack>
                            )}
                          </VStack>

                          {hoveredSubCategory &&
                            (() => {
                              const currentSubcat = category.children?.find(
                                (sub) => sub.id === hoveredSubCategory
                              );

                              if (
                                !currentSubcat ||
                                !currentSubcat.children ||
                                currentSubcat.children.length === 0
                              ) {
                                return null;
                              }

                              const childrenCount =
                                currentSubcat.children.length;
                              let columns = 2;
                              let panelWidth = "400px";

                              if (childrenCount <= 4) {
                                columns = 1;
                                panelWidth = "280px";
                              } else if (childrenCount <= 8) {
                                columns = 2;
                                panelWidth = "400px";
                              } else if (childrenCount <= 16) {
                                columns = 3;
                                panelWidth = "500px";
                              } else {
                                columns = 4;
                                panelWidth = "600px";
                              }

                              return (
                                <Box
                                  w={panelWidth}
                                  minH="200px"
                                  maxH="500px"
                                  bg="white"
                                  borderLeft="1px"
                                  borderColor="gray.200"
                                  onMouseEnter={() => {
                                    setHoveredSubCategory(hoveredSubCategory);
                                  }}
                                  overflowY="auto"
                                  position="relative"
                                  css={{
                                    "&::-webkit-scrollbar": {
                                      width: "4px",
                                    },
                                    "&::-webkit-scrollbar-track": {
                                      background: "#f7fafc",
                                    },
                                    "&::-webkit-scrollbar-thumb": {
                                      background:
                                        "linear-gradient(180deg, #e2e8f0, #cbd5e0)",
                                      borderRadius: "2px",
                                    },
                                    "&::-webkit-scrollbar-thumb:hover": {
                                      background:
                                        "linear-gradient(180deg, #cbd5e0, #a0aec0)",
                                    },
                                  }}
                                >
                                  <Box p={4}>
                                    <SimpleGrid
                                      columns={columns}
                                      spacing={3}
                                      w="full"
                                    >
                                      {currentSubcat.children.map(
                                        (child, childIndex) => {
                                          const isHighlighted =
                                            childIndex % 5 === 0;
                                          const isPrimary =
                                            childIndex % 7 === 0;

                                          return (
                                            <Box
                                              key={child.id}
                                              justifyContent="flex-start"
                                              h="auto"
                                              fontSize="sm"
                                              _hover={{
                                                color: "rgba(4, 0, 118, 1)",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              <VStack
                                                align="start"
                                                spacing={1}
                                                w="full"
                                              >
                                                <HStack
                                                  w="full"
                                                  justify="space-between"
                                                  onClick={() => {
                                                    navigateToCategory(
                                                      child.slug
                                                    );
                                                  }}
                                                >
                                                  <Text
                                                    noOfLines={2}
                                                    fontSize="sm"
                                                    lineHeight="1.4"
                                                    flex={1}
                                                    fontFamily="Airbnb Cereal VF"
                                                  >
                                                    {child.name}
                                                  </Text>
                                                </HStack>
                                              </VStack>
                                            </Box>
                                          );
                                        }
                                      )}
                                    </SimpleGrid>
                                  </Box>
                                </Box>
                              );
                            })()}
                        </HStack>
                      </Box>
                    )}
                  </Box>
                );
              })
            )}
          </HStack>
        </Container>

        {/* Mobile Version - Horizontal Scrollable */}
        <Box display={{ base: "block", md: "none" }} px={0} py={1}>
          <Box
            overflowX="auto"
            overflowY="hidden"
            css={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
            bg="transparent"
          >
            <HStack spacing={3} align="center" minW="max-content" py={2} px={2}>
              <Button
                bg="white"
                color="black"
                _hover={{
                  bg: "white",
                  transform: "translateY(-1px)",
                  shadow: "lg",
                }}
                fontSize="xs"
                rounded="full"
                flexShrink={0}
                px={4}
                py={2.5}
                h="auto"
                transition="all 0.2s ease"
                fontWeight="500"
                fontFamily={"Airbnb Cereal VF"}
                as="a"
                href="/flash-deals"
              >
                Centre des offres
              </Button>

              {loading ? (
                <HStack spacing={3}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} h="8" w="20" borderRadius="full" />
                  ))}
                </HStack>
              ) : (
                topCategories.slice(0, 6).map((category, index) => {
                  const colors = getCategoryColor(category.name, index);

                  return (
                    <Button
                      key={category.id}
                      bg="white"
                      color="black"
                      _hover={{
                        bg: "white",
                        transform: "translateY(-1px)",
                        shadow: "lg",
                      }}
                      fontSize="xs"
                      rounded="full"
                      flexShrink={0}
                      px={4}
                      py={2}
                      h="auto"
                      transition="all 0.2s ease"
                      fontWeight="500"
                      fontFamily={"Airbnb Cereal VF"}
                      onClick={() => {
                        navigateToCategory(category.slug);
                      }}
                    >
                      {category.name}
                    </Button>
                  );
                })
              )}
            </HStack>
          </Box>

          {/* Subtle scroll indicator */}
          <Box
            position="absolute"
            right="0"
            top="0"
            bottom="0"
            w="20px"
            pointerEvents="none"
            display={{ base: "block", md: "none" }}
          />
        </Box>
      </Box>
    </>
  );
}

export default Navbar;
