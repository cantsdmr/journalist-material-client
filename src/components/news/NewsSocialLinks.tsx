import React from 'react';
import { 
  Stack, 
  Paper,
  Typography,
  Box,
  Divider,
  Link
} from '@mui/material';
import { SocialLink } from '../../APIs/NewsAPI';
import { SOCIAL_PLATFORM_TYPE } from '../../enums/NewsEnums';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/MusicVideo';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LinkIcon from '@mui/icons-material/Link';
import PublicIcon from '@mui/icons-material/Public';
import LaunchIcon from '@mui/icons-material/Launch';

interface NewsSocialLinksProps {
  links: SocialLink[];
}

const NewsSocialLinks: React.FC<NewsSocialLinksProps> = ({ links }) => {
  const getSocialIcon = (platform: number) => {
    switch (platform) {
      case SOCIAL_PLATFORM_TYPE.INSTAGRAM:
        return <InstagramIcon />;
      case SOCIAL_PLATFORM_TYPE.TWITTER:
        return <TwitterIcon />;
      case SOCIAL_PLATFORM_TYPE.YOUTUBE:
        return <YouTubeIcon />;
      case SOCIAL_PLATFORM_TYPE.TIKTOK:
        return <TikTokIcon />;
      case SOCIAL_PLATFORM_TYPE.FACEBOOK:
        return <FacebookIcon />;
      case SOCIAL_PLATFORM_TYPE.LINKEDIN:
        return <LinkedInIcon />;
      case SOCIAL_PLATFORM_TYPE.OTHER:
      default:
        return <LinkIcon />;
    }
  };

  if (!links.length) return null;

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        width: '100%'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PublicIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          Read More On
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Stack spacing={1.5}>
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            sx={{ 
              color: 'inherit',
              display: 'block',
              '&:hover': {
                '& .MuiPaper-root': {
                  bgcolor: 'action.hover',
                  borderColor: 'primary.main'
                },
                '& .launch-icon': {
                  color: 'primary.main'
                }
              }
            }}
          >
            <Paper
              variant="outlined"
              sx={{ 
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    color: getPlatformColor(link.platform),
                    display: 'flex',
                    mr: 1.5
                  }}
                >
                  {getSocialIcon(link.platform)}
                </Box>
                <Typography variant="body2">
                  {getPlatformName(link.platform)}
                </Typography>
              </Box>
              <LaunchIcon 
                fontSize="small" 
                className="launch-icon"
                sx={{ 
                  color: 'text.secondary',
                  transition: 'color 0.2s ease-in-out'
                }} 
              />
            </Paper>
          </Link>
        ))}
      </Stack>
    </Paper>
  );
};

// Helper function to get platform name
const getPlatformName = (platform: number): string => {
  return Object.entries(SOCIAL_PLATFORM_TYPE)
    .find(([_, value]) => value === platform)?.[0] || 'Other';
};

// Helper function to get platform-specific colors
const getPlatformColor = (platform: number): string => {
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

export default NewsSocialLinks; 