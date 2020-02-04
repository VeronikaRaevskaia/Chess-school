var array_m_full = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
var today = new Date();
var first_day = new Date(today.getFullYear(), today.getMonth(), 1);


function monthIntoString(month) {
    return array_m_full[month];
}

function studentNameClickFunction() {
    var modal = document.querySelector('.bg-modal.personal-statistics');
    var name = document.querySelector('span.checked-student');
    var current_name = this.innerHTML;
    name.innerHTML = current_name;
    anotherMonth(current_name);
    paymentHistoryRequest(current_name);
    penaltyDetailsRequest(current_name);
    modal.classList.toggle('show');

}

function modalSettings() {
    dateOutput('personal-statistics');
    var modal = document.querySelector('.bg-modal.personal-statistics');
    var names = document.querySelectorAll('.personal-data ul.name li:not(.title)');
    for(var j=0; j<names.length; j++){
        names[j].addEventListener("click", studentNameClickFunction);
    }
    var close = document.querySelector('div.personal-statistics button.close');
    close.onclick = function () {
        modal.classList.toggle('show');
        var calendar = document.querySelector('div.calendar');
        calendar.classList.remove('show');
        clearHistory();
    }
}

window.addEventListener("load", modalSettings);

function dateOutput(class_name){
    document.querySelector('.' + class_name +' span.month').innerHTML = monthIntoString(first_day.getMonth());
    document.querySelector('.' + class_name +' span.year').innerHTML = first_day.getFullYear();
}


function lastMonth() {
    first_day.setMonth(first_day.getMonth()-1);
    dateOutput('personal-statistics');
}
function nextMonth() {
    first_day.setMonth(first_day.getMonth()+1);
    dateOutput('personal-statistics');
}
document.querySelector('li.arrow-left').addEventListener("click", lastMonth);
document.querySelector('li.arrow-right').addEventListener("click", nextMonth);

document.querySelector('li.arrow-left').addEventListener("click", anotherMonthWithName);
document.querySelector('li.arrow-right').addEventListener("click", anotherMonthWithName);

function anotherMonth(name) {
    beforeRequestSettings();
    var month = document.querySelector('span.month').innerHTML;
    month = monthIntoNumber(month);
    month++;
    var data = {};
    data.month = month;
    data.name  = name;
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/select_student_attendance', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            calendarClear();
            afterRequestSettings();
            if(result.data != 0) {
                calendarFill(result.data.total, result.data.spravka, result.data.unattended);
            }
        }
    }
    xhr.send(json);
}


function beforeRequestSettings() {
    var arrow_left = document.querySelector('li.arrow-left');
    var arrow_right = document.querySelector('li.arrow-right');
    var loader = document.querySelector('div.loader');
    var calendar = document.querySelector('div.calendar');
    arrow_left.removeEventListener("click", lastMonth);
    arrow_right.removeEventListener("click", nextMonth);
    arrow_left.removeEventListener("click", anotherMonthWithName);
    arrow_right.removeEventListener("click", anotherMonthWithName);
    arrow_left.classList.add('wait');
    arrow_right.classList.add('wait');
    loader.classList.add('show');
    calendar.classList.remove('show');
}

function afterRequestSettings() {
    var arrow_left = document.querySelector('li.arrow-left');
    var arrow_right = document.querySelector('li.arrow-right');
    var loader = document.querySelector('div.loader');
    var calendar = document.querySelector('div.calendar');
    loader.classList.remove('show');
    calendar.classList.add('show');
    arrow_left.addEventListener("click", lastMonth);
    arrow_right.addEventListener("click", nextMonth);
    arrow_left.addEventListener("click", anotherMonthWithName);
    arrow_right.addEventListener("click", anotherMonthWithName);
    arrow_left.classList.remove('wait');
    arrow_right.classList.remove('wait');
}

function anotherMonthWithName() {
    var name = document.querySelector('span.checked-student');
    var current_name = name.innerHTML;
    anotherMonth(current_name);
}
function monthIntoNumber(month){
    for(var i=0; i<12; i++){
        if(month==array_m_full[i])
        {
            return i;
            break;
        }
    }
}


function hasLesson(day, total_days) {
    var result = false;
    for(var i=0; i<total_days.length; i++){
        if(day == total_days[i]){
            result = true;
            break;
        }
    }
    return result;
}

function wasSicknote(day, sicknout_days) {
    var result = false;
    for(var i=0; i<sicknout_days.length; i++){
        if(day == sicknout_days[i]){
            result = true;
            break;
        }
    }
    return result;
}

function wasUnattended(day, unattended_days) {
    var result = false;
    for(var i=0; i<unattended_days.length; i++){
        if(day == unattended_days[i]){
            result = true;
            break;
        }
    }
    return result;
}

function calendarFill(total_days, sicknout_days, unattended_days) {
    var local_date = new Date();
    local_date.setTime(first_day.getTime());
    var week_day = local_date.getDay();
    var i,j,k;
    if (week_day == 1) {
        i = 2;
        j = week_day - 1;
        k = 6;
    }
    if (week_day == 0) {
        i = 1;
        j = 6;
        k = 5;
    }
    else {
        i = 1;
        j = week_day - 1;
        k = week_day - 2;
    }
    var rows = document.getElementsByTagName('tr');
    var total_sum = 0;
    var attended_sum = 0;
    var sick_note_sum = 0;
    var unattended_sum = 0;
    for (i; i < rows.length; i++) {
        var columns = rows[i].getElementsByTagName('td');
        for (j; j < columns.length; j++) {
            if (local_date.getMonth() == first_day.getMonth()) {
                columns[j].classList.add('current-month');
                if(first_day.getMonth() == today.getMonth()) {
                    if (local_date.getDate() < today.getDate()) {
                        if (hasLesson(local_date.getDate(), total_days)) {
                            total_sum++;
                            if (wasSicknote(local_date.getDate(), sicknout_days)) {
                                columns[j].classList.add('sick-note');
                                columns[j].classList.add('past-lesson');
                                columns[j].setAttribute('title', 'Отсутствовал со справкой о болезни');
                                sick_note_sum++;
                            }
                            else {
                                if (wasUnattended(local_date.getDate(), unattended_days)) {
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
                        if (hasLesson(local_date.getDate(), total_days)) {
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
                if(first_day.getMonth() > today.getMonth() && first_day.getFullYear() == today.getFullYear()){
                    if (hasLesson(local_date.getDate(), total_days)) {
                        columns[j].classList.add('lesson-day');
                        columns[j].setAttribute('title', 'День занятий');
                        total_sum++;
                    }
                }
                if(first_day.getMonth() < today.getMonth()){
                    if (hasLesson(local_date.getDate(), total_days)) {
                        if (wasSicknote(local_date.getDate(), sicknout_days)) {
                            columns[j].classList.add('sick-note');
                            columns[j].classList.add('past-lesson');
                            columns[j].setAttribute('title', 'Отсутствовал со справкой о болезни');
                            sick_note_sum++;
                        }
                        else {
                            if (wasUnattended(local_date.getDate(), unattended_days)) {
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
                if(first_day.getFullYear() < today.getFullYear()){
                    if (hasLesson(local_date.getDate(), total_days)) {
                        if (wasSicknote(local_date.getDate(), sicknout_days)) {
                            columns[j].classList.add('sick-note');
                            columns[j].classList.add('past-lesson');
                            columns[j].setAttribute('title', 'Отсутствовал со справкой о болезни');
                            sick_note_sum++;
                        }
                        else {
                            if (wasUnattended(local_date.getDate(), unattended_days)) {
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


            columns[j].innerHTML = local_date.getDate().toString();
            local_date.setDate(local_date.getDate() + 1);
        }
        j = 0;
    }
    local_date.setMonth(first_day.getMonth());
    local_date.setDate(first_day.getDate() - 1);
    var columns = document.getElementsByTagName('tr')[1].getElementsByTagName('td');
    for (k; k >= 0; k--) {
        columns[k].innerHTML = local_date.getDate().toString();
        local_date.setDate(local_date.getDate() - 1);
        columns[k].classList.add('not-passed');
    }
}


function calendarClear() {
    var rows = document.getElementsByTagName('tr');
    for (var i=0; i < rows.length; i++) {
        var columns = rows[i].getElementsByTagName('td');
        for (var j = 0; j < columns.length; j++) {
            columns[j].className = '';
            if(columns[j].hasAttribute('title'));
            columns[j].removeAttribute('title');
        }
    }
}

function paymentHistoryRequest(name) {
    var json = JSON.stringify(name);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/get_student_payment_history', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            historyFill(result.data);
        }
    }
    xhr.send(json);
}

function historyFill(data) {
    var ul_sum = document.querySelector('#payment-history .sum');
    var ul_date = document.querySelector('#payment-history .date');
    for (var j = 0; j < data.length; j++) {
        var new_li_sum = document.createElement("li");
        new_li_sum.innerHTML = data[j][1];
        ul_sum.appendChild(new_li_sum);
        var new_li_date = document.createElement("li");
        new_li_date.innerHTML = monthIntoString(data[j][0]-1);
        ul_date.appendChild(new_li_date);
    }
}

function clearHistory() {
    var sum_li = document.querySelectorAll('#payment-history .sum li');
    var date_li = document.querySelectorAll('#payment-history .date li');
    for(var i=1; i<sum_li.length; i++){
        sum_li[i].remove();
    }
    for(var j=1; j<date_li.length; j++){
        date_li[j].remove();
    }
}


window.addEventListener("keyup", escapeClickedLocal);

function escapeClickedLocal(event){
    if (event.keyCode === 27) {
            clearHistory();
    }
}

function penaltyDetailsRequest(name) {
    var json = JSON.stringify(name);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/get_penalty_info', true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            penaltyDetailsFill(result);
        }
    };
    xhr.send(json);
}

function penaltyDetailsFill(data) {
    var details_li = document.querySelectorAll('#penalty-details li span');
    details_li[1].innerHTML = data.sum_to_pay;
    details_li[3].innerHTML = data.penalty;
    details_li[5].innerHTML = data.sum_to_pay + data.penalty;
}

