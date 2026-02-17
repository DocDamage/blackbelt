/**
 * Electron Preload Script
 * 
 * Secure bridge between renderer and main process
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Event listeners
  onExportData: (callback) => ipcRenderer.on('export-data', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
});

// Expose environment info
contextBridge.exposeInMainWorld('env', {
  isElectron: true,
  nodeEnv: process.env.NODE_ENV,
});
