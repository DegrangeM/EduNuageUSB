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
            if (EduNuageUSB.log) {
                fs.appendFile('log.txt', currentURL + '\n', () => { });
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
            /*
                Problématique : l'enseignant qui se connecte pour la première fois n'a pas de compte LaBoîte
                Lors de son premier accès, il lui sera demandé de se créer un compte LaBoite
                Cela le sort du processus classique de EduNuageUSB, il faut donc gérer ça.
                Le gros problème est qu'une fois le compte LaBoîte créé, l'enseignant n'est pas redirigé vers
                nuage. Il faut donc le rediriger vers nuage une fois le compte LaBoite créé. Il n'est pas
                nécessaire que l'enseignant choisisse sa structure.
            */
            else if (currentURL.href === 'https://nuage.apps.education.fr/') {
                // Il est possible que l'utilisateur n'ait pas de compte LaBoite
                // Il va lui être demandé d'en créer un mais cela ouvre une nouvelle fenêtre non traçable
                // On remplace l'ouverture d'une nouvelle fenêtre par une redirection
                EduNuageUSB.loginWindow.webContents.executeJavaScript(`
                    window.open2 = window.open;
                    window.open = function(url) {
                        if(url==="https://portail.apps.education.fr/signin") {
                            url = "https://portail.apps.education.fr/"
                            // On redirige vers cette page pour éviter de déclancher la condition suivante
                            // Le site redirigera localement vers /signin mais sans déclancher la condition suivante
                        }
                        location.replace(url);
                    };0
                `);
                // On aurait aussi pu utiliser https://www.electronjs.org/docs/latest/api/web-contents#contentssetwindowopenhandlerhandler
            }
            else if (currentURL.href === 'https://portail.apps.education.fr/signin') {
                // De manière contre intuitive, il s'agit de l'url une fois connecté à la boite
                // Le site redirigeant ensuite localement vers https://portail.apps.education.fr/
                EduNuageUSB.loginWindow.webContents.executeJavaScript('location.href = https://nuage.apps.education.fr;', true);
                // On redirige vers nuages.apps.education.fr qui redirigera lui vers le bon nextcloud (nuage02, nuage03, etc.)
            }
        }); // dom-ready
    }
}

module.exports = login;
