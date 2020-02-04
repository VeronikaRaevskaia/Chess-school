var download = document.querySelectorAll('button.download');
var file_name = document.querySelectorAll('span.file-name');
var download_flugs = [];
for(var k=0; k<download.length; k++){
    download[k].addEventListener("click", downloadHomework);
}



function downloadHomework() {
    var download = document.querySelectorAll('button.download');
    for(var i=0; i<download.length; i++) {
        var number;
        if(download[i] == this){
            if(!download_flugs[i]) {
                number = i;
                var add = file_name[number].innerHTML;
                var a = this.querySelector('a');
                var new_href = a.getAttribute('href') + add;
                a.setAttribute('href', new_href);
                download_flugs[i] = true;
            }
        }
    }
}


function checkForEmpty() {
    var files = document.querySelectorAll('li.file-name');
    var empty_block = document.querySelector('ul.empty-block');
    var homeworks_block = document.querySelector('div.homeworks-block');
    if(files.length > 0) {
        homeworks_block.classList.add('show');
        empty_block.classList.remove('show')
    }
    else {
        empty_block.classList.add('show');
        homeworks_block.classList.remove('show');
    }
}



window.addEventListener("load", checkForEmpty);