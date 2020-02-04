var array_m = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
var today = new Date();
var visiable_date = new Date(today.getFullYear(), today.getMonth(), 1);
var dates = new Array(7);
for(var i=0; i<7; i++) {
    dates[i]=new Array();
}

function dateOutput(){
    document.querySelector('span.year');
    document.querySelector('span.month').innerHTML = monthIntoString(visiable_date.getMonth());
    document.querySelector('span.year').innerHTML = visiable_date.getFullYear();
}

function monthIntoString(month) {
    return array_m[month];
}

function monthIntoNumber(month){
    for(var i=0; i<12; i++){
        if(month==array_m[i])
        {
            return i;
            break;
        }
    }
}

function monthPrepare() {
    var month = document.querySelector('span.month').innerHTML;
    month = monthIntoNumber(month);
    month++;
    return month;
}

var arrow_left = document.querySelector('#competitions li.arrow-left');
var arrow_right = document.querySelector('#competitions li.arrow-right');

window.addEventListener("load", dateOutput);
window.addEventListener("load", calendarFill);
arrow_left.addEventListener("click", lastMonth);
arrow_right.addEventListener("click", nextMonth);
arrow_left.addEventListener("click", anotherMonth);
arrow_right.addEventListener("click", anotherMonth);

function lastMonth() {
    visiable_date.setMonth(visiable_date.getMonth()-1);
    dateOutput();
}
function nextMonth() {
    visiable_date.setMonth(visiable_date.getMonth()+1);
    dateOutput();
}


function anotherMonth() {  //функция посылает запрос при выборе другого месяца
    var calendar = document.querySelector('div.calendar');
    var month = document.querySelector('span.month').innerHTML;
    month = monthIntoNumber(month);
    month++;
    calendarClear();
    calendarFill();
}

function calendarFill() {
    var local_date = new Date();
    local_date.setTime(visiable_date.getTime());
    var week_day = local_date.getDay();
    var i;
    var j;
    var k;
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
        for (i; i < rows.length; i++) {
            var columns = rows[i].getElementsByTagName('td');
            for (j; j < columns.length; j++) {
                if (local_date.getMonth() === visiable_date.getMonth()) {
                    columns[j].classList.add('current-month');
                    if (visiable_date.getMonth() === today.getMonth()) {
                        if (local_date.getDate() === today.getDate() && local_date.getMonth() === today.getMonth() && local_date.getFullYear() === today.getFullYear()) {
                            columns[j].classList.add('today');
                            columns[j].setAttribute('title', 'Сегодняшнее число');
                        }
                    }
                    competitionsFill(local_date, columns[j]);
                }
                else
                    columns[j].classList.add('not-passed');

                columns[j].innerHTML = local_date.getDate().toString();
                local_date.setDate(local_date.getDate() + 1);
            }
            j = 0;
        }
    local_date.setMonth(visiable_date.getMonth());
    local_date.setDate(visiable_date.getDate() - 1);
    var columns = document.getElementsByTagName('tr')[1].getElementsByTagName('td');
    for (k; k >= 0; k--) {
        columns[k].innerHTML = local_date.getDate().toString();
        local_date.setDate(local_date.getDate() - 1);
        columns[k].classList.add('not-passed');
    }

    duplicationCompetitionsFill();
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


var competitions = [
    [[3,4], 1, 2020],
    [[5], 1, 2020],
    [[6,7], 1, 2020],
    [[11], 1, 2020],
    [[12], 1, 2020],
    [[18], 1, 2020],
    [[19], 1, 2020],
    [[25], 1, 2020],
    [[26], 1, 2020],
    [[1], 2, 2020],
    [[2], 2, 2020],
    [[8], 2, 2020],
    [[15], 2, 2020],
    [[29], 2, 2020],
    [[8,9,15,16], 2, 2020],
    [[22,23,24,25,26], 2, 2020]
];


function competitionsFill(local_date, td) {
    for (var k = 0; k < competitions.length; k++) {
        if(local_date.getFullYear() === competitions[k][2]) {
            if (local_date.getMonth() + 1 === competitions[k][1]) {
                for (var l = 0; l < competitions[k][0].length; l++) {
                    if (local_date.getDate() === competitions[k][0][l]) {
                        td.classList.add('com-' + (k % 6));
                        td.classList.add('competition');
                        if(td.hasAttribute('title')){
                            var title = td.getAttribute('title');
                            td.setAttribute('title',title + ', № ' + (k+1));
                        }
                        else
                        td.setAttribute('title','№ ' + (k+1));
                    }
                }
            }
        }
        if(competitions[k][3]){
            if(local_date.getFullYear() === competitions[k][5]) {
                if (local_date.getMonth() + 1 === competitions[k][4]) {
                    for (var l = 0; l < competitions[k][3].length; l++) {
                        if (local_date.getDate() === competitions[k][3][l]) {
                            td.classList.add('com-' + (k % 6));
                            td.classList.add('competition');
                            if(td.hasAttribute('title')){
                                var title = td.getAttribute('title');
                                td.setAttribute('title',title + ', № ' + (k+1));
                            }
                            else
                                td.setAttribute('title','№ ' + (k+1));
                        }
                    }
                }
            }
        }
    }
}

var pages_control = document.querySelectorAll('.page-control li');
function pagesClear() {
    var pages = document.querySelectorAll('.page.active');
    for(var i = 0; i < pages.length; i++){
        pages[i].classList.remove('active');
    }
}

function pagesControlsClear() {
    for(var i = 0; i < pages_control.length; i++){
        pages_control[i].className = '';
    }
}

function pagesControlsClick() {
    if(!this.classList.contains('active')) {
        pagesControlsClear();
        this.classList.add('active');
        var number;
        for (var i = 0; i < pages_control.length; i++) {
            if (this === pages_control[i]) {
                pagesClear();
                number = i+2;
                var pages = document.querySelectorAll('.competitions-info-content>ul>li:nth-child(' + number + ')');
                for (var j = 0; j < pages.length; j++) {
                    pages[j].classList.add('active');
                }
            }
        }
    }
}

for(var i = 0; i < pages_control.length; i++){
    pages_control[i].addEventListener("click", pagesControlsClick);
}

function duplicationCompetitionsFill() {//функция преобразует ячейки с
    var td = document.querySelectorAll('td.competition');
    var pattern = /com-\d.*com-\d/;
    for(var i=0; i<td.length; i++){
        var str = td[i].classList.toString();
        if(pattern.test(str)) {
            var patternCom = /com-\d/g;
            var com = str.match(patternCom);
            var newSpan = document.createElement('span');
            newSpan.textContent = td[i].textContent;
            td[i].appendChild(newSpan);
            for(var j=0; j<com.length; j++) {
                var newDiv = document.createElement('div');
                newDiv.classList.add(com[j]);
                td[i].appendChild(newDiv);
                console.log('добавлен див');
            }
        }
    }
}