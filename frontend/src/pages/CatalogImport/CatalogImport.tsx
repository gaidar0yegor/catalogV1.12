import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { catalogApi } from '../../api/api';
import type { ApiResponse, Catalog } from '../../types';

export default function CatalogImport() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const uploadMutation: UseMutationResult<
    ApiResponse<Catalog>,
    Error,
    FormData
  > = useMutation({
    mutationFn: async (formData: FormData) => {
      return catalogApi.create(formData);
    },
    onSuccess: (response) => {
      // Navigate to mapping page with the new catalog ID
      navigate(`/catalogs/${response.data.id}/mapping`);
    },
    onError: (error: Error) => {
      setError(error.message || 'Error uploading catalog');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill name from filename if not already set
      if (!name) {
        setName(selectedFile.name.split('.')[0]);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    if (description) {
      formData.append('description', description);
    }

    uploadMutation.mutate(formData);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Import Catalog
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Supported Formats
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">.CSV</Typography>
                <Typography variant="body2" color="text.secondary">
                  Comma-separated values
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">.XLSX</Typography>
                <Typography variant="body2" color="text.secondary">
                  Excel spreadsheet
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="subtitle1">.JSON</Typography>
                <Typography variant="body2" color="text.secondary">
                  JSON data format
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ height: 100 }}
                >
                  {file ? file.name : 'Choose File'}
                  <input
                    type="file"
                    hidden
                    accept=".csv,.xlsx,.xls,.json"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Catalog Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
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
                    disabled={uploadMutation.status === 'pending'}
                    startIcon={
                      uploadMutation.status === 'pending' ? (
                        <CircularProgress size={20} />
                      ) : undefined
                    }
                  >
                    Upload Catalog
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
