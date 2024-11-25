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
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  IconButton,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { catalogApi } from '../../api/api';
import type { ColumnMapping } from '../../types';

const TRANSFORMATION_TYPES = [
  { value: 'uppercase', label: 'Convert to Uppercase' },
  { value: 'lowercase', label: 'Convert to Lowercase' },
  { value: 'number', label: 'Convert to Number' },
  { value: 'boolean', label: 'Convert to Boolean' },
  { value: 'replace', label: 'Replace Text' },
];

const TARGET_COLUMNS = [
  'name',
  'description',
  'price',
  'sku',
  'category',
  'brand',
  'stock',
  'status',
];

export default function CatalogMapping() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);

  // Fetch catalog details
  const { data: catalog, isLoading } = useQuery({
    queryKey: ['catalog', id],
    queryFn: () => catalogApi.getById(Number(id)),
  });

  // Update mappings mutation
  const updateMappingsMutation = useMutation({
    mutationFn: (mappings: ColumnMapping[]) => 
      catalogApi.updateMapping(Number(id), mappings),
    onSuccess: () => {
      navigate(`/catalogs/${id}/import`);
    },
    onError: (error: Error) => {
      setError(error.message || 'Error updating mappings');
    },
  });

  // Get source columns from catalog schema
  const sourceColumns = catalog?.data?.schema 
    ? Object.keys(catalog.data.schema)
    : [];

  const handleAddMapping = () => {
    setMappings([
      ...mappings,
      {
        source_column: sourceColumns[0] || '',
        target_column: TARGET_COLUMNS[0],
        transformation_rule: null,
      },
    ]);
  };

  const handleRemoveMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const handleUpdateMapping = (
    index: number,
    field: keyof ColumnMapping,
    value: any
  ) => {
    const newMappings = [...mappings];
    newMappings[index] = {
      ...newMappings[index],
      [field]: value,
    };
    setMappings(newMappings);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (mappings.length === 0) {
      setError('Please add at least one column mapping');
      return;
    }

    updateMappingsMutation.mutate(mappings);
  };

  if (isLoading) {
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

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Map Columns - {catalog.data.name}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1">
          Map the columns from your source file to the standard catalog format.
          You can also apply transformations to the data during import.
        </Typography>
      </Paper>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              {mappings.map((mapping, index) => (
                <Grid item xs={12} key={index}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Source Column</InputLabel>
                      <Select
                        value={mapping.source_column}
                        label="Source Column"
                        onChange={(e) =>
                          handleUpdateMapping(
                            index,
                            'source_column',
                            e.target.value
                          )
                        }
                        fullWidth
                      >
                        {sourceColumns.map((column) => (
                          <MenuItem key={column} value={column}>
                            {column}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Target Column</InputLabel>
                      <Select
                        value={mapping.target_column}
                        label="Target Column"
                        onChange={(e) =>
                          handleUpdateMapping(
                            index,
                            'target_column',
                            e.target.value
                          )
                        }
                        fullWidth
                      >
                        {TARGET_COLUMNS.map((column) => (
                          <MenuItem key={column} value={column}>
                            {column}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl sx={{ flex: 1 }}>
                      <InputLabel>Transformation</InputLabel>
                      <Select
                        value={mapping.transformation_rule?.type || ''}
                        label="Transformation"
                        onChange={(e) =>
                          handleUpdateMapping(index, 'transformation_rule', {
                            type: e.target.value,
                          })
                        }
                        fullWidth
                      >
                        <MenuItem value="">None</MenuItem>
                        {TRANSFORMATION_TYPES.map((type) => (
                          <MenuItem key={type.value} value={type.value}>
                            {type.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <IconButton
                      onClick={() => handleRemoveMapping(index)}
                      color="error"
                      sx={{ mt: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}

              <Grid item xs={12}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddMapping}
                  variant="outlined"
                  fullWidth
                >
                  Add Mapping
                </Button>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/catalogs')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={updateMappingsMutation.status === 'pending'}
                    startIcon={
                      updateMappingsMutation.status === 'pending' ? (
                        <CircularProgress size={20} />
                      ) : undefined
                    }
                  >
                    Save Mappings
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}
