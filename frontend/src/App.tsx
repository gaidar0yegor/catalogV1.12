import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CatalogList } from './pages/CatalogList';
import { CatalogImport, CatalogImportConfirm } from './pages/CatalogImport';
import { CatalogMapping } from './pages/CatalogMapping';
import theme from './theme';

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
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/catalogs" element={<CatalogList />} />
              <Route path="/catalogs/import" element={<CatalogImport />} />
              <Route path="/catalogs/:id/mapping" element={<CatalogMapping />} />
              <Route path="/catalogs/:id/import" element={<CatalogImportConfirm />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
