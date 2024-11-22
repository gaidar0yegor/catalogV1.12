import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard = () => import('./pages/Dashboard');
const CatalogList = () => import('./pages/CatalogList');
const CatalogImport = () => import('./pages/CatalogImport');

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/catalogs" element={<CatalogList />} />
            <Route path="/import" element={<CatalogImport />} />
          </Routes>
        </Container>
      </Layout>
    </Box>
  );
}

export default App;
