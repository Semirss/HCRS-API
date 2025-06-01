import mysqlConnection from "../config/db.js";

class Person {
    constructor({ name = null, email = null, address = null, phoneNumber = null, password = null, role = null } = {}) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone_number = phoneNumber;
        this.password = password;
        this.role = role;
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
                    patient_id: user.patient_id // null for non-patients
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
            const result = await mysqlConnection.execute(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
                this.password, // Store plain-text password
                this.role
            ]);
            return result;
        } catch (err) {
            console.error("Database error adding person:", err);
            throw err;
        }
    }
}

export default Person;