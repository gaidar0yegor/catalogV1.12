import { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const steps = ['Upload File', 'Map Columns', 'Review & Import'];

export default function CatalogImport() {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleSourceTypeChange = (event: SelectChangeEvent<string>) => {
    setSourceType(event.target.value);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Source Type</InputLabel>
                  <Select
                    value={sourceType}
                    onChange={handleSourceTypeChange}
                    label="Source Type"
                  >
                    <MenuItem value="csv">CSV File</MenuItem>
                    <MenuItem value="excel">Excel File</MenuItem>
                    <MenuItem value="json">JSON File</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ height: '100px' }}
                >
                  {file ? file.name : 'Choose File'}
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.json"
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Map Columns
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please map the columns from your file to the system fields
            </Alert>
            {/* Column mapping interface will be implemented here */}
            <Typography color="text.secondary">
              Column mapping interface coming soon...
            </Typography>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Review Import Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1">File Information</Typography>
                  <Typography color="text.secondary">
                    {file?.name || 'No file selected'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Import Catalog
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 4 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!file || !sourceType}
            >
              {activeStep === steps.length - 1 ? 'Import' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
