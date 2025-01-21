import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const ProtectedRoute = ({ children }) => {
    const { authenticated, login } = useAuth();
    const location = useLocation();

    // Verifica se há um token na URL
    const params = new URLSearchParams(location.search);
    console.log(params)
    const token = params.get("token");
    const email = params.get("email");

    if (token) {
        // Autentica o usuário com o token
        login(token, 'Google', email); // Método do AuthProvider
        return children; // Permite acessar a rota protegida
    }

    // Se não autenticado e sem token, redireciona para login
    if (!authenticated) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
