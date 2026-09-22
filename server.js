const mysql = require('mysql');
const express = require('express');


const connection = mysql.createConnection({
    host : process.env.ipBDD,
    user : process.env.userBDD,
    password : process.env.passwordBDD,
    database : process.env.databaseBDD
})


// fonction s'incrire 
function sinscrire(req, res) {



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

