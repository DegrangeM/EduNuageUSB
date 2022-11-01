const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('EduNuageUSB', {
  getAccount: () => ipcRenderer.invoke('getAccount'),
  sauvegarder: () => ipcRenderer.invoke('sauvegarder'),
  restaurer: () => ipcRenderer.invoke('restaurer'),
  login: () => ipcRenderer.invoke('login'),
  logout: () => ipcRenderer.invoke('logout'),
  openNC: () => ipcRenderer.invoke('openNC'),
})