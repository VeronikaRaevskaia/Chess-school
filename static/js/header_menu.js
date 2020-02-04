function menuAnimation(){
    var items = document.querySelector('ul.items');
    if(items.style.display =='block')
        fadeOut(items, 754);
    else
        fadeIn(items, 754);
}

var menu = document.querySelector('nav#menu');
var items = document.querySelectorAll('li.item');
window.addEventListener("resize", menuClickFunction);

function itemClickedFunction() {
    menu.classList.toggle('open');
}

function menuClickFunction() {
    if (window.innerWidth >= 1000) {
        menu.classList.remove('open');
        for (var i = 0; i < items.length; i++) {
            items[i].removeEventListener("click", itemClickedFunction);
        }
    }
    else {
        for (var i = 0; i < items.length; i++) {
            items[i].addEventListener("click", itemClickedFunction);
        }
    }
}

window.addEventListener("load", menuClickFunction);


