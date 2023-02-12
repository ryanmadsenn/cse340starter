const pool = require("../database/");

async function getClassifications() {
  return await pool.query(`SELECT *
                            FROM public.classification
                            ORDER BY classification_name`);
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

module.exports = { getClassifications, getVehiclesByClassificationId, getVehicleByVehicleId };
