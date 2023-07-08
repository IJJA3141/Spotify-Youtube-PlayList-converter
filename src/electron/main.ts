import {app, BrowserWindow, ipcMain} from 'electron';
import {IpcChannelInterface} from "./lib/ipc/IpcChannelInterface";
import {SystemInfoChannel} from "./lib/ipc/SystemInfoChannel";
import * as path from 'path'
import * as isDev from 'electron-is-dev'

class Main {
  // @ts-ignore
  private mainWindow: BrowserWindow;

  private onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate() {
    if (!this.mainWindow) {
      this.createWindow();
    }
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      title: `Yet another Electron Application`,
      webPreferences: {
        nodeIntegration: true
      }
    });

    this.mainWindow.webContents.openDevTools();
    
    this.mainWindow.loadURL(isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../public/index.html')}`
    )
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }

  public init(ipcChannels: IpcChannelInterface[]) {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    this.registerIpcChannels(ipcChannels);
  }
}

(new Main).init([new SystemInfoChannel()]);
