import { app, BrowserWindow, ipcMain, IpcMain, IpcMainEvent } from "electron";
import path from "path";
import dotenv from "dotenv";

import Spotify from "./spotify/spotify";

dotenv.config({ path: path.join(__dirname, "../appdata/.env") });

class MainProcess {
  //@ts-ignore
  public window: BrowserWindow;
  public spotify: Spotify;

  public constructor() {
    this.spotify = new Spotify(this);

    app.on("ready", this.main_);

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

  private main_(): void {
    main.window = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "./electron/preload.js"),
      },
    });

    main.window.loadFile(path.join(__dirname, "./view/index.html"));

    main.spotify.init().then(() => {
      console.log(main.spotify.playlists);
    });
  }
}

const main: MainProcess = new MainProcess();

export { MainProcess };
