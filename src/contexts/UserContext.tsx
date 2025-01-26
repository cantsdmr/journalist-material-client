import { createContext, useContext, useEffect, useState } from "react"
import { useApiContext } from "./ApiContext";
import { useAuthContext } from "./AuthContext";
import { User } from "@/APIs/UserAPI";

export interface UserContextValue {
  userInfo: Nullable<User>;
  isFollowingChannel: (channelId: string) => boolean;
  isSubscribedToChannel: (channelId: string) => boolean;
  getChannelSubscriptionTier: (channelId: string) => string | undefined;
  refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined)
const useUserInfoContext = () => useContext(UserContext)

const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const apiContext = useApiContext();
    const authContext = useAuthContext();
    const [userInfo, setUserInfo] = useState<Nullable<User>>(null);

    const getUserInfo = async (externalId: string | undefined) => {
      if (externalId == null) {
        return;
      }

      const userInfo = await apiContext?.api?.userApi.getUserInfoByExternalId(externalId);
      setUserInfo(userInfo)
    }

    const refreshUserInfo = async () => {
      if (authContext?.user?.uid) {
        await getUserInfo(authContext.user.uid);
      }
    };

    const isFollowingChannel = (channelId: string): boolean => {
      return userInfo?.followings?.some(following => following.channelId === channelId) ?? false;
    };

    const isSubscribedToChannel = (channelId: string): boolean => {
      return userInfo?.subscriptions?.some(sub => sub.channelId === channelId) ?? false;
    };

    const getChannelSubscriptionTier = (channelId: string): string | undefined => {
      return userInfo?.subscriptions
        ?.find(sub => sub.channelId === channelId)
        ?.tierId;
    };
  
    useEffect(() => {
      if (!apiContext?.isAuthenticated || authContext?.user == null) {
        return;
      }

      getUserInfo(authContext?.user?.uid)
    }, [authContext?.user, apiContext?.isAuthenticated])

    return (
      <UserContext.Provider 
        value={{
          userInfo,
          isFollowingChannel,
          isSubscribedToChannel,
          getChannelSubscriptionTier,
          refreshUserInfo
        }}
      >
        {children}
      </UserContext.Provider>
    )
}

export { useUserInfoContext, UserProvider }