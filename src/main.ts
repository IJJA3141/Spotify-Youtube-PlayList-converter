import dotenv from 'dotenv'
import path from 'path'
import http from 'http'

dotenv.config({ path: path.join(__dirname, '../appdata/.env') })
import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import { IIpcChannel, IpcRequest } from './electron/ipc/ipc-interfaces';
import { playlist } from './types';
import Spotify from './spotify/spotify'

class Main {
  private window_?: BrowserWindow;

  public constructor() {
    app.on('ready', this.create_)
    app.on('window-all-closed', this.close_)
    app.on('activate', this.activate_)
  }

  public sendPlaylists(_playlists: playlist[]) {
    this.window_?.webContents.send('playlists', _playlists.toString())
  }

  private create_() {
    this.window_ = new BrowserWindow({
      show: true,
      webPreferences: {
        preload: path.join(__dirname, `./electron/preload.js`),
      }
    })

    this.window_.loadFile(path.join(__dirname, `./view/index.html`))

    this.window_.webContents.devToolsWebContents

    async () => {
      const server: http.Server = http.createServer(() => { });
      server.listen(3000);
      const spotify: Spotify = new Spotify();
      await spotify.fetch();

      console.log(spotify.playlists.toString())

      this.sendPlaylists(spotify.playlists);
    }
  }

  private close_() {
    if (process.platform !== 'darwin') app.quit();
    return;
  }

  private activate_() {
    if (!this.window_) this.create_()
    return;
  }
}

const main: Main = new Main()
