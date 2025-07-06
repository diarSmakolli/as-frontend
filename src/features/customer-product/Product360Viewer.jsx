import React, { useState, useRef, useEffect } from 'react';
import { Box, IconButton, Text, HStack, VStack } from '@chakra-ui/react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';

const Product360Viewer = ({ images, isActive = false }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-rotate functionality
  useEffect(() => {
    if (isPlaying && images?.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % images.length);
      }, 100); // Adjust speed here
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, images?.length]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setIsPlaying(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !images?.length) return;

    const deltaX = e.clientX - startX;
    const sensitivity = 5; // Adjust sensitivity
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let newFrame = prev + direction;
        if (newFrame >= images.length) newFrame = 0;
        if (newFrame < 0) newFrame = images.length - 1;
        return newFrame;
      });
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsPlaying(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !images?.length) return;

    const deltaX = e.touches[0].clientX - startX;
    const sensitivity = 10;
    
    if (Math.abs(deltaX) > sensitivity) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame((prev) => {
        let newFrame = prev + direction;
        if (newFrame >= images.length) newFrame = 0;
        if (newFrame < 0) newFrame = images.length - 1;
        return newFrame;
      });
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!images || images.length === 0) return null;

  return (
    <Box position="relative" w="full" h="full">
      <Box
        ref={containerRef}
        position="relative"
        w="full"
        h="full"
        cursor={isDragging ? 'grabbing' : 'grab'}
        userSelect="none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        borderRadius="md"
        overflow="hidden"
      >
        <img
          src={images[currentFrame]?.url}
          alt={`360° view frame ${currentFrame + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
            transition: isDragging ? 'none' : 'opacity 0.1s ease'
          }}
          draggable={false}
        />

        {/* 360° Indicator */}
        <Box
          position="absolute"
          top="4"
          left="4"
          bg="blackAlpha.700"
          color="white"
          px="3"
          py="1"
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
        >
          360°
        </Box>

        {/* Controls */}
        <HStack
          position="absolute"
          bottom="4"
          left="50%"
          transform="translateX(-50%)"
          spacing="2"
        >
          <IconButton
            icon={isPlaying ? <FaPause /> : <FaPlay />}
            onClick={() => setIsPlaying(!isPlaying)}
            size="sm"
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: "blackAlpha.800" }}
            borderRadius="full"
            aria-label={isPlaying ? "Pause rotation" : "Start rotation"}
          />
          <IconButton
            icon={<FaRedo />}
            onClick={() => setCurrentFrame((prev) => (prev + 1) % images.length)}
            size="sm"
            bg="blackAlpha.700"
            color="white"
            _hover={{ bg: "blackAlpha.800" }}
            borderRadius="full"
            aria-label="Next frame"
          />
        </HStack>

        {/* Progress indicator */}
        <Box
          position="absolute"
          bottom="2"
          left="4"
          right="4"
          h="2px"
          bg="whiteAlpha.300"
          borderRadius="full"
        >
          <Box
            h="full"
            bg="white"
            borderRadius="full"
            width={`${((currentFrame + 1) / images.length) * 100}%`}
            transition="width 0.1s ease"
          />
        </Box>
      </Box>

      {/* Instructions */}
      <Text
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="whiteAlpha.800"
        fontSize="sm"
        textAlign="center"
        pointerEvents="none"
        opacity={isDragging ? 0 : 1}
        transition="opacity 0.3s"
      >
        Drag to rotate
      </Text>
    </Box>
  );
};

export default Product360Viewer;