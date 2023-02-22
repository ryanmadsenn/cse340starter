const pool = require('../database/');

async function registerClient(client_firstname, client_lastname, client_email, client_password) {
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
            client_password
        ]);
    } catch (error) {
        error.message
    }
}

module.exports = { registerClient };