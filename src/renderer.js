// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//app is called on the render process
const { remote, ipcRenderer } = require('electron');
const {Menu, MenuItem, BrowserWindow} = remote;
const {dialog} = require('electron').remote;

