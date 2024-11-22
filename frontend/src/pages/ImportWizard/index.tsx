import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useQuery, useMutation } from '@tanstack/react-query';

const steps = [
  'Select Supplier',
  'Upload File',
  'Map Fields',
  'Review & Import'
];

interface SupplierOption {
  id: number;
  name: string;
}

interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
}

const ImportWizard = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [detectedColumns, setDetectedColumns] = useState<string[]>([]);

  // Fetch suppliers
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery<SupplierOption[]>({
    queryKey: ['suppliers'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return [];
    },
  });

  // File upload handler
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      
      // TODO: Send file for column detection
      // For now, simulate column detection
      setTimeout(() => {
        setDetectedColumns(['id', 'name', 'price', 'description']);
      }, 1000);
    },
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
    },
    onSuccess: () => {
      navigate('/catalogs');
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFinish = () => {
    importMutation.mutate();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Supplier"
                value={selectedSupplier || ''}
                onChange={(e) => setSelectedSupplier(Number(e.target.value))}
                disabled={loadingSuppliers}
              >
                {suppliers?.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Box
            {...getRootProps()}
            sx={{
              p: 3,
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <input {...getInputProps()} />
            {uploadedFile ? (
              <Typography>Selected file: {uploadedFile.name}</Typography>
            ) : (
              <Typography>
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag and drop a file here, or click to select'}
              </Typography>
            )}
          </Box>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            {detectedColumns.map((column, index) => (
              <Grid item xs={12} key={column}>
                <TextField
                  select
                  fullWidth
                  label={`Map ${column}`}
                  value={columnMappings[index]?.targetColumn || ''}
                  onChange={(e) => {
                    const newMappings = [...columnMappings];
                    newMappings[index] = {
                      sourceColumn: column,
                      targetColumn: e.target.value,
                    };
                    setColumnMappings(newMappings);
                  }}
                >
                  {/* TODO: Add target column options */}
                  <MenuItem value={column}>{column}</MenuItem>
                </TextField>
              </Grid>
            ))}
          </Grid>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Import Settings
            </Typography>
            <Typography>
              Supplier: {suppliers?.find(s => s.id === selectedSupplier)?.name}
            </Typography>
            <Typography>File: {uploadedFile?.name}</Typography>
            <Typography gutterBottom>
              Mapped Fields: {columnMappings.length}
            </Typography>
            
            {importMutation.isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Import Catalog
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {renderStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {activeStep > 0 && (
          <Button onClick={handleBack}>
            Back
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleFinish}
            disabled={importMutation.isLoading}
          >
            {importMutation.isLoading ? 'Importing...' : 'Start Import'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !selectedSupplier) ||
              (activeStep === 1 && !uploadedFile) ||
              (activeStep === 2 && columnMappings.length === 0)
            }
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ImportWizard;
