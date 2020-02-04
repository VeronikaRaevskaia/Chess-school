var during = 3000;
var mobile_width = 990;

function currentPageUnderline() {  /*подчеркивание текущей страницы*/
    var url = window.location.pathname;
    url = url.slice(1);
    var element = document.querySelector('nav#pa-menu li.' + url);
    if(element){
        element.classList.add('current_page');
    }
}
window.addEventListener("load", currentPageUnderline);

document.querySelector('li.exit').onclick = function(){  //отслеживаем событие нажатия на кнопку выход, срабатывает разлогинизация
    document.querySelector('div.bg-modal.exit').classList.toggle('show');
    stayOrLogOut();
};

function stayOrLogOut() {
    document.querySelector('button.yes').onclick = function () {
        var obj_form =  document.querySelector('form[name=obj_form]');
        obj_form.method = 'post';
        obj_form.action = '/logout';
        obj_form.submit();
    };
    document.querySelector('button.no').onclick = function () {
        document.querySelector('div.bg-modal').classList.toggle('show');
    }
}

document.querySelector('ul.name').onclick = function(){  //отслеживаем событие нажатия на смену пароля
    document.querySelector('div.bg-modal.settings').classList.toggle('show');
};

document.querySelector('div.settings .close').onclick = function () {
    document.querySelector('div.bg-modal.settings').classList.toggle('show');
};

document.querySelector("input[name='change']").onclick = function () {  //сохранить новый пароль
    var form = document.querySelector('form[name="change-password"]');
    var message = document.querySelector('label.new-password');
    message.innerHTML = 'Подождите, идет сохранение ...';
    message.classList.toggle('show');
    var data = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/password_change', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.responseText);
            if (data.success)
                message.innerHTML = 'Ваш пароль успешно изменен!';
            else
                message.innerHTML = data.reason;
            setTimeout(messageClearing, 3000);
        }
    };
    xhr.send(data);
};

function messageClearing() {
    var message = document.querySelector('label.new-password');
    message.classList.toggle('show');
}

function messageDelete(element) {
    function claering() {
        element.innerHTML = '';
    }
   setTimeout(claering(), 3000);
}

function menuAnimation(){   //функция обработчик события нажатия на меню в мобильной версии
    var actions = document.querySelector('ul.actions');
    if(actions.style.display =='block')     //здесь важна последовательность if, потому что первый раз всегда сработает операция после else
        fadeOut(actions, mobile_width);
    else
        fadeIn(actions, mobile_width);
}

function menuTypeCheck() {
    var actions = document.querySelector('ul.actions');
    var mobile = document.querySelector('span.mobile-menu');
    if(window.innerWidth >= mobile_width) {
        actions.style.display = 'flex';
        mobile.style.display = 'none';

    }
    else {
        actions.style.display = 'none';
        mobile.style.display = 'inline-block';
    }
}


document.querySelector('span.mobile-menu').addEventListener('click', menuAnimation);

window.addEventListener("resize", menuTypeCheck);
window.addEventListener("load", menuTypeCheck);

document.querySelector('div.exit .close').onclick = function () {
    document.querySelector('div.bg-modal.exit').classList.toggle('show');
}

window.addEventListener("keyup", escapeClicked);   //нажатие на esc

function escapeClicked(event){
    var showing_modal = document.querySelector('div.bg-modal.show');
    var exit_modal = document.querySelector('div.bg-modal.exit');
    if (event.keyCode == 27) {  //27-код кнопки esc
        if(showing_modal)
            showing_modal.classList.remove('show');
        else
            exit_modal.classList.add('show');
    }
    stayOrLogOut();
}
