import { User } from "@/APIs/UserAPI";
import { ChannelMembership, ChannelTier } from "@/APIs/ChannelAPI";
import { useUser } from "@/contexts/UserContext";

interface UserInfo {
  user: User | null;
  isLoading: boolean;
  channelRelations: {
    getMembership: (channelId: string) => ChannelMembership | null;
    hasMembership: (channelId: string) => boolean;
    getMembershipTier: (channelId: string) => ChannelTier;
    getMemberships: () => ChannelMembership[];
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
      getMembership: actions.getMembership,
      hasMembership: actions.hasMembership,
      getMembershipTier: actions.getMembershipTier,
      getMemberships: actions.getMemberships
    },
    actions: {
      refreshUser: actions.refreshUser
    }
  };
};