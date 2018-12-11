const debugMenu = require('debug-menu');
debugMenu.install();

var app = require('electron').remote.app;
var win = require('electron').remote.getCurrentWindow();


'use strict';

//Once dom ready
win.webContents.once('dom-ready', () => {
    UpdateSpacerSizes();
})

//Prevent default drag-drop actions
document.addEventListener('dragover', function (event) {
    event.preventDefault();
    return false;
}, false);

document.addEventListener('drop', function (event) {
    event.preventDefault();
    return false;
}, false);


document.getElementById("viewPane").addEventListener('click', function () {

}, false)

document.getElementById("viewPane").addEventListener('dblclick', function () {
    if (win.isFullScreen())
        win.setFullScreen(false);
    else
        win.setFullScreen(true);
}, false)


document.getElementById("mainPane").addEventListener('dragover', function () {
})

document.getElementById("menuBar").addEventListener('drag', function () {
})

document.getElementById("menuBar").addEventListener('dragstart', function () {
})

document.getElementById("menuBar").addEventListener('dragend', function () {
})

document.getElementById("closeButton").addEventListener('click', function () {
    console.log("Closed");
    app.quit();
}, false)

//Window resize
window.addEventListener('resize', function(e){
    e.preventDefault();
    UpdateSpacerSizes();
}, false)

function UpdateSpacerSizes()
{
    var horizontalSpacers = document.getElementsByClassName('horizontalSpacer');
    for(var i = 0; i < horizontalSpacers.length; i ++)
    {
        horizontalSpacers[i].style["width"] = (win.getBounds().width-60) + 'px';
    }
}



