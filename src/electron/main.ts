import {app, BrowserWindow, ipcMain} from 'electron';
import {IpcChannelInterface} from "./IPC/IpcChannelInterface";
import {SystemInfoChannel} from "./IPC/SystemInfoChannel";
import * as isDev from 'electron-is-dev'
import * as path from 'path'

class Main {
  //@ts-ignore
  private mainWindow: BrowserWindow;

  public init(ipcChannels: IpcChannelInterface[]) {
    app.on('ready', this.createWindow);
    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);

    this.registerIpcChannels(ipcChannels);
  }

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

    //this.mainWindow.loadFile('../../public/index.html')
    
    this.mainWindow.loadURL(
      isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../public/index.html')}`
    );
  }

  private registerIpcChannels(ipcChannels: IpcChannelInterface[]) {
    ipcChannels.forEach(channel => ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
  }
}

(new Main()).init([
  new SystemInfoChannel()
]);
