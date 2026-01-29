
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.group("[GAS ENGINE V2.5 STARTUP]");
console.log("React Version:", React.version);

const rootElement = document.getElementById('root');
const statusEl = document.getElementById('status-update');

if (statusEl) statusEl.innerText = "React 루트 마운트 시도 중...";

if (!rootElement) {
  console.error("Mount Point (#root) Not Found!");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("React Mount Successful.");
  } catch (err) {
    console.error("React Initial Render Failed:", err);
    rootElement.innerHTML = `
      <div style="padding:40px; text-align:center; background: white; min-height: 100vh;">
        <h1 style="color:#ef4444; font-weight:900; font-size: 24px;">Render Failure</h1>
        <p style="margin-top:20px; color: #666;">${err instanceof Error ? err.message : String(err)}</p>
        <button onclick="window.location.reload()" style="margin-top:20px; padding:10px 20px; background:#2563eb; color:white; border:none; border-radius:8px; cursor:pointer;">재시도</button>
      </div>
    `;
  }
}
console.groupEnd();
