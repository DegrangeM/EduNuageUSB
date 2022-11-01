const { session } = require('electron')
const path = require('path')
const execFile = require('child_process').execFile;

function logout(EduNuageUSB) {
    return () => {
        EduNuageUSB.account = false;
        execFile(path.join(__dirname, "../../../rclone/rclone.exe"),
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
        session.defaultSession.clearStorageData(); // On vide les cookies au cas où ...
        EduNuageUSB.mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'))
    }
}

module.exports = logout;