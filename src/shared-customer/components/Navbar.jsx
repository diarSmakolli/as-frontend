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
  Card,
  CardBody,
  Skeleton,
  SkeletonText,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FaStar,
  FaShippingFast,
  FaShieldAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaBox,
  FaChevronDown,
  FaChevronRight as FaChevronRightIcon,
  FaTags,
  FaClock,
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
  FaHandsHelping,
  FaBoxTissue,
  FaComments,
  FaUser,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import MobileCategoryNavigation from "./MobileCategoryNavigation";
import { homeService } from "../../features/home/services/homeService";
import Logo from "../../assets/logo-as.png";
import { Link } from "react-router-dom";

function Navbar() {
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

  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const columns = useBreakpointValue({ base: 2, sm: 3, md: 4, lg: 5, xl: 6 });

  useEffect(() => {
    fetchCategories();
  }, []);

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
                            bg="gray.50"
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
        bg="gray.100"
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
                          color={isActive ? "rgb(239,48,84)" : "gray.700"}
                          fontWeight={isActive ? "semibold" : "normal"}
                          _hover={{
                            bg: "white",
                            color: "rgb(239,48,84)",
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
                                  w="full"
                                  h="full"
                                  objectFit="cover"
                                  borderRadius="sm"
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
                              bg="rgb(239,48,84)"
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
              h="500px"
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
                                    fontFamily={"Bricolage Grotesque"}
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
                                            fontFamily={"Bricolage Grotesque"}
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
                            fontFamily="Bricolage Grotesque"
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
      setSearchError("Please enter a search term");
      return;
    }

    if (trimmedSearchTerm.length < 4) {
      setSearchError("Search term must be at least 4 characters long");
      return;
    }

    setSearchError("");
    navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
  };

  const navigateToCategory = (slug) => {
    navigate(`/category/${slug}`);
  };

  return (
    <>
      <Box bg="gray.800" py={2} px={4} display={{ base: "none", md: "block" }}>
        <HStack spacing={2} justify="center">
          <Icon as={FaShippingFast} color="white" fontSize="sm" />
          <Text fontSize="xs" color="white" textAlign="center">
            Buy at As Solutions for exclusive offers!
          </Text>
        </HStack>
      </Box>

      <Box
        bg="white"
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="1000"
        display={{ base: "none", md: "flex" }}
      >
        <Container maxW="8xl">
          <Box display={{ base: "none", md: "block" }}>
            <Flex align="center" justify="space-between" py={3}>
              <Box
                flexShrink={0}
                mr={6}
                as="a"
                href="/"
                _hover={{ cursor: "pointer" }}
              >
                <Image
                  src={Logo}
                  alt="AS Solutions Logo"
                  height="40px"
                  width="auto"
                  objectFit="contain"
                />
              </Box>

              <Box flex="1" maxW="2xl">
                <form onSubmit={validateAndSearch}>
                  <InputGroup size="lg">
                    <InputLeftElement>
                      <Icon as={FaSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Que voulez-vous trouver ?"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      borderRadius="full"
                      border="1px"
                      px={2}
                      borderColor={searchError ? "red.300" : "gray.300"}
                      focusBorderColor={
                        searchError ? "red.500" : "rgb(239,48,84)"
                      }
                      bg="white"
                      _placeholder={{ color: "gray.500" }}
                      fontSize="md"
                      _focus={{
                        borderColor: searchError ? "red.500" : "rgb(239,48,84)",
                        shadow: searchError
                          ? "0 0 0 1px red.500"
                          : "0 0 0 1px rgb(239,48,84)",
                      }}
                    />
                  </InputGroup>
                  {searchError && (
                    <Text fontSize="xs" color="red.500" mt={1} ml={4}>
                      {searchError}
                    </Text>
                  )}
                </form>
              </Box>

              <HStack spacing={4} flexShrink={0} ml={6}>
                <Button
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ color: "rgb(239,48,84)" }}
                >
                  Log in
                </Button>
                <IconButton
                  icon={<FaBell />}
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: "rgb(239,48,84)" }}
                  aria-label="Notifications"
                />
                <IconButton
                  icon={<FaHeart />}
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: "red.500" }}
                  aria-label="Wishlist"
                />
                <IconButton
                  icon={<FaShoppingCart />}
                  variant="ghost"
                  color="gray.600"
                  _hover={{ color: "rgb(239,48,84)" }}
                  aria-label="Cart"
                />
                <Button
                  bg="rgb(239,48,84)"
                  color="white"
                  size="sm"
                  _hover={{ bg: "rgb(219,28,64)" }}
                  borderRadius="8px"
                  px={4}
                  fontFamily={"Bricolage Grotesque"}
                >
                  Get the app
                </Button>
              </HStack>
            </Flex>
          </Box>

          <Box display={{ base: "block", md: "none" }}>
            <Flex align="center" justify="space-between" py={3} px={2}>
              <Box
                flexShrink={0}
                mr={6}
                // Remove the as="a" and href="/" props here too
              >
                <Link to="/">
                  <Image
                    src={Logo}
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
                <IconButton
                  icon={<FaHeart />}
                  variant="ghost"
                  size="sm"
                  color="gray.600"
                  _hover={{ color: "red.500" }}
                  aria-label="Wishlist"
                />
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="full"
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
                color="gray.600"
                _hover={{ color: "rgb(239,48,84)" }}
                fontSize="sm"
                fontFamily={"Bricolage Grotesque"}
              >
                Log in
              </Button>
              <Button
                bg="rgb(239,48,84)"
                color="white"
                size="sm"
                _hover={{ bg: "rgb(219,28,64)" }}
                borderRadius="full"
                px={4}
                fontSize="xs"
                fontFamily={"Bricolage Grotesque"}
              >
                Get the app
              </Button>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Mobile area Header */}
      <Box
        bg="white"
        shadow="sm"
        position="sticky"
        top="0"
        zIndex="1000"
        display={{ base: "block", md: "none" }}
      >
        <Box bg="gray.800" py={2} px={4}>
          <HStack spacing={2} justify="center">
            <Icon as={FaShippingFast} color="white" fontSize="sm" />
            <Text fontSize="xs" color="white" textAlign="center">
              Buy at As Solutions for exclusive offers!
            </Text>
          </HStack>
        </Box>
        <Container maxW="8xl">
          {/* Mobile Header - Like reference design */}
          <Box display={{ base: "block", md: "none" }}>
            {/* Top bar with delivery info */}

            {/* Main header row */}
            <Flex align="center" justify="space-between" py={3} px={4}>
              {/* Logo */}
              <Box flexShrink={0} mr={6}>
                <Link to="/">
                  <Image
                    src={Logo}
                    alt="AS Solutions Logo"
                    height="40px"
                    width="auto"
                    objectFit="contain"
                  />
                </Link>
              </Box>

              {/* Right side - Wishlist icon */}
              <IconButton
                icon={<FaHeart />}
                variant="ghost"
                size="md"
                color="gray.600"
                _hover={{ color: "red.500" }}
                aria-label="Wishlist"
                borderRadius="full"
              />
            </Flex>

            {/* Search Bar - Full width like reference */}
            <Box flex="1" maxW="2xl" mb={2}>
              <form onSubmit={validateAndSearch}>
                <InputGroup size="lg">
                  <InputLeftElement>
                    <Icon as={FaSearch} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Que voulez-vous trouver?"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    borderRadius="full"
                    border="1px"
                    px={2}
                    borderColor={searchError ? "red.300" : "gray.300"}
                    focusBorderColor={
                      searchError ? "red.500" : "rgb(239,48,84)"
                    }
                    bg="white"
                    _placeholder={{ color: "gray.500" }}
                    fontSize="md"
                    _focus={{
                      borderColor: searchError ? "red.500" : "rgb(239,48,84)",
                      shadow: searchError
                        ? "0 0 0 1px red.500"
                        : "0 0 0 1px rgb(239,48,84)",
                    }}
                  />
                </InputGroup>
                {searchError && (
                  <Text fontSize="xs" color="red.500" mt={1} ml={4}>
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
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        shadow="lg"
        zIndex="1000"
        px={0}
      >
        <HStack spacing={0} justify="space-around" py={2} px={1}>
          {/* Home */}
          <VStack spacing={1} flex={1} py={2} cursor="pointer">
            <Icon as={FaHome} fontSize="lg" color="rgb(239,48,84)" />
            <Text
              fontSize="xs"
              color="rgb(239,48,84)"
              fontWeight="semibold"
              textAlign="center"
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
            <Icon as={FaBars} fontSize="lg" color="gray.600" />
            <Text fontSize="xs" color="gray.600" textAlign="center">
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
          <VStack
            spacing={1}
            flex={1}
            py={2}
            cursor="pointer"
            position="relative"
          >
            <Box position="relative">
              <Icon as={FaShoppingCart} fontSize="lg" color="gray.600" />
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                bg="rgb(239,48,84)"
                color="white"
                borderRadius="full"
                fontSize="2xs"
                minW="16px"
                h="16px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                0
              </Badge>
            </Box>
            <Text fontSize="xs" color="gray.600" textAlign="center">
              Panier
            </Text>
          </VStack>

          {/* Chat */}
          <VStack spacing={1} flex={1} py={2} cursor="pointer">
            <Icon as={FaComments} fontSize="lg" color="gray.600" />
            <Text fontSize="xs" color="gray.600" textAlign="center">
              Chat
            </Text>
          </VStack>

          {/* Account */}
          <VStack spacing={1} flex={1} py={2} cursor="pointer">
            <Icon as={FaUser} fontSize="lg" color="gray.600" />
            <Text fontSize="xs" color="gray.600" textAlign="center">
              Compte
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Category Navigation - Responsive for both desktop and mobile */}
      <Box
        bg="white"
        borderTop="1px"
        borderColor="gray.200"
        py={2}
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
                  variant="solid"
                  bg="rgb(239,48,84)"
                  color="white"
                  _hover={{
                    bg: "rgb(219,28,64)",
                    transform: "translateY(-1px)",
                    shadow: "lg",
                  }}
                  fontSize="sm"
                  rounded="lg"
                  flexShrink={0}
                  px={4}
                  py={2}
                  h="auto"
                  transition="all 0.2s ease"
                  onMouseEnter={onCategoryOpen}
                  fontFamily="Bricolage Grotesque"
                >
                  All Categories
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

            {/* <Button
              leftIcon={<Icon as={FaFire} color="red.500" />}
              variant="ghost"
              color="gray.700"
              _hover={{ color: "red.600", bg: "red.50" }}
              fontWeight="medium"
              fontSize="sm"
              px={3}
              flexShrink={0}
              minW="auto"
              rounded="full"
            >
              Trending
            </Button> */}

            <Button
              leftIcon={<Icon as={FaStar} color="yellow.500" />}
              variant="ghost"
              color="gray.700"
              _hover={{ color: "yellow.600", bg: "yellow.50" }}
              fontWeight="medium"
              fontSize="sm"
              px={3}
              flexShrink={0}
              minW="auto"
              rounded="full"
            >
              Nouveautés
            </Button>

            <Button
              leftIcon={<Icon as={FaTags} color="purple.500" />}
              variant="ghost"
              color="gray.700"
              _hover={{ color: "purple.600", bg: "purple.50" }}
              fontWeight="medium"
              fontSize="sm"
              px={3}
              flexShrink={0}
              minW="auto"
              rounded="full"
            >
              Centre des offres
            </Button>

            {/* <Button
              leftIcon={<Icon as={FaPercent} color="green.500" />}
              variant="ghost"
              color="gray.700"
              _hover={{ color: "green.600", bg: "green.50" }}
              fontWeight="medium"
              fontSize="sm"
              px={3}
              flexShrink={0}
              minW="auto"
              rounded="full"
            >
              Weekly Deals
            </Button> */}

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
                      variant="ghost"
                      color="gray.700"
                      _hover={{
                        color: colors.color,
                        bg: colors.bgColor,
                        transform: "translateY(-1px)",
                        shadow: "sm",
                      }}
                      fontWeight="medium"
                      fontSize="sm"
                      px={3}
                      flexShrink={0}
                      minW="auto"
                      position="relative"
                      transition="all 0.2s ease"
                      borderBottom={
                        hoveredCategory === category.id
                          ? `2px solid ${colors.color}`
                          : "2px solid transparent"
                      }
                      onClick={() => {
                        if (hoveredCategory === category.id) {
                          setHoveredCategory(null);
                        } else {
                          setHoveredCategory(category.id);
                        }
                      }}
                      rounded="full"
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
                                    bg: "rgba(239,48,84,0.1)",
                                    color: "rgb(239,48,84)",
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
                                  No subcategories available!
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
                                                color: "rgb(239,48,84)",
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
                                                    fontFamily="Bricolage Grotesque"
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

            <Button
              leftIcon={<Icon as={FaHandsHelping} color="blue.500" />}
              variant="ghost"
              color="gray.700"
              _hover={{ color: "blue.600", bg: "blue.50" }}
              fontWeight="medium"
              fontSize="sm"
              px={3}
              flexShrink={0}
              minW="auto"
            >
              Service Client
            </Button>
          </HStack>

          {/* Mobile Version - Horizontal Scrollable */}
          <Box display={{ base: "block", md: "none" }} px={2} py={1}>
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
            >
              <HStack
                spacing={3}
                align="center"
                minW="max-content"
                py={2}
                px={2}
              >
                {/* <Button
                  leftIcon={<Icon as={FaFire} color="red.500" />}
                  variant="ghost"
                  color="gray.700"
                  _hover={{ color: "red.600", bg: "red.50" }}
                  _active={{ color: "red.600", bg: "red.100" }}
                  fontWeight="medium"
                  fontSize="sm"
                  px={4}
                  py={2}
                  h="auto"
                  flexShrink={0}
                  minW="auto"
                  rounded="full"
                  whiteSpace="nowrap"
                  fontFamily="Bricolage Grotesque"
                >
                  Trending
                </Button> */}

                <Button
                  leftIcon={<Icon as={FaStar} color="yellow.500" />}
                  variant="ghost"
                  color="gray.700"
                  _hover={{ color: "yellow.600", bg: "yellow.50" }}
                  _active={{ color: "yellow.600", bg: "yellow.100" }}
                  fontWeight="medium"
                  fontSize="sm"
                  px={4}
                  py={2}
                  h="auto"
                  flexShrink={0}
                  minW="auto"
                  rounded="full"
                  whiteSpace="nowrap"
                  fontFamily="Bricolage Grotesque"
                >
                  Nouveautés
                </Button>

                <Button
                  leftIcon={<Icon as={FaTags} color="purple.500" />}
                  variant="ghost"
                  color="gray.700"
                  _hover={{ color: "purple.600", bg: "purple.50" }}
                  _active={{ color: "purple.600", bg: "purple.100" }}
                  fontWeight="medium"
                  fontSize="sm"
                  px={4}
                  py={2}
                  h="auto"
                  flexShrink={0}
                  minW="auto"
                  rounded="full"
                  whiteSpace="nowrap"
                  fontFamily="Bricolage Grotesque"
                >
                  Centre des offres
                </Button>

                {/* <Button
                  leftIcon={<Icon as={FaPercent} color="green.500" />}
                  variant="ghost"
                  color="gray.700"
                  _hover={{ color: "green.600", bg: "green.50" }}
                  _active={{ color: "green.600", bg: "green.100" }}
                  fontWeight="medium"
                  fontSize="sm"
                  px={4}
                  py={2}
                  h="auto"
                  flexShrink={0}
                  minW="auto"
                  rounded="full"
                  whiteSpace="nowrap"
                  fontFamily="Bricolage Grotesque"
                >
                  Weekly Deals
                </Button> */}

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
                        variant="ghost"
                        color="gray.700"
                        _hover={{
                          color: colors.color,
                          bg: colors.bgColor,
                        }}
                        _active={{
                          color: colors.color,
                          bg: colors.bgColor,
                        }}
                        fontWeight="medium"
                        fontSize="sm"
                        px={4}
                        py={2}
                        h="auto"
                        flexShrink={0}
                        minW="auto"
                        rounded="full"
                        whiteSpace="nowrap"
                        fontFamily="Bricolage Grotesque"
                        onClick={() => {
                          navigateToCategory(category.slug);
                        }}
                      >
                        {category.name}
                      </Button>
                    );
                  })
                )}

                <Button
                  leftIcon={<Icon as={FaHandsHelping} color="blue.500" />}
                  variant="ghost"
                  color="gray.700"
                  _hover={{ color: "blue.600", bg: "blue.50" }}
                  _active={{ color: "blue.600", bg: "blue.100" }}
                  fontWeight="medium"
                  fontSize="sm"
                  px={4}
                  py={2}
                  h="auto"
                  flexShrink={0}
                  minW="auto"
                  rounded="full"
                  whiteSpace="nowrap"
                  fontFamily="Bricolage Grotesque"
                >
                  Support
                </Button>
              </HStack>
            </Box>

            {/* Subtle scroll indicator */}
            <Box
              position="absolute"
              right="0"
              top="0"
              bottom="0"
              w="20px"
              bg="linear-gradient(to left, rgba(255,255,255,0.8), transparent)"
              pointerEvents="none"
              display={{ base: "block", md: "none" }}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Navbar;
