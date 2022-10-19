const fs = require('fs')
const ini = require('ini');

function loadRcloneConf(EduNuageUSB) {
    return () => {
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
    }
}
module.exports = loadRcloneConf