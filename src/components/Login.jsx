import { useState } from 'react';
import Imagem from './Imagem';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from './AuthProvider';
import { useSnackbar } from 'notistack';


export default function Example() {
    const { login: authLogin } = useAuth();  // Obtém o método de login do contexto
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    function handleLogin(event) {
        setLogin(event.target.value);
    }

    function handleSenha(event) {
        setSenha(event.target.value);
    }

    const fazerLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/authenticate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa(`${login}:${senha}`),
                },
            });
            if (!response.ok) {
                throw new Error("Erro ao autenticar");
            }
            const data = await response.text();
            console.log("Login bem-sucedido:", data);
            localStorage.setItem("loginUsuario", login);
            authLogin(data);
            navigate('/home');
        } catch (error) {
            enqueueSnackbar(`Erro ao fazer login. Tente novamente!`, { variant: "error" });
        }
    };

    const handleLoginGoogle = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google";
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white-50">
            <div className="max-w-7xl px-6 lg:px-8">
                <div className="border-t border-gray-200 pt-4" />
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <Imagem />
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Faça login em sua conta
                            </h2>
                        </div>
                        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form onSubmit={(event) => { event.preventDefault(); fazerLogin(); }}>
                                <div>
                                    <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                                        Login
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="text"
                                            name="text"
                                            type="text"
                                            onChange={handleLogin}
                                            value={login}
                                            required
                                            autoComplete="text"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex mt-3 items-center justify-between">
                                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                            Senha
                                        </label>
                                    </div>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            onChange={handleSenha}
                                            value={senha}
                                            required
                                            autoComplete="current-password"
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                    <div className="text-sm mt-1">
                                        <button className="font-semibold text-[#449E5C] hover:text-[#449E5C]">
                                            Esqueceu a sua senha?
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={fazerLogin}
                                        className="flex mt-6 w-full justify-center rounded-md bg-[#449E5C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#388E4B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#449E5C]"
                                    >
                                        Fazer login
                                    </button>
                                </div>
                            </form>
                            <div className="mt-6">
                                <button
                                    type="button"
                                    onClick={handleLoginGoogle}
                                    className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                                >
                                    Logar com Google
                                </button>
                            </div>
                            <p className="mt-10 text-center text-sm text-gray-500">
                                Não possui conta?{' '}
                                <button className="font-semibold leading-6 text-[#449E5C] hover:text-[#449E5C]">
                                    Registre-se
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4" />
            </div>
        </div>
    );
}
