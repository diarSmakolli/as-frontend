import * as chakra from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit,
  FiEye,
  FiCheckCircle,
  FiXCircle,
  FiSearch,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import SettingsModal from "../../administration/components/settings/SettingsModal";
import Loader from "../../../commons/Loader";
import MobileNav from "../../administration/layouts/MobileNav";
import SidebarContent from "../../administration/layouts/SidebarContent";
import { useAuth } from "../../administration/authContext/authContext";
import { companiesService } from "../services/companiesService";
import CompanyCreateModal from "./CompanyCreateModal";
import CompanyUpdateModal from "./CompanyUpdateModal";
import CompanyStatusModal from "./CompanyStatusModal";
import { handleApiError } from "../../../commons/handleApiError";
import CommonSelect from "../../../commons/components/CommonSelect";

const fontName = "Inter";
const primaryBg = "rgb(255,255,255)";
const secondaryBg = "rgb(241,241,241)";
const tertiaryBg = "rgb(50,50,50)";
const highlightBg = "rgb(60,60,60)";

export default function CompaniesList() {
  const { account, isLoading } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [statusAction, setStatusAction] = useState(null);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    is_inactive: "",
    is_verified: "",
    country: "",
    type_of_business: "",
  });

  const isAuthContextLoading = isLoading || false;

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, filters]);

  const fetchCompanies = async (refresh = false) => {
    try {
      setIsTableLoading(true);

      // If refreshing, reset to page 1
      const pageToFetch = refresh ? 1 : currentPage;
      if (refresh) {
        setCurrentPage(1);
      }

      const params = {
        page: pageToFetch,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "DESC",
        search: searchQuery,
        ...filters,
      };

      const response = await companiesService.getCompaniesList(params);

      setCompanies(response.data.data.companies);
      setTotalCompanies(response.data.data.total_items);
      setTotalPages(response.data.data.total_pages);
    } catch (error) {
      handleApiError(error, toast);
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCompanies(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenUpdateModal = (company) => {
    setSelectedCompany(company);
    setIsUpdateModalOpen(true);
  };

  const handleOpenStatusModal = (company, action) => {
    setSelectedCompany(company);
    setStatusAction(action);
    setIsStatusModalOpen(true);
  };

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  if (isAuthContextLoading) {
    return <Loader />;
  }

  const statusFilterOptions = [
    { value: "false", label: "Active" },
    { value: "true", label: "Inactive" },
  ];
  
  const verificationFilterOptions = [
    { value: "true", label: "Verified" },
    { value: "false", label: "Not Verified" },
  ];
  
  const businessTypeFilterOptions = [
    { value: "Retailer", label: "Retailer" },
    { value: "Manufacturer", label: "Manufacturer" },
    { value: "Distributor", label: "Distributor" },
    { value: "Service Provider", label: "Service Provider" },
  ];

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
                Company Console
              </chakra.Text>
            </chakra.Box>

            <chakra.Button
              leftIcon={<FiPlus />}
              bg='black'
              color='white'
              size="sm"
              onClick={handleOpenCreateModal}
              mt={{ base: 4, md: 0 }}
              shadow="md"
              _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
              transition="all 0.2s"
            >
              Create New Company
            </chakra.Button>
          </chakra.Flex>

          {/* Search Bar and Filter Toggle */}
          <chakra.Flex
            mb={4}
            flexDirection={{ base: "column", md: "row" }}
            gap={2}
            p={0}
            borderRadius="lg"
          >
            <chakra.InputGroup size="sm" flex="1">
              <chakra.Input
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                bg={`rgb(255,255,255)`}
                color="black"
                borderColor={'gray.400'}
                size='md'
                width='400px'
                maxW='600px'
                rounded='xl'
                _focus={{ boxShadow: "0 0 0 1px #63B3ED" }}
                _hover={{ bg: "rgb(255,255,255)" }}
              />
            </chakra.InputGroup>

            <chakra.ButtonGroup>
              <chakra.Button
                onClick={handleSearch}
                size="sm"
                shadow="sm"
                bg='black'
                color='white'
                _hover={{ bg: "gray.800" }}
                leftIcon={<FiSearch />}
              >
                Search
              </chakra.Button>

              <chakra.Button
                leftIcon={<FiFilter />}
                colorScheme={isFiltersVisible ? "blue" : "gray"}
                onClick={toggleFilters}
                size="sm"
                shadow="sm"
                bg='black'
                color='white'
                _hover={{ bg: "gray.800" }}
              >
                Filters{" "}
                {filters.is_inactive ||
                filters.is_verified ||
                filters.country ||
                filters.type_of_business
                  ? "(Active)"
                  : ""}
              </chakra.Button>

              <chakra.Button
                leftIcon={<FiRefreshCw />}
                onClick={() => {
                  setSearchQuery("");
                  setFilters({
                    is_inactive: "",
                    is_verified: "",
                    country: "",
                    type_of_business: "",
                  });
                  setTimeout(() => fetchCompanies(true), 0);
                }}
                size="sm"
                bg='black'
                _hover={{ bg: "gray.800" }}
                color="white"
              >
                Reset
              </chakra.Button>
            </chakra.ButtonGroup>
          </chakra.Flex>

          {/* Filters Section */}
          <chakra.Box
            bg={'rgb(255,255,255)'}
            borderRadius="lg"
            p={4}
            mb={6}
            shadow="md"
            display={isFiltersVisible ? "block" : "none"}
            transition="all 0.3s"
          >
            <chakra.Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={4}
            >
              <chakra.FormControl>
                <chakra.FormLabel
                  fontSize="sm"
                  color="gray.900"
                  fontWeight="medium"
                >
                  Status
                </chakra.FormLabel>
                <CommonSelect
                   name="is_inactive"
                   value={filters.is_inactive}
                   onChange={handleFilterChange}
                   options={statusFilterOptions}
                   placeholder="All Companies"
                   size="md"
                   color='gray.900'
                />
              </chakra.FormControl>

              <chakra.FormControl>
                <chakra.FormLabel
                  fontSize="sm"
                  color="gray.900"
                  fontWeight="medium"
                >
                  Verification
                </chakra.FormLabel>
                <CommonSelect
                  name="is_verified"
                  value={filters.is_verified}
                  onChange={handleFilterChange}
                  options={verificationFilterOptions}
                  placeholder="All Verification Status"
                  size="md"
                  color='gray.900'
                />
              </chakra.FormControl>

              <chakra.FormControl>
                <chakra.FormLabel
                  fontSize="sm"
                  color="gray.900"
                  fontWeight="medium"
                >
                  Business Type
                </chakra.FormLabel>
                <CommonSelect
                  name="type_of_business"
                  value={filters.type_of_business}
                  onChange={handleFilterChange}
                  options={businessTypeFilterOptions}
                  placeholder="All Types"
                  size="md"
                  isSearchable={true}
                  color='gray.900'
                />
              </chakra.FormControl>

              <chakra.FormControl>
                <chakra.FormLabel
                  fontSize="sm"
                  color="gray.900"
                  fontWeight="medium"
                >
                  Country
                </chakra.FormLabel>
                <chakra.Input
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  placeholder="Country"
                  bg={`rgb(241,241,241)`}
                  color="black"
                  _focus={{ boxShadow: "0 0 0 1px #63B3ED" }}
                  _hover={{ bg: "rgb(241,241,241)" }}
                  size="md"
                  borderColor={'gray.400'}
                />
              </chakra.FormControl>
            </chakra.Grid>
          </chakra.Box>

          {/* Companies Table */}
          <chakra.Box
            borderRadius="lg"
            overflow="hidden"
            shadow="lg"
            bg={'rgb(255,255,255)'}
            mb={6}
          >
            <chakra.Box overflowX="auto">
              <chakra.Table variant="simple" size="md" colorScheme="whiteAlpha" rounded='2xl'>
                <chakra.Thead bg={'rgb(255,255,255)'}>
                  <chakra.Tr>
                    <chakra.Th color="gray.900" borderColor={'gray.200'} textTransform={'none'}>
                      Business Name
                    </chakra.Th>
                    <chakra.Th color="gray.900" borderColor={'gray.200'} textTransform={'none'}>
                      Market Name
                    </chakra.Th>
                    <chakra.Th color="gray.900" borderColor={'gray.200'} textTransform={'none'}>
                      Business Type
                    </chakra.Th>
                    <chakra.Th color="gray.900" borderColor={'gray.200'} textTransform={'none'}>
                      Country
                    </chakra.Th>
                    <chakra.Th color="gray.900" borderColor={'gray.200'} textTransform={'none'}>
                      Status
                    </chakra.Th>
                    <chakra.Th color="gray.900" borderColor={'gray.200'} textTransform={'none'}>
                      Verified
                    </chakra.Th>
                    <chakra.Th
                      color="gray.900" borderColor={'gray.200'}
                      textTransform={'none'}
                      isNumeric
                    >
                      Actions
                    </chakra.Th>
                  </chakra.Tr>
                </chakra.Thead>
                <chakra.Tbody>
                  {isTableLoading ? (
                    <chakra.Tr>
                      <chakra.Td
                        colSpan={7}
                        textAlign="center"
                        py={8}
                        borderColor={'gray.200'}
                      >
                        <chakra.Flex
                          justifyContent="center"
                          alignItems="center"
                          direction="column"
                        >
                          <chakra.Spinner
                            size="md"
                            color="black"
                            thickness="3px"
                            speed="0.65s"
                            mb={3}
                          />
                          <chakra.Text color="gray.900">
                            Loading companies...
                          </chakra.Text>
                        </chakra.Flex>
                      </chakra.Td>
                    </chakra.Tr>
                  ) : companies.length === 0 ? (
                    <chakra.Tr>
                      <chakra.Td
                        colSpan={7}
                        textAlign="center"
                        py={8}
                        color="gray.900"
                        borderColor={'gray.200'}
                      >
                        <chakra.Box>
                          <chakra.Text fontSize="lg" mb={2}>
                            No companies found
                          </chakra.Text>
                          <chakra.Text fontSize="sm">
                            Try adjusting your search or filters
                          </chakra.Text>
                        </chakra.Box>
                      </chakra.Td>
                    </chakra.Tr>
                  ) : (
                    companies.map((company) => (
                      <chakra.Tr
                        key={company.id}
                        _hover={{ bg: 'rgb(241,241,241)' }}
                        transition="background-color 0.2s"
                        cursor="pointer"
                      >
                        <chakra.Td
                          color="gray.900"
                          fontWeight="400"
                          borderColor={'gray.200'}
                        >
                          {company.business_name}
                        </chakra.Td>
                        <chakra.Td color="gray.900"
                          fontWeight="400"
                          borderColor={'gray.200'}>
                          {company.market_name}
                        </chakra.Td>
                        <chakra.Td color="gray.900"
                          fontWeight="400"
                          borderColor={'gray.200'}>
                          {company.type_of_business || "N/A"}
                        </chakra.Td>
                        <chakra.Td color="gray.900"
                          fontWeight="400"
                          borderColor={'gray.200'}>
                          {company.country || "N/A"}
                        </chakra.Td>
                        <chakra.Td borderColor={'gray.200'}>
                          <chakra.Badge
                            colorScheme={company.is_inactive ? "red" : "green"}
                            borderRadius="full"
                            px={3}
                            py={1}
                            textTransform="capitalize"
                            fontWeight="medium"
                            fontSize="xs"
                          >
                            {company.is_inactive ? "Inactive" : "Active"}
                          </chakra.Badge>
                        </chakra.Td>
                        <chakra.Td borderColor={'gray.200'}>
                          <chakra.Badge
                            colorScheme={company.is_verified ? "blue" : "gray"}
                            borderRadius="full"
                            px={3}
                            py={1}
                            textTransform="capitalize"
                            fontWeight="medium"
                            fontSize="xs"
                          >
                            {company.is_verified ? "Verified" : "Not Verified"}
                          </chakra.Badge>
                        </chakra.Td>
                        <chakra.Td isNumeric borderColor={'gray.200'}>
                          <chakra.ButtonGroup size="sm" spacing={1}>
                            <chakra.IconButton
                              aria-label="View details"
                              icon={<FiEye />}
                              variant="ghost"
                              colorScheme="blue"
                              as="a"
                              href={`/company-details/${company?.id}`}
                            />
                            <chakra.IconButton
                              aria-label="Edit company"
                              icon={<FiEdit />}
                              variant="ghost"
                              colorScheme="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenUpdateModal(company);
                              }}
                            />
                            {company.is_inactive ? (
                              <chakra.IconButton
                                aria-label="Activate company"
                                icon={<FiCheckCircle />}
                                colorScheme="green"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenStatusModal(company, "activate");
                                }}
                              />
                            ) : (
                              <chakra.IconButton
                                aria-label="Deactivate company"
                                icon={<FiXCircle />}
                                colorScheme="red"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenStatusModal(company, "deactivate");
                                }}
                              />
                            )}
                          </chakra.ButtonGroup>
                        </chakra.Td>
                      </chakra.Tr>
                    ))
                  )}
                </chakra.Tbody>
              </chakra.Table>
            </chakra.Box>
          </chakra.Box>

          {/* Pagination */}
          {totalPages > 1 && (
            <chakra.Flex
              justifyContent="center"
              mt={4}
              mb={4}
              bg={secondaryBg}
              p={4}
              borderRadius="lg"
              shadow="md"
            >
              <chakra.ButtonGroup spacing={2} variant="outline">
                <chakra.Button
                  isDisabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  colorScheme="blue"
                  size="sm"
                >
                  Previous
                </chakra.Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    // If 5 or fewer pages, show all
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    // Near the start
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Near the end
                    pageNumber = totalPages - 4 + i;
                  } else {
                    // In the middle
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <chakra.Button
                      key={pageNumber}
                      colorScheme={currentPage === pageNumber ? "blue" : "gray"}
                      variant={currentPage === pageNumber ? "solid" : "outline"}
                      onClick={() => handlePageChange(pageNumber)}
                      size="sm"
                    >
                      {pageNumber}
                    </chakra.Button>
                  );
                })}

                <chakra.Button
                  isDisabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  colorScheme="blue"
                  size="sm"
                >
                  Next
                </chakra.Button>
              </chakra.ButtonGroup>
            </chakra.Flex>
          )}

          <chakra.Text color="gray.900" fontSize="sm" textAlign="center">
            Showing {companies.length} of {totalCompanies} companies
          </chakra.Text>
        </chakra.Box>
      </chakra.Box>

      {/* Modals */}
      <CompanyCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        refreshList={() => fetchCompanies(true)}
      />

      <CompanyUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        companyId={selectedCompany?.id}
        refreshList={() => fetchCompanies()}
      />

      <CompanyStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        company={selectedCompany}
        action={statusAction}
        refreshList={() => fetchCompanies()}
      />
    </>
  );
}
