const registerButton = document.getElementById('monBouton4');
const loginInput = document.getElementById('loginInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('login');
const decoBtn = document.getElementById('decoBtn');
const supprBtn = document.getElementById('supprBtn');
const id = localStorage.getItem("id");
const text = document.getElementById('text');

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

            //refresh de la page 
            window.location.reload();
        });
});

//enlever le formulaire de connexion et d'inscription si l'utilisateur est connecté
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        loginInput.style.display = 'none';
        passwordInput.style.display = 'none';
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        decoBtn.style.display = 'block';
        supprBtn.style.display = 'block';
        text.textContent = `Bienvenue ${user.login} !`;
    } else {
        loginInput.style.display = 'block';
        passwordInput.style.display = 'block';
        loginButton.style.display = 'block';
        registerButton.style.display = 'block';
        decoBtn.style.display = 'none';
        supprBtn.style.display = 'none';
        text.textContent = 'Bienvenue sur notre page d\'inscription';
    }
});

//afficher le bouton de suppression si l'utilisateur est connecté
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        supprBtn.style.display = 'block';
    } else {
        supprBtn.style.display = 'none';
    }
});

//fonction se déconnecter
decoBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        alert('Déconnexion réussie !');
        window.location.reload();
});

//fonction qui permet au user de supprimer son compte
supprBtn.addEventListener('click', () => {
        
        alert('Suppression réussie ! au revoir');
});

//fonction qui permet a l'admin de supprimer un user
function supprimerUser(req, res) {
    

}

//afficher le bouton de déconnexion si l'utilisateur est connecté
window.addEventListener('load', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        decoBtn.style.display = 'block';
    } else {
        decoBtn.style.display = 'none';
    }
});

