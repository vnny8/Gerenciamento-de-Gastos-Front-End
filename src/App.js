import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Example from './components/Login';
import Home from './components/Home';
import { AuthProvider } from './components/AuthProvider';  // Certifique-se de importar o AuthProvider corretamente
import ProtectedRoute from './components/ProtectedRoute';
import { SnackbarProvider } from 'notistack';

function App() {
    return (
        <AuthProvider>
            {/* Envolvendo toda a aplicação com SnackbarProvider */}
            <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                    vertical: 'top', // Alinha no topo
                    horizontal: 'right', // Alinha à direita
                }}
            >
                <Router>
                    <div className="App">
                        <Routes>
                            <Route path="/" element={<Example />} />
                            <Route
                                path="/home"
                                element={
                                    <ProtectedRoute>
                                        <Home />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                </Router>
            </SnackbarProvider>
        </AuthProvider>
    );
}

export default App;
