import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6">Total Catalogs</Typography>
            <Typography variant="h3">0</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6">Recent Imports</Typography>
            <Typography variant="h3">0</Typography>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            <Typography variant="h6">Active Suppliers</Typography>
            <Typography variant="h3">0</Typography>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <Typography variant="h6">Recent Activity</Typography>
            <Typography variant="body1">No recent activity</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
