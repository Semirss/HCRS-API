import MeidcalCard from "../models/medicalCardModel.js";
// import Patient from "../models/patientModel.js";

export const getAllCards = async (req, res) => {
    // const { email } = req.body;
    try {
			const card = new MeidcalCard();
			const result = await card.fetchAllCards();
			if (!result) {
				return res.status(404).json({ success: false, message: 'Not Found' });
			}
			res.status(200).json({ success: true, data: result[0][0], message: 'Cards fetched successfully' });
    } catch(err) {
			console.error(err);
			res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getCardByID = async (req, res) => {
  const card_id = req.params.card_id;
  try {
    const card = new MeidcalCard();
    const result = await card.fetchCardByID(card_id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Not Found' });
    }
    res.status(200).json({ success: true, data: result[0][0], message: 'Card fetched successfully' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


export const addFindingsToHistory = async(req, res) => {
  const card_id = req.params.card_id;
	const { prescribed, new_findings } = req.body;
  try {
    const card = new MeidcalCard();
    
    // get the history array from the card db
    const result = await card.fetchCardByID(card_id);

    // if (result)
    //   return res.status(404).json({ message:"no data", data: prescribed })

    // parse the result to array because the result comes in json format
    let historyArray = result[0][0].history;
    if (!historyArray)
      return res.status(404).json({ message:"no data", data: historyArray })

    if (!Array.isArray(historyArray)) {
      // make it an array if it's not
      historyArray = [historyArray];
    }
    
    // push new findings and prescribtions in the array
    historyArray.push({
      prescribed: prescribed,
      new_findings: new_findings
    });

    // add the historyArray which holds json format data to history array
    const updateHistory = card.addNewFindingsToHistory(card_id, historyArray);
    if (!updateHistory)
      return res.status(404).json({success: false, message: 'Not Found' });
    res.status(201).json({ success: true, message: 'History added' });
  } catch(err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}