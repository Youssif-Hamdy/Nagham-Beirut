const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Nagham Menu API",
      version: "1.0.0",
      description: "REST API for managing the restaurant menu (English & Arabic)",
    },
    servers: [
      { url: "https://nagham-beirut.vercel.app", description: "Production" },
      { url: "http://localhost:3000", description: "Local" },
    ],
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);