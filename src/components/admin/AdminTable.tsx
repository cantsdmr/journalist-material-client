import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
}

export interface AdminTableProps {
  title: string;
  columns: Column[];
  rows: any[];
  totalCount: number;
  loading?: boolean;
  error?: string | null;
  selected: string[];
  onSelectionChange: (selected: string[]) => void;
  onEdit?: (row: any) => void;
  onDelete?: (rows: any[]) => void;
  onAdd?: () => void;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  page?: number;
  rowsPerPage?: number;
  searchQuery?: string;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  actions?: React.ReactNode;
  filters?: React.ReactNode;
  rowActions?: (row: any) => React.ReactNode;
}

const AdminTable: React.FC<AdminTableProps> = ({
  title,
  columns,
  rows,
  totalCount,
  loading = false,
  error = null,
  selected,
  onSelectionChange,
  onEdit,
  onDelete,
  onAdd,
  onRefresh,
  onSearch,
  onSort,
  onPageChange,
  onRowsPerPageChange,
  page = 0,
  rowsPerPage = 25,
  searchQuery = '',
  sortColumn = '',
  sortDirection = 'asc',
  actions,
  filters,
  rowActions
}) => {
  const [searchValue, setSearchValue] = useState(searchQuery);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      onSelectionChange(newSelected);
    } else {
      onSelectionChange([]);
    }
  };

  const handleRowClick = (_event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    onSelectionChange(newSelected);
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && onSearch) {
      onSearch(searchValue);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    if (event.target.value === '' && onSearch) {
      onSearch('');
    }
  };

  const handleSort = (column: string) => {
    if (!onSort) return;
    
    const isAsc = sortColumn === column && sortDirection === 'asc';
    onSort(column, isAsc ? 'desc' : 'asc');
  };

  const handleRowMenuClick = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setRowMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRowMenuClose = () => {
    setRowMenuAnchor(null);
    setSelectedRow(null);
  };

  const handleDeleteClick = () => {
    const itemsToDelete = selected.length > 0 
      ? rows.filter(row => selected.includes(row.id))
      : selectedRow ? [selectedRow] : [];
    
    if (itemsToDelete.length > 0 && onDelete) {
      onDelete(itemsToDelete);
      setDeleteDialogOpen(false);
      handleRowMenuClose();
      onSelectionChange([]);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  return (
    <Box>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(selected.length > 0 && {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }),
          }}
        >
          {selected.length > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
              {selected.length} selected
            </Typography>
          ) : (
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
              {title}
            </Typography>
          )}

          {selected.length > 0 ? (
            <Stack direction="row" spacing={1}>
              {onDelete && (
                <Tooltip title="Delete">
                  <IconButton 
                    color="inherit"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              {onSearch && (
                <TextField
                  size="small"
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 250 }}
                />
              )}
              
              {filters}
              
              {onRefresh && (
                <Tooltip title="Refresh">
                  <IconButton onClick={onRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
              )}
              
              {onAdd && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAdd}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  Add New
                </Button>
              )}
              
              {actions}
            </Stack>
          )}
        </Toolbar>

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer>
          <Table stickyHeader aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all items' }}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sortDirection={sortColumn === column.id ? sortDirection : false}
                  >
                    {column.sortable && onSort ? (
                      <TableSortLabel
                        active={sortColumn === column.id}
                        direction={sortColumn === column.id ? sortDirection : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={24} height={24} />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Skeleton variant="rectangular" width={40} height={24} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                rows.map((row) => {
                  const isItemSelected = isSelected(row.id);
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${row.id}` }}
                        />
                      </TableCell>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format ? column.format(value, row) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {rowActions ? rowActions(row) : (
                            <>
                              {onEdit && (
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(row);
                                    }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowMenuClick(e, row);
                                }}
                              >
                                <MoreIcon fontSize="small" />
                              </IconButton>
                            </>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => onPageChange?.(newPage)}
          onRowsPerPageChange={(event) => onRowsPerPageChange?.(parseInt(event.target.value, 10))}
        />
      </Paper>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={handleRowMenuClose}
      >
        {onEdit && selectedRow && (
          <MenuItem onClick={() => { onEdit(selectedRow); handleRowMenuClose(); }}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" />
            Edit
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => setDeleteDialogOpen(true)}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selected.length > 0 ? `${selected.length} items` : 'this item'}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteClick} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTable;