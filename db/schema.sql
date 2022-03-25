DROP DATABASE IF EXISTS org_chart;
CREATE DATABASE org_chart;
USE org_chart;

CREATE TABLE departments(
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(30),
    PRIMARY KEY(department_id)
);

CREATE TABLE roles(
    role_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    job_title VARCHAR(40),
    salary INTEGER,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE employees(
    employee_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER, 
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);