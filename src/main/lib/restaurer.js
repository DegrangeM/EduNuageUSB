const { BrowserWindow } = require('electron')
const path = require('path')
const spawn = require('child_process').spawn;

function restaurer(EduNuageUSB) {
    return () => {
        EduNuageUSB.restoreWindow = new BrowserWindow({
            width: 800,
            height: 400,
            useContentSize: true,
            autoHideMenuBar: true,
            parent: EduNuageUSB.mainWindow,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, '../../preload/log.js')
            },
            icon: path.join(__dirname, '../../../resources/logo.png')
        });
        EduNuageUSB.restoreWindow.loadFile(path.join(__dirname, '../../renderer/log.html'))
        EduNuageUSB.restoreWindow.webContents.on('dom-ready', function () {
            EduNuageUSB.restoreWindow.webContents.send('title', 'Restauration');
            EduNuageUSB.restoreWindow.webContents.send('class', 'restaurer');
            EduNuageUSB.restoreWindow.webContents.send('log', "<b style='color:white;'>Début de la restauration ...</b><br />", true);
            const rclone = spawn(".\\rclone\\rclone.exe",
                [
                    'copy',
                    'EduNuageUSB:EduNuageUSB',
                    '.',
                    '--config',
                    './.rclone.conf',
                    '--stats',
                    '1s',
                    '-v',
                ]
            );
            rclone.stderr.on('data', function (data) {
                try {
                    EduNuageUSB.restoreWindow.webContents.send('log', data.toString());
                } catch (e) {
                    console.log(e);
                }
            });
            rclone.on('exit', function () {
                try {
                    EduNuageUSB.restoreWindow.webContents.send('log', "<b style='color:white;'>Restauration terminée !</b>", true);
                } catch (e) {
                    console.log(e);
                }
            });
            EduNuageUSB.restoreWindow.on('close', function () {
                try {
                    rclone.kill();
                } catch (e) {
                    console.log(e);
                }
            })
        });
    }
}

module.exports = restaurer;
