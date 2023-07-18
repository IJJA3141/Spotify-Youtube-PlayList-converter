import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron'
import isDev from 'electron-is-dev'
import * as path from 'path'
import IpcChannelInterface from './ipc/ipc-channel-interface';
import IpcRequest from '../../shared/ipc-request';
import TestIpc from './ipc/channels/test';

class Main {
  //@ts-ignore
  private mainWindow_: BrowserWindow = new Set<BrowserWindow>;

  public init(_ipcChannels: IpcChannelInterface[]) {
    console.log('main init')

    app.on('ready', this.createWindow_);
    app.on('window-all-closed', this.onWindowAllClosed_);
    app.on('activate', this.onActivate_);

    this.registerIpcChannels_(_ipcChannels)
  }

  public fetchAutorizationCode(_url: string): Promise<string> {
    return new Promise((_resolve) => {
      this.mainWindow_.loadURL(_url);
      this.mainWindow_.show();
      this.mainWindow_.webContents.on('will-navigate', (_event: any, _response: string) => _resolve(_response))
    })
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
      transparent: true,
      frame: false,
      title: `Yet another Electron Application`,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, './preload/preload.js')
      }
    });

    this.mainWindow_.webContents.openDevTools();

    this.mainWindow_.loadURL(isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../../frontend/build/index.html')}`
    );
  }

  private registerIpcChannels_(_ipcChannels: IpcChannelInterface[]) {
    _ipcChannels.forEach(_channel => ipcMain.on(_channel.name, (_event: IpcMainEvent, _request: IpcRequest) => _channel.handle(_event, _request)))
  }
}

const main: Main = new Main()
main.init([new TestIpc()])

export default Main
