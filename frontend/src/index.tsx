import React from 'react';
import ReactDOM from 'react-dom/client';

import Logging from './views/logging/logging'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let l = <Logging message=''/>

console.log('?')

root.render(
  <React.StrictMode>
    {l}
  </React.StrictMode>
);
