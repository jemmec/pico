const debugMenu = require('debug-menu');
debugMenu.install();

var app = require('electron').remote.app;
var win = require('electron').remote.getCurrentWindow();


'use strict';

//Prevent default drag-drop actions

document.addEventListener('dragover', function (event) {
  event.preventDefault();
  return false;
}, false);

document.addEventListener('drop', function (event) {
  event.preventDefault();
  return false;
}, false);


document.getElementById("viewPane").addEventListener('click',function(){

},false)

document.getElementById("viewPane").addEventListener('dblclick',function(){
    if(win.isFullScreen())
        win.setFullScreen(false);
    else
        win.setFullScreen(true);
  },false)


document.getElementById("menuBar").addEventListener('drag', function(){
})

document.getElementById("menuBar").addEventListener('dragstart', function(){
})

document.getElementById("menuBar").addEventListener('dragend', function(){
})

document.getElementById("closeButton").addEventListener('click',function()
{
    console.log("Closed");
    app.quit();
}, false)

