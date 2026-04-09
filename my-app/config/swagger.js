const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Nagham Menu API",
    description: "REST API for managing the restaurant menu (English & Arabic)",
    version: "1.0.0",
  },
  host: "nagham-beirut.vercel.app",
  basePath: "/api/menu",
  schemes: ["https", "http"],
};

const outputFile = "./config/swagger-output.json";
const routes = ["./routes/menuRoutes.js"];

swaggerAutogen(outputFile, routes, doc);