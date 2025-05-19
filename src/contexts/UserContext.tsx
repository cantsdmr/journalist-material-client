import { useState, useEffect } from "react"
import { useApiContext } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { User } from "@/APIs/UserAPI";
import { ChannelMembership } from "@/APIs/ChannelAPI";
import { createCtx } from "./BaseContext";

interface UserState {
  user: User | null;
  isLoading: boolean;
  actions: {
    refreshUser: () => Promise<void>;
    getMembership: (channelId: string) => ChannelMembership | null;
    hasMembership: (channelId: string) => boolean;
    getMembershipTier: (channelId: string) => string | undefined;
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
      getMembership: (channelId: string) => user?.memberships?.find(m => m.channelId === channelId) ?? null,
      hasMembership: (channelId: string) => user?.memberships?.some(m => m.channelId === channelId) ?? false,
      getMembershipTier: (channelId: string) => user?.memberships?.find(m => m.channelId === channelId)?.tierId
    }
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};