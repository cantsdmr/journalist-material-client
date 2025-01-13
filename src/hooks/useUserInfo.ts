import { useUserInfoContext } from "../contexts/UserContext";

export const useUserInfo = () => {
    const context = useUserInfoContext();
    
    if (context === undefined) {
        throw new Error('useUserInfo must be used within a UserProvider');
    }

    const {
        userInfo,
        isFollowingChannel,
        isSubscribedToChannel,
        getChannelSubscriptionTier,
        refreshUserInfo
    } = context;

    return {
        // User basic info
        userInfo,
        
        // Channel relationship methods
        channelRelations: {
            isFollowing: isFollowingChannel,
            isSubscribed: isSubscribedToChannel,
            getSubscriptionTier: getChannelSubscriptionTier,
        },
        
        // Actions
        refreshUserInfo
    };
};