import { createContext, useContext, useEffect, useState } from "react";
import { AppAPI } from "@/APIs/AppAPI";
import { useAuth } from "./AuthContext";

export type ApiContextValue = {
    api: AppAPI,
    isAuthenticated: boolean,
    isLoading: boolean
}

export const ApiContext = createContext(null as any)
const useApiContext = () => useContext<ApiContextValue>(ApiContext)

export const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [value, setValue] = useState<ApiContextValue>({
        api: new AppAPI(),
        isAuthenticated: false,
        isLoading: true
    });
    const auth = useAuth();

    useEffect(() => {
        const updateApi = async () => {
            if (auth?.user) {
                const token = await auth.getToken();
                if (token) {
                    const updatedApi = value.api?.setAuthHeader(token).setApis();
                    setValue({
                        api: updatedApi,
                        isAuthenticated: true,
                        isLoading: false
                    });
                }
            } else {
                // Reset API when user logs out
                const updatedApi = value.api?.setAuthHeader(null).setApis();
                setValue({
                    api: updatedApi,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        };

        updateApi();
    }, [auth?.user, auth?.isAuthenticated]);

    return <ApiContext.Provider value={value}>
        {children}
    </ApiContext.Provider>
}

export { useApiContext };