import { Routes, Route } from "react-router-dom";
import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import AdminPage from "@/pages/admin";
import ProtectedRoute from "@/components/ui/protected-route";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRoleId={100}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
