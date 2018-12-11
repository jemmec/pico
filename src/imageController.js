const { ipcRenderer } = require('electron');
var app = require('electron').remote.app;
var win = require('electron').remote.getCurrentWindow();
var fs = require('fs');
var mousetrap = require('mousetrap');

let alert = document.getElementById("alert");

let notification = document.querySelector("#notification");

// directory/of/item/
let currentDirectory = new String();
let currentFile = new String();

var fileTypes = ['.png', '.jpg', '.gif', '.svg', '.jpeg'];

//Zoom
var image = document.getElementById("image");
var pos = { x: 0, y: 0 };
var zoomTarget = { x: 0, y: 0 };
var zoomPoint = { x: 0, y: 0 };
var scale = 1;


//Move to previous picture in item list
mousetrap.bind('left', function () {
    var items = getImageFilesInDirectory(currentDirectory);
    var index = items.indexOf(currentFile) - 1;
    //Wrap
    if (index < 0)
        index = items.length - 1;
    else if (index > items.length - 1)
        index = 0;
    currentFile = items[index];
    setImage(currentDirectory + currentFile, false);
});

mousetrap.bind('right', function () {
    var items = getImageFilesInDirectory(currentDirectory);
    var index = items.indexOf(currentFile) + 1;
    //Wrap
    if (index < 0)
        index = items.length - 1;
    else if (index > items.length - 1)
        index = 0;
    currentFile = items[index];
    setImage(currentDirectory + currentFile, false);
});

//Handle file from launch
var data = ipcRenderer.sendSync('get-file-data')
if (data === null) {
} else {
    //Load file if it is an image
    if (fileTypes.includes(getFileType(data).toLowerCase())) {
        checkIncomingFile(data);
    }
}

//Handle drag-drop into dropzone
document.getElementById("dropZone").ondrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 1) {
        ShowAlert("Multi-file drop not implementented.", 2000);
        console.log("Multi-file drag not implementented");
        return false;
    }
    else {
        checkIncomingFile(e.dataTransfer.files[0].path);
    }
    return false;
}

function checkIncomingFile(filePath) {
    var file = getFile(filePath);
    var fileType = getFileType(file);

    currentFile = file;
    currentDirectory = filePath.replace(file, "");

    // var items = getImageFilesInDirectory(currentDirectory);

    if (fileTypes.includes(fileType.toLowerCase())) {
        setImage(filePath, false);
    }
    else {
        // notification.innerHTML = "Not a recognized image file."
        // notification.opened = true;
        ShowAlert("Not a recognized image file.", 2000);
        console.log("Not a recognized image");
    }
}

function setImage(filePath, resizeWindow) {
    console.log("Loading Image " + filePath);
    var stats = getFileStats(filePath);
    document.getElementById('image').src = filePath;
    var myImage = new Image();
    myImage.src = document.getElementById('image').src;
    myImage.onload = function () {
        if (resizeWindow)
            win.setSize(myImage.width, myImage.height, true);
        setImageData(stats.size, myImage.width, myImage.height, filePath);
        //Set the sacle back to 1 when loading a new image
        scale = 1;
        updateImageScale(0, 0, scale);
    };
}

function setImageData(size, width, height, path) {
    document.getElementById("appName").innerHTML = "Pico - " + getFile(path);
    document.getElementById("title").innerHTML = "Pico - " + getFile(path);
    document.getElementById("filePath").innerHTML = path;
    document.getElementById("fileSize").innerHTML = ((size / 1000000) > 1) ? (size / 1000000).toFixed() + "mb" : Math.round((size / 1000)) + "kb";
    document.getElementById("aspectRatio").innerHTML = width + " x " + height;
    // document.getElementById("cursorLocation").innerHTML = "("+0+","+0+")";
    // document.getElementById("pixelColor").innerHTML = "#ffffff";
}

function getFileType(path) {
    return path.substring(path.lastIndexOf('.'))
}

function getFile(path) {
    return path.substring(path.lastIndexOf('\\') + 1);
}

//Returns an array of all the files in the given directory
function getFilesInDirectory(path) {
    var items = fs.readdirSync(path);
    return items;
}

//returns all of the image files in the given directory
function getImageFilesInDirectory(path) {
    var items = fs.readdirSync(path);
    var returnItems = new Array();
    for (var i = 0; i < items.length; i++) {
        if (fileTypes.includes(getFileType(items[i]).toLowerCase())) {
            returnItems.push(items[i]);
        }
    }
    return returnItems;
}

function getFileStats(path) {
    var stat = fs.statSync(path);
    return stat;
}


function ShowAlert(message, timeout) {
    alert.innerHTML = message;
    alert.classList.remove("hide");
    alert.classList.add("show");
    setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("hide");
        setTimeout(() => {
            alert.classList.remove("hide");
        }, 300);
    }, timeout);
}

//resize
window.addEventListener('resize', function(){
    updateImageScale(0, 0, scale);
}, false);


//Zoom
document.getElementById("mainPane").addEventListener('wheel', function (event) {
    event.preventDefault();

    // zoomPoint.x = event.pageX;
    // zoomPoint.y = event.pageY;
    // var delta = event.deltaY;
    // delta = Math.max(-1,Math.min(1,delta));

    // zoomTarget.x = (zoomPoint.x - pos.x)/scale;
    // zoomTarget.y = (zoomPoint.y - pos.y)/scale;

    // scale += delta * 0.5 * scale;
    // scale = Math.max(1,Math.min(50,scale));

    // pos.x = -zoomTarget.x * scale + zoomPoint.x;
    // pos.y = -zoomTarget.y * scale + zoomPoint.y;

    // if(pos.x > 0)
    //     pos.x = 0;
    // if(pos.x+size.w*scale<size.w)
    //     pos.x = -size.w*(scale-1);
    // if(pos.y > 0)
    //     pos.y = 0;
    // if(pos.y+size.h*scale<size.h)
    //     pos.y = -size.h*(scale-1);

    var delta = event.deltaY * -1;
    delta = Math.max(-1, Math.min(1, delta));
    scale += 0.5 * delta;
    if (scale < 1)
        scale = 1;
    updateImageScale(0, 0, scale);
})


function updateImageScale(offsetX, offsetY, scale) {
    var size = { w: image.offsetWidth, h: image.offsetHeight };
    image.style.transform = "translate(" + (-size.w / 2 + (offsetX)) + "px," + (-size.h / 2 + (offsetY)) + "px) scale(" + scale + "," + scale + ")";
}
