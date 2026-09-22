require('dotenv').config();
const express = require('express');
const app = express();
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host : process.env.ipBDD,
    user : process.env.userBDD,
    password : process.env.passwordBDD,
    database : process.env.databaseBDD
})

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
app.post('/inscription', (req, res) => {
  connection.query(
  'INSERT INTO user (login, password) VALUES (?, ?)',
  [req.body.login, req.body.password],
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

}





//route se connecter 
app.post('/connexion', (req, res) => {

}


//route se déconnecter 
app.post('/deconnexion', (req, res) => {


}

//route qui permet au user de supprimer son compte 
app.post('/supprimerCompte', (req, res) => {



}






//route qui permet a l'admin de supprimer un user 
app.post('/supprimerUser', (req, res) => {


}





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});