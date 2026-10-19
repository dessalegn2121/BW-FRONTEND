import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Menu } from '../pages/Menu';
import { ProductDetails } from '../pages/ProductDetails';
import { Cart } from '../pages/Cart';
import { Checkout } from '../pages/Checkout';
import { OrderConfirmation } from '../pages/OrderConfirmation';
import { MyOrders } from '../pages/MyOrders';
import { Login } from '../pages/Login';
import { About } from '../pages/About';
import Contact from '../pages/Contact';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ManageMenu } from '../pages/admin/ManageMenu';
import { ManageCategories } from '../pages/admin/ManageCategories';
import { ManageOrders } from '../pages/admin/ManageOrders';
import { ManageCustomers } from '../pages/admin/ManageCustomers';
import { Reports } from '../pages/admin/Reports';
import { Settings } from '../pages/admin/Settings';
import { Layout } from './Layout';
import { AdminLayout } from '../components/layout/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/menu/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<ManageMenu />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
