var today = new Date();
var buttons = document.querySelectorAll('ul.months button');
var extended_statistics;

document.querySelector('div.pay-button').onclick = function (){
    var sum = document.querySelector("input[name='sum']");
    if(sum.value && getComputedStyle(sum, ':invalid').color != 'rgb(213, 0, 0)') {
        sum.value = sum.value.replace(",", ".");
        var form = document.querySelector('form[name=new-payment]');
        form.method = 'post';
        form.action = '/payment_gateway';
        form.submit();
    }
};

function statisticsFill() {
    var string = document.querySelectorAll('div.statistics .month .check');
    var st_content = document.querySelectorAll('div.statistics-content');
    var error = document.querySelectorAll('span.error');
    for(var i=0; i<string.length; i++){
        if(string[i].innerHTML == ''){
            st_content[i].classList.remove('show');
            error[i].classList.add('show');
        }
        else{
            st_content[i].classList.add('show');
            error[i].classList.remove('show');
        }
    }
}

function beforeMonthsButtons() {
    for(var i=0; i<extended_statistics.length; i++){
        if(!extended_statistics[i].active_status)
            buttons[i].setAttribute('disabled', 'disabled');
        else
            break;

    }
}

function currentMonthConvert() {
    var current_month = today.getMonth();
    var number;
    switch (current_month) {
        case 8:
            number = 0;
            break;
        case 9:
            number = 1;
            break;
        case 10:
            number = 2;
            break;
        case 11:
            number = 3;
            break;
        case 0:
            number = 4;
            break;
        case 1:
            number = 5;
            break;
        case 2:
            number = 6;
            break;
        case 3:
            number = 7;
            break;
        case 4:
            number = 8;
            break;
        default:
            break;
    }
       return number;
}

function futureMonthsButtons() {
    var number = currentMonthConvert();
    for(var i=number+1; i<buttons.length; i++){
        buttons[i].setAttribute('disabled', 'disabled');
    }
    for(var k=0; k<number+1; k++){
        buttons[k].onclick = function (event) {
            var month = event.target.innerHTML;
            var li_list = event.target.parentElement.parentElement.children;
            var clicked_number;
            for(var l=0; l<li_list.length;l++) {
                if (li_list[l] == event.target.parentElement) {
                    clicked_number = l;
                    monthStatisticsFill(month, clicked_number);
                    break;
                }
            }
        }
    }
    beforeMonthsButtons();
}

window.onload = function () {
    extended_statistics =  JSON.parse(localStorage.getItem("extended_statistics"));
    var sum = document.querySelector('ul.sum');
    var sum_element = sum.querySelectorAll('li')[0];
    if(sum_element.innerHTML != '0')
    {
        var new_li_sum = document.createElement('li');
        new_li_sum.innerHTML = 'Сумма:';
        new_li_sum.classList.add('header');
        sum.insertBefore(new_li_sum, sum.firstChild);
        var date = document.querySelector('ul.date');
        var new_li_date= document.createElement('li');
        new_li_date.innerHTML = 'Дата:';
        new_li_date.classList.add('header');
        date.insertBefore(new_li_date, date.firstChild);
    }
    else{
        var content = document.querySelector('.history div.model-content');
        var new_message = document.createElement('span');
        content.appendChild(new_message);
        new_message.classList.add('no-payments');
        new_message.innerHTML = 'Оплат еще не поступало';
        var all_payments = document.querySelector('div.all-payments');
        all_payments.style.display = 'none';
    }
    futureMonthsButtons();
    setTimeout(statisticsFill, 2000);
};

document.querySelector('li.history').onclick = function () {                  //история оплат
    document.querySelector('div.bg-modal.history').classList.toggle('show');
};

document.querySelector('div.history button.close').onclick = function () {
    document.querySelector('div.bg-modal.history').classList.toggle('show');
};

document.querySelector('li.new').onclick = function () {                  //новая оплата
    document.querySelector('div.bg-modal.new').classList.toggle('show');
};

document.querySelector('div.new button.close').onclick = function () {
    document.querySelector('div.bg-modal.new').classList.toggle('show');
};

document.querySelector('li.security').onclick = function () {                  //безопастность платежа
    document.querySelector('div.bg-modal.security').classList.toggle('show');
};

document.querySelector('div.security button.close').onclick = function () {
    document.querySelector('div.bg-modal.security').classList.toggle('show');
};

document.querySelector('div.payment-status button.close').onclick = function () {
    document.querySelector('div.bg-modal.payment-status').classList.toggle('show');
};

document.querySelector('div.statistics button.close').onclick = function () {
    document.querySelector('div.bg-modal.statistics').classList.toggle('show');
};

function monthStatisticsFill(month, clicked_number) {
    if(extended_statistics[clicked_number].active_status > 0) {
        document.querySelector('.values .month').innerHTML = month;
        var total = extended_statistics[clicked_number].total;
        var attended = extended_statistics[clicked_number].attended;
        var spravka = extended_statistics[clicked_number].spravka;
        var unattended = extended_statistics[clicked_number].unattended;
        var sum_to_pay = extended_statistics[clicked_number].sum_to_pay;
        document.querySelector('.values .total').innerHTML = total;
        document.querySelector('.values .attended').innerHTML = attended;
        document.querySelector('.values .spravka').innerHTML = spravka;
        document.querySelector('.values .unattended').innerHTML = unattended;
        document.querySelector('.values .sum-to-pay').innerHTML = sum_to_pay + ' рублей';
        document.querySelector('div.bg-modal.statistics').classList.toggle('show');
    }
}
