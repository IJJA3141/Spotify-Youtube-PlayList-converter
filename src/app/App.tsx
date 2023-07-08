import IpcService from './ipc/ipc-service'

const ipc = new IpcService();

async function click():Promise<void>{
  const t = await ipc.send<{ kernel: string }>('system-info');
  console.log(t.kernel)
  return new Promise(()=>{});
};

function App() {
  return (
    <div className='App'>
      <button onClick={click}>os info</button>
      <p>
        Hello World!
      </p>
    </div>
  );
}

export default App;
