import { createContext, useContext, useEffect, useState } from "react";
import { AppAPI } from "../APIs/AppAPI";
import { useAuthContext } from "./AuthContext";

export interface ApiContextType {
    api: AppAPI | undefined,
    isAuthenticated: boolean
}

const ApiContext = createContext(null as any)
const useApiContext = () => useContext<ApiContextType>(ApiContext)

const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [value, setValue] = useState<ApiContextType>();
    const auth = useAuthContext();

    const getToken = async () => {
        if (auth?.user && value?.api) {
            const token = await auth.user.getIdToken();
            const updatedApi = value.api?.setAuthHeader(token).setApis();
            setValue({
                api: updatedApi,
                isAuthenticated: true
            });
        }
    }

    useEffect(() => {
        getToken();
    }, [auth?.user, value?.api])

    useEffect(() => {
        const newApi = new AppAPI();
        setValue({
            api: newApi,
            isAuthenticated: false
        })
    }, [])
    

    return <ApiContext.Provider value={value}>
        {children}
    </ApiContext.Provider>
}

export { ApiProvider, useApiContext };