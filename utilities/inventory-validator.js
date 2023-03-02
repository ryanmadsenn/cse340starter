const utilities = require("../utilities");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Add Classification Data Validation Rules
 * ********************************* */

validate.addClassificationRules = () => {
  return [
    // classification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a valid classification name.")
      .custom(async (classification_name) => {
        let classificationExists = await invModel.checkExistingClassification(
          classification_name
        );
        if (classificationExists) {
          throw new Error("Classification already exists.");
        }
      }),
  ];
};

/*  **********************************
 *  Add Vehicle Data Validation Rules
 * ********************************* */
validate.addVehicleRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Make must be at least 1 character long.")
      .isAlpha()
      .withMessage("Make must only contain letters."),
    body("inv_model")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Model must be at least 1 character long.")
      .isAlphanumeric()
      .withMessage("Model must only contain letters and numbers."),
    body("inv_year")
      .trim()
      .escape()
      .isLength({ min: 4 })
      .withMessage("Year must be 4 characters long.")
      .isNumeric()
      .withMessage("Year must be a number."),
    body("inv_description")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Image path must be at least 5 characters long.")
      .matches(/.*\.(png|jpeg|jpg|webp|svg)$/)
      .withMessage(
        "Image path must end with .png, .jpeg, .jpg, .webp, or .svg."
      ),
    body("inv_thumbnail")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Thumbnail path must be at least 5 characters long.")
      .matches(/.*\.(png|jpeg|jpg|webp|svg)$/)
      .withMessage(
        "Thumbnail path must end with .png, .jpeg, .jpg, .webp, or .svg."
      ),
    body("inv_price")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Price must be at least 1 character long.")
      .isDecimal()
      .withMessage("Price must be a number."),
    body("inv_miles")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Mileage must be at least 1 character long.")
      .isNumeric()
      .withMessage("Mileage must be a number."),
    body("inv_color")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Color must be at least 1 character long.")
      .isAlpha()
      .withMessage("Color must only contain letters."),
    body("classification_id")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Classification must have a value.")
      .isNumeric()
      .withMessage("Classification must have a value.")
      .custom(async (classification_id) => {
        let classificationExists =
          await invModel.getClassificationByClassificationId(classification_id);
        if (!classificationExists) {
          throw new Error("Classification does not exist.");
        }
      }),
  ];
};

/*  **********************************
 *  Check data and return errors add classification
 * ********************************* */
validate.checkAddClassificationData = async (req, res, next) => {
  let { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification-view", {
      title: "Add Classification",
      nav,
      message: null,
      errors,
      classification_name,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Check data and return errors add vehicle
 * ********************************* */
validate.checkAddVehicleData = async (req, res, next) => {
  let {
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

  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classifications = await invModel.getClassifications();
    let dropdown = await utilities.buildClassificationDropdown(
      classifications,
      classification_id
    );
    res.render("./inventory/add-vehicle-view", {
      title: "Add Vehicle",
      nav,
      message: null,
      errors,
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
      classifications,
      dropdown,
    });
    return;
  }
  next();
};

module.exports = validate;
