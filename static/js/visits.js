var array_m = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
var today = new Date();
var visiable_date = new Date(today.getFullYear(), today.getMonth(), 1);
var dates = new Array(7);
for(var i=0; i<7; i++) {
    dates[i]=new Array();
}

function dateOutput(){
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

window.addEventListener("load", dateOutput);

function lastMonth() {
    visiable_date.setMonth(visiable_date.getMonth()-1);
    dateOutput();
}
function nextMonth() {
    visiable_date.setMonth(visiable_date.getMonth()+1);
    dateOutput();
}
document.querySelector('li.arrow-left').addEventListener("click", lastMonth);
document.querySelector('li.arrow-right').addEventListener("click", nextMonth);


document.querySelector('span.rules-header').onclick = function () {
    document.querySelector('div.bg-modal.rules').classList.toggle('show');
};

document.querySelector('div.rules button.close').onclick = function () {
    document.querySelector('div.bg-modal.rules').classList.toggle('show');
};