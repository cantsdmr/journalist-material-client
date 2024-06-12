import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useApiContext } from '../contexts/ApiContext'

export const useUser = () => {
    const [user, setUser] = useState<any>({})
    const auth = useAuthContext();
    const { api } = useApiContext();
    
    // const getUserInfo = async (userId: any) => {
    //     await api.get('/api/supporter/', {
    //         divisionId,
    //         tierId
    //     })
    // }

    useEffect(() => {

    }, [auth?.user])
    

    return { user };
};