const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const console_table = require('console.table');
const fs = require('fs');


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

const addRole = () => {
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
            switch(answer){
                case 'allDepartments': 
                    if(answer.task === 'View all departments')
                    console.log('View all departments');
                    break;
                case 'View all roles':
                    if(answer.task === 'View all roles')
                    console.log('View all roles');
        
                    break;
                case 'View all employees': 
                    if(answer.task === 'View all employees')
                    console.log('View all employees');
        
                    break;
            }
        })
}



module.exports = askQuestion;