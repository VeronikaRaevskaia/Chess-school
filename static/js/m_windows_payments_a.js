
function byGroupsMWindowCreation(){
    var modal = document.querySelector('.bg-modal.by-groups');
    var groups = document.querySelectorAll('.personal-data ul.group li:not(.title)');
    var group = document.querySelector('span.checked-group');
    for (var j = 0; j < groups.length; j++) {
        groups[j].addEventListener("click", function () {
            var data = {};
            data.group = this.innerHTML;
            var json = JSON.stringify(data);
            ajax('POST', '/get_payments_by_all_student_in_month', json, function (result) {
                    eachGroupMWindowFilling(result);
            });
            dateOutput('by-groups');
            var current_group = this.innerHTML;
            group.innerHTML = current_group;
            eachGroupMWindowFilling(current_group);
            modal.classList.toggle('show');
        })
    }
    var close = document.querySelector('div.by-groups button.close');
    close.onclick = function () {
        modal.classList.remove('show');
    }
}

function eachGroupMWindowFilling(result) {
    eachGroupMWindowClearing();
    if(result.success) {

        var length = result.group.length;
        var number_title = document.querySelector('.each-group ul.number');
        var name_title = document.querySelector('.each-group ul.name');
        var payment_sum_title = document.querySelector('.each-group ul.payment-sum');
        var total=0;
        for (var j = 0; j < length; j++) {
            total = total +  parseInt(result.group[j].sum);
        }
       document.getElementById('total').innerHTML = total;

        for (var i = 0; i < length; i++) {
            var new_li_number = document.createElement('li');
            new_li_number.innerHTML = i;
            number_title.appendChild(new_li_number);

            var new_li_name = document.createElement('li');
            new_li_name.innerHTML = result.group[i].name;
            name_title.appendChild(new_li_name);

            var new_li_payment_sum = document.createElement('li');
            new_li_payment_sum.innerHTML = result.group[i].sum;
            payment_sum_title.appendChild(new_li_payment_sum);
        }
    }
}

function eachGroupMWindowClearing(){
    var number_li = document.querySelectorAll('.each-group .number li');
    var name_li = document.querySelectorAll('.each-group .name li');
    var payment_sum_li = document.querySelectorAll('.each-group .payment-sum li');
    for(var i=1; i<number_li.length; i++){
        number_li[i].remove();
        name_li[i].remove();
        payment_sum_li[i].remove();
    }
}