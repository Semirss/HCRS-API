import mysqlConnection from "../config/db.js";
import Person from "./personModel.js"; 

class Patient extends Person {
    constructor({ name, email, address, phone_number, password }) {
        super({ name, email, address, phone_number, password }); 
        console.log('Patient constructor:', { name, email, address, phone_number, password }); 
        this.address = address || '';
        this.phone_number = phone_number || 'unknown';
        this.role = 'patient';
    }

    async registerPatient() {
        const query = 'INSERT INTO patient (name, email, address, phone_number, password) VALUES (?, ?, ?, ?, ?)';
        try {
            const result = await mysqlConnection.query(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
                this.password
            ]);
            return result;
        } catch (err) {
            console.error("Database error registering patient:", err);
            throw err;
        }
    }

    async addPersonToDb() {
        if (!this.name) {
            throw new Error('Name is required for adding person to database');
        }
        const query = `INSERT INTO person (name, email, address, phone_number, password, role) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [
            this.name,
            this.email,
            this.address,
            this.phone_number,
            this.password,
            this.role
        ];
        console.log('addPersonToDb values:', values); 
        try {
            const result = await mysqlConnection.execute(query, values);
            return result;
        } catch (err) {
            console.error("Database error adding person:", err);
            throw err;
        }
    }

    async deletePatient(patient_id) {
        const query = 'DELETE FROM patient WHERE patient_id = ?';
        try {
            const result = await mysqlConnection.execute(query, [patient_id]);
            return result;
        } catch (err) {
            console.error("Database error deleting patient:", err);
            throw err;
        }
    }
}

export default Patient;