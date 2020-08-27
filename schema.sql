DROP DATABASE IF EXISTS team_db;
CREATE DATABASE team_db;
USE team_db;

create table department (    
	id INT (4) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR (40) NOT NULL,
	primary key (id)
);

create table roles (
	role_id INT (4) AUTO_INCREMENT NOT NULL,
	title VARCHAR (40) NOT NULL,
	salary DECIMAL (15,2) NOT NULL,
	department_id INT (30) NOT NULL
    primary key (role_id)   
);

create table employees (
	id INT (4) AUTO_INCREMENT NOT NULL,
	first_name VARCHAR (30) NOT NULL,
	last_name VARCHAR (30) NOT NULL,
    role_id INT (65) NOT NULL,
	manager_id VARCHAR (30), 
	primary key (id)
);

INSERT INTO employees (first_Name, last_name, role_id, manager_id)
VALUES
    ("john", "doe", 10, "ashley rodriguez"),
    ("mike", "chan", 11, "john doe"),
    ("ashley", "rodriguez", 20, null),
    ("kevin", "tupik", 21, "ashley rodriguez"),
    ("malia", "brown", 31, null),
    ("sarah", "lourd", 40, null),
    ("tom", "allen", 41, "sarah lourd"),
    ("christian", "eckenrode", 20, "mike chan");
    
 
    
INSERT INTO department (department_name)
VALUES
    ("sales"),
    ("engineering"),
    ("finance"),
    ("legal");
    
INSERT INTO roles (role_id, title, salary, department_id)
VALUES
    (10, "sales lead", 100000, 1),
    (11, "salesperson", 80000, 1),
    (20, "lead engineer", 150000, 2),
    (21, "software engineer", 120000, 2),
    (31, "accountant", 125000, 3),
    (40, "leagal team lead", 250000, 4),
    (41, "lawyer", 190000, 4);
    