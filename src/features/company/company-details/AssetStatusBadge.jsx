import React from "react";
import { Badge, Icon, Tooltip } from "@chakra-ui/react";
import { FiCheckCircle, FiXCircle, FiClock, FiShield } from "react-icons/fi";

const AssetStatusBadge = ({ status, onClick }) => {
  const getStatusProps = () => {
    switch (status) {
      case "active":
        return {
          colorScheme: "green",
          icon: FiCheckCircle,
          label: "Active",
          tooltip: "Click to mark as inactive"
        };
      case "inactive":
        return {
          colorScheme: "red",
          icon: FiXCircle,
          label: "Inactive",
          tooltip: "Click to mark as pending"
        };
      case "pending":
        return {
          colorScheme: "yellow",
          icon: FiClock,
          label: "Pending",
          tooltip: "Click to mark as verified"
        };
      case "verified":
        return {
          colorScheme: "blue",
          icon: FiShield,
          label: "Verified",
          tooltip: "Click to mark as active"
        };
      default:
        return {
          colorScheme: "gray",
          icon: FiClock,
          label: status || "Unknown",
          tooltip: "Click to change status"
        };
    }
  };

  const { colorScheme, icon, label, tooltip } = getStatusProps();

  const badge = (
    <Badge
      colorScheme={colorScheme}
      display="flex"
      alignItems="center"
      px={2}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="medium"
      cursor={onClick ? "pointer" : "default"}
      _hover={onClick ? { transform: "scale(1.05)" } : {}}
      transition="transform 0.2s"
      onClick={onClick}
    >
      <Icon as={icon} mr={1} boxSize={3} />
      {label}
    </Badge>
  );

  if (onClick) {
    return badge;
  }

  return badge;
};

export default AssetStatusBadge;
