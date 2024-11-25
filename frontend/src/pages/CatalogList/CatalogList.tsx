import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  Typography,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { catalogApi } from '../../api/api';
import type { Catalog } from '../../types';

interface Column {
  id: 'name' | 'description' | 'sourceType' | 'createdAt' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'description', label: 'Description', minWidth: 200 },
  { id: 'sourceType', label: 'Source Type', minWidth: 100 },
  { id: 'createdAt', label: 'Created At', minWidth: 170 },
  { id: 'actions', label: 'Actions', minWidth: 100, align: 'right' },
];

export default function CatalogList() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch catalogs using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['catalogs'],
    queryFn: catalogApi.getAll,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleNewCatalog = () => {
    navigate('/import'); // Redirect to the import page for new catalog creation
  };

  const handleViewCatalog = (id: number) => {
    navigate(`/catalogs/${id}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          An error occurred while loading catalogs. Please try again later.
        </Alert>
      </Box>
    );
  }

  const catalogs = data?.data || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Catalogs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleNewCatalog}
        >
          Import Catalog
        </Button>
      </Box>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {catalogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No catalogs found. Click "Import Catalog" to add your first catalog.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                catalogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: Catalog) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell>{row.sourceType}</TableCell>
                      <TableCell>
                        {new Date(row.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          size="small"
                          onClick={() => handleViewCatalog(row.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {catalogs.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={catalogs.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  );
}
