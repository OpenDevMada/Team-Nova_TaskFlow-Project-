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
    const { user, loading, isAuthenticated, hasAnyRole, hasPermission } = useAuth();
    const navigate = useNavigate();

    if (loading) return <Loader />;

    // Redirection si l'utilisateur est authentifié et que la route est réservée aux non-connectés
    if (redirectIfAuthenticated && isAuthenticated) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    // Redirection si l'utilisateur n'est pas authentifié
    if (!redirectIfAuthenticated && !isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // Vérification des rôles si spécifiés
    if (allowedRoles.length > 0 && user && !hasAnyRole(allowedRoles)) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    // Vérification des permissions si spécifiées
    if (
        requiredPermissions.length > 0 &&
        user &&
        !requiredPermissions.every((permission) => hasPermission(permission))
    ) {
        return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
    }

    return children;
};

export default ProtectedRoute;
