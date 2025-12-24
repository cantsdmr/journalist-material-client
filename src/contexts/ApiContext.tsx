import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { APIs } from "@/APIs/APIs";
import { useAuth } from "./AuthContext";

export type ApiContextValue = {
    api: APIs,
    isAuthenticated: boolean,
    isLoading: boolean
}

export const ApiContext = createContext(null as any)
const useApiContext = () => useContext<ApiContextValue>(ApiContext)

/**
 * API Context Provider
 *
 * @requires AuthProvider - Must be wrapped by AuthProvider in the component tree
 *
 * This context manages API client configuration and automatically syncs
 * authentication tokens with the API client when Firebase refreshes tokens.
 * It subscribes to token refresh events from AuthContext to keep API
 * authorization headers up-to-date.
 *
 * @example
 * ```tsx
 * <AuthProvider>
 *   <ApiProvider>
 *     <App />
 *   </ApiProvider>
 * </AuthProvider>
 * ```
 */
export const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const auth = useAuth();

    // Guard: Ensure AuthProvider is in the tree
    if (!auth) {
        throw new Error(
            'ApiProvider must be used within AuthProvider. ' +
            'Please wrap ApiProvider with AuthProvider in your component tree.'
        );
    }

    const [value, setValue] = useState<ApiContextValue>({
        api: new APIs(),
        isAuthenticated: false,
        isLoading: true
    });

    // Function to update API with new token
    const updateApiWithToken = useCallback(async (forceRefresh = false) => {
        if (auth.user) {
            const token = await auth.getToken(forceRefresh);
            if (token) {
                setValue(prev => {
                    const updatedApi = prev.api.setAuthHeader(token).setApis();
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
                const updatedApi = prev.api.setAuthHeader(null).setApis();
                return {
                    ...prev,
                    api: updatedApi,
                    isAuthenticated: false,
                    isLoading: false
                };
            });
        }
    }, [auth]);

    // Initial setup and user changes
    useEffect(() => {
        updateApiWithToken(false);
    }, [auth.user, auth.isAuthenticated, updateApiWithToken]);

    // Subscribe to Firebase token refresh events
    useEffect(() => {
        console.log('Subscribing to Firebase token refresh events...');

        const unsubscribe = auth.onTokenRefresh(async () => {
            try {
                console.log('Firebase token refreshed - updating API authorization header...');
                await updateApiWithToken(false);
            } catch (error) {
                console.error('Error updating API token after Firebase refresh:', error);
            }
        });

        return () => {
            console.log('Unsubscribing from Firebase token refresh events...');
            unsubscribe();
        };
    }, [auth, updateApiWithToken]);

    return <ApiContext.Provider value={value}>
        {children}
    </ApiContext.Provider>
}

export { useApiContext };