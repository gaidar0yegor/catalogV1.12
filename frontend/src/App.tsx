import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import theme from './theme';

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const CatalogList = lazy(() => import('./pages/CatalogList/CatalogList'));
const CatalogImport = lazy(() => import('./pages/CatalogImport/CatalogImport'));
const CatalogMapping = lazy(() => import('./pages/CatalogMapping/CatalogMapping'));
const CatalogImportConfirm = lazy(() => import('./pages/CatalogImport/CatalogImportConfirm'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ display: 'flex' }}>
            <Layout>
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Suspense fallback={<CircularProgress />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/catalogs" element={<CatalogList />} />
                    <Route path="/catalogs/import" element={<CatalogImport />} />
                    <Route path="/catalogs/:id/mapping" element={<CatalogMapping />} />
                    <Route path="/catalogs/:id/import" element={<CatalogImportConfirm />} />
                  </Routes>
                </Suspense>
              </Container>
            </Layout>
          </Box>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
