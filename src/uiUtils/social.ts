import {
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  Facebook as FacebookIcon,
  LinkedIn as LinkedInIcon,
  Link as LinkIcon,
  MusicVideo as TikTokIcon
} from '@mui/icons-material';
import { SocialPlatformType } from '../enums/NewsEnums';

export const getSocialIcon = (platform: SocialPlatformType | string) => {
  switch (platform) {
    case 'INSTAGRAM':
      return InstagramIcon;
    case 'TWITTER':
      return TwitterIcon;
    case 'YOUTUBE':
      return YouTubeIcon;
    case 'TIKTOK':
      return TikTokIcon;
    case 'FACEBOOK':
      return FacebookIcon;
    case 'LINKEDIN':
      return LinkedInIcon;
    case 'OTHER':
    default:
      return LinkIcon;
  }
};

export const getPlatformColor = (platform: SocialPlatformType | string): string => {
  switch (platform) {
    case 'INSTAGRAM':
      return '#E4405F';
    case 'TWITTER':
      return '#1DA1F2';
    case 'YOUTUBE':
      return '#FF0000';
    case 'TIKTOK':
      return '#000000';
    case 'FACEBOOK':
      return '#1877F2';
    case 'LINKEDIN':
      return '#0A66C2';
    default:
      return '#757575';
  }
};

export const getPlatformName = (platform: SocialPlatformType | string): string => {
  switch (platform) {
    case 'INSTAGRAM':
      return 'Instagram';
    case 'TWITTER':
      return 'Twitter';
    case 'YOUTUBE':
      return 'YouTube';
    case 'TIKTOK':
      return 'TikTok';
    case 'FACEBOOK':
      return 'Facebook';
    case 'LINKEDIN':
      return 'LinkedIn';
    case 'OTHER':
      return 'Other';
    default:
      return 'Other';
  }
};
