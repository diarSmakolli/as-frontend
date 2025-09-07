import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Progress,
  Badge,
  useColorModeValue,
  IconButton,
  Flex,
  Spacer,
  Center,
  Circle,
  useBreakpointValue,
  useToast,
  Fade,
  ScaleFade,
  SlideFade,
  Image,
  Stack,
  Divider,
  Icon,
} from "@chakra-ui/react";
import {
  FiHome,
  FiArrowLeft,
  FiSearch,
  FiShoppingBag,
  FiPackage,
  FiAlertCircle,
  FiRefreshCw,
  FiHeart,
  FiCompass,
  FiTrendingUp,
  FiStar,
  FiGift,
} from "react-icons/fi";
import Navbar from "../../shared-customer/components/Navbar";
import Footer from "../../shared-customer/components/Footer";

function Error404() {
  const navigate = useNavigate();
  const toast = useToast();
  const [countdown, setCountdown] = useState(15);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particleAnimation, setParticleAnimation] = useState(false);

  // Enhanced Responsive values
  const headingSize = useBreakpointValue({
    base: "5xl",
    sm: "6xl",
    md: "7xl",
    lg: "8xl",
    xl: "9xl",
  });
  const containerMaxW = useBreakpointValue({
    base: "container.sm",
    md: "container.md",
    lg: "container.lg",
    xl: "container.xl",
  });
  const gridCols = useBreakpointValue({ base: 1, sm: 2, lg: 4 });
  const quickLinksCols = useBreakpointValue({ base: 2, md: 4 });
  const iconSize = useBreakpointValue({
    base: "60px",
    md: "80px",
    lg: "100px",
  });

  // Enhanced Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50, pink.50, orange.50)",
    "linear(to-br, gray.900, blue.900, purple.900, gray.800)"
  );
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(26, 32, 44, 0.8)"
  );
  const textColor = useColorModeValue("gray.800", "white");
  const subtitleColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const glowColor = useColorModeValue("blue.400", "blue.300");

  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  // Enhanced animation triggers
  useEffect(() => {
    setTimeout(() => setIsAnimating(true), 200);
    setTimeout(() => setParticleAnimation(true), 1000);
  }, []);

  const handleGoHome = () => {
    showToast("Navigating to homepage", "info");
    navigate("/");
  };

  const handleGoBack = () => {
    showToast("Going back", "info");
    window.history.back();
  };

  const handleSearch = () => {
    showToast("Opening search", "info");
    navigate("/search");
  };

  const handleShop = () => {
    showToast("Let's shop!", "success");
    navigate("/products");
  };

  const handleRefresh = () => {
    showToast("Refreshing page", "info");
    window.location.reload();
  };

  const showToast = (message, status = "info") => {
    toast({
      title: message,
      status,
      duration: 2000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  const actionButtons = [
    {
      label: "Go Home",
      icon: FiHome,
      onClick: handleGoHome,
      colorScheme: "blue",
      variant: "solid",
      description: "Return to homepage",
    },
    {
      label: "Go Back",
      icon: FiArrowLeft,
      onClick: handleGoBack,
      colorScheme: "gray",
      variant: "solid",
      description: "Previous page",
    },
    {
      label: "Search",
      icon: FiSearch,
      onClick: handleSearch,
      colorScheme: "purple",
      variant: "solid",
      description: "Find products",
    },
    {
      label: "Shop Now",
      icon: FiShoppingBag,
      onClick: handleShop,
      colorScheme: "green",
      variant: "solid",
      description: "Browse products",
    },
  ];

  const quickLinks = [
    { label: "All Products", path: "/", icon: FiShoppingBag },
    { label: "Categories", path: "/category/furniture", icon: FiCompass },
    { label: "Search products", path: "/search", icon: FiTrendingUp },
    { label: "On Sale", path: "/flash-deals", icon: FiGift },
  ];

  const helpfulTips = [
    "Check the URL for typos",
    "Use our search feature",
    "Browse popular categories",
    "Visit our homepage",
  ];

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
    >
      <Navbar />

      {/* Enhanced Floating Background Elements */}
      <Box position="absolute" inset={0} pointerEvents="none" zIndex={0}>
        {/* Large floating circles */}
        <Circle
          size="120px"
          bg="blue.200"
          opacity={0.4}
          position="absolute"
          top="25%"
          left="15%"
          filter="blur(1px)"
        />
        <Circle
          size="80px"
          bg="purple.200"
          opacity={0.5}
          position="absolute"
          top="25%"
          right="20%"
          style={{ animationDelay: "1s" }}
          filter="blur(1px)"
        />
        <Circle
          size="100px"
          bg="pink.200"
          opacity={0.3}
          position="absolute"
          bottom="20%"
          left="25%"
          style={{ animationDelay: "3s" }}
          filter="blur(1px)"
        />
        <Circle
          size="60px"
          bg="orange.200"
          opacity={0.6}
          position="absolute"
          bottom="30%"
          right="15%"
          style={{ animationDelay: "5s" }}
          filter="blur(1px)"
        />

        {/* Small particle effects */}
        {particleAnimation && (
          <>
            {[...Array(8)].map((_, i) => (
              <Circle
                key={i}
                size="8px"
                bg={`${["blue", "purple", "pink", "orange"][i % 4]}.300`}
                opacity={0.7}
                position="absolute"
                top={`${20 + i * 8}%`}
                left={`${10 + i * 10}%`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </>
        )}
      </Box>

      <Container
        maxW={containerMaxW}
        py={8}
        position="relative"
        zIndex={1}
        mt={14}
      >
        <Center minH="100vh">
          <VStack spacing={10} textAlign="center" w="full">
            {/* Enhanced Main 404 Section */}
            <SlideFade in={isAnimating} offsetY="80px">
              <VStack spacing={8}>
                {/* Large 404 Number with Enhanced Package Icon */}
                <Box position="relative">
                  <Heading
                    size={headingSize}
                    bgGradient="linear(to-r, blue.400, purple.500, pink.400, blue.600)"
                    bgClip="text"
                    fontWeight="black"
                    lineHeight="none"
                    letterSpacing="tight"
                    textShadow="0 0 40px rgba(66, 153, 225, 0.3)"
                  >
                    404
                  </Heading>

                  {/* Enhanced Animated Package Icon */}
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  >
                    <Box position="relative">
                      <Icon
                        as={FiPackage}
                        boxSize={iconSize}
                        color="gray.400"
                        style={{ animationDelay: "0.5s" }}
                        filter="drop-shadow(0 0 10px rgba(66, 153, 225, 0.3))"
                      />
                      <Icon
                        as={FiAlertCircle}
                        boxSize="24px"
                        color="red.400"
                        position="absolute"
                        top="-8px"
                        right="-8px"
                      />

                      {/* Glow effect */}
                      <Box
                        position="absolute"
                        top="50%"
                        left="50%"
                        transform="translate(-50%, -50%)"
                        w={iconSize}
                        h={iconSize}
                        borderRadius="50%"
                        zIndex={-1}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Enhanced Error Message */}
                <VStack spacing={6} maxW="3xl">
                  <Heading
                    size="xl"
                    color={textColor}
                    fontWeight="bold"
                    textAlign="center"
                    fontFamily="Bricolage Grotesque"
                  >
                    Oops! Page Not Found
                  </Heading>
                  <Text
                    fontSize="md"
                    color={subtitleColor}
                    lineHeight="tall"
                    textAlign="center"
                    maxW="2xl"
                    fontFamily="Bricolage Grotesque"
                  >
                    The product or page you're looking for seems to have taken a
                    coffee break. Don't worry, our team is probably restocking
                    it right now!
                  </Text>
                  <Text color="gray.500" fontSize="md">
                    Let's get you back to shopping amazing products.
                  </Text>
                </VStack>
              </VStack>
            </SlideFade>

            {/* Enhanced Auto Redirect Counter */}
            <ScaleFade in={isAnimating} initialScale={0.7}>
              <VStack spacing={4}>
                <Badge
                  bg="white"
                  size="sm"
                  px={3}
                  py={2}
                  borderRadius="full"
                  backdropFilter="blur(10px)"
                  border="1px solid"
                  borderColor="gray.200"
                  textTransform={"none"}
                  fontFamily={"Inter"}
                  fontSize="sm"
                >
                  <HStack spacing={3}>
                    <Icon
                      as={FiRefreshCw}
                      animation="spin 2s linear infinite"
                    />
                    <Text fontWeight="semibold">
                      Auto-redirect in {countdown} seconds
                    </Text>
                  </HStack>
                </Badge>
                <Progress
                  value={(15 - countdown) * (100 / 15)}
                  size="md"
                  borderRadius="full"
                  w="250px"
                  bg="gray.100"
                  colorScheme="yellow"
                  hasStripe
                  isAnimated
                />
              </VStack>
            </ScaleFade>

            {/* Enhanced Quick Links Card */}
            <Fade in={isAnimating} transition={{ enter: { delay: 0.8 } }}>
              <Card
                w="full"
                maxW="5xl"
                bg={cardBg}
                shadow="2xl"
                borderRadius="3xl"
                border="1px"
                borderColor={borderColor}
                backdropFilter="blur(15px)"
                overflow="hidden"
              >
                <CardBody p={10}>
                  <VStack spacing={8}>
                    <VStack spacing={4}>
                      <Heading
                        size="xl"
                        color={textColor}
                        fontFamily="Bricolage Grotesque"
                      >
                        Popular Destinations
                      </Heading>
                      <Text
                        color={subtitleColor}
                        textAlign="center"
                        maxW="2xl"
                        fontFamily="Bricolage Grotesque"
                      >
                        Explore our most visited pages and discover amazing
                        products
                      </Text>
                    </VStack>

                    <Grid
                      templateColumns={`repeat(${quickLinksCols}, 1fr)`}
                      gap={4}
                      w="full"
                    >
                      {quickLinks.map((link, index) => (
                        <GridItem key={index}>
                          <Button
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => {
                              navigate(link.path);
                              showToast(
                                `Navigating to ${link.label}`,
                                "success"
                              );
                            }}
                            w="full"
                            h="60px"
                            borderRadius="xl"
                            leftIcon={<Icon as={link.icon} />}
                            _hover={{
                              bg: "blue.50",
                              transform: "translateY(-3px)",
                              shadow: "lg",
                            }}
                            transition="all 0.3s ease"
                            fontSize="md"
                            fontWeight="semibold"
                          >
                            {link.label}
                          </Button>
                        </GridItem>
                      ))}
                    </Grid>

                    <Divider />

                    {/* Helpful Tips Section */}
                    <VStack spacing={4} w="full">
                      <Heading size="md" color={textColor}>
                        Helpful Tips
                      </Heading>
                      <Grid
                        templateColumns="repeat(2, 1fr)"
                        gap={3}
                        w="full"
                        maxW="2xl"
                      >
                        {helpfulTips.map((tip, index) => (
                          <GridItem key={index}>
                            <HStack
                              spacing={3}
                              p={3}
                              borderRadius="lg"
                              bg="gray.50"
                            >
                              <Circle size="6px" bg="blue.400" />
                              <Text fontSize="sm" color={subtitleColor}>
                                {tip}
                              </Text>
                            </HStack>
                          </GridItem>
                        ))}
                      </Grid>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            </Fade>

            {/* Footer */}
          </VStack>
        </Center>
      </Container>

      <Footer />
    </Box>
  );
}

export default Error404;
