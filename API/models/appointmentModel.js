import mysqlConnection from "../config/db.js";

class Appointment {
  #card_id;
  #date;
  #status;
  #doctor_id;

  constructor({ cardID = null, date = null, status = null, doctorID = null } = {}) {
    this.#card_id = cardID;
    this.#date = date;
    this.#status = status;
    this.#doctor_id = doctorID;
  }

  async setAppointment() {
    const query = 'INSERT INTO appointment (card_id, date, status, doctor_id) VALUES (?, ?, ?, ?)';
    try {
      const result = await mysqlConnection.query(query, [
        this.#card_id,
        this.#date,
        this.#status,
        this.#doctor_id,
      ]);
      return result;
    } catch (err) {
      console.error('Error in setAppointment:', err);
      throw err;
    }
  }

  async getAppointmentByCardID(cardID) {
    const query = 'SELECT * FROM appointment WHERE card_id = ?';
    try {
      const result = await mysqlConnection.query(query, [cardID]);
      return result;
    } catch (err) {
      console.error('Error in getAppointmentByCardID:', err);
      throw err;
    }
  }

  async getAppointmentByDoctorID(doctorID) {
    const query = 'SELECT * FROM appointment WHERE doctor_id = ?';
    try {
      const result = await mysqlConnection.query(query, [doctorID]);
      return result;
    } catch (err) {
      console.error('Error in getAppointmentByDoctorID:', err);
      throw err;
    }
  }
}

export default Appointment;