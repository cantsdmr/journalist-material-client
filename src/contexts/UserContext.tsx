import { createContext, useContext, useEffect, useState } from "react"
import { useApiContext } from "./ApiContext";
import { useAuthContext } from "./AuthContext";

const UserContext = createContext(null as any)
const useUserInfoContext = () => useContext(UserContext)

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const apiContext = useApiContext();
    const authContext = useAuthContext();
    const [value, setValue] = useState<any | undefined>(undefined);

    const getUserInfo = async (userId: string) => {
      if (userId == null) {
        return;
      }

      const userInfo = await apiContext?.api?.userApi.get(userId);
      setValue(userInfo)
    }
  
    useEffect(() => {
      if (authContext?.user?.uid == null || !apiContext.isAuthenticated) {
          return;
      }

      getUserInfo(authContext?.user?.uid)
  }, [authContext?.user, apiContext?.isAuthenticated])

    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}

export { useUserInfoContext, UserProvider }