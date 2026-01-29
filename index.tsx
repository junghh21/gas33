
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.group("[GAS ENGINE V2.5 STARTUP]");
console.log("React Version:", React.version);

const rootElement = document.getElementById('root');

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
      <div style="padding:40px; text-align:center;">
        <h1 style="color:red; font-weight:bold;">Render Failure</h1>
        <p style="margin-top:10px;">${err instanceof Error ? err.message : String(err)}</p>
      </div>
    `;
  }
}
console.groupEnd();
