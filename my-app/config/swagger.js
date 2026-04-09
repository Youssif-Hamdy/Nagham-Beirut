const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Nagham Menu API",
    description: "API documentation for Menu & Employee management",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
  tags: [
    { name: "Menu",        description: "Menu endpoints" },
    { name: "Employees",   description: "Employee endpoints" },
    { name: "Roles",       description: "Role endpoints" },
    { name: "Departments", description: "Department endpoints" },
  ],
};

const outputFile = "./config/swagger-output.json";

const routes = [
  "./routes/menuRoutes.js",
  "./routes/employeeRoutes.js",
  "./routes/roleRoutes.js",
  "./routes/departmentRoutes.js",
];

swaggerAutogen(outputFile, routes, doc);