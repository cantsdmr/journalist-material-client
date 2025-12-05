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
  Avatar
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { News } from '@/types/entities/News';
import { NEWS_STATUS } from '@/enums/NewsEnums';
import { PaginatedResponse } from '@/utils/http';
import { PATHS } from '@/constants/paths';

const NewsAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [news, setNews] = useState<News[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        sort: sortColumn,
        order: sortDirection,
      };

      const result = await execute(
        () => api.admin.news.getAllNews(params),
        { showErrorToast: false }
      ) as PaginatedResponse<any>;

      if (result) {
        setNews(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [page, rowsPerPage, searchQuery, statusFilter, sortColumn, sortDirection]);

  const handleEdit = (newsItem: News) => {
    setSelectedNews(newsItem);
    setEditDialogOpen(true);
  };

  const handleDelete = async (newsItems: News[]) => {
    const ids = newsItems.map(item => item.id);
    
    try {
      await Promise.all(ids.map(id => 
        execute(() => api.app.news.delete(id))
      ));
      
      setSelected([]);
      fetchNews();
    } catch (err) {
      setError('Failed to delete news items');
    }
  };

  const handleStatusChange = async (newsItem: News, newStatus: number) => {
    try {
      await execute(() => api.app.news.update(newsItem.id, { status: newStatus.toString() as any }));
      fetchNews();
    } catch (err) {
      setError('Failed to update news status');
    }
  };

  const handleSaveEdit = async (newsData: Partial<News>) => {
    if (!selectedNews) return;

    try {
      // Convert news data to proper format for API
      const updateData = {
        title: newsData.title,
        content: newsData.content,
        status: newsData.status?.toString()
      };
      await execute(() => api.app.news.update(selectedNews.id, updateData as any));
      setEditDialogOpen(false);
      setSelectedNews(null);
      fetchNews();
    } catch (err) {
      setError('Failed to update news');
    }
  };

  const getStatusColor = (status: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
      case NEWS_STATUS.PUBLISHED: return 'success';
      case NEWS_STATUS.DRAFT: return 'default';
      case NEWS_STATUS.PENDING_REVIEW: return 'warning';
      case NEWS_STATUS.REJECTED: return 'error';
      case NEWS_STATUS.ARCHIVED: return 'secondary';
      default: return 'default';
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
          <Typography variant="caption" color="text.secondary">
            ID: {row.id}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'channel',
      label: 'Channel',
      minWidth: 150,
      format: (_value, row) => (
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
      id: 'status',
      label: 'Status',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
        />
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
    {
      id: 'views',
      label: 'Views',
      minWidth: 80,
      align: 'right',
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value?.toLocaleString() || '0'}
        </Typography>
      ),
    },
  ];

  const statusOptions = Object.entries(NEWS_STATUS).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  const filters = (
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
  );

  const rowActions = (row: News) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            window.open(PATHS.APP_NEWS_VIEW.replace(':id', row.id), '_blank');
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

      {row.status === NEWS_STATUS.PUBLISHED ? (
        <Tooltip title="Unpublish">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(row, NEWS_STATUS.DRAFT);
            }}
          >
            <UnpublishIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Publish">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange(row, NEWS_STATUS.PUBLISHED);
            }}
          >
            <PublishIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="News Management"
        columns={columns}
        rows={news}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchNews}
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
        <DialogTitle>Edit News</DialogTitle>
        <DialogContent>
          {selectedNews && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                defaultValue={selectedNews.title}
                onChange={(e) => setSelectedNews({ ...selectedNews, title: e.target.value })}
              />
              
              <TextField
                label="Content"
                fullWidth
                multiline
                rows={3}
                defaultValue={selectedNews.content}
                onChange={(e) => setSelectedNews({ ...selectedNews, content: e.target.value })}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedNews.status}
                  label="Status"
                  onChange={(e) => setSelectedNews({ ...selectedNews, status: parseInt(e.target.value.toString()) })}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  News ID: {selectedNews.id}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {new Date(selectedNews.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Channel: {selectedNews.channel?.name}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveEdit(selectedNews!)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsAdmin;