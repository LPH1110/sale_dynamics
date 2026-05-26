import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import StoreProvider from '@/store/Provider';
import ProtectedRoute from '@/router/ProtectedRoute';
import AdminRoute from '@/router/AdminRoute';

// Layouts
import MainLayout from '@/layouts/MainLayout';


// Pages
import Dashboard from '@/pages/Dashboard';
import Signin from '@/pages/auth/Signin';
import Activation from '@/pages/auth/Activation';
import AccountVerification from '@/pages/auth/AccountVerification';
import ChangePassword from '@/pages/accounts/ChangePassword';
import Accounts from '@/pages/accounts/Accounts';
import AccountDetail from '@/pages/accounts/AccountDetail';
import Products from '@/pages/products/Products';
import ProductDetail from '@/pages/products/ProductDetail';
import CreateProduct from '@/pages/products/CreateProduct';
import CreateVariant from '@/pages/products/CreateVariant';
import Orders from '@/pages/orders/Orders';
import CreateOrder from '@/pages/orders/CreateOrder';
import OrderDetail from '@/pages/orders/OrderDetail';
import OrderRefund from '@/pages/orders/OrderRefund';
import Customers from '@/pages/customers/Customers';
import CustomerDetail from '@/pages/customers/CustomerDetail';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <Router>
            <Routes>
              {/* Public & Auth wrappers */}
              <Route path="/sign-in" element={<Signin />} />
              <Route path="/activation/:userId" element={<Activation />} />
              <Route path="/verify-account/:token" element={<AccountVerification />} />
              <Route path="/change-password/:username" element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              } />

              {/* Core Layout wrappers */}
              <Route element={<MainLayout />}>
                {/* Protected Staff Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/products" element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                } />
                <Route path="/products/detail/:barcode" element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                } />
                <Route path="/products/create-product" element={
                  <ProtectedRoute>
                    <CreateProduct />
                  </ProtectedRoute>
                } />
                <Route path="/products/:productId/variant-new" element={
                  <ProtectedRoute>
                    <CreateVariant />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/orders/create-new" element={
                  <ProtectedRoute>
                    <CreateOrder />
                  </ProtectedRoute>
                } />
                <Route path="/orders/detail/:orderId" element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                } />
                <Route path="/orders/detail/:orderId/refund" element={
                  <ProtectedRoute>
                    <OrderRefund />
                  </ProtectedRoute>
                } />
                <Route path="/customers" element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } />
                <Route path="/customers/detail/:phone" element={
                  <ProtectedRoute>
                    <CustomerDetail />
                  </ProtectedRoute>
                } />

                {/* Restricted Admin Routes */}
                <Route path="/accounts" element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <Accounts />
                    </AdminRoute>
                  </ProtectedRoute>
                } />
                <Route path="/accounts/detail/:username" element={
                  <ProtectedRoute>
                    <AccountDetail />
                  </ProtectedRoute>
                } />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
