let notification = document.querySelector("#notification");

var copyables  = document.getElementsByClassName('copyText');
for(var i = 0; i < copyables.length; i++)
{
    copyables[i].addEventListener('click', function(){
        copyStringToClipboard(this.innerHTML);
        notification.innerHTML = "Copied";
        notification.opened = true;
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
