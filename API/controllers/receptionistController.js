// import bcrypt from 'bcrypt';
import Receptionist from "../models/receptionistModel.js";
import { createHash } from 'crypto';

// hash the password when adding a doctor
export const receptionistLogin = async (req, res) => {
  // destructure name and password from the request body
  const { name, password } = req.body;

  try {
    const receptionist = new Receptionist(name, password);
    const result = await receptionist.login(name);

    if (!result) {
      return res.status(404).json({ success: "false", message: "Not found" })
    }

    // if the result length is equivalet to 0, the doctor is not registered
    if (result.length === 0)
      return res.status(404).json({ success: false, message: 'Receptionist not found' });
    
    const receptionistPwd = result[0][0];
    const isPasswordValid = password === receptionistPwd.password;
    if (!isPasswordValid)
      return res.status(401).json({ success: false, message: "Invalid Password" });

    res.status(200).json({ success: true, message: 'Login success' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getAllReceptionists = async (req, res) => {
  try {
      const receptionist = new Receptionist();
      const result = await receptionist.fetchAllReceptionists();
      if (!result) {
        return res.status(404).json({ success: false, message: 'Not Found' });
      }
      res.status(200).json({ success: true, data: result[0], message: 'Receptionists fetched successfully' });
  } catch(err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const addReceptionist = async (req, res) => {
  const { name, email, address, phoneNumber, password } = req.body;
  try {
      const receptionist = new Receptionist({ name, email, address, phoneNumber, password });
      const result = await receptionist.addReceptionist();
      if (!result) {
        return res.status(404).json({ success: false, message: 'Receptionist result not found' });
      }

      const personResult = await receptionist.addPersonToDb();
      if (!personResult) {
        return res.status(404).json({ success: false, message: 'Person result not found' });
      }
      res.status(201).json({ success: true, message: 'Receptionist added' });
  } catch(err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


export const updateReceptionist = async (req, res) => {
  const receptionist_id = req.params.receptionist_id;
  const { name, email, address, phoneNumber, password } = req.body;
  try {
      const receptionist = new Receptionist({ name, email, address, phoneNumber, password});
      const result = await receptionist.updateReceptionist(receptionist_id);
      if (!result || result[0].affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Receptionist not found' });
      }
      res.status(200).json({ success: true, message: 'Receptionist updated' });
  } catch(err) {
      console.error('Error updating receptionist:', err.message, err.stack);
      res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
}
export const deleteReceptionist = async (req, res) => {
  const receptionist_id = req.params.receptionist_id;
  try {
      const receptionist = new Receptionist();
      const result = await receptionist.deleteReceptionist(receptionist_id);
      if (!result) {
        return res.status(404).json({ success: false, message: 'Not Found' });
      }
      res.status(200).json({ success: true, message: 'Receptionist deleted' });
  } catch(err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
}