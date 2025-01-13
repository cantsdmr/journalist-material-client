import React from 'react';
import { Card, CardContent, CardProps, SxProps, Theme } from '@mui/material';
import { alpha } from '@mui/material/styles';

interface JCardProps extends Omit<CardProps, 'elevation'> {
  isHighlighted?: boolean;
  contentPadding?: number;
  noHover?: boolean;
  contentSx?: SxProps<Theme>;
}

const JCard: React.FC<JCardProps> = ({ 
  children, 
  isHighlighted = false,
  contentPadding = 3,
  noHover = false,
  contentSx,
  sx,
  ...props 
}) => {
  return (
    <Card 
      elevation={isHighlighted ? 2 : 0}
      sx={{ 
        height: '100%',
        position: 'relative',
        borderRadius: 2,
        border: '1px solid',
        borderColor: (theme) => 
          isHighlighted 
            ? 'primary.main'
            : theme.palette.mode === 'dark'
              ? alpha(theme.palette.common.white, 0.1)
              : alpha(theme.palette.common.black, 0.08),
        bgcolor: (theme) =>
          isHighlighted
            ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.1 : 0.05)
            : 'background.paper',
        transition: 'all 0.2s ease-in-out',
        ...(!noHover && {
          '&:hover': {
            borderColor: 'primary.main',
            transform: 'translateY(-2px)'
          }
        }),
        ...sx
      }}
      {...props}
    >
      <CardContent sx={{ 
        p: contentPadding,
        '&:last-child': { pb: contentPadding },
        ...contentSx 
      }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default JCard; 