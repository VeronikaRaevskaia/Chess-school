window.addEventListener("load", calendarFill);
document.querySelector('li.arrow-left').addEventListener("click", anotherMonth);
document.querySelector('li.arrow-right').addEventListener("click", anotherMonth);


function anotherMonth() {
    var arrow_left = document.querySelector('li.arrow-left');
    var arrow_right = document.querySelector('li.arrow-right');
    arrow_left.removeEventListener("click", lastMonth);
    arrow_right.removeEventListener("click", nextMonth);
    arrow_left.removeEventListener("click", anotherMonth);
    arrow_right.removeEventListener("click", anotherMonth);
    arrow_left.classList.toggle('wait');
    arrow_right.classList.toggle('wait');
    var loader = document.querySelector('div.loader');
    var calendar = document.querySelector('div.calendar');
    loader.classList.toggle('show');
    calendar.classList.toggle('show');
    var month = document.querySelector('span.month').innerHTML;
    month = monthIntoNumber(month);
    month++;
    var json = JSON.stringify(month);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/select_student_attendance', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            calendarClear();
            visitsRemove();
            if(result.data != null) {
                dataUpdate(result.data.total, 'days');
                dataUpdate(result.data.spravka, 'sick-note');
                dataUpdate(result.data.unattended, 'unattended');
            }
            loader.classList.toggle('show');
            calendarFill();
            calendar.classList.toggle('show');
            arrow_left.addEventListener("click", lastMonth);
            arrow_right.addEventListener("click", nextMonth);
            arrow_left.addEventListener("click", anotherMonth);
            arrow_right.addEventListener("click", anotherMonth);
            arrow_left.classList.toggle('wait');
            arrow_right.classList.toggle('wait');
        }
    }
    xhr.send(json);
}

function visitsRemove() {
    var values = document.querySelectorAll('div.visits ul');
    for(var i=0; i< values.length; i++){
        var item = values[i].querySelectorAll('li');
        for(var j=0; j<item.length; j++){
            item[j].remove();
        }
    }
}

function dataUpdate(data, type) {
    var new_ul_list = document.querySelector('div.visits ul.' + type);
    for (var j = 0; j < data.length; j++) {
        var new_li = document.createElement("li");
        new_li.innerHTML = data[j];
        new_ul_list.appendChild(new_li);
    }
}

function wasSicknote(day) {
    var sicknout_days = document.querySelectorAll('ul.sick-note li');
    var result = false;
    for(var i=0; i<sicknout_days.length; i++){
        if(day == sicknout_days[i].innerHTML){
            result = true;
            break;
        }
    }
    return result;
}

function wasUnattended(day) {
    var unattended_days = document.querySelectorAll('ul.unattended li');
    var result = false;
    for(var i=0; i<unattended_days.length; i++){
        if(day == unattended_days[i].innerHTML){
            result = true;
            break;
        }
    }
    return result;
}

function hasLesson(day) {   //функция возвращает true, если в этот день есть урок, false в противном случае
    var total_days = document.querySelectorAll('ul.days li');
    var result = false;
    for(var i=0; i<total_days.length; i++){
        if(day == total_days[i].innerHTML){
            result = true;
            break;
        }
    }
    return result;
}

function statisticsFill(total, attended, sick_note, unattended) {
    document.querySelector('span.total').innerHTML = 'Всего занятий: ' + total;
    document.querySelector('span.attended').innerHTML = 'Посещенных занятий: ' + attended;
    document.querySelector('span.sick_note').innerHTML = 'Пропущенных по уважительной причине занятий: ' + sick_note;
    document.querySelector('span.unattended').innerHTML = 'Пропущенных по неуважительной причине занятий: ' + unattended;
}


function calendarFill() {   //функция заполнения отображаемой области календаря датами
    var local_date = new Date();
    local_date.setTime(visiable_date.getTime()); //локальная перменная даты принимает значение отображаемой даты(1е число)
    var week_day = local_date.getDay(); //получаем день недели 1го числа отображаемого месяца отображаемого года
    var i;  //переенна определяет с какой строчки надо заполнять дни отображаемого месяца
    var j;  //определяет с какого столбца надо заполнять дни отображаемого месяца
    var k;  //определяет с какого столбца надо дозополнять дни предыдущего месяца
    if (week_day == 1) {//если день недели 1го числа текущего месяца - понедельник, то оно записывается во 2ой строчке, во всех остальных случаях в 1ой строчке
        i = 2;
        j = week_day - 1;
        k = 6;
    }
    if (week_day == 0) {//если день недели 1го числа - воскресение
        i = 1;
        j = 6;
        k = 5;
    }
    else {
        i = 1;
        j = week_day - 1;
        k = week_day - 2;
    }
    var rows = document.getElementsByTagName('tr');     //заполнения таблицы календаря числами отображаемого и следующего за отображаемым месяцев
    var total_sum = 0;
    var attended_sum = 0;
    var sick_note_sum = 0;
    var unattended_sum = 0;
        for (i; i < rows.length; i++) {
            var columns = rows[i].getElementsByTagName('td');
            for (j; j < columns.length; j++) {
                if (local_date.getMonth() == visiable_date.getMonth()) {
                    columns[j].classList.add('current-month');
                    if (visiable_date.getMonth() == today.getMonth()) {
                        if (local_date.getDate() < today.getDate()) {
                            if (hasLesson(local_date.getDate())) {
                                total_sum++;
                                if (wasSicknote(local_date.getDate())) {
                                    columns[j].classList.add('sick-note');
                                    columns[j].classList.add('past-lesson');
                                    columns[j].setAttribute('title', 'Отсутствовал со справкой о болезни');
                                    sick_note_sum++;
                                }
                                else {
                                    if (wasUnattended(local_date.getDate())) {
                                        columns[j].classList.add('unattended');
                                        columns[j].classList.add('past-lesson');
                                        columns[j].setAttribute('title', 'Отсутствовал по неуважительной причине');
                                        unattended_sum++;
                                    }
                                    else {
                                        columns[j].classList.add('attended');
                                        columns[j].classList.add('past-lesson');
                                        columns[j].setAttribute('title', 'Присутствовал на занятии');
                                        attended_sum++;
                                    }
                                }
                            }
                        }
                        else {
                            if (hasLesson(local_date.getDate())) {
                                columns[j].classList.add('lesson-day');
                                columns[j].setAttribute('title', 'День занятий');
                                total_sum++;
                            }
                        }
                        if (local_date.getDate() == today.getDate() && local_date.getMonth() == today.getMonth() && local_date.getFullYear() == today.getFullYear()) {
                            columns[j].classList.add('today');
                            columns[j].setAttribute('title', 'Сегодняшнее число');
                        }
                    }
                    if (visiable_date.getMonth() > today.getMonth() && visiable_date.getFullYear() == today.getFullYear()) {
                        if (hasLesson(local_date.getDate())) {
                            columns[j].classList.add('lesson-day');
                            columns[j].setAttribute('title', 'День занятий');
                            total_sum++;
                        }
                    }
                    if (visiable_date.getMonth() < today.getMonth()) {
                        if (hasLesson(local_date.getDate())) {
                            if (wasSicknote(local_date.getDate())) {
                                columns[j].classList.add('sick-note');
                                columns[j].classList.add('past-lesson');
                                columns[j].setAttribute('title', 'Отсутствовал со справкой о болезни');
                                sick_note_sum++;
                            }
                            else {
                                if (wasUnattended(local_date.getDate())) {
                                    columns[j].classList.add('unattended');
                                    columns[j].classList.add('past-lesson');
                                    columns[j].setAttribute('title', 'Отсутствовал по неуважительной причине');
                                    unattended_sum++;
                                }
                                else {
                                    columns[j].classList.add('attended');
                                    columns[j].classList.add('past-lesson');
                                    columns[j].setAttribute('title', 'Присутствовал на занятии');
                                    attended_sum++;
                                }
                            }
                        }
                    }
                    if(visiable_date.getFullYear() < today.getFullYear()){
                        if (hasLesson(local_date.getDate())) {
                            if (wasSicknote(local_date.getDate())) {
                                columns[j].classList.add('sick-note');
                                columns[j].classList.add('past-lesson');
                                columns[j].setAttribute('title', 'Отсутствовал со справкой о болезни');
                                sick_note_sum++;
                            }
                            else {
                                if (wasUnattended(local_date.getDate())) {
                                    columns[j].classList.add('unattended');
                                    columns[j].classList.add('past-lesson');
                                    columns[j].setAttribute('title', 'Отсутствовал по неуважительной причине');
                                    unattended_sum++;
                                }
                                else {
                                    columns[j].classList.add('attended');
                                    columns[j].classList.add('past-lesson');
                                    columns[j].setAttribute('title', 'Присутствовал на занятии');
                                    attended_sum++;
                                }
                            }
                        }
                    }
                }
                else
                    columns[j].classList.add('not-passed');


                columns[j].innerHTML = local_date.getDate().toString();  //запись числа в ячейку
                local_date.setDate(local_date.getDate() + 1);
            }
            j = 0;
        }
    local_date.setMonth(visiable_date.getMonth());
    local_date.setDate(visiable_date.getDate() - 1);
    var columns = document.getElementsByTagName('tr')[1].getElementsByTagName('td'); //дозополнение таблицы календаря числами месяца, предудущему отображаемому
    for (k; k >= 0; k--) { //заполнение чисел предыдущего месяца в обратном порядке
        columns[k].innerHTML = local_date.getDate().toString();  //запись числа в ячейку
        local_date.setDate(local_date.getDate() - 1);
        columns[k].classList.add('not-passed');
    }
    statisticsFill(total_sum, attended_sum, sick_note_sum, unattended_sum);
}

function calendarClear() {
    var rows = document.getElementsByTagName('tr');     //заполнения таблицы календаря числами отображаемого и следующего за отображаемым месяцев
    for (var i=0; i < rows.length; i++) {
        var columns = rows[i].getElementsByTagName('td');
        for (var j = 0; j < columns.length; j++) {
            columns[j].className = '';
            if(columns[j].hasAttribute('title'));
            columns[j].removeAttribute('title');
        }
    }
}

document.querySelector('span.more').onclick = function () {
    document.querySelector('div.bg-modal.statistics').classList.toggle('show');
}

document.querySelector('div.statistics button.close').onclick = function () {
    document.querySelector('div.bg-modal.statistics').classList.toggle('show');
}

