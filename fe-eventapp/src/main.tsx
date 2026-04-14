import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import store from "./store/store";  // {persistor}
import { ThemeProvider } from './context/ThemeContext.tsx';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>

            <App />
          </QueryClientProvider>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
