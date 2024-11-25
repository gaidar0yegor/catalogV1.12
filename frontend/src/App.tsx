import { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Container, CircularProgress, Alert, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import theme from './theme';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ mt: 4, p: 2 }}>
          <Alert severity="error">
            <Typography variant="h6" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please try refreshing the page. If the problem persists, contact support.
            </Typography>
            {this.state.error && (
              <Box component="pre" sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: 'grey.100', 
                borderRadius: 1,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {this.state.error.toString()}
              </Box>
            )}
          </Alert>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard').catch(err => {
  console.error('Failed to load Dashboard:', err);
  throw err;
}));

const CatalogList = lazy(() => import('./pages/CatalogList/CatalogList').catch(err => {
  console.error('Failed to load CatalogList:', err);
  throw err;
}));

const CatalogImport = lazy(() => import('./pages/CatalogImport/CatalogImport').catch(err => {
  console.error('Failed to load CatalogImport:', err);
  throw err;
}));

const CatalogMapping = lazy(() => import('./pages/CatalogMapping/CatalogMapping').catch(err => {
  console.error('Failed to load CatalogMapping:', err);
  throw err;
}));

const CatalogImportConfirm = lazy(() => import('./pages/CatalogImport/CatalogImportConfirm').catch(err => {
  console.error('Failed to load CatalogImportConfirm:', err);
  throw err;
}));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  }
});

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      <CircularProgress />
    </Box>
  );
}

function RouteErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Box sx={{ display: 'flex' }}>
              <Layout>
                <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                  <Routes>
                    <Route path="/" element={
                      <RouteErrorBoundary>
                        <Dashboard />
                      </RouteErrorBoundary>
                    } />
                    <Route path="/catalogs" element={
                      <RouteErrorBoundary>
                        <CatalogList />
                      </RouteErrorBoundary>
                    } />
                    <Route path="/catalogs/import" element={
                      <RouteErrorBoundary>
                        <CatalogImport />
                      </RouteErrorBoundary>
                    } />
                    <Route path="/catalogs/:id/mapping" element={
                      <RouteErrorBoundary>
                        <CatalogMapping />
                      </RouteErrorBoundary>
                    } />
                    <Route path="/catalogs/:id/import" element={
                      <RouteErrorBoundary>
                        <CatalogImportConfirm />
                      </RouteErrorBoundary>
                    } />
                  </Routes>
                </Container>
              </Layout>
            </Box>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
