import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";

import { playlist } from "../types";

contextBridge.exposeInMainWorld("api", {
  //  spotify: (_callback: any) => { ipcRenderer.on('spotify', (_event: IpcRendererEvent, ..._url: any) => { _callback(_event, _url) }) },
  //  response: (_code: string) => { ipcRenderer.send('spotify_response', _code) }
  PlaylistsSendEvent: (_callback: any) => {
    ipcRenderer.on(
      "PlaylistsSendEvent",
      (_event: IpcRendererEvent, _playlists: playlist[]) => {
        _callback(_event, _playlists);
      },
    );
  },
  PlayListSelectionEvent: (_index: number) => {
    ipcRenderer.send("PlaylistSelectionResponse", _index);
  },
});
