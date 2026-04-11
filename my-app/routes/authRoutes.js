const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post(
  "/register" /* #swagger.tags = ['Auth'] */,
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'Ahmed Ali', password: 'password' }
  } */
  register,
);

router.post(
  "/login" /* #swagger.tags = ['Auth'] */,
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'Ahmed Ali', password: 'password' }
  } */
  login,
);

module.exports = router;
