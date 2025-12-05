import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { APIs } from "@/APIs/APIs";
import { useAuth } from "./AuthContext";

export type ApiContextValue = {
    api: APIs,
    isAuthenticated: boolean,
    isLoading: boolean,
    refreshToken: () => Promise<void>
}

export const ApiContext = createContext(null as any)
const useApiContext = () => useContext<ApiContextValue>(ApiContext)

export const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [value, setValue] = useState<ApiContextValue>({
        api: new APIs(),
        isAuthenticated: false,
        isLoading: true,
        refreshToken: async () => {}
    });
    const auth = useAuth();
    const tokenRefreshTimeout = useRef<NodeJS.Timeout | null>(null);

    // Function to update API with new token
    const updateApiWithToken = useCallback(async (forceRefresh = false) => {
        if (auth?.user) {
            const token = await auth.getToken(forceRefresh);
            if (token) {
                setValue(prev => {
                    const updatedApi = prev.api?.setAuthHeader(token).setApis();
                    return {
                        ...prev,
                        api: updatedApi,
                        isAuthenticated: true,
                        isLoading: false
                    };
                });
            }
        } else {
            // Reset API when user logs out
            setValue(prev => {
                const updatedApi = prev.api?.setAuthHeader(null).setApis();
                return {
                    ...prev,
                    api: updatedApi,
                    isAuthenticated: false,
                    isLoading: false
                };
            });
        }
    }, [auth]);

    // Refresh token function
    const refreshToken = useCallback(async () => {
        console.log('Manually refreshing token...');
        await updateApiWithToken(true); // Force refresh
    }, [updateApiWithToken]);

    // Initial setup and user changes
    useEffect(() => {
        updateApiWithToken(false);
    }, [auth?.user, auth?.isAuthenticated, updateApiWithToken]);

    // Update the refreshToken function in context
    useEffect(() => {
        setValue(prev => ({
            ...prev,
            refreshToken
        }));
    }, [refreshToken]);

    // Cleanup timeout on unmount
    useEffect(() => {
        const timeout = tokenRefreshTimeout.current;
        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, []);

    return <ApiContext.Provider value={value}>
        {children}
    </ApiContext.Provider>
}

export { useApiContext };