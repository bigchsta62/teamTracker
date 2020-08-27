const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const chalk = require("chalk");
const choices = [];

//Figlet to make team tracker banner
var figlet = require("figlet");
console.log(
  chalk.yellow.bgBlueBright.bold(
    figlet.textSync("Team Tracker", {
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  )
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

const Q1 = [
  {
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "Add Department",
      "Add Role",
      "Add Employee",
      "View All Employees",
      "View All Employees by Department",
      "View All Roles",
      // "View All Employees By Manager",
      // "Remove Employee",
      "Update Employee Role",
      // "Update Employee Manager",
    ],
  },
];

function runSearch() {
  inquirer.prompt(Q1).then(function (answer) {
    switch (answer.action) {
      case "Add Department":
        departmentAdd();
        break;
      case "Add Role":
        roleAdd();
        break;
      case "Add Employee":
        employeeAdd();
        break;
      case "View All Employees":
        allEmployeesView();
        break;
      case "View All Employees by Department":
        departmentView();
        break;
      case "View All Roles":
        roleView();
        break;
      // case "View All Employees By Manager":
      //   managerView();
      //   break;
      // case "Remove Employee":
      //   emplyeeRemove();
      //   break;
      case "Update Employee Role":
        employeeRole();
        break;
      // case "Update Employee Manager":
      //   emplyeeManager();
      //   break;
    }
  });
}

function departmentAdd() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Please enter department name",
    })
    .then(function (answer) {
      const query = "INSERT INTO department (department_name) VALUES (?)";
      connection.query(query, [answer.department], function (err, res) {
        console.log(answer.department);
        console.table(res);
        runSearch();
      });
    });
}
function roleAdd() {
  inquirer
    .prompt([
      {
        name: "role_id",
        type: "input",
        message: "Please enter Role id",
      },
      {
        name: "title",
        type: "input",
        message: "Please enter Role name",
      },
      {
        name: "salary",
        type: "input",
        message: "Please enter Salary",
      },
      {
        name: "id",
        type: "input",
        message: "Please enter Role ID number",
      },
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO roles (role_id, title, salary, department_id) VALUES (?, ?, ?, ?)",
        [answer.role_id, answer.title, answer.salary, answer.id],
        function (err, data) {
          if (err) throw err;
          console.log("New role added.");
          console.log(answer.title, answer.salary, answer.id);
          runSearch();
        }
      );
    });
}
function employeeAdd() {
  const departments = [];
  const ans = [];
  connection.query("SELECT * FROM roles;", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      departments.push(res[i].title);
    }
    inquirer
      .prompt([
        {
          name: "fName",
          type: "input",
          message: "What is the employees first name?",
        },
        {
          name: "lName",
          type: "input",
          message: "What is the employees last name?",
        },
        {
          name: "manager",
          type: "input",
          message: "Who is the employees Manager?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the employees role",
          choices: departments,
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT role_id FROM roles where title = ?",
          [answer.role],
          function (err, res) {
            if (err) throw err;
            departments.length = 0;
            ans.push(res[0].role_id);
            connection.query(
              "INSERT INTO employees (first_Name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?)",
              [answer.fName, answer.lName, answer.manager, ans],
              function (err, data) {
                if (err) throw err;
                console.log("\n" + "   New role added." + "\n");
                runSearch();
              }
            );
            //Empties array to prevent continuously adding the same information
            departments.length = 0;
          }
        );
      });
  });
}

// This will display the entire team_db in a easy to read format
function allEmployeesView() {
  connection.query(
    "SELECT first_Name, last_name, title, salary, manager_id, department_name FROM roles right JOIN employees using (role_id) left join department using (department_id);",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      runSearch();
    }
  );
}
//This displays each team based on department selected
function departmentView() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].department_name);
    }
    dpInquire();
  });
}
function roleView() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      choices.push(res[i].title);
    }

    connection.query("SELECT * FROM roles", function (err, res) {
      console.table(res);
      runSearch();
    });
  });
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

function employeeRole() {
  const titles = [];
  const t = [];
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      titles.push(res[i].title);
      // console.log(titles)
    }
    inquirer
      .prompt([
        {
          name: "role",
          type: "list",
          message: "What Role would you like to update?",
          choices: titles,
        },
        {
          name: "new",
          type: "input",
          message: "Enter New Role Name",
        },
      ])
      .then(function (answer) {
        connection.query(
          "SELECT role_id FROM roles where title = ?",
          [answer.role],
          function (err, res) {
            if (err) throw err;
            titles.length = 0;
            t.push(res[0].role_id);
            connection.query(
              "UPDATE roles SET title = ? WHERE role_id = ?",
              [answer.new, t],
              function (err, data) {
                if (err) throw err;
                console.log("\n" + "   New role updated." + "\n");
                runSearch();
              }
              
            );
            titles.length = 0;
          }
        );
      });
  });
}

// function allEmployeesView() {
//   inquirer
//     .prompt(
//       {
//         name: "fName",
//         type: "input",
//         message: "What is the employees first name?",
//       },
//       {
//         name: "lName",
//         type: "input",
//         message: "What is the employees last name?",
//       },
//       {
//         name: "fName",
//         type: "list",
//         message: "What is the employees first name?",
//         choices: departments,
//       }
//     )
//     .then(function (answer) {
//       console.log(
//         figlet.textSync(
//           `${answer.department} department
//           `,
//           {
//             horizontalLayout: "default",
//             verticalLayout: "default",
//             width: 80,
//             whitespaceBreak: true,
//           }
//         )
//       );
//       //Empties choices array to prevent continuous ly adding the same information
//       choices.length = 0;
//       //Query to grab and display information
//       const query =
//         "SELECT first_Name, last_name, title, salary, manager_id FROM roles right JOIN employees using (role_id) left join department using (department_id) WHERE department_name = ?";
//       connection.query(query, [answer.department], function (err, res) {
//         console.table(res);
//         runSearch();
//       });
//     });
// }
// function managerView() {
//   const query =
//     "SELECT first_Name, last_name, title, salary, department _id FROM roles right JOIN employees using (role_id) left join department using (manager_id) WHERE department_name = ?";
//     connection.query(query, [answer.manager_id], function (err, res) {
//       console.table(res);
//       runSearch();
//     }
//   );

//   //****** The first thing to do is find out what department the EU wants to view ******

//   inquirer
//     .prompt({
//       name: "department",
//       type: "list",
//       message: "What department would you like to view?",
//       choices: dpArray,
//     })
//     .then(function (answer) {
//       const query = "SELECT department_name FROM department";
//       // connection.query(query, { artist: answer.artist }, function (err, res) {
//       //          }
//       //   runSearch();
//       // });
//     });
// }
