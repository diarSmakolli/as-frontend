import React, { useState, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Checkbox,
  SimpleGrid,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useColorModeValue,
  Image,
  Center,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  ButtonGroup,
  Collapse,
  IconButton,
  Tooltip,
  Divider,
  Switch,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Stack,
} from "@chakra-ui/react";
import {
  FiFolder,
  FiBookOpen,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiCheck,
  FiX,
  FiEye,
  FiEyeOff,
  FiFilter,
  FiGrid,
  FiList,
} from "react-icons/fi";

const CategoriesSelector = ({
  categories,
  selectedCategories,
  onCategoriesChange,
}) => {
  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [viewMode, setViewMode] = useState("tree"); // 'tree' or 'grid'
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [autoExpandOnSearch, setAutoExpandOnSearch] = useState(true);

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const parentBgColor = useColorModeValue("blue.50", "blue.900");
  const childBgColor = useColorModeValue("gray.50", "gray.700");
  const level2BgColor = useColorModeValue("purple.50", "purple.900");
  const searchBg = useColorModeValue("gray.50", "gray.700");

  const handleCategoryToggle = (categoryId) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    onCategoriesChange(newSelected);
  };

  // Toggle category expansion
  const toggleCategoryExpansion = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Bulk selection helpers
  const selectAllCategories = () => {
    const allIds = flattenCategories(categories).map((cat) => cat.id);
    onCategoriesChange(allIds);
  };

  const clearAllCategories = () => {
    onCategoriesChange([]);
  };

  const selectCategoryAndChildren = (categoryId) => {
    const category = findCategoryById(categories, categoryId);
    if (!category) return;

    const childrenIds = flattenCategories([category]).map((cat) => cat.id);
    const newSelected = [...new Set([...selectedCategories, ...childrenIds])];
    onCategoriesChange(newSelected);
  };

  const deselectCategoryAndChildren = (categoryId) => {
    const category = findCategoryById(categories, categoryId);
    if (!category) return;

    const childrenIds = flattenCategories([category]).map((cat) => cat.id);
    const newSelected = selectedCategories.filter(
      (id) => !childrenIds.includes(id)
    );
    onCategoriesChange(newSelected);
  };

  // Enhanced search and filtering
  const filteredCategories = useMemo(() => {
    if (!searchTerm && !showOnlySelected) return categories;

    const filterCategory = (category) => {
      const matchesSearch =
        !searchTerm ||
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description &&
          category.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const isSelected = selectedCategories.includes(category.id);
      const matchesSelectedFilter = !showOnlySelected || isSelected;

      const filteredChildren = category.children
        ? category.children.map(filterCategory).filter(Boolean)
        : [];

      if (
        (matchesSearch && matchesSelectedFilter) ||
        filteredChildren.length > 0
      ) {
        return {
          ...category,
          children: filteredChildren,
        };
      }

      return null;
    };

    const filtered = categories.map(filterCategory).filter(Boolean);

    // Auto-expand categories when searching
    if (searchTerm && autoExpandOnSearch) {
      const newExpanded = new Set(expandedCategories);
      flattenCategories(filtered).forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          newExpanded.add(cat.id);
        }
      });
      setExpandedCategories(newExpanded);
    }

    return filtered;
  }, [
    categories,
    searchTerm,
    showOnlySelected,
    selectedCategories,
    autoExpandOnSearch,
    expandedCategories,
  ]);

  // Flatten all categories for search and display
  const flattenCategories = (categoryList, level = 0) => {
    let flattened = [];

    categoryList.forEach((category) => {
      flattened.push({
        ...category,
        level,
        path: buildCategoryPath(category, categoryList),
      });

      if (category.children && category.children.length > 0) {
        flattened = [
          ...flattened,
          ...flattenCategories(category.children, level + 1),
        ];
      }
    });

    return flattened;
  };

  // Build full category path for display
  const buildCategoryPath = (category, allCategories, path = []) => {
    if (category.parent_id) {
      const parent = findCategoryById(allCategories, category.parent_id);
      if (parent) {
        path = buildCategoryPath(parent, allCategories, path);
      }
    }
    path.push(category.name);
    return path;
  };

  // Find category by ID in nested structure
  const findCategoryById = (categoryList, id) => {
    for (const category of categoryList) {
      if (category.id === id) {
        return category;
      }
      if (category.children && category.children.length > 0) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Get category display name with full path
  const getCategoryDisplayName = (category) => {
    if (category.path) {
      return category.path.join(" > ");
    }
    return category.name;
  };

  const renderCategoryItem = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isSelected = selectedCategories.includes(category.id);
    const isExpanded = expandedCategories.has(category.id);
    const paddingLeft = level * 4;

    const selectedChildrenCount = hasChildren
      ? flattenCategories(category.children).filter((child) =>
          selectedCategories.includes(child.id)
        ).length
      : 0;

    // Choose background color based on level
    let bgColorForLevel = parentBgColor;
    if (level === 1) bgColorForLevel = childBgColor;
    if (level === 2) bgColorForLevel = level2BgColor;

    return (
      <Box key={category.id}>
        {/* Category Item */}
        <Box
          pl={paddingLeft}
          py={2}
          px={3}
          bg={bgColorForLevel}
          borderRadius="md"
          border="1px"
          borderColor={isSelected ? "blue.400" : borderColor}
          mb={1}
          boxShadow={isSelected ? "0 0 0 2px rgba(66, 153, 225, 0.3)" : "none"}
          _hover={{
            borderColor: "blue.300",
            boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.2)",
          }}
          transition="all 0.2s"
        >
          <HStack spacing={2} align="center">
            {/* Expand/Collapse Button */}
            {hasChildren && (
              <IconButton
                size="xs"
                variant="ghost"
                colorScheme="gray"
                icon={isExpanded ? <FiChevronDown /> : <FiChevronRight />}
                onClick={() => toggleCategoryExpansion(category.id)}
                aria-label={isExpanded ? "Collapse" : "Expand"}
              />
            )}

            {/* Category Checkbox */}
            <Checkbox
              isChecked={isSelected}
              onChange={() => handleCategoryToggle(category.id)}
              colorScheme="blue"
              size="sm"
            />

            {/* Category Image/Icon */}
            {category.image_url ? (
              <Box
                boxSize="24px"
                borderRadius="sm"
                overflow="hidden"
                border="1px"
                borderColor="gray.200"
              >
                <Image
                  src={category.image_url}
                  alt={category.name}
                  boxSize="100%"
                  objectFit="cover"
                  fallback={
                    <Center bg="gray.100" boxSize="100%">
                      <Icon
                        as={hasChildren ? FiBookOpen : FiFolder}
                        color="gray.400"
                        fontSize="xs"
                      />
                    </Center>
                  }
                />
              </Box>
            ) : (
              <Icon
                as={hasChildren ? FiBookOpen : FiFolder}
                fontSize="md"
                color={
                  level === 0
                    ? "blue.500"
                    : level === 1
                    ? "purple.500"
                    : "orange.500"
                }
              />
            )}

            {/* Category Info */}
            <VStack align="start" spacing={0} flex={1}>
              <HStack spacing={2} align="center" wrap="wrap">
                <Text
                  fontSize="sm"
                  color="gray.800"
                  fontWeight={
                    level === 0 ? "semibold" : level === 1 ? "medium" : "normal"
                  }
                  noOfLines={1}
                >
                  {category.name}
                </Text>

                {/* Level indicator */}
                <Badge
                  size="xs"
                  colorScheme={
                    level === 0 ? "blue" : level === 1 ? "purple" : "orange"
                  }
                  variant="subtle"
                >
                  L{level}
                </Badge>

                {/* Children count with selection info */}
                {hasChildren && (
                  <Badge
                    size="xs"
                    colorScheme={selectedChildrenCount > 0 ? "green" : "gray"}
                    variant={selectedChildrenCount > 0 ? "solid" : "outline"}
                  >
                    {selectedChildrenCount}/
                    {flattenCategories(category.children).length}
                  </Badge>
                )}
              </HStack>

              {/* Description */}
              {category.description && (
                <Text fontSize="xs" color="gray.600" noOfLines={1}>
                  {category.description}
                </Text>
              )}
            </VStack>

            {/* Quick Actions */}
            {hasChildren && (
              <ButtonGroup size="xs" variant="ghost">
                <Tooltip label="Select all children">
                  <IconButton
                    icon={<FiCheck />}
                    colorScheme="green"
                    onClick={() => selectCategoryAndChildren(category.id)}
                    aria-label="Select all children"
                  />
                </Tooltip>
                <Tooltip label="Deselect all children">
                  <IconButton
                    icon={<FiX />}
                    colorScheme="red"
                    onClick={() => deselectCategoryAndChildren(category.id)}
                    aria-label="Deselect all children"
                  />
                </Tooltip>
              </ButtonGroup>
            )}
          </HStack>
        </Box>

        {/* Children Categories - Collapsible */}
        {hasChildren && (
          <Collapse in={isExpanded} animateOpacity>
            <Box ml={6} mt={1} mb={2}>
              {category.children.map((child) =>
                renderCategoryItem(child, level + 1)
              )}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  // Enhanced flat view with better organization
  const renderFlatView = () => {
    const flatCategories = flattenCategories(filteredCategories);

    if (flatCategories.length === 0) {
      return (
        <Box
          p={8}
          textAlign="center"
          borderRadius="md"
          bg="gray.50"
          border="1px dashed"
          borderColor="gray.200"
        >
          <Text color="gray.500">
            {searchTerm
              ? `No categories match "${searchTerm}"`
              : "No categories found"}
          </Text>
        </Box>
      );
    }

    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
        {flatCategories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const displayName = getCategoryDisplayName(category);

          return (
            <Box
              key={category.id}
              p={3}
              bg={
                category.level === 0
                  ? parentBgColor
                  : category.level === 1
                  ? childBgColor
                  : level2BgColor
              }
              borderRadius="md"
              border="1px"
              borderColor={isSelected ? "blue.400" : borderColor}
              _hover={{
                borderColor: "blue.300",
                transform: "translateY(-1px)",
              }}
              boxShadow={
                isSelected ? "0 0 0 2px rgba(66, 153, 225, 0.3)" : "sm"
              }
              transition="all 0.2s"
              cursor="pointer"
              onClick={() => handleCategoryToggle(category.id)}
            >
              <VStack align="start" spacing={2}>
                <HStack spacing={2} align="center" w="100%">
                  <Checkbox
                    isChecked={isSelected}
                    onChange={() => handleCategoryToggle(category.id)}
                    colorScheme="blue"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Category Image */}
                  {category.image_url ? (
                    <Box
                      boxSize="20px"
                      borderRadius="sm"
                      overflow="hidden"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Image
                        src={category.image_url}
                        alt={category.name}
                        boxSize="100%"
                        objectFit="cover"
                        fallback={
                          <Center bg="gray.100" boxSize="100%">
                            <Icon
                              as={FiFolder}
                              color="gray.400"
                              fontSize="xs"
                            />
                          </Center>
                        }
                      />
                    </Box>
                  ) : (
                    <Icon
                      as={FiFolder}
                      fontSize="sm"
                      color={
                        category.level === 0
                          ? "blue.500"
                          : category.level === 1
                          ? "purple.500"
                          : "orange.500"
                      }
                    />
                  )}

                  <Text
                    fontSize="sm"
                    color="gray.800"
                    fontWeight={category.level === 0 ? "semibold" : "normal"}
                    noOfLines={1}
                    flex={1}
                  >
                    {category.name}
                  </Text>

                  <Badge
                    size="xs"
                    colorScheme={
                      category.level === 0
                        ? "blue"
                        : category.level === 1
                        ? "purple"
                        : "orange"
                    }
                    variant="subtle"
                  >
                    L{category.level}
                  </Badge>
                </HStack>

                {/* Full path for nested categories */}
                {category.level > 0 && displayName !== category.name && (
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    fontStyle="italic"
                    noOfLines={1}
                  >
                    {displayName}
                  </Text>
                )}

                {/* Description */}
                {category.description && (
                  <Text fontSize="xs" color="gray.600" noOfLines={2}>
                    {category.description}
                  </Text>
                )}
              </VStack>
            </Box>
          );
        })}
      </SimpleGrid>
    );
  };

  if (!categories || categories.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderRadius="md"
        bg="gray.50"
        border="1px dashed"
        borderColor="gray.200"
      >
        <Icon as={FiFolder} fontSize="3xl" color="gray.400" mb={4} />
        <Text color="gray.500" fontSize="lg" fontWeight="medium">
          No categories available
        </Text>
        <Text color="gray.400" fontSize="sm">
          Categories will appear here once they're loaded
        </Text>
      </Box>
    );
  }

  const totalCategories = flattenCategories(categories).length;
  const filteredCount = flattenCategories(filteredCategories).length;

  return (
    <VStack spacing={6} align="stretch">
      {/* Search and Controls Header */}
      <Box>
        <VStack spacing={4} align="stretch">
          {/* Search Bar */}
          <InputGroup size="md">
            <InputLeftElement>
              <Icon as={FiSearch} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg={searchBg}
              borderColor={borderColor}
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #4299E1",
              }}
            />
          </InputGroup>

          {/* Control Bar */}
          <HStack spacing={4} wrap="wrap" justify="space-between">
            {/* View Mode Toggle */}
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                leftIcon={<FiList />}
                onClick={() => setViewMode("tree")}
                colorScheme={viewMode === "tree" ? "blue" : "gray"}
                variant={viewMode === "tree" ? "solid" : "outline"}
              >
                Tree View
              </Button>
              <Button
                leftIcon={<FiGrid />}
                onClick={() => setViewMode("grid")}
                colorScheme={viewMode === "grid" ? "blue" : "gray"}
                variant={viewMode === "grid" ? "solid" : "outline"}
              >
                Grid View
              </Button>
            </ButtonGroup>

            {/* Filter Controls */}
            <HStack spacing={3}>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="show-selected" mb="0" fontSize="sm">
                  Selected only
                </FormLabel>
                <Switch
                  id="show-selected"
                  size="sm"
                  colorScheme="blue"
                  isChecked={showOnlySelected}
                  onChange={(e) => setShowOnlySelected(e.target.checked)}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="auto-expand" mb="0" fontSize="sm">
                  Auto-expand
                </FormLabel>
                <Switch
                  id="auto-expand"
                  size="sm"
                  colorScheme="blue"
                  isChecked={autoExpandOnSearch}
                  onChange={(e) => setAutoExpandOnSearch(e.target.checked)}
                />
              </FormControl>
            </HStack>

            {/* Bulk Actions */}
            <ButtonGroup size="sm" variant="outline">
              <Tooltip label="Select all categories">
                <Button
                  leftIcon={<FiCheck />}
                  colorScheme="green"
                  onClick={selectAllCategories}
                >
                  All
                </Button>
              </Tooltip>
              <Tooltip label="Clear all selections">
                <Button
                  leftIcon={<FiX />}
                  colorScheme="red"
                  onClick={clearAllCategories}
                  isDisabled={selectedCategories.length === 0}
                >
                  None
                </Button>
              </Tooltip>
              <Tooltip label="Expand all categories">
                <Button
                  leftIcon={<FiEye />}
                  onClick={() =>
                    setExpandedCategories(
                      new Set(
                        flattenCategories(categories).map((cat) => cat.id)
                      )
                    )
                  }
                >
                  Expand
                </Button>
              </Tooltip>
              <Tooltip label="Collapse all categories">
                <Button
                  leftIcon={<FiEyeOff />}
                  onClick={() => setExpandedCategories(new Set())}
                >
                  Collapse
                </Button>
              </Tooltip>
            </ButtonGroup>
          </HStack>

          {/* Stats Bar */}
          {(searchTerm || showOnlySelected) && (
            <Alert status="info" borderRadius="md" variant="left-accent">
              <AlertIcon />
              <Text fontSize="sm">
                Showing {filteredCount} of {totalCategories} categories
                {searchTerm && ` matching "${searchTerm}"`}
                {showOnlySelected && ` (selected only)`}
              </Text>
            </Alert>
          )}
        </VStack>
      </Box>

      <Divider />

      {/* Category Display */}
      <Box>
        {viewMode === "tree" ? (
          <VStack spacing={1} align="stretch">
            {filteredCategories.length === 0 ? (
              <Box
                p={8}
                textAlign="center"
                borderRadius="md"
                bg="gray.50"
                border="1px dashed"
                borderColor="gray.200"
              >
                <Text color="gray.500">
                  {searchTerm
                    ? `No categories match "${searchTerm}"`
                    : "No categories found"}
                </Text>
              </Box>
            ) : (
              filteredCategories.map((category) =>
                renderCategoryItem(category, 0)
              )
            )}
          </VStack>
        ) : (
          renderFlatView()
        )}
      </Box>

      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <Box>
          <HStack mb={3} justify="space-between">
            <HStack>
              <Text fontSize="md" fontWeight="medium" color="gray.700">
                Selected Categories
              </Text>
              <Badge colorScheme="blue" variant="solid">
                {selectedCategories.length}
              </Badge>
            </HStack>

            <Button
              size="sm"
              variant="ghost"
              colorScheme="red"
              leftIcon={<FiX />}
              onClick={clearAllCategories}
            >
              Clear All
            </Button>
          </HStack>

          <Wrap spacing={2}>
            {selectedCategories.map((categoryId) => {
              const category = findCategoryById(categories, categoryId);
              if (!category) return null;

              const displayName = getCategoryDisplayName({
                ...category,
                path: buildCategoryPath(category, categories),
              });

              return (
                <WrapItem key={categoryId}>
                  <Tag
                    size="md"
                    colorScheme={
                      category.level === 0
                        ? "blue"
                        : category.level === 1
                        ? "purple"
                        : "orange"
                    }
                    variant="solid"
                    borderRadius="full"
                  >
                    <HStack spacing={1}>
                      {category.image_url ? (
                        <Box
                          boxSize="16px"
                          borderRadius="sm"
                          overflow="hidden"
                          mr={1}
                        >
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            boxSize="100%"
                            objectFit="cover"
                          />
                        </Box>
                      ) : (
                        <Icon as={FiFolder} fontSize="xs" />
                      )}
                      <TagLabel fontSize="xs">{category.name}</TagLabel>
                    </HStack>
                    <TagCloseButton
                      onClick={() => handleCategoryToggle(categoryId)}
                    />
                  </Tag>
                </WrapItem>
              );
            })}
          </Wrap>

          {/* Enhanced Selection Summary */}
          <Box
            mt={4}
            p={4}
            bg="blue.50"
            borderRadius="md"
            borderLeft="4px"
            borderColor="blue.400"
          >
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" color="blue.800" fontWeight="medium">
                📊 Selection Summary:
              </Text>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={4}
                fontSize="xs"
                color="blue.700"
              >
                <HStack>
                  <Badge colorScheme="blue" size="sm">
                    {
                      selectedCategories.filter((id) => {
                        const cat = findCategoryById(categories, id);
                        return cat && cat.level === 0;
                      }).length
                    }
                  </Badge>
                  <Text>Parent categories</Text>
                </HStack>
                <HStack>
                  <Badge colorScheme="purple" size="sm">
                    {
                      selectedCategories.filter((id) => {
                        const cat = findCategoryById(categories, id);
                        return cat && cat.level === 1;
                      }).length
                    }
                  </Badge>
                  <Text>Level-1 subcategories</Text>
                </HStack>
                <HStack>
                  <Badge colorScheme="orange" size="sm">
                    {
                      selectedCategories.filter((id) => {
                        const cat = findCategoryById(categories, id);
                        return cat && cat.level >= 2;
                      }).length
                    }
                  </Badge>
                  <Text>Deep subcategories</Text>
                </HStack>
              </Stack>
              <Text fontSize="xs" color="blue.600" fontStyle="italic">
                💡 Categories help organize your products for better customer
                navigation and discovery
              </Text>
            </VStack>
          </Box>
        </Box>
      )}
    </VStack>
  );
};

export default CategoriesSelector;
