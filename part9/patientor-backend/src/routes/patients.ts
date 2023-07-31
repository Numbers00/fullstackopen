import express from 'express';

import patientService from '../services/patientService';

import { toNewEntry, toNewPatient } from '../utils';


const router = express.Router();
router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatient(req.params.id);
  
  if (patient)
    res.send(patient);
  else
    res.sendStatus(404);
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).send(errorMessage);
  }
});

router.post('/:patientId/entries', (req, res) => {
  try {
    const { patientId } = req.params;
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientService.addEntry(patientId, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).send(errorMessage);
  }
});

export default router;
