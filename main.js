const {
    app,
    BrowserWindow,
    Menu,
    MenuItem
} = require('electron');

const path = require('path');
const url = require('url');
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
        click: () => {
            console.log('item 1 clicked')
        },
    }));
    menu.append(new MenuItem({
        label: '~ Обновить',
        click: () => {
            console.log('item 2 clicked')
        }
    }));
    menu.append(new MenuItem({
        label: 'Вперед ->',
        click() {
            console.log('item 3 clicked')
        }
    }));
    menu.append(new MenuItem({ type: 'separator' }));
    
    menu.append(new MenuItem({
        label: 'Скачать всю книгу',
        click: () => {
            mainWindow.webContents.send('asynchronous-message', 123123);
        }
    }));
    menu.append(new MenuItem({
        label: 'Скачать дипазон страниц',
        click: () => {
            console.log('item 3 clicked')
        }
    }));
    mainWindow.setMenu(menu);
    //https://biblioclub.ru/index.php?page=book_view_red&book_id=429786
    var initUrl = 'https://biblioclub.ru/index.php?page=main_ub_red&needauth=1'
    mainWindow.loadURL(initUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null
    });
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
