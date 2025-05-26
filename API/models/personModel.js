import mysqlConnection from "../config/db.js";

class Person {
  name;
  email;
  address;
  phone_number;
  password;
  role;

  constructor (name, email=null, address=null, phoneNumber=null, password, role=null) {
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone_number = phoneNumber;
    this.password = password;
    this.role = role;
  }

  async login(name) {
    const query = 'SELECT * FROM person WHERE name = ?';
    try {
      const result = await mysqlConnection.query(query, name);
      return result;
    } catch(err) {
      console.error(err);
    }
  }

  async addPersonToDb() {
    const query = `INSERT INTO person (name, email, address, phone_number, password, role) VALUES (?, ?, ?, ?, ?, ?)`;

    try {
      const result = await mysqlConnection.execute(query, [
        this.name,
        this.email,
        this.address,
        this.phone_number,
        this.password,
        this.role
      ]);
      return result;
    } catch (err) {
      console.error("Database error adding person:", err);
      return false;
    }
  }
}

export default Person