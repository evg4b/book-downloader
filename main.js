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
        width: 840,
        height: 600,
        minHeight: 500,
        minWidth: 840,
        webPreferences: {
            preload: __dirname + '/downloader.js'
        }
    });
    mainWindow.setMenu(null);
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    mainWindow.webContents.openDevTools();
    //
    //
    // const menu = new Menu();
    // menu.append(new MenuItem({
    //     label: '<- Назад',
    //     click: () => mainWindow.webContents.send('back')
    // }));
    // menu.append(new MenuItem({
    //     label: '~ Обновить',
    //     click: () => mainWindow.webContents.send('refresh')
    // }));
    // menu.append(new MenuItem({
    //     label: 'Вперед ->',
    //     click: () => mainWindow.webContents.send('forward')
    // }));
    // menu.append(new MenuItem({ type: 'separator' }));
    //
    // menu.append(new MenuItem({
    //     label: 'Скачать всю книгу',
    //     click: () => mainWindow.webContents.send('download-all', axios)
    // }));
    // menu.append(new MenuItem({
    //     label: 'Скачать lbfgfpjy',
    //     click: () => mainWindow.webContents.send('download-range', axios)
    // }));
    // mainWindow.setMenu(menu);
    // //mainWindow.loadURL('https://biblioclub.ru/index.php?page=main_ub_red&needauth=1');
    // mainWindow.loadURL('https://biblioclub.ru/index.php?page=book_view_red&book_id=429786');
    // mainWindow.webContents.openDevTools();
    // mainWindow.on('closed', () => {
    //     mainWindow = null
    // });
    // mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    //     console.log(event);
    //     console.log(url);
    //     console.log(frameName);
    //     console.log(disposition);
    //     console.log(options)
    //     console.log(additionalFeatures);
    //     if (frameName === 'modal') {
    //         // open window as modal
    //         event.preventDefault();
    //         Object.assign(options, {
    //             modal: true,
    //             parent: mainWindow,
    //             width: 300,
    //             height: 200,
    //             frame: false,
    //             url: url
    //         });
    //         const modal = new BrowserWindow(options);
    //         modal.setMenu(null);
    //         modal.loadURL(url);
    //         event.newGuest = modal;
    //     }
    // })
});

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

app.on('activate', () => mainWindow === null && createWindow());
