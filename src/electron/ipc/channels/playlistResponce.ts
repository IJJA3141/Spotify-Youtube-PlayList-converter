import { IpcMainEvent } from "electron";
import { IIpcChannel, IpcRequest } from "../ipc-interfaces";

class CPlaylistResponse implements IIpcChannel {
  name: string = 'playlistResponse'
  handle(_event: IpcMainEvent, _request: IpcRequest):void {
    if(!_request.resonseChannel) _request.resonseChannel = `${this.name}_response`
    _event.sender.send(_request.resonseChannel, )
  } 
}
