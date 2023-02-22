const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const accountController = {};

accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./account/login-view", { 
    title: "Login", 
    nav,
    errors: null,
    message: null,
});
}

accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("./account/register-view", {
    title: "Register",
    nav,
    errors: null,
    message: null,
  });
}

accountController.registerClient = async function (req, res) {
  const nav = await utilities.getNav();
  const { client_firstname, client_lastname, client_email, client_password } = req.body;

  const regResult = await accountModel.registerClient(
    client_firstname,
    client_lastname,
    client_email,
    client_password
  );

  console.log(regResult);

  if (regResult) {
    res.status(201).render('./account/login-view', {
      title: 'Login',
      nav,
      message: `Congratulations, you're registered ${client_firstname}. Please login to continue.`,
      errors: null,
    });
  } else {
    const message = "Sorry, the registration failed."
    res.status(501).render('./account/register-view', {
      title: 'Register',
      nav,
      message,
      errors: null,
    });
  }
}

module.exports = accountController;
