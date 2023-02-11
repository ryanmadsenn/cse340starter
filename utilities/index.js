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

module.exports = Util;
