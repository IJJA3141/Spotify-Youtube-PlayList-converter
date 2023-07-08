import { app, BrowserWindow, ipcMain } from 'electron';
import IpcChannelInterface from "./lib/ipc/ipc-channel-interface";
import SystemInfoChannel from "./lib/ipc/channels/system-info-channel";
import * as isDev from 'electron-is-dev'
import * as path from 'path'

class Main {
  //@ts-ignore
  private mainWindow_: BrowserWindow;

  public init(_ipcChannels: IpcChannelInterface[]) {
    app.on('ready', this.createWindow_);
    app.on('window-all-closed', this.onWindowAllClosed_);
    app.on('activate', this.onActivate_);

    this.registerIpcChannels_(_ipcChannels);
  }

  private onWindowAllClosed_() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate_() {
    if (!this.mainWindow_) {
      this.createWindow_();
    }
  }

  private createWindow_() {
    this.mainWindow_ = new BrowserWindow({
      height: 600,
      width: 800,
      title: `Yet another Electron Application`,
      webPreferences: {
        nodeIntegration: true
      }
    });

    this.mainWindow_.webContents.openDevTools();

    //this.mainWindow.loadFile('../../public/index.html')

    this.mainWindow_.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../../public/index.html')}`
    );
  }

  private registerIpcChannels_(_ipcChannels: IpcChannelInterface[]) {
    _ipcChannels.forEach(_channel => ipcMain.on(_channel.getName(), (_event, _request) => _channel.handle(_event, _request)));
  }
}

(new Main()).init([
  new SystemInfoChannel()
]);
