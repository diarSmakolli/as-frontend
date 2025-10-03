import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import { customToastContainerStyle } from '../../../commons/toastStyles';

const baseUrlApi = "https://api.assolutionsfournitures.fr";
// const baseUrlApi = "http://localhost:8086";
const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const toast = useToast();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current customer on mount
  useEffect(() => {
    const getSelf = async () => {
      try {
        const response = await axios.get(`${baseUrlApi}/api/customers/me`, {
          withCredentials: true,
        });
        setCustomer(response.data.data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    };
    getSelf();
  }, []);

  // Add refreshCustomer function
  const refreshCustomer = async () => {
    try {
      if (!customer?.id) return false;
      
      const response = await axios.get(`${baseUrlApi}/api/customers/me`, {
        withCredentials: true,
      });
      
      if (response.data && response.data.data) {
        setCustomer(response.data.data);
        return true;
      }
      return false;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(`${baseUrlApi}/api/customers/logout`, {}, {
        withCredentials: true,
      });

      // toast({
      //   description: `${response.data.message}`,
      //   status: 'success',
      //   isClosable: true,
      //   duration: 5000,
      //   variant: 'custom',
      //   containerStyle: customToastContainerStyle,
      // });
    } catch (error) {
      const { response } = error;
      if (!response) {
        toast({
          description: 'Veuillez vérifier votre connexion Internet',
          status: 'error',
          isClosable: true,
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle,
        });
      } else {
        toast({
          description: `${response?.data?.message || ''}`,
          status: 'error',
          isClosable: true,
          duration: 5000,
          variant: 'custom',
          containerStyle: customToastContainerStyle,
        });
      }
    } finally {
      setCustomer(null);
    }
  };

  const handleTokenExpired = () => {
    toast({
      title: `Votre session a expiré. Veuillez vous reconnecter.`,
      status: 'error',
      isClosable: true,
      duration: 5000,
      variant: 'custom',
      containerStyle: customToastContainerStyle,
    });
    setTimeout(() => {
      logout();
    }, 3000);
  };

  const isAuthenticatedCustomer = () => {
    return !!customer;
  };

  return (
    <CustomerAuthContext.Provider value={{ 
      customer, 
      setCustomer, 
      logout, 
      isLoading, 
      isAuthenticatedCustomer, 
      refreshCustomer 
    }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);