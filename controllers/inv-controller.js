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

module.exports = invController;
