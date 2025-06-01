import mysqlConnection from "../config/db.js";
import Person from "./personModel.js";

class Patient extends Person {
    constructor({ name, email = null, address = null, phoneNumber = null, password = null }) {
        if (!name) {
            throw new Error('Name is required for Patient');
        }
        super({ name, email, address, phoneNumber, password, role: 'patient' });
    }

    async registerPatient() {
        const query = 'INSERT INTO patient (name, email, address, phone_number, password) VALUES (?, ?, ?, ?, ?)';
        try {
            const result = await mysqlConnection.query(query, [
                this.name,
                this.email,
                this.address,
                this.phone_number,
                this.password // Store plain-text password
            ]);
            return result;
        } catch (err) {
            console.error("Database error registering patient:", err);
            throw err;
        }
    }
}

export default Patient;

export const registerPatient = async (req, res) => {
    const { name, email, address, phoneNumber, history = {}, date = new Date(), password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, email, and password are required" });
        }

        const patient = new Patient({ name, email, address, phoneNumber, password });
        const patientResult = await patient.registerPatient();
        if (!patientResult || patientResult[0].affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to register patient" });
        }

        const patientID = patientResult[0].insertId;

        const personResult = await patient.addPersonToDb();
        if (!personResult || personResult[0].affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Failed to add patient to person table" });
        }

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

        const fetchCard = await card.fetchCardByID(cardID);
        if (!fetchCard || fetchCard[0].length === 0) {
            return res.status(404).json({ success: false, message: "Medical card not found after creation" });
        }

        return res.status(201).json({ success: true, message: "Patient registered, added to person table, and medical card created" });
    } catch (err) {
        console.error("Error in registerPatient:", err);
        res.status(500).json({ success: false, message: "Internal server error", error: err.message });
    }
};