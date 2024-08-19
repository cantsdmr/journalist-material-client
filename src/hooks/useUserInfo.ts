import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useApiContext } from '../contexts/ApiContext'

interface UserInfoType {
    
}

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<any>(null)
    const authContext = useAuthContext();
    const apiContext = useApiContext();

    const getUserInfo = async (userId: string) => {
        if (userId == null) {
            return;
        }

        const userInfo = await apiContext?.api?.userApi.get(userId);
        setUserInfo(userInfo);
    }

    useEffect(() => {
        // if (authContext?.user?.uid == null || !apiContext.isAuthenticated) {
        //     return;
        // }

        // getUserInfo(authContext?.user?.uid)
    }, [authContext?.user, apiContext?.isAuthenticated])
    

    return { userInfo, getUserInfo };
};