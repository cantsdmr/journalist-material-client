import { useState, useEffect, useCallback } from 'react';
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
import { useApiCall } from '@/hooks/useApiCall';
import { useApiContext } from '@/contexts/ApiContext';
import { Channel, EditChannelData } from '@/types/index';

const TABS = [
  { id: 'basic', label: 'Basic Info', component: BasicInfoTab },
  { id: 'tiers', label: 'Channel Tiers', component: TiersTab }
] as const;

type TabId = typeof TABS[number]['id'];

const EditChannel = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { api } = useApiContext();

  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { execute: fetchChannel } = useApiCall<Channel>();
  const { execute: executeUpdate } = useApiCall<void>();

  const loadChannel = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    const result = await fetchChannel(
      () => api?.channelApi.getChannel(id),
      { showErrorToast: true }
    );

    if (result) {
      setChannel(result);
    }
    setIsLoading(false);
  }, [id, fetchChannel, api]);

  useEffect(() => {
    loadChannel();
  }, [loadChannel]);

  const updateChannel = async (data: EditChannelData) => {
    if (!id) return;

    await executeUpdate(
      () => api?.channelApi.updateChannel(id, data),
      {
        showSuccessMessage: true,
        successMessage: 'Channel updated successfully'
      }
    );

    await loadChannel();
  };

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