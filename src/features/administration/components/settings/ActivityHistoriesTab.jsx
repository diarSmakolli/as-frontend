import { Box, Text } from "@chakra-ui/react";

const ActivityHistoriesTab = () => {
  return (
    <Box flex={1}>
      <Text fontSize="md" mb={4} fontFamily="Inter" color="gray.900">
        Sign-in & Activity Histories
      </Text>
      <Text color="gray.900" fontSize="sm">
        This section will display your account's sign-in and activity history.
        Feature coming soon.
      </Text>
    </Box>
  );
};

export default ActivityHistoriesTab;
