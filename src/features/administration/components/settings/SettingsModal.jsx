import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  ModalFooter, Button, VStack, HStack, Text, Box
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { useState } from "react";
import AccountSettingsTab from "./AccountSettingsTab";
import PreferencesSettingsTab from "./PreferencesSettings";
import ActivityHistoriesTab from "./ActivityHistoriesTab";

const NAV_ITEMS = [
  { id: "account", label: "My account" },
  { id: "preferences", label: "Preferences" },
  { id: "activity", label: "Activity Histories" },
];

const SettingsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(NAV_ITEMS[0].id);

  const renderContent = () => {
      switch (activeTab) {
          case "account":
              return <AccountSettingsTab />;
          case "preferences":
              return <PreferencesSettingsTab />;
          case "activity":
              return <ActivityHistoriesTab />;
          default:
              return <Box flex={1}><Text>Select a category.</Text></Box>;
      }
  };

  return (
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent bg="rgb(241,241,241)" color="gray.300" minH="80vh" maxH="80vh" rounded="xl">
              <ModalHeader borderBottomWidth="1px" borderColor="gray.200">
                  <Text fontSize="lg" fontFamily="Inter" fontWeight={400} color="gray.700">Settings</Text>
              </ModalHeader>
              <ModalCloseButton color='black'/>
              <ModalBody py={6} display="flex" flexDirection="column">
                  <HStack alignItems="flex-start" spacing={6} flexGrow={1}>
                      <VStack
                          w="250px"
                          minW="250px"
                          alignItems="flex-start"
                          spacing={4}
                          pr={4}
                          borderColor="gray.700"
                          h="100%" 
                          overflowY="auto"
                      >
                          <Box w="full">
                              <Text fontWeight="500" fontSize="sm" color="gray.600" mb={2} px={2} fontFamily="Inter">User Settings</Text>
                              <VStack alignItems="flex-start" spacing={1} w="full">
                                  {NAV_ITEMS.map((item) => (
                                      <Text
                                          key={item.id}
                                          fontSize="sm"
                                          fontWeight={activeTab === item.id ? "500" : "normal"}
                                          w="full"
                                          px={3}
                                          py={2}
                                          borderRadius="md"
                                          borderWidth={1}
                                          borderColor={activeTab === item.id ? "#fff" : "transparent"}
                                          bg={activeTab === item.id ? "rgb(255,255,255)" : "transparent"}
                                          _hover={{ bg: "rgb(255,255,255)", borderColor: "gray.650" }}
                                          onClick={() => setActiveTab(item.id)}
                                          cursor="pointer"
                                          color={activeTab === item.id ? "gray.900" : "gray.600"}
                                          fontFamily="Inter"
                                          textTransform="capitalize"
                                      >
                                          {item.label}
                                      </Text>
                                  ))}
                              </VStack>
                          </Box>
                      </VStack>
                      <Box flex={1} h="100%" overflowY="auto" pb={4} > 
                          {renderContent()}
                      </Box>
                  </HStack>
              </ModalBody>
              <ModalFooter borderTopWidth="1px" borderColor="gray.300">
                  <Button
                      onClick={onClose}
                      leftIcon={<FiX />}
                      bg="black"
                      color="gray.300"
                      _hover={{ bg: "black" }}
                      size="sm"
                      fontFamily="Inter"
                      fontSize="sm"
                      fontWeight="400"
                  >
                      Close
                  </Button>
              </ModalFooter>
          </ModalContent>
      </Modal>
  );
};

export default SettingsModal;