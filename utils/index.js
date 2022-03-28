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
                //run functions based on org_chart question and choice
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
            else if(answer.task == 'Add a role'){
                addRoles();
            }
            else if(answer.task == 'Add an employee'){
                addEmployee();
            }
            else if(answer.task == 'Update an employee role'){
                updateEmployee();
            }     
            })      
        };

askQuestion();

//function for displaying departments if the user chooses this option
const viewDepartments = () => {
    //call to the database console.table the results
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
};

//function for displaying roles if the user chooses this option
const viewRoles = () => {
    //call to the database console.table the results
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
};

//function for displaying all employees if the user chooses this option
 const viewEmployees = () => {
     //call to the database console.table the results
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
 };

 //function for adding departments if the user chooses this option
const addDepartment = () => {
    //if option is chosen, ask follow up question
    return inquirer
    .prompt ([
        {
                type:'input',
                name:'department_name',
                message: 'What is the name of the department?',
        },
    ]).then((answer) => {
        //call to the database console.table the results
        let sql = `INSERT INTO departments (department_name)
        VALUES(?)`;
        //pull the answer to the inquirer question from user and insert into database request
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
                    //print the new table
                    console.log('\n');
                    console.log('COMPANY DEPARTMENTS');
                    console.table(res);
                    askQuestion();
                })
            }
        })  
    })
};

//function for adding roles if the user chooses this option
const addRoles = () => {
    //follow up questions once this option is chosen
    return inquirer
    .prompt ([
        {
            type:'input',
            name:'job_title',
            message: 'What is the name of the role?',
        },
        {
            type:'input',
            name:'salary',
            message: 'What is the salary of the role?',
        },
        {
            type:'input',
            name:'department_name',
            message: 'Which department does the role belong to?',
        }

    ]).then((answer) => {
        
        let sql =  `SELECT * FROM departments WHERE department_name = ?`
        //pull department row from the user answers
        let params = answer.department_name
        db.query(sql, params, (err,res) => {
            if(err){
                throw err;
            }
            else {
                //get the department id from the row chosen in departments
                let department = res[0].department_id;
                
                let sql = `INSERT INTO roles (job_title, salary, department_id)
                VALUES(?,?,?)`;
                //pull from the inquirer answers to set parameters
                let params = [answer.job_title, answer.salary, department];
                //call to the database console.table the results
                db.query(sql, params, (err, res) => {
                    if(err){
                        throw err;
                    }else{
                        console.log("----------------------------\n")
                        console.log("Role added");
                        console.log("----------------------------\n")
                        //print new table with added role
                        sql = `SELECT * FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id`;
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
                })  
            }
        })
    })
};

//function for adding employees if the user chooses this option
const addEmployee = () => {
    return inquirer
    .prompt ([
        {
            type:'input',
            name:'first_name',
            message: 'What is the employee first name?',
        },
        {
            type:'input',
            name:'last_name',
            message: 'What is the employee last name?',
        },
        {
            type:'input',
            name:'job_title',
            message: 'What is the employee role?',
        },
        {
            type:'list',
            name:'manager',
            message: 'Who is the employee manager',
            choices:['Josh Gubenheimer', 
                    'Abraham Lincoln', 
                    'Brooklyn Sanders'], 
        }

    ]).then((answer) => {
        //set manager_id options to add to new employee row
        let manager = 0;
        if(answer.manager === 'Josh Gubenheimer'){
            manager = 1;
        }else if(answer.manager === 'Abraham Lincoln'){
            manager = 2;
        }else{
            manager = 3;
        }
        //pull the corresponding job_title from the roles table to gather role_id and department_id
        let sql =  `SELECT * FROM roles WHERE job_title = ?`
        let params = answer.job_title
        db.query(sql, params, (err,res) => {
            if(err){
                console.log("Role does not exist. Please add a role first")
                askQuestion();
                throw err;
            }
            else {
                // let department = res[0].department_id;
                // let salary = res[0].salary;
                let role = res[0].role_id;
                let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                VALUES(?,?,?,?)`;
                let params = [answer.first_name, answer.last_name, role, manager];
                //call to the database console.table the results
                db.query(sql, params, (err, res) => {
                    if(err){
                        throw err;
                    }else{
                        console.log("----------------------------\n")
                        console.log("Employee added");
                        console.log("----------------------------\n")
                        //pull and print updated table with new employee
                        sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id JOIN departments ON roles.department_id = departments.department_id`;
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
                })  
            }
        })
    })
}

//function for updating employees if the user chooses this option
const updateEmployee = () => {
    const sql = `SELECT * FROM employees`;
    db.query(sql, (err,res) => {
        if(err){
            throw err;
        }
        console.table(res);
    })

    return inquirer
    .prompt ([
        {
            type:'input',
            name:'last_name',
            message: 'What is the last name of the employee you would like to update?',
        },
        {
            type:'input',
            name:'role',
            message: 'What is the employee new role?',
        },
        
    ]).then((answer) => {
        let role = answer.role;
        
        let id = 0;
        let sql =  `SELECT * FROM employees WHERE employees.last_name = ?`;
        let params = answer.last_name
        //find employee by last name to update
        db.query(sql, params, (err,res) => {
            if(err){
                console.log("Employee does not exist. Please choose a different employee")
                
                throw err;
            }
            else {
               id = res[0].employee_id;
            }
            //pull additional job data from the roles table
        let sql = `SELECT * FROM roles WHERE roles.job_title = ?`;
        let params = role;
        db.query(sql, params, (err,res) => {
            if(err){
                console.log("Job does not exist. Please add the job")
                throw err;
            }
                let roleId = res[0].role_id;
                let sql = `UPDATE employees SET role_id = ? WHERE employees.employee_id = ?`;
                let params = [roleId, id]
            //update employee row with the above parameters
                db.query(sql, params, (err, res) => {
                    if(err){
                        throw err;
                    }else{
                        console.log("----------------------------\n")
                        console.log("Employee updated");
                        console.log("----------------------------\n")
                        //print new and updated table
                        sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id JOIN departments ON roles.department_id = departments.department_id`;
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
                })  
            })
        })
    })

}

module.exports = askQuestion;