var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var w = window.innerWidth;
var h = window.innerHeight;
canvas.width =  w;
canvas.height = h;


options = {
    number: 52,
    size: 15,
    sizeRandom: 10
};

if(w<=1024)
    options.number = 36;
if(w<=768)
    options.number = 22;
if(w<=414)
    options.number = 8;

function Rect(x, y, dx, dy, s, opc) {    //функция-конструктор
   this.x = x;
   this.y = y;
   this.dx = dx;
   this.dy = dy;
   this.s = s;
   this.opc = opc;
   
   this.draw = function () {
       ctx.fillStyle = "rgba(144,100,68," + this.opc + ")";
       ctx.fillRect(this.x, this.y, this.s, this.s);
   }
   this.update = function () {
       this.x += this.dx;
       this.y += this.dy;
       if((this.x + this.s) < 0 || (this.x + this.s > (w + this.s)) || (this.y + this.s) < 0){
           this.x = w * Math.random() - (this.s)/2;
           this.y = h - (this.s)/2;
           this.opc = Math.random() + 0.3;
       }
       this.draw();
   }
}

var rectArray = [];
for(var i = 0; i<options.number; i++){
    var random = Math.random() * options.sizeRandom;
    var s = options.size + random;
    var x = w * Math.random() - s/2;
    var y = h * Math.random() - s/2;
    var dx = (Math.random() - 0.5) * 2;
    var dy = Math.random() * (-1) * 2;
    var opc = Math.random();
    rectArray.push(new Rect(x, y, dx, dy, s, opc));
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0 , w, h);
    for(var i = 0; i<rectArray.length; i++)
    {
        rectArray[i].update();
    }
}

animate();


window.addEventListener("resize", function () {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width =  w;
    canvas.height = h;
});

var inputs = document.querySelectorAll('div.input-box input');
for(var i=0; i< inputs.length; i++){
    inputs[i].onfocus = function () {
        this.parentNode.classList.add('focus');
    }
    inputs[i].onblur = function () {
        this.parentNode.classList.remove('focus');
    }
}


var inputs = document.querySelectorAll('div.input-box input');
window.onload = function () {
    inputs[0].focus();
    inputs[0].selectionStart = inputs[0].value.length;
}

window.onkeyup =  function(event) {   //нажатие далее по enter
    var next = document.querySelector('input[type=button]');
    var cur_element = document.activeElement;

    if (event.keyCode == 13) {  //13-код кнопки enter

        if (inputs[0].value != '' && inputs[1].value != '') {   //если заполнены логин и пароль
            var o = document.createEvent('MouseEvents');
            o.initEvent('click', true, true);
            next.dispatchEvent(o);
        }
    }
    if (event.keyCode == 39) {   //если была нажата стрелка вперед
        if (cur_element == inputs[0])
            inputs[1].focus();
        else if (cur_element == inputs[1])
            next.focus();
        else
            inputs[0].focus();
    }
    if (event.keyCode == 37) {   //если была нажата стрелка назад
        if (cur_element == inputs[0])
            next.focus();
        else if (cur_element == inputs[1])
            inputs[0].focus();
        else
            inputs[1].focus();
    }
}

document.querySelector('input[name=enter]').onclick = function (){ //отслеживаем событие нажатия на кнопку вход/далее
    var form = document.querySelector('form[name=log_in]');
    form.method = 'post';
    form.action = '/validate_user';
    form.submit();
}


document.getElementById('forget').onclick = function (){ //отслеживам событие нажатия на кнопку я забыл пароль
    document.querySelector('div.reset-password').classList.toggle('show');
    document.querySelector('div.log-in').classList.toggle('show');
}

document.getElementById('remember').onclick = function (){ //отслеживам событие нажатия на кнопку я знаю пароль
    document.querySelector('div.reset-password').classList.toggle('show');
    document.querySelector('div.log-in').classList.toggle('show');
}

document.querySelector("input[name='send']").onclick = function () { //отслеживаем событие отправить адрес почты
    var label = document.getElementById('answer');
    label.innerHTML = 'Ожидание ...';
    var form =  document.querySelector("form[name='reset-password']");
    var data = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/request_to_password_reset', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var answer = JSON.parse(xhr.responseText);
            if (answer.result)
                label.innerHTML = 'Сообщение на почту успешно отправлено!';
            else
                label.innerHTML = 'Данный email в системе не зарегистрирован';
            setTimeout(messageDelete, 3000);
        }
    };
    xhr.send(data);
}

function messageDelete() {
    var label = document.getElementById('answer');
    label.innerHTML = ' ';

}