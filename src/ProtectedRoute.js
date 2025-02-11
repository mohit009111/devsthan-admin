import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = Boolean(localStorage.getItem("token")); // Example: Check localStorage for login token
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
