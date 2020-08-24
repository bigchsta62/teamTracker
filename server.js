const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//Figlet to make team tracker banner
var figlet = require("figlet");

console.log(
  figlet.textSync("Team Tracker", {
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  })
);

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "team_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employees By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View All Employees":
          allEmployeesView();
          break;

        case "View All Employees By Department":
          departmentView();
          break;

        case "View All Employees By Manager":
          managerView();
          break;

        case "Add Employee":
          employeeAdd();
          break;

        case "Remove Employee":
          emplyeeRemove();
          break;

        case "Update Employee Role":
          employeeRole();
          break;

        case "Update Employee Manager":
          emplyeeManager();
          break;
      }
    });
}

// This will display the entire team_db in a easy to read format

function allEmployeesView() {
  connection.query(
    "SELECT first_Name, last_name, title, salary, manager_id, department_name FROM roles right JOIN employees using (role_id) left join department using (department_id);",
    function (err, res) {
      // ******  Use console table here to make nice format  ******

      if (err) throw err;
      console.table(res);
      runSearch();
    }
  );
}

//This displays each team based on department selected

const choices = [];
function departmentView() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].department_name);
    }
    dpInquire();
  });
  //****** The first thing to do is find out what department the EU wants to view ******
}

//This runs when User selects view by dept
function dpInquire() {
  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "What department would you like to view?",
      choices: choices,
    })
    .then(function (answer) {
      console.log(
        figlet.textSync(
          `${answer.department} department
        `,
          {
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 80,
            whitespaceBreak: true,
          }
        )
      );
      //Empties choices array to prevent continuous ly adding the same information
      choices.length = 0;
      //Query to grab and display information
      const query =
        "SELECT first_Name, last_name, title, salary, manager_id FROM roles right JOIN employees using (role_id) left join department using (department_id) WHERE department_name = ?";
      connection.query(query, [answer.department], function (err, res) {
        console.table(res);
        runSearch();
      });
    });
}

function managerView() {
  const mgrArray = [];
  connection.query("SELECT department_id FROM `role`", function (err, res) {
    if (err) throw err;
    console.log(res);
    mgrArray.push(res);
    console.log(mgrArray);
    runSearch();
  });

  //****** The first thing to do is find out what department the EU wants to view ******

  inquirer
    .prompt({
      name: "department",
      type: "list",
      message: "What department would you like to view?",
      choices: dpArray,
    })
    .then(function (answer) {
      const query = "SELECT department_name FROM department";
      // connection.query(query, { artist: answer.artist }, function (err, res) {
      //          }
      //   runSearch();
      // });
    });
}
