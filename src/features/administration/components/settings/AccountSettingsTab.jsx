import {
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Button,
  Divider,
  HStack,
  Flex,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Badge,
  Tooltip,
  IconButton,
  useClipboard,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  FiUser,
  FiMail,
  FiShield,
  FiPhone,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiCopy,
  FiCheck,
  FiMonitor,
  FiSmartphone,
  FiTablet,
  FiGlobe,
} from "react-icons/fi";
import {
  SiGooglechrome,
  SiFirefoxbrowser,
  SiSafari,
  SiFirefox,
  SiOperagx,
  SiGitforwindows,
  SiApple,
  SiLinux,
  SiAndroid,
} from "react-icons/si";
import { useAuth } from "../../authContext/authContext";
import { administrationService } from "../../services/administrationService";
import { handleApiError } from "../../../../commons/handleApiError";
import { formatRelativeTime } from "../../../../commons/formatOptions";
import ChangePasswordModal from "./ChangePasswordModal";
import { useAccountSessions } from "../../hooks/useAccountSessions";
import { customToastContainerStyle } from "../../../../commons/toastStyles";

const AccountInfoCard = ({ icon, label, value, copyable, verified }) => {
  const stringValue = (typeof value === 'string' || typeof value === 'number') ? String(value) : "";
  const { hasCopied, onCopy } = useClipboard(value || "");

  const isComplexValue = typeof value !== 'string' && typeof value !== 'number' && value !== null && value !== undefined;
  return (
    <Box p={4} bg="rgb(255,255,255)" borderRadius="lg" position="relative">
      <HStack spacing={3} alignItems="flex-start">
        <Box p={2} bg="gray.100" borderRadius="md" color="gray.400" flexShrink={0}>
          {icon}
        </Box>
        <Box flex={1} minW={0}> 
          <Text fontSize="xs" color="gray.900" mb={1} fontFamily="Inter">
            {label}
          </Text>
          <HStack alignItems="center">
            <Box 
              as={isComplexValue ? "div" : "p"}
              fontSize="sm"
              color="gray.900"
              fontFamily="Inter"
              fontWeight="500"
            >
              {value !== null && value !== undefined && value !== '' ? value : "Not set"}
            </Box>
            {verified && !isComplexValue && (
              <Badge colorScheme="blue" variant="subtle" fontSize="xs" ml={2}>
                Verified
              </Badge>
            )}
          </HStack>
        </Box>
        {copyable && stringValue && (
          <Tooltip label={hasCopied ? "Copied!" : "Copy"} placement="top">
            <IconButton
              size="xs"
              icon={hasCopied ? <FiCheck /> : <FiCopy />}
              aria-label="Copy"
              onClick={onCopy}
              variant="ghost"
              color="gray.500"
              _hover={{ color: "gray.300" }}
            />
          </Tooltip>
        )}
      </HStack>
    </Box>
  );
};

const getDeviceIcon = (deviceType) => {
  if (!deviceType) return <FiMonitor size={18} />;
  switch (deviceType.toLowerCase()) {
    case "mobile":
      return <FiSmartphone size={18} />;
    case "tablet":
      return <FiTablet size={18} />;
    default:
      return <FiMonitor size={18} />;
  }
};

const getBrowserIcon = (browser) => {
  if (!browser) return <FiGlobe size={14} />;
  const bLower = browser.toLowerCase();
  if (bLower.includes("chrome")) return <SiGooglechrome size={14} />;
  if (bLower.includes("firefox")) return <SiFirefoxbrowser size={14} />;
  if (bLower.includes("safari")) return <SiSafari size={14} />;
  if (bLower.includes("edge")) return <SiFirefox size={14} />;
  if (bLower.includes("opera")) return <SiOperagx size={14} />;
  return <FiGlobe size={14} />;
};

const getOSIcon = (os) => {
  if (!os) return <FiGlobe size={14} />;
  const osLower = os.toLowerCase();
  if (osLower.includes("windows")) return <SiGitforwindows size={14} />;
  if (osLower.includes("mac") || osLower.includes("ios"))
    return <SiApple size={14} />;
  if (osLower.includes("linux")) return <SiLinux size={14} />;
  if (osLower.includes("android")) return <SiAndroid size={14} />;
  return <FiGlobe size={14} />;
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const AccountSettingsTab = () => {
  const { account, setAccount, logout } = useAuth();
  const [preferredName, setPreferredName] = useState(
    account?.preferred_name || ""
  );
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const toast = useToast();
  const { sessions, isLoadingSessions, terminateSession } =
    useAccountSessions();
  const [selectedSessionIdToTerminate, setSelectedSessionIdToTerminate] =
    useState(null);

  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onClose: onChangePasswordClose,
  } = useDisclosure();
  const {
    isOpen: isConfirmTerminateOpen,
    onOpen: onConfirmTerminateOpen,
    onClose: onConfirmTerminateClose,
  } = useDisclosure();

  const preferredNameRef = useRef(preferredName);
  const accountRef = useRef(account);
  const isUpdatingNameRef = useRef(isUpdatingName);

  useEffect(() => {
    preferredNameRef.current = preferredName;
  }, [preferredName]);

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  useEffect(() => {
    isUpdatingNameRef.current = isUpdatingName;
  }, [isUpdatingName]);

  useEffect(() => {
    if (account?.preferred_name && account.preferred_name !== preferredName) {
      setPreferredName(account.preferred_name);
    } else if (!account?.preferred_name && preferredName !== "") {
      setPreferredName("");
    }
  }, [account?.preferred_name]);

  const handleNameChange = (e) => {
    setPreferredName(e.target.value);
  };

  const executeNameUpdate = useCallback(async () => {
    const currentNameValue = preferredNameRef.current;
    const currentAccountValue = accountRef.current;
    if (
      !currentNameValue ||
      currentNameValue.trim() === "" ||
      currentNameValue.trim() === currentAccountValue.preferred_name
    ) {
      if (isUpdatingNameRef.current) {
        setIsUpdatingName(false);
      }
      return;
    }

    setIsUpdatingName(true);
    try {
      const response = await administrationService.updatePreferredName(
        currentNameValue.trim()
      );
      setAccount((prev) => ({
        ...prev,
        preferred_name: currentNameValue.trim(),
      }));
      toast({
        description: response.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsUpdatingName(false);
    }
  }, [setAccount, toast]);

  const debouncedUpdateName = useMemo(() => {
    return debounce(executeNameUpdate, 700);
  }, [executeNameUpdate]);

  useEffect(() => {
    if (preferredName !== accountRef.current?.preferred_name) {
      debouncedUpdateName();
    } else {
      debouncedUpdateName();
    }
  }, [preferredName, debouncedUpdateName]);

  const handleTerminateClick = (sessionId) => {
    setSelectedSessionIdToTerminate(sessionId);
    onConfirmTerminateOpen();
  };

  const handleConfirmTerminate = async () => {
    if (selectedSessionIdToTerminate) {
      await terminateSession(selectedSessionIdToTerminate);
    }
    onConfirmTerminateClose();
    setSelectedSessionIdToTerminate(null);
  };

  if (!account) return (
    <Center>
      <Spinner />
    </Center>
  );

  return (
    <Box flex={1} overflowY="auto" pr={2}>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={onChangePasswordClose}
      />

      <Modal
        isOpen={isConfirmTerminateOpen}
        onClose={onConfirmTerminateClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="rgb(241,241,241)" color="gray.900" rounded='2xl'>
          <ModalHeader
            size="sm"
            fontWeight="500"
            fontFamily="Inter"
            fontSize={'lg'}
          >
            Confirm Session Termination
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontFamily="Inter" fontSize="sm" py={4}>
            <Text>
              Are you sure you want to terminate this session? This action
              cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              size="sm"
              mr={3}
              onClick={onConfirmTerminateClose}
              fontFamily="Inter"
              fontSize="xs"
              bg='transparent'
              _hover={{bg: 'transparent'}}
              color='gray.900'
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmTerminate}
              fontFamily="Inter"
              fontSize="xs"
              bg='black'
              color='white'
              _hover={{ bg: 'rgba(0,0,0,0.8)' }}
            >
              Terminate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.900">
        Account
      </Text>
      <FormControl mb={6}>
        <FormLabel
          fontFamily="Inter"
          fontSize="xs"
          fontWeight="400"
          color="gray.700"
        >
          Preferred name
        </FormLabel>
        <Input
          value={preferredName}
          onChange={handleNameChange}
          bg="rgb(255,255,255)"
          size="sm"
          rounded="lg"
          color='black'
          borderColor="gray.400"
          placeholder="Enter your preferred name"
          isDisabled={isUpdatingName}
          width="300px"
          fontFamily="Inter"
          _hover={{ borderColor: "gray.600" }}
        />
        {isUpdatingName && (
          <Text fontSize="xs" color="gray.900" mt={1}>
            Updating...
          </Text>
        )}
      </FormControl>

      <SimpleGrid columns={[1, 2]} spacing={4} mb={6}>
        <AccountInfoCard
          icon={<FiUser size={16} />}
          label="Full Name"
          value={`${account.first_name} ${account.last_name}`}
        />
        <AccountInfoCard
          icon={<FiMail size={16} />}
          label="Email Address"
          value={account.email}
          verified={account.is_verified}
          copyable
        />
        <AccountInfoCard
          icon={<FiShield size={16} />}
          label="Role & Level"
          value={`${account.role} (Level ${account.level})`}
        />
        <AccountInfoCard
          icon={<FiPhone size={16} />}
          label="Phone Number"
          value={account.phone_number || "Not set"}
          copyable={!!account.phone_number}
        />
      </SimpleGrid>

      <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.500">
        Account Status
      </Text>
      <SimpleGrid columns={[1, 2]} spacing={4} mb={6}>
        <AccountInfoCard
          icon={<FiMapPin size={16} />}
          label="Last Login Location"
          value={account.last_login_location || "Unknown"}
        />
        <AccountInfoCard
          icon={<FiClock size={16} />}
          label="Last Active"
          value={
            account.last_login_time
              ? formatRelativeTime(account.last_login_time)
              : "Never"
          }
        />
        <AccountInfoCard
          icon={<FiAlertCircle size={16} />}
          label="Account Status"
          value={
            <HStack spacing={2}>
              <Badge
                colorScheme={account.is_inactive ? "red" : "green"}
                variant="subtle"
              >
                {account.is_inactive ? "Inactive" : "Active"}
              </Badge>
              {account.visible_status && (
                <Badge colorScheme="purple" variant="subtle">
                  {account.visible_status}
                </Badge>
              )}
            </HStack>
          }
        />
        <AccountInfoCard
          icon={<FiClock size={16} />}
          label="Member Since"
          value={new Date(account.created_at).toLocaleDateString()}
        />
      </SimpleGrid>

      <Divider my={6} borderColor="gray.300" />
      <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.900">
        Account security
      </Text>
      <FormControl mb={6}>
        <FormLabel
          fontFamily="Inter"
          fontSize="xs"
          fontWeight="400"
          color="gray.900"
        >
          Password
        </FormLabel>
        <Text fontSize="xs" color="gray.700" mb={2}>
          Set a permanent password to login to your account.
        </Text>
        <Button
          variant="outline"
          size="sm"
          onClick={onChangePasswordOpen}
          borderColor="gray.900"
          _hover={{ bg: "rgb(0,0,0)" }}
          fontFamily="Inter"
          fontSize="xs"
          color="#fff"
          bg="rgb(0,0,0)"
        >
          Change password
        </Button>
      </FormControl>

      <Divider my={6} borderColor="gray.300" />

      <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.900">
        Active Devices
      </Text>
      {isLoadingSessions ? (
        <Spinner />
      ) : sessions.length === 0 ? (
        <Text color="gray.900" fontSize="sm">
          No other active sessions.
        </Text>
      ) : (
        sessions.map((session) => (
          <Box
            key={session.id}
            p={4}
            bg="rgb(255,255,255)"
            borderRadius="lg"
            borderWidth={1}
            borderColor="gray.300"
            mb={3}
          >
            <Flex direction="column" gap={2}>
              <Flex align="center" justify="space-between">
                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    color="gray.400"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="36px"
                    h="36px"
                  >
                    {getDeviceIcon(session.device_info)}
                  </Box>
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="500"
                      fontFamily="Inter"
                      color="gray.900"
                    >
                      {session.device_info || "Unknown Device"}
                    </Text>
                    <HStack
                      spacing={1.5}
                      color="gray.900"
                      fontSize="xs"
                      mt={0.5}
                    >
                      <HStack spacing={1}>
                        {getBrowserIcon(session.browser)}
                        <Text>{session.browser || "N/A"}</Text>
                      </HStack>
                      <Text>•</Text>
                      <HStack spacing={1}>
                        {getOSIcon(session.os)}
                        <Text>{session.os || "N/A"}</Text>
                      </HStack>
                    </HStack>
                  </Box>
                </HStack>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="red"
                  onClick={() => handleTerminateClick(session.id)}
                  fontFamily="Inter"
                  fontSize="xs"
                  borderColor="gray.400"
                  _hover={{ bg: "rgba(255,0,0,0.1)", borderColor: "red.500" }}
                >
                  Terminate
                </Button>
              </Flex>
              <Flex
                gap={4}
                mt={2}
                fontSize="xs"
                color="gray.900"
                fontFamily="Inter"
              >
                <HStack>
                  <FiMapPin size={12} />
                  <Text>{session.ip_address}</Text>
                </HStack>
                <HStack>
                  <FiClock size={12} />
                  <Text>Created {formatRelativeTime(session.created_at)}</Text>
                </HStack>
                <HStack>
                  <FiClock size={12} />
                  <Text>Expires {formatRelativeTime(session.expired_at)}</Text>
                </HStack>
              </Flex>
            </Flex>
          </Box>
        ))
      )}

      <Divider my={6} borderColor="gray.300" />
      <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.900">
        Account Deletion
      </Text>
      <Button
        colorScheme="red"
        variant="outline"
        size="sm"
        onClick={logout}
        fontFamily="Inter"
        fontSize="xs"
        borderColor="gray.700"
        _hover={{ bg: "rgba(255,0,0,0.1)", borderColor: "red.500" }}
      >
        Sign out from this account
      </Button>
    </Box>
  );
};

export default AccountSettingsTab;
