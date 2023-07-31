import { v1 as uuid } from 'uuid';

import patients from '../data/patients';

import { Entry, NewEntry, Patient, NonSensitivePatient, NewPatient } from '../types';


const getPatients = (): Patient[] => {
  return patients;
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addEntry = (patientId: string, entry: NewEntry): Entry => {
  const patient = patients.find(patient => patient.id === patientId);
  if (!patient) throw new Error(`Patient with id ${patientId} not found`);

  const newEntry = {
    ...entry,
    id: uuid()
  };
  patient.entries.push(newEntry);
  return newEntry;
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuid()
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients, getPatient, getNonSensitivePatients,
  addEntry, addPatient
};
