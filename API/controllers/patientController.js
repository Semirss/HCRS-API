import Patient from "../models/patientModel.js";
// import jwt from 'jsonwebtoken';
import MeidcalCard from "../models/medicalCardModel.js";
import QueueMgt from "../models/queueMgtModel.js";

export const registerPatient = async (req, res) => {
    const { name, email, address, phoneNumber } = req.body;
    try {
      const patient = new Patient({ name, email, address, phoneNumber });
      const result = await patient.registerPatient();
      if (!result) {
        return res.status(404).json({ success: false, message: "Patient not Found" });
      }

      const patient_id = result[0].insertId;
      const { history, date } = req.body;
			const card = new MeidcalCard({ patientID: patient_id, history, date, name });
			const cardResult = await card.setCard();

			if (!cardResult) {
        return res.status(404).json({ success: false, message: 'Card not Found' });
			}

			const cardId = cardResult[0].insertId;
			if (!cardId) {
				console.log("Id not found");
        return res.status(500).json({ success: false, message: "Failed to retrieve card ID" });
			}
      const fetchCardByID = await card.fetchCardByID(cardId);

      const patientCard = fetchCardByID[0];
      if (!patientCard) {
        return res.status(404).json({ success: false, message: "Patient card not Found" });
      }

      const { status } = patientCard;
      const queue = new QueueMgt({ cardId, date, status });
      const queueResult = queue.setToQueue();

      if (!queueResult) {
        // 400 - bad request
        return res.status(400).json({ success: false, message: "Invalid data" });
      }
      return res.status(201).json({ success: true, message: 'Patient registered, card inserted and added to queue' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}