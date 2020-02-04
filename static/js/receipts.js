var classes = document.querySelectorAll('div.group-list li');   //нажатие на любую из групп
for(var i=0; i<classes.length; i++){
    classes[i].addEventListener("click", groupSelect);
}

var old_data;

function groupSelect() {
    clearClasses();
    this.classList.add('underline');
    document.querySelector('div.date').classList.add('show');
    waitingOn();
    attendanceRequest(this, monthPrepare());
}

function waitingOn() {
    document.querySelector('div.loader').classList.add('show');
    var lm = document.querySelector('img.last-month');
    lm.classList.add('wait');
    var nm = document.querySelector('img.next-month');
    nm.classList.add('wait');
    document.querySelector('div.group-list ul').classList.add('wait');
    document.querySelector('div.table').classList.remove('show');
    lm.removeEventListener("click", anotherMonth);
    nm.removeEventListener("click", anotherMonth);
}

function waitingOff() {
    document.querySelector('div.loader').classList.remove('show');
    var lm = document.querySelector('img.last-month');
    lm.classList.remove('wait');
    var nm = document.querySelector('img.next-month');
    nm.classList.remove('wait');
    document.querySelector('div.group-list ul').classList.remove('wait');
    document.querySelector('div.table').classList.add('show');
    lm.addEventListener("click", anotherMonth);
    nm.addEventListener("click", anotherMonth);
}

function attendanceRequest(group, month) {
    var group_name = group.innerHTML;
    var data = {};
    data.month = month;
    data.student_group  = group_name;
    var json = JSON.stringify(data);
    ajax('POST', '/get_students_attendance', json, function (data) {
        old_data = data;
        clearTable();
        attendanceTable(data);
        waitingOff();
        canStatusCheck();
    });
}

function wasSicknote(sicknote_days, check_day) {
    var result = false;
    for(var i=0; i<sicknote_days.length; i++){
        if(check_day == sicknote_days[i]){
            result = true;
            break;
        }
    }
    return result;
}

function wasUnattended(unattended_days, check_day) {
    var result = false;
    for(var i=0; i<unattended_days.length; i++){
        if(check_day == unattended_days[i]){
            result = true;
            break;
        }
    }
    return result;
}

function attendanceTable(result) {
    var table = document.querySelector('div.table table');
    var column = table.querySelector('thead tr');
    var th_length = result.total.length;
    var class_name;
    switch(th_length) {
        case 3:
            class_name = 'th-3';
            break;
        case 4:
            class_name = 'th-4';
            break;
        case 5:
            class_name = 'th-5';
            break;
        case 7:
            class_name = 'th-7';
            break;
        case 8:
            class_name = 'th-8';
            break;
        case 9:
            class_name = 'th-9';
            break;
    }
    for(var i=0; i<th_length; i++){
        var new_th = document.createElement("th");
        new_th.innerHTML = result.total[i];
        new_th.classList.add(class_name);
        column.appendChild(new_th);
    }


    for(var i=0; i<result.data.length; i++){
        var new_tr = document.createElement("tr");
        table.querySelector('tbody').appendChild(new_tr);
        for(var j=0; j<result.total.length+1; j++){
            var new_td = document.createElement("td");
            new_tr.appendChild(new_td);
            if(j == 0) {
                new_td.innerHTML = result.data[i].name;
            }
            else {
                if(wasSicknote(result.data[i].spravka, result.total[j-1])) {
                    new_td.classList.add('sick-note');
                    new_td.setAttribute('title', 'Отсутствовал по уважительной причине');
                }
                else{
                    if(wasUnattended(result.data[i].unattended, result.total[j-1])) {
                        new_td.classList.add('unattended');
                        new_td.setAttribute('title', 'Отсутствовал по неуважительной причине');
                    }
                    else {
                        new_td.classList.add('attended');
                        new_td.setAttribute('title', 'Присутствовал на занятии');
                    }
                }
                new_td.classList.add('value');
            }
        }
    }
}

function canStatusCheck() {
    var cell = document.querySelectorAll('td.value');
    for(var i=0; i<cell.length; i++){
        cell[i].onclick = function () {
            var ul_status = document.querySelector('ul.status');
            var td_focus = document.querySelector('td.focus');
            if(this != document.querySelector('td.focus')){
                if(document.querySelector('ul.status')){
                    td_focus.classList.remove('focus');
                    ul_status.remove();
                }
                this.classList.add('focus');
                var new_ul = document.createElement("ul");
                new_ul.classList.add('status');
                this.appendChild(new_ul);
                var li_text = ["Присутствовал на занятии", "Отсутствовал со справкой о болезни", "Отсутствовал по неуважительной причине"];
                var li_class = ["attended", "sick-note", "unattended"];
                for(var i=0; i<3; i++) {
                    var new_li = document.createElement("li");
                    new_li.innerHTML = li_text[i];
                    new_li.classList.add(li_class[i]);
                    new_ul.appendChild(new_li);
                    new_li.setAttribute('title', ' ');
                }
                statusList(function() {
                    document.querySelector('ul.status').remove();
                });
            }
            else{
                ul_status.remove();
                td_focus.classList.remove('focus');
            }
        }
    }
}

function statusList(callback) {
    var li = document.querySelectorAll('ul.status li');
    for (var i = 0; i < li.length; i++) {
        li[i].onclick = function (event) {
            event.stopPropagation();
            var td = this.parentElement.parentElement;
            td.className = '';
            if (this.classList.contains('attended'))
                td.classList.add('attended');
            else {
                if (this.classList.contains('sick-note'))
                    td.classList.add('sick-note');
                else {
                    if (this.classList.contains('unattended'))
                        td.classList.add('unattended');
                }
            }
            td.classList.add('value');
            callback();
        }
    }
}

function clearTable() {
    var table = document.querySelector('table');
    var tr = table.querySelectorAll('tbody tr');
        var th = table.getElementsByTagName('th');
        for(var i=1; i<th.length; i++){
            th[i].remove();
            i--;
        }
        for (var j = 0; j < tr.length; j++) {
            tr[j].remove();
        }
}


class students{    //класс сохранение данных о изменениях в посещении
    constructor(name = '', unattended = [], sick_note = []){
        this.name = name;
        this.unattended = unattended;
        this.sick_note = sick_note
    }
}


document.querySelector('button.save').onclick = function () {
    sendingNewData(newDataSaving());
    document.querySelector('div.buttons-atd span').innerHTML = 'Идет сохранение ...';
}

var cancel = document.querySelector('button.cancel');
cancel.addEventListener("click", cancelAttendance);

function cancelAttendance() {
    clearTable();
    attendanceTable(old_data);
    canStatusCheck();
}

function cancelError() {
    document.querySelector('div.buttons-atd span').innerHTML = 'Действие не может быть отменено, уже идет сохранение ...';
}

function newDataSaving() {
    var u=0;
    var s=0;
    var st=0;
    var student = [];
    var cell = document.getElementsByTagName('td');
    var table_headers = document.getElementsByTagName('th');
    for(var i=0; i<cell.length; i++) {
        if(cell[i].cellIndex == 0){
            student[st] = new students();
            student[st].name = cell[i].innerHTML;
            st++;
        }
        if(cell[i].classList.contains('unattended')){
            var number = cell[i].cellIndex;
            student[st-1].unattended.push(table_headers[number].innerHTML);
            u++;
        }
        else
        if(cell[i].classList.contains('sick-note')){
            var number = cell[i].cellIndex;
            student[st-1].sick_note.push(table_headers[number].innerHTML);
            s++;
        }
    }
    return student;
}

function sendingNewData(attendance) {
    cancel.removeEventListener("click", cancelAttendance);
    cancel.addEventListener("click", cancelError);
    var month = monthPrepare();
    var data = {};
    data.month = month;
    data.attendance = attendance;
    var json = JSON.stringify(data);
    ajax('POST', '/change_attendance', json, function (data) {
        cancel.removeEventListener("click", cancelError);
        cancel.addEventListener("click", cancelAttendance);
        var span = document.querySelector('div.buttons-atd span');
        if(data.success)
            span.innerHTML = 'Сохранение прошло успешно!';
        else
            span.innerHTML = 'Сохранение не удалось!';
        setTimeout(messageDelete, 3000);
    });
}

function messageDelete() {
    var message = document.querySelector('div.buttons-atd span');
    message.remove();
}

function anotherMonth() {
    var group = document.querySelector('li.underline');
    waitingOn();
    attendanceRequest(group, monthPrepare());
}