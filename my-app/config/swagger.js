const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Nagham Menu API",
    description: "REST API for managing the restaurant menu",
  },
  host: "nagham-beirut.vercel.app",
  schemes: ["https", "http"],
};

const outputFile = "./swagger-output.json";
const routes = ["./routes/menuRoutes.js"];

swaggerAutogen(outputFile, routes, doc);