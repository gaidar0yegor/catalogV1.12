import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { catalogApi } from '../../api/api';
import type { Catalog, ColumnMapping } from '../../types';

export default function CatalogImportConfirm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Fetch catalog details
  const { data: catalog, isLoading: catalogLoading } = useQuery({
    queryKey: ['catalog', id],
    queryFn: () => catalogApi.getById(Number(id)),
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: () => catalogApi.import(Number(id)),
    onSuccess: () => {
      navigate('/catalogs');
    },
    onError: (error: Error) => {
      setError(error.message || 'Error importing catalog');
    },
  });

  const handleImport = () => {
    importMutation.mutate();
  };

  if (catalogLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!catalog?.data) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">Catalog not found</Alert>
      </Box>
    );
  }

  const { data: catalogData } = catalog;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Import Confirmation - {catalogData.name}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Catalog Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Name</Typography>
                <Typography>{catalogData.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Source Type</Typography>
                <Typography>{catalogData.source_type}</Typography>
              </Grid>
              {catalogData.description && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description</Typography>
                  <Typography>{catalogData.description}</Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Column Mappings
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Source Column</TableCell>
                      <TableCell>Target Column</TableCell>
                      <TableCell>Transformation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {catalogData.column_mappings.map((mapping: ColumnMapping, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{mapping.source_column}</TableCell>
                        <TableCell>{mapping.target_column}</TableCell>
                        <TableCell>
                          {mapping.transformation_rule
                            ? mapping.transformation_rule.type.charAt(0).toUpperCase() +
                              mapping.transformation_rule.type.slice(1)
                            : 'None'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {error && (
                <Box sx={{ mt: 2 }}>
                  <Alert severity="error">{error}</Alert>
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/catalogs/${id}/mapping`)}
                >
                  Back to Mapping
                </Button>
                <Button
                  variant="contained"
                  onClick={handleImport}
                  disabled={importMutation.status === 'pending'}
                  startIcon={
                    importMutation.status === 'pending' ? (
                      <CircularProgress size={20} />
                    ) : undefined
                  }
                >
                  Import Catalog
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
