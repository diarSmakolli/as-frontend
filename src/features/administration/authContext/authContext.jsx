import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'; 
import { jwtDecode } from 'jwt-decode';
import { useToast } from '@chakra-ui/react';
import { customToastContainerStyle } from '../../../commons/toastStyles';

const baseUrlApi = "https://api.assolutionsfournitures.fr/api";
const fontName = 'Inter';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const toast = useToast();
    const [account, setAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getAccount = async () => {
            try {
                const response = await axios.get(`${baseUrlApi}/api/administrations/self`, {
                    withCredentials: true
                });
                setAccount(response.data.data.account);
            } catch (err) {
                if (err.response?.status === 401) {
                    logout();
                }
            } finally {
                setIsLoading(false);
            }
        }

        getAccount();
    }, []);


    const logout = async () => {
        try {
            const response = await axios.post(`${baseUrlApi}/api/administrations/sign-out`, {}, {
                withCredentials: true
            });

            toast({
                description: `${response.data.message}`,
                status: 'success',
                isClosable: true,
                duration: 5000,
                variant: 'custom',
                containerStyle: customToastContainerStyle
            })
        } catch (error) {

            const { response } = error;
            
            if (!response) {
                toast({
                    description: 'Please check you internet connection',
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    variant: 'custom',
                    containerStyle: customToastContainerStyle
                })
            }

            toast({
                description: `${response?.data?.message || 'Something was broken...'}`,
                status: 'error',
                isClosable: true,
                duration: 5000,
                variant: 'custom',
                containerStyle: customToastContainerStyle
            })
        } finally {
            setAccount(null);
        }
    };

    const handleTokenExpired = () => {
        toast({
            title: `Your session has expired. Please log in again.`,
            status: 'error',
            isClosable: true,
            duration: 5000,
            variant: 'custom',
            containerStyle: customToastContainerStyle
        })
        setTimeout(() => {
            logout();
        }, 3000);
    };

    const isAuthenticatedAccount = () => {
        return account;
    }

    return (
        <AuthContext.Provider value={{ account, setAccount, logout, isLoading, isAuthenticatedAccount }}>
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext);