import React, { useState, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  useToast,
  FormHelperText,
  FormErrorMessage,
  Collapse,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiSettings,
  FiType,
  FiList,
  FiSquare,
  FiCircle,
  FiFile,
  FiCalendar,
  FiHash,
  FiImage,
  FiDollarSign,
  FiEye,
  FiUpload,
  FiX,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

const MotionBox = motion.create(Box);

const CustomOptionsForm = ({ customOptions = [], onCustomOptionsChange, onOptionValueImageUpload }) => {
  const toast = useToast();
  const { isOpen: isFormOpen, onToggle: toggleForm } = useDisclosure({ defaultIsOpen: false });
  const { isOpen: isValueModalOpen, onOpen: onValueModalOpen, onClose: onValueModalClose } = useDisclosure();
  
  const [currentOption, setCurrentOption] = useState({
    option_name: '',
    option_type: 'text',
    is_required: false,
    is_active: true,
    affects_price: false,
    price_modifier_type: 'fixed',
    base_price_modifier: 0,
    placeholder_text: '',
    help_text: '',
    sort_order: 0,
    option_values: []
  });
  
  const [currentValue, setCurrentValue] = useState({
    option_value: '',
    display_name: '',
    price_modifier: 0,
    price_modifier_type: 'fixed',
    image: null,
    image_preview: null,
    image_alt_text: '',
    is_default: false,
    is_active: true,
    sort_order: 0,
    stock_quantity: null,
    is_in_stock: true
  });
  
  const [editingValueIndex, setEditingValueIndex] = useState(null);
  const [errors, setErrors] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);
  const fileInputRef = useRef(null);

  const optionTypes = [
    { value: 'text', label: 'Text Input', icon: FiType, hasValues: false },
    { value: 'textarea', label: 'Textarea', icon: FiType, hasValues: false },
    { value: 'select', label: 'Dropdown Select', icon: FiList, hasValues: true },
    { value: 'radio', label: 'Radio Buttons', icon: FiCircle, hasValues: true },
    { value: 'checkbox', label: 'Checkboxes', icon: FiSquare, hasValues: true },
    { value: 'file', label: 'File Upload', icon: FiFile, hasValues: false },
    { value: 'date', label: 'Date Picker', icon: FiCalendar, hasValues: false },
    { value: 'number', label: 'Number Input', icon: FiHash, hasValues: false }
  ];

  const handleInputChange = (name, value) => {
    setCurrentOption(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleValueInputChange = (name, value) => {
    setCurrentValue(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCurrentValue(prev => ({
        ...prev,
        image: file,
        image_preview: e.target.result,
        image_alt_text: prev.image_alt_text || prev.option_value || 'Option image'
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCurrentValue(prev => ({
      ...prev,
      image: null,
      image_preview: null,
      image_alt_text: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateOption = () => {
    const newErrors = {};
    
    if (!currentOption.option_name?.trim()) {
      newErrors.option_name = 'Option name is required';
    }
    
    const selectedType = optionTypes.find(type => type.value === currentOption.option_type);
    if (selectedType?.hasValues && currentOption.option_values.length === 0) {
      newErrors.option_values = 'At least one option value is required for this type';
    }
    
    const existingIndex = customOptions.findIndex(option => 
      option.option_name?.toLowerCase() === currentOption.option_name?.toLowerCase()
    );
    
    if (existingIndex !== -1 && existingIndex !== editingIndex) {
      newErrors.option_name = 'An option with this name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateValue = () => {
    if (!currentValue.option_value?.trim()) {
      toast({
        title: 'Value Required',
        description: 'Option value is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    const existingIndex = currentOption.option_values.findIndex(val => 
      val.option_value?.toLowerCase() === currentValue.option_value?.toLowerCase()
    );
    
    if (existingIndex !== -1 && existingIndex !== editingValueIndex) {
      toast({
        title: 'Duplicate Value',
        description: 'This option value already exists',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    return true;
  };

  const openValueModal = (valueIndex = null) => {
    if (valueIndex !== null) {
      const value = currentOption.option_values[valueIndex];
      setCurrentValue({
        ...value,
        // If editing and value has image_url but no image, set preview for display
        image: null,
        image_preview: value.image_preview || value.image_url || null
      });
      setEditingValueIndex(valueIndex);
    } else {
      setCurrentValue({
        option_value: '',
        display_name: '',
        price_modifier: 0,
        price_modifier_type: 'fixed',
        image: null,
        image_preview: null,
        image_alt_text: '',
        is_default: currentOption.option_values.length === 0,
        is_active: true,
        sort_order: currentOption.option_values.length,
        stock_quantity: null,
        is_in_stock: true
      });
      setEditingValueIndex(null);
    }
    onValueModalOpen();
  };

  // const saveOptionValue = () => {
  //   if (!validateValue()) return;

  //   // If a new image was uploaded, keep the File in 'image'.
  //   // If using an existing image_url, keep image as null and image_url as string.
  //   const valueData = {
  //     ...currentValue,
  //     display_name: currentValue.display_name || currentValue.option_value,
  //     sort_order: editingValueIndex !== null ? currentValue.sort_order : currentOption.option_values.length,
  //     // If image is a File, keep it; if not, keep image_url
  //     image: currentValue.image instanceof File ? currentValue.image : null,
  //     image_preview: currentValue.image_preview || null,
  //     image_url: !currentValue.image && currentValue.image_preview && typeof currentValue.image_preview === "string"
  //       ? currentValue.image_preview
  //       : currentValue.image_url || null
  //   };

  //   let newValues;
  //   if (editingValueIndex !== null) {
  //     newValues = [...currentOption.option_values];
  //     newValues[editingValueIndex] = valueData;
  //   } else {
  //     newValues = [...currentOption.option_values, valueData];
  //   }

  //   setCurrentOption(prev => ({
  //     ...prev,
  //     option_values: newValues
  //   }));

  //   onValueModalClose();
  //   setEditingValueIndex(null);
  //   resetCurrentValue();

  //   toast({
  //     title: editingValueIndex !== null ? 'Value Updated' : 'Value Added',
  //     description: `${valueData.option_value} has been ${editingValueIndex !== null ? 'updated' : 'added'} successfully`,
  //     status: 'success',
  //     duration: 2000,
  //     isClosable: true,
  //   });
  // };

  const saveOptionValue = async () => {
  if (!validateValue()) return;

  const valueData = {
    ...currentValue,
    display_name: currentValue.display_name || currentValue.option_value,
    sort_order: editingValueIndex !== null ? currentValue.sort_order : currentOption.option_values.length,
    image: currentValue.image instanceof File ? currentValue.image : null,
    image_preview: currentValue.image_preview || null,
    image_url: !currentValue.image && currentValue.image_preview && typeof currentValue.image_preview === "string"
      ? currentValue.image_preview
      : currentValue.image_url || null
  };

  let newValues;
  let newValueId = valueData.id || valueData._id; // Use existing id if present

  if (editingValueIndex !== null) {
    newValues = [...currentOption.option_values];
    newValues[editingValueIndex] = valueData;
  } else {
    newValues = [...currentOption.option_values, valueData];
  }

  setCurrentOption(prev => ({
    ...prev,
    option_values: newValues
  }));

  onValueModalClose();
  setEditingValueIndex(null);
  resetCurrentValue();

  toast({
    title: editingValueIndex !== null ? 'Value Updated' : 'Value Added',
    description: `${valueData.option_value} has been ${editingValueIndex !== null ? 'updated' : 'added'} successfully`,
    status: 'success',
    duration: 2000,
    isClosable: true,
  });

  // --- NEW: Upload image if needed ---
  // Only do this if editing an existing value (has id) and a new image file is present
  if (
    typeof onOptionValueImageUpload === "function" &&
    valueData.image instanceof File &&
    currentOption.id && // option must have id from backend
    (valueData.id || valueData._id) // value must have id from backend
  ) {
    try {
      await onOptionValueImageUpload(
        currentOption.id,
        valueData.id || valueData._id,
        valueData.image
      );
      // Optionally, refresh the option values from backend here
    } catch (err) {
      toast({
        title: "Image upload failed",
        description: err?.response?.data?.message || "Could not upload image.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }
};

  const resetCurrentValue = () => {
    setCurrentValue({
      option_value: '',
      display_name: '',
      price_modifier: 0,
      price_modifier_type: 'fixed',
      image: null,
      image_preview: null,
      image_alt_text: '',
      is_default: false,
      is_active: true,
      sort_order: 0,
      stock_quantity: null,
      is_in_stock: true
    });
  };

  const removeOptionValue = (index) => {
    const newValues = currentOption.option_values.filter((_, i) => i !== index);
    if (newValues.length > 0 && currentOption.option_values[index]?.is_default) {
      newValues[0].is_default = true;
    }
    setCurrentOption(prev => ({
      ...prev,
      option_values: newValues
    }));
  };

  const setDefaultValue = (index) => {
    const newValues = currentOption.option_values.map((value, i) => ({
      ...value,
      is_default: i === index
    }));
    setCurrentOption(prev => ({
      ...prev,
      option_values: newValues
    }));
  };

  const addOrUpdateOption = () => {
    if (!validateOption()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the form errors before adding the option',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const optionData = {
      ...currentOption,
      id: editingIndex !== null ? customOptions[editingIndex]?.id : uuidv4()
    };

    let newOptions;
    if (editingIndex !== null) {
      newOptions = [...customOptions];
      newOptions[editingIndex] = optionData;
      setEditingIndex(null);
    } else {
      newOptions = [...customOptions, optionData];
    }

    onCustomOptionsChange(newOptions);
    resetForm();

    toast({
      title: editingIndex !== null ? 'Option Updated' : 'Option Added',
      description: `${optionData.option_name} has been ${editingIndex !== null ? 'updated' : 'added'} successfully`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const resetForm = () => {
    setCurrentOption({
      option_name: '',
      option_type: 'text',
      is_required: false,
      is_active: true,
      affects_price: false,
      price_modifier_type: 'fixed',
      base_price_modifier: 0,
      placeholder_text: '',
      help_text: '',
      sort_order: customOptions.length,
      option_values: []
    });
    setErrors({});
    setEditingIndex(null);
  };

  const editOption = (index) => {
    const option = customOptions[index];
    setCurrentOption(option);
    setEditingIndex(index);
    if (!isFormOpen) toggleForm();
  };

  const removeOption = (index) => {
    const newOptions = customOptions.filter((_, i) => i !== index);
    onCustomOptionsChange(newOptions);
    
    toast({
      title: 'Option Removed',
      description: 'Custom option has been removed successfully',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const getOptionTypeConfig = (type) => {
    return optionTypes.find(ot => ot.value === type) || optionTypes[0];
  };

  const currentTypeConfig = getOptionTypeConfig(currentOption.option_type);

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <HStack>
          <Text fontSize="lg" fontWeight="medium" color="gray.700">
            Custom Product Options
          </Text>
          {customOptions.length > 0 && (
            <Badge colorScheme="purple" variant="subtle">
              {customOptions.length} option{customOptions.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </HStack>
        <Button
          leftIcon={<FiPlus />}
          size="sm"
          colorScheme="purple"
          onClick={toggleForm}
          variant={isFormOpen ? "outline" : "solid"}
        >
          {isFormOpen ? 'Hide Form' : 'Add Option'}
        </Button>
      </HStack>

      {/* Custom Option Form */}
      <Collapse in={isFormOpen} animateOpacity>
        <Card variant="outline" borderColor="purple.200">
          <CardHeader bg="purple.50" py={4}>
            <HStack>
              <FiSettings />
              <Text fontWeight="medium" color="purple.800">
                {editingIndex !== null ? 'Edit Custom Option' : 'Add Custom Option'}
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl isInvalid={!!errors.option_name}>
                  <FormLabel color="gray.700" fontWeight="500">
                    Option Name *
                  </FormLabel>
                  <Input
                    value={currentOption.option_name}
                    onChange={(e) => handleInputChange('option_name', e.target.value)}
                    placeholder="e.g., Size, Color, Material"
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                  />
                  <FormErrorMessage>{errors.option_name}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Option Type
                  </FormLabel>
                  <Select
                    value={currentOption.option_type}
                    onChange={(e) => {
                      handleInputChange('option_type', e.target.value);
                      if (!optionTypes.find(t => t.value === e.target.value)?.hasValues) {
                        setCurrentOption(prev => ({ ...prev, option_values: [] }));
                      }
                    }}
                    bg="gray.50"
                    border="1px"
                    borderColor="gray.200"
                  >
                    {optionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                  <FormHelperText>
                    Choose how customers will interact with this option
                  </FormHelperText>
                </FormControl>
              </SimpleGrid>

              {/* Helper Text Fields */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Placeholder Text
                  </FormLabel>
                  <Input
                    value={currentOption.placeholder_text}
                    onChange={(e) => handleInputChange('placeholder_text', e.target.value)}
                    placeholder="e.g., Enter your preferred size"
                    bg="gray.50"
                  />
                  <FormHelperText>Shown inside the input field</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Sort Order
                  </FormLabel>
                  <NumberInput
                    value={currentOption.sort_order}
                    onChange={(value) => handleInputChange('sort_order', parseInt(value) || 0)}
                    min={0}
                  >
                    <NumberInputField bg="gray.50" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <FormHelperText>Display order (lower numbers appear first)</FormHelperText>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel color="gray.700" fontWeight="500">
                  Help Text
                </FormLabel>
                <Textarea
                  value={currentOption.help_text}
                  onChange={(e) => handleInputChange('help_text', e.target.value)}
                  placeholder="Additional guidance for customers about this option"
                  rows={2}
                  bg="gray.50"
                />
                <FormHelperText>Help text displayed below the option</FormHelperText>
              </FormControl>

              {/* Option Values Management */}
              {currentTypeConfig.hasValues && (
                <Box>
                  <FormControl isInvalid={!!errors.option_values}>
                    <FormLabel color="gray.700" fontWeight="500">
                      Option Values * 
                      <Badge colorScheme="purple" variant="outline" ml={2}>
                        Enhanced with Pricing & Images
                      </Badge>
                    </FormLabel>
                    <VStack spacing={4} align="stretch">
                      <HStack>
                        <Button
                          leftIcon={<FiPlus />}
                          colorScheme="purple"
                          size="md"
                          onClick={() => openValueModal()}
                        >
                          Add Value
                        </Button>
                        <Text fontSize="sm" color="gray.600">
                          Add values with individual pricing and images
                        </Text>
                      </HStack>
                      
                      <FormErrorMessage>{errors.option_values}</FormErrorMessage>
                    </VStack>
                  </FormControl>

                  {/* Display added values */}
                  {currentOption.option_values.length > 0 && (
                    <Box mt={4}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={3}>
                        Added Values ({currentOption.option_values.length}):
                      </Text>
                      <VStack spacing={3} align="stretch">
                        {currentOption.option_values.map((value, index) => (
                          <Card key={index} size="sm" variant="outline">
                            <CardBody p={3}>
                              <Flex justify="space-between" align="start">
                                <HStack spacing={3} flex={1}>
                                  {/* Image preview */}
                                  {(value.image_preview || value.image_url) && (
                                    <Box>
                                      <Image
                                        src={value.image_preview || value.image_url}
                                        alt={value.image_alt_text || value.option_value}
                                        boxSize="40px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        border="1px"
                                        borderColor="gray.200"
                                      />
                                    </Box>
                                  )}
                                  
                                  <VStack align="start" spacing={1} flex={1}>
                                    <HStack>
                                      <Text fontWeight="bold" fontSize="sm">
                                        {value.option_value}
                                      </Text>
                                      {value.is_default && (
                                        <Badge colorScheme="purple" size="sm">Default</Badge>
                                      )}
                                      {!value.is_active && (
                                        <Badge colorScheme="gray" size="sm">Inactive</Badge>
                                      )}
                                    </HStack>
                                    
                                    {value.price_modifier > 0 && (
                                      <Text fontSize="xs" color="green.600" fontWeight="medium">
                                        +{value.price_modifier_type === 'percentage' 
                                          ? `${value.price_modifier}%` 
                                          : `$${value.price_modifier}`}
                                      </Text>
                                    )}
                                    
                                    {value.stock_quantity !== null && value.stock_quantity !== undefined && (
                                      <Text fontSize="xs" color="gray.500">
                                        Stock: {value.stock_quantity}
                                      </Text>
                                    )}
                                  </VStack>
                                </HStack>
                                
                                <HStack spacing={1}>
                                  <IconButton
                                    icon={<FiEye />}
                                    size="xs"
                                    colorScheme="blue"
                                    variant="ghost"
                                    onClick={() => setDefaultValue(index)}
                                    title="Set as default"
                                  />
                                  <IconButton
                                    icon={<FiEdit />}
                                    size="xs"
                                    colorScheme="purple"
                                    variant="ghost"
                                    onClick={() => openValueModal(index)}
                                    title="Edit value"
                                  />
                                  <IconButton
                                    icon={<FiTrash2 />}
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => removeOptionValue(index)}
                                    title="Remove value"
                                  />
                                </HStack>
                              </Flex>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </Box>
              )}

              {/* Settings */}
              <Box>
                <Text color="gray.700" fontWeight="500" mb={4}>Settings</Text>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="is_required" mb="0" mr={3} color="gray.700">
                      Required Option
                    </FormLabel>
                    <Switch
                      id="is_required"
                      colorScheme="red"
                      isChecked={currentOption.is_required}
                      onChange={(e) => handleInputChange('is_required', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="affects_price" mb="0" mr={3} color="gray.700">
                      Affects Price
                    </FormLabel>
                    <Switch
                      id="affects_price"
                      colorScheme="green"
                      isChecked={currentOption.affects_price}
                      onChange={(e) => handleInputChange('affects_price', e.target.checked)}
                    />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="is_active" mb="0" mr={3} color="gray.700">
                      Active
                    </FormLabel>
                    <Switch
                      id="is_active"
                      colorScheme="purple"
                      isChecked={currentOption.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    />
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Action Buttons */}
              <HStack justify="flex-end" pt={4} borderTop="1px" borderColor="gray.200">
                <Button variant="ghost" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  colorScheme="purple"
                  onClick={addOrUpdateOption}
                  leftIcon={editingIndex !== null ? <FiEdit /> : <FiPlus />}
                >
                  {editingIndex !== null ? 'Update Option' : 'Add Option'}
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Collapse>

      {/* Option Value Modal */}
      <Modal isOpen={isValueModalOpen} onClose={onValueModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FiDollarSign />
              <Text>{editingValueIndex !== null ? 'Edit Option Value' : 'Add Option Value'}</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Value Info */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Value *
                  </FormLabel>
                  <Input
                    value={currentValue.option_value}
                    onChange={(e) => handleValueInputChange('option_value', e.target.value)}
                    placeholder="e.g., M, L, XL"
                    bg="gray.50"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700" fontWeight="500">
                    Display Name
                  </FormLabel>
                  <Input
                    value={currentValue.display_name}
                    onChange={(e) => handleValueInputChange('display_name', e.target.value)}
                    placeholder="e.g., Medium, Large"
                    bg="gray.50"
                  />
                  <FormHelperText>Leave empty to use value</FormHelperText>
                </FormControl>
              </SimpleGrid>

              {/* Pricing */}
              <Box>
                <Text fontWeight="500" color="gray.700" mb={3}>
                  Individual Pricing (Optional)
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Price Modifier Type</FormLabel>
                    <Select
                      value={currentValue.price_modifier_type}
                      onChange={(e) => handleValueInputChange('price_modifier_type', e.target.value)}
                      bg="gray.50"
                      size="sm"
                    >
                      <option value="fixed">Fixed Amount ($)</option>
                      <option value="percentage">Percentage (%)</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Price Modifier</FormLabel>
                    <NumberInput
                      value={currentValue.price_modifier}
                      onChange={(value) => handleValueInputChange('price_modifier', parseFloat(value) || 0)}
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField bg="gray.50" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormHelperText>
                      For size "XL": +$5.00 means XL costs $5 more than base price
                    </FormHelperText>
                  </FormControl>
                </SimpleGrid>
              </Box>

              {/* Image Upload */}
              <Box>
                <Text fontWeight="500" color="gray.700" mb={3}>
                  Option Image (Optional)
                </Text>
                <VStack spacing={4} align="stretch">
                  {currentValue.image_preview ? (
                    <Box>
                      <Image
                        src={currentValue.image_preview}
                        alt={currentValue.image_alt_text}
                        maxH="200px"
                        maxW="200px"
                        objectFit="cover"
                        borderRadius="md"
                        border="1px"
                        borderColor="gray.200"
                      />
                      <HStack mt={2}>
                        <Button
                          size="sm"
                          leftIcon={<FiUpload />}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<FiX />}
                          variant="outline"
                          colorScheme="red"
                          onClick={removeImage}
                        >
                          Remove
                        </Button>
                      </HStack>
                    </Box>
                  ) : (
                    <Box
                      border="2px dashed"
                      borderColor="gray.300"
                      borderRadius="md"
                      p={6}
                      textAlign="center"
                      cursor="pointer"
                      _hover={{ borderColor: "purple.400" }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <VStack spacing={2}>
                        <FiImage size="2em" color="gray" />
                        <Text color="gray.600">Click to upload image</Text>
                        <Text fontSize="xs" color="gray.500">
                          PNG, JPG up to 5MB. Perfect for size charts or color swatches.
                        </Text>
                      </VStack>
                    </Box>
                  )}

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    display="none"
                  />

                  <FormControl>
                    <FormLabel fontSize="sm">Image Alt Text</FormLabel>
                    <Input
                      value={currentValue.image_alt_text}
                      onChange={(e) => handleValueInputChange('image_alt_text', e.target.value)}
                      placeholder="Describe the image for accessibility"
                      size="sm"
                      bg="gray.50"
                    />
                  </FormControl>
                </VStack>
              </Box>

              {/* Advanced Settings */}
              <Accordion allowToggle>
                <AccordionItem>
                  <AccordionButton>
                    <Box flex="1" textAlign="left" fontWeight="500">
                      Advanced Settings
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <VStack spacing={4} align="stretch">
                      <SimpleGrid columns={2} spacing={4}>
                        <FormControl>
                          <Checkbox
                            isChecked={currentValue.is_default}
                            onChange={(e) => handleValueInputChange('is_default', e.target.checked)}
                          >
                            Default Value
                          </Checkbox>
                        </FormControl>

                        <FormControl>
                          <Checkbox
                            isChecked={currentValue.is_active}
                            onChange={(e) => handleValueInputChange('is_active', e.target.checked)}
                          >
                            Active
                          </Checkbox>
                        </FormControl>
                      </SimpleGrid>

                      <SimpleGrid columns={2} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm">Stock Quantity</FormLabel>
                          <NumberInput
                            value={currentValue.stock_quantity || ''}
                            onChange={(value) => handleValueInputChange('stock_quantity', value ? parseInt(value) : null)}
                            min={0}
                            size="sm"
                          >
                            <NumberInputField bg="gray.50" placeholder="Unlimited" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>

                        <FormControl>
                          <FormLabel fontSize="sm">Sort Order</FormLabel>
                          <NumberInput
                            value={currentValue.sort_order}
                            onChange={(value) => handleValueInputChange('sort_order', parseInt(value) || 0)}
                            min={0}
                            size="sm"
                          >
                            <NumberInputField bg="gray.50" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                      </SimpleGrid>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onValueModalClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={saveOptionValue}>
              {editingValueIndex !== null ? 'Update Value' : 'Add Value'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Options List */}
      {customOptions.length > 0 ? (
        <VStack spacing={4} align="stretch">
          <Text fontSize="md" fontWeight="medium" color="gray.700">
            Added Options ({customOptions.length})
          </Text>
          
          {customOptions.map((option, index) => {
            const typeConfig = getOptionTypeConfig(option.option_type);
            
            return (
              <MotionBox
                key={option.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card variant="outline" _hover={{ shadow: "md" }}>
                  <CardBody>
                    <Flex justify="space-between" align="flex-start">
                      <VStack align="start" spacing={3} flex={1}>
                        <HStack spacing={3} wrap="wrap">
                          <Text fontWeight="bold" color="gray.900" fontSize="lg">
                            {option.option_name}
                          </Text>
                          <Badge colorScheme="purple" variant="solid" borderRadius="full">
                            <HStack spacing={1}>
                              <typeConfig.icon size="12px" />
                              <Text>{typeConfig.label}</Text>
                            </HStack>
                          </Badge>
                          {option.is_required && (
                            <Badge colorScheme="red" variant="solid" borderRadius="full">
                              Required
                            </Badge>
                          )}
                          {option.affects_price && (
                            <Badge colorScheme="green" variant="solid" borderRadius="full">
                              Affects Price
                            </Badge>
                          )}
                          {!option.is_active && (
                            <Badge colorScheme="gray" variant="solid" borderRadius="full">
                              Inactive
                            </Badge>
                          )}
                        </HStack>

                        {option.help_text && (
                          <Text color="gray.600" fontSize="sm">
                            {option.help_text}
                          </Text>
                        )}

                        {option.placeholder_text && (
                          <Text color="gray.500" fontSize="sm" fontStyle="italic">
                            Placeholder: "{option.placeholder_text}"
                          </Text>
                        )}

                        {/* Enhanced option values display */}
                        {option.option_values && option.option_values.length > 0 && (
                          <Box>
                            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                              Values ({option.option_values.length}):
                            </Text>
                            <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={2}>
                              {option.option_values.map((value, valueIndex) => (
                                <Box
                                  key={valueIndex}
                                  p={2}
                                  bg={value.is_default ? "purple.50" : "gray.50"}
                                  border="1px" 
                                  borderColor={value.is_default ? "purple.200" : "gray.200"}
                                  borderRadius="md"
                                  position="relative"
                                >
                                  <VStack spacing={1} align="stretch">
                                    {(value.image_preview || value.image_url) && (
                                      <Image
                                        src={value.image_preview || value.image_url}
                                        alt={value.image_alt_text || value.option_value}
                                        boxSize="30px"
                                        objectFit="cover"
                                        borderRadius="sm"
                                        mx="auto"
                                      />
                                    )}
                                    <Text fontSize="xs" fontWeight={value.is_default ? "bold" : "normal"} textAlign="center">
                                      {value.option_value}
                                    </Text>
                                    {value.price_modifier > 0 && (
                                      <Text fontSize="xs" color="green.600" textAlign="center">
                                        +{value.price_modifier_type === 'percentage' 
                                          ? `${value.price_modifier}%` 
                                          : `$${value.price_modifier}`}
                                      </Text>
                                    )}
                                  </VStack>
                                  {value.is_default && (
                                    <Badge
                                      position="absolute"
                                      top="-5px"
                                      right="-5px"
                                      size="xs"
                                      colorScheme="purple"
                                      borderRadius="full"
                                    >
                                      Default
                                    </Badge>
                                  )}
                                </Box>
                              ))}
                            </SimpleGrid>
                          </Box>
                        )}
                      </VStack>

                      <VStack spacing={2} ml={4}>
                        <IconButton
                          icon={<FiEdit />}
                          size="sm"
                          colorScheme="purple"
                          variant="ghost"
                          onClick={() => editOption(index)}
                          title="Edit option"
                        />
                        <IconButton
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => removeOption(index)}
                          title="Remove option"
                        />
                      </VStack>
                    </Flex>
                  </CardBody>
                </Card>
              </MotionBox>
            );
          })}
        </VStack>
      ) : (
        <Box
          p={8}
          textAlign="center"
          borderRadius="md"
          bg="gray.50"
          border="1px dashed"
          borderColor="gray.200"
        >
          <VStack spacing={3}>
            <FiSettings size="2em" color="gray.400" />
            <Text fontWeight="medium" color="gray.600">
              No Custom Options Added Yet
            </Text>
            <Text color="gray.500" fontSize="sm">
              Add custom options like Size (M, L, XL) with individual pricing and images
            </Text>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="purple"
              size="sm"
              onClick={toggleForm}
            >
              Add First Option
            </Button>
          </VStack>
        </Box>
      )}

      {/* Help Information */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertDescription fontSize="sm">
            <strong>Example:</strong> Create a "Size" option with values like M, L, XL, 2XL. 
            Each size can have different pricing (XL +$5, 2XL +$10) and images (size charts). 
            Perfect for clothing, furniture dimensions, or any product variations.
          </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
};

export default CustomOptionsForm;
