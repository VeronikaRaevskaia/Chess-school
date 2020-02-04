var array_m = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
var today = new Date(); //сегодняшняя дата
var first_day = new Date(today.getFullYear(), today.getMonth(), 1);  //1-е число текущего месяца

function monthIntoStringTable(month) {   //преобразует месяц из номера в название для полной таблицы
    if(month >= 0)
        return array_m[month];
    else
        return array_m[11];
}

function monthsTitlesOutput() {  //вывод текущего и предыдущего месяца
    var previous_m_title = document.querySelector('.previous-month.payment .title span');
    var previous_month = monthIntoStringTable(first_day.getMonth() - 1);
    previous_m_title.innerHTML += previous_month;

    var current_m_title = document.querySelector('.current-month.payment .title span');
    var current_month = monthIntoStringTable(first_day.getMonth());
    current_m_title.innerHTML += current_month;
}

window.addEventListener("load", monthsTitlesOutput);


function waitingRequestAdd() {
    var names = document.querySelectorAll('.personal-data ul.name li:not(.title)');
    for(var j=0; j<names.length; j++){
        names[j].removeEventListener("click", studentNameClickFunction);
    }
    var inputs = document.querySelectorAll('.personal-data input');
    for(var i=0; i<inputs.length; i++){
        inputs[i].disabled = true;
    }
    document.body.classList.add('wait');
}

function waitingRequestRemove() {
    var names = document.querySelectorAll('.personal-data ul.name li:not(.title)');
    for(var j=0; j<names.length; j++){
        names[j].addEventListener("click", studentNameClickFunction);
    }
    var inputs = document.querySelectorAll('.personal-data input');
    for(var i=0; i<inputs.length; i++){
        inputs[i].disabled = false;
    }
    document.body.classList.remove('wait');
}


checkboxes = document.querySelectorAll('.penalty-checkbox input');
function checkboxesClickFunction() {
    var number;
    for(var j=0; j<checkboxes.length; j++){
        if(this === checkboxes[j])
            number = j+1;
    }
    var name = document.querySelectorAll('.personal-data ul.name li')[number].innerHTML;
    if(this.checked){
        this.checked = true;
        penaltyRequest(name, '/impose_penalty', 'штраф зачислен', number,  selectedLiPenaltyAdd);
    }
    else{
        this.checked = false;
        penaltyRequest(name, '/forgive_penalty', 'штраф простили', number,  selectedLiPenaltyRemove);
    }
}

for(var i=0; i<checkboxes.length; i++){
    checkboxes[i].addEventListener("click", checkboxesClickFunction);
}

function selectedLiPenaltyRemove(number) {
    var ul = document.querySelectorAll('.personal-data ul');
    for (var k = 0; k < ul.length; k++) {
        var selected_li = ul[k].children[number];
        selected_li.classList.remove('penalty');
    }
}

function selectedLiPenaltyAdd(number) {
    var ul = document.querySelectorAll('.personal-data ul');
    for (var k = 0; k < ul.length; k++) {
        var selected_li = ul[k].children[number];
        selected_li.classList.add('penalty');
    }
}

function penaltyRequest(name, url, message, number, callback) {
    waitingRequestAdd();
    var json = JSON.stringify(name);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var result = JSON.parse(xhr.responseText);
            if(result.success) {
                document.querySelectorAll('.recommended-sum li')[number].innerHTML = result.sum_to_pay;
                callback(number);
                waitingRequestRemove();
            }
        }
    };
    xhr.send(json);
}


function addPaymentRequest(name, value, month, number) {  //запрос при изменении значения оплаты
    var ul = document.querySelectorAll('.personal-data ul');
    var debt = document.querySelectorAll('ul.recommended-sum li');
    var penalty = document.querySelectorAll('ul.penalty-checkbox li input');
    var data = {};
    data.summ = value;
    data.name  = name;
    data.month = month;
    var json = JSON.stringify(data);
    waitingRequestAdd();
    ajax('POST', '/change_payment_statistics', json, function (data) {
        if(data.success) {
            if (data.recommended_sum == '0') {
                for (var k = 0; k < ul.length; k++) {
                    var selected_li = ul[k].children[number];
                    selected_li.classList.remove('debt');
                }
            }
            else {
                for (var k = 0; k < ul.length; k++) {
                    var selected_li = ul[k].children[number];
                    selected_li.classList.add('debt');
                }
            }
            debt[number].innerHTML = data.recommended_sum;
            if (penalty[number - 1].checked != data.has_penalty) {
                penaltyIntoPurple();
                if (data.has_penalty)
                    penalty[number - 1].checked = true;
                else
                    penalty[number - 1].checked = false;
            }
            waitingRequestRemove();
        }
    });
}

function changePayment(event, month) {
    var element = event;
    var new_value = element.value;
    var number = inputNumber(element);
    var li = document.querySelectorAll('.personal-data .name li');
    var name = li[number].innerHTML;
    addPaymentRequest(name, new_value, month, number);
}

var previous_m_payment = document.querySelectorAll('.previous-month.payment input');
for(var i=0; i<previous_m_payment.length; i++){
    previous_m_payment[i].onchange = function (event) {
        var previous_month =  first_day.getMonth();
        if(!previous_month)
            previous_month = 12;
        changePayment(event.target, previous_month);
    }
}

var current_m_payment = document.querySelectorAll('.current-month.payment input');
for(var i=0; i<current_m_payment.length; i++){
    current_m_payment[i].onchange = function (event) {
        var current_month = first_day.getMonth()+1;
        changePayment(event.target, current_month);
    }
}

window.addEventListener("load", defaultValuesRecording);

var student_name = [], price = [], previous_payment = [], current_payment = [], recommended_sum = [], group = [], length;
function defaultValuesRecording() {
     var arr_1 = document.querySelectorAll('.personal-data .name li');
     var arr_2 = document.querySelectorAll('.personal-data .price li');
     var arr_3 = document.querySelectorAll('.personal-data .previous-month input');
     var arr_4 = document.querySelectorAll('.personal-data .current-month input');
     var arr_5 = document.querySelectorAll('.personal-data .recommended-sum li');
     var arr_6 = document.querySelectorAll('.personal-data .student-group li');
     length = arr_1.length;
     for(var i=1; i<length; i++){
         student_name[i] = arr_1[i].innerHTML;
         price[i] = arr_2[i].innerHTML;
         previous_payment[i] = arr_3[i-1].value;
         current_payment[i] = arr_4[i-1].value;
         recommended_sum[i] = arr_5[i].innerHTML;
         group[i] = arr_6[i].innerHTML;
     }

}

var by_group_data;
window.addEventListener("load", function () {
        ajax('POST', '/filter_by_groups', 0, function (data) {
            if (data.success)
                by_group_data = data.data;
        })
});

function oldDataDeleting() {
    var ul = document.querySelectorAll('.personal-data ul');
    for(var i=0; i<ul.length; i++){
        ul[i].remove();
    }
}

document.querySelector('li.no-sort').onclick = function() {
    if(!this.classList.contains('checked')) {
        document.querySelector('div.personal-data').classList.remove('by-groups');
        oldDataDeleting();
        noSortTableCreation();
        liClassCheckedConfiguration('sorting', this);
        modalSettings();
    }
};

document.querySelector('li.by-groups').onclick = function() {
    if(!this.classList.contains('checked')) {
        document.querySelector('div.personal-data').classList.add('by-groups');
        oldDataDeleting();
        byGroupTableCreation();
        liClassCheckedConfiguration('sorting', this);
    }
};

function noSortTableCreation() {
    var p_data = document.querySelector('div.personal-data');

    var new_ul_number = document.createElement('ul');
    new_ul_number.classList.add('number');
    p_data.appendChild(new_ul_number);

    var new_ul_name = document.createElement('ul');
    new_ul_name.classList.add('name');
    p_data.appendChild(new_ul_name);

    var new_ul_price = document.createElement('ul');
    new_ul_price.classList.add('price');
    p_data.appendChild(new_ul_price);

    var new_ul_p_month = document.createElement('ul');
    new_ul_p_month.classList.add('previous-month');
    new_ul_p_month.classList.add('payment');
    p_data.appendChild(new_ul_p_month);

    var new_ul_c_month = document.createElement('ul');
    new_ul_c_month.classList.add('current-month');
    new_ul_c_month.classList.add('payment');
    p_data.appendChild(new_ul_c_month);

    var new_ul_r_sum = document.createElement('ul');
    new_ul_r_sum.classList.add('recommended-sum');
    p_data.appendChild(new_ul_r_sum);

    var new_ul_group = document.createElement('ul');
    new_ul_group.classList.add('student-group');
    p_data.appendChild(new_ul_group);

    var new_title_number, new_title_name, new_title_price, new_title_p_month, new_title_c_month, new_title_r_sum, new_title_group;
    var new_span_number, new_span_name, new_span_price, new_span_p_month, new_span_c_month, new_span_r_sum, new_span_group;
    var new_li_number, new_li_name, new_li_price, new_li_p_month, new_li_c_month, new_li_r_sum, new_li_group;
    var new_input_p_month, new_input_c_month;

   new_title_number = document.createElement('li');
    new_title_number.classList.add('title');
    new_ul_number.appendChild(new_title_number);
    new_span_number = document.createElement('span');
    new_span_number.innerHTML = '№';
    new_title_number.appendChild(new_span_number);

    new_title_name = document.createElement('li');
    new_title_name.classList.add('title');
    new_ul_name.appendChild(new_title_name);
    new_span_name = document.createElement('span');
    new_span_name.innerHTML = 'Имя ученика';
    new_title_name.appendChild(new_span_name);

    new_title_price = document.createElement('li');
    new_title_price.classList.add('title');
    new_ul_price.appendChild(new_title_price);
    new_span_price = document.createElement('span');
    new_span_price.innerHTML = 'Стоимость' + "<br />" + 'занятий';
    new_title_price.appendChild(new_span_price);

    new_title_p_month = document.createElement('li');
    new_title_p_month.classList.add('title');
    new_ul_p_month.appendChild(new_title_p_month);
    new_span_p_month = document.createElement('span');
    new_span_p_month.innerHTML = 'Оплата за ' +  "<br />" + monthIntoStringTable(first_day.getMonth() - 1);
    new_title_p_month.appendChild(new_span_p_month);

    new_title_c_month = document.createElement('li');
    new_title_c_month.classList.add('title');
    new_ul_c_month.appendChild(new_title_c_month);
    new_span_c_month = document.createElement('span');
    new_span_c_month.innerHTML = 'Оплата за ' +  "<br />" + monthIntoStringTable(first_day.getMonth());
    new_title_c_month.appendChild(new_span_c_month);

    new_title_r_sum = document.createElement('li');
    new_title_r_sum.classList.add('title');
    new_ul_r_sum.appendChild(new_title_r_sum);
    new_span_r_sum = document.createElement('span');
    new_span_r_sum.innerHTML = 'Рекомендуемая' +  "<br />" + 'сумма';
    new_title_r_sum.appendChild(new_span_r_sum);

    new_title_group = document.createElement('li');
    new_title_group.classList.add('title');
    new_ul_group.appendChild(new_title_group);
    new_span_group = document.createElement('span');
    new_span_group.innerHTML = 'Группа';
    new_title_group.appendChild(new_span_group);

    for(var i=1; i<length; i++){
        new_li_number = document.createElement('li');
        new_li_number.innerHTML = i;
        new_ul_number.appendChild(new_li_number);

        new_li_name = document.createElement('li');
        new_li_name.innerHTML = student_name[i];
        new_ul_name.appendChild(new_li_name);

        new_li_price = document.createElement('li');
        new_li_price.innerHTML = price[i];
        new_ul_price.appendChild(new_li_price);

        new_li_p_month = document.createElement('li');
        new_ul_p_month.appendChild(new_li_p_month);
        new_input_p_month = document.createElement('input');
        new_input_p_month.value = previous_payment[i];
        new_input_p_month.placeholder = 'Ожидание';
        new_li_p_month.appendChild(new_input_p_month);

        new_li_c_month = document.createElement('li');
        new_ul_c_month.appendChild(new_li_c_month);
        new_input_c_month = document.createElement('input');
        new_input_c_month.value = current_payment[i];
        new_input_c_month.placeholder = 'Ожидание';
        new_li_c_month.appendChild(new_input_c_month);

        new_li_r_sum = document.createElement('li');
        new_li_r_sum.innerHTML = recommended_sum[i];
        new_ul_r_sum.appendChild(new_li_r_sum);

        new_li_group = document.createElement('li');
        new_li_group.innerHTML = group[i];
        new_ul_group.appendChild(new_li_group);
    }

    underlineEvent();
    debtsIntoRed();
}

function byGroupTableCreation() {
    var new_length = by_group_data.length+1;
    var p_data = document.querySelector('div.personal-data');

    var new_ul_number = document.createElement('ul');
    new_ul_number.classList.add('number');
    p_data.appendChild(new_ul_number);

    var new_ul_group = document.createElement('ul');
    new_ul_group.classList.add('group');
    p_data.appendChild(new_ul_group);

    var new_ul_teacher = document.createElement('ul');
    new_ul_teacher.classList.add('teacher');
    p_data.appendChild(new_ul_teacher);

    var new_ul_paid = document.createElement('ul');
    new_ul_paid.classList.add('paid');
    p_data.appendChild(new_ul_paid);

    var new_ul_debt = document.createElement('ul');
    new_ul_debt.classList.add('group-debt');
    p_data.appendChild(new_ul_debt);

    var new_ul_weekdays = document.createElement('ul');
    new_ul_weekdays.classList.add('weekdays');
    p_data.appendChild(new_ul_weekdays);

    var new_title_number, new_title_group, new_title_teacher, new_title_paid, new_title_debt, new_title_weekdays;
    var new_span_number, new_span_group, new_span_teacher, new_span_paid, new_span_debt, new_span_weekdays;
    var new_li_number, new_li_group, new_li_teacher, new_li_paid, new_li_debt, new_li_weekdays;

    new_title_number = document.createElement('li');
    new_title_number.classList.add('title');
    new_ul_number.appendChild(new_title_number);
    new_span_number = document.createElement('span');
    new_span_number.innerHTML = '№';
    new_title_number.appendChild(new_span_number);

    new_title_group = document.createElement('li');
    new_title_group.classList.add('title');
    new_ul_group.appendChild(new_title_group);
    new_span_group = document.createElement('span');
    new_span_group.innerHTML = 'Группа';
    new_title_group.appendChild(new_span_group);

    new_title_teacher = document.createElement('li');
    new_title_teacher.classList.add('title');
    new_ul_teacher.appendChild(new_title_teacher);
    new_span_teacher = document.createElement('span');
    new_span_teacher.innerHTML = 'Тренеры';
    new_title_teacher.appendChild(new_span_teacher);

    new_title_paid = document.createElement('li');
    new_title_paid.classList.add('title');
    new_ul_paid.appendChild(new_title_paid);
    new_span_paid = document.createElement('span');
    new_span_paid.innerHTML = 'Оплачено';
    new_title_paid.appendChild(new_span_paid);

    new_title_debt = document.createElement('li');
    new_title_debt.classList.add('title');
    new_ul_debt.appendChild(new_title_debt);
    new_span_debt = document.createElement('span');
    new_span_debt.innerHTML = 'Задолженность';
    new_title_debt.appendChild(new_span_debt);

    new_title_weekdays = document.createElement('li');
    new_title_weekdays.classList.add('title');
    new_ul_weekdays.appendChild(new_title_weekdays);
    new_span_weekdays = document.createElement('span');
    new_span_weekdays.innerHTML = 'Дополнение';
    new_title_weekdays.appendChild(new_span_weekdays);


    for(var i=1; i<new_length; i++){
        new_li_number = document.createElement('li');
        new_li_number.innerHTML = i;
        new_ul_number.appendChild(new_li_number);

        new_li_group = document.createElement('li');
        new_li_group.innerHTML = by_group_data[i-1].group;
        new_ul_group.appendChild(new_li_group);

        new_li_teacher = document.createElement('li');
        new_li_teacher.innerHTML = by_group_data[i-1].teacher;
        new_ul_teacher.appendChild(new_li_teacher);

        new_li_paid = document.createElement('li');
        new_li_paid.innerHTML = by_group_data[i-1].paid;
        new_ul_paid.appendChild(new_li_paid);

        new_li_debt = document.createElement('li');
        new_li_debt.innerHTML = by_group_data[i-1].must_pay;
        new_ul_debt.appendChild(new_li_debt);

        new_li_weekdays = document.createElement('li');
        new_li_weekdays.innerHTML = by_group_data[i-1].weekdays;
        new_ul_weekdays.appendChild(new_li_weekdays);
    }
    underlineEvent();
    byGroupsMWindowCreation();
}

function liClassCheckedConfiguration(ul_class_name, clicked) {
    var li = document.querySelectorAll('.' + ul_class_name + ' li');
    for(var i=0; i<li.length; i++){
        li[i].classList.remove('checked');
    }
    clicked.classList.add('checked');
}

document.getElementById('exel-export').addEventListener("click", myFunction);


function myFunction() {
 //   var table = document.querySelector('div.personal-data').innerHTML;
   // var data = table.replace(/<ul.*>\s*/g, '')
 //       .replace(/<li.*?>/g, '')
 //       .replace(/<span.*/g, '')
  //      .replace(/<input.*?value="/g, '')
   //     .replace(/".*/g, '')
  //      .replace(/<\/li>/g, ';')
   //     .replace(/\s*/g, '')
   //     .replace(/;\s*<\/ul>/g, '\r\n');
    var data='';
    var table;
    var ul = document.querySelectorAll('div.personal-data ul');
    var len_1 = ul[0].getElementsByTagName('li').length;
    var len_2 = ul.length;
    for(var i=0; i<len_1; i++){
        for(var j=0; j<len_2; j++) {
            table = ul[j].querySelectorAll('li')[i].innerHTML + ';';
            var string = table.replace(/<span.*?>/g, '')
                    .replace(/<\/span>/g, '')
                    .replace(/<br>/g, ' ')
                    .replace(/\s*<input type="text" value="/g, '')
                    .replace(/" placeholder.*>\s*/g, '');
            data += string;
        }
        data += '\r\n';
    }
    data = data.replace(/(;)(?!.*;)/g, '');
    alert(data);
    var myLink = document.createElement('a');
    myLink.download = 'csvname.csv';
    myLink.href = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURI(data);
    myLink.click();
}


