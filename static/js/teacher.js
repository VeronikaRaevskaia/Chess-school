var mobile_width = 1050;

function clearClasses() {
    for(var i=0; i<classes.length; i++) {
        if (classes[i].classList.contains('underline'))
            classes[i].classList.remove('underline');
    }
}
