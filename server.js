const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const console_table = require('console.table');
// const askQuestion = require('./utils/index');

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
    console.log("Connected to the org_chart database.")
)



const viewDepartments = () => {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err,res) => {
        if(err){
            throw err;
        }
        console.log('\n');
        console.log('COMPANY DEPARTMENTS');
        console.table(res);
        askQuestion();
    })
}

const viewRoles = () => {
    const sql = `SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id`;
    db.query(sql, (err,res) => {
        if(err){
            throw err;
        }
        console.log('\n');
        console.log('COMPANY ROLES');
        console.table(res);
        askQuestion();
    })
}
 const viewEmployees = () => {
     const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id JOIN departments ON roles.department_id = departments.department_id`;
     db.query(sql, (err,res) => {
        if(err){
            throw err;
        }
        console.log('\n');
        console.log('COMPANY EMPLOYEES');
        console.table(res);
        askQuestion();
    })
 }
const addDepartment = () => {
    return inquirer
    .prompt ([
        {
                type:'input',
                name:'addDepartment',
                message: 'What is the name of the department?',
        },
    ]).then()
}

const addRoles = () => {
    return inquirer
    .prompt ([
        {
            type:'input',
            name:'addRole',
            message: 'What is the name of the role?',
            when:(answers) => {
                return answers.task === 'Add a role'
            } 
        },
        {
            type:'input',
            name:'addRoleSalary',
            message: 'What is the salary of the role?',
            when:(answers) => {
                return answers.task === 'Add a role'
            } 
        },
        {
            type:'input',
            name:'addRoleDepartment',
            message: 'Which department does the role belong to?',
            when:(answers) => {
                return answers.task === 'Add a role'
            } 
        },
    ])
}
//create options through inquirer for users to navigate the org_chart
// let answerChoice = '';

const askQuestion = () => {

    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'task',
                message: 'What would you like to do?',
                choices: [
                    'View all departments', 
                    'View all roles', 
                    'View all employees', 
                    'Add a department', 
                    'Add a role', 
                    'Add an employee', 
                    'Update an employee role']
                }    
        ]).then((answer) => {
            console.log(answer);
            
            if(answer.task == 'View all departments'){
                    viewDepartments();
            }
            else if(answer.task == 'View all roles')
                    viewRoles();
                   
            })
        };




askQuestion();


























//listen for the server
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
})