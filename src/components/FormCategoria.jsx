import { faPencilAlt, faPlus, faSave, faTrash, faWrench, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function FormCategoria({ 
  categoria, 
  setCategoria, 
  handleSubmit, 
  buttonText, 
  onCancel, 
  categorias = [], 
  isEditing = false, 
  onSelectCategoria,
  onDelete
}) {
  return (
    <form onSubmit={handleSubmit}>
      {isEditing && (
        <div className="mb-4">
          <label htmlFor="selectCategoria" className="block text-sm font-medium text-gray-600">
            Selecione uma Categoria
          </label>
          <select
            id="selectCategoria"
            value={categoria.id || ""}
            onChange={(e) => onSelectCategoria(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="" disabled>Escolha uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.categoriaId} value={cat.categoriaId}>
                {cat.nome}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="nomeCategoria" className="block text-sm font-medium text-gray-600">
          Nome da Categoria
        </label>
        <input
          id="nomeCategoria"
          type="text"
          value={categoria.nome}
          onChange={(e) => setCategoria({ ...categoria, nome: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="corCategoria" className="block text-sm font-medium text-gray-600">
          Cor da Categoria
        </label>
        <div className="relative flex items-center">
          <button
            id="corCategoria"
            className="w-10 h-10 rounded-md mr-2 cursor-pointer"
            style={{ backgroundColor: categoria.cor_categoria }}
            onClick={() => document.getElementById("colorPicker").click()}
          ></button>
          <input
            id="colorPicker"
            type="color"
            value={categoria.cor_categoria}
            onChange={(e) => setCategoria({ ...categoria, cor_categoria: e.target.value })}
            className="opacity-0 absolute left-0 top-0 w-10 h-10"
          />
        </div>
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
        <button type="submit" className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md">
          <FontAwesomeIcon icon={buttonText === "Salvar" ? faSave : faPlus} className="mr-2" />
          {buttonText}
      </button>
      </div>
    </form>
  );
}

export default FormCategoria;
