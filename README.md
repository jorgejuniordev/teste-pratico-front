# Sistema de Gestão Financeira

Sistema de gestão financeira pessoal desenvolvido com React e Node.js.

## Requisitos

- Node.js (versão 14 ou superior)
- npm
- Git

## Configuração do Ambiente

1. Clone o repositório.
2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie o arquivo `.env.example` para `.env`
   - Preencha a variável REACT_APP_API_URL com a url da API

```env
REACT_APP_API_URL=http://localhost:3000
```

## Executando o Projeto

1. Inicie o servidor de desenvolvimento:

```bash
npm start
```

2. Acesse a aplicação:
   - Abra seu navegador
   - Acesse `http://localhost:3000`

## Funcionalidades

- Autenticação de usuários
- Cadastro de receitas e despesas
- Categorização de transações
- Resumo financeiro
- Dashboard com gráficos
- Relatórios personalizados

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos do React
  ├── modules/        # Módulos da aplicação
  ├── services/       # Serviços e APIs
  ├── utils/          # Funções utilitárias
  └── App.js          # Componente principal
```
