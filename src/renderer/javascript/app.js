async function render() {    

    const account = await EduNuageUSB.getAccount()
    const folder = await EduNuageUSB.getFolder()


    if(account) {
        document.getElementById('account-name').textContent = account.username;
        document.getElementById('account-name').addEventListener('click', EduNuageUSB.openNC);
        document.body.classList.remove('logged-out');
        document.getElementById('link-logout').addEventListener('click', EduNuageUSB.logout);
    } else {
        document.getElementById('link-login').addEventListener('click', EduNuageUSB.login);
    }
    
    document.getElementById('folder').textContent = folder.replaceAll('\\', '/');

    const saveButton = document.getElementById('sauvegarder')
    const restaureButton = document.getElementById('restaurer')

    saveButton.addEventListener('click', EduNuageUSB.sauvegarder);

    restaureButton.addEventListener('click', EduNuageUSB.restaurer);

    document.getElementById('link-help').addEventListener('click', EduNuageUSB.openHelp);

}

render()