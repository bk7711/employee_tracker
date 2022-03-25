const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const console_table = require('console.table');
const askQuestion = require('./utils/index');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'org_chart'
    },
)

askQuestion();

//listen for the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})