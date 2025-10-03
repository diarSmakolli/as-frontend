import { useAuth } from "./authContext";
import { Navigate } from "react-router-dom";

export default function RoleProtectedRoute({ allowedRoles, children }) {
  const { account, isLoading } = useAuth();
  if (isLoading) return null;
  if (!account || !allowedRoles.includes(account.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
