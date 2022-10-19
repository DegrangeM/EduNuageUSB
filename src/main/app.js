const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const execFile = require('child_process').execFile;
const spawn = require('child_process').spawn;
const fs = require('fs')
const ini = require('ini');

const EduNuageUSB = {
  account: false
}

const sauvegarder = require('./lib/sauvegarder.js')(EduNuageUSB);
const restaurer = require('./lib/restaurer.js')(EduNuageUSB);
const login = require('./lib/login.js')(EduNuageUSB);
const logout = require('./lib/logout.js')(EduNuageUSB);

app.whenReady().then(() => {

  try {
    const rcloneConfig = ini.parse(fs.readFileSync('./.rclone.conf', 'utf-8'))
    if (rcloneConfig.EduNuageUSB) {
      EduNuageUSB.account = {
        server: new URL(rcloneConfig.EduNuageUSB.url).hostname,
        username: rcloneConfig.EduNuageUSB.user
      };
    } else {
      EduNuageUSB.account = false;
    }
  } catch (e) {
    console.log(e);
    // le fichier rclone n'existe pas
    EduNuageUSB.account = false;
  }

  ipcMain.handle('getAccount', async () => EduNuageUSB.account);

  ipcMain.handle('login', login);
  ipcMain.handle('logout', logout);
  ipcMain.handle('sauvegarder', sauvegarder);
  ipcMain.handle('restaurer', restaurer);

  EduNuageUSB.mainWindow = new BrowserWindow({
    width: 600,
    height: 150,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/app.js')
    },
    icon: path.join(__dirname, '../../resources/logo.png')
  })

  EduNuageUSB.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
})

app.on('window-all-closed', function () {
  app.quit()
})