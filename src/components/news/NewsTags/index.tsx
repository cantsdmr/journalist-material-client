import React, { useEffect, useState } from 'react';
import { 
  Box,
  Chip,
  IconButton,
  useTheme
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { NewsTag } from '@/types/index';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';

const SCROLL_AMOUNT = 200;

interface NewsTagsProps {
  selectedTag: string;
  onTagSelect: (tagId: string) => void;
}

const NewsTags: React.FC<NewsTagsProps> = ({ selectedTag, onTagSelect }) => {
  const [newsTags, setNewsTags] = useState<NewsTag[]>([]);
  const { api } = useApiContext();
  const { execute } = useApiCall();
  const theme = useTheme();
  const tagsContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (tagsContainerRef.current) {
      const container = tagsContainerRef.current;
      const scrollAmount = direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchTags = async () => {
    const result = await execute(
      () => api?.tagApi.getNewsTags(),
      { showErrorToast: true }
    );
    
    if (result?.items) {
      setNewsTags([
        { id: 'all', tagId: 'all', title: 'All' },
        ...result.items
      ]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [api?.newsApi != null]);

  return (
    <Box sx={{ 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center',
      mt: 2,
      mb: 3,
      bgcolor: theme.palette.background.paper,
      borderBottom: 1,
      borderColor: 'divider',
      pb: 2
    }}>
      <IconButton 
        onClick={() => handleScroll('left')}
        sx={{ 
          position: 'sticky', 
          left: 0,
          zIndex: 1,
          bgcolor: theme.palette.background.paper,
          '&:hover': { bgcolor: theme.palette.action.hover }
        }}
      >
        <KeyboardArrowLeftIcon />
      </IconButton>

      <Box
        ref={tagsContainerRef}
        sx={{
          display: 'flex',
          gap: 1,
          overflowX: 'hidden',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          px: 2
        }}
      >
        {newsTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.title}
            onClick={() => onTagSelect(tag.id)}
            variant={selectedTag === tag.id ? 'filled' : 'outlined'}
            color={selectedTag === tag.id ? 'primary' : 'default'}
            sx={{ 
              borderRadius: '16px',
              '&:hover': { bgcolor: theme.palette.action.hover }
            }}
          />
        ))}
      </Box>

      <IconButton 
        onClick={() => handleScroll('right')}
        sx={{ 
          position: 'sticky', 
          right: 0,
          zIndex: 1,
          bgcolor: theme.palette.background.paper,
          '&:hover': { bgcolor: theme.palette.action.hover }
        }}
      >
        <KeyboardArrowRightIcon />
      </IconButton>
    </Box>
  );
};

export default NewsTags; 