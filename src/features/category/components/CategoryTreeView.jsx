import * as chakra from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const fontName = "Inter";

export default function CategoryForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null, 
  categories = [],
  isLoading = false,
  mode = "create" // "create" or "edit"
}) {
  const toast = chakra.useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: "",
    meta_title: "",
    sort_order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData && mode === "edit") {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        parent_id: initialData.parent_id || "",
        meta_title: initialData.meta_title || "",
        sort_order: initialData.sort_order || 0,
      });
      // Fix image preview URL construction
      if (initialData.image_url) {
        const imageUrl = initialData.image_url.startsWith('http') 
          ? initialData.image_url 
          : `http://localhost:8086${initialData.image_url}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        description: "",
        parent_id: "", // Use empty string for select
        meta_title: "",
        sort_order: 0,
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [initialData, mode, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParentChange = (e) => {
    const value = e.target.value;    
    setFormData(prev => ({
      ...prev,
      parent_id: value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          description: "Please select a valid image file (JPEG, PNG, GIF, SVG, WebP)",
          status: "error",
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle,
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          description: "Image file size must be less than 10MB",
          status: "error",
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle,
        });
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        description: "Category name is required",
        status: "error",
        duration: 5000,
        variant: 'custom',
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    // Check if category name already exists (client-side check)
    const trimmedName = formData.name.trim();
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === trimmedName.toLowerCase() && 
      (mode === "create" || cat.id !== initialData?.id)
    );
    
    if (existingCategory) {
      toast({
        description: `Category name "${trimmedName}" already exists. Please choose a different name.`,
        status: "error",
        duration: 5000,
        variant: 'custom',
        containerStyle: customToastContainerStyle,
      });
      return;
    }

    // Clean the form data before submission
    const cleanedFormData = {
      name: trimmedName,
      description: formData.description?.trim() || null,
      meta_title: formData.meta_title?.trim() || null,
      sort_order: formData.sort_order || 0,
      parent_id: formData.parent_id || null // Convert empty string to null
    };

    onSubmit(cleanedFormData, imageFile);
  };

  // Prepare parent options with proper format for native select
  const parentOptions = categories
    .filter(cat => {
      if (mode === "edit" && initialData) {
        return cat.id !== initialData.id;
      }
      return true;
    })
    .sort((a, b) => {
      // Sort by level first, then by name
      if (a.level !== b.level) {
        return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
    });
  return (
    <chakra.Modal isOpen={isOpen} onClose={onClose} size="xl">
      <chakra.ModalOverlay />
      <chakra.ModalContent maxW="600px" mx={4}>
        <chakra.ModalHeader fontFamily={fontName}>
          {mode === "create" ? "Create New Category" : "Edit Category"}
        </chakra.ModalHeader>
        <chakra.ModalCloseButton />
        
        <chakra.ModalBody>
          <chakra.Box as="form" onSubmit={handleSubmit}>
            <chakra.VStack spacing={4} align="stretch">
              {/* Category Name */}
              <chakra.FormControl isRequired>
                <chakra.FormLabel fontFamily={fontName} fontSize="sm" fontWeight="500">
                  Category Name
                </chakra.FormLabel>
                <chakra.Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                  fontFamily={fontName}
                  size="sm"
                />
                <chakra.Text fontSize="xs" color="gray.500" mt={1}>
                  Category names must be unique across the system
                </chakra.Text>
              </chakra.FormControl>

              {/* Description */}
              <chakra.FormControl>
                <chakra.FormLabel fontFamily={fontName} fontSize="sm" fontWeight="500">
                  Description
                </chakra.FormLabel>
                <chakra.Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description"
                  fontFamily={fontName}
                  size="sm"
                  rows={3}
                />
              </chakra.FormControl>

              {/* Parent Category - Using native Chakra Select */}
              <chakra.FormControl>
                <chakra.FormLabel fontFamily={fontName} fontSize="sm" fontWeight="500">
                  Parent Category
                </chakra.FormLabel>
                
                {/* Debug info */}
                <chakra.Text fontSize="xs" color="gray.500" mb={1}>
                  Current value: {formData.parent_id || 'None selected'}
                </chakra.Text>
                
                <chakra.Select
                  value={formData.parent_id}
                  onChange={handleParentChange}
                  placeholder="Select parent category (optional)"
                  size="sm"
                  fontFamily={fontName}
                >
                  {parentOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {/* Add visual indentation based on level */}
                      {'  '.repeat(option.level)}{option.name} {option.level > 0 ? `(Level ${option.level})` : '(Root)'}
                    </option>
                  ))}
                </chakra.Select>
                
                <chakra.Text fontSize="xs" color="gray.500" mt={1}>
                  Leave empty to create a root level category
                </chakra.Text>
              </chakra.FormControl>

              {/* Meta Title */}
              <chakra.FormControl>
                <chakra.FormLabel fontFamily={fontName} fontSize="sm" fontWeight="500">
                  Meta Title
                </chakra.FormLabel>
                <chakra.Input
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  placeholder="SEO meta title"
                  fontFamily={fontName}
                  size="sm"
                />
              </chakra.FormControl>

              {/* Sort Order */}
              <chakra.FormControl>
                <chakra.FormLabel fontFamily={fontName} fontSize="sm" fontWeight="500">
                  Sort Order
                </chakra.FormLabel>
                <chakra.NumberInput 
                  value={formData.sort_order} 
                  onChange={(value) => setFormData(prev => ({ ...prev, sort_order: parseInt(value) || 0 }))}
                  min={0}
                  size="sm"
                >
                  <chakra.NumberInputField fontFamily={fontName} />
                  <chakra.NumberInputStepper>
                    <chakra.NumberIncrementStepper />
                    <chakra.NumberDecrementStepper />
                  </chakra.NumberInputStepper>
                </chakra.NumberInput>
              </chakra.FormControl>

              {/* Image Upload */}
              <chakra.FormControl>
                <chakra.FormLabel fontFamily={fontName} fontSize="sm" fontWeight="500">
                  Category Image
                </chakra.FormLabel>
                
                {imagePreview ? (
                  <chakra.Box position="relative" display="inline-block">
                    <chakra.Image
                      src={imagePreview}
                      alt="Category preview"
                      boxSize="150px"
                      objectFit="cover"
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                    />
                    <chakra.IconButton
                      icon={<FiX />}
                      size="sm"
                      colorScheme="red"
                      position="absolute"
                      top={1}
                      right={1}
                      onClick={removeImage}
                      aria-label="Remove image"
                    />
                  </chakra.Box>
                ) : (
                  <chakra.Button
                    leftIcon={<FiUpload />}
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    fontFamily={fontName}
                  >
                    Upload Image
                  </chakra.Button>
                )}
                
                <chakra.Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml,image/webp"
                  display="none"
                />
                
                <chakra.Text fontSize="xs" color="gray.500" mt={1}>
                  Supported formats: JPEG, PNG, GIF, SVG, WebP (Max 10MB)
                </chakra.Text>
              </chakra.FormControl>
            </chakra.VStack>
          </chakra.Box>
        </chakra.ModalBody>

        <chakra.ModalFooter>
          <chakra.Button 
            variant="ghost" 
            mr={3} 
            onClick={onClose}
            fontFamily={fontName}
            size="sm"
          >
            Cancel
          </chakra.Button>
          <chakra.Button
            bg="black"
            color="white"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText={mode === "create" ? "Creating..." : "Updating..."}
            fontFamily={fontName}
            size="sm"
            _hover={{ bg: "gray.800" }}
          >
            {mode === "create" ? "Create Category" : "Update Category"}
          </chakra.Button>
        </chakra.ModalFooter>
      </chakra.ModalContent>
    </chakra.Modal>
  );
}
