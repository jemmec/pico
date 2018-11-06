const { ipcRenderer } = require('electron');
var app = require('electron').remote.app;
var win = require('electron').remote.getCurrentWindow();
var fs = require('fs');
var mousetrap = require('mousetrap');


let notification = document.querySelector("#notification");

// directory/of/item/
let currentDirectory = new String();
let currentFile = new String();

var fileTypes = ['.png', '.jpg', '.gif', '.svg', '.jpeg'];

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
    setImage(currentDirectory + currentFile);
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
    setImage(currentDirectory + currentFile);
});

//Handle file from launch
var data = ipcRenderer.sendSync('get-file-data')
if (data === null) {
    console.log("App opened with no file");
} else {
    // Do something with the file.
    console.log("data");
    //open window-size the same as the image the max being the screen size
}

//Handle drag-drop into dropzone
document.getElementById("dropZone").ondrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 1) {
        notification.innerHTML = "Multi-file drag not implementented."
        notification.opened = true;
        console.log("Multi-file drag not implementented");
        return false;
    }
    else {

        //TODO: Move what is in this condition to its own functions so it can be called from other events

        var filePath = e.dataTransfer.files[0].path;
        var file = getFile(filePath);
        var fileType = getFileType(file);

        currentFile = file;
        currentDirectory = filePath.replace(file, "");

        var items = getImageFilesInDirectory(currentDirectory);

        if (fileTypes.includes(fileType.toLowerCase())) {
            setImage(filePath);
        }
        else {
            notification.innerHTML = "Not a recognized image file."
            notification.opened = true;
            console.log("Not a recognized image");
        }
    }
    return false;
}

function setImage(filePath) {
    console.log("Loading Image " + filePath);
    var stats = getFileStats(filePath);
    document.getElementById('image').src = filePath;
    var myImage = new Image();
    myImage.src = document.getElementById('image').src;
    myImage.onload = function()
    {
        setImageData(stats.size, myImage.width, myImage.height, filePath);
    };
}

function setImageData(size, width, height, path) {
    document.getElementById("appName").innerHTML = "Pico - " + getFile(path);
    document.getElementById("title").innerHTML = "Pico - " + getFile(path);
    document.getElementById("filePath").innerHTML = path;
    document.getElementById("fileSize").innerHTML = ((size / 1000000) > 1) ? (size / 1000000).toFixed() + "mb" : Math.round((size / 1000)) + "kb";
    document.getElementById("aspectRatio").innerHTML = "("+width+","+height+")";
    // document.getElementById("cursorLocation").innerHTML = "("+0+","+0+")";
    // document.getElementById("pixelColor").innerHTML = "#ffffff";
}

function getFileType(path) {
    return path.substring(path.lastIndexOf('.'))
}

function getFile(path) {
    return path.substring(path.lastIndexOf('\\') + 1);
}

function getFilesInDirectory(path) {
    var items = fs.readdirSync(path);
    return items;
}

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

function getFileStats(path)
{
    var stat = fs.statSync(path);
    return stat;
}
