// const allQ = require("./questions");
// const inquirer = require("inquirer");

// function runSearch() {
//     inquirer.prompt(allQ.q1).then(function (answer) {
//       switch (answer.action) {
//         case "Add Department":
//           departmentAdd();
//           break;
  
//         case "Add Role":
//           roleAdd();
//           break;
  
//         case "Add Employee":
//           employeeAdd();
//           break;
  
//         case "View All Employees":
//           allEmployeesView();
//           break;
  
//         case "View All Employees By Department":
//           departmentView();
//           break;
  
//         // case "View All Employees By Manager":
//         //   managerView();
//         //   break;
  
//         case "Remove Employee":
//           emplyeeRemove();
//           break;
  
//         case "Update Employee Role":
//           employeeRole();
//           break;
  
//         case "Update Employee Manager":
//           emplyeeManager();
//           break;
//       }
//     });
//   }

//   module.exports = runSearch();