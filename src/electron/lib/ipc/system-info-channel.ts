import { IpcChannelInterface, IpcRequest } from './ipc-channel-interface';
import { IpcMainEvent } from 'electron';
import { execSync } from 'child_process';

class SystemInfoChannel implements IpcChannelInterface {
  public getName(): string {
    return 'system-info';
  }

  public handle(event: IpcMainEvent, request: IpcRequest): void {
    if (!request.responseChannel) {
      request.responseChannel = `${this.getName()}_response`;
    }

    event.sender.send(request.responseChannel, { kernel: execSync('uname -a').toString() });
  }
}

export default SystemInfoChannel
