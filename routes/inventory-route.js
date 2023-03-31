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

router.get("/getVehicles/:classification_id", invController.getVehiclesJSON);
router.get("/edit/:vehicle_id", invController.editVehicle);
router.get("/delete/:vehicle_id", invController.deleteConfirm);

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

router.post(
  "/update",
  invValidate.addVehicleRules(),
  invValidate.checkUpdateVehicleData,
  invController.updateVehicle
);

router.post("/delete", invController.deleteVehicle);

module.exports = router;
