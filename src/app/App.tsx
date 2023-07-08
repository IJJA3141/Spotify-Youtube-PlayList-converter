import { IpcService } from "./IpcService";
import * as React from 'react'

const ipc = new IpcService();

const func = async () => {
  const t = await ipc.send<{ kernel: string }>('system-info');
  console.log(t.kernel);
}

function App() {
  return (
    <div className='App'>
      <p>
        Hello World!
      </p>
      <button onClick={func}>\n</button>
    </div>
  );
}

export default App;
