import Doctor from "../models/doctorModel.js";

export const doctorLogin = async (req, res) => {
  const { name, password } = req.body;

  try {
    const doctor = new Doctor({ name, password });
    const result = await doctor.login(name);

    if (!result) {
      return res.status(404).json({ success: "false", message: "Not found" })
    }

    if (result.length === 0)
      return res.status(404).json({ success: false, message: 'Not registered' });
    

    const doctorPwd = result[0][0];
    const isPasswordValid = password === doctorPwd.password;
    if (!isPasswordValid)
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
