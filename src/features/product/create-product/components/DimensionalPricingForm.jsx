import React from "react";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Text,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";

const DimensionalPricingForm = ({
  formData,
  onDimensionalPricingChange,
  errors = {},
}) => {
  const handleInputChange = (name, value) => {
    onDimensionalPricingChange({
      [name]: value,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Enable Dimensional Pricing */}
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="is_dimensional_pricing" mb="0" mr={4}>
          Enable Dimensional Pricing
        </FormLabel>
        <Switch
          id="is_dimensional_pricing"
          isChecked={formData.is_dimensional_pricing}
          onChange={(e) =>
            handleInputChange("is_dimensional_pricing", e.target.checked)
          }
          colorScheme="orange"
        />
        {formData.is_dimensional_pricing && (
          <Badge colorScheme="orange" ml={3}>
            Enabled
          </Badge>
        )}
      </FormControl>

      {formData.is_dimensional_pricing && (
        <>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <AlertDescription fontSize="sm">
              Dimensional pricing allows customers to enter custom dimensions and automatically calculates the price based on area, volume, or length.
            </AlertDescription>
          </Alert>

          {/* Calculation Type */}
          <FormControl>
            <FormLabel>Calculation Type</FormLabel>
            <Select
              value={formData.dimensional_calculation_type || ""}
              onChange={(e) =>
                handleInputChange("dimensional_calculation_type", e.target.value)
              }
              placeholder="Select calculation method"
            >
              <option value="m2">Square Meter (m²) - Area calculation</option>
              <option value="m3">Cubic Meter (m³) - Volume calculation</option>
              <option value="linear-meter">Linear Meter - Length calculation</option>
              <option value="meter">Meter - Simple length calculation</option>
            </Select>
            <FormHelperText>
              Choose how the price will be calculated based on customer dimensions
            </FormHelperText>
          </FormControl>

          {formData.dimensional_calculation_type && (
            <>
              {/* Base Pricing */}
              <Box>
                <Text fontWeight="medium" mb={4}>
                  Base Pricing
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {formData.dimensional_calculation_type === "m2" && (
                    <FormControl>
                      <FormLabel>Base Price per m²</FormLabel>
                      <NumberInput
                        value={formData.base_price_per_m2}
                        onChange={(value) =>
                          handleInputChange("base_price_per_m2", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>Standard price per square meter</FormHelperText>
                    </FormControl>
                  )}

                  {formData.dimensional_calculation_type === "m3" && (
                    <FormControl>
                      <FormLabel>Base Price per m³</FormLabel>
                      <NumberInput
                        value={formData.base_price_per_m3}
                        onChange={(value) =>
                          handleInputChange("base_price_per_m3", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>Standard price per cubic meter</FormHelperText>
                    </FormControl>
                  )}

                  {formData.dimensional_calculation_type === "linear-meter" && (
                    <FormControl>
                      <FormLabel>Base Price per Linear Meter</FormLabel>
                      <NumberInput
                        value={formData.base_price_per_linear_meter}
                        onChange={(value) =>
                          handleInputChange("base_price_per_linear_meter", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>Standard price per linear meter</FormHelperText>
                    </FormControl>
                  )}

                  {formData.dimensional_calculation_type === "meter" && (
                    <FormControl>
                      <FormLabel>Base Price per Meter</FormLabel>
                      <NumberInput
                        value={formData.base_price_per_meter}
                        onChange={(value) =>
                          handleInputChange("base_price_per_meter", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormHelperText>Standard price per meter</FormHelperText>
                    </FormControl>
                  )}
                </SimpleGrid>
              </Box>

              {/* Dimension Constraints */}
              <Box>
                <Text fontWeight="medium" mb={4}>
                  Dimension Constraints
                </Text>
                <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Min Width</FormLabel>
                    <NumberInput
                      value={formData.min_width}
                      onChange={(value) =>
                        handleInputChange("min_width", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Max Width</FormLabel>
                    <NumberInput
                      value={formData.max_width}
                      onChange={(value) =>
                        handleInputChange("max_width", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Standard Width</FormLabel>
                    <NumberInput
                      value={formData.standard_width}
                      onChange={(value) =>
                        handleInputChange("standard_width", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Min Height</FormLabel>
                    <NumberInput
                      value={formData.min_height}
                      onChange={(value) =>
                        handleInputChange("min_height", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Max Height</FormLabel>
                    <NumberInput
                      value={formData.max_height}
                      onChange={(value) =>
                        handleInputChange("max_height", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm">Standard Height</FormLabel>
                    <NumberInput
                      value={formData.standard_height}
                      onChange={(value) =>
                        handleInputChange("standard_height", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  {(formData.dimensional_calculation_type === "m3") && (
                    <>
                      <FormControl>
                        <FormLabel fontSize="sm">Min Depth</FormLabel>
                        <NumberInput
                          value={formData.min_depth}
                          onChange={(value) =>
                            handleInputChange("min_depth", parseFloat(value) || 0)
                          }
                          min={0}
                          precision={2}
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Max Depth</FormLabel>
                        <NumberInput
                          value={formData.max_depth}
                          onChange={(value) =>
                            handleInputChange("max_depth", parseFloat(value) || 0)
                          }
                          min={0}
                          precision={2}
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="sm">Standard Depth</FormLabel>
                        <NumberInput
                          value={formData.standard_depth}
                          onChange={(value) =>
                            handleInputChange("standard_depth", parseFloat(value) || 0)
                          }
                          min={0}
                          precision={2}
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>
                    </>
                  )}
                </SimpleGrid>
              </Box>

              {/* Premium Pricing */}
              <Box>
                <Text fontWeight="medium" mb={4}>
                  Premium Pricing (Optional)
                </Text>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Set higher prices for dimensions that exceed certain thresholds
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {formData.dimensional_calculation_type === "m2" && (
                    <FormControl>
                      <FormLabel>Premium Price per m²</FormLabel>
                      <NumberInput
                        value={formData.premium_price_per_m2}
                        onChange={(value) =>
                          handleInputChange("premium_price_per_m2", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}

                  {formData.dimensional_calculation_type === "m3" && (
                    <FormControl>
                      <FormLabel>Premium Price per m³</FormLabel>
                      <NumberInput
                        value={formData.premium_price_per_m3}
                        onChange={(value) =>
                          handleInputChange("premium_price_per_m3", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}

                  {formData.dimensional_calculation_type === "linear-meter" && (
                    <FormControl>
                      <FormLabel>Premium Price per Linear Meter</FormLabel>
                      <NumberInput
                        value={formData.premium_price_per_linear_meter}
                        onChange={(value) =>
                          handleInputChange("premium_price_per_linear_meter", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}

                  {formData.dimensional_calculation_type === "meter" && (
                    <FormControl>
                      <FormLabel>Premium Price per Meter</FormLabel>
                      <NumberInput
                        value={formData.premium_price_per_meter}
                        onChange={(value) =>
                          handleInputChange("premium_price_per_meter", parseFloat(value) || 0)
                        }
                        min={0}
                        precision={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  )}
                </SimpleGrid>

                {/* Premium Thresholds */}
                <Text fontSize="sm" fontWeight="medium" mt={4} mb={3}>
                  Premium Pricing Thresholds
                </Text>
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="xs">Width From</FormLabel>
                    <NumberInput
                      value={formData.premium_width_from}
                      onChange={(value) =>
                        handleInputChange("premium_width_from", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs">Width To</FormLabel>
                    <NumberInput
                      value={formData.premium_width_to}
                      onChange={(value) =>
                        handleInputChange("premium_width_to", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs">Height From</FormLabel>
                    <NumberInput
                      value={formData.premium_height_from}
                      onChange={(value) =>
                        handleInputChange("premium_height_from", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="xs">Height To</FormLabel>
                    <NumberInput
                      value={formData.premium_height_to}
                      onChange={(value) =>
                        handleInputChange("premium_height_to", parseFloat(value) || 0)
                      }
                      min={0}
                      precision={2}
                      size="sm"
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  {formData.dimensional_calculation_type === "m3" && (
                    <>
                      <FormControl>
                        <FormLabel fontSize="xs">Depth From</FormLabel>
                        <NumberInput
                          value={formData.premium_depth_from}
                          onChange={(value) =>
                            handleInputChange("premium_depth_from", parseFloat(value) || 0)
                          }
                          min={0}
                          precision={2}
                          size="sm"
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontSize="xs">Depth To</FormLabel>
                        <NumberInput
                          value={formData.premium_depth_to}
                          onChange={(value) =>
                            handleInputChange("premium_depth_to", parseFloat(value) || 0)
                          }
                          min={0}
                          precision={2}
                          size="sm"
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>
                    </>
                  )}
                </SimpleGrid>
              </Box>
            </>
          )}
        </>
      )}
    </VStack>
  );
};

export default DimensionalPricingForm;