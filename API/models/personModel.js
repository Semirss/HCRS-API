import mysqlConnection from "../config/db.js";
import { createHash } from 'crypto';
class Person {
  name;
  email;
  address;
  phone_number;
  password;
  role;

 
constructor(name, email = null, address = null, phoneNumber = null, password, role = null) {
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone_number = phoneNumber;
    this.password = password;
    this.role = role;
  }

  async login(name, password) {
    const query = 'SELECT person_id, name, role, password FROM person WHERE name = ?';
    try {
      const [rows] = await mysqlConnection.query(query, [name]);
      if (rows.length === 0) {
        console.log('Login failed: User not found for name:', name);
        return { success: false, message: 'User not found' };
      }
      const user = rows[0];
      const hashedPassword = createHash('sha256').update(password).digest('base64').slice(0, 50);
      console.log('Login attempt:', {
        name,
        inputPassword: password,
        hashedInput: hashedPassword,
        storedPassword: user.password
      });
      if (hashedPassword !== user.password && password !== user.password) {
        console.log('Login failed: Password mismatch for name:', name);
        return { success: false, message: 'Invalid password' };
      }
      console.log('Login success for name:', name, 'Role:', user.role);
      return { success: true, data: { person_id: user.person_id, name: user.name, role: user.role } };
    } catch (err) {
      console.error('Login error:', err.message, err.stack);
      throw err;
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