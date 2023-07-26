import { IpcRendererEvent } from "electron"
import { playlist } from "../types"

const api = window as any

api.electron.listener((_event:IpcRendererEvent, _playlists:playlist[])=>{
  console.log(_playlists)
})
