import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './app/app'

const rootElement:HTMLDivElement = document.getElementById('root') as HTMLDivElement;
const root = ReactDOM.createRoot(rootElement);

root.render(App())
