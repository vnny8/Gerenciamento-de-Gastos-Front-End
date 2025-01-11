import React, { useState, useEffect } from "react";
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';


function Home() {
  const [selectedMonth, setSelectedMonth] = useState("Janeiro");
  const [showModalGasto, setShowModalGasto] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalSalario, setShowModalSalario] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState({ nome: "", cor_categoria: "#000000" });
  const [novoGasto, setNovoGasto] = useState({ categoria: "", valor: "", data: "" });
  const [salarioMensal, setSalarioMensal] = useState(0);
  const [novoSalario, setNovoSalario] = useState("");
  const loginUsuario = localStorage.getItem("loginUsuario");
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();

  const { authenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      if (!authenticated) {
          navigate('/');  // Redireciona para login se não estiver autenticado
      }
  }, [authenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const gastos = [
    { categoria: "Alimentação", valor: 500, data: "2024-11-01" },
    { categoria: "Transporte", valor: 300, data: "2024-11-05" },
    { categoria: "Lazer", valor: 200, data: "2024-11-10" },
  ];

  const dinheiroRestante = salarioMensal - gastos.reduce((total, gasto) => total + gasto.valor, 0);

  const handleOpenModalGasto = () => setShowModalGasto(true);
  const handleCloseModalGasto = () => setShowModalGasto(false);

  const handleOpenModalCategoria = () => setShowModalCategoria(true);
  const handleCloseModalCategoria = () => setShowModalCategoria(false);

  const handleOpenModalSalario = () => setShowModalSalario(true);
  const handleCloseModalSalario = () => setShowModalSalario(false);

  useEffect(() => {
    if (showModalGasto || showModalCategoria || showModalSalario) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModalGasto, showModalCategoria, showModalSalario]);

  const handleAddCategoria = async (e) => {
    e.preventDefault();
    const categoriaRequest = {
      nome: novaCategoria.nome,
      cor_categoria: novaCategoria.cor_categoria,
      loginUsuario: loginUsuario,
    };

    try {
      // Fazer a requisição POST ao backend
      const response = await fetch("http://localhost:8080/categoria/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(categoriaRequest), // Converte o objeto para JSON
      });
  
      // Verificar a resposta do backend
      if (response.ok) {
        enqueueSnackbar("Categoria criada com sucesso!", { variant: "success" });
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Erro ao criar categoria: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Erro no servidor.`, { variant: "error" });
    }

    console.log("Nova Categoria com Usuário:", categoriaRequest);
    setShowModalCategoria(false);
    setNovaCategoria({ nome: "", cor_categoria: "#000000" });
  };

  const handleAddGasto = (e) => {
    e.preventDefault();
    console.log("Novo Gasto:", {
      ...novoGasto,
      valor: parseFloat(novoGasto.valor.replace(/[^\d,-]/g, "").replace(",", ".").trim()),
    });
    setShowModalGasto(false);
    setNovoGasto({ categoria: "", valor: "", data: "" });
  };

  const handleAddSalario = async (e) => {
    e.preventDefault();
    const salario = parseFloat(novoSalario.replace(/[^\d,-]/g, "").replace(",", ".").trim());
    setSalarioMensal(salario);
    const salarioRequest = {
      valor: salario,
      loginUsuario: loginUsuario,
    };
    try {
      // Fazer a requisição POST ao backend
      const response = await fetch("http://localhost:8080/salario/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(salarioRequest), // Converte o objeto para JSON
      });
  
      // Verificar a resposta do backend
      if (response.ok) {
        enqueueSnackbar("Salário salvo com sucesso!", { variant: "success" });
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Erro ao salvar salário: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Erro no servidor.`, { variant: "error" });
    }

    console.log("Novo Salário Mensal:", salario);
    setShowModalSalario(false);
    setNovoSalario("");
  };

  const formatCurrencyOnInput = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/[^\d]/g, ""); // Remove tudo que não é número
    const formatted = parseFloat(numericValue / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return formatted;
  };

  function formatarParaReais(valor) {
    if (isNaN(valor)) {
      throw new Error("O valor fornecido não é um número válido.");
    }
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="flex flex-col lg:flex-row lg:min-h-screen bg-gray-50 p-5">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-6 lg:p-8 bg-white rounded-lg shadow-md mb-4 lg:mb-0 mr-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Gastos Mensais</h3>
        
        {/* Botões */}
        <button
          onClick={handleOpenModalCategoria}
          className="w-full mb-2 bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          + Criar Categoria
        </button>
        <button
          onClick={handleOpenModalGasto}
          className="w-full mb-2 bg-[#449E5C] text-white font-semibold py-2 rounded-md hover:bg-[#388E4B] transition duration-200"
        >
          + Adicionar Novo Gasto
        </button>
        <button
          onClick={handleOpenModalSalario}
          className="w-full mb-4 bg-yellow-500 text-white font-semibold py-2 rounded-md hover:bg-yellow-600 transition duration-200"
        >
          + Atualizar Salário do mês
        </button>
        
        {/* Seletor de Mês */}
        <label className="block mb-3 text-sm font-medium text-gray-600">Selecionar Mês</label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#449E5C] focus:border-[#449E5C]"
        >
          <option>Janeiro</option>
          <option>Fevereiro</option>
          <option>Março</option>
          <option>Abril</option>
          <option>Maio</option>
        </select>

        {/* Lista de Gastos */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Lista de Gastos</h4>
          <ul className="space-y-3">
            {gastos.map((gasto, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-100 rounded-md p-3 shadow-sm"
              >
                <span className="text-gray-700">{gasto.categoria}</span>
                <span className="font-semibold text-[#449E5C]">R$ {gasto.valor.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white font-semibold py-2 rounded-md hover:bg-red-600 transition duration-200 mt-10"
        >
          Sair
        </button>
      </div>

      {/* Seção Principal */}
      <div className="w-full lg:flex-1 p-6 lg:p-8 bg-white rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 text-green-800 font-semibold text-center p-4 rounded-lg shadow-sm">
            <h3 className="text-lg">Salário Mensal</h3>
            <p className="text-xl">{formatarParaReais(salarioMensal)}</p>
          </div>
          <div className="bg-red-100 text-red-800 font-semibold text-center p-4 rounded-lg shadow-sm">
            <h3 className="text-lg">Dinheiro Restante</h3>
            <p className="text-xl">{formatarParaReais(dinheiroRestante)}</p>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumo de Gastos</h2>
        <div className="flex items-center justify-center">
          <div className="w-full h-48 lg:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de gastos por categoria</p>
          </div>
        </div>
      </div>

      {/* Modais */}
      {/* Modal Categoria */}
      {showModalCategoria && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Criar Nova Categoria</h3>
            <form onSubmit={handleAddCategoria}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Nome da Categoria</label>
                <input
                  type="text"
                  value={novaCategoria.nome}
                  onChange={(e) => setNovaCategoria({ ...novaCategoria, nome: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Cor da Categoria</label>
                <div className="relative flex items-center">
                  <div
                    className="w-10 h-10 rounded-md mr-2 cursor-pointer"
                    style={{ backgroundColor: novaCategoria.cor_categoria }}
                    onClick={() => document.getElementById("colorPicker").click()}
                  ></div>
                  <input
                    id="colorPicker"
                    type="color"
                    value={novaCategoria.cor_categoria}
                    onChange={(e) => setNovaCategoria({ ...novaCategoria, cor_categoria: e.target.value })}
                    className="opacity-0 absolute left-0 top-0 w-10 h-10"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModalCategoria}
                  className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Gasto */}
      {showModalGasto && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Adicionar Novo Gasto</h3>
            <form onSubmit={handleAddGasto}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Categoria</label>
                <input
                  type="text"
                  value={novoGasto.categoria}
                  onChange={(e) => setNovoGasto({ ...novoGasto, categoria: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Valor</label>
                <input
                  type="text"
                  value={novoGasto.valor}
                  onChange={(e) => setNovoGasto({ ...novoGasto, valor: formatCurrencyOnInput(e.target.value) })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Data do Gasto</label>
                <input
                  type="date"
                  value={novoGasto.data}
                  onChange={(e) => setNovoGasto({ ...novoGasto, data: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModalGasto}
                  className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-[#449E5C] text-white px-4 py-2 rounded-md">
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Salário */}
      {showModalSalario && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Cadastrar Salário</h3>
            <form onSubmit={handleAddSalario}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600">Salário Mensal</label>
                <input
                  type="text"
                  value={novoSalario}
                  onChange={(e) => setNovoSalario(formatCurrencyOnInput(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModalSalario}
                  className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded-md">
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
