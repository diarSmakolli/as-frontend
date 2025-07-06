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
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
      size="sm"
      bg="gray.100"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton zIndex={10} />

        {/* Header with Back Navigation */}
        <DrawerHeader
          bg="gray.100"
          color="black"
          fontFamily="Bricolage Grotesque"
          fontSize="lg"
          position="relative"
          pr={12}
        >
          <HStack spacing={2}>
            {navigationStack.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                color="black"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                onClick={handleBackNavigation}
                p={1}
                minW="auto"
              >
                <Icon as={FaChevronLeft} fontSize="lg" />
              </Button>
            )}
            <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
              {getCurrentTitle()}
            </Text>
          </HStack>
        </DrawerHeader>

        {/* Breadcrumb */}
        {navigationStack.length > 0 && (
          <Box
            px={4}
            py={2}
            bg="gray.50"
            borderBottom="1px"
            borderColor="gray.200"
          >
            <HStack spacing={1} fontSize="xs" color="gray.600">
              <Text>Collections</Text>
              {navigationStack.map((item, index) => (
                <React.Fragment key={index}>
                  <Icon as={FaChevronRight} fontSize="xs" />
                  <Text noOfLines={1}>{item.name}</Text>
                </React.Fragment>
              ))}
            </HStack>
          </Box>
        )}

        <DrawerBody p={0}>
          <VStack spacing={0} align="stretch">
            {loading
              ? // Loading skeleton
                Array.from({ length: 8 }).map((_, i) => (
                  <Box key={i} p={4} borderBottom="1px" borderColor="gray.100">
                    <HStack spacing={3}>
                      <Skeleton w="8" h="8" borderRadius="md" />
                      <Box flex={1}>
                        <SkeletonText noOfLines={1} w="70%" />
                      </Box>
                      <Skeleton w="4" h="4" />
                    </HStack>
                  </Box>
                ))
              : currentCategories.map((category, index) => (
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
                      _active={{ bg: "gray.100" }}
                      onClick={() => handleCategoryClick(category)}
                      minH="60px"
                    >
                      <HStack spacing={3} flex={1}>
                        <Box w="8" h="8" flexShrink={0}>
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
                            <Box
                              w="full"
                              h="full"
                              bg="gray.100"
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon
                                as={getCategoryIcon(category.name)}
                                color="rgb(243, 0, 0)"
                                fontSize="lg"
                              />
                            </Box>
                          )}
                        </Box>
                        <Box flex={1} textAlign="left">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            fontFamily="Bricolage Grotesque"
                            color="gray.800"
                            noOfLines={1}
                          >
                            {category.name}
                          </Text>
                          {/* Show subcategory count if has children */}
                          {hasChildren(category) && (
                            <Text fontSize="xs" color="gray.500" mt={0.5}>
                              {category.children.length} subcategories
                            </Text>
                          )}
                        </Box>
                      </HStack>

                      {/* Show chevron for subcategories or shop badge for leaf categories */}
                      {hasChildren(category) ? (
                        <Icon
                          as={FaChevronRight}
                          fontSize="sm"
                          color="gray.400"
                        />
                      ) : (
                        <Badge
                          size="sm"
                          colorScheme="red"
                          variant="subtle"
                          fontSize="xs"
                        >
                          Shop
                        </Badge>
                      )}
                    </Button>
                  </Box>
                ))}

            {/* Empty state */}
            {!loading && currentCategories.length === 0 && (
              <Box py={16} px={4} textAlign="center">
                <Box
                  w="16"
                  h="16"
                  bg="gray.100"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mx="auto"
                  mb={4}
                >
                  <Icon as={FaBox} fontSize="2xl" color="gray.400" />
                </Box>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  fontFamily="Bricolage Grotesque"
                >
                  No available collections.
                </Text>
              </Box>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCategoryNavigation;
