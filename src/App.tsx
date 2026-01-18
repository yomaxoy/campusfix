import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewBooking } from './pages/NewBooking';
import { MyOrders } from './pages/MyOrders';
import { OrderDetail } from './pages/OrderDetail';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import { FixerDashboard } from './pages/FixerDashboard';
import { useAuthStore } from './stores/useAuthStore';
import { useOrderStatusSimulation } from './hooks/useOrderStatusSimulation';

function App() {
  const { isAuthenticated } = useAuthStore();

  // Enable automatic status progression for demo purposes
  useOrderStatusSimulation();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/new-booking" element={<NewBooking />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/fixer-dashboard" element={<FixerDashboard />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
