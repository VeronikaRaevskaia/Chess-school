var slide_index = 0;
var slides = document.querySelectorAll('.slides-container slide');
var dots = document.querySelectorAll('.dots-container li');

function previousText() {
    var previous_text = this.querySelector('p');
    previous_text.classList.remove('enter-active');

}

function addTextAnimation() {
    this.removeEventListener("animationend", addTextAnimation);
    var text = this.querySelector('p');
    text.classList.add('enter-settings');
    text.addEventListener("transitionend", textAnimation);
}

function textAnimation() {
    this.classList.remove('enter-settings');
    this.classList.add('enter-active');
    this.removeEventListener("transitionend", textAnimation);
}

function dotClick() {
    var number;
    for(var j=0; j<dots.length; j++){
        if(this == dots[j]){
            number = j;
            plusSlide(number-slide_index);
        }
    }

}

var during = 5000;
function initSlideGallery() {
    slide_index = 0;
    slides[slide_index].style.opacity = 1;
    document.querySelector('slide p').classList.add('enter-active');
   for(var i=0; i<dots.length; i++){
        dots[i].addEventListener("click", dotClick);
    }
    setInterval(function () {
        plusSlide(1);
    }, during);
}

window.addEventListener("load", initSlideGallery);

function moveSlide(n) {
    var next, current;
    var moveSlideAnimClass={
        forCurrent: "",
        forNext: ""
    }
    if(n>slide_index){
        if(n>=slides.length){n=0}
        moveSlideAnimClass.forCurrent = "moveLeftCurrentSlide";
        moveSlideAnimClass.forNext = "moveLeftNextSlide";
    }
    else if(n<slide_index){
        if(n<0){n=slides.length-1}
            moveSlideAnimClass.forCurrent = "moveRightCurrentSlide";
            moveSlideAnimClass.forNext = "moveRightNextSlide";
        }
        if(n!=slide_index){
            next = slides[n];
            current = slides[slide_index];
            for(var i=0; i<slides[i]; i++){
                slides[i].style.opacity = 0;
                dots[i].classList.remove("active");
            }
            var next_p = next.querySelector('p');
            var current_p = current.querySelector('p');
            if(next_p.classList.contains('enter-settings'))
                next_p.classList.remove('enter-settings');
            if(current_p.classList.contains('enter-settings'))
                current_p.classList.remove('enter-settings');

            dotsClearing();
            current.addEventListener("animationend", previousText);
            next.addEventListener("animationend", addTextAnimation);

            current.classList.remove('moveLeftNextSlide');
            current.classList.remove('moveRightNextSlide');
            current.classList.add(moveSlideAnimClass.forCurrent);
            next.classList.remove('moveLeftCurrentSlide');
            next.classList.remove('moveRightCurrentSlide');
            next.classList.add(moveSlideAnimClass.forNext);
            dots[n].classList.add("active");
            slide_index = n;
        }
}

function dotsClearing() {
    for(var i=0; i<dots.length; i++){
        dots[i].classList.remove('active');
    }
}


function plusSlide(n) {
        moveSlide(slide_index +n);
}


if(document.querySelector("slider .arrow-right")) {
    document.querySelector("slider .arrow-right").onclick = function () {
        plusSlide(1);
    }
}

if(document.querySelector("slider .arrow-left")){
    document.querySelector("slider .arrow-left").onclick = function () {
        plusSlide(-1);
    }
}