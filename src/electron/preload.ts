import { IpcMainEvent, IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { playlist } from '../types'
import { IpcRequest } from './ipc/ipc-interfaces'

interface test{
  channelName:string
  
}

contextBridge.exposeInMainWorld('electron', {
  listener: (_callback:any) => {ipcRenderer.on('playlists', _callback)}
})
