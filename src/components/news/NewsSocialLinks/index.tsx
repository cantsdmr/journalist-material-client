import React from 'react';
import { 
  Stack, 
  Paper,
  Typography,
  Box,
  Divider,
  Link
} from '@mui/material';
import { SocialLink } from '../../../APIs/NewsAPI';
import { getSocialIcon, getPlatformColor, getPlatformName } from '../../../uiUtils/social';
import PublicIcon from '@mui/icons-material/Public';
import LaunchIcon from '@mui/icons-material/Launch';

interface NewsSocialLinksProps {
  links: SocialLink[];
  onChange?: (links: SocialLink[]) => void;
}

const NewsSocialLinks: React.FC<NewsSocialLinksProps> = ({ links }) => {
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
                  {React.createElement(getSocialIcon(link.platform))}
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

export default NewsSocialLinks; 