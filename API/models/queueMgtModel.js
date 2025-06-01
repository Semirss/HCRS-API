import mysqlConnection from "../config/db.js";

class QueueMgt {
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

  async setToQueue() {
    const query = 'INSERT INTO queue_management (card_id, date, status, doctor_id) VALUES (?, ?, ?, ?)';
    try {
      console.log('QueueMgt values:', {
        card_id: this.#card_id,
        date: this.#date,
        status: this.#status,
        doctor_id: this.#doctor_id,
      });
      const results = await mysqlConnection.query(query, [
        this.#card_id,
        this.#date,
        this.#status,
        this.#doctor_id,
      ]);
      return results;
    } catch (err) {
      console.error('Error in setToQueue:', err);
      throw err;
    }
  }

  async getQueue() {
    const query = 'SELECT * FROM queue_management';
    try {
      const result = await mysqlConnection.query(query);
      return result;
    } catch (err) {
      console.error('Error in getQueue:', err);
      throw err;
    }
  }

  async getQueueByDoctorID(doctorID) {
    const query = 'SELECT * FROM queue_management WHERE doctor_id = ?';
    try {
      const result = await mysqlConnection.query(query, [doctorID]);
      return result;
    } catch (err) {
      console.error('Error in getQueueByDoctorID:', err);
      throw err;
    }
  }
async getQueueByPatientID(patientID) {
    const query = `
      SELECT q.queue_id, q.card_id, q.date, q.status, q.doctor_id, d.name AS doctor_name
      FROM queue_management q
      INNER JOIN medical_card m ON q.card_id = m.card_id
      INNER JOIN doctor d ON q.doctor_id = d.doctor_id
      WHERE m.patient_id = ?
    `;
    try {
      console.log('Fetching queue for patient_id:', patientID);
      const result = await mysqlConnection.query(query, [patientID]);
      return result;
    } catch (err) {
      console.error('Error in getQueueByPatientID:', err);
      throw err;
    }
}
}
export default QueueMgt;