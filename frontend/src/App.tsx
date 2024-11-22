import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container, CircularProgress } from '@mui/material';
import Layout from './components/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CatalogList = lazy(() => import('./pages/CatalogList'));
const CatalogImport = lazy(() => import('./pages/CatalogImport'));

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Suspense fallback={<CircularProgress />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/catalogs" element={<CatalogList />} />
              <Route path="/import" element={<CatalogImport />} />
            </Routes>
          </Suspense>
        </Container>
      </Layout>
    </Box>
  );
}

export default App;
