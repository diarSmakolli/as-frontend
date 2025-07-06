import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  MenuList,
  MenuItem,
  Menu,
  MenuButton,
  Text,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
} from "@chakra-ui/react";
import { FaChevronDown, FaSearch, FaTimesCircle } from "react-icons/fa";

const CommonSelect = ({
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  isSearchable = false,
  isLoading = false,
  isDisabled = false,
  size = "md", 
  icon, 
  name,
  noOptionsMessage = "No options available",
  loadingMessage = "Loading...",
  error, 
  helperText,
  bgInput = 'rgb(241,241,241)',
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const menuButtonRef = useRef(null);
  const [menuWidth, setMenuWidth] = useState(0);

  useEffect(() => {
    if (menuButtonRef.current) {
      setMenuWidth(menuButtonRef.current.offsetWidth);
    }
  }, [isOpen]);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleSelectOption = (optionValue) => {
    const simulatedEvent = {
      target: {
        name: name,
        value: optionValue,
      },
    };
    onChange(simulatedEvent);
    setIsOpen(false);
    setSearchTerm("");
  };

  const selectedOption = options.find((option) => option.value === value);

  const getDisplayLabel = () => {
    if (isLoading) return loadingMessage;
    if (selectedOption) return selectedOption.label;
    return placeholder;
  };

  const handleClear = (e) => {
    e.stopPropagation(); 
    const simulatedEvent = {
      target: {
        name: name,
        value: "",
      },
    };
    onChange(simulatedEvent);
  };

  const inputSizeProps = {
    sm: { height: "30px", fontSize: "sm" },
    md: { height: "40px", fontSize: "md" },
    lg: { height: "50px", fontSize: "lg" },
  };

  const buttonPadding = {
    sm: { py: 1, px: 2 },
    md: { py: 2, px: 3 },
    lg: { py: 3, px: 4 },
  }

  return (
    <Box position="relative" {...rest}>
      <Menu
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSearchTerm("");
        }}
        matchWidth={true}
        autoSelect={false} 
        placement="bottom-start"
        offset={[0, 2]}
        isDisabled={isDisabled || isLoading}
      >
        <MenuButton
          ref={menuButtonRef}
          as={Button}
          variant="outline"
          width="100%"
          textAlign="left"
          fontWeight="normal"
          borderColor={error ? "red.500" : "gray.400"}
          bg={bgInput}
          _hover={{ borderColor: error ? "red.500" : "gray.600" }}
          _expanded={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(66,153,225,0.6)", bg: "rgb(241,241,241)" }}
          _focus={{ borderColor: "blue.400", boxShadow: "0 0 0 1px rgba(66,153,225,0.6)", bg: "rgb(241,241,241)" }}
          _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
          onClick={() => !isDisabled && !isLoading && setIsOpen(!isOpen)}
          rightIcon={
            isLoading ? (
              <Spinner size="xs" />
            ) : (
              <Icon as={FaChevronDown} transition="transform 0.2s" transform={isOpen ? "rotate(180deg)" : ""} />
            )
          }
          leftIcon={icon ? <Icon as={icon} mr={2} /> : undefined}
          height={inputSizeProps[size]?.height || "40px"}
          fontSize={inputSizeProps[size]?.fontSize || "md"}
          px={buttonPadding[size]?.px || 3}
          py={buttonPadding[size]?.py || 2}
          isDisabled={isDisabled || isLoading}
          position="relative" 
        >
          <Text
            noOfLines={1}
            color={selectedOption ? "black" : "gray.800"}
            width="calc(100% - 40px)"
          >
            {getDisplayLabel()}
          </Text>
          {selectedOption && !isDisabled && !isLoading && (
             <Icon
                as={FaTimesCircle}
                position="absolute"
                right={isLoading ? "35px" : "30px"}
                top="50%"
                transform="translateY(-50%)"
                color="gray.500"
                _hover={{ color: "gray.300" }}
                cursor="pointer"
                onClick={handleClear}
                boxSize={4}
              />
          )}
        </MenuButton>
        <MenuList
          bg="rgb(255,255,255)"
          borderColor="gray.200"
          zIndex="popover"
          maxH="300px"
          overflowY="auto"
          width={menuWidth > 0 ? `${menuWidth}px` : "100%"}
          p={2}
        >
          {isSearchable && (
            <InputGroup p={0}>
              <InputLeftElement pointerEvents="none" children={<Icon as={FaSearch} color="gray.500" />} />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                bg="rgb(255,255,255)"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "blue.400", boxShadow: "none", bg: "rgb(255,255,255)" }}
                _active={{ borderColor: "blue.400", boxShadow: "none", bg: "rgb(255,255,255)" }}
              />
            </InputGroup>
          )}
          {isLoading ? (
            <MenuItem isDisabled>
              <Spinner size="sm" mr={2} /> {loadingMessage}
            </MenuItem>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <MenuItem
                key={option.value}
                onClick={() => handleSelectOption(option.value)}
                bg={option.value === value ? "blue.600" : "transparent"}
                _hover={{ bg: option.value === value ? "blue.700" : "transparent" }}
                isDisabled={option.isDisabled}
              >
                {option.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem isDisabled>{noOptionsMessage}</MenuItem>
          )}
        </MenuList>
      </Menu>
      {helperText && !error && <Text fontSize="xs" color="gray.400" mt={1}>{helperText}</Text>}
      {error && <Text fontSize="xs" color="red.400" mt={1}>{error}</Text>}
    </Box>
  );
};

export default CommonSelect;