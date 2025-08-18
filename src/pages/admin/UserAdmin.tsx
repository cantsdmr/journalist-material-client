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
  Card,
  CardContent,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { User } from '@/types/entities/User';
import { DEFAULT_PAGINATION, PaginatedResponse } from '@/utils/http';
import { USER_ROLE, USER_STATUS } from '@/enums/UserEnums';

const UserAdmin: React.FC = () => {
  const { api } = useApiContext();
  const { execute } = useApiCall();
  
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Filters and pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [sortColumn, setSortColumn] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sort: sortColumn,
        order: sortDirection,
        search: searchQuery || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined
      };

      const result = await execute(
        () => api.userApi.getAll({ page: page + 1, limit: rowsPerPage }),
        { showErrorToast: false }
      ) as PaginatedResponse<any>;

      if (result) {
        setUsers(result.items || []);
        setTotalCount(result.metadata?.total || 0);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchQuery, statusFilter, roleFilter, sortColumn, sortDirection]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = async (users: User[]) => {
    const ids = users.map(item => item.id);
    
    try {
      await Promise.all(ids.map(id => 
        execute(() => api.userApi.delete(id))
      ));
      
      setSelected([]);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete users');
    }
  };

  const handleSaveEdit = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await execute(() => api.userApi.update(selectedUser.id, userData));
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const getRoleColor = (roleId: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (roleId) {
      case USER_ROLE.SUPER_ADMIN: return 'error';
      case USER_ROLE.ADMIN: return 'error';
      case USER_ROLE.MODERATOR: return 'warning';
      case USER_ROLE.JOURNALIST: return 'primary';
      case USER_ROLE.EDITOR: return 'info';
      case USER_ROLE.EVALUATOR: return 'secondary';
      case USER_ROLE.FINANCE_MANAGER: return 'success';
      case USER_ROLE.REGULAR_USER: return 'default';
      case USER_ROLE.GUEST: return 'default';
      default: return 'default';
    }
  };

  const getRoleName = (roleId: number): string => {
    const roleEntry = Object.entries(USER_ROLE).find(([, id]) => id === roleId);
    return roleEntry ? roleEntry[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
  };

  const getStatusColor = (statusId: number): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (statusId) {
      case USER_STATUS.ACTIVE: return 'success';
      case USER_STATUS.INACTIVE: return 'default';
      case USER_STATUS.PENDING: return 'warning';
      case USER_STATUS.BLOCKED: return 'error';
      case USER_STATUS.SUSPENDED: return 'warning';
      case USER_STATUS.BANNED: return 'error';
      case USER_STATUS.DELETED: return 'secondary';
      case USER_STATUS.NOT_VERIFIED: return 'info';
      default: return 'default';
    }
  };

  const getStatusName = (statusId: number): string => {
    const statusEntry = Object.entries(USER_STATUS).find(([, id]) => id === statusId);
    return statusEntry ? statusEntry[0].replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
  };

  const columns: Column[] = [
    {
      id: 'displayName',
      label: 'User',
      minWidth: 200,
      sortable: true,
      format: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={row.photoUrl}
            sx={{ width: 40, height: 40 }}
          >
            {value?.[0] || row.email?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium" noWrap>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'roleId',
      label: 'Role',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          label={getRoleName(value)}
          color={getRoleColor(value)}
          size="small"
          icon={
            value === USER_ROLE.SUPER_ADMIN || value === USER_ROLE.ADMIN ? 
            <AdminIcon fontSize="small" /> : 
            value === USER_ROLE.JOURNALIST || value === USER_ROLE.EDITOR ? 
            <SecurityIcon fontSize="small" /> : 
            <UserIcon fontSize="small" />
          }
        />
      ),
    },
    {
      id: 'statusId',
      label: 'Status',
      minWidth: 120,
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
      id: 'lastLogin',
      label: 'Last Login',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Typography variant="body2">
          {value ? new Date(value).toLocaleDateString() : 'Never'}
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

  const statusOptions = Object.entries(USER_STATUS).map(([key, value]) => ({
    value: value,
    label: key.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }));

  const roleOptions = Object.entries(USER_ROLE).map(([key, value]) => ({
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
        <InputLabel>Role</InputLabel>
        <Select
          value={roleFilter}
          label="Role"
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <MenuItem value="">All Roles</MenuItem>
          {roleOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );

  const rowActions = (row: User) => (
    <Stack direction="row" spacing={0.5}>
      <Tooltip title="View/Edit">
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

      {row.statusId === USER_STATUS.ACTIVE && (
        <Tooltip title="Block User">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Handle block user
            }}
          >
            <BlockIcon fontSize="small" color="warning" />
          </IconButton>
        </Tooltip>
      )}

      {(row.statusId === USER_STATUS.BLOCKED || row.statusId === USER_STATUS.SUSPENDED) && (
        <Tooltip title="Activate User">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Handle activate user
            }}
          >
            <ActivateIcon fontSize="small" color="success" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <Box>
      <AdminTable
        title="User Management"
        columns={columns}
        rows={users}
        totalCount={totalCount}
        loading={loading}
        error={error}
        selected={selected}
        onSelectionChange={setSelected}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchUsers}
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
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={3} sx={{ pt: 1 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>User Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Display Name"
                        fullWidth
                        defaultValue={selectedUser.displayName}
                        onChange={(e) => setSelectedUser({ ...selectedUser, displayName: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        fullWidth
                        defaultValue={selectedUser.email}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Photo URL"
                        fullWidth
                        defaultValue={selectedUser.photoUrl}
                        onChange={(e) => setSelectedUser({ ...selectedUser, photoUrl: e.target.value })}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Role & Status</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={selectedUser.roleId}
                          label="Role"
                          onChange={(e) => setSelectedUser({ ...selectedUser, roleId: e.target.value as number })}
                        >
                          {roleOptions.map((option) => (
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
                          value={selectedUser.statusId}
                          label="Status"
                          onChange={(e) => setSelectedUser({ ...selectedUser, statusId: e.target.value as number })}
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
                  <Typography variant="h6" gutterBottom>System Information</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedUser.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">External ID</Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {selectedUser.externalId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                      <Typography variant="body2">
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Last Login</Typography>
                      <Typography variant="body2">
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastLogin).toLocaleString()
                          : 'Never'
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {selectedUser.channelSubscriptions && selectedUser.channelSubscriptions.length > 0 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Channel Subscriptions ({selectedUser.channelSubscriptions.length})
                    </Typography>
                    <Stack spacing={1}>
                      {selectedUser.channelSubscriptions.slice(0, 5).map((subscription, index) => (
                        <Box key={index} sx={{ p: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {subscription.channel?.name || 'Unknown Channel'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Status: {subscription.status} • Started: {new Date(subscription.subscribedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      ))}
                      {selectedUser.channelSubscriptions.length > 5 && (
                        <Typography variant="caption" color="text.secondary">
                          And {selectedUser.channelSubscriptions.length - 5} more...
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => handleSaveEdit(selectedUser!)} 
            variant="contained"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAdmin;