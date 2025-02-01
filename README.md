# 📌 Gerenciamento de Gastos - Front-End

## 📌 Introdução
Este documento descreve a estrutura do Front-End do sistema de Gerenciamento de Gastos Pessoais. O objetivo é fornecer uma interface intuitiva e responsiva para a gestão de gastos, permitindo que o usuário visualize, registre e categorize suas despesas de maneira eficiente.

O Front-End foi desenvolvido em **React.js**, com o uso de **React Router** para navegação, **Tailwind CSS** para estilização e **Chart.js** para gráficos interativos. A comunicação com o Back-End ocorre por meio de chamadas HTTP para a API.

---

## 📂 Arquitetura e Organização

### 🔹 Ponto de Entrada da Aplicação
- **`src/index.js`** → Inicializa a aplicação React e renderiza o componente principal (`App.js`).
- **`src/App.js`** → Contém a estrutura principal da aplicação, gerenciando as rotas e o contexto de autenticação.

### 🔹 Configuração
- **`package.json`** → Lista as dependências do projeto.
- **`tailwind.config.js`** → Configurações do Tailwind CSS.
- **`public/index.html`** → Estrutura HTML base para a aplicação.
- **`src/index.css`** → Importação do Tailwind CSS.

---

## 🎨 Componentes Principais

### 📌 **Autenticação e Controle de Acesso**
- **`src/components/AuthProvider.js`** → Provedor de autenticação que gerencia login e logout usando localStorage.
- **`src/components/Login.jsx`** → Página de login do usuário.
- **`src/components/ProtectedRoute.js`** → Wrapper que protege rotas que exigem autenticação.

### 📌 **Navegação e Rotas**
- **React Router** é utilizado para navegação entre as telas:
  - `"/"` → Página de Login (`Login.jsx`)
  - `"/home"` → Página principal (`Home.jsx`)
  - `"/home2"` → Segunda página (apontando para `Home.jsx`)

### 📌 **Gestão de Gastos**
- **`src/components/Home.jsx`** → Página principal da aplicação, onde o usuário pode visualizar seu saldo, categorias e gastos do mês.
- **`src/components/FormCategoria.jsx`** → Formulário para adicionar ou editar categorias de gastos.
- **`src/components/FormNovoGasto.jsx`** → Formulário para adicionar ou editar um gasto.

### 📌 **Visualização e Relatórios**
- **`src/components/ComponenteDoGrafico.jsx`** → Componente que exibe gráficos de gastos utilizando **Chart.js**.
- **`src/components/VirtualizedList.jsx`** → Lista otimizada para exibição de gastos, garantindo performance mesmo com grande volume de dados.

### 📌 **Outros Componentes**
- **`src/components/Imagem.jsx`** → Exibe imagens estáticas na interface.
- **`src/api.js`** → Define a URL da API Back-End.
- **`src/assets/`** → Contém imagens e ícones utilizados na interface.

---

## 🛠️ Funcionalidades Implementadas

### ✅ Autenticação e Sessão
- Login do usuário com **armazenamento de token no localStorage**.
- Logout e controle de sessão.
- Proteção de rotas que exigem autenticação (`ProtectedRoute.js`).

### ✅ Cadastro e Gestão de Gastos
- Adicionar, editar e remover categorias de gastos.
- Registrar novos gastos, vinculando-os a categorias.
- Atualizar salário mensal do usuário.

### ✅ Relatórios e Visualização
- Exibição de **saldo disponível**, comparando **salário** e **despesas**.
- Exibição de **gráficos interativos** para análise dos gastos mensais.
- Lista virtualizada para exibir **histórico de gastos**, garantindo alta performance.

---

## 🖼️ Capturas de Tela

Aqui estão algumas imagens do sistema em funcionamento:

### 🔹 **Tela de Login**
![Tela de Login](caminho_para_imagem/login.png)

### 🔹 **Tela Principal**
![Tela Principal](caminho_para_imagem/home.png)

### 🔹 **Gráfico de Gastos**
![Gráfico de Gastos](caminho_para_imagem/grafico_gastos.png)

### 🔹 **Cadastro de Categorias**
![Cadastro de Categorias](caminho_para_imagem/cadastro_categoria.png)

### 🔹 **Cadastro de Gastos**
![Cadastro de Gastos](caminho_para_imagem/cadastro_gasto.png)

> **Nota:** Substitua `caminho_para_imagem/...` pelo caminho correto das imagens no repositório ou um link público.

---

## 🚀 Como Executar

### 🔧 **Pré-requisitos**
- Node.js 16+
- Gerenciador de pacotes npm ou yarn

### 📌 **Passos**
1. Clone o repositório:
```plaintext
git clone https://github.com/vnny8/Gerenciamento-de-Gastos-Front-End.git
```
2. Instale as dependências:
```plaintext
npm install
```
3. Inicie o servidor::
```plaintext
npm start
```

## 📜 Tecnologias Utilizadas

### 🔹 **Front-End**
- **Linguagem:** JavaScript (ES6+)
- **Framework:** React.js
- **Gerenciamento de Estado:** Context API
- **Estilização:** Tailwind CSS
- **Navegação:** React Router
- **Notificações:** Notistack

### 🔹 **Visualização de Dados**
- **Gráficos:** Chart.js
- **Listas Virtuais:** react-window

### 🔹 **Autenticação**
- **Armazenamento de Sessão:** localStorage
- **Proteção de Rotas:** React Router

---

## 📜 Licença

Este projeto é de código aberto e pode ser utilizado conforme necessário.

---

📌 Criado por [vnny8](https://github.com/vnny8)
"""
