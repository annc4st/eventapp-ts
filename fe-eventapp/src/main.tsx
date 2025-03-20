import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
import store from "./store/store";  // {persistor}
import "@radix-ui/themes/styles.css";
import {Theme} from "@radix-ui/themes"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <BrowserRouter>
    <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <Theme>
    <App />
    </Theme>
    {/* </PersistGate> */}

    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
