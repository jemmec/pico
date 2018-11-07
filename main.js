
const { ipcMain, app, BrowserWindow, globalShortcut } = require('electron');
var mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        'minWidth': 600,
        'minHeight': 400,
        'acceptFirstMouse': true,
        frame: false,
        backgroundColor: '#202020',
        show: false,
        icon: 'src/icons/icon_32.ico',
    })
    mainWindow.loadFile('index.html')
    mainWindow.on('closed', function () {
        mainWindow = null;
    })
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
})

ipcMain.on('get-file-data', function (e) {
    var data = null;
    if (process.platform == 'win32' && process.argv.length >= 2) {
        var openFilePath = process.argv[1];
        data = openFilePath;
    }
    e.returnValue = data;
});

