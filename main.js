// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const child = require('child_process').execFile;
const child2 = require('child_process').exec;
const fs = require('fs')
const ini = require('ini');

// TODO : RELOAD AFTER LOGIN/OUT

const EduNuageUSB = {
  account: false
}
let account;

function loadMainPage() {
  EduNuageUSB.mainWindow.loadFile('index.html')
}

function createWindow() {

  ipcMain.handle('getAccount', async () => EduNuageUSB.account);

  ipcMain.handle('login', login);
  ipcMain.handle('logout', logout);
  ipcMain.handle('sauvegarder', sauvegarder);


  // Create the browser window.
  EduNuageUSB.mainWindow = new BrowserWindow({
    width: 600,
    height: 150,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'logo.png')
  })

  loadMainPage();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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

  createWindow()
})

app.on('window-all-closed', function () {
  app.quit()
})

function login() {

  EduNuageUSB.loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  EduNuageUSB.loginWindow.loadURL('https://nuage.apps.education.fr')

  EduNuageUSB.loginWindow.webContents.on('dom-ready', function () {
    const currentURL = new URL(this.getURL())
    if (/^nuage[0-9]+\.apps\.education\.fr$/.test(currentURL.hostname)) {
      if (currentURL.pathname === '/index.php/logout') {
        EduNuageUSB.loginWindow.close();
      } else {
        EduNuageUSB.loginWindow.hide();
        EduNuageUSB.loginWindow.webContents.executeJavaScript(
          `fetch(new URL(location.href).origin + '/index.php/settings/personal/authtokens', {
            method: 'POST',
            body: '{"name":"EduNuageUSB"}',
            headers:{
              'requesttoken': window.oc_requesttoken,
              'Content-Type': 'application/json'
            }
          }).then(
            r => r.json()
          )`,
          true
        ).catch(
          e => {
            dialog.showErrorBox("Erreur lors de la création de la clef d'application", e)
            app.quit()
          }
        ).then(
          r => {
            EduNuageUSB.loginWindow.webContents.executeJavaScript('location.href = new URL(location.href).origin + "/index.php/logout?requesttoken=" + window.oc_requesttoken;', true);
            loginName = r.loginName;
            token = r.token;
            console.log(token)
            EduNuageUSB.account = {
              username: loginName,
              server: currentURL.hostname
            }
            child(".\\rclone\\rclone.exe",
              [
                'config',
                'create',
                'EduNuageUSB',
                'webdav',
                'vendor=nextcloud',
                'url=https://nuage03.apps.education.fr/remote.php/dav/files/' + loginName + '/',
                'user=' + loginName,
                'pass=' + token,
                '--obscure',
                '--config',
                './.rclone.conf',
              ], function (err, data) {
                console.log(err)
                console.log(data.toString());
              }
            );
            loadMainPage();
          }
        );
      } // endif not logout
    } // endif nuage url
  }); // dom-ready
}

function logout() {
  EduNuageUSB.account = false;
  child(".\\rclone\\rclone.exe",
    [
      'config',
      'delete',
      'EduNuageUSB',
      '--config',
      './.rclone.conf',
    ], function (err, data) {
      console.log(err)
      console.log(data.toString());
    }
  );
  loadMainPage();
}

function sauvegarder() {
  child(".\\rclone\\rclone.exe",
  [
    'sync',
    '../.',
    'EduNuageUSB:EduNuageUSB',
    '--config',
    './.rclone.conf',
  ], function (err, data) {
    console.log(err)
    console.log(data.toString());
  }
);
}

function restaurer() {

}