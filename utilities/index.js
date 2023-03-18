const { DataRowMessage } = require("pg-protocol/dist/messages");
const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/******************************************
 * Constructs the nav HTML unordered list *
 ******************************************/
Util.buildNav = function (data) {
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `
    <li>
      <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">${row.classification_name}</a>
    </li>`;
  });
  list += "</ul>";
  return list;
};

/*****************************
 * Builds the navigation bar *
 *****************************/
Util.getNav = async function () {
  const data = await invModel.getClassifications();
  return Util.buildNav(data);
};

/**************************
 * Builds the detail view *
 **************************/
Util.buildDetail = function (data) {
  let detailView;

  if (data.length > 0) {
    detailView = `<div id="detail-container">
      <img class="detail-img" src="${data[0].inv_image}" alt="Image of ${
      data[0].inv_make
    } ${data[0].inv_model} on CSE Motors">
      <div id detail-info-container>
          <h2>Vehicle Details</h2>
          <p>${data[0].inv_description}</p>
          <p>Price: <span id="detail-price">$${new Intl.NumberFormat(
            "en-US"
          ).format(data[0].inv_price)}</span></p>
          <p>Year: ${data[0].inv_year}</p>
          <p>Miles: ${data[0].inv_miles}</p>
          <p>Color: ${data[0].inv_color}</p>
      </div>
    </div>`;
  } else {
    detailView = `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }

  return detailView;
};

Util.getDetail = async function (data) {
  return Util.buildDetail(data);
};

Util.buildClassificationDropdown = function (data, classification_id) {
  let dropdown = `<select name="classification_id" class="text-input" id="classificationId">`;
  dropdown += `<option value="0">Select</option>`;
  data.rows.forEach((row) => {
    let selected = "";
    if (classification_id == row.classification_id) selected = "selected";
    dropdown += `<option value="${row.classification_id}" ${selected}>${row.classification_name}</option>`;
  });
  dropdown += "</select>";
  return dropdown;
};

Util.getClassificationDropdown = async function (classification_id = null) {
  const data = await invModel.getClassifications();
  return Util.buildClassificationDropdown(data, classification_id);
};

/* ****************************************
 *  Check JWT
 * ************************************ */
// Util.checkJWTToken = (req, res, next) => {
//   jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN, (err) => {
//     if (err) {
//       return res.status(403).redirect("/client/login");
//     }
//     return next();
//   });
// };

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN,
      function (err, clientData) {
        if (err) {
          res.clearCookie("jwt");
          return res.redirect("/client/login");
        }
        res.locals.clientData = clientData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Authorize JWT
 * ************************************ */
Util.jwtAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  try {
    const clientData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.clientData = clientData;
    next();
  } catch (error) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.redirect("/client/login");
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    return res.redirect("/client/login");
  }
};

Util.checkEmployeeOrAdmin = (req, res, next) => {
  if (res.locals.loggedin) {
    if (
      res.locals.clientData.client_type === "Employee" ||
      res.locals.clientData.client_type === "Admin"
    ) {
      next();
    } else {
      return res.redirect("/client/login");
    }
  } else {
    return res.redirect("/client/login");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
