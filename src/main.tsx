import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/global.scss";
import "./styles/toast.scss";

createRoot(document.getElementById('root')!).render(
    <App />
)
