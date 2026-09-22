const mysql = require('mysql');
const express = require('express');


const connection = mysql.createConnection({
    host : process.env.ipBDD,
    user : process.env.userBDD,
    password : process.env.passwordBDD,
    database : process.env.databaseBDD
})


// fonction s'incrire 
function s'inscrire(req, res) {
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


//fonction se connecter 
function connexion(req, res) {


    
}


//fonction se déconnecter 
function déconnexion {



}

//fonction qui permet au user de supprimer son compte 
function supprimerCompte(req, res) {



}


//fonction qui permet a l'admin de supprimer un user 
function supprimerUser(req, res) {


}

