INSERT INTO departments (department_id, department_name)
VALUES
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal'),
    (5, 'Marketing');

INSERT INTO roles (role_id, job_title, salary, department_id)
VALUES
    (1, 'Account Executive', 150000, 1),
    (2, 'Accountant', 120000, 3),
    (3, 'Software Engineer', 155000, 2),
    (4, 'Regional Sales Manager', 170000, 1),
    (5, 'Lawyer', 225000, 4),
    (6, 'Paralegal', 75000, 4),
    (7, 'Lead Engineer', 200000, 2);
    

INSERT INTO employees (employee_id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Josh', 'Gubenheimer', 7, NULL),
    (2, 'Abraham', 'Lincoln', 2, NULL),
    (3, 'Brooklyn', 'Sanders', 5, NULL),
    (4, 'Angela', 'Bennet', 4, 3),
    (5, 'Sara', 'Parker', 5, 2),
    (6, 'Sara', 'Michaels', 3, 1),
    (7, 'Malik', 'Yoba', 1, 2),
    (8, 'Angel', 'Rodriguez', 6, 1),
    (9, 'Melissa', 'Eldridge', 2, 3),
    (10, 'Maurice', 'Price', 4, 3),
    (11, 'Teresa', 'Henderson', 5, 2);