import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('api', {
  spotify: (_callback: any) => { ipcRenderer.on('spotify', (_event: IpcRendererEvent, ..._url: any) => { _callback(_event, _url) }) },
  response: (_code: string) => { ipcRenderer.send('spotify_response', _code) }
})
