require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306)
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL.');
});

app.use(express.static('public'));
app.use(express.json());

////////////////////////////////////////////////////////////// ROUTES ////////////////////////////////////////////////////////////////

// route inscription 
app.post('/register', (req, res) => {

  connection.query(
    'INSERT INTO user (login, password) VALUES (?, ?)',
    [req.body.inputValue, req.body.password],
    (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la base de données :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }
      console.log('Insertion réussie, ID utilisateur :', results.insertId);
      res.json({ message: 'Inscription réussie !', userId: results.insertId });
    }
  );
});

//route se connecter 
app.post('/connexion', (req, res) => {  
  console.log(req.body);
  //on récupère le login et le password
  const { login, password } = req.body;
  connection.query('SELECT * FROM user WHERE login = ? AND password = ?', [login, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification des identifiants :', err);
      res.status(500).json({ message: 'Erreur serveur' });
      return;
    }
    if (results.length === 0) {
      res.status(401).json({ message: 'Identifiants invalides' });
      return;
    }
    // Identifiants valides 
    //renvoi les information du user
    res.json({ message: 'Connexion réussie !', user: results[0] });
  });
});

//route se déconnecter 
app.post('/deconnexion', (req, res) => {

});

//route qui permet au user de supprimer son compte 
app.post('/supprimerCompte', (req, res) => {


});






//route qui permet a l'admin de supprimer un user 
app.post('/supprimerUser', (req, res) => {


});





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});