document.querySelector('img.sber').onclick = function () {
    document.querySelector('div.bg-modal.pay').classList.toggle('show');
    document.querySelector('.pay button.close').onclick = function () {
        document.querySelector('div.bg-modal.pay').classList.toggle('show');
    }
};

window.onkeyup =  function(event) {
    var showing_modal = document.querySelector('div.bg-modal.show');
    if (event.keyCode == 27) {  
        if(showing_modal)
            showing_modal.classList.remove('show');
    }
};