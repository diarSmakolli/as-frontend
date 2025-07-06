import React from "react";
import { Box, Text, VStack, Icon } from "@chakra-ui/react";
import { FiInbox } from "react-icons/fi";

const EmptyState = ({
  icon = FiInbox,
  title = "No Data Found",
  message = "There are no items to display.",
  action = null,
}) => {
  return (
    <Box
      p={8}
      textAlign="center"
      borderRadius="md"
      bg="gray.50"
      border="1px dashed"
      borderColor="gray.200"
    >
      <VStack spacing={3}>
        <Icon as={icon} fontSize="3xl" color="gray.400" />
        <Text fontWeight="bold">{title}</Text>
        <Text color="gray.500">{message}</Text>
        {action && <Box mt={2}>{action}</Box>}
      </VStack>
    </Box>
  );
};

export default EmptyState;
