import { customToastContainerStyle } from "./toastStyles";

export const handleApiError = (error, toast) => {
  if (!toast) {
    return;
  }

  let title = "Error";
  let description = "An unexpected error occurred. Please try again.";
  let status = "error";

  if (error && error.response) {
    const statusCode = error.response.status;

    let errorMessage = "";
    if (error.response.data) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
    }

    if (statusCode === 400) {
      title = "Bad Request";
      description =
        errorMessage || "The request was invalid. Please check your data.";
    } else if (statusCode === 401) {
      title = "Unauthorized";
      description =
        "You are not authorized to perform this action. Please log in again.";
    } else if (statusCode === 403) {
      title = "Forbidden";
      description = "You don't have permission to access this resource.";
    } else if (statusCode === 404) {
      title = "Not Found";
      description = errorMessage || "The requested resource was not found.";
    } else if (statusCode === 422) {
      title = "Validation Error";
      description =
        errorMessage || "There was a validation error with your request.";
    } else if (statusCode >= 500) {
      title = "Server Error";
      description = "A server error occurred. Please try again later.";
    } else {
      description = errorMessage || description;
    }
  } else if (error && error.request) {
    title = "Network Error";
    description =
      "No response received from server. Please check your internet connection.";
  } else if (error && error.message) {
    description = error.message;
  }

  toast({
    title,
    description,
    status,
    duration: 5000,
    isClosable: true,
    variant: "custom",
    containerStyle: customToastContainerStyle,
  });
};
