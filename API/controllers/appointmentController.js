import Appointment from "../models/appointmentModel.js";
import QueueMgt from "../models/queueMgtModel.js";
import MedicalCard from "../models/medicalCardModel.js";

export const setAppointment = async (req, res) => {
  const patientID = req.params.patient_id;
  const { date, status, doctor_id } = req.body;
  console.log("Received patientID:", patientID, "doctor_id:", doctor_id);

  try {
    if (!patientID) {
      return res.status(400).json({ success: false, message: "patient_id is required" });
    }
    if (!doctor_id) {
      return res.status(400).json({ success: false, message: "doctor_id is required" });
    }

    const card = new MedicalCard();
    const result = await card.fetchCardByPatientID(patientID);
    console.log("Medical card result:", result);

    if (!result || result[0].length === 0) {
      return res.status(404).json({ success: false, message: "Medical card not found for this patient" });
    }

    const cardID = result[0][0].card_id;

    const appointment = new Appointment({ cardID, date, status, doctorID: doctor_id });
    const appointmentResult = await appointment.setAppointment();
    if (!appointmentResult || appointmentResult[0].affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to set appointment" });
    }

    const queue = new QueueMgt({ cardID, date, status, doctorID: doctor_id });
    const queueResult = await queue.setToQueue();
    if (!queueResult || queueResult[0].affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to add to queue" });
    }

    res.status(201).json({ success: true, message: "Appointment and queue entry created successfully" });
  } catch (err) {
    console.error("Error in setAppointment:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const getAppointmentByDoctorID = async (req, res) => {
  const doctorID = req.params.doctor_id;
  console.log("Received doctorID:", doctorID); // Debug log

  try {
    if (!doctorID) {
      return res.status(400).json({ success: false, message: "doctor_id is required" });
    }

    const appointment = new Appointment();
    const result = await appointment.getAppointmentByDoctorID(doctorID);

    if (!result || result[0].length === 0) {
      return res.status(404).json({ success: false, message: "No appointments found for this doctor" });
    }

    res.status(200).json({
      success: true,
      data: result[0],
      message: "Appointments fetched successfully",
    });
  } catch (err) {
    console.error("Error in getAppointmentByDoctorID:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getAppointment = async (req, res) => {
  const cardID = req.params.card_id;
  try {
    const appointment = new Appointment();
    const result = await appointment.getAppointmentByCardID(cardID);

    if (!result || result[0].length === 0) {
      return res.status(404).json({ success: false, message: 'No appointment found' });
    }

    res.status(200).json({ success: true, data: result[0], message: 'Appointment fetched successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }}
  
export const getQueueByDoctorID = async (req, res) => {
  const doctorID = req.params.doctor_id;
  console.log("Received doctorID for queue:", doctorID);

  try {
    if (!doctorID) {
      return res.status(400).json({ success: false, message: "doctor_id is required" });
    }

    const queue = new QueueMgt();
    const result = await queue.getQueueByDoctorID(doctorID);

    if (!result || result[0].length === 0) {
      return res.status(404).json({ success: false, message: "No queue entries found for this doctor" });
    }

    res.status(200).json({
      success: true,
      data: result[0],
      message: "Queue entries fetched successfully",
    });
  } catch (err) {
    console.error("Error in getQueueByDoctorID:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllQueue = async (req, res) => {
  try {
    const queue = new QueueMgt();
    const result = await queue.getQueue();

    if (!result || result[0].length === 0) {
      return res.status(404).json({ success: false, message: "No queue entries found" });
    }

    res.status(200).json({
      success: true,
      data: result[0],
      message: "All queue entries fetched successfully",
    });
  } catch (err) {
    console.error("Error in getAllQueue:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const deleteQueue = async (req, res) => {
  const queueID = req.params.queue_id;
  console.log("Received queueID:", queueID);

  try {
    if (!queueID) {
      return res.status(400).json({ success: false, message: "queue_id is required" });
    }

    const queue = new QueueMgt();
    const result = await queue.deleteQueue(queueID);

    if (!result || result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Queue entry not found or already deleted" });
    }

    res.status(200).json({
      success: true,
      message: "Queue entry deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteQueue:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};