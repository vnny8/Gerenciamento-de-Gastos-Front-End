import { createContext, useContext, useState, useEffect } from 'react';

// Criação do contexto de autenticação
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Inicializa o estado de autenticação com base no token salvo
    const [authenticated, setAuthenticated] = useState(!!localStorage.getItem('token'));

    // Função para realizar login
    const login = (token) => {
        setAuthenticated(true);
        localStorage.setItem('token', token);  // Salva o token
    };

    // Função para logout
    const logout = () => {
        setAuthenticated(false);
        localStorage.removeItem('token');
    };

    // Verifica se há token salvo ao carregar a aplicação (não necessário, mas opcional)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthenticated(true);  // Mantém autenticado se houver token
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para acessar o contexto de autenticação
export const useAuth = () => {
    return useContext(AuthContext);
};
