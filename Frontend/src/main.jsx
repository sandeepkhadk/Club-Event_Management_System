// src/main.jsx - REPLACE ENTIRE FILE
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import AppProviders from "./context/provider/AppProviders";

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProviders>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </AppProviders>
)

;