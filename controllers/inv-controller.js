const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invController = {};

invController.buildByClassification = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  let data = await invModel.getVehiclesByClassificationId(classificationId);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification-view", {
    title: `${className} Vehicles`,
    nav,
    message: null,
    data
  });
};

invController.buildDetail = async function (req, res, next) {
  const vehicleId = req.params.vehicleId;
  let data = await invModel.getVehicleByVehicleId(vehicleId);
  console.log(data)
  let nav = await utilities.getNav();
  const make = data[0].inv_make;
  const model = data[0].inv_model;
  res.render("./inventory/detail-view", {
    title: `${make} ${model}`,
    nav,
    message: null,
    data
  });
};

module.exports = invController;
