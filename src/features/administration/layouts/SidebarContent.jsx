import {
  Box,
  CloseButton,
  Flex,
  Text,
  useColorModeValue,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FiHome, FiSettings, FiSearch } from "react-icons/fi";
import NavItem from "./NavItem";
import {
  AiOutlineUser,
  AiOutlineUsergroupAdd,
  AiOutlineShop,
} from "react-icons/ai";
import { useAuth } from "../authContext/authContext";
// import GlobalSearch from '../search/GlobalSearch';

const SidebarContent = ({ onClose, onSettingsOpen, ...rest }) => {
  const { account, isLoading, logout } = useAuth();
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const LinkItems = [
    { name: "Home", icon: FiHome, href: "/dashboard" },
    { name: "Users", icon: AiOutlineUser, href: "/administrations-console" },
    { name: "Companies", icon: AiOutlineUsergroupAdd, href: "/companies-console" },
    { name: "Taxes", icon: AiOutlineUsergroupAdd, href: "/taxes-console" },
    { name: "Category", icon: AiOutlineUsergroupAdd, href: "/category-console" },
    { name: "Products", icon: AiOutlineUsergroupAdd, href: "/products-console" },
    { name: "Reports", icon: AiOutlineUsergroupAdd, href: "/dashboard" },
  ];

  return (
    <>
      <Box
        transition="0s ease"
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="100%"
        zIndex={111}
        bg="rgb(235, 235, 234)"
        rounded="0"
        boxShadow={"rgba(255, 255, 255, 0.05) -1px 0px 0px 0px inset"}
        overflowY="auto"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text
            fontSize="2xl"
            fontFamily="Bricolage Grotesque"
            color="gray.900"
          >
            As-Solutions
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            href={link.href}
            onClick={link.onClick}
            color="gray.900"
            fontFamily="Inter"
          >
            {link.name}
          </NavItem>
        ))}
        <NavItem
          icon={FiSettings}
          color="gray.900"
          fontFamily="Inter"
          onClick={onSettingsOpen}
          style={{ cursor: "pointer" }}
        >
          Settings
        </NavItem>
      </Box>
    </>
  );
};

export default SidebarContent;
