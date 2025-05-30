import { useState, useEffect } from "react"
import { useApiContext } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { User } from "@/APIs/UserAPI";
import { ChannelMembership, ChannelTier } from "@/APIs/ChannelAPI";
import { createCtx } from "./BaseContext";
import { useApiCall } from "@/hooks/useApiCall";

interface ProfileState {
  profile: User | null;
  isLoading: boolean;
  channelRelations: {
    getMembership: (channelId: string) => ChannelMembership | null;
    getMemberships: () => ChannelMembership[];
    hasMembership: (channelId: string) => boolean;
    hasChannel: () => boolean;
    getMembershipTier: (channelId: string) => ChannelTier;
  };
  actions: {
    refreshProfile: () => Promise<void>;
  };
}

export const [ProfileContext, useProfile] = createCtx<ProfileState>();

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { api, isAuthenticated } = useApiContext();
  const { user: authUser } = useAuth();
  const { execute } = useApiCall();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProfile = async () => {
    if (!authUser?.uid) return;
    
    setIsLoading(true);
    
    const result = await execute(
      () => api.accountApi.getProfile(),
      { showErrorToast: true }
    );
    
    if (result) {
      setProfile(result);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile();
    }
  }, [authUser?.uid, isAuthenticated]);

  const value = {
    profile,
    isLoading,
    channelRelations: {
      getMemberships: () => profile?.memberships ?? [],
      getMembership: (channelId: string) => profile?.memberships?.find(m => m.channelId === channelId) ?? null,
      hasMembership: (channelId: string) => profile?.memberships?.some(m => m.channelId === channelId) ?? false,
      hasChannel: () => profile?.channelUsers?.length && profile.channelUsers.length > 0,
      getMembershipTier: (channelId: string) => profile?.memberships?.find(m => m.channelId === channelId)?.tier ?? null
    },
    actions: {
      refreshProfile
    }
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}; 