import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
export default function ProtectedRoute({ admin = false }) {
  const { user, isAdmin, error, loading, recovering } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <div className="container section" role="status">
        Restoring your session…
      </div>
    );
  if (recovering) return <Navigate to="/reset-password" replace />;
  if (!user)
    return (
      <Navigate
        to={admin ? "/admin/login" : "/login"}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  if (admin && !isAdmin)
    return (
      <div className="container section" role="alert">
        <h1>Administrator access required</h1>
        <p>
          {error ||
            "Your account is signed in but does not have administrator access."}
        </p>
        <a href="/dashboard">Go to your account</a>
      </div>
    );
  return <Outlet />;
}
