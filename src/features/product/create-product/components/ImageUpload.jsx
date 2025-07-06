import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Input,
  SimpleGrid,
  IconButton,
  Badge,
  useToast,
  Center,
  Image
} from '@chakra-ui/react';
import { FiUpload, FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MotionBox = motion.create(Box);

const ImageUpload = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a valid image file`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast({
          title: 'File too large',
          description: `${file.name} is too large. Maximum size is 10MB`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > 10) {
      toast({
        title: 'Too many images',
        description: 'Maximum 10 images allowed',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newImages = [...images, ...validFiles];
    setImages(newImages);
    onImagesChange(newImages);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const newPreviews = [...previews];
    
    const movedImage = newImages.splice(fromIndex, 1)[0];
    const movedPreview = newPreviews.splice(fromIndex, 1)[0];
    
    newImages.splice(toIndex, 0, movedImage);
    newPreviews.splice(toIndex, 0, movedPreview);
    
    setImages(newImages);
    setPreviews(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Upload Area */}
      <Box
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="lg"
        p={8}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: "blue.400", bg: "gray.50" }}
        onClick={() => fileInputRef.current?.click()}
      >
        <VStack spacing={4}>
          <Icon as={FiUpload} fontSize="3xl" color="gray.400" />
          <VStack spacing={2}>
            <Text color="gray.600" fontWeight="medium">
              Click to upload or drag and drop
            </Text>
            <Text color="gray.500" fontSize="sm">
              PNG, JPG, JPEG up to 10MB (Max 10 images)
            </Text>
          </VStack>
        </VStack>
        
        <Input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          display="none"
        />
      </Box>

      {/* Image Previews */}
      {previews.length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SimpleGrid columns={{ base: 2, md: 4, lg: 5 }} spacing={4}>
            {previews.map((preview, index) => (
              <MotionBox
                key={preview.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                position="relative"
                borderRadius="lg"
                overflow="hidden"
                border="1px"
                borderColor="gray.200"
                _hover={{ boxShadow: "lg" }}
              >
                <Box position="relative" w="100%" h="120px">
                  <Image
                    src={preview.url}
                    alt={preview.name}
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
                    <HStack spacing={2}>
                      {/* Move Left */}
                      {index > 0 && (
                        <IconButton
                          icon={<FiArrowLeft />}
                          size="sm"
                          colorScheme="blue"
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index - 1);
                          }}
                          aria-label="Move left"
                        />
                      )}
                      
                      {/* Remove */}
                      <IconButton
                        icon={<FiX />}
                        size="sm"
                        colorScheme="red"
                        variant="solid"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        aria-label="Remove image"
                      />
                      
                      {/* Move Right */}
                      {index < previews.length - 1 && (
                        <IconButton
                          icon={<FiArrowRight />}
                          size="sm"
                          colorScheme="blue"
                          variant="solid"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveImage(index, index + 1);
                          }}
                          aria-label="Move right"
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
                
                <Text
                  p={2}
                  fontSize="xs"
                  color="gray.600"
                  bg="white"
                  noOfLines={1}
                  title={preview.name}
                >
                  {preview.name}
                </Text>
              </MotionBox>
            ))}
          </SimpleGrid>
        </MotionBox>
      )}

      {/* Help Text */}
      <Box bg="blue.50" p={4} borderRadius="md" borderLeft="4px" borderColor="blue.400">
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="blue.800" fontWeight="medium">
            Image Upload Guidelines:
          </Text>
          <Text fontSize="xs" color="blue.700">• First image will be used as the main product image</Text>
          <Text fontSize="xs" color="blue.700">• You can reorder images using the arrow buttons</Text>
          <Text fontSize="xs" color="blue.700">• Supported formats: JPEG, PNG, WebP</Text>
          <Text fontSize="xs" color="blue.700">• Maximum file size: 10MB per image</Text>
          <Text fontSize="xs" color="blue.700">• Recommended resolution: 800x800px or higher</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default ImageUpload;
