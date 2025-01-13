import { createContext, useContext, useEffect, useState } from "react";
import { AppAPI } from "../APIs/AppAPI";
import { useAuthContext } from "./AuthContext";

export type ApiContextValue = {
    api: AppAPI | undefined,
    isAuthenticated: boolean
}

const ApiContext = createContext(null as any)
const useApiContext = () => useContext<ApiContextValue>(ApiContext)

const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [value, setValue] = useState<ApiContextValue>({
        api: new AppAPI(),
        isAuthenticated: false
    });
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
        if (auth?.user) {
            getToken();
        }
    }, [auth?.user])

    return <ApiContext.Provider value={value}>
        {children}
    </ApiContext.Provider>
}

export { ApiProvider, useApiContext };