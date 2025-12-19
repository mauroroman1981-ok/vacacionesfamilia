mport React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Registro robusto del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { scope: './' })
      .then(reg => console.log('SW listo para instalación'))
      .catch(err => console.error('Error en SW:', err));
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root no encontrado");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
