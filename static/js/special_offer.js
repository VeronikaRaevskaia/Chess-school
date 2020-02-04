document.querySelector('div.send').onclick = function () {
    var form = document.querySelector('form[name="sign_in"]');
    var label = document.querySelector('label.message');
    label.innerHTML = 'Идет обработка заявки';
    var data = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/new_discount_request', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.responseText);
            if (data.success)
                label.innerHTML = 'Спасибо, ваша заявка принята';
            else
                label.innerHTML = data.reason;
            setTimeout(messageDelete, 3000);
            }
        };
    xhr.send(data);
};

function messageDelete() {
    document.querySelector('label.message').innerHTML = '';
}

var points = document.querySelectorAll('.box p');
for(var i=0; i<points.length; i++){
    points[i].onclick = function () {
        var box = this.parentNode.parentNode;
        box.classList.toggle('full');
    }
}
