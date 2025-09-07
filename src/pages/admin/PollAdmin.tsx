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
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Poll as PollIcon,
  TrendingUp as TrendingIcon,
  MonetizationOn as FundedIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as ConvertIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Poll } from '@/types/entities/Poll';
import { DEFAULT_PAGINATION, PaginatedResponse } from '@/utils/http';
import { POLL_STATUS } from '@/enums/PollEnums';

const PollAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [trendingFilter, setTrendingFilter] = useState<string>('');
  const [fundedFilter, setFundedFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (statusFilter) filters.status = statusFilter;
      if (trendingFilter === 'true') filters.trending = true;
      if (fundedFilter === 'true') filters.funded = true;

      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sort: sortColumn,
        order: sortDirection,
        ...filters
      };

      const result = await execute(
        () => api.pollApi.getPolls(filters, { page: page + 1, limit: rowsPerPage }),
        { showErrorToast: false }
      )as PaginatedResponse<any>;

      if (result) {
        setPolls(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [page, rowsPerPage, searchQuery, statusFilter, trendingFilter, fundedFilter, sortColumn, sortDirection]);

  const handleEdit = (poll: Poll) => {
    setSelectedPoll(poll);
    setEditDialogOpen(true);
  };

  const handleDelete = async (polls: Poll[]) => {
    const ids = polls.map(item => item.id);
    
    try {
      await Promise.all(ids.map(id => 
        execute(() => api.pollApi.delete(id))
      ));
      
      setSelected([]);
      fetchPolls();
    } catch (err) {
      setError('Failed to delete polls');
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedPoll) return;

    try {
      // Convert Poll data to UpdatePollData format
      const updateData = {
        title: selectedPoll.title,
        description: selectedPoll.description,
        endDate: selectedPoll.endDate
      };
      await execute(() => api.pollApi.update(selectedPoll.id, updateData));
      setEditDialogOpen(false);
      setSelectedPoll(null);
      fetchPolls();
    } catch (err) {
      setError('Failed to update poll');
    }
  };

  const handleConvertToNews = async (poll: Poll) => {
    try {
      await execute(() => api.pollApi.convertToNews(poll.id, {
        title: poll.title,
        summary: poll.description
      }));
      fetchPolls();
    } catch (err) {
      setError('Failed to convert poll to news');
    }
  };

  const getStatusColor = (statusId: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (statusId) {
      case POLL_STATUS.ACTIVE: return 'success';
      case POLL_STATUS.INACTIVE: return 'default';
      case POLL_STATUS.COMPLETED: return 'info';
      case POLL_STATUS.CANCELLED: return 'error';
      default: return 'default';
    }
  };

  const getStatusName = (statusId: number): string => {
    switch (statusId) {
      case POLL_STATUS.ACTIVE: return 'Active';
      case POLL_STATUS.INACTIVE: return 'Inactive';
      case POLL_STATUS.COMPLETED: return 'Completed';
      case POLL_STATUS.CANCELLED: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const columns: Column[] = [
    {
      id: 'title',
      label: 'Title',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Typography variant="body2" fontWeight="medium" noWrap>
            {value}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              ID: {row.id}
            </Typography>
            {row.isTrending && (
              <Chip
                label="Trending"
                color="warning"
                size="small"
                icon={<TrendingIcon />}
                sx={{ height: 16, '& .MuiChip-label': { fontSize: '0.6rem', px: 0.5 } }}
              />
            )}
          </Stack>
        </Box>
      ),
    },
    {
      id: 'channel',
      label: 'Channel',
      minWidth: 150,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar src={row.channel?.photoUrl} sx={{ width: 24, height: 24 }}>
            {row.channel?.name?.[0]}
          </Avatar>
          <Typography variant="body2" noWrap>
            {row.channel?.name || 'Unknown'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'creator',
      label: 'Creator',
      minWidth: 120,
      format: (value, row) => (
        <Typography variant="body2" noWrap>
          {row.creator?.displayName || 'Unknown'}
        </Typography>
      ),
    },
    {
      id: 'voteCount',
      label: 'Votes',
      minWidth: 80,
      align: 'right',
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value?.toLocaleString() || '0'}
        </Typography>
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      minWidth: 120,
      format: (value, row) => (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Views: {row.stats?.viewCount?.toLocaleString() || '0'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Funds: ${row.stats?.totalFunds?.toLocaleString() || '0'}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'endDate',
      label: 'End Date',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : 'No end date'}
        </Typography>
      ),
    },
    {
      id: 'created_at',
      label: 'Created',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {new Date(value).toLocaleDateString()}
        </Typography>
      ),
    },
  ];

  const statusOptions = Object.entries(POLL_STATUS).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

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
        <InputLabel>Funded</InputLabel>
        <Select
          value={fundedFilter}
          label="Funded"
          onChange={(e) => setFundedFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Funded Only</MenuItem>
          <MenuItem value="false">Not Funded</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const rowActions = (row: Poll) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            window.open(`/polls/${row.id}`, '_blank');
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

      <Tooltip title="Convert to News">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleConvertToNews(row);
          }}
        >
          <ConvertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="Poll Management"
        columns={columns}
        rows={polls}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchPolls}
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
        <DialogTitle>Edit Poll</DialogTitle>
        <DialogContent>
          {selectedPoll && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                defaultValue={selectedPoll.title}
                onChange={(e) => setSelectedPoll({ ...selectedPoll, title: e.target.value })}
              />
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                defaultValue={selectedPoll.description}
                onChange={(e) => setSelectedPoll({ ...selectedPoll, description: e.target.value })}
              />

              <TextField
                label="End Date"
                type="datetime-local"
                fullWidth
                defaultValue={selectedPoll.endDate ? new Date(selectedPoll.endDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setSelectedPoll({ ...selectedPoll, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Poll Options ({selectedPoll.options?.length || 0})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    {selectedPoll.options?.map((option, index) => (
                      <Box key={option.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="body2" fontWeight="medium">
                          Option {index + 1}: {option.text}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Votes: {option.voteCount}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Poll ID: {selectedPoll.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {new Date(selectedPoll.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Channel: {selectedPoll.channel?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Creator: {selectedPoll.creator?.displayName}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveEdit()} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PollAdmin;