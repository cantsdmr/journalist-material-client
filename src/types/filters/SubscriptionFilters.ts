export type SubscriptionFilters = {
  status?: 'active' | 'canceled' | 'expired' | 'suspended';
  channel_id?: string;
  user_id?: string;
  tier_id?: string;
  start_date?: string;
  end_date?: string;
}; 