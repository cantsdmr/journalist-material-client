import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  Chip,
  Stack,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { News } from '../../APIs/NewsAPI';
import { NEWS_MEDIA_TYPE } from '../../enums/NewsEnums';
import NewsEntryStats from './NewsEntryStats';
import DefaultNewsAvatar from '../../assets/BG_journo.png'; // You'll need to add this

interface NewsEntryProps {
  news: News;
}

const NewsEntry: React.FC<NewsEntryProps> = ({ news }) => {
  const navigate = useNavigate();
  const avatarMedia = news.media?.find(m => m.type === NEWS_MEDIA_TYPE.AVATAR);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on channel chip
    if (!(e.target as HTMLElement).closest('.channel-chip')) {
      navigate(`/app/news/${news.id}`);
    }
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        p: 2,
        cursor: 'pointer',
        '&:hover': { 
          bgcolor: 'action.hover',
          transform: 'translateY(-2px)',
        },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={handleCardClick}
    >
      <Avatar
        variant="rounded"
        src={avatarMedia?.url || DefaultNewsAvatar}
        alt={news.title}
        sx={{ 
          width: 120, 
          height: 120, 
          mr: 2,
          borderRadius: 2
        }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Link 
              component={RouterLink} 
              to={`/app/news/${news.id}`}
              sx={{ 
                textDecoration: 'none',
                color: 'text.primary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              <Typography variant="h6" component="div">
                {news.title}
              </Typography>
            </Link>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {news.content}
          </Typography>

          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center" 
            sx={{ mb: 2 }}
          >
            <Chip
              className="channel-chip"
              label={news.channel.name}
              size="small"
              variant="outlined"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/app/channels/${news.channel.id}`);
              }}
              sx={{ 
                borderRadius: 1,
                '& .MuiChip-label': { px: 1 }
              }}
            />
            <Typography variant="caption" color="text.secondary">
              by {news.creator?.displayName ?? 'Unknown'}
            </Typography>
          </Stack>

          <NewsEntryStats news={news} />
        </CardContent>
      </Box>
    </Card>
  );
};

export default NewsEntry; 