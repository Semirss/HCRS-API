import mysqlConnection from "../config/db.js";
import Person from "./personModel.js";

class Receptionist extends Person {
    constructor ({ name, email=null, address=null, phoneNumber=null, password } = {}) {
        super(name, email, address, phoneNumber, password, "receptionist");
    }

    async fetchAllReceptionists() {
        const query = 'select * from receptionist';
        try {
            const result = await mysqlConnection.query(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
            ]);
            return result
        } catch(err) {
            console.error(err);
        }
    }

    async addReceptionist() {
        const query = 'INSERT INTO receptionist (name, email, address, phone_number, password) VALUES (?, ?, ?, ?, ?)';
        try {
            const result = await mysqlConnection.query(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
                this.password,
            ]);
            return result
        } catch(err) {
            console.error(err);
        }
    }

    async updateReceptionist(receptionist_id) {
        const query = 'Update receptionist set email=?, phone_number=?, address=? where receptionist_id=?';
        try {
            const result = await mysqlConnection.query(query, [
                this.email,
                this.phone_number,
                this.address,
                receptionist_id
            ]);
            return result
        } catch(err) {
            console.error(err);
        }
    }

    async deleteReceptionist(receptionist_id) {
        const query = 'delete from receptionist where receptionist_id=?';
        try {
            const result = await mysqlConnection.query(query, receptionist_id);
            return result
        } catch(err) {
            console.error(err);
        }
    }
}

export default Receptionist