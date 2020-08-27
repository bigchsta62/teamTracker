const allQ = { q1: [
    {
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add Role",
        "Add Employee",
        "View All Employees",
        "View All Employees By Department",
        // "View All Employees By Manager",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
      ],
    },
  ]}
 
  module.exports = allQ;