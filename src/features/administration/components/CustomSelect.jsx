import React, { useState, useRef, useEffect } from "react";
import * as chakra from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select option",
  icon,
  width = "100%",
  maxHeight = "300px",
  isSearchable = false,
  variant = "filled",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && isSearchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen, isSearchable]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  const handleSelectOption = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currentIndex = filteredOptions.findIndex(
        (option) => option.value === value
      );
      const nextIndex = Math.min(currentIndex + 1, filteredOptions.length - 1);
      if (nextIndex >= 0 && nextIndex < filteredOptions.length) {
        onChange(filteredOptions[nextIndex].value);
      }
    } else if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currentIndex = filteredOptions.findIndex(
        (option) => option.value === value
      );
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex >= 0 && prevIndex < filteredOptions.length) {
        onChange(filteredOptions[prevIndex].value);
      }
    }
  };

  const sizes = {
    sm: {
      height: "32px",
      fontSize: "sm",
      paddingX: "3",
      iconSize: 3,
    },
    md: {
      height: "40px",
      fontSize: "md",
      paddingX: "4",
      iconSize: 4,
    },
    lg: {
      height: "48px",
      fontSize: "lg",
      paddingX: "4",
      iconSize: 5,
    },
  };

  const variants = {
    filled: {
      bg: "gray.800",
      borderColor: "transparent",
      _hover: { bg: "gray.700" },
      _focus: { borderColor: "blue.300", boxShadow: "0 0 0 1px #63B3ED" },
    },
    outline: {
      bg: "transparent",
      borderColor: "gray.600",
      _hover: { borderColor: "gray.500" },
      _focus: { borderColor: "blue.300", boxShadow: "0 0 0 1px #63B3ED" },
    },
    flushed: {
      bg: "transparent",
      borderRadius: "0",
      borderColor: "gray.600",
      borderTop: "none",
      borderLeft: "none",
      borderRight: "none",
      paddingX: "0",
      _hover: { borderColor: "gray.500" },
      _focus: { borderColor: "blue.300", boxShadow: "none" },
    },
  };

  return (
    <chakra.Box
      ref={selectRef}
      position="relative"
      width={width}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      aria-controls="select-dropdown"
    >
      <chakra.Box
        as={motion.div}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height={sizes[size].height}
        px={sizes[size].paddingX}
        fontSize={sizes[size].fontSize}
        borderWidth="1px"
        borderRadius="md"
        cursor="pointer"
        color="white"
        transition="all 0.2s"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
        aria-label={placeholder}
        {...variants[variant]}
      >
        <chakra.Flex alignItems="center" width="100%">
          {icon && (
            <chakra.Box mr={3} color="gray.400">
              {icon}
            </chakra.Box>
          )}

          <chakra.Text
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            flex="1"
            color={!selectedOption ? "gray.500" : "white"}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </chakra.Text>

          <chakra.Box
            as={motion.div}
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            display="flex"
            alignItems="center"
            color="gray.400"
          >
            <FaChevronDown size={12} />
          </chakra.Box>
        </chakra.Flex>
      </chakra.Box>

      <AnimatePresence>
        {isOpen && (
          <chakra.Box
            as={motion.div}
            position="absolute"
            top="100%"
            left="0"
            right="0"
            zIndex="dropdown"
            mt={1}
            bg="gray.800"
            borderRadius="md"
            boxShadow="lg"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            borderWidth="1px"
            borderColor="gray.700"
            overflow="hidden"
            id="select-dropdown"
            role="listbox"
          >
            {isSearchable && (
              <chakra.Box p={2} borderBottomWidth="1px" borderColor="gray.700">
                <chakra.Input
                  ref={searchInputRef}
                  placeholder="Search..."
                  size="sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  borderColor="gray.600"
                  _focus={{
                    borderColor: "blue.400",
                    boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
                  }}
                  bg="gray.700"
                  _hover={{ borderColor: "gray.500" }}
                />
              </chakra.Box>
            )}

            <chakra.Box
              maxHeight={maxHeight}
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "var(--chakra-colors-gray-700)",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "var(--chakra-colors-gray-500)",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "var(--chakra-colors-gray-400)",
                },
              }}
            >
              {filteredOptions.length === 0 ? (
                <chakra.Box
                  py={2}
                  px={3}
                  textAlign="center"
                  color="gray.400"
                  fontSize="sm"
                >
                  No options found
                </chakra.Box>
              ) : (
                filteredOptions.map((option) => (
                  <chakra.Box
                    key={option.value}
                    as={motion.div}
                    py={2}
                    px={3}
                    cursor="pointer"
                    transition="all 0.2s"
                    whileHover={{
                      backgroundColor: "var(--chakra-colors-gray-700)",
                    }}
                    onClick={() => handleSelectOption(option.value)}
                    bg={value === option.value ? "gray.700" : "transparent"}
                    color={value === option.value ? "white" : "gray.300"}
                    fontWeight={value === option.value ? "500" : "400"}
                    _hover={{ bg: "gray.700" }}
                    role="option"
                    aria-selected={value === option.value}
                  >
                    <chakra.Flex
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <chakra.Box>{option.label}</chakra.Box>
                      {value === option.value && (
                        <chakra.Box color="blue.400">
                          <FaCheck size={12} />
                        </chakra.Box>
                      )}
                    </chakra.Flex>
                  </chakra.Box>
                ))
              )}
            </chakra.Box>
          </chakra.Box>
        )}
      </AnimatePresence>
    </chakra.Box>
  );
};

export default CustomSelect;
