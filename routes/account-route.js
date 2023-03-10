const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");
const accountValidate = require("../utilities/account-validator");
const utilities = require("../utilities/");

router.get("/", utilities.checkLogin, accountController.buildManagement);
router.get("/login", accountController.buildLogin);
router.get("/logout", accountController.logoutClient);
router.get("/register", accountController.buildRegister);
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  accountController.loginClient
);
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  accountController.registerClient
);

module.exports = router;
