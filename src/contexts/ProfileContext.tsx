import { useState, useEffect } from "react"
import { useApiContext } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { ChannelSubscription, SubscriptionTier, UserProfile } from "@/types/index";
import { createCtx } from "./BaseContext";
import { useApiCall } from "@/hooks/useApiCall";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  channelRelations: {
    getSubscription: (channelId: string) => ChannelSubscription | null;
    getSubscriptions: () => ChannelSubscription[];
    hasSubscription: (channelId: string) => boolean;
    hasChannel: () => boolean;
    getSubscriptionTier: (channelId: string) => SubscriptionTier | null;
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
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
      getSubscription: (channelId: string) => profile?.subscriptions?.find(m => m.channelId === channelId) ?? null,
      getSubscriptions: () => profile?.subscriptions ?? [],
      hasSubscription: (channelId: string) => profile?.subscriptions?.some(m => m.channelId === channelId) ?? false,
      hasChannel: () => profile?.subscriptions?.length && profile.subscriptions.length > 0,
      getSubscriptionTier: (channelId: string) => profile?.subscriptions?.find(m => m.channelId === channelId)?.tier ?? null
    },
    actions: {
      refreshProfile
    }
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}; 