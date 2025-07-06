import React from 'react';
import { Box, Center, Icon, Text, VStack } from '@chakra-ui/react';
import { FiFile, FiFileText, FiImage, FiPackage, FiFilm } from 'react-icons/fi';

const getFileIcon = (fileType) => {
  if (!fileType) return FiFile;
  
  const type = fileType.toLowerCase();
  
  // Document types
  if (type.includes('pdf')) return FiFileText;
  if (type.includes('doc') || type.includes('txt') || type.includes('rtf')) return FiFileText;
  if (type.includes('xls') || type.includes('csv')) return FiFileText;
  if (type.includes('ppt')) return FiFileText;
  
  // Image types
  if (type.includes('jpg') || type.includes('jpeg') || type.includes('png') || 
      type.includes('gif') || type.includes('svg') || type.includes('webp')) {
    return FiImage;
  }
  
  // Archive types
  if (type.includes('zip') || type.includes('rar') || type.includes('tar') || 
      type.includes('gz') || type.includes('7z')) {
    return FiPackage;
  }
  
  // Media types
  if (type.includes('mp4') || type.includes('avi') || type.includes('mov') || type.includes('wmv')) {
    return FiFilm;
  }
  
  // Default
  return FiFile;
};

const getFileColor = (fileType) => {
  if (!fileType) return "gray.500";
  
  const type = fileType.toLowerCase();
  
  // Document types
  if (type.includes('pdf')) return "red.500";
  if (type.includes('doc')) return "blue.500";
  if (type.includes('xls')) return "green.500";
  if (type.includes('ppt')) return "orange.500";
  
  // Image types
  if (type.includes('jpg') || type.includes('jpeg') || type.includes('png') || 
      type.includes('gif') || type.includes('svg') || type.includes('webp')) {
    return "purple.500";
  }
  
  // Archive types
  if (type.includes('zip') || type.includes('rar') || type.includes('tar') || 
      type.includes('gz') || type.includes('7z')) {
    return "yellow.500";
  }
  
  // Media types
  if (type.includes('mp4') || type.includes('avi') || type.includes('mov') || type.includes('wmv')) {
    return "pink.500";
  }
  
  // Default
  return "teal.500";
};

const DocumentFallback = ({ fileType, fileName = "Document", size = "md" }) => {
  const IconComponent = getFileIcon(fileType);
  const iconColor = getFileColor(fileType);
  
  const sizeProps = {
    sm: { boxSize: "80px", iconSize: "24px", fontSize: "xs" },
    md: { boxSize: "120px", iconSize: "36px", fontSize: "sm" },
    lg: { boxSize: "200px", iconSize: "48px", fontSize: "md" }
  };
  
  const { boxSize, iconSize, fontSize } = sizeProps[size] || sizeProps.md;
  
  return (
    <Center 
      width={boxSize} 
      height={boxSize} 
      bg="gray.200" 
      borderRadius="md" 
      p={4}
      border="1px solid"
      borderColor="gray.400"
    >
      <VStack spacing={2}>
        <Icon 
          as={IconComponent} 
          boxSize={iconSize} 
          color={iconColor}
        />
        {fileType && (
          <Box 
            bg={iconColor} 
            color="black" 
            px={2} 
            py={0.5} 
            borderRadius="md" 
            fontSize={fontSize}
            fontWeight="bold"
            textTransform="uppercase"
          >
            {fileType}
          </Box>
        )}
        <Text 
          fontSize={fontSize} 
          color="gray.900" 
          textAlign="center" 
          noOfLines={1}
          maxWidth="100%"
        >
          {fileName}
        </Text>
      </VStack>
    </Center>
  );
};

export default DocumentFallback;
