import { MobileNavigation } from './MobileNavigation';
import { DesktopNavigation } from './DesktopNavigation';
import { Channel, EditChannelData } from '@/APIs/ChannelAPI'

export interface TabConfig {
  readonly id: string;
  readonly label: string;
  readonly component: React.FC<{
    channel: Channel;
    onUpdate: (data: EditChannelData) => Promise<void>;
  }>;
}

export type TabConfigArray = readonly TabConfig[];

export { MobileNavigation, DesktopNavigation };