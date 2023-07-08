import { IpcRenderer } from 'electron'
import IpcRequest from './../../shared/ipc-request' 

class IpcService {
  private ipcRenderer?: IpcRenderer;

  private initializeIpcRenderer() {
    if (!window || !window.process || !window.require) {
      console.log(`everithing should be set to false:\nwindow: ${!window}\nprocess: ${!window.process}\nrequire: ${!window.require}`)
      throw new Error('Unable to require renderer process');
    }
    this.ipcRenderer = window.require('electron').ipcRenderer;
  }

  public send<T>(channel: string, request: IpcRequest = {}): Promise<T> {
    if(!this.ipcRenderer) {
      this.initializeIpcRenderer();
    }

    if(!request.responseChannel) {
      request.responseChannel = `${channel}_response_${new Date().getTime()}`;
    }

    const ipcRenderer = this.ipcRenderer;
    // @ts-ignore
    ipcRenderer.send(channel, request);

    return new Promise(resolve => {
      ipcRenderer.once(request.responseChannel, (event, response) => resolve(response));
    })
  }
}

export default IpcService
