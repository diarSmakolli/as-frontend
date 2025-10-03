// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   VStack,
//   HStack,
//   FormControl,
//   FormLabel,
//   RadioGroup,
//   Radio,
//   Input,
//   Text,
//   Grid,
//   Card,
//   CardBody,
//   Icon,
//   Badge,
//   FormHelperText,
//   InputGroup,
//   InputRightAddon,
//   Divider,
//   Alert,
//   AlertIcon,
//   useColorModeValue,
//   Button,
//   Image,
//   useDisclosure,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalCloseButton,
//   ModalBody,
//   NumberInput,
//   NumberInputField,
//   NumberInputStepper,
//   NumberDecrementStepper,
//   NumberIncrementStepper,
//   Skeleton,
//   useToast,
//   SimpleGrid,
//   Container,
//   Heading,
//   Progress,
//   Flex,
//   IconButton,
//   List,
//   ListItem,
//   ListIcon,
//   useBoolean
// } from '@chakra-ui/react';
// import { 
//   FaRulerHorizontal, 
//   FaHome, 
//   FaShoppingCart, 
//   FaEye, 
//   FaArrowLeft, 
//   FaArrowRight,
//   FaCheck
// } from 'react-icons/fa';
// import { MdKitchen } from 'react-icons/md';
// import { debounce } from 'lodash';
// import { homeService } from '../home/services/homeService';

// const CuisineConfigurator = ({ 
//   product,
//   customOptions, 
//   selectedCustomOptions, 
//   onCustomOptionChange,
//   quantity,
//   onQuantityChange,
//   onAddToCart,
//   calculatePricingService
// }) => {
//   const [totalLength, setTotalLength] = useState('');
//   const [selectedLayout, setSelectedLayout] = useState('');
//   const [pricingData, setPricingData] = useState(null);
//   const [isCalculating, setIsCalculating] = useState(false);
//   const [calculationError, setCalculationError] = useState(null);
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [validationErrors, setValidationErrors] = useState({});
  
//   // Advanced layout configuration states
//   const [layoutDimensions, setLayoutDimensions] = useState({
//     // For L-shape
//     widthOfL: '',
//     sideOfL: 'left', // left or right
    
//     // For U-shape
//     dimensionA: '', // First arm of U
//     dimensionB: '', // Second arm of U
//   });
  
//   // Other custom options (excluding Implantation which is handled specially)
//   const [otherCustomOptions, setOtherCustomOptions] = useState({});

//   const toast = useToast();
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const borderColor = useColorModeValue('gray.200', 'gray.600');
//   const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();

//   const layoutOption = customOptions?.find(opt => opt.option_name === "Implantation");
//   const sideOfLOption = customOptions?.find(opt => opt.option_name === "Side of L");
//   const otherOptions = customOptions?.filter(opt => 
//     opt.option_name !== "Implantation" && opt.option_name !== "Side of L"
//   ) || [];
  
//   const productImages = product?.images || [];
//   const mainImageUrl = product?.main_image_url || (productImages.length > 0 ? productImages[0].image_url : null);

//   const layoutConfigs = {
//     'Linéaire': {
//       icon: '━━━━━━━━━━━━━━',
//       description: 'Configuration droite le long d un mur',
//       priceMultiplier: 1.0,
//       complexity: 'Simple'
//     },
//     'Forme L': {
//       icon: `━━━━━━━━
//          ┃
//          ┃
//          ┃`,
//       description: 'Configuration en L avec optimisation d angle',
//       priceMultiplier: 1.1,
//       complexity: 'Intermédiaire'
//     },
//     'Forme U': {
//       icon: `┃━━━━━━━━┃
// ┃        ┃
// ┃        ┃`,
//       description: 'Configuration en U sur trois côtés',
//       priceMultiplier: 1.2,
//       complexity: 'Complexe'
//     }
//   };

//   const debouncedCalculatePricing = useCallback(
//     debounce(async (dimensions, options, layoutType, layoutDims) => {
//       if (!dimensions.totalLength || dimensions.totalLength < 1) {
//         setPricingData(null);
//         return;
//       }

//       setIsCalculating(true);
//       setCalculationError(null);

//       try {
//         // Combine all selected options including other custom options
//         const allSelectedOptions = { ...options, ...otherCustomOptions };
        
//         const calculationData = {
//           quantity: quantity,
//           dimensions: {
//             length: parseFloat(dimensions.totalLength)
//           },
//           selectedOptions: Object.entries(allSelectedOptions).map(([optionId, valueData]) => ({
//             optionId: optionId,
//             valueId: valueData.valueId
//           })),
//           // Pass layout info separately (not as dimensions)
//           customData: {
//             layout: layoutType,
//             layoutMultiplier: layoutConfigs[layoutType]?.priceMultiplier || 1,
//             layoutDimensions: layoutDims // Include additional layout dimensions
//           }
//         };

//         const result = await homeService.calculateProductPricing(product.id, calculationData);
        
//         if (result.success === true && result.pricing) {
//           // Transform the API response to match expected format
//           const transformedData = {
//             base_price_nett: result.pricing.base_product?.gross || 0,
//             final_price_nett: result.pricing.final?.unit_price_gross || 0,
//             base_price_per_linear_meter: result.pricing.base_product?.calculation_details?.final_price_per_unit || 0,
//             calculation_details: result.pricing.base_product?.calculation_details,
//             custom_options: result.pricing.custom_options,
//             breakdown: result.pricing.breakdown
//           };
//           setPricingData(transformedData);
//         } else {
//           throw new Error(result.message || 'Erreur de calcul');
//         }
//       } catch (error) {
//         console.error('Pricing calculation error:', error);
//         setCalculationError(error.message || 'Erreur lors du calcul du prix');
//         setPricingData(null);
//       } finally {
//         setIsCalculating(false);
//       }
//     }, 500),
//     [product.id, quantity, calculatePricingService, otherCustomOptions]
//   );

//   useEffect(() => {
//     if (totalLength && selectedLayout) {
//       debouncedCalculatePricing(
//         { totalLength },
//         selectedCustomOptions,
//         selectedLayout,
//         layoutDimensions
//       );
//     }
//   }, [totalLength, selectedLayout, selectedCustomOptions, layoutDimensions, otherCustomOptions, debouncedCalculatePricing]);

//   const handleLayoutChange = (value) => {
//     setSelectedLayout(value);
    
//     // Reset layout dimensions when changing layout
//     setLayoutDimensions({
//       widthOfL: '',
//       sideOfL: 'left',
//       dimensionA: '',
//       dimensionB: '',
//     });
    
//     const selectedValue = layoutOption?.option_values.find(v => v.option_value === value);
//     if (selectedValue && layoutOption) {
//       onCustomOptionChange(
//         layoutOption.id,
//         selectedValue.id,
//         value,
//         parseFloat(selectedValue.price_modifier || 0),
//         selectedValue.price_modifier_type || 'fixed'
//       );
//     }
//   };

//   const handleLayoutDimensionChange = (key, value) => {
//     setLayoutDimensions(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const handleOtherCustomOptionChange = (optionId, valueId, value, priceModifier, priceModifierType) => {
//     setOtherCustomOptions(prev => ({
//       ...prev,
//       [optionId]: {
//         valueId: valueId,
//         value: value,
//         priceModifier: priceModifier,
//         priceModifierType: priceModifierType
//       }
//     }));
    
//     // Also call the parent handler to keep consistency
//     onCustomOptionChange(optionId, valueId, value, priceModifier, priceModifierType);
//   };

//   const validateLayoutDimensions = () => {
//     const errors = {};
    
//     if (selectedLayout === 'Forme L') {
//       if (!layoutDimensions.widthOfL || parseFloat(layoutDimensions.widthOfL) <= 0) {
//         errors.widthOfL = 'Veuillez saisir la largeur de L';
//       }
//     }
    
//     if (selectedLayout === 'Forme U') {
//       if (!layoutDimensions.dimensionA || parseFloat(layoutDimensions.dimensionA) <= 0) {
//         errors.dimensionA = 'Veuillez saisir la dimension A';
//       }
//       if (!layoutDimensions.dimensionB || parseFloat(layoutDimensions.dimensionB) <= 0) {
//         errors.dimensionB = 'Veuillez saisir la dimension B';
//       }
//     }
    
//     return errors;
//   };

//   const handleLengthChange = (value) => {
//     setTotalLength(value);
    
//     const numValue = parseFloat(value);
//     if (value && (isNaN(numValue) || numValue < 1 || numValue > 20)) {
//       setValidationErrors(prev => ({
//         ...prev,
//         length: 'La longueur doit être entre 1 et 20 mètres'
//       }));
//     } else {
//       setValidationErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors.length;
//         return newErrors;
//       });
//     }
//   };

//   const handleAddToCart = async () => {
//     if (!selectedLayout || !totalLength) {
//       toast({
//         title: "Configuration incomplète",
//         description: "Veuillez sélectionner une configuration et saisir la longueur totale",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     // Validate layout-specific dimensions
//     const layoutErrors = validateLayoutDimensions();
//     if (Object.keys(layoutErrors).length > 0) {
//       const errorMessage = Object.values(layoutErrors).join(', ');
//       toast({
//         title: "Configuration incomplète",
//         description: errorMessage,
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     if (!pricingData) {
//       toast({
//         title: "Prix non calculé",
//         description: "Veuillez attendre le calcul du prix",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }

//     setIsAddingToCart(true);
    
//     try {
//       const cuisineData = {
//         layout: selectedLayout,
//         totalLength: parseFloat(totalLength),
//         layoutDimensions: layoutDimensions, // Include additional layout dimensions
//         selectedOptions: { ...selectedCustomOptions, ...otherCustomOptions }, // Include all selected options
//         pricingBreakdown: pricingData,
//         configurationType: 'cuisine',
//         // Additional layout-specific data for cart display
//         layoutInfo: {
//           type: selectedLayout,
//           totalLength: parseFloat(totalLength),
//           ...(selectedLayout === 'Forme L' && {
//             widthOfL: parseFloat(layoutDimensions.widthOfL),
//             sideOfL: layoutDimensions.sideOfL
//           }),
//           ...(selectedLayout === 'Forme U' && {
//             dimensionA: parseFloat(layoutDimensions.dimensionA),
//             dimensionB: parseFloat(layoutDimensions.dimensionB)
//           })
//         }
//       };

//       if (onAddToCart) {
//         await onAddToCart(cuisineData);
//       }
      
//       toast({
//         title: "Ajouté au panier",
//         description: `${product?.title} configuré ajouté avec succès`,
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//     } catch (error) {
//       toast({
//         title: "Erreur",
//         description: "Impossible d'ajouter au panier",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   const handleImageNavigation = (direction) => {
//     if (direction === 'next') {
//       setSelectedImageIndex(prev => 
//         prev === productImages.length - 1 ? 0 : prev + 1
//       );
//     } else {
//       setSelectedImageIndex(prev => 
//         prev === 0 ? productImages.length - 1 : prev - 1
//       );
//     }
//   };

//   return (
//     <Container maxW="7xl" py={8}>
//       <VStack spacing={6} mb={8}>
//         <Box textAlign="center">
//           <Heading size="lg" mb={2}>
//             <Icon as={MdKitchen} color="blue.500" mr={3} />
//             Configurateur de Cuisine
//           </Heading>
//           <Text color="gray.600">
//             Personnalisez votre cuisine selon vos besoins exacts
//           </Text>
//         </Box>
//       </VStack>

//       <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8}>
//         <VStack spacing={6} align="stretch">
//           <Card overflow="hidden" shadow="xl">
//             <Box position="relative">
//               <Image
//                 src={productImages[selectedImageIndex]?.image_url || mainImageUrl || '/placeholder-image.jpg'}
//                 alt={productImages[selectedImageIndex]?.alt_text || product?.title}
//                 w="full"
//                 h={{ base: '300px', md: '400px', lg: '500px' }}
//                 objectFit="cover"
//                 cursor="pointer"
//                 onClick={onImageModalOpen}
//                 fallback={<Skeleton height={{ base: '300px', md: '400px', lg: '500px' }} />}
//               />
              
//               {productImages.length > 1 && (
//                 <>
//                   <IconButton
//                     position="absolute"
//                     left={4}
//                     top="50%"
//                     transform="translateY(-50%)"
//                     size="md"
//                     colorScheme="whiteAlpha"
//                     bg="whiteAlpha.900"
//                     icon={<FaArrowLeft />}
//                     onClick={() => handleImageNavigation('prev')}
//                   />
//                   <IconButton
//                     position="absolute"
//                     right={4}
//                     top="50%"
//                     transform="translateY(-50%)"
//                     size="md"
//                     colorScheme="whiteAlpha"
//                     bg="whiteAlpha.900"
//                     icon={<FaArrowRight />}
//                     onClick={() => handleImageNavigation('next')}
//                   />
//                 </>
//               )}

//               <Button
//                 position="absolute"
//                 top={4}
//                 right={4}
//                 size="sm"
//                 colorScheme="whiteAlpha"
//                 bg="whiteAlpha.900"
//                 leftIcon={<FaEye />}
//                 onClick={onImageModalOpen}
//               >
//                 Agrandir
//               </Button>

//               {productImages.length > 1 && (
//                 <Badge
//                   position="absolute"
//                   bottom={4}
//                   left={4}
//                   colorScheme="blackAlpha"
//                   bg="blackAlpha.700"
//                   color="white"
//                 >
//                   {selectedImageIndex + 1} / {productImages.length}
//                 </Badge>
//               )}
//             </Box>
//           </Card>

//           <Card shadow="lg">
//             <CardBody>
//               <VStack align="start" spacing={4}>
//                 <Box>
//                   <Heading size="md" mb={2}>
//                     {product?.title}
//                   </Heading>
//                   <Text color="gray.600" lineHeight="tall">
//                     {product?.short_description}
//                   </Text>
//                 </Box>

//                 <HStack wrap="wrap" spacing={2}>
//                   <Badge colorScheme="blue" fontSize="sm" px={3} py={1}>
//                     SKU: {product?.sku}
//                   </Badge>
//                   <Badge colorScheme="orange" fontSize="sm" px={3} py={1}>
//                     Prix au mètre linéaire
//                   </Badge>
//                 </HStack>

//                 <Box w="full">
//                   <Text fontWeight="semibold" mb={2}>Spécifications:</Text>
//                   <List spacing={1}>
//                     <ListItem fontSize="sm">
//                       <ListIcon as={FaCheck} color="green.500" />
//                       Installation professionnelle incluse
//                     </ListItem>
//                     <ListItem fontSize="sm">
//                       <ListIcon as={FaCheck} color="green.500" />
//                       Garantie 10 ans sur la structure
//                     </ListItem>
//                   </List>
//                 </Box>
//               </VStack>
//             </CardBody>
//           </Card>
//         </VStack>

//         <VStack spacing={6} align="stretch">
//           {layoutOption && (
//             <Card shadow="lg" bg={cardBg}>
//               <CardBody>
//                 <FormControl>
//                   <FormLabel>
//                     <HStack>
//                       <Icon as={FaHome} color="blue.500" />
//                       <Text fontWeight="semibold">Type d'implantation</Text>
//                       <Badge colorScheme="red" size="sm">Obligatoire</Badge>
//                     </HStack>
//                   </FormLabel>
//                   <RadioGroup value={selectedLayout} onChange={handleLayoutChange}>
//                     <Grid templateColumns="repeat(2, 1fr)" gap={4}>
//                       {layoutOption.option_values.map((value) => {
//                         const config = layoutConfigs[value.option_value];
//                         const isSelected = selectedLayout === value.option_value;
                        
//                         return (
//                           <Card 
//                             key={value.id} 
//                             variant="outline" 
//                             cursor="pointer"
//                             bg={isSelected ? 'blue.50' : cardBg}
//                             borderColor={isSelected ? 'blue.400' : borderColor}
//                             borderWidth="2px"
//                           >
//                             <CardBody p={4}>
//                               <Radio value={value.option_value} mb={3} colorScheme="blue">
//                                 <Text fontWeight="bold" fontSize="sm">
//                                   {value.display_name || value.option_value}
//                                 </Text>
//                               </Radio>

//                               <VStack align="start" spacing={3}>
//                                 <Box 
//                                   fontFamily="mono" 
//                                   fontSize="xs" 
//                                   color="gray.600" 
//                                   whiteSpace="pre-line"
//                                   bg="gray.50"
//                                   p={3}
//                                   borderRadius="md"
//                                   minH="70px"
//                                   w="full"
//                                   display="flex"
//                                   alignItems="center"
//                                   justifyContent="center"
//                                 >
//                                   {config?.icon}
//                                 </Box>

//                                 <Text fontSize="xs" color="gray.700" noOfLines={2}>
//                                   {config?.description}
//                                 </Text>
//                               </VStack>
//                             </CardBody>
//                           </Card>
//                         );
//                       })}
//                     </Grid>
//                   </RadioGroup>
//                 </FormControl>
//               </CardBody>
//             </Card>
//           )}

//           {/* Advanced Layout Configuration */}
//           {selectedLayout && (selectedLayout === 'Forme L' || selectedLayout === 'Forme U') && (
//             <Card shadow="lg" bg={cardBg} borderColor="orange.200" borderWidth="2px">
//               <CardBody>
//                 <VStack spacing={4} align="stretch">
//                   <Box>
//                     <Text fontWeight="bold" fontSize="lg" color="orange.600" mb={2}>
//                       Configuration {selectedLayout}
//                     </Text>
//                     <Text fontSize="sm" color="gray.600">
//                       {selectedLayout === 'Forme L' 
//                         ? 'Configurez les dimensions spécifiques pour votre cuisine en L'
//                         : 'Configurez les dimensions A et B pour votre cuisine en U'
//                       }
//                     </Text>
//                   </Box>

//                   {selectedLayout === 'Forme L' && (
//                     <>
//                       <FormControl isRequired isInvalid={validationErrors.widthOfL}>
//                         <FormLabel>
//                           <HStack>
//                             <Icon as={FaRulerHorizontal} color="orange.500" />
//                             <Text fontWeight="semibold">Largeur de L (mètres)</Text>
//                           </HStack>
//                         </FormLabel>
//                         <InputGroup size="lg">
//                           <Input
//                             type="number"
//                             step="0.1"
//                             min="0.5"
//                             max="10"
//                             placeholder="Ex: 2.5"
//                             value={layoutDimensions.widthOfL}
//                             onChange={(e) => handleLayoutDimensionChange('widthOfL', e.target.value)}
//                           />
//                           <InputRightAddon>m</InputRightAddon>
//                         </InputGroup>
//                         <FormHelperText>
//                           Largeur perpendiculaire de la forme en L
//                         </FormHelperText>
//                       </FormControl>

//                       {sideOfLOption && (
//                         <FormControl>
//                           <FormLabel>
//                             <HStack>
//                               <Icon as={FaHome} color="orange.500" />
//                               <Text fontWeight="semibold">Côté de L</Text>
//                             </HStack>
//                           </FormLabel>
//                           <RadioGroup 
//                             value={layoutDimensions.sideOfL} 
//                             onChange={(value) => {
//                               handleLayoutDimensionChange('sideOfL', value);
//                               // Update the custom option as well
//                               const selectedValue = sideOfLOption?.option_values.find(v => v.option_value.toLowerCase() === value);
//                               if (selectedValue) {
//                                 handleOtherCustomOptionChange(
//                                   sideOfLOption.id,
//                                   selectedValue.id,
//                                   selectedValue.option_value,
//                                   parseFloat(selectedValue.price_modifier || 0),
//                                   selectedValue.price_modifier_type || 'fixed'
//                                 );
//                               }
//                             }}
//                           >
//                             <HStack spacing={8}>
//                               <Radio value="left" colorScheme="orange">
//                                 <Text fontWeight="medium">Gauche</Text>
//                               </Radio>
//                               <Radio value="right" colorScheme="orange">
//                                 <Text fontWeight="medium">Droite</Text>
//                               </Radio>
//                             </HStack>
//                           </RadioGroup>
//                           <FormHelperText>
//                             Direction de l'extension en L
//                           </FormHelperText>
//                         </FormControl>
//                       )}
//                     </>
//                   )}

//                   {selectedLayout === 'Forme U' && (
//                     <>
//                       <Grid templateColumns="repeat(2, 1fr)" gap={4}>
//                         <FormControl isRequired isInvalid={validationErrors.dimensionA}>
//                           <FormLabel>
//                             <HStack>
//                               <Icon as={FaRulerHorizontal} color="orange.500" />
//                               <Text fontWeight="semibold">Dimension A</Text>
//                             </HStack>
//                           </FormLabel>
//                           <InputGroup size="lg">
//                             <Input
//                               type="number"
//                               step="0.1"
//                               min="0.5"
//                               max="10"
//                               placeholder="Ex: 2.0"
//                               value={layoutDimensions.dimensionA}
//                               onChange={(e) => handleLayoutDimensionChange('dimensionA', e.target.value)}
//                             />
//                             <InputRightAddon>m</InputRightAddon>
//                           </InputGroup>
//                           <FormHelperText>
//                             Premier bras du U
//                           </FormHelperText>
//                         </FormControl>

//                         <FormControl isRequired isInvalid={validationErrors.dimensionB}>
//                           <FormLabel>
//                             <HStack>
//                               <Icon as={FaRulerHorizontal} color="orange.500" />
//                               <Text fontWeight="semibold">Dimension B</Text>
//                             </HStack>
//                           </FormLabel>
//                           <InputGroup size="lg">
//                             <Input
//                               type="number"
//                               step="0.1"
//                               min="0.5"
//                               max="10"
//                               placeholder="Ex: 1.8"
//                               value={layoutDimensions.dimensionB}
//                               onChange={(e) => handleLayoutDimensionChange('dimensionB', e.target.value)}
//                             />
//                             <InputRightAddon>m</InputRightAddon>
//                           </InputGroup>
//                           <FormHelperText>
//                             Deuxième bras du U
//                           </FormHelperText>
//                         </FormControl>
//                       </Grid>

//                       <Alert status="info" borderRadius="md">
//                         <AlertIcon />
//                         <Box>
//                           <Text fontWeight="medium" fontSize="sm">
//                             Configuration en U
//                           </Text>
//                           <Text fontSize="xs" color="gray.600">
//                             La dimension A et B représentent les profondeurs des deux côtés du U
//                           </Text>
//                         </Box>
//                       </Alert>
//                     </>
//                   )}
//                 </VStack>
//               </CardBody>
//             </Card>
//           )}

//           {/* Other Custom Options */}
//           {selectedLayout && otherOptions.length > 0 && (
//             <Card shadow="lg" bg={cardBg}>
//               <CardBody>
//                 <VStack spacing={6} align="stretch">
//                   <Box>
//                     <Heading size="md" color="purple.600" mb={2}>
//                       Options de personnalisation
//                     </Heading>
//                     <Text fontSize="sm" color="gray.600">
//                       Configurez votre cuisine avec les options disponibles
//                     </Text>
//                   </Box>

//                   {otherOptions.map((option) => (
//                     <Box key={option.id}>
//                       <FormControl isRequired={option.is_required}>
//                         <FormLabel>
//                           <HStack>
//                             <Text fontWeight="semibold">{option.option_name}</Text>
//                             {option.is_required && (
//                               <Badge colorScheme="red" size="sm">Obligatoire</Badge>
//                             )}
//                             {option.affects_price && (
//                               <Badge colorScheme="green" size="sm">Affecte le prix</Badge>
//                             )}
//                           </HStack>
//                         </FormLabel>

//                         {option.help_text && (
//                           <Text fontSize="sm" color="gray.600" mb={3}>
//                             {option.help_text}
//                           </Text>
//                         )}

//                         {option.option_type === 'radio' && (
//                           <RadioGroup 
//                             value={otherCustomOptions[option.id]?.valueId || ''} 
//                             onChange={(valueId) => {
//                               const selectedValue = option.option_values?.find(v => v.id === valueId);
//                               if (selectedValue) {
//                                 handleOtherCustomOptionChange(
//                                   option.id,
//                                   selectedValue.id,
//                                   selectedValue.option_value,
//                                   parseFloat(selectedValue.price_modifier || 0),
//                                   selectedValue.price_modifier_type || 'fixed'
//                                 );
//                               }
//                             }}
//                           >
//                             <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
//                               {option.option_values?.map((value) => (
//                                 <Card 
//                                   key={value.id}
//                                   variant="outline"
//                                   cursor="pointer"
//                                   bg={otherCustomOptions[option.id]?.valueId === value.id ? 'purple.50' : cardBg}
//                                   borderColor={otherCustomOptions[option.id]?.valueId === value.id ? 'purple.400' : borderColor}
//                                   borderWidth="2px"
//                                   _hover={{ bg: 'purple.25' }}
//                                 >
//                                   <CardBody p={3}>
//                                     <Radio value={value.id} colorScheme="purple" mb={2}>
//                                       <Text fontWeight="medium" fontSize="sm">
//                                         {value.display_name || value.option_value}
//                                       </Text>
//                                     </Radio>

//                                     {value.image_url && (
//                                       <Image
//                                         src={value.image_url}
//                                         alt={value.image_alt_text || value.option_value}
//                                         w="full"
//                                         h="80px"
//                                         objectFit="cover"
//                                         borderRadius="md"
//                                         mb={2}
//                                       />
//                                     )}

//                                     {parseFloat(value.price_modifier) > 0 && (
//                                       <Badge colorScheme="green" size="sm">
//                                         {value.price_modifier_type === 'percentage' 
//                                           ? `+${value.price_modifier}%`
//                                           : `+${parseFloat(value.price_modifier).toFixed(2)}€`
//                                         }
//                                       </Badge>
//                                     )}
//                                   </CardBody>
//                                 </Card>
//                               ))}
//                             </Grid>
//                           </RadioGroup>
//                         )}

//                         {option.option_type === 'select' && (
//                           <Box>
//                             {/* Add select implementation if needed */}
//                             <Text fontSize="sm" color="gray.500">
//                               Select type options coming soon
//                             </Text>
//                           </Box>
//                         )}
//                       </FormControl>
                      
//                       {option !== otherOptions[otherOptions.length - 1] && (
//                         <Divider mt={4} borderColor="gray.200" />
//                       )}
//                     </Box>
//                   ))}
//                 </VStack>
//               </CardBody>
//             </Card>
//           )}

//           {selectedLayout && (
//             <Card shadow="lg" bg={cardBg}>
//               <CardBody>
//                 <FormControl isRequired isInvalid={validationErrors.length}>
//                   <FormLabel>
//                     <HStack>
//                       <Icon as={FaRulerHorizontal} color="green.500" />
//                       <Text fontWeight="semibold">Longueur totale</Text>
//                       <Badge colorScheme="red" size="sm">Obligatoire</Badge>
//                     </HStack>
//                   </FormLabel>
//                   <InputGroup size="lg">
//                     <Input
//                       type="number"
//                       step="0.1"
//                       min="1"
//                       max="20"
//                       placeholder="Ex: 3.5"
//                       value={totalLength}
//                       onChange={(e) => handleLengthChange(e.target.value)}
//                     />
//                     <InputRightAddon>mètres</InputRightAddon>
//                   </InputGroup>
//                   <FormHelperText>
//                     {validationErrors.length || 'Longueur totale en mètres linéaires (de 1 à 20m)'}
//                   </FormHelperText>

//                   {totalLength && !validationErrors.length && (
//                     <Box mt={4}>
//                       {isCalculating ? (
//                         <Alert status="info" borderRadius="md">
//                           <AlertIcon />
//                           <Text fontSize="sm" fontWeight="medium">Calcul en cours...</Text>
//                         </Alert>
//                       ) : pricingData ? (
//                         <Alert status="success" borderRadius="md">
//                           <AlertIcon />
//                           <VStack align="start" spacing={1}>
//                             <HStack>
//                               <Text fontSize="sm" fontWeight="bold">Prix de base calculé:</Text>
//                               <Badge colorScheme="green" fontSize="sm">
//                                 {pricingData.base_price_nett?.toFixed(2) || '0.00'}€
//                               </Badge>
//                             </HStack>
//                             <Text fontSize="xs" color="gray.600">
//                               {totalLength}m × {pricingData.base_price_per_linear_meter || '0'}€/m
//                             </Text>
//                           </VStack>
//                         </Alert>
//                       ) : calculationError && (
//                         <Alert status="error" borderRadius="md">
//                           <AlertIcon />
//                           <Text fontSize="sm">{calculationError}</Text>
//                         </Alert>
//                       )}
//                     </Box>
//                   )}
//                 </FormControl>
//               </CardBody>
//             </Card>
//           )}

//           {selectedLayout && totalLength && pricingData && (
//             <Card shadow="xl" bg="blue.50" borderColor="blue.300" borderWidth="2px">
//               <CardBody>
//                 <VStack spacing={6}>
//                   <Flex justify="space-between" align="center" w="full">
//                     <Text fontWeight="bold" fontSize="lg">Quantité:</Text>
//                     <NumberInput
//                       value={quantity}
//                       onChange={onQuantityChange}
//                       min={1}
//                       max={999}
//                       w="140px"
//                       size="lg"
//                     >
//                       <NumberInputField fontSize="lg" fontWeight="bold" textAlign="center" />
//                       <NumberInputStepper>
//                         <NumberIncrementStepper />
//                         <NumberDecrementStepper />
//                       </NumberInputStepper>
//                     </NumberInput>
//                   </Flex>

//                   <Divider borderColor="blue.300" />

//                   <VStack spacing={3} w="full">
//                     <Flex justify="space-between" w="full" py={2}>
//                       <VStack align="start" spacing={0}>
//                         <Text fontWeight="medium">Prix de base</Text>
//                         <Text fontSize="sm" color="gray.600">
//                           {totalLength}m × {pricingData.base_price_per_linear_meter?.toFixed(2) || '0.00'}€/m
//                         </Text>
//                       </VStack>
//                       <Text fontWeight="bold" fontSize="lg">
//                         {pricingData.base_price_nett?.toFixed(2) || '0.00'}€
//                       </Text>
//                     </Flex>

//                     <Divider borderColor="blue.400" />

//                     <Flex justify="space-between" w="full" py={3} bg="blue.100" px={4} borderRadius="lg">
//                       <VStack align="start" spacing={0}>
//                         <Text fontSize="xl" fontWeight="bold" color="blue.700">
//                           Prix total TTC:
//                         </Text>
//                         <Text fontSize="sm" color="gray.600">
//                           Installation incluse
//                         </Text>
//                       </VStack>
//                       <Text fontSize="2xl" fontWeight="bold" color="blue.700">
//                         {(pricingData.final_price_nett * quantity)?.toFixed(2) || '0.00'}€
//                       </Text>
//                     </Flex>
//                   </VStack>

//                   <Button
//                     leftIcon={<FaShoppingCart />}
//                     colorScheme="blue"
//                     size="lg"
//                     w="full"
//                     h="60px"
//                     fontSize="lg"
//                     onClick={handleAddToCart}
//                     isLoading={isAddingToCart}
//                     loadingText="Ajout en cours..."
//                     isDisabled={!selectedLayout || !totalLength || isCalculating || !pricingData}
//                   >
//                     Ajouter au panier - {(pricingData.final_price_nett * quantity)?.toFixed(2) || '0.00'}€
//                   </Button>

//                   {calculationError && (
//                     <Alert status="error" borderRadius="md">
//                       <AlertIcon />
//                       <Text fontSize="sm">{calculationError}</Text>
//                     </Alert>
//                   )}
//                 </VStack>
//               </CardBody>
//             </Card>
//           )}
//         </VStack>
//       </Grid>

//       <Modal isOpen={isImageModalOpen} onClose={onImageModalClose} size="6xl">
//         <ModalOverlay bg="blackAlpha.800" />
//         <ModalContent bg="transparent" shadow="none" maxW="90vw" maxH="90vh">
//           <ModalCloseButton color="white" size="lg" />
//           <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
//             <Image
//               src={productImages[selectedImageIndex]?.image_url || mainImageUrl}
//               alt={product?.title}
//               maxH="90vh"
//               maxW="90vw"
//               objectFit="contain"
//             />
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </Container>
//   );
// };

// export default CuisineConfigurator;