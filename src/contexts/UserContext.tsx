import { createContext, useContext, useEffect, useState } from "react"
import { useApiContext } from "./ApiContext";
import { useAuthContext } from "./AuthContext";

export interface UserInfoType {
  id: string;
  email: string;
  externalId: string;
  displayName: string;
  photoUrl: string;
  roleId: number;
  statusId: number;
}

const UserContext = createContext<UserInfoType | undefined>(undefined)
const useUserInfoContext = () => useContext(UserContext)

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const apiContext = useApiContext();
    const authContext = useAuthContext();
    const [value, setValue] = useState<any | undefined>(undefined);

    const getUserInfo = async (externalId: string | undefined) => {
      if (externalId == null) {
        return;
      }

      const userInfo = await apiContext?.api?.userApi.getUserInfoByExternalId(externalId);
      setValue(userInfo)
    }
  
    useEffect(() => {
      if (!apiContext?.isAuthenticated || authContext?.user == null) {
          return;
      }

      getUserInfo(authContext?.user?.uid)
  }, [authContext?.user, apiContext?.isAuthenticated])

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}

export { useUserInfoContext, UserProvider }