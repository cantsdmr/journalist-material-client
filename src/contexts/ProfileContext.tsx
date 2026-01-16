import { useState, useEffect, useCallback, useRef } from "react"
import { useApiContext } from "./ApiContext";
import { useAuth } from "./AuthContext";
import { ChannelSubscription, SubscriptionTier, UserProfile } from "@/types/index";
import { createCtx } from "./BaseContext";
import { useApiCall } from "@/hooks/useApiCall";

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  hasServerError: boolean;
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
  const { api } = useApiContext();
  const { user: authUser } = useAuth();
  const { execute } = useApiCall();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasServerError, setHasServerError] = useState(false);

  // Use ref to track the current authUser.uid for the callback
  const authUserIdRef = useRef<string | undefined>(authUser?.uid);
  authUserIdRef.current = authUser?.uid;

  const refreshProfile = useCallback(async () => {
    if (!authUserIdRef.current) return;

    setIsLoading(true);
    setHasServerError(false);

    const result = await execute(
      () => api.app.account.getProfile(),
      { showErrorToast: false }
    );

    if (result) {
      setProfile(result);
    } else {
      setHasServerError(true);
    }

    setIsLoading(false);
    setIsInitialized(true);
  }, [api, execute]);

  // Reset all states when user logs out
  useEffect(() => {
    if (!authUser) {
      setProfile(null);
      setIsLoading(false);
      setIsInitialized(false);
      setHasServerError(false);
    }
  }, [authUser]);

  const value = {
    profile,
    isLoading,
    isInitialized,
    hasServerError,
    channelRelations: {
      getSubscription: (channelId: string) => profile?.subscriptions?.find(m => m.channelId === channelId) ?? null,
      getSubscriptions: () => profile?.subscriptions ?? [],
      hasSubscription: (channelId: string) => profile?.subscriptions?.some(m => m.channelId === channelId) ?? false,
      hasChannel: () => profile?.staffChannels?.length && profile.staffChannels.length > 0,
      getSubscriptionTier: (channelId: string) => profile?.subscriptions?.find(m => m.channelId === channelId)?.tier ?? null
    },
    actions: {
      refreshProfile
    }
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
