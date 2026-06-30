import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/reduxHooks";

const AdminRoute = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.role === "admin" || user.role === "manager";
  if (!isAdmin) {
    return <Navigate to="/vacations" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
