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
  Grid
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Security as SecurityIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Add as AddIcon,
  VpnKey as ClaimsIcon
} from '@mui/icons-material';
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';
import AdminTable, { Column } from '@/components/admin/AdminTable';
import { User } from '@/types/entities/User';
import { PaginatedResponse } from '@/utils/http';
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
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [customClaimsDialogOpen, setCustomClaimsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // New user registration state
  const [newUser, setNewUser] = useState({
    email: '',
    externalId: '',
    displayName: '',
    photoUrl: '',
    roleId: USER_ROLE.REGULAR_USER,
    statusId: USER_STATUS.ACTIVE
  });

  // Custom claims state
  const [customClaims, setCustomClaims] = useState({
    system_role: USER_ROLE.REGULAR_USER,
    system_status: USER_STATUS.ACTIVE
  });
  
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
        () => api.admin.users.getAllUsers(params),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchQuery, statusFilter, roleFilter, sortColumn, sortDirection]);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = async (users: User[]) => {
    const ids = users.map(item => item.id);
    
    try {
      await Promise.all(ids.map(id =>
        execute(() => api.admin.users.deleteUser(id))
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
      await execute(
        () => api.admin.users.updateUser(selectedUser.id, userData),
        {
          showSuccessMessage: true,
          successMessage: 'User updated successfully'
        }
      );
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleRegisterUser = async () => {
    try {
      await execute(
        () => api.admin.users.registerUser(newUser),
        {
          showSuccessMessage: true,
          successMessage: 'User registered successfully'
        }
      );
      setRegisterDialogOpen(false);
      setNewUser({
        email: '',
        externalId: '',
        displayName: '',
        photoUrl: '',
        roleId: USER_ROLE.REGULAR_USER,
        statusId: USER_STATUS.ACTIVE
      });
      fetchUsers();
    } catch (err) {
      setError('Failed to register user');
    }
  };

  const handleSuspendUser = async (userId: string, reason?: string) => {
    try {
      await execute(
        () => api.admin.users.suspendUser(userId, { reason }),
        {
          showSuccessMessage: true,
          successMessage: 'User suspended successfully'
        }
      );
      fetchUsers();
    } catch (err) {
      setError('Failed to suspend user');
    }
  };

  const handleUnsuspendUser = async (userId: string, reason?: string) => {
    try {
      await execute(
        () => api.admin.users.unsuspendUser(userId, { reason }),
        {
          showSuccessMessage: true,
          successMessage: 'User unsuspended successfully'
        }
      );
      fetchUsers();
    } catch (err) {
      setError('Failed to unsuspend user');
    }
  };

  const handleUpdateCustomClaims = async () => {
    if (!selectedUser) return;

    try {
      await execute(
        () => api.admin.users.updateUserCustomClaims(selectedUser.id, customClaims),
        {
          showSuccessMessage: true,
          successMessage: 'Custom claims updated successfully'
        }
      );
      setCustomClaimsDialogOpen(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to update custom claims');
    }
  };

  const handleOpenCustomClaims = (user: User) => {
    setSelectedUser(user);
    setCustomClaims({
      system_role: user.roleId,
      system_status: user.statusId
    });
    setCustomClaimsDialogOpen(true);
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

      <Tooltip title="Update Custom Claims">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenCustomClaims(row);
          }}
        >
          <ClaimsIcon fontSize="small" color="info" />
        </IconButton>
      </Tooltip>

      {row.statusId !== USER_STATUS.SUSPENDED && row.statusId !== USER_STATUS.BANNED && (
        <Tooltip title="Suspend User">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSuspendUser(row.id);
            }}
          >
            <BlockIcon fontSize="small" color="warning" />
          </IconButton>
        </Tooltip>
      )}

      {(row.statusId === USER_STATUS.SUSPENDED) && (
        <Tooltip title="Unsuspend User">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleUnsuspendUser(row.id);
            }}
          >
            <ActivateIcon fontSize="small" color="success" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  const toolbarActions = (
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setRegisterDialogOpen(true)}
    >
      Register User
    </Button>
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
        toolbarActions={toolbarActions}
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
                        value={selectedUser.displayName || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, displayName: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        fullWidth
                        value={selectedUser.email || ''}
                        onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Photo URL"
                        fullWidth
                        value={selectedUser.photoUrl || ''}
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

      {/* Register User Dialog */}
      <Dialog
        open={registerDialogOpen}
        onClose={() => setRegisterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Register New User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              label="External ID (Firebase UID)"
              fullWidth
              required
              value={newUser.externalId}
              onChange={(e) => setNewUser({ ...newUser, externalId: e.target.value })}
              helperText="The Firebase authentication UID for this user"
            />
            <TextField
              label="Display Name"
              fullWidth
              required
              value={newUser.displayName}
              onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
            />
            <TextField
              label="Photo URL"
              fullWidth
              value={newUser.photoUrl}
              onChange={(e) => setNewUser({ ...newUser, photoUrl: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={newUser.roleId}
                label="Role"
                onChange={(e) => setNewUser({ ...newUser, roleId: e.target.value as number })}
              >
                {roleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newUser.statusId}
                label="Status"
                onChange={(e) => setNewUser({ ...newUser, statusId: e.target.value as number })}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRegisterUser}
            variant="contained"
            disabled={!newUser.email || !newUser.externalId || !newUser.displayName}
          >
            Register User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Custom Claims Dialog */}
      <Dialog
        open={customClaimsDialogOpen}
        onClose={() => setCustomClaimsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Firebase Custom Claims</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Update Firebase custom claims for: <strong>{selectedUser.displayName}</strong> ({selectedUser.email})
              </Typography>

              <FormControl fullWidth>
                <InputLabel>System Role</InputLabel>
                <Select
                  value={customClaims.system_role}
                  label="System Role"
                  onChange={(e) => setCustomClaims({ ...customClaims, system_role: e.target.value as number })}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>System Status</InputLabel>
                <Select
                  value={customClaims.system_status}
                  label="System Status"
                  onChange={(e) => setCustomClaims({ ...customClaims, system_status: e.target.value as number })}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="caption" color="warning.main">
                Warning: This will update the user's Firebase authentication custom claims.
                The user may need to re-authenticate for changes to take effect.
              </Typography>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomClaimsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdateCustomClaims}
            variant="contained"
            color="warning"
          >
            Update Claims
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserAdmin;