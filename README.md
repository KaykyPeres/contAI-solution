# 💰 ContAI - Lançamentos Contábeis

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Status do Projeto: Em Desenvolvimento 🚧**

Uma aplicação web moderna para o gerenciamento inteligente de lançamentos contábeis, permitindo controle financeiro de forma simples e intuitiva.

---

## 📜 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [✨ Funcionalidades](#-funcionalidades)
* [📸 Screenshots](#-screenshots)
* [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
* [🚀 Como Executar o Projeto](#-como-executar-o-projeto)
* [🗺️ Endpoints da API](#️-endpoints-da-api)
* [📈 Futuras Melhorias](#-futuras-melhorias)
* [👨‍💻 Autor](#-autor)

---

## 📖 Sobre o Projeto

O **ContAI** é uma aplicação de página única (SPA - Single Page Application) desenvolvida para simplificar o registro e a visualização de transações financeiras. Com uma interface limpa, responsiva e de tema escuro, o sistema permite que o usuário adicione, edite, delete e filtre seus lançamentos de crédito e débito, oferecendo um resumo financeiro dinâmico para o período selecionado.

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema JavaScript, com um frontend reativo em **React** e um backend robusto em **Node.js** com **TypeScript** e **TypeORM**.

---

## ✨ Funcionalidades

-   **CRUD de Lançamentos:** Adição, edição e exclusão de transações financeiras.
-   **Filtragem Dinâmica:** Filtre os lançamentos por mês e ano.
-   **Resumo Financeiro:** Visualize o total de créditos, débitos e o saldo do período selecionado.
-   **Interface Moderna:** Tema escuro (dark mode) e design responsivo, adaptável a desktops e dispositivos móveis.
-   **Backend Robusto:** API RESTful para manipulação segura dos dados.

---


## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes: frontend e backend.

### **Frontend**
* **[React](https://reactjs.org/)**: Biblioteca para a construção da interface de usuário.
* **[TypeScript](https://www.typescriptlang.org/)**: Superset do JavaScript que adiciona tipagem estática.
* **[Tailwind CSS](https://tailwindcss.com/)**: Framework de CSS para estilização rápida e moderna.
* **[Axios](https://axios-http.com/)**: Cliente HTTP para realizar as requisições à API.

### **Backend**
* **[Node.js](https://nodejs.org/)**: Ambiente de execução para o JavaScript no servidor.
* **[Express](https://expressjs.com/)**: Framework para a construção da API.
* **[TypeScript](https://www.typescriptlang.org/)**: Para um desenvolvimento mais seguro e robusto no backend.
* **[TypeORM](https://typeorm.io/)**: ORM (Object-Relational Mapper) para interagir com o banco de dados.
* **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional para armazenamento dos dados.

---

## 🚀 Como Executar o Projeto

Para executar o projeto localmente, você precisará ter o [Node.js](https://nodejs.org/), o [Git](https://git-scm.com/) e o [PostgreSQL](https://www.postgresql.org/download/) instalados.

### 1. Clonar o Repositório
```bash
git clone [https://github.com/KaykyPeres/cont-ai.git](https://github.com/KaykyPeres/cont-ai.git)
cd cont-ai
2. Configurar o Backend
Bash

# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie um arquivo .env na raiz da pasta 'backend'
# e adicione as variáveis de ambiente com base no .env.example
# Exemplo de .env:
# PORT=3001
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
# POSTGRES_USER=seu_usuario_postgres
# POSTGRES_PASSWORD=sua_senha
# POSTGRES_DATABASE=contai_db

# Execute as migrações do TypeORM (para criar as tabelas)
npm run typeorm migration:run

# Inicie o servidor backend
npm run dev
3. Configurar o Frontend
Bash

# Em um novo terminal, navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento do React
npm run dev
Pronto! A aplicação frontend estará disponível em http://localhost:5173 (ou outra porta indicada no terminal) e se comunicará com o backend em http://localhost:3001.

🗺️ Endpoints da API
A API do backend segue o padrão REST e possui os seguintes endpoints principais:

Método HTTP	Endpoint	Descrição
GET	/launches	Lista todos os lançamentos.
POST	/launches	Cria um novo lançamento.
PUT	/launches/:id	Atualiza um lançamento existente.
DELETE	/launches/:id	Deleta um lançamento.
GET	/launches/:id	Busca um lançamento específico.
GET	/launches/by-month	Lista lançamentos filtrados por ano e mês.
GET	/launches/summary	Retorna o resumo (créditos/débitos) do período.

Exportar para as Planilhas
📈 Futuras Melhorias
[ ] Implementar autenticação de usuários com JWT.
[ ] Adicionar categorias para os lançamentos (moradia, alimentação, etc.).
[ ] Criar um dashboard com gráficos para visualização de dados.
[ ] Adicionar filtros por intervalo de datas.
[ ] Paginação na lista de lançamentos.
👨‍💻 Autor
Feito por [Kayky L. Plombon Peres].
