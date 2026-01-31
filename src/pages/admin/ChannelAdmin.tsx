import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  People as SubscribersIcon,
  Article as NewsIcon,
  Poll as PollIcon,
  ExpandMore as ExpandMoreIcon,
  MonetizationOn as TierIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Channel } from '@/types/entities/Channel';
import { PaginatedResponse } from '@/utils/http';
import { PATHS } from '@/constants/paths';
import { getChannelStatusLabel, getChannelStatusColor, ChannelStatus, ALL_CHANNEL_STATUSES } from '@/enums/ChannelEnums';

const ChannelAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [channels, setChannels] = useState<Channel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [trendingFilter, setTrendingFilter] = useState<string>('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchChannels = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (statusFilter) filters.status = statusFilter;
      if (trendingFilter === 'true') filters.trending = true;
      if (verifiedFilter === 'true') filters.verified = true;

      // API call uses filters and pagination directly

      const result = await execute(
        () => api.admin.channels.getAllChannels(filters, { page: page + 1, limit: rowsPerPage }),
        { showErrorToast: false }
      ) as PaginatedResponse<any>;

      if (result) {
        setChannels(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch channels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, [page, rowsPerPage, searchQuery, statusFilter, trendingFilter, verifiedFilter, sortColumn, sortDirection]);

  const handleEdit = (channel: Channel) => {
    setSelectedChannel(channel);
    setEditDialogOpen(true);
  };

  const handleDelete = async (channels: Channel[]) => {
    const ids = channels.map(item => item.id);
    
    try {
      await Promise.all(ids.map(id => 
        execute(() => api.app.channel.deleteChannel(id))
      ));
      
      setSelected([]);
      fetchChannels();
    } catch (err) {
      setError('Failed to delete channels');
    }
  };

  const handleSaveEdit = async (channelData: Partial<Channel>) => {
    if (!selectedChannel) return;

    try {
      await execute(() => api.app.channel.updateChannel(selectedChannel.id, channelData));
      setEditDialogOpen(false);
      setSelectedChannel(null);
      fetchChannels();
    } catch (err) {
      setError('Failed to update channel');
    }
  };


  const columns: Column[] = [
    {
      id: 'name',
      label: 'Channel',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={row.logoUrl}
            sx={{ width: 40, height: 40 }}
          >
            {value?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              @{row.handle} • ID: {row.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      minWidth: 200,
      format: (value) => (
        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
          {value || 'No description'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          label={getChannelStatusLabel(value)}
          color={getChannelStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      minWidth: 150,
      format: (_value, row) => (
        <Stack spacing={0.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SubscribersIcon sx={{ fontSize: 14 }} color="action" />
            <Typography variant="caption">
              {row.stats?.activeSubscriptionCount?.toLocaleString() || '0'} subscribers
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <NewsIcon sx={{ fontSize: 14 }} color="action" />
            <Typography variant="caption">
              {row.stats?.newsCount?.toLocaleString() || '0'} news
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PollIcon sx={{ fontSize: 14 }} color="action" />
            <Typography variant="caption">
              {row.stats?.pollCount?.toLocaleString() || '0'} polls
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: 'tiers',
      label: 'Tiers',
      minWidth: 80,
      align: 'center',
      format: (_value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
          <TierIcon sx={{ fontSize: 14 }} color="action" />
          <Typography variant="body2">
            {row.stats?.tierCount || row.tiers?.length || '0'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'createdAt',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      id: 'updatedAt',
      label: 'Updated',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const statusOptions = ALL_CHANNEL_STATUSES;

  const filters = (
    <Stack direction="row" spacing={1}>
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={statusFilter}
          label="Status"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <MenuItem value="">All Status</MenuItem>
          {statusOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Trending</InputLabel>
        <Select
          value={trendingFilter}
          label="Trending"
          onChange={(e) => setTrendingFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Trending Only</MenuItem>
          <MenuItem value="false">Non-Trending</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Verified</InputLabel>
        <Select
          value={verifiedFilter}
          label="Verified"
          onChange={(e) => setVerifiedFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Verified Only</MenuItem>
          <MenuItem value="false">Not Verified</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const rowActions = (row: Channel) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            window.open(PATHS.APP_CHANNEL_VIEW.replace(':channelId', row.id), '_blank');
          }}
        >
          <ViewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Edit">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(row);
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="Channel Management"
        columns={columns}
        rows={channels}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchChannels}
        onSearch={setSearchQuery}
        onSort={(column, direction) => {
          setSortColumn(column);
          setSortDirection(direction);
        }}
        onPageChange={setPage}
        onRowsPerPageChange={setRowsPerPage}
        page={page}
        rowsPerPage={rowsPerPage}
        searchQuery={searchQuery}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        filters={filters}
        rowActions={rowActions}
      />

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Channel</DialogTitle>
        <DialogContent>
          {selectedChannel && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Channel Name"
                    fullWidth
                    defaultValue={selectedChannel.name}
                    onChange={(e) => setSelectedChannel({ ...selectedChannel, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Handle"
                    fullWidth
                    defaultValue={selectedChannel.handle}
                    onChange={(e) => setSelectedChannel({ ...selectedChannel, handle: e.target.value })}
                    InputProps={{
                      startAdornment: '@'
                    }}
                  />
                </Grid>
              </Grid>
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                defaultValue={selectedChannel.description}
                onChange={(e) => setSelectedChannel({ ...selectedChannel, description: e.target.value })}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Logo URL"
                    fullWidth
                    defaultValue={selectedChannel.logoUrl}
                    onChange={(e) => setSelectedChannel({ ...selectedChannel, logoUrl: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Banner URL"
                    fullWidth
                    defaultValue={selectedChannel.bannerUrl}
                    onChange={(e) => setSelectedChannel({ ...selectedChannel, bannerUrl: e.target.value })}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedChannel.status}
                  label="Status"
                  onChange={(e) => setSelectedChannel({ ...selectedChannel, status: e.target.value as ChannelStatus })}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedChannel.tiers && selectedChannel.tiers.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">
                      Subscription Tiers ({selectedChannel.tiers.length})
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={2}>
                      {selectedChannel.tiers.map((tier) => (
                        <Box key={tier.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2" fontWeight="medium">
                                {tier.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {tier.description}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                Price: {tier.currency} {tier.price}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Order: {tier.order} {tier.isDefault && '(Default)'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Channel ID: {selectedChannel.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Creator ID: {selectedChannel.creatorId}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {new Date(selectedChannel.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated: {new Date(selectedChannel.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveEdit(selectedChannel!)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChannelAdmin;