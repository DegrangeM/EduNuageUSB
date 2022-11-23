const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const fsPromise = require('fs/promises')

const EduNuageUSB = {
  account: false,
  log: false
}

const sauvegarder = require('./lib/sauvegarder.js')(EduNuageUSB);
const restaurer = require('./lib/restaurer.js')(EduNuageUSB);
const login = require('./lib/login.js')(EduNuageUSB);
const logout = require('./lib/logout.js')(EduNuageUSB);
const loadRcloneConf = require('./lib/loadRcloneConf.js')(EduNuageUSB);
const openNC = require('./lib/openNC.js')(EduNuageUSB);

app.whenReady().then(() => {

  loadRcloneConf();

  ipcMain.handle('getAccount', async () => EduNuageUSB.account);

  ipcMain.handle('login', login);
  ipcMain.handle('logout', logout);
  ipcMain.handle('sauvegarder', sauvegarder);
  ipcMain.handle('restaurer', restaurer);
  ipcMain.handle('openNC', openNC);

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

  fsPromise.access('log.txt').then(() => {
    // Le fichier log.txt existe, on active les logs
    EduNuageUSB.log = true;
    console.log('Logs activés')
  }).catch(() => {
    // Le fichier log.txt n'existe pas, on désactive les logs
    // (inutile car déjà sur false par défaut)
    EduNuageUSB.log = false;
    console.log('Logs désactivés')
  });

});

app.on('window-all-closed', function () {
  app.quit()
});