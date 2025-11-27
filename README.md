# GreenEats – Frontend

Single Page Application em React (Vite) para gerenciar o catálogo de produtos do GreenEats. A interface consome a API Node/Express integrada ao Airtable descrita no backend e oferece listagem, filtros, cadastro, edição, exclusão e validação de produtos.

## Stack

- Vite + React 19 (JavaScript)
- Axios para chamadas HTTP
- CSS global customizado (sem Tailwind/Bootstrap)

## Requisitos

- Node.js 18+
- npm 9+
- Backend GreenEats em execução ou endpoint compatível

## Configuração

```bash
git clone <repo>
cd GreenEats-FrontEnd
npm install
cp .env.example .env # ajuste a URL da API
```

Edite `.env` e defina:

```
VITE_API_URL=http://localhost:3000
```

## Scripts

- `npm run dev` – ambiente de desenvolvimento com Vite
- `npm run build` – build de produção para `dist/`
- `npm run preview` – pré-visualiza o build localmente

## Deploy na Vercel

1. Instale a CLI (opcional): `npm i -g vercel`
2. Faça login: `vercel login`
3. Configure variáveis em **Project Settings → Environment Variables**:
	- `VITE_API_URL` → URL pública do backend (ex.: `https://api.greeneats.com`)
4. Deploy inicial:
	```bash
	vercel --prod
	```
	ou conecte o repositório no dashboard da Vercel; o arquivo `vercel.json` já define:
	- build: `npm run build`
	- output: `dist`
	- framework: Vite
5. Após cada push para a branch monitorada (ex.: `main`), a Vercel reconstruirá automaticamente. Lembre-se de manter `VITE_API_URL` definido em todos os ambientes (Development / Preview / Production) para que o frontend saiba onde buscar a API.

## Estrutura

```
src/
  App.jsx
  main.jsx
  pages/ProdutosPage.jsx
  components/
  services/api.js
  styles/global.css
```

Os componentes seguem responsabilidades isoladas (Header, Filters, Grid, Form Modal, etc.), e toda a lógica de dados fica centralizada em `ProdutosPage` + `services/api.js`.
