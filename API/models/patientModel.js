import mysqlConnection from "../config/db.js";
import Person from "./personModel.js";

class Patient extends Person {

    constructor ({ name, email=null, address=null, phoneNumber=null }={}) {
        super(name, email, address, phoneNumber);
    }

    async registerPatient() {
        const query = 'INSERT INTO patient (name, email, address, phone_number) VALUES (?, ?, ?, ?)';
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
}

export default Patient;