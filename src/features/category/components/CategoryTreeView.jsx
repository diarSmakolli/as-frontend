import * as chakra from "@chakra-ui/react";
import { useState } from "react";
import { 
  FiChevronDown, 
  FiChevronRight, 
  FiEdit, 
  FiTrash2, 
  FiImage,
  FiEye 
} from "react-icons/fi";

const fontName = "Inter";

function CategoryNode({ 
  category, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onChangeImage,
  level = 0 
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const levelColors = [
    "blue.500",
    "green.500", 
    "purple.500",
    "orange.500",
    "red.500"
  ];

  const borderColor = levelColors[level % levelColors.length];

  return (
    <chakra.Box>
      <chakra.Flex
        align="center"
        p={3}
        borderLeft="3px solid"
        borderLeftColor={borderColor}
        bg="white"
        borderRadius="md"
        shadow="sm"
        mb={2}
        _hover={{ shadow: "md" }}
        transition="all 0.2s"
      >
        {/* Expand/Collapse Icon */}
        <chakra.IconButton
          icon={hasChildren ? (isExpanded ? <FiChevronDown /> : <FiChevronRight />) : <chakra.Box />}
          size="sm"
          variant="ghost"
          onClick={toggleExpanded}
          mr={2}
          opacity={hasChildren ? 1 : 0}
          cursor={hasChildren ? "pointer" : "default"}
        />

        {/* Category Image */}
        <chakra.Box mr={3}>
          {category.image_url ? (
            <chakra.Image
              src={category.image_url.startsWith('http') ? category.image_url : `http://localhost:8086${category.image_url}`}
              alt={category.name}
              boxSize="40px"
              objectFit="cover"
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
            />
          ) : (
            <chakra.Box
              boxSize="40px"
              bg="gray.100"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiImage color="gray.400" />
            </chakra.Box>
          )}
        </chakra.Box>

        {/* Category Info */}
        <chakra.Box flex={1}>
          <chakra.Text
            fontFamily={fontName}
            fontWeight="600"
            fontSize="sm"
            color="gray.900"
          >
            {category.name}
          </chakra.Text>
          {category.description && (
            <chakra.Text
              fontFamily={fontName}
              fontSize="xs"
              color="gray.600"
              noOfLines={1}
            >
              {category.description}
            </chakra.Text>
          )}
          <chakra.HStack spacing={2} mt={1}>
            <chakra.Badge
              colorScheme={borderColor.split('.')[0]}
              size="sm"
              fontFamily={fontName}
            >
              Level {category.level}
            </chakra.Badge>
            {category.is_parent && (
              <chakra.Badge colorScheme="green" size="sm" fontFamily={fontName}>
                Parent
              </chakra.Badge>
            )}
            {!category.is_active && (
              <chakra.Badge colorScheme="red" size="sm" fontFamily={fontName}>
                Inactive
              </chakra.Badge>
            )}
          </chakra.HStack>
          <chakra.HStack spacing={2} mt={1}>
            <chakra.Badge
              colorScheme={borderColor.split('.')[0]}
              size="sm"
              fontFamily={fontName}
            >
              Sort order {category.sort_order}
            </chakra.Badge>
          </chakra.HStack>
        </chakra.Box>

        {/* Action Buttons */}
        <chakra.HStack spacing={1}>
          <chakra.IconButton
            icon={<FiEye />}
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={() => onViewDetails(category)}
            aria-label="View details"
            title="View details"
          />
          <chakra.IconButton
            icon={<FiImage />}
            size="sm"
            variant="ghost"
            colorScheme="purple"
            onClick={() => onChangeImage(category)}
            aria-label="Change image"
            title="Change image"
          />
          <chakra.IconButton
            icon={<FiEdit />}
            size="sm"
            variant="ghost"
            colorScheme="green"
            onClick={() => onEdit(category)}
            aria-label="Edit category"
            title="Edit category"
          />
          <chakra.IconButton
            icon={<FiTrash2 />}
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={() => onDelete(category)}
            aria-label="Delete category"
            title="Delete category"
          />
        </chakra.HStack>
      </chakra.Flex>

      {/* Children */}
      {hasChildren && isExpanded && (
        <chakra.Box ml={6} mt={2}>
          {category.children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
              onChangeImage={onChangeImage}
              level={level + 1}
            />
          ))}
        </chakra.Box>
      )}
    </chakra.Box>
  );
}

export default function CategoryTreeView({ 
  categories, 
  onEdit, 
  onDelete, 
  onViewDetails,
  onChangeImage 
}) {
  if (!categories || categories.length === 0) {
    return (
      <chakra.Box
        p={8}
        textAlign="center"
        bg="white"
        borderRadius="md"
        shadow="sm"
      >
        <chakra.Text
          fontFamily={fontName}
          color="gray.500"
          fontSize="sm"
        >
          No categories found. Create your first category to get started.
        </chakra.Text>
      </chakra.Box>
    );
  }

  return (
    <chakra.Box>
      {categories.map((category) => (
        <CategoryNode
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
          onChangeImage={onChangeImage}
          level={0}
        />
      ))}
    </chakra.Box>
  );
}
