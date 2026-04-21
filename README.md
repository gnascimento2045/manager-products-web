# Manager Products Web

Frontend para gerenciamento de produtos e categorias, construído com React e Ant Design.

## Tecnologias

- **Framework:** React 19
- **Build:** Vite
- **Linguagem:** TypeScript
- **UI:** Ant Design (ANTD)
- **HTTP:** Axios
- **i18n:** react-intl

## Pré-requisitos

- Node.js instalado

## Começando

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Aplicação disponível em: `http://localhost:5173`

## Estrutura de Pastas

```
src/
├── pages/
│   ├── products/ProductsPage.tsx   # Página de produtos
│   └── categories/CategoriesPage.tsx # Página de categorias
├── services/
│   ├── api.ts                       # Configuração Axios
│   ├── products.service.ts          # API de produtos
│   └── categories.service.ts        # API de categorias
├── locales/
│   └── pt-BR.ts                     # Traduções português
├── App.tsx                          # Componente principal
└── main.tsx                         # Entry point
```

## Funcionalidades

- CRUD de produtos e categorias
- Criação rápida de categoria no formulário de produto
- Formatação de preço em Real brasileiro (R$)
- Mensagens de erro customizadas em português
- Empty states com botão para adicionar novo registro
- Paginação na listagem de produtos

## Decisões Técnicas

### ANTD
Escolhi o Ant Design porque tenho experiência em projetos que usam e achei a aparência mais profissional e fácil de customizar. Os componentes prontos aceleram bastante o desenvolvimento.

### Estado Local
Não使用了 Redux/Zustand/Jotai por ser um projeto simples. Usei useState e useEffect mesmo, que funcionam bem para esse caso.

### axios
HTTP client simples e direto. Configurei um interceptor para facilitar futuras implementações de autenticação.

## Créditos

Desenvolvido com ajuda de IA (Claude - Anthropic) para estruturação inicial e sugestões de padrões React.
