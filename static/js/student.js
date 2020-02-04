function balanceOutput() {
    var balance = document.querySelector('li.balance');
    if(balance.innerHTML == 'баланс: р')
        balance.classList.remove('show');
    else
        balance.classList.add('show');
}
window.addEventListener("load", balanceOutput);