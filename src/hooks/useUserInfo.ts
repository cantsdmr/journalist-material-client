import { User } from "@/APIs/UserAPI";
import { useUser } from "@/contexts/UserContext";

interface UserInfo {
  user: User | null;
  isLoading: boolean;
  channelRelations: {
    isFollowing: (channelId: string) => boolean;
    isSubscribed: (channelId: string) => boolean;
    getSubscriptionTier: (channelId: string) => string | undefined;
  };
  actions: {
    refreshUser: () => Promise<void>;
  };
}

export const useUserInfo = (): UserInfo => {
  const { user, isLoading, actions } = useUser();

  return {
    user,
    isLoading,
    channelRelations: {
      isFollowing: actions.isFollowing,
      isSubscribed: actions.isSubscribed,
      getSubscriptionTier: actions.getSubscriptionTier,
    },
    actions: {
      refreshUser: actions.refreshUser
    }
  };
};