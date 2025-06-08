import mysqlConnection from '../config/db.js';
import Person from '../models/personModel.js';

export const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name and password are required' });
    }
    const person = new Person(name, null, null, null, password);
    const result = await person.login(name, password);
    if (!result.success) {
      return res.status(result.message === 'User not found' ? 404 : 401).json(result);
    }
    console.log('Login response for user', { name, data: result.data });
    res.status(200).json({ success: true, message: 'Login success', data: result.data });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};

export const getDoctorId = async (req, res) => {
  const { name, role } = req.query;
  console.log('Received name:', name, 'role:', role);

  try {
    if (!name || !role) {
      return res.status(400).json({ success: false, message: "Name and role are required" });
    }

    if (role.toLowerCase() !== 'doctor') {
      return res.status(400).json({ success: false,
        message: 'Invalid role, must be doctor' });
    }

    const query = 'SELECT doctor_id FROM doctor WHERE name = ?';
    const [rows] = await mysqlConnection.query(query, [name]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      data: rows[0].doctor_id,
      doctor_id: rows[0].doctor_id,
      message: 'Doctor ID fetched successfully',
    });
  } catch (err) {
    console.error('Error in getDoctorId:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};