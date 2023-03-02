const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const accountController = {};
const bcrypt = require("bcryptjs");

accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./account/login-view", {
    title: "Login",
    nav,
    errors: null,
    message: null,
  });
};

accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./account/register-view", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  });
};

accountController.loginClient = async function (req, res) {
  const nav = await utilities.getNav();
  const { client_email, client_password } = req.body;

  const validated = await accountModel.checkUsernameAndPassword(
    client_email,
    client_password
  );

  if (validated) {
    res.status(201).render("./account/login-view", {
      title: "Login",
      nav,
      message: "You are logged in.",
      errors: null,
    });
  } else {
    res.status(501).render("./account/login-view", {
      errors: null,
      message: "Invalid email or password.",
      title: "Login",
      nav,
      client_email,
    });
    return;
  }
};

accountController.registerClient = async function (req, res) {
  const nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_password } =
    req.body;

  let hashedPassword;
  try {
    // Pass password and cost.
    hashedPassword = await bcrypt.hash(client_password, 10);
  } catch (err) {
    res.status(500).render("./account/register-view", {
      title: "Register",
      nav,
      message: "Sorry, there was an error processing the registration.",
      errors: null,
    });
    return;
  }

  const regResult = await accountModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    hashedPassword
  );

  if (regResult) {
    res.status(201).render("./account/login-view", {
      title: "Login",
      nav,
      message: `Congratulations, you're registered ${client_firstname}. Please login to continue.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the registration failed.";
    res.status(501).render("./account/register-view", {
      title: "Register",
      nav,
      message,
      errors: null,
    });
  }
};

module.exports = accountController;
