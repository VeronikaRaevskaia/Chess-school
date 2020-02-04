function ajax(type, url, send_data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if(request.readyState == 4 && request.status == 200){
            callback(JSON.parse(request.responseText));
        }
    };
    request.open(type, url);
    if(type == 'POST')
            request.setRequestHeader("Content-Type", "application/json");
    if(send_data) {
        request.send(send_data);
    }
    else
        request.send();
}

window.onscroll = function () {
    var header_content = document.getElementById('intro');
    var menu = document.getElementById('menu');
    var up = document.getElementById('up');
    if(window.pageYOffset >= header_content.offsetHeight) {
        menu.classList.add('fixed');
        up.classList.add('fixed');
    }
    if(window.pageYOffset < header_content.offsetHeight) {
        menu.classList.remove('fixed');
        up.classList.remove('fixed');
    }
};

function fadeOut(block, width) {
    block.classList.add('fadeout_settings');
    rendering(function (){
        block.classList.add('fadeout_active');
        block.classList.remove('fadeout_settings');
    });

    var handler = function () {
        if(window.innerWidth >= width)
            block.style.display = 'flex';
        else
            block.style.display = 'none';
        block.classList.remove('fadeout_active');
        block.removeEventListener("transitionend", handler);
    };
    block.addEventListener("transitionend", handler);
}

function fadeIn(block, width) {
    block.classList.add('fadein_settings');
    if(window.innerWidth >= width)
        block.style.display = 'flex';
    else
        block.style.display = 'block';
    rendering(function (){
        block.classList.add('fadein_active');
        block.classList.remove('fadein_settings');
    });

    var handler = function () {
        block.classList.remove('fadein_active');
        block.removeEventListener("transitionend", handler);
    };
    block.addEventListener("transitionend", handler);
}

function rendering(fn) {
    window.requestAnimationFrame(function(){
        window.requestAnimationFrame(function(){
            fn();
        });
    });
}