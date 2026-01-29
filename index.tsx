
import React from 'https://esm.sh/react@19.0.0';
import ReactDOM from 'https://esm.sh/react-dom@19.0.0/client';
import App from './App';

const rootElement = document.getElementById('root');
const statusEl = document.getElementById('status-update');

console.log("[GAS ENGINE] Initializing React Application...");

if (statusEl) {
  statusEl.innerText = "Mounting UI Components...";
}

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("[GAS ENGINE] Application mounted successfully.");
  } catch (err) {
    console.error("[GAS ENGINE] Initialization failed:", err);
    if (statusEl) {
      statusEl.innerText = "Runtime Error: " + (err instanceof Error ? err.message : String(err));
    }
  }
} else {
  console.error("[GAS ENGINE] Mount point #root not found.");
}
