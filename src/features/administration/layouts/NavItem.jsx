import { Flex, Icon, Link } from '@chakra-ui/react';
import React from 'react';
import { useAuth } from '../authContext/authContext';

const NavItem = ({ icon, href, children, onClick, ...rest }) => {
    const { account, isLoading, logout } = useAuth();
    
    const handleClick = (e) => {
        if (onClick) {
            e.preventDefault();
            onClick();
        }
    };
    return (
        <Link
            href={href || '#'}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
            bg=''
            onClick={handleClick}>
            <Flex
                align="center"
                px={3}
                py={1}
                borderRadius="lg"
                role="group"
                mx={2}
                my={1}
                cursor="pointer"
                fontFamily={'Bricolage Grotesque'}
                fontWeight={'500'}
                fontSize={'sm'}
                _hover={{
                    bg: 'rgb(255, 255, 255)',
                    color: 'gray.900',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'black',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

export default NavItem;