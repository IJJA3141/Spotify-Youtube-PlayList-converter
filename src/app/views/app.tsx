import IpcService from "../lib/ipc-service";
import client from '../../shared/client'
import * as React from 'react'

const ipc = new IpcService();

const func = async () => {
  const t = await ipc.send<{ kernel: string }>('system-info');
  console.log(t.kernel);
}

const fonc = async () => {
  const t:client = await ipc.send<client>('client');
  console.log(t)
}

function App() {
  return (
    <div className='App'>
      <p>
        Hello World!
      </p>
      <button onClick={func}>\n</button>
      <button onClick={fonc}>43802483</button>
    </div>
  );
}

export default App;
