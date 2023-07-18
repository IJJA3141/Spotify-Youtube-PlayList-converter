import { IpcMainEvent } from 'electron';
import IpcChannelInterface from '../ipc-channel-interface';
import IpcRequest from '../../../../shared/ipc-request';

class TestIpc implements IpcChannelInterface {
  public name:string = 'TestIpc'

  public handle(_event: IpcMainEvent, _request: IpcRequest): void {
    if(!_request.responseChannel) _request.responseChannel = `${this.name}_response`;
    console.log(_request.params)
  }
}

export default TestIpc
