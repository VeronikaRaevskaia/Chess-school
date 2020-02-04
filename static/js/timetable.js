window.addEventListener("load", addWeekdaysTitles);

function addWeekdaysTitles(){

    var array_t = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
    var column = document.querySelectorAll('.row:first-child .column');
    var len = column.length;
    for(var i=0; i<len; i++) {
        var new_li = document.createElement('li');
        new_li.innerHTML = array_t[i];
        new_li.classList.add('weekday');
        var first_li = column[i].querySelector('li:first-child');
        if(first_li)
            column[i].insertBefore(new_li, first_li);
        else
            column[i].appendChild(new_li);
    }

    var new_ul = document.createElement('ul');
    var column_time = document.querySelector('.row:first-child');
    var first_time_li = column_time.querySelector('li.time:first-child');
    var new_time_li = document.createElement('li');
    new_ul.classList.add('time-ul');
    column_time.insertBefore(new_ul, first_time_li);
    new_ul.appendChild(new_time_li);
    new_ul.appendChild(first_time_li);

    new_time_li.style.width = new_ul.offsetWidth + 'px';

}

window.addEventListener("load", setTitlesWidth);

function setTitlesWidth() {
    var ul = document.querySelector('ul.column');
    var title = document.getElementsByClassName('weekday');
    for(var k=0; k<title.length; k++){
            title[k].style.width = ul.offsetWidth + 'px';
    }
}



//Поиск на странице
var lastResFind=""; // последний удачный результат
var copy_page=""; // копия страницы в ихсодном виде
function TrimStr(s) {
    s = s.replace( /^\s+/g, '');
    return s.replace( /\s+$/g, '');
}

function FindOnPage(inputId) {//ищет текст на странице, в параметр передается ID поля для ввода
    var obj = window.document.getElementById(inputId);
    var textToFind;
    if (obj) {
        textToFind = TrimStr(obj.value);//обрезаем пробелы
    } else {
        alert("Введенная фраза не найдена");
        return;
    }
    if (textToFind == "") {
        alert("Вы ничего не ввели");
        return;
    }
    if(document.body.innerHTML.indexOf(textToFind)=="-1")
    alert("Ничего не найдено, проверьте правильность ввода!");
    if(copy_page.length>0)
    document.body.innerHTML=copy_page;
else copy_page=document.body.innerHTML;
    document.body.innerHTML = document.body.innerHTML.replace(eval("/name="+lastResFind+"/gi")," ");//стираем предыдущие якори для скрола
    document.body.innerHTML = document.body.innerHTML.replace(eval("/"+textToFind+"/gi"),"<a name="+textToFind+" style='background:red'>"+textToFind+"</a>"); //Заменяем найденный текст ссылками с якорем;
    lastResFind=textToFind; // сохраняем фразу для поиска, чтобы в дальнейшем по ней стереть все ссылки
    window.location = '#'+textToFind;//перемещаем скрол к последнему найденному совпадению
}
