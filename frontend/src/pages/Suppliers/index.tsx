import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Supplier {
  id: number;
  name: string;
  connection_type: string;
  is_active: boolean;
  last_import_at: string | null;
  error_count: number;
}

const Suppliers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

  // Fetch suppliers
  const { data, isLoading, error } = useQuery<{
    suppliers: Supplier[];
    total: number;
  }>({
    queryKey: ['suppliers', page, rowsPerPage],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        suppliers: [],
        total: 0,
      };
    },
  });

  // Delete supplier mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      // TODO: Replace with actual API call
      console.log('Deleting supplier:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setDeleteDialogOpen(false);
    },
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedSupplierId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSupplierId) {
      deleteMutation.mutate(selectedSupplierId);
    }
  };

  if (error) {
    return (
      <Typography color="error">
        Error loading suppliers: {error.toString()}
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Suppliers</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ mr: 1 }}
            onClick={() => queryClient.invalidateQueries({ queryKey: ['suppliers'] })}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/suppliers/new')}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Connection Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Import</TableCell>
              <TableCell>Errors</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No suppliers found
                </TableCell>
              </TableRow>
            ) : (
              data?.suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.connection_type}</TableCell>
                  <TableCell>
                    <Chip
                      label={supplier.is_active ? 'Active' : 'Inactive'}
                      color={supplier.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {supplier.last_import_at
                      ? new Date(supplier.last_import_at).toLocaleString()
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    {supplier.error_count > 0 ? (
                      <Chip
                        label={supplier.error_count}
                        color="error"
                        size="small"
                      />
                    ) : (
                      '0'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => navigate(`/suppliers/${supplier.id}`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(supplier.id)}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.total || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Supplier</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this supplier? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Suppliers;
