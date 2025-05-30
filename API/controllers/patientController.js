import Patient from "../models/patientModel.js";
import MedicalCard from "../models/medicalCardModel.js";

export const registerPatient = async (req, res) => {
  const { name, email, address, phoneNumber, history = {}, date = new Date() } = req.body; // Default history and date
  try {
    // Register patient
    const patient = new Patient({ name, email, address, phoneNumber });
    const patientResult = await patient.registerPatient();
    if (!patientResult || patientResult[0].affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to register patient" });
    }

    const patientID = patientResult[0].insertId;

    // Create medical card
    const card = new MedicalCard({ patientID, history: JSON.stringify(history), date, name });
    const cardResult = await card.setCard();
    if (!cardResult || cardResult[0].affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Failed to create medical card" });
    }

    const cardID = cardResult[0].insertId;
    if (!cardID) {
      console.error("Medical card ID not found");
      return res.status(500).json({ success: false, message: "Failed to retrieve medical card ID" });
    }

    // Verify medical card
    const fetchCard = await card.fetchCardByID(cardID);
    if (!fetchCard || fetchCard[0].length === 0) {
      return res.status(404).json({ success: false, message: "Medical card not found after creation" });
    }

    return res.status(201).json({ success: true, message: "Patient registered and medical card created" });
  } catch (err) {
    console.error("Error in registerPatient:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export const getPatientByCardID = async (req, res) => {
  const cardID = req.params.card_id;
  try {
    if (!cardID) {
      return res.status(400).json({ success: false, message: "card_id is required" });
    }

    const query = `
      SELECT p.patient_id, p.name
      FROM patient p
      JOIN medical_card mc ON p.patient_id = mc.patient_id
      WHERE mc.card_id = ?
    `;
    const [rows] = await mysqlConnection.query(query, [cardID]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
      message: "Patient fetched successfully",
    });
  } catch (err) {
    console.error("Error in getPatientByCardID:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};