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
  Card,
  CardContent,
  Grid,
  Alert,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  TrendingUp as TrendingIcon,
  Verified as VerifiedIcon,
  Tag as TagIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { Tag } from '@/types/entities/Tag';
import { PaginatedResponse } from '@/utils/http';

const TagAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [tags, setTags] = useState<Tag[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('');
  const [trendingFilter, setTrendingFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchTags = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters: any = {};
      
      if (searchQuery) filters.search = searchQuery;
      if (statusFilter) filters.status = statusFilter;
      if (typeFilter) filters.type = typeFilter;
      if (verifiedFilter === 'true') filters.verified = true;
      if (trendingFilter === 'true') filters.trending = true;

      const result = await execute(
        () => api.tagApi.getTags(filters, { page: page + 1, limit: rowsPerPage }),
        { showErrorToast: false }
      )as PaginatedResponse<any>;

      if (result) {
        setTags(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [page, rowsPerPage, searchQuery, statusFilter, typeFilter, verifiedFilter, trendingFilter, sortColumn, sortDirection]);

  const handleEdit = (tag: Tag) => {
    setSelectedTag(tag);
    setEditDialogOpen(true);
  };

  const handleDelete = async (tags: Tag[]) => {
    const ids = tags.map(item => item.id);
    
    try {
      await Promise.all(ids.map(id => 
        execute(() => api.tagApi.deleteTag(id))
      ));
      
      setSelected([]);
      fetchTags();
    } catch (err) {
      setError('Failed to delete tags');
    }
  };

  const handleAction = (tag: Tag, action: 'approve' | 'reject') => {
    setSelectedTag(tag);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleActionSubmit = async () => {
    if (!selectedTag || !actionType) return;

    try {
      if (actionType === 'approve') {
        await execute(() => api.tagApi.approveTag(selectedTag.id));
      } else {
        await execute(() => api.tagApi.rejectTag(selectedTag.id));
      }
      
      setActionDialogOpen(false);
      setSelectedTag(null);
      setActionType(null);
      fetchTags();
    } catch (err) {
      setError(`Failed to ${actionType} tag`);
    }
  };

  const handleSaveEdit = async (tagData: Partial<Tag>) => {
    if (!selectedTag) return;

    try {
      await execute(() => api.tagApi.updateTag(selectedTag.id, tagData));
      setEditDialogOpen(false);
      setSelectedTag(null);
      fetchTags();
    } catch (err) {
      setError('Failed to update tag');
    }
  };

  const getStatusColor = (statusId: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (statusId) {
      case 1: return 'warning';  // Pending
      case 2: return 'success';  // Approved
      case 3: return 'error';    // Rejected
      case 4: return 'default';  // Inactive
      default: return 'default';
    }
  };

  const getStatusName = (statusId: number): string => {
    switch (statusId) {
      case 1: return 'Pending';
      case 2: return 'Approved';
      case 3: return 'Rejected';
      case 4: return 'Inactive';
      default: return 'Unknown';
    }
  };

  const getTypeColor = (typeId: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (typeId) {
      case 1: return 'primary';    // News
      case 2: return 'secondary';  // Poll
      case 3: return 'info';       // Channel
      case 4: return 'success';    // General
      default: return 'default';
    }
  };

  const getTypeName = (typeId: number): string => {
    switch (typeId) {
      case 1: return 'News';
      case 2: return 'Poll';
      case 3: return 'Channel';
      case 4: return 'General';
      default: return 'Unknown';
    }
  };

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Tag',
      minWidth: 180,
      sortable: true,
      format: (value, row) => (
        <Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <TagIcon fontSize="small" color="action" />
            <Typography variant="body2" fontWeight="medium">
              {value}
            </Typography>
            {row.isVerified && <VerifiedIcon fontSize="small" color="primary" />}
            {row.isTrending && <TrendingIcon fontSize="small" color="warning" />}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            @{row.slug} • ID: {row.id}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'typeId',
      label: 'Type',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          label={getTypeName(value)}
          color={getTypeColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'statusId',
      label: 'Status',
      minWidth: 100,
      sortable: true,
      format: (value) => (
        <Chip
          label={getStatusName(value)}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      minWidth: 150,
      format: (_value, row) => (
        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            Views: {row.analytics?.viewCount?.toLocaleString() || '0'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Usage: {row.analytics?.usageCount?.toLocaleString() || '0'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Searches: {row.analytics?.searchCount?.toLocaleString() || '0'}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'createdBy',
      label: 'Created By',
      minWidth: 120,
      format: (value) => (
        <Typography variant="body2">
          {value || 'System'}
        </Typography>
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
      id: 'approvedAt',
      label: 'Approved',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
  ];

  const statusOptions = [
    { value: 1, label: 'Pending' },
    { value: 2, label: 'Approved' },
    { value: 3, label: 'Rejected' },
    { value: 4, label: 'Inactive' }
  ];

  const typeOptions = [
    { value: 1, label: 'News' },
    { value: 2, label: 'Poll' },
    { value: 3, label: 'Channel' },
    { value: 4, label: 'General' }
  ];

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
        <InputLabel>Type</InputLabel>
        <Select
          value={typeFilter}
          label="Type"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value="">All Types</MenuItem>
          {typeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
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

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Trending</InputLabel>
        <Select
          value={trendingFilter}
          label="Trending"
          onChange={(e) => setTrendingFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="true">Trending Only</MenuItem>
          <MenuItem value="false">Not Trending</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  const rowActions = (row: Tag) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(row);
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

      {row.statusId === 1 && ( // Pending
        <>
          <Tooltip title="Approve">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'approve');
              }}
            >
              <ApproveIcon fontSize="small" color="success" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Reject">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAction(row, 'reject');
              }}
            >
              <RejectIcon fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </>
      )}

      <Tooltip title="View Analytics">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            // Open analytics dialog
          }}
        >
          <AnalyticsIcon fontSize="small" color="info" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="Tag Management"
        columns={columns}
        rows={tags}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchTags}
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
        actions={
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={() => {
              // Open tag suggestions/search dialog
            }}
          >
            Suggestions
          </Button>
        }
      />

      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogContent>
          {selectedTag && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Tag Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Tag Name"
                        fullWidth
                        defaultValue={selectedTag.name}
                        onChange={(e) => setSelectedTag({ ...selectedTag, name: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Slug"
                        fullWidth
                        defaultValue={selectedTag.slug}
                        onChange={(e) => setSelectedTag({ ...selectedTag, slug: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={selectedTag.typeId}
                          label="Type"
                          onChange={(e) => setSelectedTag({ ...selectedTag, typeId: e.target.value as number })}
                        >
                          {typeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={selectedTag.statusId}
                          label="Status"
                          onChange={(e) => setSelectedTag({ ...selectedTag, statusId: e.target.value as number })}
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Tag Properties</Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedTag.isVerified}
                          onChange={(e) => setSelectedTag({ ...selectedTag, isVerified: e.target.checked })}
                        />
                      }
                      label="Verified Tag"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={selectedTag.isTrending}
                          onChange={(e) => setSelectedTag({ ...selectedTag, isTrending: e.target.checked })}
                        />
                      }
                      label="Trending Tag"
                    />
                  </Stack>
                </CardContent>
              </Card>

              {selectedTag.analytics && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Analytics</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">View Count</Typography>
                        <Typography variant="h6">
                          {selectedTag.analytics.viewCount?.toLocaleString() || '0'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">Usage Count</Typography>
                        <Typography variant="h6">
                          {selectedTag.analytics.usageCount?.toLocaleString() || '0'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2" color="text.secondary">Search Count</Typography>
                        <Typography variant="h6">
                          {selectedTag.analytics.searchCount?.toLocaleString() || '0'}
                        </Typography>
                      </Grid>
                    </Grid>
                    {selectedTag.analytics.lastTrendingAt && (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Last trending: {new Date(selectedTag.analytics.lastTrendingAt).toLocaleString()}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>System Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Tag ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedTag.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created By</Typography>
                      <Typography variant="body2">
                        {selectedTag.createdBy || 'System'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {new Date(selectedTag.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Approved</Typography>
                      <Typography variant="body2">
                        {selectedTag.approvedAt 
                          ? `${new Date(selectedTag.approvedAt).toLocaleString()} by ${selectedTag.approvedBy || 'System'}`
                          : 'Not approved'
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveEdit(selectedTag!)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'approve' && 'Approve Tag'}
          {actionType === 'reject' && 'Reject Tag'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {selectedTag && (
              <Alert severity={actionType === 'approve' ? 'success' : 'warning'}>
                {actionType === 'approve' && `Approving tag "${selectedTag.name}"`}
                {actionType === 'reject' && `Rejecting tag "${selectedTag.name}"`}
              </Alert>
            )}
            <Typography variant="body2" color="text.secondary">
              {actionType === 'approve' 
                ? 'This tag will be made available for use across the platform.'
                : 'This tag will be rejected and won\'t be available for use.'
              }
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleActionSubmit} 
            variant="contained"
            color={actionType === 'approve' ? 'success' : 'error'}
          >
            {actionType === 'approve' && 'Approve'}
            {actionType === 'reject' && 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TagAdmin;