const registerButton = document.getElementById('monBouton4');
const loginInput = document.getElementById('loginInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('login');

//fonction inscription 
monBouton4.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputValue: loginInput.value, password: passwordInput.value })
    }).then(response => response.text())
        .then(data => {
            alert(data);
        });
});


//fonction se connecter
loginButton.addEventListener('click', () => {
    fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: loginInput.value, password: passwordInput.value })
    }).then(response => response.json())
        .then(data => {
            if (data.message === 'Connexion réussie !') {
                alert(data.message);
                //ajout dans le local storage les information du user
                localStorage.setItem('user', JSON.stringify(data.user));
            } else {
                alert(data.message);
            }
        });
});

//fonction se déconnecter
function deconnexion(req, res) {


}

//fonction qui permet au user de supprimer son compte
function supprimerCompte(req, res) {
    

}

//fonction qui permet a l'admin de supprimer un user
function supprimerUser(req, res) {
    

}