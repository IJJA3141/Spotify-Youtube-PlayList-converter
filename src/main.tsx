import {BrowserWindow, app, ipcMain} from "electron";

let mainWindows : BrowserWindow;

app.on("ready", createWindows)

function createWindows ():void {
  mainWindows = new BrowserWindow({
    width: 900, height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js"
    }
  })
}
