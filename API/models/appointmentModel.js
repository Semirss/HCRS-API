import mysqlConnection from "../config/db.js";

class Appointment {
    #card_id;
    #date;
    #status;

    constructor ({ cardID=null, date=null, status=null }={}) {
        this.#card_id = cardID;
        this.#date = date;
        this.#status = status;
    }

    async setAppointment() {
        const query = 'INSERT INTO appointment (card_id, date, status) VALUES (?, ?, ?)';
        try {
            const result = await mysqlConnection.query(query, [
                this.#card_id,
                this.#date,
                this.#status,
            ]);
            return result
        } catch(err) {
            console.error(err);
        }
    }
}

export default Appointment;