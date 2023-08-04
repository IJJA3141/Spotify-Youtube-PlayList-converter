import { app, BrowserWindow, ipcMain, IpcMainEvent } from "electron";
import path from "path";

import Spotify from "./spotify/spotify";

class MainProcess {
  public test: string = "fjksda;fjdkl";

  public window_?: BrowserWindow;
  public spotify_: Spotify;
  //private youtue: youtube

  public constructor() {
    console.log(`1: ${Spotify.tesmorts}`);

    this.spotify_ = new Spotify(this);

    console.log(`2: ${Spotify.tesmorts}`);

    app.on("ready", this.main_);
  }

  public send(_channel: string, _url: string): void {
    console.log("sending stuff");
    // @ts-ignore
    this.window_.webContents.send(_channel, _url);
    return;
  }

  private main_(): void {
    main.window_ = new BrowserWindow({
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "./electron/preload.js"),
      },
    });

    main.window_.loadFile(path.join(__dirname, "./view/index.html"));

    ipcMain.on("spotify_response", (_event: IpcMainEvent, _code: string) => {
      main.spotify_.resolveCode(_code);
    });
    ipcMain.on("youtube_response", (_event: IpcMainEvent, _code: string) => {});

    console.log(`3: ${Spotify.tesmorts}`);

    console.log(`?: ${this.test}`);

    main.spotify_.init();
  }
}
const main: MainProcess = new MainProcess();

export { MainProcess };
