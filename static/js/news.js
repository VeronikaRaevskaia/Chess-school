function newsEllipsisAdd() {
    var text = document.querySelectorAll('#news .text p');
    for(var i=0; i<text.length; i++){
        if(text[i].offsetHeight > 224){
            text[i].parentElement.classList.add('more');
        }
    }
    newsModalWindowFill();
}
window.addEventListener("load", newsEllipsisAdd);


function newsModalWindowFill() {
    var text_blocks = document.querySelectorAll('#news .text-block');
    for(var i=0; i<text_blocks.length; i++){
        if(text_blocks[i].querySelector('.more')){
            text_blocks[i].onclick = function () {
                var new_window = document.querySelector('div.bg-modal.new');
                new_window.classList.toggle('show');
                var new_window_p = new_window.querySelector('p');
                new_window_p.innerHTML = '<button class="close">&times;</button>' + (this.querySelector('p').innerHTML);

                document.querySelector('.new button.close').onclick = function () {
                    new_window.classList.toggle('show');
                }
            }
        }
    }
}


var active_slide_number = [];
var sliders = document.querySelectorAll('#news slider');
var slides = [[]];
var dots = [[]];


function slidersContentArrayFill() {
    for(var i=0; i<sliders.length; i++){
        slides.push([]);
        dots.push([]);
        active_slide_number.push(0);
        var slides_each_slider = sliders[i].getElementsByTagName('slide');
        var dots_each_slider = sliders[i].parentElement.getElementsByTagName('li');
        for(var j=0; j<slides_each_slider.length; j++){
         slides[i].push(slides_each_slider[j]);
         dots[i].push(dots_each_slider[j]);
        }
    }
}

window.addEventListener("load", slidersContentArrayFill);



function dotClick() {
    var clicked_slider = this.parentElement.parentElement.parentElement.querySelector('slider');
    var clicked_slider_number;
    for(var i=0; i<sliders.length; i++){
        if(sliders[i] === clicked_slider){
            clicked_slider_number = i;
        }
    }
    for(var j=0; j<dots[clicked_slider_number].length; j++){
        if(this === dots[clicked_slider_number][j]){
            plusSlide(j, clicked_slider_number);
        }
    }
}

function initSlideGallery() {  //инициализируем слайдер
    slide_index = 0;
   for(var i=0; i<sliders.length; i++){
       for(var j=0; j<dots[i].length; j++) {
           slides[i][slide_index].style.display = 'flex';
           slides[i][slide_index].style.opacity = 1;
           dots[i][j].addEventListener("click", dotClick);
       }
    }
   // setInterval(function () {
   //     plusSlide(1);
   // }, during);
}

window.addEventListener("load", initSlideGallery);

function moveSlide(n, clicked_slider_number) {
    var next_slide, current_slide;
    var moveSlideAnimClass={  //объект для класса в зависимости от того, в какую сторону крутить слайдер
        forCurrent: "",
        forNext: ""
    };
    if(n>active_slide_number[clicked_slider_number]){
        if(n>=slides[clicked_slider_number].length){n=0}
        moveSlideAnimClass.forCurrent = "moveLeftCurrentSlide";
        moveSlideAnimClass.forNext = "moveLeftNextSlide";
    }
    else if(n<active_slide_number[clicked_slider_number]){
        if(n<0){n=slides[clicked_slider_number].length-1}
            moveSlideAnimClass.forCurrent = "moveRightCurrentSlide";
            moveSlideAnimClass.forNext = "moveRightNextSlide";
        }
        if(n!==active_slide_number[clicked_slider_number]){
            next_slide = slides[clicked_slider_number][n];
            current_slide = slides[clicked_slider_number][active_slide_number[clicked_slider_number]];
            for(var i=0; i<slides[clicked_slider_number][i]; i++){
                slides[clicked_slider_number][i].style.opacity = 0;
                dots[clicked_slider_number][i].classList.remove("active");
            }
            dotsClearing(clicked_slider_number);

            current_slide.classList.remove('moveLeftNextSlide');
            current_slide.classList.remove('moveRightNextSlide');
            current_slide.classList.add(moveSlideAnimClass.forCurrent);
            next_slide.classList.remove('moveLeftCurrentSlide');
            next_slide.classList.remove('moveRightCurrentSlide');
            next_slide.classList.add(moveSlideAnimClass.forNext);
            dots[clicked_slider_number][n].classList.add("active");
            active_slide_number[clicked_slider_number] = n;
        }

}

function dotsClearing(clicked_slider_number) {
    for(var i=0; i<dots[clicked_slider_number].length; i++){
        dots[clicked_slider_number][i].classList.remove('active');
    }
}


function plusSlide(n, clicked_slider_number) {
        moveSlide(slide_index +n, clicked_slider_number);
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


var slide_images = document.querySelectorAll('slide img');
for(var i=0; i<slide_images.length; i++){
    slide_images[i].onclick = function () {
        var attribute = this.getAttribute('src');
        document.querySelector('div.bg-modal.new-img').classList.toggle('show');
        document.querySelector('div.bg-modal.new-img img').setAttribute('src', attribute);
        document.querySelector('.new-img button.close').onclick = function () {
            document.querySelector('div.bg-modal.new-img').classList.toggle('show');
        }
    }
}

