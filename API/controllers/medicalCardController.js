import MedicalCard from "../models/medicalCardModel.js";
import mysqlConnection from "../config/db.js";

export const getAllCards = async (req, res) => {
  try {
    const card = new MedicalCard();
    const result = await card.fetchAllCards();
    if (!result || !result[0]) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }
    res.status(200).json({ success: true, message: 'Cards fetched successfully', data: result[0] });
  } catch (err) {
    console.error('Error in getAllCards:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const getCardByID = async (req, res) => {
  const card_id = parseInt(req.params.card_id);
  try {
    const card = new MedicalCard();
    const result = await card.fetchCardByID(card_id);
    if (!result || !result[0] || !result[0][0]) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }
    const cardData = result[0][0];
    console.log('Card data fetched:', cardData);
    res.status(200).json({ success: true, message: 'Card fetched successfully', data: cardData });
  } catch (err) {
    console.error('Error in getCardByID:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const addFindingsToHistory = async (req, res) => {
  const card_id = parseInt(req.params.card_id);
  let { new_findings, prescribed } = req.body;
  try {
    console.log('addFindingsToHistory raw body:', req.body);
    // Handle nested nameValuePairs
    if (req.body.nameValuePairs) {
      new_findings = req.body.nameValuePairs.new_findings || '';
      prescribed = req.body.nameValuePairs.prescribed || '';
    }
    console.log('Parsed new_findings:', new_findings, 'prescribed:', prescribed);

    const card = new MedicalCard();
    // Validate input
    if (!new_findings && !prescribed) {
      return res.status(400).json({ success: false, message: 'New findings or prescribed treatment required' });
    }

    //  this is for Getting history
    const result = await card.fetchCardByID(card_id);
    if (!result || !result[0] || !result[0][0]) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    // Parse the existing history
    let historyArray = result[0][0].history;
    try {
      historyArray = typeof historyArray === 'string' ? JSON.parse(historyArray || '[]') : (Array.isArray(historyArray) ? historyArray : []);
      historyArray = historyArray.filter(item => item && typeof item === 'object' && (item.new_findings || item.prescribed));
    } catch (e) {
      console.error('Error parsing history:', e);
      historyArray = [];
    }

    // i am adding new entry to history
    const newEntry = {
      new_findings: new_findings || '',
      prescribed: prescribed || ''
    };
    if (newEntry.new_findings || newEntry.prescribed) {
      historyArray.push(newEntry);
    }

    // Upd the database
    const updateResult = await card.addNewFindingsToHistory(card_id, historyArray);
    if (!updateResult || updateResult[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Failed to update history' });
    }

    console.log('Updated history:', historyArray);
    res.status(201).json({ success: true, message: 'History added successfully' });
  } catch (err) {
    console.error('Error in addFindingsToHistory:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export const deleteQueue = async (req, res) => {
  const queue_id = parseInt(req.params.queue_id);
  try {
    const query = 'DELETE FROM queue_management WHERE queue_id = ?';
    const [result] = await mysqlConnection.execute(query, [queue_id]);
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Queue item not found' });
    }
    res.status(200).json({ success: true, message: 'Queue item deleted successfully' });
  } catch (err) {
    console.error('Error in deleteQueue:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function fetchCardByID(cardId) {
  const query = 'SELECT * FROM medical_card WHERE card_id = ?';
  try {
    const [result] = await mysqlConnection.execute(query, [cardId]);
    return result;
  } catch (err) {
    console.error('Error in fetchCardByID:', err);
    throw err;
  }
}