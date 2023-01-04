const { shell } = require('electron')

function openHelp() {
    return () => {
        shell.openExternal('https://github.com/DegrangeM/EduNuageUSB/blob/master/README.md#readme')
    }
}
module.exports = openHelp;