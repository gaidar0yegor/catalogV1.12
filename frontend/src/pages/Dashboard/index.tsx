import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Inventory as InventoryIcon,
  CloudUpload as CloudUploadIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ color, mr: 2 }}>{icon}</Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div">
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalCatalogs: 0,
    activeImports: 0,
    errors: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch actual stats from the API
    // Simulated API call
    setTimeout(() => {
      setStats({
        totalSuppliers: 15,
        totalCatalogs: 45,
        activeImports: 3,
        errors: 2,
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Suppliers"
            value={stats.totalSuppliers}
            icon={<BusinessIcon fontSize="large" />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Catalogs"
            value={stats.totalCatalogs}
            icon={<InventoryIcon fontSize="large" />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Imports"
            value={stats.activeImports}
            icon={<CloudUploadIcon fontSize="large" />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Errors"
            value={stats.errors}
            icon={<ErrorIcon fontSize="large" />}
            color="#d32f2f"
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            {/* TODO: Add activity list component */}
            <Typography color="textSecondary">
              No recent activity to display
            </Typography>
          </Paper>
        </Grid>

        {/* Import Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Import Status
            </Typography>
            {/* TODO: Add import status component */}
            <Typography color="textSecondary">
              No active imports to display
            </Typography>
          </Paper>
        </Grid>

        {/* Error Log */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Error Log
            </Typography>
            {/* TODO: Add error log component */}
            <Typography color="textSecondary">
              No errors to display
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
