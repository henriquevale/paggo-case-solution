# Paggo OCR & LLM Case

Solução Full Stack desenvolvida para o Case Técnico da Paggo. O sistema permite o upload de faturas, extração automática de texto (OCR) e interação inteligente via Chat (LLM) para tirar dúvidas sobre o documento.

## Tecnologias Utilizadas

    1)Backend (API)

    2)NestJS: Framework principal.

    3)Prisma ORM: Gerenciamento de banco de dados.

    4)SQLite: Banco de dados (configurado para rodar sem dependências nativas/Rust).

    5)Tesseract.js: Motor OCR local (Open Source).

    6)Google Gemini AI: LLM para interpretação dos textos.

    7)JWT & Bcrypt: Autenticação e segurança.

    8)Frontend (Interface)

    9)Next.js: Framework React.

    10)Tailwind CSS: Estilização moderna.

    11)Lucide React: Ícones.

    12)Axios: Comunicação com API.

## Como Rodar Localmente

    Siga os passos abaixo para executar a solução completa no seu computador.

    Pré-requisitos

    Node.js (v18 ou superior) instalado.

    Uma chave de API do Google Gemini (AI Studio).

1. Configuração do Backend

Entre na pasta do servidor:
```bash
cd paggo-backend
```

Instale as dependências:
```bash
npm install
```

Crie um arquivo .env na raiz do backend e adicione:

DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
GEMINI_API_KEY="sua-chave-gemini-aqui"


Gere o banco de dados e o cliente Prisma:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

Inicie o servidor:
```bash
npm run start:dev
```

O backend rodará em: http://localhost:3000

2. Configuração do Frontend

Em um novo terminal, entre na pasta do frontend:
```bash
cd paggo-frontend
```

Instale as dependências:
```bash
npm install
```
Inicie o servidor web:
```bash
npm run dev
```

Acesse o projeto no navegador:
Geralmente em: http://localhost:3001

## Funcionalidades

Autenticação: Crie uma conta ou faça login.

Dashboard: Visualize seus documentos enviados anteriormente.

Upload: Envie imagens de faturas (JPG, PNG). O sistema processará o OCR automaticamente.

Chat IA: Clique em "Conversar com IA" para perguntar sobre valores, datas ou fornecedores da fatura.

Relatório: Baixe um arquivo .txt contendo o texto extraído e o histórico da conversa.

## Decisões Técnicas

OCR: Optou-se pelo Tesseract.js para garantir que o projeto rode localmente sem exigir credenciais de faturamento (Billing) do Google Cloud Vision.

LLM: Utilizou-se o Google Gemini (versão Flash) pela rapidez e generosidade do plano gratuito para desenvolvedores.

Banco de Dados: SQLite foi escolhido pela simplicidade de configuração local, dispensando a necessidade de instalar Docker ou Postgres na máquina do avaliador.

Developed by Henrique Rodrigues do Vale