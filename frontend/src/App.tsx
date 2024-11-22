import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Layout
import MainLayout from '@/layouts/MainLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import Suppliers from '@/pages/Suppliers';
import SupplierDetails from '@/pages/SupplierDetails';
import Catalogs from '@/pages/Catalogs';
import CatalogDetails from '@/pages/CatalogDetails';
import ImportWizard from '@/pages/ImportWizard';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Suppliers */}
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="suppliers/:id" element={<SupplierDetails />} />

          {/* Catalogs */}
          <Route path="catalogs" element={<Catalogs />} />
          <Route path="catalogs/:id" element={<CatalogDetails />} />

          {/* Import */}
          <Route path="import" element={<ImportWizard />} />

          {/* Not Found */}
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
