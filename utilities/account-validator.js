const utilities = require("./");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // Valid email is required and must already exist in the DB.
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (client_email) => {
        const emailExists = await accountModel.checkExistingEmail(client_email);
        if (emailExists) {
          throw new Error("Email already exists.");
        }
      }),

    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  ];
};

validate.passwordRules = () => {
  return [
    // password is required and must be strong password
    body("client_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

async function checkExistingEmail(client_email, client_id) {
  let data = await accountModel.checkExistingEmail(client_email, client_id);
  console.log(data);
  return data > 0;
}

/*  **********************************
 * Check data and return errors or continue to login.
 * ********************************* */
validate.checkLoginData = async (req, res, next) => {
  const { client_email } = req.body;
  let errors = [];
  errors = validationResult(req);

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./account/login-view", {
      errors,
      message: null,
      title: "Login",
      nav,
      client_email,
    });
    return;
  }
  next();
};

/*  **********************************
 * Check data and return errors or continue to registration.
 * ********************************* */
validate.checkRegData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./account/register-view", {
      errors,
      message: null,
      title: "Registration",
      nav,
      client_firstname,
      client_lastname,
      client_email,
    });
    return;
  }
  next();
};

/*  **********************************
 * Check data and return errors or continue to registration.
 * ********************************* */
validate.checkUpdateData = async (req, res, next) => {
  const { client_id, client_firstname, client_lastname, client_email } =
    req.body;
  let errors = [];
  let message = null;
  errors = validationResult(req);
  if (await checkExistingEmail(client_email, client_id))
    message = "Email already exists.";

  if (!errors.isEmpty() || message) {
    let nav = await utilities.getNav();
    res.render("./account/update-account-view", {
      errors,
      message: message,
      title: "Update Account",
      nav,
      client_id,
      client_firstname,
      client_lastname,
      client_email,
    });
    return;
  }
  next();
};

/*  **********************************
 * Check data and return errors or continue to registration.
 * ********************************* */
validate.checkPasswordData = async (req, res, next) => {
  const { client_id, client_password } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("./account/update-account-view", {
      errors,
      message: null,
      title: "Update Account",
      nav,
      client_id,
      client_password,
    });
    return;
  }
  next();
};

module.exports = validate;
