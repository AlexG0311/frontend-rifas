import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'swiper/swiper-bundle.css';
import 'flatpickr/dist/flatpickr.css';
import './index.css';
import App from './App.tsx';
import { AppWrapper } from './pages/admin/components/common/PageMeta.tsx';
import { ThemeProvider } from './pages/admin/context/ThemeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
