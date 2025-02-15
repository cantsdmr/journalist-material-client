import { useState, useEffect } from "react"
import { useApiContext } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { User } from "@/APIs/UserAPI";
import { createCtx } from "./BaseContext";

interface UserState {
  user: User | null;
  isLoading: boolean;
  actions: {
    refreshUser: () => Promise<void>;
    isFollowing: (channelId: string) => boolean;
    isSubscribed: (channelId: string) => boolean;
    getSubscriptionTier: (channelId: string) => string | undefined;
  };
}

export const [UserContext, useUser] = createCtx<UserState>();

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { api, isAuthenticated } = useApiContext();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUser = async () => {
    if (!authUser?.uid) return;
    setIsLoading(true);
    try {
      const data = await api.userApi.getUserInfoByExternalId(authUser.uid);
      setUser(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshUser();
    }
  }, [authUser?.uid, isAuthenticated]);

  const value = {
    user,
    isLoading,
    actions: {
      refreshUser,
      isFollowing: (channelId: string) => user?.followings?.some(f => f.channelId === channelId) ?? false,
      isSubscribed: (channelId: string) => user?.subscriptions?.some(s => s.channelId === channelId) ?? false,
      getSubscriptionTier: (channelId: string) => user?.subscriptions?.find(s => s.channelId === channelId)?.tierId
    }
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};