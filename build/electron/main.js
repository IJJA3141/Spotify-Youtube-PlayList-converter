"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const system_info_channel_1 = __importDefault(require("./lib/ipc/channels/system-info-channel"));
const isDev = __importStar(require("electron-is-dev"));
const path = __importStar(require("path"));
class Main {
    init(_ipcChannels) {
        electron_1.app.on('ready', this.createWindow_);
        electron_1.app.on('window-all-closed', this.onWindowAllClosed_);
        electron_1.app.on('activate', this.onActivate_);
        this.registerIpcChannels_(_ipcChannels);
    }
    onWindowAllClosed_() {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    }
    onActivate_() {
        if (!this.mainWindow_) {
            this.createWindow_();
        }
    }
    createWindow_() {
        this.mainWindow_ = new electron_1.BrowserWindow({
            height: 600,
            width: 800,
            title: `Yet another Electron Application`,
            webPreferences: {
                nodeIntegration: true
            }
        });
        this.mainWindow_.webContents.openDevTools();
        //this.mainWindow.loadFile('../../public/index.html')
        this.mainWindow_.loadURL(isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../../public/index.html')}`);
    }
    registerIpcChannels_(_ipcChannels) {
        _ipcChannels.forEach(_channel => electron_1.ipcMain.on(_channel.getName(), (_event, _request) => _channel.handle(_event, _request)));
    }
}
(new Main()).init([
    new system_info_channel_1.default()
]);
//# sourceMappingURL=main.js.map