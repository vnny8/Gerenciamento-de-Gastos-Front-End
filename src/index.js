import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualizado para React 18
import './index.css';
import App from './App';

// Obtém o elemento raiz onde o React irá renderizar a aplicação
const rootElement = document.getElementById("root");

// Usa createRoot para renderizar o App
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
