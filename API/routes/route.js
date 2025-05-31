// routes/route.js
import express from 'express';
import { registerPatient ,getPatientByCardID} from '../controllers/patientController.js';
import {
    addDoctor, deleteDoctor, doctorLogin, getAllDoctors,
   updateDoctor
} from '../controllers/doctorController.js';
import {
    addFindingsToHistory, getAllCards, getCardByID,deleteQueue
} from '../controllers/medicalCardController.js';
import { getQueueMgt } from '../controllers/queueMgtController.js';
import {
    addReceptionist, deleteReceptionist, getAllReceptionists,
    receptionistLogin, updateReceptionist
} from '../controllers/receptionistController.js';
import { adminLogin } from '../controllers/adminController.js';
import { login } from '../controllers/authController.js';
import {  setAppointment, getAppointment,getAppointmentByDoctorID,getQueueByDoctorID, getAllQueue } from '../controllers/appointmentController.js';
import { getDoctorId } from '../controllers/authController.js';
const router = express.Router();
//login 
router.post('/login', login);
router.get('/user/doctor_id', getDoctorId);
router.get('/patient/:card_id', getPatientByCardID);
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
router.get('/queue/doctor/:doctor_id', getQueueByDoctorID);
router.get('/queue', getAllQueue);
router.delete('/queue/:queue_id', deleteQueue);
// Appointments
router.post('/setAppointment/:patient_id', setAppointment);
router.get('/appointment/:card_id', getAppointment);
router.get('/appointments/doctor/:doctor_id', getAppointmentByDoctorID);

export default router;
