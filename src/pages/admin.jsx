// pages/admin.jsx
import { useNavigate } from "react-router-dom";
import AdminDashboard from "@/components/admin-dashboard";

export default function AdminPage() {
  const navigate = useNavigate();
  return <AdminDashboard onBack={() => navigate("/")} />;
}