import mysqlConnection from "../config/db.js";

class MedicalCard {
  #patient_id;
  #name;
  #history;
  #date;

  constructor({ patientID = null, name = null, history = null, date = null } = {}) {
    this.#patient_id = patientID;
    this.#name = name;
    this.#history = history;
    this.#date = date;
  }

  async fetchAllCards() {
    const query = 'SELECT card_id, patient_id, name, date FROM medical_card';
    try {
      const result = await mysqlConnection.query(query);
      return result;
    } catch (err) {
      console.error('Error in fetchAllCards:', err);
      throw err; // Rethrow for controller to handle
    }
  }

  async getHistory(cardID) {
    const query = 'SELECT history FROM medical_card WHERE card_id = ?';
    try {
      const result = await mysqlConnection.query(query, [cardID]); // Pass cardID as array
      return result;
    } catch (err) {
      console.error('Error in getHistory:', err);
      throw err;
    }
  }

  async addNewFindingsToHistory(id, historyArray) {
    const query = 'UPDATE medical_card SET history = ? WHERE card_id = ?';
    try {
      const result = await mysqlConnection.query(query, [JSON.stringify(historyArray), id]);
      return result;
    } catch (err) {
      console.error('Error in addNewFindingsToHistory:', err);
      throw err;
    }
  }

  async setCard() {
    const query = 'INSERT INTO medical_card (patient_id, history, date, name) VALUES (?, ?, ?, ?)';
    try {
      const results = await mysqlConnection.query(query, [
        this.#patient_id,
        this.#history,
        this.#date,
        this.#name,
      ]);
      return results;
    } catch (err) {
      console.error('Error in setCard:', err);
      throw err;
    }
  }

  async fetchCardByID(cardID) {
    const query = 'SELECT * FROM medical_card WHERE card_id = ?';
    try {
      const result = await mysqlConnection.query(query, [cardID]); // Pass cardID as array
      return result;
    } catch (err) {
      console.error('Error in fetchCardByID:', err);
      throw err;
    }
  }

  async fetchCardByPatientID(patientID) {
    const query = 'SELECT * FROM medical_card WHERE patient_id = ?';
    try {
      const result = await mysqlConnection.query(query, [patientID]);
      return result;
    } catch (err) {
      console.error('Error in fetchCardByPatientID:', err);
      throw err;
    }
  }
}

export default MedicalCard;