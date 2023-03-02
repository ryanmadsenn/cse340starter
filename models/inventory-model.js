const pool = require("../database/");

async function getClassifications() {
  return await pool.query(`SELECT *
                            FROM public.classification
                            ORDER BY classification_name`);
}

async function getClassificationNameByClassificationId(classificationId) {
  try {
    const data = await pool.query(
      `SELECT classification_name
      FROM public.classification
      WHERE classification_id = $1`,
      [classificationId]
    );
    return data.rows[0].classification_name;
  } catch (error) {
    console.log(`getClassificationNameByClassificationId Error: ${error}`);
  }
}

async function getClassificationByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT *
      FROM public.classification
      WHERE classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.log(`getClassificationByClassificationId Error: ${error}`);
  }
}

async function checkExistingClassification(classification_name) {
  try {
    const data = await pool.query(
      `SELECT classification_name
      FROM public.classification
      WHERE classification_name = $1`,
      [classification_name]
    );
    return data.rowCount;
  } catch (error) {
    console.log(`checkExistingClassification Error: ${error}`);
  }
}

async function getVehiclesByClassificationId(classificationId) {
  try {
    const data = await pool.query(
      `SELECT *
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classificationId]
    );
    return data.rows;
  } catch (error) {
    console.log(`getClassificationsById Error: ${error}`);
  }
}

async function getVehicleByVehicleId(vehicleId) {
  try {
    const data = await pool.query(
      `SELECT *
      FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [vehicleId]
    );
    return data.rows;
  } catch (error) {
    console.log(`getVehicleByVehicleId Error: ${error}`);
  }
}

async function addClassification(classification_name) {
  try {
    const sql = `INSERT INTO public.classification 
                (classification_name)
                VALUES 
                ($1)`;

    return await pool.query(sql, [classification_name]);
  } catch (error) {
    error.message;
  }
}

async function addVehicle(vehicleDetails) {
  try {
    const sql = `INSERT INTO public.inventory
                (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
                VALUES
                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const values = [
      vehicleDetails.inv_make,
      vehicleDetails.inv_model,
      vehicleDetails.inv_year,
      vehicleDetails.inv_description,
      vehicleDetails.inv_image,
      vehicleDetails.inv_thumbnail,
      vehicleDetails.inv_price,
      vehicleDetails.inv_miles,
      vehicleDetails.inv_color,
      vehicleDetails.classification_id,
    ];

    return await pool.query(sql, values);
  } catch (error) {
    error.message;
  }
}

module.exports = {
  getClassifications,
  getClassificationNameByClassificationId,
  getClassificationByClassificationId,
  checkExistingClassification,
  getVehiclesByClassificationId,
  getVehicleByVehicleId,
  addClassification,
  addVehicle,
};
