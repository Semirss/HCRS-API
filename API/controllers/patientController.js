import Patient from "../models/patientModel.js";
import MedicalCard from "../models/medicalCardModel.js";
import mysqlConnection from "../config/db.js";

export const registerPatient = async (req, res) => {
    const { name, email, address = '', phone_number, history = {}, date = new Date(), password } = req.body;
    console.log('Request Body:', req.body); 
    try {
   
        const patient = new Patient({ name, email, address, phone_number, password });
        const patientResult = await patient.registerPatient();
        if (!patientResult || patientResult[0].affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to register patient" });
        }

        const patientID = patientResult[0].insertId;

        // Add to person is needed because i needed to add patient to person table
        const personResult = await patient.addPersonToDb();
        if (!personResult || personResult[0].affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to add patient to person table" });
        }

        // ofcourse Createing  medical card
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

        // and Verify medical card
        const fetchCard = await card.fetchCardByID(cardID);
        if (!fetchCard || fetchCard[0].length === 0) {
            return res.status(404).json({ success: false, message: "Medical card not found after creation" });
        }

        return res.status(201).json({ success: true, message: "Patient registered, added to person table, and medical card created" });
    } catch (err) {
        console.error("Error in registerPatient:", err);
        res.status(500).json({ success: false, message: `Internal server error: ${err.message}` });
    }
};

export const getAllPatients = async (req, res) => {
    try {
        const query = 'SELECT patient_id, name, email, phone_number FROM patient';
        const [patients] = await mysqlConnection.query(query);
        if (!patients || patients.length === 0) {
            return res.status(404).json({ success: false, message: "No patients found" });
        }
        return res.status(200).json({ success: true, data: patients });
    } catch (err) {
        console.error("Error in getAllPatients:", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
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

export const deletePatient = async (req, res) => {
    const patient_id = req.params.patient_id;
    try {
        const patient = new Patient({ name: 'temp' });
        const result = await patient.deletePatient(patient_id);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};