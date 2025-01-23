import { useState } from 'react';
import Imagem from './Imagem';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useSnackbar } from 'notistack';
import { FcGoogle } from 'react-icons/fc';
import requisicaoAPI from '../api';

export default function Example() {
    const { login: authLogin } = useAuth(); // Obtém o método de login do contexto
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [isRegister, setIsRegister] = useState(false); // Controla o estado entre login e registro
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = (event) => setLogin(event.target.value);
    const handleSenha = (event) => setSenha(event.target.value);
    const handleNome = (event) => setNome(event.target.value);
    const handleConfirmarSenha = (event) => setConfirmarSenha(event.target.value);

    // Validações individuais
    const temLetraMaiuscula = /[A-Z]/.test(senha);
    const temNumero = /\d/.test(senha);
    const temCaractereEspecial = /[\W_]/.test(senha);
    const tamanhoMinimo = senha.length >= 8;

    const fazerLogin = async () => {
        try {
            const response = await fetch(`${requisicaoAPI}/authenticate`, {
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
            localStorage.setItem("emailUsuario", login);
            authLogin(data);
            navigate('/home');
        } catch (error) {
            enqueueSnackbar(`Erro ao fazer login. Tente novamente!`, { variant: "error" });
        }
    };

    const handleLoginGoogle = () => {
        window.location.href = `${requisicaoAPI}/oauth2/authorization/google`;
    };

    const validarSenha = (senha) => {
        const erros = [];
        
        // Verificar se tem pelo menos 1 letra maiúscula
        if (!/[A-Z]/.test(senha)) {
            erros.push("1 letra maiúscula");
        }
        
        // Verificar se tem pelo menos 1 número
        if (!/\d/.test(senha)) {
            erros.push("1 número");
        }
        
        // Verificar se tem pelo menos 1 caractere especial
        if (!/[\W_]/.test(senha)) {
            erros.push("1 caractere especial");
        }
        
        // Verificar se tem pelo menos 8 caracteres
        if (senha.length < 8) {
            erros.push("8 caracteres");
        }
    
        return erros;
    };

    const registrarUsuario = async () => {
        if (senha !== confirmarSenha) {
            enqueueSnackbar("As senhas não coincidem.", { variant: "error" });
            return;
        }

        const errosSenha = validarSenha(senha);

        if (errosSenha.length > 0) {
            const mensagem = `A senha deve conter: ${errosSenha.join(", ")}.`;
            enqueueSnackbar(mensagem, { variant: "error" });
            return;
        }

        try {
            const response = await fetch(`${requisicaoAPI}/usuario/criar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome,
                    email: login,
                    senha,
                }),
            });

            if (!response.ok) {
                throw new Error("Erro ao registrar usuário");
            }

            enqueueSnackbar("Usuário registrado com sucesso! Agora você pode fazer login.", { variant: "success" });
            setIsRegister(false); // Retorna para a tela de login
        } catch (error) {
            enqueueSnackbar(`Erro ao registrar usuário. Tente novamente!`, { variant: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white-50">
            <div className="max-w-7xl px-6 lg:px-8">
                <div className="border-t border-gray-200 pt-4" />
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <Imagem />
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                        <div className="items-center sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                {isRegister ? "Crie sua conta" : "Faça login em sua conta"}
                            </h2>
                                <div className="mt-6 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={handleLoginGoogle}
                                        className="flex w-80 items-center justify-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <FcGoogle className="h-5 w-5" />
                                        <span><b>Entrar com o Google</b></span>
                                    </button>
                                </div>
                        </div>
                        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                            {isRegister ? (
                                <form onSubmit={(event) => { event.preventDefault(); registrarUsuario(); }}>
                                    <div>
                                        <label htmlFor="nome" className="block text-sm font-medium leading-6 text-gray-900">
                                            Nome
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="nome"
                                                name="nome"
                                                type="text"
                                                onChange={handleNome}
                                                value={nome}
                                                required
                                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            E-mail
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                onChange={handleLogin}
                                                value={login}
                                                required
                                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="senha" className="block text-sm font-medium leading-6 text-gray-900">
                                            Senha
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="senha"
                                                name="senha"
                                                type="password"
                                                onChange={handleSenha}
                                                value={senha}
                                                required
                                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="confirmarSenha" className="block text-sm font-medium leading-6 text-gray-900">
                                            Confirme sua senha
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="confirmarSenha"
                                                name="confirmarSenha"
                                                type="password"
                                                onChange={handleConfirmarSenha}
                                                value={confirmarSenha}
                                                required
                                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex mt-6 w-full justify-center rounded-md bg-[#449E5C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#388E4B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#449E5C]"
                                        >
                                            Registrar
                                        </button>
                                    </div>
                                    <p className="mt-6 text-center text-sm text-gray-500">
                                        Já possui uma conta?{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsRegister(false);
                                                setLogin("");
                                                setSenha("");
                                                setNome("");
                                                setConfirmarSenha("");
                                            }}
                                            className="font-semibold leading-6 text-[#449E5C] hover:text-[#388E4B]"
                                        >
                                            Faça login
                                        </button>
                                    </p>
                                </form>
                            ) : (
                                <form onSubmit={(event) => { event.preventDefault(); fazerLogin(); }}>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                            E-mail
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                onChange={handleLogin}
                                                value={login}
                                                required
                                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
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
                                                className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#449E5C] sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="flex mt-6 w-full justify-center rounded-md bg-[#449E5C] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#388E4B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#449E5C]"
                                        >
                                            Fazer login
                                        </button>
                                    </div>
                                    <p className="mt-6 text-center text-sm text-gray-500">
                                        Não possui conta?{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsRegister(true);
                                                setLogin("");
                                                setSenha("");
                                                setNome("");
                                                setConfirmarSenha("");
                                            }}
                                            className="font-semibold leading-6 text-[#449E5C] hover:text-[#388E4B]"
                                        >
                                            Registre-se
                                        </button>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4" />
            </div>
        </div>
    );
}
