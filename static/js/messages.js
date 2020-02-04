
document.getElementById('feedback').onclick = function(){
    document.querySelector('div.bg-modal.feedback').classList.toggle('show');
}

document.querySelector('div.feedback .close').onclick = function () {
    modalWindowClosing();
}

function modalWindowClosing() {
    document.querySelector('div.bg-modal.feedback').classList.toggle('show');
}

document.querySelector('div.send').onclick = function () {  //запрос на обратную связь
    var form = document.querySelector('form[name="feedback"]');
    var label = document.querySelector('label.message');
    label.innerHTML = 'Идет обработка заявки';
    var data = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/feedback_from_student', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var data = JSON.parse(xhr.responseText);
            if (data.success) {
                label.innerHTML = 'Спасибо, ваша заявка принята';
                var topic = document.querySelector("input[name='topic']");
                var message = document.querySelector("textarea[name='content']");
                messageCreation(topic.value, message.value);
                messageClearing(topic, message);
                setTimeout(function () {
                   modalWindowClosing();
                }, 2000);
            }
            else
                label.innerHTML = data.reason;
            setTimeout(function () {
                messageDelete(label);

            }, 2000);
        }
    };
    xhr.send(data);
}

//Очистка формы сообщения после удачного создания
function messageClearing(topic, message) {
    topic.value = '';
    message.value = '';
}

function messageCreation(topic, message) {  //ф-я создания сообщения
    var section = document.querySelector('section.center');
    var article = section.querySelector('article');
    var new_article = document.createElement('article');
    if(article)
        section.insertBefore(new_article, article);
    else
        section.appendChild(new_article);

    var new_wrapper_content = document.createElement('div');
    new_wrapper_content.classList.add('content');
    new_article.appendChild(new_wrapper_content);

    var new_div_content = document.createElement('div');
    new_div_content.classList.add('article-content');
    new_wrapper_content.appendChild(new_div_content);

    var new_img = document.createElement('div');
    new_img.classList.add('img');
    new_wrapper_content.appendChild(new_img);

    var new_h = document.createElement('h2');
    new_h.innerHTML = topic;
    new_div_content.appendChild(new_h);

    var new_p = document.createElement('p');
    new_p.innerHTML = message;
    new_div_content.appendChild(new_p);

    var new_from = document.createElement('span');
    new_from.classList.add('from');
    var name = document.querySelector('li.name').innerHTML;
    new_from.innerHTML = name;
    new_div_content.appendChild(new_from);

    var new_date = document.createElement('span');
    new_date.classList.add('article-date');
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();
    new_date.innerHTML = day + '.' + month + '.' + year;
    new_div_content.appendChild(new_date);
}


