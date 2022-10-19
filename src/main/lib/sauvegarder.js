const { BrowserWindow } = require('electron')
const path = require('path')
const spawn = require('child_process').spawn;

function sauvegarder(EduNuageUSB) {
    return () => {
        EduNuageUSB.saveWindow = new BrowserWindow({
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
        EduNuageUSB.saveWindow.loadFile(path.join(__dirname, '../../renderer/log.html'))
        EduNuageUSB.saveWindow.webContents.on('dom-ready', function () {
            EduNuageUSB.saveWindow.webContents.send('title', 'Sauvegarde');
            EduNuageUSB.saveWindow.webContents.send('class', 'sauvegarder');
            EduNuageUSB.saveWindow.webContents.send('log', "<b style='color:white;'>Début de la sauvegarde ...</b><br />", true);
            const rclone = spawn(path.join(__dirname, "../../../rclone/rclone.exe"),
                [
                    'sync',
                    '..',
                    'EduNuageUSB:EduNuageUSB',
                    '--config',
                    './.rclone.conf',
                    '--stats',
                    '1s',
                    '-v',
                    '--exclude-if-present',
                    'nepassauvegarder.txt',
                    '--delete-excluded',
                    '--delete-before'
                ]
            );
            rclone.stderr.on('data', function (data) {
                try {
                    EduNuageUSB.saveWindow.webContents.send('log', data.toString());
                } catch (e) {
                    console.log(e);
                }
            });
            rclone.on('exit', function () {
                try {
                    EduNuageUSB.saveWindow.webContents.send('log', "<b style='color:white;'>Sauvegarde terminée !</b>", true);
                } catch (e) {
                    console.log(e);
                }
            });
            EduNuageUSB.saveWindow.on('close', function () {
                try {
                    rclone.kill();
                } catch (e) {
                    console.log(e);
                }
            })
        });
    }
}

module.exports = sauvegarder;
