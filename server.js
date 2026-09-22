const mysql = require('mysql');
const express = require('express');


const connection = mysql.createConnection({
    host : process.env.ipBDD,
    user : process.env.userBDD,
    password : process.env.passwordBDD,
    database : process.env.databaseBDD
})