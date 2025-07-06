import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { administrationService } from '../services/administrationService';
import { handleApiError } from '../../../commons/handleApiError';
import { customToastContainerStyle } from '../../../commons/toastStyles';

export const useAccountSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(false);
    const toast = useToast();

    const fetchActiveSessions = useCallback(async () => {
        setIsLoadingSessions(true);
        try {
            const response = await administrationService.getActiveSessions();
            setSessions(response.data.data.sessions);
        } catch (error) {
            handleApiError(error.response, toast);
        } finally {
            setIsLoadingSessions(false);
        }
    }, [toast]);

    const terminateSession = useCallback(async (sessionId) => {
        try {
            await administrationService.terminateSession(sessionId);
            toast({
                description: "Session terminated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
                variant: "custom",
                containerStyle: customToastContainerStyle,
            });
            fetchActiveSessions();
        } catch (error) {
            handleApiError(error.response, toast);
        }
    }, [toast, fetchActiveSessions]);

    useEffect(() => {
        fetchActiveSessions();
    }, [fetchActiveSessions]);

    return { sessions, isLoadingSessions, fetchActiveSessions, terminateSession };
};