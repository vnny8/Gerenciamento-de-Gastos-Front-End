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
    const [criandoConta, setCriandoConta] = useState(false);
    const [enviandoPedidoAlterarSenha, setEnviandoPedidoAlterarSenha] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [codigoConfirmacao, setCodigoConfirmacao] = useState("");
    const handleCodigoConfirmacao = (event) => setCodigoConfirmacao(event.target.value);

    const handleLogin = (event) => setLogin(event.target.value);
    const handleSenha = (event) => setSenha(event.target.value);
    const handleNome = (event) => setNome(event.target.value);
    const handleConfirmarSenha = (event) => setConfirmarSenha(event.target.value);
    const [showModal, setShowModal] = useState(false); 
    const [showModalRecuperarSenha, setShowModalRecuperarSenha] = useState(false); 
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
    const [emailRecuperacao, setEmailRecuperacao] = useState("");
    const [codigoRecuperacao, setCodigoRecuperacao] = useState("");
    const [resetStep, setResetStep] = useState(1);

    const handleEmailRecuperacao = (e) => setEmailRecuperacao(e.target.value);
    const handleCodigoRecuperacao = (e) => setCodigoRecuperacao(e.target.value);
    const handleNovaSenha = (e) => setNovaSenha(e.target.value);
    const handleConfirmarNovaSenha = (e) => setConfirmarNovaSenha(e.target.value);

    const fazerLogin = async () => {
        try {
            const response = await fetch(`${requisicaoAPI}/authenticate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa(`${login}:${senha}`),
                },
            });
            if (response.status === 403){
                enqueueSnackbar(`Essa conta encontra-se inativa, confirme a sua conta no e-mail.`, { variant: "error" });
                return
            } else if (response.status === 401){
                enqueueSnackbar(`E-mail ou senha inserido estão incorretos.`, { variant: "error" })
                return
            }
            if (!response.ok) {
                throw new Error("Erro ao fazer login.");
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
        setCriandoConta(true);
        if (senha !== confirmarSenha) {
            enqueueSnackbar("As senhas não coincidem.", { variant: "error" });
            setCriandoConta(false);
            return;
        }

        const errosSenha = validarSenha(senha);

        if (errosSenha.length > 0) {
            const mensagem = `A senha deve conter: ${errosSenha.join(", ")}.`;
            enqueueSnackbar(mensagem, { variant: "error" });
            setCriandoConta(false);
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

            if (response.status === 409){
                enqueueSnackbar(`Já existe um usuário registrado com este e-mail.`, { variant: "error" });
            }
            if (!response.ok) {
                throw new Error("Erro ao registrar usuário");
            }

            enqueueSnackbar("Enviamos um e-mail de confirmação para você, por favor confirme para fazer login!", { variant: "success" });
            setShowModal(true); // Exibe o modal
            setCodigoConfirmacao("")
            setIsRegister(false); // Retorna para a tela de login
        } catch (error) {
            enqueueSnackbar(`Erro ao registrar usuário. Tente novamente!`, { variant: "error" });
        } finally {
            setCriandoConta(false);
        }
    };

    const confirmarConta = async () => {
        try {
            const response = await fetch(`${requisicaoAPI}/usuario/confirmarConta?codigo=${codigoConfirmacao}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (response.status === 404){
                enqueueSnackbar(`Código de confirmação inválido.`, { variant: "error" });
                return
            }
            if (!response.ok) {
                if (response.status === 400) {
                    enqueueSnackbar("Código inválido. Tente novamente.", { variant: "error" });
                } else {
                    enqueueSnackbar("Erro ao confirmar conta. Tente novamente.", { variant: "error" });
                }
                return;
            }

            enqueueSnackbar("Conta confirmada com sucesso! Agora você pode fazer login.", { variant: "success" });
            setShowModal(false); // Fecha o modal
            setIsRegister(false); // Retorna à tela de login
        } catch (error) {
            enqueueSnackbar(`Erro ao confirmar conta. Tente novamente!`, { variant: "error" });
        }
    };

    const solicitarRecuperacaoSenha = async () => {
        setEnviandoPedidoAlterarSenha(true)
        try {
            const response = await fetch(`${requisicaoAPI}/usuario/esqueciSenha?email=${emailRecuperacao}`, {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error("Erro ao enviar e-mail de recuperação.");
            }
            enqueueSnackbar("Código de recuperação enviado para o e-mail.", { variant: "success" });
            setResetStep(2); // Passa para a próxima etapa (inserir código)
        } catch (error) {
            enqueueSnackbar("Erro ao solicitar recuperação de senha. Tente novamente.", { variant: "error" });
        } finally {
            setEnviandoPedidoAlterarSenha(false)
        }
    };

    const alterarSenha = async () => {
        if (novaSenha !== confirmarNovaSenha) {
            enqueueSnackbar("As senhas não coincidem.", { variant: "error" });
            return;
        }

        const errosSenha = validarSenha(novaSenha);

        if (errosSenha.length > 0) {
            const mensagem = `A senha deve conter: ${errosSenha.join(", ")}.`;
            enqueueSnackbar(mensagem, { variant: "error" });
            return;
        }

        try {
            const response = await fetch(`${requisicaoAPI}/usuario/alterarSenha`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailUsuario: emailRecuperacao,
                    codigo: codigoRecuperacao,
                    novaSenha: novaSenha,
                }),
            });

            if (response.status === 404){
                enqueueSnackbar(`Código de confirmação inválido.`, { variant: "error" });
                return
            }
            if (response.status === 400){
                enqueueSnackbar(`Código de confirmação já utilizado anteriormente.`, { variant: "error" });
                return
            }
            if (response.status === 410){
                enqueueSnackbar(`Código de confirmação já expirou.`, { variant: "error" });
                return
            }
            if (!response.ok) {
                throw new Error("Erro ao alterar a senha.");
            }

            enqueueSnackbar("Senha alterada com sucesso! Agora você pode fazer login.", { variant: "success" });
            setShowModalRecuperarSenha(false);
            setEmailRecuperacao("");
            setCodigoRecuperacao("");
            setNovaSenha("");
            setConfirmarNovaSenha("");
            setResetStep(1); // Reseta o fluxo
        } catch (error) {
            enqueueSnackbar("Erro ao alterar senha. Tente novamente.", { variant: "error" });
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
                                        className={`flex mt-6 w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                            ${criandoConta 
                                                ? "bg-gray-400 cursor-not-allowed text-gray-700" // Estilo quando desabilitado
                                                : "bg-[#449E5C] text-white hover:bg-[#388E4B] focus-visible:outline-[#449E5C]"
                                            }`}
                                        disabled={criandoConta}
                                    >
                                        {criandoConta ? "Criando conta..." : "Registrar"}
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
                                    <div className="mt-3 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModalRecuperarSenha(true)
                                                setResetStep(1);
                                                setEmailRecuperacao("");
                                            }}
                                            className="text-sm text-[#449E5C] hover:text-[#388E4B] font-semibold"
                                        >
                                            Esqueci minha senha
                                        </button>
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
                {/* Modal de confirmação */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                            <h2 className="text-lg font-semibold text-gray-700 text-center">Confirmação de Conta</h2>
                            <div className="mt-4">
                                <label htmlFor="codigo" className="block text-sm font-medium text-gray-700">
                                    Insira o código de 6 dígitos
                                </label>
                                <input
                                    id="codigo"
                                    type="text"
                                    maxLength={6}
                                    onChange={handleCodigoConfirmacao}
                                    value={codigoConfirmacao}
                                    className="mt-1 block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#449E5C] focus:ring-[#449E5C] sm:text-sm"
                                />
                            </div>
                            <div className="mt-6 flex justify-end space-x-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmarConta}
                                    className="px-4 py-2 bg-[#449E5C] text-white rounded-md text-sm font-medium hover:bg-[#388E4B]"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Modal de recuperação de senha */}
                {showModalRecuperarSenha && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                            {resetStep === 1 && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-700 text-center">Esqueci minha senha</h2>
                                    <div className="mt-4">
                                        <label htmlFor="emailRecuperacao" className="block text-sm font-medium text-gray-700">
                                            Insira seu e-mail
                                        </label>
                                        <input
                                            id="emailRecuperacao"
                                            type="email"
                                            value={emailRecuperacao}
                                            onChange={handleEmailRecuperacao}
                                            className="mt-1 block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#449E5C] focus:ring-[#449E5C] sm:text-sm"
                                        />
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                setShowModalRecuperarSenha(false)
                                                setResetStep(1);
                                                setEmailRecuperacao("");
                                            }}
                                            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={solicitarRecuperacaoSenha}
                                            className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                                                enviandoPedidoAlterarSenha
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-[#449E5C] hover:bg-[#388E4B]"
                                            }`}
                                            disabled={enviandoPedidoAlterarSenha}
                                        >
                                            {enviandoPedidoAlterarSenha
                                            ? "Enviando e-mail..."
                                            : "Receber código"}
                                        </button>
                                    </div>
                                </>
                            )}
                            {resetStep === 2 && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-700 text-center">Alterar Senha</h2>
                                    <div className="mt-4">
                                        <label htmlFor="codigoRecuperacao" className="block text-sm font-medium text-gray-700">
                                            Insira o código recebido
                                        </label>
                                        <input
                                            id="codigoRecuperacao"
                                            type="text"
                                            value={codigoRecuperacao}
                                            onChange={handleCodigoRecuperacao}
                                            className="mt-1 block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#449E5C] focus:ring-[#449E5C] sm:text-sm"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                                            Nova Senha
                                        </label>
                                        <input
                                            id="novaSenha"
                                            type="password"
                                            value={novaSenha}
                                            onChange={handleNovaSenha}
                                            className="mt-1 block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#449E5C] focus:ring-[#449E5C] sm:text-sm"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700">
                                            Confirmar Nova Senha
                                        </label>
                                        <input
                                            id="confirmarNovaSenha"
                                            type="password"
                                            value={confirmarNovaSenha}
                                            onChange={handleConfirmarNovaSenha}
                                            className="mt-1 block pl-2 w-full rounded-md border-gray-300 shadow-sm focus:border-[#449E5C] focus:ring-[#449E5C] sm:text-sm"
                                        />
                                    </div>
                                    <div className="mt-6 flex justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                setShowModalRecuperarSenha(false)
                                                setResetStep(1);
                                                setEmailRecuperacao("");
                                            }}
                                            className="px-4 py-2 bg-gray-300 rounded-md text-sm font-medium hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={alterarSenha}
                                            className="px-4 py-2 bg-[#449E5C] text-white rounded-md text-sm font-medium hover:bg-[#388E4B]"
                                        >
                                            Alterar Senha
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
                <div className="border-t border-gray-200 pt-4" />
            </div>
        </div>
    );
}
