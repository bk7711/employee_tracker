const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const console_table = require('console.table');
const fs = require('fs');

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'org_chart'
    },
    console.log("Connected to the org_chart database.")
)

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
            else if(answer.task == 'View all roles'){
                viewRoles();
            }
            else if(answer.task == 'View all employees'){
                viewEmployees();
            }
            else if(answer.task == 'Add a department'){
                addDepartment();
            }
                    
            })
            
                    
        };

askQuestion();

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
                name:'department_name',
                message: 'What is the name of the department?',
        },
    ]).then((answer) => {
        let sql = `INSERT INTO departments (department_name)
        VALUES(?)`;
        const params = answer.department_name;

        db.query(sql, params, (err, res) => {
            if(err){
                throw err;
            }else{
                console.log("Department added");
                sql = `SELECT * FROM departments`;
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
        })  
    })

}
// const addRoles = () => {
//     return inquirer
//     .prompt ([
//         {
//             type:'input',
//             name:'addRole',
//             message: 'What is the name of the role?',
//             when:(answers) => {
//                 return answers.task === 'Add a role'
//             } 
//         },
//         {
//             type:'input',
//             name:'addRoleSalary',
//             message: 'What is the salary of the role?',
//             when:(answers) => {
//                 return answers.task === 'Add a role'
//             } 
//         },
//         {
//             type:'input',
//             name:'addRoleDepartment',
//             message: 'Which department does the role belong to?',
//             when:(answers) => {
//                 return answers.task === 'Add a role'
//             } 
//         }




module.exports = askQuestion;