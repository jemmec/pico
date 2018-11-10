let notification = document.querySelector("#notification");
let alert = document.getElementById("alert");
var copyables  = document.getElementsByClassName('copyText');

for(var i = 0; i < copyables.length; i++)
{
    copyables[i].addEventListener('click', function(){
        copyStringToClipboard(this.innerHTML);
        ShowAlert("Copied",2000);
    });
}

function copyStringToClipboard (str) {
    var el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
 }

function ShowAlert(message,timeout) {
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

 