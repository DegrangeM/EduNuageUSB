// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron')
const path = require('path')
const child = require('child_process').execFile;
const fs = require('fs')
const ini = require('ini');
const { workerData } = require('worker_threads');

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 150,
    useContentSize: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'logo.png')
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  const loginWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // loginWindow.loadURL('https://nuage.apps.education.fr')
  loginWindow.webContents.on('dom-ready', function () {
    const currentURL = new URL(this.getURL())
    if (/^nuage[0-9]+\.apps\.education\.fr$/.test(currentURL.hostname)) {
      if (currentURL.pathname === '/index.php/logout') {
        loginWindow.close();
      } else {
        loginWindow.hide();
        loginWindow.webContents.executeJavaScript(
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
            loginWindow.webContents.executeJavaScript('location.href = new URL(location.href).origin + "/index.php/logout?requesttoken=" + window.oc_requesttoken;', true);
            loginName = r.loginName;
            token = r.token;
            child(".\\rclone\\rclone.exe",
              [
                'config',
                'create',
                'EduNuageUSB',
                'webdav',
                'vendor=nextcloud',
                'url="https://nuage03.apps.education.fr/remote.php/dav/files/' + loginName + '/"',
                'user="' + loginName + '"',
                'pass="' + token + '"',
                '--obscure',
                '--config',
                './.rclone.conf',
              ], function (err, data) {
                console.log(err)
                console.log(data.toString());
              });
          }
        );
      }
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  let account;
  try {
    const rcloneConfig = ini.parse(fs.readFileSync('./rclone/.rclone.conf', 'utf-8'))
    if (rcloneConfig.EduNuageUSB) {
      account.server = new URL(rcloneConfig.EduNuageUSB.hostname)
      account.username = rcloneConfig.EduNuageUSB.user
    } else {
      account = false;
    }
  } catch (e) {
    // le fichier rclone n'existe pas
    account = false;
  }

  createWindow()
})

app.on('window-all-closed', function () {
  app.quit()
})
