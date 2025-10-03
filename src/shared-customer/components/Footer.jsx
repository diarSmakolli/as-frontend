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
  Icon,
  SimpleGrid,
  IconButton,
  Link,
  Select,
  Center,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPinterest,
  FaLeaf,
  FaGlobe,
  FaApple,
  FaMobileAlt,
  FaArrowUp,
} from "react-icons/fa";
import Logo from "../../assets/ASLOGO.svg";


const Footer = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setShowBackToTop(scrollTop > 300); // Show button after scrolling 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box bg='#0053e2s'>
      <Box as="footer" color="white" mt={12} bg="black">
        {/* Renewable Energy Banner */}

        {/* Main Footer Content */}
        <Box bg="#0053e2s" position="relative">
          <Container maxW="8xl" py={16}>
            <Flex direction={{ base: "column", lg: "row" }} gap={16}>
              {/* Left Section - Logo and App Download */}
              <Box
                flexShrink={0}
                mr={6}
                as="a"
                href="/"
                _hover={{ cursor: "pointer" }}
              >
                <Flex align="center">
                  <Image
                    src={Logo}
                    alt="AS Solutions Logo"
                    height="50.9px"
                    width="auto"
                    objectFit="contain"
                  />
                </Flex>
              </Box>

              {/* Right Section - Footer Links */}
              <Box flex="2">
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
                  {/* Shop Column */}
                  <VStack align="start" spacing={6}>
                    <Heading
                      size="md"
                      color="white"
                      fontWeight="600"
                      fontSize="lg"
                      fontFamily={"Airbnb Cereal VF"}
                    >
                      Account
                    </Heading>
                    <VStack align="start" spacing={3}>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                        href='/cart'
                      >
                        Ajouter
                      </Link>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                        href='/account/profile'
                      >
                        My Orders
                      </Link>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                        href='/account/wishlist'
                      >
                        My Wishlist
                      </Link>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                        href='/account/profile'
                      >
                        My Account
                      </Link>
                    </VStack>
                  </VStack>

                  {/* About Column */}
                  <VStack align="start" spacing={6}>
                    <Heading
                      size="md"
                      color="white"
                      fontWeight="bold"
                      fontSize="lg"
                      fontFamily={"Airbnb Cereal VF"}
                    >
                      Contact
                    </Heading>
                    <VStack align="start" spacing={3}>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        contact@assolutions.fr
                      </Link>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        Pour demande d'offres
                      </Link>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                      >
                        b2b@assolutions.fr
                      </Link>
                    </VStack>
                  </VStack>

                  {/* Help Column */}
                  <VStack align="start" spacing={6}>
                    <Heading
                      size="md"
                      color="white"
                      fontWeight="bold"
                      fontSize="lg"
                      fontFamily={"Airbnb Cereal VF"}
                    >
                      Help
                    </Heading>
                    <VStack align="start" spacing={3}>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                        href='/privacy-policy'
                      >
                        Privacy
                      </Link>
                      <Link
                        fontSize="sm"
                        color="gray.100"
                        _hover={{
                          color: "rgb(239,48,84)",
                          textDecoration: "underline",
                          transform: "translateX(4px)",
                        }}
                        transition="all 0.2s"
                        cursor="pointer"
                        fontFamily={"Airbnb Cereal VF"}
                        href='/terms-and-conditions'
                      >
                        Terms Of Policy
                      </Link>
                    </VStack>

                    {/* Social Media Icons */}
                    <VStack align="start" spacing={4} mt={6}>
                      <HStack spacing={3}>
                        {[
                          {
                            icon: FaInstagram,
                            label: "Instagram",
                            color: "#E4405F",
                          },
                          {
                            icon: FaFacebook,
                            label: "Facebook",
                            color: "#1877F2",
                          },
                          {
                            icon: FaTwitter,
                            label: "X",
                            color: "#BD081C",
                          },
                        ].map((social, index) => (
                          <IconButton
                            key={index}
                            icon={<Icon as={social.icon} />}
                            variant="ghost"
                            color="gray.400"
                            _hover={{
                              color: social.color,
                              transform: "translateY(-3px) scale(1.1)",
                              bg: "whiteAlpha.100",
                            }}
                            size="lg"
                            borderRadius="full"
                            transition="all 0.3s"
                            aria-label={social.label}
                          />
                        ))}
                      </HStack>
                    </VStack>
                  </VStack>
                </SimpleGrid>
              </Box>
            </Flex>
          </Container>
        </Box>

        {/* Bottom Footer - Dark Section */}
        <Box bg="black" py={6} borderTop="1px" borderColor="gray.700">
          <Container maxW="8xl">
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
              gap={6}
            >
              {/* Language and Region Selector */}
              <HStack spacing={4} align="center">
                <Icon as={FaGlobe} color="gray.400" fontSize="lg" />
                <Select
                  variant="unstyled"
                  size="sm"
                  color="gray.300"
                  fontWeight="medium"
                  cursor="pointer"
                  w="auto"
                  minW="250px"
                  _focus={{ color: "white" }}
                >
                  <option
                    value="fr"
                    style={{ backgroundColor: "#2D3748", color: "white" }}
                  >
                    🇫🇷 France | Français | € (EUR)
                  </option>
                </Select>
              </HStack>

              {/* Copyright and Links */}
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                gap={4}
                justify={{ base: "center", md: "end" }}
              >
                <Text fontSize="sm" color="gray.400" textAlign="center">
                  © 2025 AS Solutions, Inc.
                </Text>
               
              </Flex>
            </Flex>
          </Container>
        </Box>

        {/* Back to Top Button */}
        {showBackToTop && (
          <IconButton
            position="fixed"
            bottom={{ base: "24", lg: "6" }}
            right={{ base: "5", lg: "6" }}
            icon={<FaArrowUp />}
            bg="rgb(255, 109, 136)"
            color="white"
            _hover={{
              bg: "rgb(219,28,64)",
              transform: "translateY(-3px) scale(1.1)",
              shadow: "2xl",
            }}
            size="lg"
            borderRadius="2xl"
            shadow="lg"
            zIndex="1000"
            transition="all 0.3s"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          />
        )}

        <Center py={4}>
          <Text fontSize="sm" color="gray.400" textAlign="center">
            Made with ❤️ by <Text as='a' href='https://linkedin.com/in/dijarsmakolli'>
            Dijar</Text>
          </Text>
        </Center>
      </Box>
    </Box>
  );
};

export default Footer;
