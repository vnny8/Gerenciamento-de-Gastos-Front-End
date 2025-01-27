import { faPlus, faSave, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function FormNovoGasto({ 
  gasto, 
  setGasto, 
  handleSubmit, 
  buttonText, 
  onCancel, 
  categorias = [], 
  gastos = [],
  onSelectGasto,
  isEditing = false, 
  onDelete,
  formatCurrencyOnInput
}) {
  
  return (
    <form onSubmit={handleSubmit}>
      {isEditing && (
        <div className="mb-4">
          <label htmlFor="selectGasto" className="block text-sm font-medium text-gray-600">
            Selecione um Gasto
          </label>
          <select
            id="selectGasto"
            value={gasto.id || ""}
            onChange={(e) => onSelectGasto(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="" disabled>Escolha um gasto</option>
            {gastos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nome}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="nomeGasto" className="block text-sm font-medium text-gray-600">
          Nome do Gasto
        </label>
        <input
          id="nomeGasto"
          type="text"
          value={gasto.nome}
          onChange={(e) => setGasto({ ...gasto, nome: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="categoriaGasto" className="block text-sm font-medium text-gray-600">
          Categoria do Gasto
        </label>
        <select
          id="categoriaGasto"
          value={gasto.idCategoria || ""}
          onChange={(e) => setGasto({ ...gasto, idCategoria: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="" disabled>Escolha uma categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.categoriaId} value={categoria.categoriaId}>
              {categoria.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="valorGasto" className="block text-sm font-medium text-gray-600">
          Valor do Gasto
        </label>
        <input
          id="valorGasto"
          type="text"
          value={gasto.valor}
          onChange={(e) => setGasto({ ...gasto, valor: formatCurrencyOnInput(e.target.value)})}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="dataGasto" className="block text-sm font-medium text-gray-600">
          Data do Gasto
        </label>
        <input
          id="dataGasto"
          type="date"
          value={gasto.data}
          onChange={(e) => setGasto({ ...gasto, data: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="flex justify-end">
        {isEditing && (
          <button
            type="button"
            onClick={onDelete}
            className="mr-2 bg-red-500 text-white px-4 py-2 rounded-md"
          >
            <FontAwesomeIcon icon={faTrash} /> Excluir
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="mr-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
        >
          <FontAwesomeIcon icon={faXmark} /> Cancelar
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          <FontAwesomeIcon icon={buttonText === "Salvar" ? faSave : faPlus} className="mr-2" />
          {buttonText}
        </button>
      </div>
    </form>
  );
}

export default FormNovoGasto;
