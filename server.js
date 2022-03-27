const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const console_table = require('console.table');
const { process_params } = require('express/lib/router');
const askQuestion = require('./utils/index');

const PORT = process.env.PORT || 3001;
const app = express();

//Express middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());



//listen for the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})
