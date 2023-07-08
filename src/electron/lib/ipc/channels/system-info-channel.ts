import IpcChannelInterface from "../ipc-channel-interface";
import { IpcMainEvent } from 'electron';
import IpcRequest from "../../../../shared/ipc-request";
import { execSync } from "child_process";

class SystemInfoChannel implements IpcChannelInterface {
  public getName(): string {
    return 'system-info';
  }

  public handle(_event: IpcMainEvent, _request: IpcRequest): void {
    if (!_request.responseChannel) {
      _request.responseChannel = `${this.getName()}_response`;
    }
    _event.sender.send(_request.responseChannel, { kernel: execSync('systeminfo').toString() });
  }
}

export default SystemInfoChannel
