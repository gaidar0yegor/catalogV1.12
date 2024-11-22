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
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';

interface Catalog {
  id: number;
  name: string;
  supplier_id: number;
  supplier_name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  import_type: string;
  row_count: number;
  error_count: number;
  created_at: string;
  processed_at: string | null;
}

const StatusChip = ({ status }: { status: Catalog['status'] }) => {
  const statusConfig = {
    pending: { color: 'default' as const, label: 'Pending' },
    processing: { color: 'warning' as const, label: 'Processing' },
    completed: { color: 'success' as const, label: 'Completed' },
    failed: { color: 'error' as const, label: 'Failed' },
  };

  const config = statusConfig[status];
  return <Chip size="small" {...config} />;
};

const Catalogs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch catalogs
  const { data, isLoading, error } = useQuery<{
    catalogs: Catalog[];
    total: number;
  }>({
    queryKey: ['catalogs', page, rowsPerPage],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        catalogs: [],
        total: 0,
      };
    },
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return (
      <Typography color="error">
        Error loading catalogs: {error.toString()}
      </Typography>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Catalogs</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => navigate('/import')}
          >
            Import Catalog
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Rows</TableCell>
              <TableCell align="right">Errors</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Processed</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <LinearProgress />
                </TableCell>
              </TableRow>
            ) : data?.catalogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No catalogs found
                </TableCell>
              </TableRow>
            ) : (
              data?.catalogs.map((catalog) => (
                <TableRow key={catalog.id}>
                  <TableCell>{catalog.name}</TableCell>
                  <TableCell>{catalog.supplier_name}</TableCell>
                  <TableCell>
                    <StatusChip status={catalog.status} />
                  </TableCell>
                  <TableCell>{catalog.import_type}</TableCell>
                  <TableCell align="right">{catalog.row_count}</TableCell>
                  <TableCell align="right">
                    {catalog.error_count > 0 ? (
                      <Chip
                        label={catalog.error_count}
                        color="error"
                        size="small"
                      />
                    ) : (
                      '0'
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(catalog.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {catalog.processed_at
                      ? new Date(catalog.processed_at).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/catalogs/${catalog.id}`)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
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
    </Box>
  );
};

export default Catalogs;
