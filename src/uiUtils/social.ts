import { 
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  MusicVideo as TikTokIcon
} from '@mui/icons-material';
import { SOCIAL_PLATFORM_TYPE } from '../enums/NewsEnums';

export const getSocialIcon = (platform: number) => {
  switch (platform) {
    case SOCIAL_PLATFORM_TYPE.INSTAGRAM:
      return InstagramIcon;
    case SOCIAL_PLATFORM_TYPE.TWITTER:
      return TwitterIcon;
    case SOCIAL_PLATFORM_TYPE.YOUTUBE:
      return YouTubeIcon;
    case SOCIAL_PLATFORM_TYPE.TIKTOK:
      return TikTokIcon;
    case SOCIAL_PLATFORM_TYPE.FACEBOOK:
      return FacebookIcon;
    case SOCIAL_PLATFORM_TYPE.LINKEDIN:
      return LinkedInIcon;
    case SOCIAL_PLATFORM_TYPE.OTHER:
    default:
      return LinkIcon;
  }
};

export const getPlatformColor = (platform: number): string => {
  switch (platform) {
    case SOCIAL_PLATFORM_TYPE.INSTAGRAM:
      return '#E4405F';
    case SOCIAL_PLATFORM_TYPE.TWITTER:
      return '#1DA1F2';
    case SOCIAL_PLATFORM_TYPE.YOUTUBE:
      return '#FF0000';
    case SOCIAL_PLATFORM_TYPE.TIKTOK:
      return '#000000';
    case SOCIAL_PLATFORM_TYPE.FACEBOOK:
      return '#1877F2';
    case SOCIAL_PLATFORM_TYPE.LINKEDIN:
      return '#0A66C2';
    default:
      return '#757575';
  }
};

export const getPlatformName = (platform: number): string => {
  return Object.entries(SOCIAL_PLATFORM_TYPE)
    .find(([, value]) => value === platform)?.[0] || 'Other';
}; 