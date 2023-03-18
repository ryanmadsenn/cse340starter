const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");
const invValidate = require("../utilities/inventory-validator");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassification)
);
router.get(
  "/detail/:vehicleId",
  utilities.handleErrors(invController.buildDetail)
);
router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
);
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);
router.get(
  "/add-vehicle",
  utilities.handleErrors(invController.buildAddVehicle)
);
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);
router.post(
  "/add-vehicle",
  invValidate.addVehicleRules(),
  invValidate.checkAddVehicleData,
  utilities.handleErrors(invController.addVehicle)
);

module.exports = router;
