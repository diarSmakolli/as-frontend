import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  IconButton,
  Flex,
  Text,
  HStack,
  VStack,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useToast,
  Avatar,
  Badge,
  Spinner,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  Tooltip,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiChevronDown,
  FiLogOut,
  FiBell,
  FiInbox,
  FiCheck,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiSettings,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../services/notificationService";
import { useAuth } from "../authContext/authContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { handleApiError } from "../../../commons/handleApiError";
import { customToastContainerStyle } from "../../../commons/toastStyles";
import { 
  formatOptions,
  formatRelativeTime,
  formatWithTimezone
 } from "../../../commons/formatOptions";
import { usePreferences } from "../authContext/preferencesProvider";


const MobileNav = ({ onOpen, onSettingsOpen, ...rest }) => {
  const { account, isLoading, logout } = useAuth();
  const { currentTimezone } = usePreferences();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const shouldRefreshRef = useRef(false);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      const newUnreadCount = response.data.unread;

      if (newUnreadCount !== unreadCount && isOpen) {
        shouldRefreshRef.current = true;
      }

      setUnreadCount(newUnreadCount);
    } catch (error) {
      handleApiError(error, toast);
    }
  }, [unreadCount, isOpen]);

  // fetch all notifications
  const fetchNotifications = useCallback(
    async (resetPage = false) => {
      if (isLoadingNotifications) return;

      try {
        setIsLoadingNotifications(true);
        const currentPage = resetPage ? 1 : page;

        const response = await notificationService.getAllNotifications(
          currentPage,
          10
        );
        const {
          notifications: newNotifications,
          total_items,
          total_pages,
          current_page,
        } = response.data.data;

        setTotalNotifications(total_items);
        setHasMore(current_page < total_pages);

        if (resetPage || currentPage === 1) {
          setNotifications(newNotifications);
        } else {
          setNotifications((prev) => [...prev, ...newNotifications]);
        }

        if (resetPage) {
          setPage(2);
        } else {
          setPage(current_page + 1);
        }

        setHasInitiallyLoaded(true);
        shouldRefreshRef.current = false;
      } catch (error) {
        handleApiError(error, toast);
      } finally {
        setIsLoadingNotifications(false);
      }
    },
    [page, isLoadingNotifications, toast]
  );

  const loadMoreNotifications = useCallback(() => {
    if (!isLoadingNotifications && hasMore) {
      fetchNotifications(false);
    }
  }, [fetchNotifications, isLoadingNotifications, hasMore, page]);

  // mark a notification as read
  const handleMarkAsRead = useCallback(
    async (notificationId, link, linkUuid, linkType) => {
      try {
        await notificationService.markAsRead(notificationId);

        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );

        setUnreadCount((prev) => Math.max(0, prev - 1));

        if (link) {
          navigate('/' + link + '/' + linkUuid);
          onClose();
        }
      } catch (error) {
        handleApiError(error, toast);
      }
    },
    [navigate, onClose, toast]
  );

  // mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const result = await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );

      setUnreadCount(0);

      toast({
        description: result.data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
    } catch (error) {
      handleApiError(error, toast);
    }
  }, [toast]);

  // handle delete notification self
  const handleDeleteNotification = useCallback(
    async (notificationId, event) => {
      if (event) {
        event.stopPropagation();
      }

      try {
        const result = await notificationService.deleteNotification(
          notificationId
        );

        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== notificationId)
        );

        const deletedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (deletedNotification && !deletedNotification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        toast({
          description: result.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          variant: "custom",
          containerStyle: customToastContainerStyle,
        });
      } catch (error) {
        handleApiError(error, toast);
      }
    },
    [notifications, toast]
  );

  useEffect(() => {
    fetchUnreadCount();

    const intervalId = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (isOpen) {
      if (!hasInitiallyLoaded || shouldRefreshRef.current) {
        setPage(1);
        fetchNotifications(true);
      }
    }
  }, [isOpen, fetchNotifications, hasInitiallyLoaded]);

  useEffect(() => {
    if (isOpen && shouldRefreshRef.current) {
      setPage(1);
      fetchNotifications(true);
    }
  }, [isOpen, fetchNotifications]);

  const getImportanceColor = (importance) => {
    switch (importance) {
      case "high":
        return "red.500";
      case "medium":
        return "orange.400";
      case "low":
        return "blue.400";
      default:
        return "gray.400";
    }
  };

  // Get importance icon
  const getImportanceIcon = (importance) => {
    switch (importance) {
      case "high":
        return <FiAlertCircle />;
      case "medium":
        return <FiInfo />;
      case "low":
        return <FiInfo />;
      default:
        return <FiInfo />;
    }
  };

  return (
    <>
    <React.Fragment>
      <Flex
        ml={{ base: 0, md: 60 }}
        px={{ base: 4, md: 4 }}
        height="20"
        alignItems="center"
        border="0"
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent={{ base: "space-between", md: "flex-end" }}
        {...rest}
      >
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          variant="outline"
          aria-label="open menu"
          icon={<FiMenu />}
        />

        <Text
          display={{ base: "flex", md: "none" }}
          fontSize="md"
          fontFamily="monospace"
          fontWeight="bold"
        >
          As solutions Fourniture
        </Text>

        <HStack spacing={{ base: "2", md: "6" }}>
          <Box position="relative">
            <Popover
              isOpen={isOpen}
              onClose={onClose}
              onOpen={() => {
                onToggle();
              }}
              placement="bottom-end"
              closeOnBlur={true}
              gutter={4}
              isLazy
            >
              <PopoverTrigger>
                <IconButton
                  icon={<FiBell size={"20px"} />}
                  aria-label="Notifications"
                  variant="ghost"
                  color="gray.500"
                  mt={"1"}
                  _hover={{ bg: "transparent", color: "blue.400" }}
                />
              </PopoverTrigger>

              {unreadCount < 0 && (
                <Badge
                  position="absolute"
                  top="1"
                  right="1"
                  rounded="full"
                  bg="red.500"
                  color="black"
                  fontSize="xs"
                  px={2}
                  boxShadow="0 0 0 2px rgba(26, 32, 44, 1)"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}

              <PopoverContent
                w={{ base: "330px", md: "400px" }}
                maxH="540px"
                bg="rgb(255, 255, 255)"
                borderColor="gray.200"
                rounded='2xl'
                borderWidth={1}
                boxShadow="dark-lg"
                _focus={{ outline: "none" }}
              >
                <PopoverArrow bg="rgb(255, 255, 255)" />
                <PopoverHeader
                  borderBottomWidth="1px"
                  borderColor="gray.200"
                  pt={3}
                  pb={3}
                  px={4}
                  fontWeight="500"
                  color="gray.900"
                >
                  <Flex justify="space-between" align="center">
                    <Text>
                      Notifications
                      {unreadCount > 0 && (
                        <Badge ml={2} colorScheme="red" rounded="full" px={2}>
                          {unreadCount}
                        </Badge>
                      )}
                    </Text>
                    {unreadCount > 0 && (
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={handleMarkAllAsRead}
                        leftIcon={<FiCheckCircle />}
                      >
                        Mark all read
                      </Button>
                    )}
                  </Flex>
                </PopoverHeader>
                <PopoverBody p={0} id="notifications-scroll-container">
                  {isLoadingNotifications && notifications.length === 0 ? (
                    <Center py={8}>
                      <Spinner size="md" color="blue.400" />
                    </Center>
                  ) : notifications.length === 0 ? (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={8}
                      px={4}
                      textAlign="center"
                      color="gray.900"
                    >
                      <FiInbox
                        size={32}
                        style={{ marginBottom: "16px", opacity: 0.7 }}
                      />
                      <Text fontWeight="medium" mb={2}>
                        No notifications
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        You're all caught up! When you have notifications,
                        they'll appear here.
                      </Text>
                    </Flex>
                  ) : (
                    <Box
                      maxH="400px"
                      overflowY="auto"
                      sx={{
                        "&::-webkit-scrollbar": {
                          width: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          width: "6px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "gray.700",
                          borderRadius: "24px",
                        },
                      }}
                      id="notifications-container"
                    >
                      <InfiniteScroll
                        dataLength={notifications.length}
                        next={loadMoreNotifications}
                        hasMore={hasMore}
                        loader={
                          <Center py={2}>
                            <Spinner size="sm" color="gray.900" />
                          </Center>
                        }
                        scrollableTarget="notifications-container"
                        endMessage={
                          <Text
                            textAlign="center"
                            color="gray.900"
                            fontSize="xs"
                            py={2}
                          >
                            {totalNotifications > 0
                              ? "That's all your notifications!"
                              : ""}
                          </Text>
                        }
                      >
                        {notifications.map((notification) => (
                          <Box
                            key={notification.id}
                            p={3}
                            borderBottomWidth="0px"
                            borderColor="gray.400"
                            bg={
                              notification.is_read
                                ? "rgb(255,255,255)"
                                : "rgb(255,255,255)"
                            }
                            _hover={{ bg: "rgb(255,255,255)" }}
                            transition="background 0.2s"
                            cursor="pointer"
                            onClick={() =>
                              handleMarkAsRead(
                                notification.id,
                                notification.link,
                                notification.link_uuid,
                                notification.link_type
                              )
                            }
                            position="relative"
                          >
                            <Flex gap={3}>
                              <Box
                                mt={1}
                                color={getImportanceColor(
                                  notification.importance
                                )}
                              >
                                {getImportanceIcon(notification.importance)}
                              </Box>
                              <Box flex="1">
                                <Flex
                                  justify="space-between"
                                  align="flex-start"
                                  mb={1} 
                                >
                                  <Text
                                    fontWeight={
                                      notification.is_read
                                        ? "normal"
                                        : "semibold"
                                    }
                                    fontSize="sm"
                                    color={
                                      notification.is_read
                                        ? "gray.900"
                                        : "gray.900"
                                    }
                                  >
                                    {notification.title}
                                  </Text>
                                  <Tooltip
                                    label={formatWithTimezone(
                                      notification.created_at,
                                      formatOptions.FULL_DATE_TIME,
                                      currentTimezone
                                    )}
                                    placement="top"
                                    hasArrow
                                  >
                                  <Text
                                    fontSize="xs"
                                    label={
                                      formatWithTimezone(
                                        notification.created_at,
                                        formatOptions.FULL_DATE_TIME,
                                        currentTimezone
                                      )
                                    }
                                    color="gray.900"
                                    ml={2}
                                    whiteSpace="nowrap"
                                  >
                                    {formatRelativeTime(
                                      notification.created_at
                                    )}
                                  </Text>
                                  </Tooltip>
                                </Flex>
                                <Text
                                  fontSize="xs"
                                  color={
                                    notification.is_read
                                      ? "gray.900"
                                      : "gray.900"
                                  }
                                  noOfLines={2}
                                >
                                  {notification.description}
                                </Text>

                                <Flex mt={2} justify="flex-end" gap={1}>
                                  {!notification.is_read && (
                                    <Tooltip
                                      label="Mark as read"
                                      placement="top"
                                      hasArrow
                                    >
                                      <IconButton
                                        icon={<FiCheck size={14} />}
                                        size="xs"
                                        variant="ghost"
                                        colorScheme="blue"
                                        aria-label="Mark as read"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleMarkAsRead(notification.id);
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                  <Tooltip
                                    label="Delete"
                                    placement="top"
                                    hasArrow
                                  >
                                    <IconButton
                                      icon={<FiTrash2 size={14} />}
                                      size="xs"
                                      variant="ghost"
                                      colorScheme="red"
                                      aria-label="Delete notification"
                                      onClick={(e) =>
                                        handleDeleteNotification(
                                          notification.id,
                                          e
                                        )
                                      }
                                    />
                                  </Tooltip>
                                </Flex>
                              </Box>
                            </Flex>
                          </Box>
                        ))}
                      </InfiniteScroll>
                    </Box>
                  )}
                </PopoverBody>
                <PopoverFooter
                  borderTopWidth="0px"
                  borderColor="gray.400"
                  p={2}
                ></PopoverFooter>
              </PopoverContent>
            </Popover>
          </Box>

          {account && (
            <Flex alignItems="center">
              <Menu>
                <MenuButton
                  py={2}
                  transition="all 0.3s"
                  _focus={{ boxShadow: "none" }}
                >
                  <HStack>
                    <Avatar
                      size="sm"
                      name={`${account.first_name} ${account.last_name}`}
                      bg="blue.500"
                    />
                    <VStack
                      display={{ base: "none", md: "flex" }}
                      alignItems="flex-start"
                      spacing="1px"
                      ml="2"
                    >
                      <Text fontSize="sm" color="gray.900">
                        {account.preferred_name ||
                          `${account.first_name} ${account.last_name}`}
                      </Text>
                      <Text fontSize="xs" color="gray.900">
                        {account.role?.replace("-", " ")}
                      </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                      <FiChevronDown color="gray.500" />
                    </Box>
                  </HStack>
                </MenuButton>

                <MenuList
                  bg="rgb(255, 255, 255)"
                  borderColor="gray.200"
                  boxShadow="xl"
                >
                  <MenuItem
                    icon={<FiLogOut />}
                    onClick={logout}
                    color="gray.900"
                    bg="transparent"
                    _hover={{ bg: "transparent" }}
                  >
                    Sign out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}

        </HStack>

        
      </Flex>
    </React.Fragment>
    </>
  );
};

export default MobileNav;
