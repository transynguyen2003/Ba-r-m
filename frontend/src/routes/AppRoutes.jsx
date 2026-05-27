import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout.jsx';
import PublicLayout from '../components/layout/PublicLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import AuthCallbackPage from '../pages/AuthCallbackPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import OrderPage from '../pages/OrderPage.jsx';
import PostDetailPage from '../pages/PostDetailPage.jsx';
import PostListPage from '../pages/PostListPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import ProductListPage from '../pages/ProductListPage.jsx';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage.jsx';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminLeadsPage from '../pages/admin/AdminLeadsPage.jsx';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx';
import AdminProductEditPage from '../pages/admin/AdminProductEditPage.jsx';
import AdminProductsPage from '../pages/admin/AdminProductsPage.jsx';
import AdminSiteAssetsPage from '../pages/admin/AdminSiteAssetsPage.jsx';
import ProtectedAdminRoute from './ProtectedAdminRoute.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/:id" element={<AdminProductEditPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="site-assets" element={<AdminSiteAssetsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="leads" element={<AdminLeadsPage />} />
        </Route>
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/blog" element={<PostListPage />} />
        <Route path="/blog/:slug" element={<PostDetailPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Route>
    </Routes>
  );
}
