"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const SystemInfoChannel_1 = require("./lib/ipc/SystemInfoChannel");
const path = __importStar(require("path"));
const isDev = __importStar(require("electron-is-dev"));
class Main {
    onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    }
    onActivate() {
        if (!this.mainWindow) {
            this.createWindow();
        }
    }
    createWindow() {
        this.mainWindow = new electron_1.BrowserWindow({
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
            : `file://${path.join(__dirname, '../../public/index.html')}`);
    }
    registerIpcChannels(ipcChannels) {
        ipcChannels.forEach(channel => electron_1.ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
    }
    init(ipcChannels) {
        electron_1.app.on('ready', this.createWindow);
        electron_1.app.on('window-all-closed', this.onWindowAllClosed);
        electron_1.app.on('activate', this.onActivate);
        this.registerIpcChannels(ipcChannels);
    }
}
(new Main).init([new SystemInfoChannel_1.SystemInfoChannel()]);
//# sourceMappingURL=main.js.map