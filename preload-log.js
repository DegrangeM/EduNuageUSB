const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const logNode = document.getElementById('log');
    ipcRenderer.on('log', (_event, value) => {
        logNode.textContent += value + "\r\n";
        window.scrollTo(0, document.body.scrollHeight);
    });
    ipcRenderer.on('title', (_event, value) => {
        document.title = value;
    });
})