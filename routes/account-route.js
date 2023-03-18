const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/account-controller");
const accountValidate = require("../utilities/account-validator");
const utilities = require("../utilities/");

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/logout", utilities.handleErrors(accountController.logoutClient));
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/login",
  accountValidate.loginRules(),
  accountValidate.checkLoginData,
  utilities.handleErrors(accountController.loginClient)
);
router.post(
  "/register",
  accountValidate.registationRules(),
  accountValidate.checkRegData,
  utilities.handleErrors(accountController.registerClient)
);

module.exports = router;
