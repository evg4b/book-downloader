const {
    app,
    BrowserWindow,
    Menu,
    MenuItem
} = require('electron');
const path = require('path');
const axios = require('axios');
const url = require('url');
// require('ssl-root-cas/latest')
//     .inject();
let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: __dirname + '/downloader.js'
        }
    });
    const menu = new Menu();
    menu.append(new MenuItem({
        label: '<- Назад',
        click: () => mainWindow.webContents.send('back')
    }));
    menu.append(new MenuItem({
        label: '~ Обновить',
        click: () => mainWindow.webContents.send('refresh')
    }));
    menu.append(new MenuItem({
        label: 'Вперед ->',
        click: () => mainWindow.webContents.send('forward')
    }));
    menu.append(new MenuItem({ type: 'separator' }));
    
    menu.append(new MenuItem({
        label: 'Скачать всю книгу',
        click: () => mainWindow.webContents.send('download-all', axios)
    }));
    mainWindow.setMenu(menu);
    //mainWindow.loadURL('https://biblioclub.ru/index.php?page=main_ub_red&needauth=1');
    mainWindow.loadURL('https://biblioclub.ru/index.php?page=book_view_red&book_id=429786');
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null
    });
    mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
        console.log(event, url, frameName, disposition, options, additionalFeatures);
        if (frameName === 'modal') {
            // open window as modal
            event.preventDefault();
            Object.assign(options, {
                modal: true,
                parent: mainWindow,
                width: 300,
                height: 200,
                frame: false,
                url: url
            });
            const modal = new BrowserWindow(options);
            modal.setMenu(null);
            modal.loadURL(url);
            event.newGuest = modal;
        }
    })
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
