import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import App from './App.tsx';
import './index.css';
import { locales } from './locales/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider locale="pt-BR" messages={locales['pt-BR']}>
      <App />
    </IntlProvider>
  </StrictMode>,
);