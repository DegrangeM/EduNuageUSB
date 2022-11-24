const { BrowserWindow, session } = require('electron')
const path = require('path')
const execFile = require('child_process').execFile;
const fs = require('fs')

function login(EduNuageUSB) {
    return () => {

        EduNuageUSB.loginWindow = new BrowserWindow({
            width: 800,
            height: 600,
            parent: EduNuageUSB.mainWindow,
            modal: true,
            autoHideMenuBar: true,
        });

        EduNuageUSB.loginWindow.loadURL('https://nuage.apps.education.fr')

        EduNuageUSB.loginWindow.webContents.on('dom-ready', function () {
            const currentURL = new URL(this.getURL())
            if(EduNuageUSB.log) {
                fs.appendFile('log.txt', currentURL + '\n', () => {});
            }
            if (/^nuage[0-9]+\.apps\.education\.fr$/.test(currentURL.hostname)) {
                if (currentURL.pathname === '/index.php/logout') {
                    // La page de déconnexion a été chargée, on peut fermer la fenêtre
                    EduNuageUSB.loginWindow.close();
                    // On efface les cookies afin de déconnecter immédiatement la connexion à l'authentification académique
                    //https://github.com/electron/electron/blob/main/docs/api/session.md
                    session.defaultSession.clearStorageData();
                } else {
                    // On est conencté au nextcloud, on masque la fenêtre et génère le token d'application
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
                            // On redirige vers la page de déconnexion afin de retirer la session de la liste des connexions actives
                            EduNuageUSB.loginWindow.webContents.executeJavaScript('location.href = new URL(location.href).origin + "/index.php/logout?requesttoken=" + window.oc_requesttoken;', true);
                            loginName = r.loginName;
                            token = r.token;
                            EduNuageUSB.account = {
                                username: loginName,
                                server: currentURL.hostname
                            }
                            execFile(path.join(__dirname, "../../../rclone/rclone.exe"),
                                [
                                    'config',
                                    'create',
                                    'EduNuageUSB',
                                    'webdav',
                                    'vendor=nextcloud',
                                    'url=https://' + EduNuageUSB.account.server + '/remote.php/dav/files/' + loginName + '/',
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
                            EduNuageUSB.mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'))
                        }
                    );
                } // endif not logout
            } // endif nuage url
            else if (currentURL.href === 'https://nuage.apps.education.fr/') {
                // Il est possible que l'utilisateur n'ait pas de compte LaBoite
                // Il va lui être demandé d'en créer un mais cela ouvre une nouvelle fenêtre non traçable
                // On remplace l'ouverture d'une nouvelle fenêtre par une rediraction
                EduNuageUSB.loginWindow.webContents.executeJavaScript(`
                    window.open2 = window.open;
                    window.open = function(url) {
                        location.replace(url);
                    };
                `);
                // On aurait aussi pu utiliser https://www.electronjs.org/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler
            }
        }); // dom-ready
    }
}

module.exports = login;
