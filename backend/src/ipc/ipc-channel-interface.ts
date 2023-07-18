import { IpcMainEvent } from 'electron'
import IpcRequest from '../../../shared/ipc-request'

interface IpcChannelInterface {
  name:string,
  handle(_envent: IpcMainEvent, _request: IpcRequest): void,
}

export default IpcChannelInterface
