// routes.js
const express = require("express");
const router = express.Router();
const login   = require("../../controller/userAuthorization/userLogin");
// const activateUser = require("../../controller/userAuthorization/userLogin");
const { isAdmin } = require("../../middleware/roleMiddleWare");
const verifyRoles = require("../../middleware/verifyRoles");


router.post("/userLogin", login);


module.exports = router;
