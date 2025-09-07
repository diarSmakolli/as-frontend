import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  IconButton,
  Badge,
  Image,
  Center,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { FiX, FiArrowLeft, FiArrowRight, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

const ExistingImageManager = ({ images, onImagesChange }) => {
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const movedImage = newImages.splice(fromIndex, 1)[0];
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  const setAsMain = (index) => {
    if (index === 0) return; // Already main
    const newImages = [...images];
    const mainImage = newImages.splice(index, 1)[0];
    newImages.unshift(mainImage);
    onImagesChange(newImages);
  };

  if (images.length === 0) {
    return (
      <Alert status="warning" borderRadius="md">
        <AlertIcon />
        <AlertDescription>
          No existing images found. Please add new images.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="md" fontWeight="medium" color="gray.700">
        Current Images ({images.length})
      </Text>

      <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
        {images.map((image, index) => (
          <MotionBox
            key={image.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor={index === 0 ? "blue.500" : "gray.200"}
            _hover={{ borderColor: index === 0 ? "blue.600" : "gray.300" }}
          >
            <Box position="relative" w="100%" h="120px">
              <Image
                src={image.url}
                alt={image.alt_text || `Product image ${index + 1}`}
                w="100%"
                h="100%"
                objectFit="cover"
              />

              {/* Controls Overlay */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="blackAlpha.600"
                opacity={0}
                _hover={{ opacity: 1 }}
                transition="opacity 0.2s"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <HStack spacing={1}>
                  {/* Move Left */}
                  {index > 0 && (
                    <IconButton
                      icon={<FiArrowLeft />}
                      size="xs"
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => moveImage(index, index - 1)}
                      aria-label="Move left"
                      title="Move left"
                    />
                  )}

                  {/* Set as Main (if not already main) */}
                  {index !== 0 && (
                    <IconButton
                      icon={<FiEdit />}
                      size="xs"
                      colorScheme="green"
                      variant="solid"
                      onClick={() => setAsMain(index)}
                      aria-label="Set as main"
                      title="Set as main image"
                    />
                  )}

                  {/* Remove */}
                  <IconButton
                    icon={<FiX />}
                    size="xs"
                    colorScheme="red"
                    variant="solid"
                    onClick={() => removeImage(index)}
                    aria-label="Remove image"
                    title="Remove image"
                  />

                  {/* Move Right */}
                  {index < images.length - 1 && (
                    <IconButton
                      icon={<FiArrowRight />}
                      size="xs"
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => moveImage(index, index + 1)}
                      aria-label="Move right"
                      title="Move right"
                    />
                  )}
                </HStack>
              </Box>

              {/* Main Image Badge */}
              {index === 0 && (
                <Badge
                  position="absolute"
                  top={2}
                  left={2}
                  colorScheme="blue"
                  variant="solid"
                  fontSize="xs"
                >
                  Main
                </Badge>
              )}
            </Box>

            <Box p={2} bg="white">
              <Text
                fontSize="xs"
                color="gray.600"
                noOfLines={1}
                title={
                  image.file_name || image.alt_text || `Image ${index + 1}`
                }
              >
                {image.file_name || image.alt_text || `Image ${index + 1}`}
              </Text>
            </Box>
          </MotionBox>
        ))}
      </SimpleGrid>

      <Box
        bg="blue.50"
        p={4}
        borderRadius="md"
        borderLeft="4px"
        borderColor="blue.400"
      >
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="blue.800" fontWeight="medium">
            Image Management Tips:
          </Text>
          <Text fontSize="xs" color="blue.700">
            • The first image is used as the main product image
          </Text>
          <Text fontSize="xs" color="blue.700">
            • Use arrow buttons to reorder images
          </Text>
          <Text fontSize="xs" color="blue.700">
            • Click the edit button to set any image as main
          </Text>
          <Text fontSize="xs" color="blue.700">
            • Remove unwanted images with the X button
          </Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ExistingImageManager;
