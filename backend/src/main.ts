import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import path from "path";
import dotenv from "dotenv";

import Spotify from "./spotify/spotify";
import { track, playlist } from "./types";

dotenv.config({ path: path.join(__dirname, "../appdata/.env") });

class MainProcess {
  //@ts-ignore
  public window: BrowserWindow;
  public spotify: Spotify;

  public constructor() {
    this.spotify = new Spotify(this);

    app.on("ready", this.main_);
    ipcMain.on("PlaylistSelectionResponse", this.handlePaylistSelection);

    return;
  }

  public open(_url: string, _resolve: any): void {
    const win: BrowserWindow = new BrowserWindow();
    win.loadURL(_url);

    win.webContents.on("will-redirect", (_event: any) => {
      _resolve(_event.url);
      win.close();
    });

    win.show();

    return;
  }

  private async main_(): Promise<void> {
    main.window = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "./electron/preload.js"),
      },
    });

    main.window.loadFile(path.join(__dirname, "../../frontend/_.html"));

    const playlists = await main.spotify.getPlaylists();
    main.window.webContents.send("PlaylistsSendEvent", playlists);
  }

  private async handlePaylistSelection(
    _event: IpcMainEvent,
    _index: number,
  ): Promise<void> {
    const playlistPromise: Promise<playlist[]> = main.spotify.playlist(_index);
    //const fsPromise: Promise<playlist>

    let playlists: playlist[] = await playlistPromise;
    //tracks: track[] = await fsPromise

    console.log(playlists[_index].tracks);

    return new Promise<void>((_resolve) => {
      _resolve();
    });
  }
}

const main: MainProcess = new MainProcess();

export { MainProcess };
