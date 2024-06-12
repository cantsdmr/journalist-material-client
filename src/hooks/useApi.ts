import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Api } from "../util/http";

export const useApi = () => {
    const [api, setApi] = useState<any>(Api)
    const [isAuthenticated, setIsAuthenticated] = useState<any>(false)
    const auth = useAuthContext();

    useEffect(() => {
        if (auth?.user) {
            Api.setAuthHeader(auth.user.accessToken)
            setApi(Api)
            setIsAuthenticated(true)
        }

    }, [auth?.user])
    

    return { api, isAuthenticated };
};