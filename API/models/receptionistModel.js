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
    const query = 'UPDATE receptionist SET name = ?, email = ?, address = ?, phone_number = ?, password = COALESCE(?, password) WHERE receptionist_id = ?';
    try {
        console.log('Updating receptionist with ID:', receptionist_id, 'Data:', {
            name: this.name,
            email: this.email,
            address: this.address,
            phone_number: this.phone_number,
            password: this.password ? '[REDACTED]' : null
        });
        const result = await mysqlConnection.query(query, [
            this.name,
            this.email,
            this.address,
            this.phone_number,
            this.password,
            receptionist_id
        ]);
        console.log('Update receptionist result:', result);
        if (result[0].changedRows === 0 && result[0].affectedRows > 0) {
            console.log('No changes applied; input data matches existing database values');
        }
        return result;
    } catch(err) {
        console.error('Error updating receptionist:', err.message, err.stack);
        throw err;
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