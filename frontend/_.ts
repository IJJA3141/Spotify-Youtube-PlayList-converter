import { playlist } from "../backend/src/types.js";
import PlaylistSelector from "./modules/playlist-selector.js";

const root: HTMLBodyElement = document.getElementById(
  "root",
) as HTMLBodyElement;
const body: HTMLDivElement = document.getElementById("body") as HTMLDivElement;
const divPlaylists: HTMLDivElement = document.getElementById(
  "playlists",
) as HTMLDivElement;
//@ts-ignore
window.api.PlaylistsSendEvent((_event: any, _playlists: playlist[]) => {
  new PlaylistSelector(document.getElementById("body"), _playlists);
});
