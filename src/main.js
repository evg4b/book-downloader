const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 840,
        height: 600,
        minHeight: 500,
        minWidth: 840
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    //mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

app.on('activate', () => mainWindow === null && createWindow());
