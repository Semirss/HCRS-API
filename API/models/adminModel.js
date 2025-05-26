import mysqlConnection from "../config/db.js";

class Admin {
    async login(name) {
        const query = 'SELECT * FROM admin WHERE name = ?';
        try {
          const result = await mysqlConnection.query(query, name);
          return result;
        } catch(err) {
          console.error(err);
        }
    }
}

export default Admin