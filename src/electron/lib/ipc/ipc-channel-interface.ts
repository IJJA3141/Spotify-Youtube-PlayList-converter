import { IpcMainEvent } from 'electron';
import IpcRequest from "../../../shared/ipc-request";

interface IpcChannelInterface {
  getName(): string;

  handle(event: IpcMainEvent, request: IpcRequest): void;
}

export default IpcChannelInterface
