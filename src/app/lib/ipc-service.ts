import { IpcRenderer } from 'electron';
import IpcRequest from "../../shared/ipc-request";

class IpcService {
  private ipcRenderer_?: IpcRenderer;

  public send<T>(_channel: string, _request: IpcRequest = {}): Promise<T> {
    if (!this.ipcRenderer_) {
      this.initializeIpcRenderer_();
    }
    if (!_request.responseChannel) {
      _request.responseChannel = `${_channel}_response_${new Date().getTime()}`
    }

    const ipcRenderer = this.ipcRenderer_;
    ipcRenderer.send(_channel, _request);

    return new Promise((_resolve) => {
      ipcRenderer.once(_request.responseChannel, (_event, _response) => _resolve(_response));
    });
  }

  private initializeIpcRenderer_() {
    if (!window || !window.process || !window.require) {
      console.log(`all should be set to false:\nwindow:${!window}\nprocess:${!window.process}\nrequire:${!window.require}`)
      throw new Error(`Unable to require renderer process`);
    }
    this.ipcRenderer_ = window.require('electron').ipcRenderer;
  }
}

export default IpcService
