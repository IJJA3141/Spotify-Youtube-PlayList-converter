import * as ReactDOM from 'react-dom/client';
import React from 'react';
import App from './app/App';

const rootElement:HTMLDivElement = document.getElementById('root') as HTMLDivElement;
const root:ReactDOM.Root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
