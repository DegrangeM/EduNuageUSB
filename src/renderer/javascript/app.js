async function render() {    

    const account = await EduNuageUSB.getAccount()

    if(account) {
        document.getElementById('account-name').textContent = account.username;
        document.getElementById('account-name').addEventListener('click', EduNuageUSB.openNC);
        document.body.classList.remove('logged-out');
        document.getElementById('link-logout').addEventListener('click', EduNuageUSB.logout);
    } else {
        document.getElementById('link-login').addEventListener('click', EduNuageUSB.login);
    }
    
    const saveButton = document.getElementById('sauvegarder')
    const restaureButton = document.getElementById('restaurer')

    saveButton.addEventListener('click', EduNuageUSB.sauvegarder);

    restaureButton.addEventListener('click', EduNuageUSB.restaurer);


}

render()