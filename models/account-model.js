const pool = require("../database/");

async function registerClient(
  client_firstname,
  client_lastname,
  client_email,
  client_password
) {
  try {
    const sql = `INSERT INTO public.client 
                    (client_firstname, client_lastname, client_email, client_password, client_type) 
                    VALUES 
                    ($1, $2, $3, $4, 'Client') 
                    RETURNING *`;

    return await pool.query(sql, [
      client_firstname,
      client_lastname,
      client_email,
      client_password,
    ]);
  } catch (error) {
    error.message;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(client_email, client_id = null) {
  try {
    let sql = "SELECT * FROM client WHERE client_email = $1";
    if (client_id) {
      sql += " AND client_id != $2";
    }
    const email = await pool.query(sql, [client_email, client_id]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Get client by email
 * ********************* */
async function getClientByEmail(client_email) {
  try {
    const sql = "SELECT * FROM client WHERE client_email = $1";
    const result = await pool.query(sql, [client_email]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Get client by id
 * ********************* */
async function getClientById(client_id) {
  try {
    const sql = "SELECT * FROM client WHERE client_id = $1";
    const result = await pool.query(sql, [client_id]);
    return result.rows[0];
  } catch (error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing email and password
 * ********************* */
async function checkUsernameAndPassword(client_email, client_password) {
  try {
    const sql =
      "SELECT * FROM client WHERE client_email = $1 AND client_password = $2";
    const email = await pool.query(sql, [client_email, client_password]);
    return email.rowCount;
  } catch (error) {
    return error.message;
  }
}

async function updateClient(
  client_id,
  client_firstname,
  client_lastname,
  client_email
) {
  try {
    const sql = `UPDATE public.client 
                    SET client_firstname = $1, client_lastname = $2, client_email = $3
                    WHERE client_id = $4`;
    const values = [client_firstname, client_lastname, client_email, client_id];
    const data = await pool.query(sql, values);
    return data;
  } catch (error) {
    error.message;
  }
}

async function updatePassword(client_id, client_password) {
  try {
    const sql = `UPDATE public.client
                    SET client_password = $1
                    WHERE client_id = $2`;
    const values = [client_password, client_id];
    const data = pool.query(sql, values);
    return data;
  } catch (error) {
    error.message;
  }
}

module.exports = {
  registerClient,
  checkExistingEmail,
  checkUsernameAndPassword,
  getClientByEmail,
  getClientById,
  updateClient,
  updatePassword,
};
