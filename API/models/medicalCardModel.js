import mysqlConnection from "../config/db.js";

class MeidcalCard {
  #patient_id;
  #name;
  #history;
  #date;

  constructor ({ patientID=null, name=null, history=null, date=null }={}) {
    this.#patient_id = patientID;
    this.#name = name;
    this.#history = history;
    this.#date = date;
  }

  async fetchAllCards() {
    const query = 'select card_id, patient_id, name, date from medical_card';
    try {
        const result = await mysqlConnection.query(query);
        return result
    } catch(err) {
        console.error(err);
    }
  }

  async getHistory(cardID) {
    const query = 'select history from medical_card where card_id = ?';
    try {
        const result = await mysqlConnection.query(query, cardID);
        return result
    } catch(err) {
        console.error(err);
    }
  }

  async addNewFindingsToHistory(id, historyArray) {
    const query = "UPDATE medical_card SET history = ? WHERE card_id = ?";
    try {
      const result = await mysqlConnection.query(query, [JSON.stringify(historyArray), id]);
      return result
    } catch(err) {
      console.error(err);
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
    } catch(err) {
        console.error(err);
    }
  }
  
  async fetchCardByID(cardID) {
    const query = 'SELECT * FROM medical_card WHERE card_id = ?'
    try {
      const result = await mysqlConnection.query(query, cardID);
      return result;
    } catch(err) {
      console.error(err);
    }
  }
}

export default MeidcalCard