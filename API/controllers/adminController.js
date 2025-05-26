import Admin from "../models/adminModel.js";

// hash the password when adding a doctor
export const adminLogin = async (req, res) => {
  // destructure name and password from the request body
  const { name, password } = req.body;

  try {
    const admin = new Admin();
    const adminResult = await admin.login(name);

    if (!adminResult) {
      return res.status(404).json({ success: false, message: "Admin result not found" })
    }

    // if the result length is equivalet to 0, the doctor is not registered
    if (adminResult.length === 0)
      return res.status(404).json({ success: false, message: 'Not Found' });
    

    // get the result data and compare the password destructured before to the result data password
    const adminData = adminResult[0][0];
    const isPasswordValid = password === adminData.password;
    if (!isPasswordValid)
      return res.status(401).json({ success: false, message: "Invalid Password" });

    res.status(200).json({ success: true, message: 'Login success' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}