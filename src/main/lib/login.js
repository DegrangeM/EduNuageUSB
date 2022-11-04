const { BrowserWindow, session } = require('electron')
const path = require('path')
const execFile = require('child_process').execFile;

function login(EduNuageUSB) {
    return () => {

        EduNuageUSB.loginWindow = new BrowserWindow({
            width: 800,
            height: 600,
            parent: EduNuageUSB.mainWindow,
            modal: true,
            autoHideMenuBar: false,
        });

        EduNuageUSB.loginWindow.loadURL('about:blank')

        setTimeout(()=> {

            EduNuageUSB.loginWindow.loadURL('https://nuage.apps.education.fr')

            EduNuageUSB.loginWindow.webContents.on('dom-ready', function () {
                const currentURL = new URL(this.getURL())
                if (/^nuage[0-9]+\.apps\.education\.fr$/.test(currentURL.hostname)) {
                    if (currentURL.pathname === '/index.php/logout') {
                        // La page de déconnexion a été chargée, on peut fermer la fenêtre
                        // EduNuageUSB.loginWindow.close();
                        // On efface les cookies afin de déconnecter immédiatement la connexion à l'authentification académique
                        //https://github.com/electron/electron/blob/main/docs/api/session.md
                        // session.defaultSession.clearStorageData();
                    } else {
                        // On est conencté au nextcloud, on masque la fenêtre et génère le token d'application
                        //EduNuageUSB.loginWindow.hide();
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
                                EduNuageUSB.mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'))
                            }
                        );
                    } // endif not logout
                } // endif nuage url
            }); // dom-ready

        }, 10000)
        
        
    }
}

module.exports = login;
