# Manager Products Web

Frontend for product and category management, built with React and Ant Design.

> **Português:** This README is in English. For Portuguese version, see [LEIAME.md](./LEIAME.md)

## Tech Stack

- **Framework:** React 19
- **Build:** Vite
- **Language:** TypeScript
- **UI:** Ant Design (ANTD)
- **HTTP:** Axios
- **i18n:** react-intl

## Prerequisites

- Node.js installed

### 1. Clone the repository

```bash
git clone https://github.com/gnascimento2045/manager-products-web.git
cd manager-products-web
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Application available at: `http://localhost:5173`

## Folder Structure

```
src/
├── pages/
│   ├── products/ProductsPage.tsx   # Products page
│   └── categories/CategoriesPage.tsx # Categories page
├── services/
│   ├── api.ts                       # Axios configuration
│   ├── products.service.ts          # Products API
│   └── categories.service.ts        # Categories API
├── locales/
│   └── pt-BR.ts                     # Portuguese translations
├── App.tsx                          # Main component
└── main.tsx                         # Entry point
```

## Features

- CRUD for products and categories
- Quick category creation in product form
- Brazilian Real price formatting (R$)
- Custom error messages in Portuguese
- Empty states with add button
- Pagination in product listing

## Technical Decisions

### ANTD
Chose Ant Design because I have experience with projects using it and found it more visually professional and easier to customize. Ready-made components speed up development significantly.

### Local State
Did not use Redux/Zustand/Jotai for being a simple project. Used useState and useEffect directly, which work well for this case.

### axios
Simple and straightforward HTTP client. Configured an interceptor to make future authentication implementation easier.

## Credits

Developed with assistance from AI (Claude - Anthropic) for initial structure and React pattern suggestions.