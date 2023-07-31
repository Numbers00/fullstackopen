import { Box, Button, Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import EntryDetails from "./EntryDetails";

import diagnosisService from "../../services/diagnoses";
import patientService from "../../services/patients";

import { Diagnosis, Entry, Patient } from "../../types";
import { isString } from '../../utils';

const PatientPage = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [patient, setPatient] = useState<Patient>();

  const fetchPatient = async () => {
    if (!id) return;

    const patient = await patientService.get(id);
    setPatient(patient);
  };

  useEffect(() => {
    void fetchPatient();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRelevantDiagnoses = async (entries: Entry[]) => {
    const diagnosisCodes = entries.map(e => e.diagnosisCodes).flat().filter(isString);
    const diagnoses = await diagnosisService.getByCode(diagnosisCodes);
    setDiagnoses(diagnoses);
  };

  useEffect(() => {
    if (patient)
      void fetchRelevantDiagnoses(patient.entries);
  }, [patient]);

  if (!patient) return null;

  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center">
        <Typography variant="h4">{ patient.name }</Typography>
        {patient.gender === "male"
          ? <MaleIcon fontSize="large" />
          : patient.gender === "female"
            ? <FemaleIcon fontSize="large" />
            : null}
      </Box>
      <Typography variant="body1">ssn: { patient.ssn }</Typography>
      <Typography variant="body1">occupation: { patient.occupation }</Typography>
      <Box mb={2}>
        <Typography variant="h5">entries</Typography>
        {patient.entries && patient.entries.map((e, i) => (
          <EntryDetails key={i} entry={e} diagnoses={diagnoses} />
        ))}
      </Box>
      <Button variant="contained" color="primary">
        Add Entry
      </Button>
    </Box>
  );
};

export default PatientPage;
