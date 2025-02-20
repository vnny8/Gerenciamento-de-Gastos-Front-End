import React, { useState, useEffect } from "react";
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VirtualizedList from "./VirtualizedList";
import ComponenteDoGrafico from "./ComponenteDoGrafico";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import FormCategoria from "./FormCategoria";
import FormNovoGasto from "./FormNovoGasto";
import requisicaoAPI from "../api";
import apiKey from "../apiKey";
import { faChartBar, faChartPie, faClipboardList, faFolderTree, faMagnifyingGlass, faMoneyBill, faPencilAlt, faRightFromBracket, faWallet, faWrench, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Home() {
  const [showModalGasto, setShowModalGasto] = useState(false);
  const [showModalCategoria, setShowModalCategoria] = useState(false);
  const [showModalSalario, setShowModalSalario] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState({ "id": undefined, nome: "", cor_categoria: "#000000" });
  const [novoGasto, setNovoGasto] = useState({ id: "", idCategoria: "", categoria: "", valor: "", data: "", nome: "" });
  const [salarioMensal, setSalarioMensal] = useState(0);
  const [novoSalario, setNovoSalario] = useState("");
  const emailUsuario = localStorage.getItem("emailUsuario");
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [gastos, setGastos] = useState([]);
  const [gastosEditar, setGastosEditar] = useState([]);
  const [gastoDoMes, setGastoDoMes] = useState(0);
  const handleOpenModalCategoria = () => setShowModalCategoria(true);
  const handleOpenModalSalario = () => setShowModalSalario(true);
  const handleCloseModalSalario = () => setShowModalSalario(false);
  const [categorias, setCategorias] = useState([]);
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState(new Date());
  const [chartType, setChartType] = useState("pie");
  const [modalStep, setModalStep] = useState("create"); // Para controlar o step atual (Criar ou Editar)

  // Converte para os formatos de mês e ano
  const formattedMonth = mesAnoSelecionado.toLocaleString("pt-BR", { month: "long" });
  const formattedYear = mesAnoSelecionado.getFullYear().toString();

  // Atualiza o estado da data selecionada
  const handleDateChange = (date) => setMesAnoSelecionado(date);

  const handleCloseModalGasto = () => {
    setShowModalGasto(false);
    setModalStep("create");
    setNovoGasto({ id: "", idCategoria: "", categoria: "", valor: "", data: "", nome: "" });
  };
  const handleCloseModalCategoria = () => {
    setShowModalCategoria(false); // Fecha o modal
    setNovaCategoria({ "id": undefined, nome: "", cor_categoria: "#000000" });
    setModalStep("create");
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const tokenExpirou = () => {
    enqueueSnackbar("Sessão expirada. Faça login novamente.", {
      variant: "warning",
      autoHideDuration: 2000, // Esperar 2 segundos pro usuário ver que a sessão expirou
    });
    handleLogout()
  }

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
      emailUsuario: emailUsuario,
    };

    try {
      // Fazer a requisição POST ao backend
      const response = await fetch(`${requisicaoAPI}/categoria/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(categoriaRequest), // Converte o objeto para JSON
      });
  
      // Verificar a resposta do backend
      if (response.ok) {
        enqueueSnackbar("Categoria criada com sucesso!", { variant: "success" });
      } else if (response.status === 401){
        tokenExpirou()
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Erro ao criar categoria: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Erro no servidor.`, { variant: "error" });
    }

    console.log("Nova Categoria com Usuário:", categoriaRequest);
    setShowModalCategoria(false);
    setNovaCategoria({"id": undefined, nome: "", cor_categoria: "#000000" });
  };

  const handleEditCategoria = async (e) => {
    e.preventDefault();
  
    const categoriaRequest = {
      id: novaCategoria.id,
      nome: novaCategoria.nome,
      cor_categoria: novaCategoria.cor_categoria,
      emailUsuario: emailUsuario,
    };
  
    try {
      // Fazer a requisição PUT ao backend
      const response = await fetch(`${requisicaoAPI}/categoria/editar`, {
        method: "PUT", // Muda para PUT
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(categoriaRequest), // Converte o objeto para JSON
      });
  
      // Verificar a resposta do backend
      if (response.ok) {
        enqueueSnackbar("Categoria editada com sucesso!", { variant: "success" });
        handleSearchExpenses();
        handleCloseModalCategoria();
      } else if (response.status === 401) {
        tokenExpirou();
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Erro ao editar categoria: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Erro no servidor.`, { variant: "error" });
    }
  
    console.log("Categoria Editada:", categoriaRequest);
    setShowModalCategoria(false);
    setNovaCategoria({ categoriaId: undefined, nome: "", cor_categoria: "#000000" }); // Reseta os campos
  };
  

  const fetchCategorias = async () => {
    try {
      const response = await fetch(`${requisicaoAPI}/categoria/listarPorUsuario?email=${emailUsuario}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      } else if (response.status === 401){
        tokenExpirou()
      } else {
        enqueueSnackbar("Erro ao buscar categorias!", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro no servidor ao buscar categorias.", { variant: "error" });
    }
  };

  const fetchTodosGastos = async () => {
    try {
      const response = await fetch(`${requisicaoAPI}/gasto/listar?email=${emailUsuario}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
        },
      });
      if (response.ok) {
        const data = await response.json();
        data.forEach((item, i) => {
          console.log(`Index: ${i}, Item:`, item);
          console.log(item.valor)
          item.valor = formatCurrencyOnInput(String(item.valor*100));
          console.log(item.valor)
        });      
        setGastosEditar(data);
      } else if (response.status === 401){
        tokenExpirou()
      } else {
        enqueueSnackbar("Erro ao buscar categorias!", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro no servidor ao buscar categorias.", { variant: "error" });
      console.log(error)
    }
  };
  

  const handleAddGasto = async (e) => {
    e.preventDefault();
    const gastoRequest = {
      valor: parseFloat(novoGasto.valor.replace(/[^\d,-]/g, "").replace(",", ".").trim()),
      idCategoria: novoGasto.idCategoria,
      nome: novoGasto.nome,
      emailUsuario: emailUsuario,
      dataCadastro: novoGasto.data ? `${novoGasto.data}T00:00:00` : null
    };
    try {
      // Fazer a requisição POST ao backend
      const response = await fetch(`${requisicaoAPI}/gasto/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(gastoRequest), // Converte o objeto para JSON
      });
  
      // Verificar a resposta do backend
      if (response.ok) {
        enqueueSnackbar("Gasto salvo com sucesso!", { variant: "success" });
        handleSearchExpenses()
      } else if (response.status === 401){
        tokenExpirou()
      } else {
        //const errorData = await response.json()
        enqueueSnackbar(`Erro ao criar gasto.`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Erro no servidor.`, { variant: "error" });
    }
    console.log("Novo gasto: ", gastoRequest)
    setShowModalGasto(false);
    setNovoGasto({ id: "", idCategoria: "", categoria: "", valor: "", data: "", nome: "" });
  };

  const handleAddSalario = async (e) => {
    e.preventDefault();
    const salario = parseFloat(novoSalario.replace(/[^\d,-]/g, "").replace(",", ".").trim());
    setSalarioMensal(salario);
    const salarioRequest = {
      valor: salario,
      emailUsuario: emailUsuario,
      mes: formattedMonth,
      ano: formattedYear
    };
    try {
      // Fazer a requisição POST ao backend
      const response = await fetch(`${requisicaoAPI}/salario/criar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
        },
        body: JSON.stringify(salarioRequest), // Converte o objeto para JSON
      });
  
      // Verificar a resposta do backend
      if (response.ok) {
        enqueueSnackbar("Salário salvo com sucesso!", { variant: "success" });
        setSalarioMensal(salario)
      } else if (response.status === 401){
        tokenExpirou()
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

  const handleEditGasto = async (e) => {
    e.preventDefault();
    console.log("NovoGasto para editar está assim: ", novoGasto)
    novoGasto.data = novoGasto.data ? `${novoGasto.data}T00:00:00` : null
    novoGasto.valor = parseFloat(novoGasto.valor.replace(/[^\d,-]/g, "").replace(",", ".").trim())
    try {
      const response = await fetch(`${requisicaoAPI}/gasto/editar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoGasto),
      });
  
      if (response.ok) {
        enqueueSnackbar("Gasto editado com sucesso!", { variant: "success" });
        handleSearchExpenses(); // Atualiza os gastos
        handleCloseModalGasto();
      } else {
        enqueueSnackbar("Erro ao editar gasto.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro no servidor ao editar gasto.", { variant: "error" });
    }
  };
  
  const handleDeleteGasto = async () => {
    if (!novoGasto.id) {
      enqueueSnackbar("Nenhum gasto selecionado para exclusão.", { variant: "error" });
      return;
    }
  
    try {
      const response = await fetch(`${requisicaoAPI}/gasto/deletar?id=${novoGasto.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey,
        },
      });
  
      if (response.ok) {
        enqueueSnackbar("Gasto excluído com sucesso!", { variant: "success" });
        handleSearchExpenses(); // Atualiza os gastos
        handleCloseModalGasto();
      } else {
        enqueueSnackbar("Erro ao excluir gasto.", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro no servidor ao excluir gasto.", { variant: "error" });
    }
  };
  

  const handleOpenModalGasto = () => {
    fetchCategorias(); // Buscar categorias antes de abrir o modal
    setShowModalGasto(true);
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

  const handleSelectCategoria = (categoriaId) => {
    const categoriaSelecionada = categorias.find(cat => cat.categoriaId === parseInt(categoriaId));
    if (categoriaSelecionada) {
      setNovaCategoria({
        id: categoriaSelecionada.categoriaId,
        nome: categoriaSelecionada.nome,
        cor_categoria: categoriaSelecionada.cor_categoria
      });
    }
  };

  const handleSelectNovoGasto = (gastoId) => {
    const gastoSelecionado = gastosEditar.find(gasto => gasto.id === parseInt(gastoId));
    console.log("Fez aqui1: ", gastoSelecionado)
    console.log("Id: ", gastoId)
    console.log("GastosEditar", gastosEditar)
    if (gastoSelecionado) {
      console.log("Fez aqui: ", gastoSelecionado)
      const dataFormatada = gastoSelecionado.dataCadastro
      ? new Date(gastoSelecionado.dataCadastro).toISOString().split("T")[0]
      : "";
      setNovoGasto({
        id: gastoSelecionado.id,
        valor: gastoSelecionado.valor,
        idCategoria: gastoSelecionado.idCategoria,
        nome: gastoSelecionado.nome,
        cor_categoria: gastoSelecionado.cor_categoria,
        data: dataFormatada
      });
    }
  };

  const handleDeleteCategoria = async () => {
    if (!novaCategoria.id) {
      enqueueSnackbar("Nenhuma categoria selecionada para exclusão.", { variant: "error" });
      return;
    }
  
    try {
      const response = await fetch(`${requisicaoAPI}/categoria/deletar?id=${novaCategoria.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token no cabeçalho
          "x-api-key": apiKey,
        },
      });
  
      if (response.ok) {
        enqueueSnackbar("Categoria excluída com sucesso!", { variant: "success" });
        fetchCategorias(); // Atualiza a lista de categorias após a exclusão
        handleCloseModalCategoria();
      } else if (response.status === 401) {
        tokenExpirou();
      } else if (response.status === 409){
        enqueueSnackbar(`Esta categoria não pode ser excluída pois ainda possui gastos relacionados à ela.`, { variant: "error" });
      } else {
        enqueueSnackbar(`Erro ao excluir categoria`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Erro no servidor ao excluir categoria.", { variant: "error" });
    }
  };
  
  

  // Função para pesquisar gastos
  const handleSearchExpenses = async () => {
    try {
      const response = await fetch(
        `${requisicaoAPI}/gasto/listarPorData?mes=${formattedMonth}&ano=${formattedYear}&email=${emailUsuario}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Token de autenticação
            "x-api-key": apiKey,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Gastos recebidos:", data);
        enqueueSnackbar("Gastos carregados com sucesso!", { variant: "success" });
        // Atualizar estado com os gastos recebidos
        setGastos(data.gastos);
        setSalarioMensal(data.salarioDoMes)
        setGastoDoMes(data.valorGastoNoMes)
      } else if (response.status === 401){
        tokenExpirou()
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Erro ao carregar gastos: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar(`Erro no servidor ao carregar gastos. ${error}`, { variant: "error" });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:min-h-screen bg-gray-50 p-5">
      {/* Sidebar */}
      <div className="w-full lg:w-1/4 p-6 lg:p-8 bg-white rounded-lg shadow-md mb-4 lg:mb-0 mr-2">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Gastos Mensais</h3>
        
        {/* Seletor de Mês e Ano */}
        <label htmlFor="selecionarMesAno" className="block mb-3 text-sm font-medium text-gray-600">
          Selecionar Mês e Ano
        </label>
        <DatePicker
          id="selecionarMesAno"
          selected={mesAnoSelecionado}
          onChange={handleDateChange} // Atualiza o estado ao selecionar
          dateFormat="MM/yyyy" // Exibe como "Mês/Ano"
          showMonthYearPicker // Mostra apenas o seletor de mês e ano
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#449E5C] focus:border-[#449E5C]"
        />

        {/* Botão Pesquisar Gastos */}
        <button
          onClick={handleSearchExpenses}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-[#449E5C] hover:bg-[#357d47] text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-sm"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4" />
          Pesquisar Gastos
        </button>

        <div className="mt-5">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">Lista de Gastos</h4>
          <div className="w-100 h-50 bg-white rounded-lg shadow-md overflow-hidden">
            <VirtualizedList items={gastos} />
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-sm mt-8"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
          Sair do Sistema
        </button>
      </div>

      {/* Seção Principal */}
      <div className="flex-1 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        {/* Cards Superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-green-50/80 border border-green-100 p-5 rounded-xl shadow-sm">
            <h3 className="text-base font-medium text-green-800 mb-1">Salário Mensal</h3>
            <p className="text-2xl font-bold text-green-900">{formatarParaReais(salarioMensal)}</p>
          </div>
          <div className="bg-red-50/80 border border-red-100 p-5 rounded-xl shadow-sm">
            <h3 className="text-base font-medium text-red-800 mb-1">Saldo Disponível</h3>
            <p className="text-2xl font-bold text-red-900">{formatarParaReais(salarioMensal - gastoDoMes)}</p>
          </div>
        </div>

        {/* Botões */}
        <div className="flex flex-col lg:flex-row gap-3 mb-3">
          <button
            onClick={handleOpenModalCategoria}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-sm"
          >
            <FontAwesomeIcon icon={faFolderTree} className="w-4 h-4" />
            Gerenciar Categorias
          </button>
          <button
            onClick={handleOpenModalGasto}
            className="flex-1 flex items-center justify-center gap-2 bg-[#449E5C] hover:bg-[#357d47] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-sm"
          >
            <FontAwesomeIcon icon={faMoneyBill} className="w-4 h-4" />
            Adicionar Gasto
          </button>
          <button
            onClick={handleOpenModalSalario}
            className="flex-1 flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-sm"
          >
            <FontAwesomeIcon icon={faWallet} className="w-4 h-4" />
            Atualizar Salário
          </button>
        </div>

        {/* Seção do Gráfico */}
        <div className="bg-gray-50 rounded-xl shadow-inner p-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-3">
            <h2 className="text-xl font-bold text-gray-900 mb-3 lg:mb-0">Resumo de Gastos</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType("pie")}
                className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all duration-200 ${
                  chartType === "pie" 
                    ? "bg-[#449E5C] text-white shadow-inner" 
                    : "bg-white text-gray-600 shadow-md hover:shadow-sm"
                }`}
              >
                <FontAwesomeIcon icon={faChartPie} className="w-4 h-4" />
                Pizza
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all duration-200 ${
                  chartType === "bar" 
                    ? "bg-[#449E5C] text-white shadow-inner" 
                    : "bg-white text-gray-600 shadow-md hover:shadow-sm"
                }`}
              >
                <FontAwesomeIcon icon={faChartBar} className="w-4 h-4" />
                Barras
              </button>
            </div>
          </div>

          <div className="h-96 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            {gastos.length > 0 ? (
              <ComponenteDoGrafico data={gastos} chartType={chartType} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-gray-400 italic">Nenhum gasto registrado este mês</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modais */}
      {/* Modal Categoria */}
      {showModalCategoria && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
            {/* Stepper */}
            <div className="flex gap-2  justify-around mb-6 border-b pb-3">
            <button
                  onClick={() => setModalStep("create")}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    modalStep === "create" 
                      ? "bg-[#449E5C] text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FontAwesomeIcon icon={faWrench} /> Criar
                </button>
                <button
                  onClick={() => {
                    fetchCategorias();
                    setModalStep("edit");
                  }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    modalStep === "edit" 
                      ? "bg-[#449E5C] text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FontAwesomeIcon icon={faPencilAlt} /> Editar
                </button>
            </div>
            <FormCategoria
              categoria={novaCategoria}
              setCategoria={setNovaCategoria}
              handleSubmit={modalStep === "create" ? handleAddCategoria : handleEditCategoria}
              buttonText={modalStep === "create" ? "Adicionar" : "Salvar"}
              onCancel={handleCloseModalCategoria}
              categorias={categorias}
              isEditing={modalStep === "edit"}
              onSelectCategoria={handleSelectCategoria}
              onDelete={handleDeleteCategoria} // Passa a função para exclusão
            />
          </div>
        </div>
      )}

      {showModalGasto && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg">
          <div className="flex gap-2 justify-around mb-6 border-b pb-3">
              <button
                onClick={() => {
                  setModalStep("create")
                  setNovoGasto({ id: "", idCategoria: "", categoria: "", valor: "", data: "", nome: "" });
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  modalStep === "create" 
                    ? "bg-[#449E5C] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FontAwesomeIcon icon={faWrench} /> Criar
              </button>
              <button
                onClick={() => {
                  fetchCategorias(); // Chama a função que carrega as categorias
                  fetchTodosGastos(); // Chama a função que carrega os gastos
                  setModalStep("edit"); // Define o modal para o passo "Editar"
                  setNovoGasto({ id: "", idCategoria: "", categoria: "", valor: "", data: "", nome: "" }); // Reseta variável
                }}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                  modalStep === "edit" 
                    ? "bg-[#449E5C] text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FontAwesomeIcon icon={faPencilAlt} /> Editar
              </button>
            </div>
            <FormNovoGasto
              gasto={novoGasto}
              setGasto={setNovoGasto}
              handleSubmit={modalStep === "create" ? handleAddGasto : handleEditGasto}
              buttonText={modalStep === "create" ? "Adicionar" : "Salvar"}
              onCancel={handleCloseModalGasto}
              categorias={categorias}
              gastos={gastosEditar}
              onSelectGasto={handleSelectNovoGasto}
              isEditing={modalStep === "edit"}
              onDelete={handleDeleteGasto}
              formatCurrencyOnInput={formatCurrencyOnInput}
            />
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
                <label htmlFor="salarioMensal" className="block text-sm font-medium text-gray-600">Salário Mensal</label>
                <input
                  id="salarioMensal"
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
                  className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-sm"
                >
                  <FontAwesomeIcon icon={faXmark} /> Cancelar
                </button>
                <button type="submit" className="bg-yellow-500 text-white px-4 py-2 font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-sm">
                <FontAwesomeIcon icon={faClipboardList} /> Cadastrar
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
