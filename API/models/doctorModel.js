import mysqlConnection from "../config/db.js";
import Person from "./personModel.js";

class Doctor extends Person {
    #specialization;
    
    // ={} ensures that if no object is passed, it defaults to an empty object instead of undefined.
    constructor ({ name, email=null, address=null, phoneNumber=null, specialization=null, password }={}) {
        super(name, email, address, phoneNumber, password, "doctor");
        this.#specialization = specialization
    }


    async fetchAllDoctors() {
        const query = 'Select * from doctor';
        try {
            const result = await mysqlConnection.query(query);
            return result
        } catch(err) {
            console.error(err);
        }
    }

    async addDoctor() {
        const query = 'INSERT INTO doctor (name, email, address, phone_number, specialization, password) VALUES (?, ?, ?, ?, ?, ?)';
        try {
            const result = await mysqlConnection.query(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
                this.#specialization,
                this.password
            ]);
            return result
        } catch(err) {
            console.error(err);
        }
    }

    async updateDoctor(doctor_id) {
        const query = 'Update doctor set email=?, address=?, phone_number=? where doctor_id=?';
        try {
            const result = await mysqlConnection.query(query, [
                this.email,
                this.address,
                this.phone_number,
                doctor_id,
            ]);
            return result
        } catch(err) {
            console.error(err);
        }
    }

    async deleteDoctor(doctor_id) {
        const query = 'Delete from doctor where doctor_id=?';
        try {
            const result = await mysqlConnection.query(query, doctor_id);
            return result;
        } catch(err) {
            console.error(err);
        }
    }
}

export default Doctor