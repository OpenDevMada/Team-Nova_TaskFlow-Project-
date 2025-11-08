import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import Loader from "@/components/common/Loader";

const ProtectedRoute = ({
    children,
    allowedRoles = [],
    requiredPermissions = [],
    redirectIfAuthenticated = false,
}) => {
    const { user, loading, hasAnyRole, hasPermission } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (redirectIfAuthenticated && user) {
                navigate(ROUTES.DASHBOARD, { replace: true });
            }
        }
    }, [loading, user, redirectIfAuthenticated, navigate]);

    if (loading) return <Loader />;

    if (!user && !redirectIfAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    if (
        requiredPermissions.length > 0 &&
        !requiredPermissions.every((permission) => hasPermission(permission))
    ) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    return children;
};

export default ProtectedRoute;
