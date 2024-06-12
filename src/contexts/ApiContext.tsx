import { createContext, useContext } from "react";
import { useApi } from "../hooks/useApi";
import { Api } from "../util/http";

interface ApiContextType {
    api: typeof Api,
    isAuthenticated: boolean
}

const ApiContext = createContext(null as any)
const useApiContext = () => useContext<ApiContextType>(ApiContext)

const ApiProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const api = useApi()

    return <ApiContext.Provider value={api}>
        {children}
    </ApiContext.Provider>
}

export { ApiProvider, useApiContext };