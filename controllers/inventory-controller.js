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
  const classificationSelect = await utilities.getClassificationDropdown();
  res.render("./inventory/management-view", {
    title: "Inventory Management",
    nav,
    message: null,
    classificationSelect,
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
    const dropdown = await utilities.getClassificationDropdown();
    res.status(201).render("./inventory/add-vehicle-view", {
      title: "Add Vehicle",
      nav,
      message: `${inv_make} ${inv_model} successfully added!`,
      errors: null,
      dropdown,
    });
  } else {
    const dropdown = await utilities.getClassificationDropdown(
      classification_id
    );
    const message = "Sorry, failed to add vehicle.";
    res.status(501).render("./inventory/add-vehicle-view", {
      title: "Add Vehicle",
      nav,
      message,
      errors: null,
      dropdown,
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
    });
  }
};

/* ***************************
 *  Return Vehicles by Classification As JSON
 * ************************** */
invController.getVehiclesJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const vehicleData = await invModel.getVehiclesByClassificationId(
    classification_id
  );

  if (!vehicleData.length > 0) {
    next(new Error("No data returned"));
    return;
  }

  return res.json(vehicleData);
};

/* ***************************
 *  Edit a Vehicle View
 * ************************** */
invController.editVehicle = async function (req, res, next) {
  let vehicle_id = parseInt(req.params.vehicle_id);
  let nav = await utilities.getNav();
  let vehicleData = await invModel.getVehicleByVehicleId(vehicle_id);
  let dropdown = await utilities.getClassificationDropdown(
    vehicleData[0].classification_id
  );
  let vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`;
  res.render("./inventory/edit-vehicle-view", {
    title: `Edit ${vehicleName}`,
    nav,
    message: null,
    errors: null,
    dropdown,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_description: vehicleData[0].inv_description,
    inv_image: vehicleData[0].inv_image,
    inv_thumbnail: vehicleData[0].inv_thumbnail,
    inv_price: vehicleData[0].inv_price,
    inv_miles: vehicleData[0].inv_miles,
    inv_color: vehicleData[0].inv_color,
    classification_id: vehicleData[0].classification_id,
  });
};

/* ***************************
 *  Edit a Vehicle View
 * ************************** */
invController.updateVehicle = async function (req, res, next) {
  console.log("updateVehicle");
  const nav = await utilities.getNav();
  const {
    inv_id,
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
    inv_id,
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

  const updateResult = await invModel.updateVehicle(vehicleDetails);

  if (updateResult) {
    let classificationSelect = await utilities.getClassificationDropdown();
    res.status(201).render("./inventory/management-view", {
      title: `Vehicle Management`,
      nav,
      message: `The ${inv_make} ${inv_model} Vehicle successfully updated!`,
      errors: null,
      classificationSelect,
    });
  } else {
    let dropdown = await utilities.getClassificationDropdown(classificationId);
    const message = "Sorry, failed to update vehicle.";
    res.status(501).render("./inventory/edit-vehicle-view", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      message,
      errors: null,
      dropdown,
      inv_id,
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
    });
  }
};

/* ***************************
 *  Confirm Delete Vehicle View
 * ************************** */
invController.deleteConfirm = async (req, res, next) => {
  let vehicle_id = parseInt(req.params.vehicle_id);
  let nav = utilities.getNav();
  let vehicleData = await invModel.getVehicleByVehicleId(vehicle_id);

  if (!vehicleData.length > 0) {
    next(new Error("No data returned"));
    return;
  }

  let vehicleName = `${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`;
  res.render("./inventory/delete-vehicle-view", {
    title: `Delete ${vehicleName}`,
    nav,
    message: null,
    errors: null,
    inv_id: vehicleData[0].inv_id,
    inv_make: vehicleData[0].inv_make,
    inv_model: vehicleData[0].inv_model,
    inv_year: vehicleData[0].inv_year,
    inv_price: vehicleData[0].inv_price,
  });
};

/* ***************************
 *  Delete Vehicle
 * ************************** */
invController.deleteVehicle = async function (req, res, next) {
  const nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;

  const deleteResult = await invModel.deleteVehicle(inv_id);

  if (deleteResult) {
    let classificationSelect = await utilities.getClassificationDropdown();
    res.status(201).render("./inventory/management-view", {
      title: `Vehicle Management`,
      nav,
      message: `The ${inv_make} ${inv_model} was successfully deleted`,
      errors: null,
      classificationSelect,
    });
  } else {
    const message = "Sorry, failed to delete vehicle.";
    res.status(501).render("./inventory/edit-vehicle-view", {
      title: `Edit ${inv_make} ${inv_model}`,
      nav,
      message,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

module.exports = invController;
