const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const accountController = {};
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

  const clientData = await accountModel.getClientByEmail(client_email);

  if (!clientData) {
    const message = "Please check your credentials and try again.";
    res.status(400).render("./account/login-view", {
      title: "Login",
      nav,
      message,
      errors: null,
      client_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(client_password, clientData.client_password)) {
      delete clientData.client_password;
      const accessToken = jwt.sign(clientData, process.env.ACCESS_TOKEN, {
        expiresIn: 3600 * 1000,
      });
      res.cookie("jwt", accessToken, { httpOnly: true });
      return res.redirect("/client/");
    }
  } catch (err) {
    return res.status(403).send("Access Forbidden");
  }
};

accountController.logoutClient = async function (req, res) {
  res.clearCookie("jwt");
  res.redirect("/");
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

accountController.buildManagement = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./account/management-view", {
    title: "Management",
    nav,
    errors: null,
    message: null,
  });
};

accountController.buildUpdate = async function (req, res) {
  let client_id = res.locals.clientData.client_id;
  const nav = await utilities.getNav();
  const clientData = await accountModel.getClientById(client_id);

  res.render("./account/update-account-view", {
    title: "Update Acount",
    nav,
    errors: null,
    message: null,
    client_id: clientData.client_id,
    client_firstname: clientData.client_firstname,
    client_lastname: clientData.client_lastname,
    client_email: clientData.client_email,
  });
};

accountController.updateClient = async function (req, res) {
  const nav = await utilities.getNav();
  const { client_id, client_firstname, client_lastname, client_email } =
    req.body;

  const updateResult = await accountModel.updateClient(
    client_id,
    client_firstname,
    client_lastname,
    client_email
  );

  if (updateResult) {
    let clientData = await accountModel.getClientById(client_id);
    res.status(201).render("./account/management-view", {
      title: "Management",
      nav,
      message: `Your account has been updated.`,
      errors: null,
      clientData: clientData,
    });
  } else {
    const message = "Sorry, the update failed.";
    res.status(501).render("./account/update-account-view", {
      title: "Update Account",
      nav,
      message,
      errors: null,
    });
  }
};

accountController.updatePassword = async function (req, res) {
  const nav = await utilities.getNav();
  const { client_id, client_password } = req.body;

  let hashedPassword;
  try {
    // Pass password and cost.
    hashedPassword = await bcrypt.hash(client_password, 10);
  } catch (err) {
    res.status(500).render("./account/update-account-view", {
      title: "Update Account",
      nav,
      message: "Sorry, there was an error processing the update.",
      errors: null,
    });
    return;
  }

  const updateResult = await accountModel.updatePassword(
    client_id,
    hashedPassword
  );

  if (updateResult) {
    res.status(201).render("./account/management-view", {
      title: "Management",
      nav,
      message: `Your password has been updated.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the update failed.";
    res.status(501).render("./account/update-account-view", {
      title: "Update Account",
      nav,
      message,
      errors: null,
    });
  }
};

module.exports = accountController;
