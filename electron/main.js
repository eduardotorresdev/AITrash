const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
require('./index');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 840,
        show: true,
        frame: false,
        resizable: false,
        worldSafeExecuteJavaScript: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
    });
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow.loadURL('http://localhost:3001/');
    //mainWindow.webContents.openDevTools()

    mainWindow.loadURL(startURL);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
app.on('ready', createWindow);