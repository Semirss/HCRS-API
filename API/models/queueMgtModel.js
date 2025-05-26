import mysqlConnection from "../config/db.js";

class QueueMgt {
  #cardId;
  #date;
  #status;

  constructor ({ cardId=null, date=null, status=null }={}) {
    this.#cardId= cardId;
    this.#date = date;
    this.#status = status;
  }

  async setToQueue() {
    const query = 'INSERT INTO queue_management (card_id, date, status) VALUES (?, ?, ?)';
    try {
      const results = await mysqlConnection.query(query, [
          this.#cardId,
          this.#date,
          this.#status,
      ]);
      return results
    } catch(err) {
      console.error(err);
    }
  }

  async getQueue() {
    const query = 'select * from queue_management';
    try {
      const result = await mysqlConnection.query(query);
      return result
    } catch(err) {
      console.error(err);
    }
  }
}

export default QueueMgt