import Person from '../models/personModel.js';

export const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    if (!name || !password) {
      return res.status(400).json({ success: false, message: 'Name and password are required' });
    }
    const person = new Person(name, null, null, null, password);
    const result = await person.login(name, password);
    if (!result.success) {
      return res.status(result.message === 'User not found' ? 404 : 401).json(result);
    }
    res.status(200).json({ success: true, message: 'Login success', data: result.data });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
  }
};