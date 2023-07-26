import { IpcMainEvent } from 'electron'

interface IpcRequest {
  resonseChannel?: string;
  params?: string[]
}

interface IIpcChannel {
  name?: string
  handle(event: IpcMainEvent, request: IpcRequest): void;
}

export { IIpcChannel, IpcRequest }
