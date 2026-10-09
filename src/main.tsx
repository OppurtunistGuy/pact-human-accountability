import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker
if ('serviceWorker' in navigator && import.meta.env.MODE !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Service worker registered successfully
      })
      .catch((error) => {
        // Failed to register
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
