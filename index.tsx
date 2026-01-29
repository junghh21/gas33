
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const statusEl = document.getElementById('status-update');

console.log("[GAS ENGINE] Initializing React Application...");

if (statusEl) {
  statusEl.innerText = "React 구성 요소를 마운트하는 중...";
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
      statusEl.innerText = "런타임 오류 발생: " + (err instanceof Error ? err.message : String(err));
    }
  }
} else {
  console.error("[GAS ENGINE] Mount point #root not found.");
}
