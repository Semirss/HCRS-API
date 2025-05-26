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
  