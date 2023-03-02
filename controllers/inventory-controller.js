const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invController = {};

invController.buildByClassification = async function (req, res, next) {
  const classificationId = req.params.classificationId;
  let data = await invModel.getVehiclesByClassificationId(classificationId);
  let nav = await utilities.getNav();
  let className;
  if (data.length > 0) {
    className = data[0].classification_name;
  } else {
    className = await invModel.getClassificationNameByClassificationId(
      classificationId
    );
  }

  res.render("./inventory/classification-view", {
    title: `${className} Vehicles`,
    nav,
    message: null,
    data,
  });
};

invController.buildDetail = async function (req, res, next) {
  const vehicleId = req.params.vehicleId;
  let data = await invModel.getVehicleByVehicleId(vehicleId);
  let nav = await utilities.getNav();
  let detail = await utilities.getDetail(data);
  const make = data[0].inv_make;
  const model = data[0].inv_model;
  res.render("./inventory/detail-view", {
    title: `${make} ${model}`,
    nav,
    message: null,
    detail,
  });
};

invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management-view", {
    title: "Inventory Management",
    nav,
    message: null,
  });
};

invController.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification-view", {
    title: "Add Classification",
    nav,
    message: null,
    errors: null,
  });
};

invController.buildAddVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  let dropdown = await utilities.getClassificationDropdown();
  res.render("./inventory/add-vehicle-view", {
    title: "Add Vehicle",
    nav,
    message: null,
    errors: null,
    dropdown,
  });
};

invController.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;

  const regResult = await invModel.addClassification(classification_name);

  const nav = await utilities.getNav();

  if (regResult) {
    res.status(201).render("./inventory/add-classification-view", {
      title: "Add Classification",
      nav,
      message: `${classification_name} classification successfully added!`,
      errors: null,
    });
  } else {
    const message = "Sorry, failed to add classification.";
    res.status(501).render("./inventory/add-classification-view", {
      title: "Add Classification",
      nav,
      message,
      errors: null,
    });
  }
};

invController.addVehicle = async function (req, res, next) {
  const nav = await utilities.getNav();
  const dropdown = await utilities.getClassificationDropdown();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const vehicleDetails = {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  };

  const regResult = await invModel.addVehicle(vehicleDetails);

  if (regResult) {
    res.status(201).render("./inventory/add-vehicle-view", {
      title: "Add Vehicle",
      nav,
      message: `${inv_make} ${inv_model} successfully added!`,
      errors: null,
      dropdown,
    });
  } else {
    const message = "Sorry, failed to add vehicle.";
    res.status(501).render("./inventory/add-vehicle-view", {
      title: "Add Vehicle",
      nav,
      message,
      errors: null,
      dropdown,
    });
  }
};

module.exports = invController;
