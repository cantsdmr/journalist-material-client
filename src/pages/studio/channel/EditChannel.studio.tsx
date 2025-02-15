import React from 'react';
import {
  Box,
  useMediaQuery,
  useTheme,
  Typography
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { BasicInfoTab } from '@/components/studio/channel/BasicInfoTab';
import { TiersTab } from '@/components/studio/channel/TiersTab';
import { MobileNavigation, DesktopNavigation, TabConfigArray } from '@/components/studio/channel/CustomizationNav';
import { useChannel } from '@/hooks/useChannel';

const TABS = [
  { id: 'basic', label: 'Basic Info', component: BasicInfoTab },
  { id: 'tiers', label: 'Channel Tiers', component: TiersTab }
] as const;

type TabId = typeof TABS[number]['id'];

const EditChannel = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = React.useState<TabId>('basic');
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const { channel, isLoading, updateChannel } = useChannel(id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
  };

  if (!id || isLoading || !channel) return null;

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab channel={channel} onUpdate={updateChannel} />;
      case 'tiers':
        return <TiersTab channelId={channel.id} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{
      minHeight: '100%',
      bgcolor: 'background.default'
    }}>
      {isMobile ? (
        <>
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Edit Channel
            </Typography>
          </Box>

          {renderActiveComponent()}

          <MobileNavigation
            tabs={TABS as TabConfigArray}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onOpen={() => setIsDrawerOpen(true)}
          />
        </>
      ) : (
        <>
          <DesktopNavigation
            tabs={TABS as TabConfigArray}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
          <Box sx={{ p: { md: 3, lg: 4 } }}>
            {renderActiveComponent()}
          </Box>
        </>
      )}
    </Box>
  );
};

export default EditChannel; 