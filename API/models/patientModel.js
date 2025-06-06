import mysqlConnection from "../config/db.js";
import Person from "./personModel.js";

class Patient extends Person {
    constructor({ name, email = null, address = null, phoneNumber = null, password = null }) {
        if (!name) {
            throw new Error('Name is required for Patient');
        }
        super({ name, email, address, phoneNumber, password, role: 'patient' });
    }

    async deletePatient(patient_id) {
        const query = 'DELETE FROM patient WHERE patient_id = ?';
        try {
            const result = await mysqlConnection.query(query, [patient_id]);
            return result && result[0].affectedRows > 0;
        } catch (err) {
            console.error(err);
            throw err; 
        }
    }

    async registerPatient() {
        const query = 'INSERT INTO patient (name, email, address, phone_number, password) VALUES (?, ?, ?, ?, ?)';
        try {
            const result = await mysqlConnection.query(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
                this.password // Store plain-text password
            ]);
            return result;
        } catch (err) {
            console.error("Database error registering patient:", err);
            throw err;
        }
    }
}

export default Patient;