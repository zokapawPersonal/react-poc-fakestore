import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicRoute, ProtectedRoute } from './components/RouteGuards';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail'; // 1. IMPORT THIS HERE
import { ProductForm } from './pages/ProductForm';

// const PlaceholderForm = () => <div className="p-4 text-gray-600">Product Resource Add Form coming next...</div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Area Gateway */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Secure Layout Core Area */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetail />} /> {/* 2. ATTACH THIS HERE */}
              <Route path="/products/new" element={<ProductForm />} />
            </Route>
          </Route>

          {/* Automatic Fallback Router Rule */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
