import * as chakra from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiEye,
  FiEyeOff,
  FiImage,
} from "react-icons/fi";
import SettingsModal from "../../administration/components/settings/SettingsModal";
import Loader from "../../../commons/Loader";
import MobileNav from "../../administration/layouts/MobileNav";
import SidebarContent from "../../administration/layouts/SidebarContent";
import { useAuth } from "../../administration/authContext/authContext";
import { categoryService } from "../service/categoryService";
import { handleApiError } from "../../../commons/handleApiError";
import CategoryForm from "../components/CategoryForm";
import CategoryTreeView from "../components/CategoryTreeView";
import { customToastContainerStyle } from "../../../commons/toastStyles";

const fontName = "Inter";
const primaryBg = "rgb(255,255,255)";
const secondaryBg = "rgb(241,241,241)";

export default function CategoryManagement() {
  const { account, isLoading: authLoading } = useAuth();
  const toast = chakra.useToast();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Category state
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [includeInactive, setIncludeInactive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Image upload state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageCategory, setImageCategory] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Category details state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  if (authLoading) return <Loader />;

  // Load categories
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await categoryService.getAllCategories(includeInactive);
      setCategories(response.data);
      
      // Flatten categories for form parent selection
      const flattenCategories = (cats, level = 0) => {
        let result = [];
        cats.forEach(cat => {
          result.push({ ...cat, level });
          if (cat.children && cat.children.length > 0) {
            result = result.concat(flattenCategories(cat.children, level + 1));
          }
        });
        return result;
      };
      
      setAllCategories(flattenCategories(response.data));
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [includeInactive]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesCategory =
      category.name.toLowerCase().includes(searchLower) ||
      (category.description &&
        category.description.toLowerCase().includes(searchLower));
    
    // Also check children
    const matchesChildren = (cat) => {
      if (!cat.children) return false;
      return cat.children.some(child => 
        child.name.toLowerCase().includes(searchLower) ||
        (child.description && child.description.toLowerCase().includes(searchLower)) ||
        matchesChildren(child)
      );
    };
    
    return matchesCategory || matchesChildren(category);
  });

  // Handle create category
  const handleCreateCategory = () => {
    setFormMode("create");
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setFormMode("edit");
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (formData, imageFile) => {
    try {
      setIsFormLoading(true);
      
      // Client-side validation
      const validation = categoryService.validateCategoryData(formData, formMode === "edit");
      if (!validation.isValid) {
        toast({
          title: "Validation Error",
          description: validation.errors.join(", "),
          status: "error",
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle,
        });
        return;
      }
      
      if (formMode === "create") {
        const response = await categoryService.createCategory(formData, imageFile);
        toast({
          description: response.message || "Category created successfully",
          status: "success",
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle
        });
      } else {
        const response = await categoryService.editCategory(selectedCategory.id, formData);
        toast({
          description: response.data.message || "Category updated successfully",
          status: "success",
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle
        });
      }
      
      setIsFormOpen(false);
      loadCategories();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsFormLoading(false);
    }
  };

  // Handle delete category
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete category
  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsDeleting(true);
      const response = await categoryService.deleteCategory(categoryToDelete.id);
      toast({
        description: response.data.message || "Category deleted successfully",
        status: "success",
        duration: 5000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      loadCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle view category details
  const handleViewDetails = async (category) => {
    try {
      setIsLoadingDetails(true);
      setIsDetailsModalOpen(true);
      setCategoryDetails(null);
      
      const response = await categoryService.getCategoryInfo(category.id);
      setCategoryDetails(response.data);
    } catch (error) {
      handleApiError(error);
      setIsDetailsModalOpen(false);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Handle change image
  const handleChangeImage = (category) => {
    setImageCategory(category);
    setIsImageModalOpen(true);
  };

  // Handle image upload
  const handleImageUpload = async (imageFile) => {
    try {
      setIsImageLoading(true);
      const response = await categoryService.changeCategoryImage(imageCategory.id, imageFile);
      toast({
        description: response.data.message || "Category image updated successfully",
        status: "success",
        duration: 5000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsImageModalOpen(false);
      loadCategories();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsImageLoading(false);
    }
  };

  // Handle remove image
  const handleRemoveImage = async () => {
    try {
      setIsImageLoading(true);
      const response = await categoryService.removeCategoryImage(imageCategory.id);
      toast({
        description: response.data.message || "Category image removed successfully",
        status: "success",
        duration: 5000,
        variant: "custom",
        containerStyle: customToastContainerStyle,
      });
      setIsImageModalOpen(false);
      loadCategories();
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <>
      <chakra.Box minH="100vh" bg={secondaryBg}>
        <SidebarContent onSettingsOpen={() => setIsSettingsOpen(true)} />
        <MobileNav onSettingsOpen={() => setIsSettingsOpen(true)} />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <chakra.Box ml={{ base: 0, md: 60 }} p="5">
          {/* Header Section */}
          <chakra.Flex
            flexDirection={{ base: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "center", md: "flex-start" }}
            mb={6}
          >
            <chakra.Box textAlign={{ base: "center", md: "left" }}>
              <chakra.Text
                color="gray.900"
                fontSize={{ base: "xl", md: "2xl" }}
                fontFamily={fontName}
                fontWeight="400"
                letterSpacing="wide"
                mb={1}
              >
                Category Console
              </chakra.Text>
              <chakra.Text
                color="gray.600"
                fontSize="sm"
                fontFamily={fontName}
              >
                Manage your product categories and hierarchy
              </chakra.Text>
            </chakra.Box>

            <chakra.Button
              leftIcon={<FiPlus />}
              bg="black"
              color="white"
              size="sm"
              mt={{ base: 4, md: 0 }}
              shadow="md"
              _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
              transition="all 0.2s"
              onClick={handleCreateCategory}
              fontFamily={fontName}
            >
              Create New Category
            </chakra.Button>
          </chakra.Flex>

          {/* Controls Section */}
          <chakra.Box bg={primaryBg} p={4} borderRadius="lg" shadow="sm" mb={6}>
            <chakra.Flex
              flexDirection={{ base: "column", md: "row" }}
              gap={4}
              align={{ base: "stretch", md: "center" }}
            >
              {/* Search */}
              <chakra.InputGroup flex={1} maxW={{ base: "full", md: "300px" }}>
                <chakra.InputLeftElement pointerEvents="none">
                  <FiSearch color="gray.400" />
                </chakra.InputLeftElement>
                <chakra.Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fontFamily={fontName}
                  size="sm"
                />
              </chakra.InputGroup>

              {/* Controls */}
              <chakra.HStack spacing={2}>
                <chakra.Button
                  leftIcon={includeInactive ? <FiEyeOff /> : <FiEye />}
                  variant="outline"
                  size="sm"
                  onClick={() => setIncludeInactive(!includeInactive)}
                  fontFamily={fontName}
                >
                  {includeInactive ? "Hide Inactive" : "Show Inactive"}
                </chakra.Button>
                
                <chakra.Button
                  leftIcon={<FiRefreshCw />}
                  variant="outline"
                  size="sm"
                  onClick={loadCategories}
                  isLoading={isLoading}
                  fontFamily={fontName}
                >
                  Refresh
                </chakra.Button>
              </chakra.HStack>
            </chakra.Flex>
          </chakra.Box>

          {/* Category Tree */}
          <chakra.Box>
            {isLoading ? (
              <chakra.Flex justify="center" p={8}>
                <chakra.Spinner size="lg" color="blue.500" />
              </chakra.Flex>
            ) : (
              <CategoryTreeView
                categories={filteredCategories}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
                onViewDetails={handleViewDetails}
                onChangeImage={handleChangeImage}
              />
            )}
          </chakra.Box>
        </chakra.Box>

        {/* Category Form Modal */}
        <CategoryForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={selectedCategory}
          categories={allCategories}
          isLoading={isFormLoading}
          mode={formMode}
        />

        {/* Image Upload Modal */}
        <ImageUploadModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          category={imageCategory}
          onUpload={handleImageUpload}
          onRemove={handleRemoveImage}
          isLoading={isImageLoading}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
          }}
          category={categoryToDelete}
          onConfirm={confirmDeleteCategory}
          isLoading={isDeleting}
        />

        {/* Category Details Modal */}
        <CategoryDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setCategoryDetails(null);
          }}
          categoryDetails={categoryDetails}
          isLoading={isLoadingDetails}
        />
      </chakra.Box>
    </>
  );
}

// Image Upload Modal Component
function ImageUploadModal({ isOpen, onClose, category, onUpload, onRemove, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <chakra.Modal isOpen={isOpen} onClose={onClose}>
      <chakra.ModalOverlay />
      <chakra.ModalContent>
        <chakra.ModalHeader fontFamily={fontName}>
          Change Category Image - {category?.name}
        </chakra.ModalHeader>
        <chakra.ModalCloseButton />
        
        <chakra.ModalBody>
          <chakra.VStack spacing={4}>
            {/* Current Image */}
            {category?.image_url && (
              <chakra.Box>
                <chakra.Text fontSize="sm" fontWeight="500" mb={2} fontFamily={fontName}>
                  Current Image:
                </chakra.Text>
                <chakra.Image
                  src={category.image_url}
                  alt={category.name}
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                />
              </chakra.Box>
            )}

            {/* File Input */}
            <chakra.Box w="full">
              <chakra.Text fontSize="sm" fontWeight="500" mb={2} fontFamily={fontName}>
                Select New Image:
              </chakra.Text>
              <chakra.Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                size="sm"
              />
            </chakra.Box>

            {/* Preview */}
            {previewUrl && (
              <chakra.Box>
                <chakra.Text fontSize="sm" fontWeight="500" mb={2} fontFamily={fontName}>
                  Preview:
                </chakra.Text>
                <chakra.Image
                  src={previewUrl}
                  alt="Preview"
                  boxSize="150px"
                  objectFit="cover"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                />
              </chakra.Box>
            )}
          </chakra.VStack>
        </chakra.ModalBody>

        <chakra.ModalFooter>
          <chakra.HStack spacing={2}>
            {category?.image_url && (
              <chakra.Button
                colorScheme="red"
                variant="outline"
                size="sm"
                onClick={onRemove}
                isLoading={isLoading}
                fontFamily={fontName}
              >
                Remove Image
              </chakra.Button>
            )}
            <chakra.Button
              variant="ghost"
              onClick={onClose}
              size="sm"
              fontFamily={fontName}
            >
              Cancel
            </chakra.Button>
            <chakra.Button
              bg="black"
              color="white"
              onClick={handleUpload}
              isDisabled={!selectedFile}
              isLoading={isLoading}
              size="sm"
              fontFamily={fontName}
            >
              Upload Image
            </chakra.Button>
          </chakra.HStack>
        </chakra.ModalFooter>
      </chakra.ModalContent>
    </chakra.Modal>
  );
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({ isOpen, onClose, category, onConfirm, isLoading }) {
  return (
    <chakra.Modal isOpen={isOpen} onClose={onClose} isCentered>
      <chakra.ModalOverlay />
      <chakra.ModalContent maxW="400px" mx={4}>
        <chakra.ModalHeader fontFamily={fontName} pb={2}>
          Confirm Delete
        </chakra.ModalHeader>
        <chakra.ModalCloseButton />
        
        <chakra.ModalBody>
          <chakra.VStack spacing={4} align="stretch">
            <chakra.Box textAlign="center">
              <chakra.Icon
                as={chakra.Box}
                fontSize="4xl"
                color="red.500"
                mb={2}
              >
                ⚠️
              </chakra.Icon>
              <chakra.Text fontFamily={fontName} fontSize="lg" fontWeight="600" mb={2}>
                Delete Category
              </chakra.Text>
              <chakra.Text fontFamily={fontName} fontSize="sm" color="gray.600">
                Are you sure you want to delete the category
              </chakra.Text>
              <chakra.Text fontFamily={fontName} fontSize="sm" fontWeight="600" color="red.600">
                "{category?.name}"
              </chakra.Text>
              <chakra.Text fontFamily={fontName} fontSize="sm" color="gray.600" mt={2}>
                This action cannot be undone.
              </chakra.Text>
            </chakra.Box>

            {category?.children && category.children.length > 0 && (
              <chakra.Alert status="warning" borderRadius="md">
                <chakra.AlertIcon />
                <chakra.AlertDescription fontSize="sm" fontFamily={fontName}>
                  This category has {category.children.length} child categor{category.children.length === 1 ? 'y' : 'ies'}. 
                  You must delete or move them first.
                </chakra.AlertDescription>
              </chakra.Alert>
            )}
          </chakra.VStack>
        </chakra.ModalBody>

        <chakra.ModalFooter>
          <chakra.Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            fontFamily={fontName}
            size="sm"
            isDisabled={isLoading}
          >
            Cancel
          </chakra.Button>
          <chakra.Button
            colorScheme="red"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Deleting..."
            fontFamily={fontName}
            size="sm"
            isDisabled={category?.children && category.children.length > 0}
          >
            Delete Category
          </chakra.Button>
        </chakra.ModalFooter>
      </chakra.ModalContent>
    </chakra.Modal>
  );
}

// Category Details Modal Component
function CategoryDetailsModal({ isOpen, onClose, categoryDetails, isLoading }) {
  if (!categoryDetails && !isLoading) return null;

  return (
    <chakra.Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <chakra.ModalOverlay />
      <chakra.ModalContent maxW="800px" mx={4}>
        <chakra.ModalHeader fontFamily={fontName}>
          Category Details
          {categoryDetails?.category && (
            <chakra.Text fontSize="sm" color="gray.600" fontWeight="normal">
              {categoryDetails.category.name}
            </chakra.Text>
          )}
        </chakra.ModalHeader>
        <chakra.ModalCloseButton />
        
        <chakra.ModalBody maxH="600px" overflowY="auto">
          {isLoading ? (
            <chakra.Flex justify="center" align="center" minH="200px">
              <chakra.VStack spacing={3}>
                <chakra.Spinner size="lg" color="blue.500" />
                <chakra.Text fontSize="sm" color="gray.600" fontFamily={fontName}>
                  Loading category details...
                </chakra.Text>
              </chakra.VStack>
            </chakra.Flex>
          ) : categoryDetails ? (
            <chakra.VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <chakra.Box>
                <chakra.Text fontSize="lg" fontWeight="600" mb={3} fontFamily={fontName}>
                  Basic Information
                </chakra.Text>
                <chakra.SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <chakra.Box>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Name
                    </chakra.Text>
                    <chakra.Text fontSize="sm" fontFamily={fontName}>
                      {categoryDetails.category.name}
                    </chakra.Text>
                  </chakra.Box>
                  <chakra.Box>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Level
                    </chakra.Text>
                    <chakra.Badge colorScheme="blue" fontSize="xs">
                      Level {categoryDetails.category.level}
                    </chakra.Badge>
                  </chakra.Box>
                  <chakra.Box>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Status
                    </chakra.Text>
                    <chakra.Badge 
                      colorScheme={categoryDetails.category.is_active ? "green" : "red"} 
                      fontSize="xs"
                    >
                      {categoryDetails.category.is_active ? "Active" : "Inactive"}
                    </chakra.Badge>
                  </chakra.Box>
                  <chakra.Box>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Sort Order
                    </chakra.Text>
                    <chakra.Text fontSize="sm" fontFamily={fontName}>
                      {categoryDetails.category.sort_order || 0}
                    </chakra.Text>
                  </chakra.Box>
                </chakra.SimpleGrid>
                
                {categoryDetails.category.description && (
                  <chakra.Box mt={4}>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Description
                    </chakra.Text>
                    <chakra.Text fontSize="sm" fontFamily={fontName}>
                      {categoryDetails.category.description}
                    </chakra.Text>
                  </chakra.Box>
                )}

                {categoryDetails.category.meta_title && (
                  <chakra.Box mt={4}>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Meta Title
                    </chakra.Text>
                    <chakra.Text fontSize="sm" fontFamily={fontName}>
                      {categoryDetails.category.meta_title}
                    </chakra.Text>
                  </chakra.Box>
                )}
              </chakra.Box>

              {/* Image */}
              {categoryDetails.category.image_url && (
                <chakra.Box>
                  <chakra.Text fontSize="lg" fontWeight="600" mb={3} fontFamily={fontName}>
                    Category Image
                  </chakra.Text>
                  <chakra.Image
                    src={`${categoryDetails.category.image_url}`}
                    alt={categoryDetails.category.name}
                    maxW="200px"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                  />
                </chakra.Box>
              )}

              {/* Breadcrumb */}
              {categoryDetails.breadcrumb && categoryDetails.breadcrumb.length > 0 && (
                <chakra.Box>
                  <chakra.Text fontSize="lg" fontWeight="600" mb={3} fontFamily={fontName}>
                    Category Path
                  </chakra.Text>
                  <chakra.Breadcrumb spacing={2} fontSize="sm" fontFamily={fontName}>
                    {categoryDetails.breadcrumb.map((item, index) => (
                      <chakra.BreadcrumbItem key={item.id} isCurrentPage={index === categoryDetails.breadcrumb.length - 1}>
                        <chakra.BreadcrumbLink
                          color={index === categoryDetails.breadcrumb.length - 1 ? "blue.600" : "gray.600"}
                          fontWeight={index === categoryDetails.breadcrumb.length - 1 ? "600" : "normal"}
                        >
                          {item.name}
                        </chakra.BreadcrumbLink>
                      </chakra.BreadcrumbItem>
                    ))}
                  </chakra.Breadcrumb>
                </chakra.Box>
              )}

              {/* Direct Children */}
              {categoryDetails.children && categoryDetails.children.length > 0 && (
                <chakra.Box>
                  <chakra.Text fontSize="lg" fontWeight="600" mb={3} fontFamily={fontName}>
                    Direct Children ({categoryDetails.children.length})
                  </chakra.Text>
                  <chakra.VStack spacing={2} align="stretch">
                    {categoryDetails.children.map((child) => (
                      <chakra.Box
                        key={child.id}
                        p={3}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        bg="gray.50"
                      >
                        <chakra.Flex justify="space-between" align="center">
                          <chakra.Box>
                            <chakra.Text fontSize="sm" fontWeight="500" fontFamily={fontName}>
                              {child.name}
                            </chakra.Text>
                            {child.description && (
                              <chakra.Text fontSize="xs" color="gray.600" fontFamily={fontName}>
                                {child.description}
                              </chakra.Text>
                            )}
                          </chakra.Box>
                          <chakra.Badge colorScheme="green" fontSize="xs">
                            Level {child.level}
                          </chakra.Badge>
                        </chakra.Flex>
                      </chakra.Box>
                    ))}
                  </chakra.VStack>
                </chakra.Box>
              )}

              {/* All Descendants Count */}
              {categoryDetails.descendants && categoryDetails.descendants.length > 0 && (
                <chakra.Box>
                  <chakra.Text fontSize="lg" fontWeight="600" mb={3} fontFamily={fontName}>
                    Total Descendants
                  </chakra.Text>
                  <chakra.Text fontSize="sm" fontFamily={fontName}>
                    This category has {categoryDetails.descendants.length} descendant categor{categoryDetails.descendants.length === 1 ? 'y' : 'ies'} in total.
                  </chakra.Text>
                </chakra.Box>
              )}

              {/* Timestamps */}
              <chakra.Box>
                <chakra.Text fontSize="lg" fontWeight="600" mb={3} fontFamily={fontName}>
                  Timestamps
                </chakra.Text>
                <chakra.SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <chakra.Box>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Created At
                    </chakra.Text>
                    <chakra.Text fontSize="sm" fontFamily={fontName}>
                      {categoryDetails.category.created_at 
                        ? new Date(categoryDetails.category.created_at).toLocaleString()
                        : 'N/A'
                      }
                    </chakra.Text>
                  </chakra.Box>
                  <chakra.Box>
                    <chakra.Text fontSize="sm" fontWeight="500" color="gray.600" fontFamily={fontName}>
                      Updated At
                    </chakra.Text>
                    <chakra.Text fontSize="sm" fontFamily={fontName}>
                      {categoryDetails.category.updated_at 
                        ? new Date(categoryDetails.category.updated_at).toLocaleString()
                        : 'N/A'
                      }
                    </chakra.Text>
                  </chakra.Box>
                </chakra.SimpleGrid>
              </chakra.Box>
            </chakra.VStack>
          ) : (
            <chakra.Box textAlign="center" py={8}>
              <chakra.Text fontSize="sm" color="gray.600" fontFamily={fontName}>
                No details available
              </chakra.Text>
            </chakra.Box>
          )}
        </chakra.ModalBody>

        <chakra.ModalFooter>
          <chakra.Button
            variant="ghost"
            onClick={onClose}
            fontFamily={fontName}
            size="sm"
          >
            Close
          </chakra.Button>
        </chakra.ModalFooter>
      </chakra.ModalContent>
    </chakra.Modal>
  );
}
