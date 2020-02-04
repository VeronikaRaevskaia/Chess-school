function liNumber(element) {
    var all_li = element.parentElement.children;
    for(var j=0; j<all_li.length; j++){
        if(all_li[j] == element)
            return j;
    }
}

function classClearing() {
    var underline = document.querySelectorAll('li.underline');
    if(underline){
        for(var i=0; i<underline.length; i++){
            underline[i].classList.toggle('underline');
        }
    }
}


function inputNumber(element) {
    var all_input = element.parentElement.parentElement.children;
    for(var j=0; j<all_input.length; j++){
        if(all_input[j] == element.parentElement) {
            return j;
        }
    }
}


function stringUnderline() {
    classClearing();
    var element = event.target;
    if(element.tagName == 'LI')
        var number = liNumber(element);
    else{
        if(element.tagName == 'INPUT')
            var number = inputNumber(element);
    }
    var ul = document.querySelectorAll('.personal-data ul');
    for(var j=0; j<ul.length; j++){
        var selected_li = ul[j].children[number];
        if(selected_li)
            selected_li.classList.toggle('underline');
    }
}


function underlineEvent() {
    var li = document.querySelectorAll('.personal-data li');
    for(var i=0; i<li.length; i++){
        li[i].addEventListener("mouseover", stringUnderline);
        li[i].addEventListener("mouseout", classClearing);
    }
    var titles = document.querySelectorAll('li.title');
    var title_spans = document.querySelectorAll('li.title span');
    for(var k=0; k<titles.length; k++){
        if(title_spans[k])
             title_spans[k].style.width = titles[k].offsetWidth + 'px';
    }
}

function debtsIntoRed() {
    var ul = document.querySelectorAll('.personal-data ul');
    var recommended_sum = document.querySelectorAll('.recommended-sum li');
    for (var j = 0; j < recommended_sum.length; j++) {
        if (recommended_sum[j].innerHTML !== '0') {
            var number = liNumber(recommended_sum[j]);
            for (var k = 0; k < ul.length; k++) {
                var selected_li = ul[k].children[number];
                if(selected_li)
                    selected_li.classList.toggle('debt');
            }
        }
    }
}

function penaltyIntoPurple() {
    var ul = document.querySelectorAll('.personal-data ul');
    var checked = document.querySelectorAll("input[type='checkbox']:checked");
    for (var j = 0; j < checked.length; j++) {
           var number = liNumber(checked[j].parentElement);
           for (var k = 0; k < ul.length; k++) {
               var selected_li = ul[k].children[number];
               if(selected_li)
                   selected_li.classList.toggle('penalty');
           }
    }
}

window.addEventListener("load",underlineEvent);
window.addEventListener("load", debtsIntoRed);
window.addEventListener("load", penaltyIntoPurple);



