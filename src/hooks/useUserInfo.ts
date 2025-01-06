import { useEffect, useState } from "react";
import { UserInfoType, useUserInfoContext } from "@/contexts/UserContext";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState<UserInfoType | undefined>(undefined)
    const userInfoContext = useUserInfoContext();

    useEffect(() => {
        setUserInfo(userInfoContext)
    }, [userInfoContext])
    
    return { userInfo };
};