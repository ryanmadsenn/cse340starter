const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post("/register", accountController.registerClient)

module.exports = router;