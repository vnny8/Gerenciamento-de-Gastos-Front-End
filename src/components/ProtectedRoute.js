import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { authenticated } = useAuth();

    // Se não estiver autenticado, redireciona para a página de login
    if (!authenticated) {
        return <Navigate to="/" />;
    }

    // Se autenticado, renderiza o componente filho (children)
    return children;
};

export default ProtectedRoute;
