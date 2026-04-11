const express = require("express");
const router = express.Router();
const { getRoles, createRole } = require("../controllers/roleController");
const auth = require("../middlewares/auth");

router.get("/", /* #swagger.tags = ['Roles'] */ getRoles);
router.post(
  "/" /* #swagger.tags = ['Roles'] */,
  /* #swagger.parameters['body'] = {
    in: 'body', required: true,
    schema: { name: 'Waiter' }
  } */
  auth,
  createRole,
);

module.exports = router;
