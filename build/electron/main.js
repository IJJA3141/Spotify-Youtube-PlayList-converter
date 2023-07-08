"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const SystemInfoChannel_1 = require("./IPC/SystemInfoChannel");
const isDev = __importStar(require("electron-is-dev"));
const path = __importStar(require("path"));
class Main {
    init(ipcChannels) {
        electron_1.app.on('ready', this.createWindow);
        electron_1.app.on('window-all-closed', this.onWindowAllClosed);
        electron_1.app.on('activate', this.onActivate);
        this.registerIpcChannels(ipcChannels);
    }
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
        //this.mainWindow.loadFile('../../public/index.html')
        this.mainWindow.loadURL(isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../../public/index.html')}`);
    }
    registerIpcChannels(ipcChannels) {
        ipcChannels.forEach(channel => electron_1.ipcMain.on(channel.getName(), (event, request) => channel.handle(event, request)));
    }
}
(new Main()).init([
    new SystemInfoChannel_1.SystemInfoChannel()
]);
//# sourceMappingURL=main.js.map