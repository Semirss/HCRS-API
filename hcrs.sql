use db;

-- Tables
CREATE TABLE patient (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    address TEXT,
    phone_number VARCHAR(15)
);

CREATE TABLE doctor (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    address TEXT,
    phone_number VARCHAR(15),
	specialization VARCHAR(50),
    password VARCHAR(50),
);

CREATE TABLE receptionist (
    receptionist_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
    email VARCHAR(100) UNIQUE,
    address TEXT,
    phone_number VARCHAR(15).
    password VARCHAR(50)
);

CREATE TABLE admin (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE,
	password VARCHAR(50)
);

CREATE TABLE  medical_card (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    history JSON,
    date DATETIME,
    name VARCHAR(100),
	FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE
);

CREATE TABLE appointment (
    apointment_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT,
    date DATETIME,
	status BOOlEAN,
	FOREIGN KEY (card_id) REFERENCES medical_card(card_id) ON DELETE CASCADE
);


CREATE TABLE queue_management (
    queue_id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT,
    date DATETIME,
	status BOOlEAN,
	FOREIGN KEY (card_id) REFERENCES medical_card(card_id) ON DELETE CASCADE
);


-- Querys
insert into admin (name, password) values ('admin', 'admin');