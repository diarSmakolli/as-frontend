import * as chakra from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageCount = true,
  size = "md",
  colorScheme = "blue",
}) => {
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pageNumbers = [1];
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (startPage > 2) {
      pageNumbers.push("...");
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  
  const sizes = {
    sm: { buttonSize: "sm", px: 3 },
    md: { buttonSize: "md", px: 4 },
    lg: { buttonSize: "lg", px: 5 },
  };
  
  return (
    <chakra.Flex
      justify="space-between"
      align="center"
      w="100%"
      mt={6}
      px={sizes[size].px}
    >
      {showPageCount ? (
        <chakra.Text color="gray.400" fontSize="sm">
          Page {currentPage} of {totalPages}
        </chakra.Text>
      ) : (
        <chakra.Box />
      )}
      
      <chakra.ButtonGroup variant="outline" spacing="2" size={sizes[size].buttonSize}>
        <chakra.Button
          leftIcon={<FaChevronLeft />}
          onClick={() => onPageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
          _hover={{ bg: "gray.700" }}
          color="gray.300"
          borderColor="gray.600"
          size='sm'
        >
          Prev
        </chakra.Button>
        
        {pageNumbers.map((page, index) => (
          page === "..." ? (
            <chakra.Button
              key={`ellipsis-${index}`}
              variant="ghost"
              cursor="default"
              _hover={{ bg: "transparent" }}
              pointerEvents="none"
              color="gray.400"
              size='sm'
            >
              ...
            </chakra.Button>
          ) : (
            <chakra.Button
              key={page}
              variant={currentPage === page ? "solid" : "outline"}
              colorScheme={currentPage === page ? colorScheme : "gray"}
              color='gray.400'
              onClick={() => onPageChange(page)}
              _hover={{ bg: currentPage === page ? "" : "gray.700" }}
              borderColor="gray.700"
              size='sm'
            >
              {page}
            </chakra.Button>
          )
        ))}
        
        <chakra.Button
          rightIcon={<FaChevronRight />}
          onClick={() => onPageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          _hover={{ bg: "gray.700" }}
          color="gray.300"
          borderColor="gray.600"
          size='sm'
        >
          Next
        </chakra.Button>
      </chakra.ButtonGroup>
    </chakra.Flex>
  );
};

export default Pagination;