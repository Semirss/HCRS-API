import Doctor from "../models/doctorModel.js";
// import bcrypt from 'bcrypt';
import MeidcalCard from "../models/medicalCardModel.js";
import Appointment from "../models/appointmentModel.js";
import QueueMgt from "../models/queueMgtModel.js";

// hash the password when adding a doctor
export const doctorLogin = async (req, res) => {
  // destructure name and password from the request body
  const { name, password } = req.body;

  try {
    const doctor = new Doctor({ name, password });
    const result = await doctor.login(name);

    if (!result) {
      return res.status(404).json({ success: "false", message: "Not found" })
    }

    // if the result length is equivalet to 0, the doctor is not registered
    if (result.length === 0)
      return res.status(404).json({ success: false, message: 'Not registered' });
    

    // get the result data and compare the password destructured before to the result data password
    const doctorPwd = result[0][0];
    const isPasswordValid = password === doctorPwd.password;
    if (!isPasswordValid)
      // 401 - unauthorized doctor
      return res.status(401).json({ success: false, message: "Invalid Password" });

    res.status(200).json({ success: true, message: 'Login success' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
export const getAllDoctors = async (req, res) => {
  try {
    const doctor = new Doctor();
    const result = await doctor.fetchAllDoctors();
    if (!result || result[0].length === 0) {
      return res.status(404).json({ success: false, message: 'No doctors found' });
    }
    res.status(200).json({ success: true, data: result[0], message: 'Doctors fetched successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const addDoctor = async (req, res) => {
  const { name, email, address, phoneNumber, specialization, password } = req.body;
  try {
    const doctor = new Doctor({name, email, address, phoneNumber, specialization, password});
    const doctorResult = await doctor.addDoctor();
    if (!doctorResult) {
      return res.status(404).json({ success: false, message: 'Doctor result not found' });
    }

    const personResult = await doctor.addPersonToDb();
    if (!personResult) {
      return res.status(404).json({ success: false, message: 'Person result not found' });
    }
     

    res.status(201).json({ success: true, message: 'Doctor added successfully' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const updateDoctor = async (req, res) => {
  const doctor_id = req.params.doctor_id;
  const { name, email, address, phoneNumber, specialization, password } = req.body;

  try {
    const doctor = new Doctor({
      name,
      email,
      address,
      phoneNumber,
      specialization,
      password
    });

    const result = await doctor.updateDoctor(doctor_id);

    if (!result || result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Doctor not found or no changes made' });
    }

    res.status(200).json({ success: true, message: 'Doctor updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export const deleteDoctor = async (req, res) => {
  const doctor_id = req.params.doctor_id;
  try {
    const doctor = new Doctor();
    const result = await doctor.deleteDoctor(doctor_id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }
    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const setAppointment = async (req, res) => {
  const cardID = req.params.card_id;
  try {
    const card = new MeidcalCard();
    const result = await card.fetchCardByID(cardID);

    if (!result) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }

    const date = result[0][0].date;

    const appointment = new Appointment({ cardID, date });
    const appointmentResult = await appointment.setAppointment();
    if (!appointmentResult) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }

    const queue = new QueueMgt({ cardID, date })
    const queueResult = await queue.setToQueue();
    if (!queueResult) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }

    res.status(201).json({ success: true, message: 'Card added to appointment and queue' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}