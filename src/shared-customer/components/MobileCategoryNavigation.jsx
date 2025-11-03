import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Image,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Skeleton,
  SkeletonText,
  Divider,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaChevronRight,
  FaChevronLeft,
  FaBox,
  FaHome,
  FaTshirt,
  FaLaptop,
  FaCar,
  FaBaby,
  FaGamepad,
  FaMusic,
  FaCamera,
  FaDumbbell,
  FaPalette,
  FaUtensils,
  FaShieldAlt,
  FaTags,
  FaFire,
  FaHotjar,
  FaPercent,
  FaGift,
  FaTimes,
  FaArrowRight,
  FaSearch,
  FaShoppingBag,
  FaShoppingCart,
  FaUndo,
  FaCheck,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";


const MobileCategoryNavigation = ({ isOpen, onClose, categories, loading }) => {
  const navigate = useNavigate();
  const [navigationStack, setNavigationStack] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);

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

  // Initialize with root categories
  useEffect(() => {
    if (categories && categories.length > 0) {
      const rootCats = getRootCategories(categories);
      setCurrentCategories(rootCats);
      setNavigationStack([]);
    }
  }, [categories]);

  useEffect(() => {
    if (!isOpen) {
      setNavigationStack([]);
      setCurrentCategories(getRootCategories(categories));
    }
  }, [isOpen, categories]);

  const handleCategoryClick = (category) => {
    if (category.children && category.children.length > 0) {
      setNavigationStack((prev) => [
        ...prev,
        { name: category.name, categories: currentCategories },
      ]);
      setCurrentCategories(category.children);
    } else {
      const categorySlug =
        category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
      navigate(`/category/${categorySlug}`);
      onClose();
    }
  };

  const handleBackNavigation = () => {
    if (navigationStack.length > 0) {
      const previous = navigationStack[navigationStack.length - 1];
      setCurrentCategories(previous.categories);
      setNavigationStack((prev) => prev.slice(0, -1));
    }
  };

  const getCurrentTitle = () => {
    if (navigationStack.length === 0) {
      return "Collections";
    }
    return navigationStack[navigationStack.length - 1].name;
  };

  const hasChildren = (category) => {
    return category.children && category.children.length > 0;
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
      <DrawerOverlay bg="#fff" />
      <DrawerContent bg="#fff" maxW="100vw" w="100vw">
        {/* Simplified Clean Header */}
        <DrawerHeader
          bg="#fff"
          borderBottom="1px"
          borderColor="gray.200"
          p={0}
        >
          <VStack spacing={0} align="stretch">
            {/* Top Bar */}
            <HStack justify="space-between" align="center" p={4}>
              <HStack spacing={3}>
                {navigationStack.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    color="gray.600"
                    _hover={{ bg: "gray.100" }}
                    onClick={handleBackNavigation}
                    borderRadius="lg"
                    p={2}
                  >
                    <Icon as={FaChevronLeft} fontSize="lg" />
                  </Button>
                )}
                <VStack align="start" spacing={0}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="gray.800"
                    fontFamily="Airbnb Cereal VF"
                  >
                    {getCurrentTitle()}
                  </Text>
                </VStack>
              </HStack>

              <Button
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ bg: "gray.100" }}
                onClick={onClose}
                borderRadius="lg"
                p={2}
              >
                <Icon as={FaTimes} fontSize="lg" />
              </Button>
            </HStack>

            {/* Simple Breadcrumb */}
            {navigationStack.length > 0 && (
              <Box px={4} pb={4}>
                <HStack
                  spacing={2}
                  fontSize="sm"
                  color="gray.500"
                  overflowX="auto"
                  pb={2}
                  css={{
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                  }}
                >
                  <Button
                    variant="link"
                    size="sm"
                    color="gray.700"
                    fontWeight="medium"
                    onClick={() => {
                      setNavigationStack([]);
                      setCurrentCategories(getRootCategories(categories));
                    }}
                  >
                    Collections
                  </Button>
                  {navigationStack.map((item, index) => (
                    <React.Fragment key={index}>
                      <Text color="gray.300">/</Text>
                      <Button
                        variant="link"
                        size="sm"
                        color={
                          index === navigationStack.length - 1
                            ? "gray.800"
                            : "blue.500"
                        }
                        fontWeight={
                          index === navigationStack.length - 1
                            ? "semibold"
                            : "medium"
                        }
                        onClick={() => {
                          if (index < navigationStack.length - 1) {
                            const newStack = navigationStack.slice(
                              0,
                              index + 1
                            );
                            setNavigationStack(newStack);
                            setCurrentCategories(item.categories);
                          }
                        }}
                        fontFamily="Airbnb Cereal VF"
                        noOfLines={1}
                        maxW="120px"
                      >
                        {item.name}
                      </Button>
                    </React.Fragment>
                  ))}
                </HStack>
              </Box>
            )}
          </VStack>
        </DrawerHeader>

        <DrawerBody p={0} bg="#fff" rounded='3xl'>
          <Box h="100%" overflowY="auto">
            {loading ? (
              // Clean Loading State
              <VStack spacing={0} p={4}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Box
                    key={i}
                    w="full"
                    bg="white"
                    p={4}
                    borderBottom="1px"
                    borderColor="gray.100"
                  >
                    <HStack spacing={3}>
                      <Skeleton w="10" h="10" borderRadius="lg" />
                      <VStack align="start" spacing={1} flex={1}>
                        <SkeletonText noOfLines={1} w="70%" />
                        <SkeletonText noOfLines={1} w="40%" />
                      </VStack>
                      <Skeleton w="4" h="4" borderRadius="md" />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            ) : (
              <VStack spacing={0} align="stretch">
                {currentCategories.map((category, index) => {
                  const colors = [
                    "blue",
                    "purple",
                    "green",
                    "orange",
                    "pink",
                    "teal",
                    "red",
                    "cyan",
                  ];
                  const color = colors[index % colors.length];

                  return (
                    <Box
                      key={category.id}
                      rounded='full'
                      borderBottom="0px"
                      borderColor="gray.100"
                      transition="all 0.2s ease"
                      _hover={{
                        bg: "gray.50",
                      }}
                    >
                      <Box
                        as="div"
                        w="full"
                        p={4}
                        h="auto"
                        minH="70px"
                        borderRadius="none"
                        borderBottom="0px"
                        borderColor="gray.100"
                        _hover={{ bg: "gray.50" }}
                      >
                        <HStack spacing={4} w="full" align="center">
                          {/* Icon */}
                          <Box
                            w="12"
                            h="12"
                            bg={`${color}.100`}
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            {category.image_url ? (
                              <Image
                                src={category.image_url}
                                alt={category.name}
                                w="full"
                                h="full"
                                objectFit="cover"
                                borderRadius="xl"
                              />
                            ) : (
                              <Icon
                                as={getCategoryIcon(category.name)}
                                color={`${color}.600`}
                                fontSize="xl"
                              />
                            )}
                          </Box>

                          {/* Title (click to navigate) */}
                          <VStack
                            align="start"
                            spacing={1}
                            flex={1}
                            cursor="pointer"
                            onClick={() => {
                              // Direct navigation on title click
                              const categorySlug =
                                category.slug ||
                                category.name
                                  .toLowerCase()
                                  .replace(/\s+/g, "-");
                              navigate(`/category/${categorySlug}`);
                              onClose();
                            }}
                          >
                            <Text
                              fontSize="md"
                              fontWeight="500"
                              color="black"
                              textAlign="left"
                              w="full"
                              noOfLines={1}
                              fontFamily="Airbnb Cereal VF"
                            >
                              {category.name}
                            </Text>
                            {!hasChildren(category) && (
                              <Text fontSize="sm" color="green.600">
                                Prêt à acheter
                              </Text>
                            )}
                          </VStack>

                          {/* Arrow (click to expand) */}
                          {hasChildren(category) && (
                            <Icon
                              as={FaChevronRight}
                              color="gray.400"
                              fontSize="sm"
                              cursor="pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setNavigationStack((prev) => [
                                  ...prev,
                                  {
                                    name: category.name,
                                    categories: currentCategories,
                                  },
                                ]);
                                setCurrentCategories(category.children);
                              }}
                            />
                          )}
                        </HStack>
                      </Box>
                    </Box>
                  );
                })}
              </VStack>
            )}

            {/* Simple Empty State */}
            {!loading && currentCategories.length === 0 && (
              <VStack spacing={6} py={16} px={6}>
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

                <VStack spacing={3}>
                  <Text
                    fontSize="lg"
                    fontWeight="semibold"
                    color="gray.700"
                    textAlign="center"
                  >
                    Aucune collection trouvée
                  </Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Aucune collection disponible pour le moment.
                  </Text>
                </VStack>

                <Button
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="lg"
                  onClick={() => {
                    setNavigationStack([]);
                    setCurrentCategories(getRootCategories(categories));
                  }}
                >
                  Retour aux collections
                </Button>
              </VStack>
            )}

            {/* Bottom padding for scroll */}
            <Box h="20" />
          </Box>
        </DrawerBody>

        {/* Simple Footer */}
        <Box bg="#fff" borderTop="1px" borderColor="gray.200" p={4}>
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600" fontFamily="Airbnb Cereal VF">
              {currentCategories.length} collections disponibles
            </Text>

            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                borderRadius="lg"
                onClick={() => {
                  setNavigationStack([]);
                  setCurrentCategories(getRootCategories(categories));
                }}
                fontFamily="Airbnb Cereal VF"
              >
                Réinitialiser
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                borderRadius="lg"
                onClick={onClose}
                fontFamily="Airbnb Cereal VF"
              >
                Fermer
              </Button>
            </HStack>
          </HStack>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCategoryNavigation;
