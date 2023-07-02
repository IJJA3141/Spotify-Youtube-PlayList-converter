import {BrowserWindow, app} from "electron";
const path = require('path')

function createWindow(){
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
    }
  })

  win.loadFile(path.join(__dirname, '../main.html'));
}
