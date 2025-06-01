import QueueMgt from "../models/queueMgtModel.js";

export const getQueueMgt = async (req, res) => {
  try {
    const queue = new QueueMgt();
    const result = await queue.getQueue();
    if (!result) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }
    res.status(200).json({ success: true, data: result[0][0], message: 'Queues fetches successfully' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
export const getQueueByPatientID = async (req, res) => {
  const patient_id = parseInt(req.params.patient_id);
  try {
    const queue = new QueueMgt();
    const result = await queue.getQueueByPatientID(patient_id);
    if (!result || !result[0] || result[0].length === 0) {
      return res.status(404).json({ success: false, message: 'No queue items found for patient' });
    }
    res.status(200).json({ success: true, message: 'Queue fetched successfully', data: result[0] });
  } catch (err) {
    console.error('Error in getQueueByPatientID:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};