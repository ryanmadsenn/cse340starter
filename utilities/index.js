const { DataRowMessage } = require("pg-protocol/dist/messages");
const invModel = require("../models/inventory-model");
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

Util.buildClassificationDropdown = function (data) {
  let dropdown = `<select name="classification_id" class="text-input" id="classificationId">`;
  dropdown += `<option value="0">Select</option>`;
  data.rows.forEach((row) => {
    dropdown += `<option value="${row.classification_id}">${row.classification_name}</option>`;
  });
  dropdown += "</select>";
  return dropdown;
};

Util.getClassificationDropdown = async function () {
  const data = await invModel.getClassifications();
  console.log(data);
  return Util.buildClassificationDropdown(data);
};

module.exports = Util;
