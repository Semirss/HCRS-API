// routes/route.js
import express from 'express';
import { registerPatient } from '../controllers/patientController.js';
import {
    addDoctor, deleteDoctor, doctorLogin, getAllDoctors,
    setAppointment, updateDoctor
} from '../controllers/doctorController.js';
import {
    addFindingsToHistory, getAllCards, getCardByID
} from '../controllers/medicalCardController.js';
import { getQueueMgt } from '../controllers/queueMgtController.js';
import {
    addReceptionist, deleteReceptionist, getAllReceptionists,
    receptionistLogin, updateReceptionist
} from '../controllers/receptionistController.js';
import { adminLogin } from '../controllers/adminController.js';
import { login } from '../controllers/authController.js';

const router = express.Router();
//login 
router.post('/login', login);
// Admin
router.post('/adminLogin', adminLogin);

// Patients
router.post('/registerPatient', registerPatient);

// Doctors
router.post('/doctorLogin', doctorLogin);
router.get('/getDoctors', getAllDoctors);
router.post('/addDoctor', addDoctor);
router.put('/updateDoctor/:doctor_id', updateDoctor);
router.delete('/deleteDoctor/:doctor_id', deleteDoctor);

// Receptionists
router.post('/receptionistLogin', receptionistLogin);
router.get('/getReceptionists', getAllReceptionists);
router.post('/addReceptionist', addReceptionist); 
router.put('/updateReceptionist/:receptionist_id', updateReceptionist);
router.delete('/deleteReceptionist/:receptionist_id', deleteReceptionist);

// Medical Cards
router.get('/getCards', getAllCards);
router.get('/getCardByID/:card_id', getCardByID);
router.post('/addFindings/:card_id', addFindingsToHistory);

// Queue Management
router.get('/getQueues', getQueueMgt);

// Appointments
router.post('/setAppointment/:card_id', setAppointment);

export default router;
