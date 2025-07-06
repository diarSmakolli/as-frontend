import React, { useState } from "react";
import {
  Box,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  Badge,
  HStack,
  Icon,
  AspectRatio,
  IconButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Flex,
  Tag,
  Center,
  useToast,
} from "@chakra-ui/react";
import {
  FiEdit,
  FiTrash2,
  FiEye,
  FiImage,
  FiGlobe,
  FiSettings,
  FiCheck,
  FiX,
  FiAlertCircle,
  FiClock,
  FiMoreHorizontal,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import AssetStatusBadge from "./AssetStatusBadge";
import { formatRelativeTime } from "../../../commons/formatOptions";
import NoImage from "../../../assets/no-image.svg";
import { handleApiError } from "../../../commons/handleApiError";
import { companiesService } from "../services/companiesService";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const AssetsList = ({
  assets,
  onEdit,
  onDelete,
  onStatusChange,
  refreshAssets,
}) => {
  if (!assets || assets.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        borderRadius="md"
        bg="transparent"
        border="1px dashed"
        borderColor="gray.200"
      >
        <Icon as={FiImage} fontSize="3xl" color="gray.900" mb={3} />
        <Text fontWeight="bold" color="black" mb={1}>
          No Assets Found
        </Text>
        <Text color="gray.900">
          This company doesn't have any assets registered.
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onEdit={() => onEdit(asset)}
          onDelete={() => onDelete(asset)}
          onStatusChange={onStatusChange}
          refreshAssets={refreshAssets}
        />
      ))}
    </SimpleGrid>
  );
};

const AssetCard = ({
  asset,
  onEdit,
  onDelete,
  onStatusChange,
  refreshAssets,
}) => {
  const {
    isOpen: isMenuOpen,
    onToggle: toggleMenu,
    onClose: closeMenu,
  } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toast = useToast();

  const hasImages = asset.images && asset.images.length > 0;

  const mainImage = hasImages
    ? `${asset.images[currentImageIndex].url}`
    : NoImage;

  const totalImages = hasImages ? asset.images.length : 0;

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleImageDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Status update directly from the card
  const handleQuickStatusChange = async (e, newStatus) => {
    e.stopPropagation();
    try {
      const result = await companiesService.updateCompanyAssetStatus(
        asset.company_id,
        asset.id,
        newStatus
      );
      toast({
        description: result.data.message || `Asset status changed to ${newStatus}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      refreshAssets && refreshAssets(true);
    } catch (error) {
      handleApiError(error, toast);
    }
  };

  return (
    <Card
      maxW="100%"
      bg="rgb(255,255,255)"
      borderColor="gray.400"
      borderWidth="1px"
      overflow="hidden"
      _hover={{ borderColor: "blue.500", transform: "translateY(-2px)" }}
      transition="all 0.3s ease"
      boxShadow="md"
      rounded="xl"
      position="relative"
    >
      <Menu isOpen={isMenuOpen} onClose={closeMenu}>
        <MenuButton
          as={IconButton}
          icon={<FiMoreHorizontal />}
          variant="ghost"
          position="absolute"
          top={2}
          right={2}
          size="sm"
          borderRadius="full"
          zIndex={2}
          color="white"
          _hover={{ bg: "blackAlpha.600" }}
          aria-label="Asset options"
          onClick={toggleMenu}
          bg="rgb(32,32,32)"
        />
        <MenuList
          bg="rgb(255,255,255)"
          borderColor="gray.200"
          boxShadow="xl"
          zIndex={10}
        >
          <MenuItem
            icon={<FiEdit />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              closeMenu();
            }}
            _hover={{ bg: "rgb(241,241,241)" }}
            color="black"
            bg="rgb(255,255,255)"
          >
            Edit Asset
          </MenuItem>
          <MenuItem
            icon={<FiTrash2 />}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              closeMenu();
            }}
            _hover={{ bg: "rgb(241,241,241)" }}
            color="black"
            bg="rgb(255,255,255)"
          >
            Delete Asset
          </MenuItem>
          <Divider borderColor="gray.700" />
          <MenuItem
            icon={<FiCheck />}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(asset.id, "active");
              closeMenu();
            }}
            isDisabled={asset.status === "active"}
            _hover={{ bg: "rgb(241,241,241)" }}
            color="black"
            bg="rgb(255,255,255)"
          >
            Mark as Active
          </MenuItem>
          <MenuItem
            icon={<FiX />}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(asset.id, "inactive");
              closeMenu();
            }}
            isDisabled={asset.status === "inactive"}
            _hover={{ bg: "rgb(241,241,241)" }}
            color="black"
            bg="rgb(255,255,255)"
          >
            Mark as Inactive
          </MenuItem>
          <MenuItem
            icon={<FiClock />}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(asset.id, "pending");
              closeMenu();
            }}
            isDisabled={asset.status === "pending"}
            _hover={{ bg: "rgb(241,241,241)" }}
            color="black"
            bg="rgb(255,255,255)"
          >
            Mark as Pending
          </MenuItem>
          <MenuItem
            icon={<FiCheck />}
            onClick={(e) => {
              e.stopPropagation();
              onStatusChange(asset.id, "verified");
              closeMenu();
            }}
            isDisabled={asset.status === "verified"}
            _hover={{ bg: "rgb(241,241,241)" }}
            color="black"
            bg="rgb(255,255,255)"
          >
            Mark as Verified
          </MenuItem>
        </MenuList>
      </Menu>

      {/* Image Carousel */}
      <AspectRatio ratio={16 / 10} position="relative">
        <Box position="relative" width="100%" height="100%">
          <Image
            src={mainImage}
            alt={asset.asset_name}
            objectFit="cover"
            width="100%"
            height="100%"
            fallback={
              <Box
                bg="gray.700"
                display="flex"
                alignItems="center"
                justifyContent="center"
                width="100%"
                height="100%"
              >
                <Icon as={FiImage} fontSize="3xl" color="gray.900" />
              </Box>
            }
          />

          {/* Image navigation controls - show only if we have multiple images */}
          {totalImages > 1 && (
            <>
              <IconButton
                icon={<FiChevronLeft />}
                aria-label="Previous image"
                position="absolute"
                left={2}
                top="50%"
                transform="translateY(-50%)"
                borderRadius="full"
                size="sm"
                colorScheme="blackAlpha"
                bg="blackAlpha.600"
                _hover={{ bg: "blackAlpha.800" }}
                onClick={handlePrevImage}
              />

              <IconButton
                icon={<FiChevronRight />}
                aria-label="Next image"
                position="absolute"
                right={2}
                top="50%"
                transform="translateY(-50%)"
                borderRadius="full"
                size="sm"
                colorScheme="blackAlpha"
                bg="blackAlpha.600"
                _hover={{ bg: "blackAlpha.800" }}
                onClick={handleNextImage}
              />

              {/* Image dot indicators */}
              <Flex
                position="absolute"
                bottom={2}
                width="100%"
                justifyContent="center"
                gap={1}
              >
                {Array.from({ length: totalImages }).map((_, index) => (
                  <Box
                    key={index}
                    w={2}
                    h={2}
                    borderRadius="full"
                    bg={
                      index === currentImageIndex ? "white" : "whiteAlpha.600"
                    }
                    cursor="pointer"
                    onClick={() => handleImageDotClick(index)}
                    _hover={{ bg: "white" }}
                  />
                ))}
              </Flex>
            </>
          )}

          <HStack position="absolute" top={2} left={2} spacing={1}>
            <IconButton
              icon={<FiEdit />}
              size="xs"
              colorScheme="blue"
              borderRadius="full"
              aria-label="Edit asset"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            />
            <IconButton
              icon={<FiTrash2 />}
              size="xs"
              colorScheme="red"
              borderRadius="full"
              aria-label="Delete asset"
              onClick={() => onDelete()}
            />
          </HStack>
        </Box>
      </AspectRatio>

      <CardBody pt={3} pb={2}>
        <Stack spacing={2}>
          <HStack justify="space-between" align="start">
            <Heading size="md" color="black" noOfLines={2}>
              {asset.asset_name}
            </Heading>
            <Tooltip label={`Click to change status`} hasArrow>
              <Box
                cursor="pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  const nextStatus = {
                    active: "inactive",
                    inactive: "pending",
                    pending: "verified",
                    verified: "active",
                  }[asset.status];
                  handleQuickStatusChange(e, nextStatus);
                }}
              >
                <AssetStatusBadge status={asset.status} />
              </Box>
            </Tooltip>
          </HStack>

          <HStack spacing={1} flexWrap="wrap">
            {asset.category && (
              <Tag
                size="sm"
                variant="subtle"
                colorScheme="blue"
                borderRadius="full"
              >
                {asset.category}
              </Tag>
            )}
            {asset.serial_number && (
              <Tag
                size="sm"
                variant="subtle"
                colorScheme="purple"
                borderRadius="full"
              >
                {asset.serial_number}
              </Tag>
            )}
          </HStack>

          <Text color="gray.900" fontSize="sm" noOfLines={3}>
            {asset.description || "No description provided."}
          </Text>

          {asset.location && (
            <HStack color="gray.900" fontSize="sm" spacing={1}>
              <Icon as={FiGlobe} color="gray.900" boxSize="3" />
              <Text>{asset.location}</Text>
            </HStack>
          )}

          {asset.created_at && (
            <Tooltip
              label={new Date(asset.created_at).toLocaleDateString()}
              placement="bottom"
              hasArrow
            >
              <Text color="gray.900" fontSize="xs">
                Added {formatRelativeTime(asset.created_at)}
              </Text>
            </Tooltip>
          )}
        </Stack>
      </CardBody>

      <Divider borderColor="gray.200" />

      <CardFooter pt={2} pb={2} display="flex" justifyContent="space-between">
        <Text fontWeight="medium" color="gray.900" fontSize="sm">
          Asset ID:{" "}
          <Text as="span" fontSize="xs">
            {asset.asset_tag}
          </Text>
        </Text>
        <HStack spacing={1}>
          {hasImages && (
            <Tooltip
              label={`${totalImages} image${totalImages !== 1 ? "s" : ""}`}
              placement="top"
              hasArrow
            >
              <Box>
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  borderRadius="full"
                  px={2}
                >
                  <HStack spacing={1}>
                    <Icon as={FiImage} boxSize="3" />
                    <Text>{totalImages}</Text>
                  </HStack>
                </Badge>
              </Box>
            </Tooltip>
          )}
        </HStack>
      </CardFooter>
    </Card>
  );
};

export default AssetsList;
