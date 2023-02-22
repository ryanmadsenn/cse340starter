const express = require("express");
const router = new express.Router();
const invController = require("../controllers/inventory-controller");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassification);
router.get("/detail/:vehicleId", invController.buildDetail);
router.get("/management", invController.buildManagement);
router.get("/add-classification", invController.buildAddClassification);
router.get("/add-vehicle", invController.buildAddVehicle);
router.post("/add-classification", invController.addClassification);
router.post("/add-vehicle", invController.addVehicle);

module.exports = router;
