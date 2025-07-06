import {
    Box,
    Button,
    Input,
    List,
    ListItem,
    useOutsideClick,
    VStack,
    Text,
  } from "@chakra-ui/react";
  import { useState, useRef } from "react";
  
  export default function AdministrationCustomSelect({
    value,
    onChange,
    options,
    isDisabled,
    placeholder = "Select option",
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef();
    useOutsideClick({
      ref,
      handler: () => setIsOpen(false),
    });
  
    const selected = options.find((opt) => opt.value === value);
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  
    return (
      <Box ref={ref} position="relative" w="200px">
        <Button
          variant="outline"
          w="full"
          size="sm"
          disabled={isDisabled}
          onClick={() => setIsOpen(!isOpen)}
          justifyContent="space-between"
          fontWeight="normal"
          color="gray.300"
          bg="rgb(25,25,25)"
          border={0}
          _hover={{ bg: "rgb(25,25,25)" }}
          _disabled={{ opacity: 0.5 }}
        >
          {selected ? selected.label : placeholder}
          <Box as="span" ml={2}>
            ▼
          </Box>
        </Button>
  
        {isOpen && (
          <Box
            mt={1}
            position="absolute"
            w="full"
            bg="rgb(25,25,25)"
            zIndex={10}
            border="1px solid"
            borderColor="gray.600"
            borderRadius="md"
            maxH="200px"
            overflowY="auto"
          >
            <Box p={2} borderBottom="1px solid" borderColor="gray.600">
              <Input
                placeholder="Search..."
                size="sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                bg="gray.800"
                color="gray.300"
              />
            </Box>
            <List spacing={1} maxH="150px" overflowY="auto">
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <ListItem
                    key={opt.value}
                    px={3}
                    py={2}
                    fontSize="sm"
                    cursor="pointer"
                    bg={opt.value === value ? "blue.600" : "transparent"}
                    color={opt.value === value ? "white" : "gray.300"}
                    _hover={{ bg: "gray.600" }}
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    {opt.label}
                  </ListItem>
                ))
              ) : (
                <Text px={3} py={2} fontSize="sm" color="gray.500">
                  No options found
                </Text>
              )}
            </List>
          </Box>
        )}
      </Box>
    );
  }
  