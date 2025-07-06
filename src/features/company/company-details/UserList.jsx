import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  HStack,
  Badge,
  Icon,
  Tooltip,
  Link,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiBriefcase,
  FiCpu,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLock,
  FiUnlock,
} from "react-icons/fi";
import { formatRelativeTime } from "../../../commons/formatOptions";

const UserList = ({ users }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!users || users.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderRadius="md"
        bg="transparent"
        border="1px dashed"
        borderColor="gray.200"
      >
        <Icon as={FiUser} fontSize="3xl" color="gray.900" mb={3} />
        <Text fontWeight="bold" color="black" mb={1}>
          No Users Found
        </Text>
        <Text color="gray.900">
          This company doesn't have any associated users.
        </Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="md" colorScheme="whiteAlpha">
        <Thead bg="transparent">
          <Tr>
            <Th color="gray.900" fontWeight="medium" borderColor="gray.200" textTransform={'none'}>
              User
            </Th>
            {!isMobile && (
              <Th color="gray.900" fontWeight="medium" borderColor="gray.200" textTransform={'none'}>
                Contact
              </Th>
            )}
            <Th color="gray.900" fontWeight="medium" borderColor="gray.200" textTransform={'none'}>
              Role
            </Th>
            <Th color="gray.900" fontWeight="medium" borderColor="gray.200" textTransform={'none'}>
              Status
            </Th>
            {!isMobile && (
              <Th color="gray.900" fontWeight="medium" borderColor="gray.200" textTransform={'none'}>
                Last Active
              </Th>
            )}
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr
              key={user.id}
              _hover={{ bg: "rgb(241,241,241)" }}
              transition="background-color 0.2s"
            >
              {/* User Column */}
              <Td borderColor="gray.200">
                <HStack spacing={3}>
                  <Avatar
                    size="sm"
                    name={`${user.first_name} ${user.last_name}`}
                    bg={
                      user.role === "global-administrator"
                        ? "purple.500"
                        : user.role === "administrator"
                        ? "blue.500"
                        : user.role === "supplier"
                        ? "green.500"
                        : "gray.500"
                    }
                  />
                  <Box>
                    <Text
                      fontWeight="medium"
                      color="gray.900"
                      fontSize="sm"
                      mb={0.5}
                    >
                      {user.preferred_name ||
                        `${user.first_name} ${user.last_name}`}
                    </Text>
                    {isMobile && (
                      <Text color="gray.900" fontSize="xs">
                        {user.email}
                      </Text>
                    )}
                  </Box>
                </HStack>
              </Td>

              {/* Contact Info - Hidden on mobile */}
              {!isMobile && (
                <Td borderColor="gray.200">
                  <VStack align="start" spacing={1}>
                    <HStack color="gray.900" fontSize="sm">
                      <Icon as={FiMail} color="gray.900" boxSize={3.5} />
                      <Link href={`mailto:${user.email}`} color="blue.400">
                        {user.email}
                      </Link>
                    </HStack>
                    {user.phone_number && (
                      <HStack color="gray.900" fontSize="sm">
                        <Icon as={FiPhone} color="gray.900" boxSize={3.5} />
                        <Text>{user.phone_number}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Td>
              )}

              {/* Role Column */}
              <Td borderColor="gray.200">
                <Badge
                  colorScheme={
                    user.role === "global-administrator"
                      ? "purple"
                      : user.role === "administrator"
                      ? "blue"
                      : user.role === "supplier"
                      ? "green"
                      : "gray"
                  }
                  display="flex"
                  alignItems="center"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="medium"
                  width="fit-content"
                >
                  <Icon
                    as={
                      user.role === "global-administrator"
                        ? FiShield
                        : user.role === "administrator"
                        ? FiCpu
                        : user.role === "supplier"
                        ? FiBriefcase
                        : FiUser
                    }
                    mr={1}
                    boxSize={3}
                  />
                  {user.role
                    ?.replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </Td>

              {/* Status Column */}
              <Td borderColor="gray.200">
                <HStack spacing={1} wrap="wrap">
                  <Badge
                    colorScheme={user.is_inactive ? "gray" : "green"}
                    variant={user.is_inactive ? "subtle" : "solid"}
                    fontSize="xs"
                    px={1.5}
                    py={0.5}
                    borderRadius="md"
                  >
                    <Icon
                      as={user.is_inactive ? FiXCircle : FiCheckCircle}
                      mr={1}
                      boxSize={3}
                    />
                    {user.is_inactive ? "Inactive" : "Active"}
                  </Badge>

                  <Badge
                    colorScheme={user.is_verified ? "teal" : "yellow"}
                    variant={user.is_verified ? "solid" : "subtle"}
                    fontSize="xs"
                    px={1.5}
                    py={0.5}
                    borderRadius="md"
                  >
                    <Icon
                      as={user.is_verified ? FiCheckCircle : FiAlertCircle}
                      mr={1}
                      boxSize={3}
                    />
                    {user.is_verified ? "Verified" : "Unverified"}
                  </Badge>

                  {user.is_locked && (
                    <Badge
                      colorScheme="red"
                      fontSize="xs"
                      px={1.5}
                      py={0.5}
                      borderRadius="md"
                    >
                      <Icon as={FiLock} mr={1} boxSize={3} />
                      Locked
                    </Badge>
                  )}
                </HStack>
              </Td>

              {/* Last Active Column - Hidden on mobile */}
              {!isMobile && (
                <Td color="gray.900" fontSize="sm" borderColor="gray.200">
                  <Tooltip
                    label={
                      user.last_login_time
                        ? new Date(user.last_login_time).toLocaleString()
                        : "Never logged in"
                    }
                    placement="top"
                    hasArrow
                  >
                    <Text>
                      {user.last_login_time
                        ? formatRelativeTime(user.last_login_time)
                        : "Never"}
                    </Text>
                  </Tooltip>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

// VStack component - defined here to avoid importing the entire Chakra library
const VStack = ({ children, align = "center", spacing = 2, ...rest }) => {
  return (
    <Flex
      direction="column"
      alignItems={align}
      gap={spacing}
      {...rest}
    >
      {children}
    </Flex>
  );
};

export default UserList;
