
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// --- Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ ZOOKA OS Service Worker registered: ', registration.scope);
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed: ', error);
      });
  });
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Critical Failure: Root element not found in DOM.");
}
