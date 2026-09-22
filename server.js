const mysql = require('mysql');
cont express = require('express')


const connection = mysql.createConnection({
    host : process.env.ipBDD,
    user : process.env.userBDD,
    password : process.env.passwordBDD,
    database : process.env.databaseBDD
})