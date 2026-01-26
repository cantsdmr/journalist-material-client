import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper
} from '@mui/material';
import {
  LightMode,
  DarkMode
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';

const AppearanceSettingsTab: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [themeMode, setThemeMode] = useState(isDarkMode ? 'dark' : 'light');

  const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.value;
    setThemeMode(newMode);
    if ((newMode === 'dark' && !isDarkMode) || (newMode === 'light' && isDarkMode)) {
      toggleTheme();
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
        Appearance
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Customize how MetaJourno looks on your device
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
            Theme mode
          </FormLabel>
          <RadioGroup value={themeMode} onChange={handleThemeChange}>
            <FormControlLabel
              value="light"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightMode fontSize="small" />
                  <Box>
                    <Typography variant="body1">Light</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use light theme
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ mb: 2, p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
            />
            <FormControlLabel
              value="dark"
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DarkMode fontSize="small" />
                  <Box>
                    <Typography variant="body1">Dark</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use dark theme
                    </Typography>
                  </Box>
                </Box>
              }
              sx={{ p: 1.5, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}
            />
          </RadioGroup>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default AppearanceSettingsTab;
