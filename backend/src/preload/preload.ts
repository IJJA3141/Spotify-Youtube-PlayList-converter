import { contextBridge, ipcRenderer } from 'electron';
import 'dotenv/config'

// backend (function) => frontend
// (one wai)
contextBridge.exposeInMainWorld('electron', {
})

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (_channel: string, _data: any) => ipcRenderer.send(_channel, _data),
  on: (_channel: string, _func: Function) => ipcRenderer.on(_channel, (_envet, ..._args) => _func(..._args)),
})
