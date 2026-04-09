const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Nagham Menu API",
    version: "1.0.0",
  },
  host: "nagham-beirut.vercel.app",
  schemes: ["https"],
  tags: [
    { name: "Menu",        description: "Menu endpoints" },
    { name: "Employees",   description: "Employee endpoints" },
    { name: "Roles",       description: "Role endpoints" },
    { name: "Departments", description: "Department endpoints" },
  ],
  paths: {
    "/api/employees": {
      get:  { tags: ["Employees"], summary: "Get all employees",  responses: { 200: { description: "OK" } } },
      post: { tags: ["Employees"], summary: "Create employee",
        parameters: [{ in: "body", name: "body", required: true,
          schema: { type: "object", properties: {
            name:       { type: "string",  example: "Ahmed Ali" },
            phone:      { type: "string",  example: "01012345678" },
            salary:     { type: "number",  example: 5000 },
            role:       { type: "string",  example: "64f1a2b3c4d5e6f7a8b9c0d1" },
            department: { type: "string",  example: "64f1a2b3c4d5e6f7a8b9c0d2" },
          }}}],
        responses: { 201: { description: "Created" } } },
    },
    "/api/employees/{id}": {
      get:    { tags: ["Employees"], summary: "Get employee by ID",
        parameters: [{ in: "path", name: "id", required: true, type: "string" }],
        responses: { 200: { description: "OK" }, 404: { description: "Not found" } } },
      put:    { tags: ["Employees"], summary: "Update employee",
        parameters: [
          { in: "path", name: "id", required: true, type: "string" },
          { in: "body", name: "body", schema: { type: "object", properties: {
            name: { type: "string" }, phone: { type: "string" },
            salary: { type: "number" }, role: { type: "string" }, department: { type: "string" },
          }}},
        ],
        responses: { 200: { description: "Updated" }, 404: { description: "Not found" } } },
      delete: { tags: ["Employees"], summary: "Delete employee",
        parameters: [{ in: "path", name: "id", required: true, type: "string" }],
        responses: { 200: { description: "Deleted" }, 404: { description: "Not found" } } },
    },
    "/api/roles": {
      get:  { tags: ["Roles"], summary: "Get all roles",  responses: { 200: { description: "OK" } } },
      post: { tags: ["Roles"], summary: "Create role",
        parameters: [{ in: "body", name: "body", required: true,
          schema: { type: "object", properties: { name: { type: "string", example: "Waiter" } } }}],
        responses: { 201: { description: "Created" } } },
    },
    "/api/departments": {
      get:  { tags: ["Departments"], summary: "Get all departments", responses: { 200: { description: "OK" } } },
      post: { tags: ["Departments"], summary: "Create department",
        parameters: [{ in: "body", name: "body", required: true,
          schema: { type: "object", properties: { name: { type: "string", example: "FOH" } } }}],
        responses: { 201: { description: "Created" } } },
    },
  },
};

const outputFile = "./config/swagger-output.json";
const routes = ["./routes/menuRoutes.js"];

swaggerAutogen(outputFile, routes, doc);