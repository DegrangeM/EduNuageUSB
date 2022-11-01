const { shell } = require('electron')

function openNC(EduNuageUSB) {
    return () => {
        shell.openExternal('https://' + EduNuageUSB.account.server + '/index.php/apps/files/?dir=/EduNuageUSB')
    }
}
module.exports = openNC;