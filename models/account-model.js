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
async function checkExistingEmail(client_email) {
  try {
    const sql = "SELECT * FROM client WHERE client_email = $1";
    const email = await pool.query(sql, [client_email]);
    return email.rowCount;
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

module.exports = {
  registerClient,
  checkExistingEmail,
  checkUsernameAndPassword,
};
