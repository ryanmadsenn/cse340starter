const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/error-controller");
const utilities = require("../utilities/");

router.get("/", utilities.handleErrors(errorController.throwError));

module.exports = router;
