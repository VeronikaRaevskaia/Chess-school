
var sign_in = document.querySelectorAll('span.sign-in');
var date;
for(var i=0; i<sign_in.length; i++) {
    sign_in[i].onclick = function () {
        var number = returnClickedNumber(this);
        if(number<2)
            date = number+2;
        else
            date = number+3;
        document.querySelector('label[name="date"]').innerHTML = date + ' января';
        document.querySelector('div.bg-modal.sign-in').classList.toggle('show');
    }
}

function returnClickedNumber(clicked) {
    for(var i=0; i<sign_in.length; i++){
        if(clicked == sign_in[i])
            return i;
    }
}

document.querySelector('div.sign-in .close').onclick = function () {
    modalWindowClosing();
}

function modalWindowClosing() {
    document.querySelector('div.bg-modal.sign-in').classList.toggle('show');
}

function messageDelete() {   //очищает сообщение
    var label = document.querySelector('label.message');
    label.innerHTML = 'Заявка отправляется ...';
    label.classList.remove('show');
}

document.querySelector('div.send').onclick = function () {  //запись на соревнования
    var form = document.querySelector('form[name="sign-in"]');
    var form = document.querySelector('form[name="sign-in"]');
    var message = document.querySelector('label.message');
    message.innerHTML = 'Заявка отправляется ...';
    message.classList.toggle('show');
    var data = new FormData(form);
    data.append("date", date);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/register_for_tournament', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.responseText);
            if (data.success) {
                message.innerHTML = 'Спасибо, ваша заявка принята';
                setTimeout(function () {
                    modalWindowClosing();
                }, 2000);
            }
            else
                message.innerHTML = data.reason;
            setTimeout(function () {
                messageDelete(message);

            }, 2000);
        }
    };
    xhr.send(data);
}