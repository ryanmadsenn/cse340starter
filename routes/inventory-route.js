const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");
const invValidate = require("../utilities/inventory-validator");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);
router.get("/detail/:vehicleId", invController.buildDetail);
router.get("/", utilities.checkEmployeeOrAdmin, invController.buildManagement);
router.get("/add-classification", invController.buildAddClassification);
router.get("/add-vehicle", invController.buildAddVehicle);
router.post(
  "/add-classification",
  invValidate.addClassificationRules(),
  invValidate.checkAddClassificationData,
  invController.addClassification
);
router.post(
  "/add-vehicle",
  invValidate.addVehicleRules(),
  invValidate.checkAddVehicleData,
  invController.addVehicle
);

module.exports = router;
