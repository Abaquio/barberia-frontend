// frontend/src/components/ui/protected-route.jsx
import { Navigate, useLocation } from "react-router-dom";
import { isAuthed, hasRole } from "@/lib/useAuth";

export default function ProtectedRoute({ children, requireRoleId }) {
  const location = useLocation();
  if (!isAuthed()) return <Navigate to="/login" replace state={{ from: location }} />;
  if (requireRoleId && !hasRole(requireRoleId)) return <Navigate to="/" replace />;
  return children;
}
