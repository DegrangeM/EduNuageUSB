const { ipcRenderer } = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    const logNode = document.getElementById('log');
    ipcRenderer.on('log', (_event, text, html=false) => {
        if(html) {
            logNode.innerHTML += text + "<br />";
        } else {
            logNode.appendChild(document.createTextNode(text));
        }
        window.scrollTo(0, document.body.scrollHeight);
    });
    ipcRenderer.on('title', (_event, value) => {
        document.title = value;
    });
})