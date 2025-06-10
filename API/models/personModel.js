import mysqlConnection from "../config/db.js";

class Person {
  constructor(...args) {
    // Object-style parameter
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      const {
        name = null,
        email = null,
        address = null,
        phone_number = null,
        password = null,
        role = null,
      } = args[0];

      if (!name && !email && !phone_number && !password && !role) {
        console.warn("Person constructor called with no valid fields; using defaults");
      }

      this.name = name;
      this.email = email;
      this.address = address;
      this.phone_number = phone_number;
      this.password = password;
      this.role = role;
    }

    // Positional arguments fallback
    else {
      const [name, email = null, address = null, phone_number = null, password = null, role = null] = args;

      this.name = name || null;
      this.email = email || null;
      this.address = address || null;
      this.phone_number = phone_number || null;
      this.password = password || null;
      this.role = role || null;
    }
  }

    async login(name, password) {
        const query = `
            SELECT p.person_id, p.name, p.role, p.password, pt.patient_id
            FROM person p
            LEFT JOIN patient pt ON p.name = pt.name
            WHERE p.name = ?
        `;
        try {
            const [rows] = await mysqlConnection.query(query, [name]);
            if (rows.length === 0) {
                console.log('Login failed: User not found for name:', name);
                return { success: false, message: 'User not found' };
            }
            const user = rows[0];
            console.log('Login attempt:', {
                name,
                inputPassword: password,
                storedPassword: user.password
            });
            if (password !== user.password) {
                console.log('Login failed: Password mismatch for name:', name);
                return { success: false, message: 'Invalid password' };
            }
            console.log('Login success for name:', name, 'Role:', user.role, 'Patient ID:', user.patient_id);
            return {
                success: true,
                data: {
                    person_id: user.person_id,
                    name: user.name,
                    role: user.role,
                    patient_id: user.patient_id
                }
            };
        } catch (err) {
            console.error('Login error:', err.message, err.stack);
            throw err;
        }
    }

    async addPersonToDb() {
        if (!this.name) {
            throw new Error('Name is required for adding person to database');
        }
        const query = `INSERT INTO person (name, email, address, phone_number, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
        try {
            const [result] = await mysqlConnection.execute(query, [
                this.name || null,
                this.email || null,
                this.address || null,
                this.phone_number || null,
                this.password || null,
                this.role || null
            ]);
            return result;
        } catch (err) {
            console.error("Database error adding person:", err.message, err.stack);
            throw err;
        }
    }
}

export default Person;