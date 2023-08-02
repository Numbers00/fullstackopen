import axios from 'axios';
import { Alert, Box, Button, Typography } from '@mui/material';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import AddEntryForm from "./AddEntryForm";
import EntryDetails from "./EntryDetails";

import patientService from "../../services/patients";

import { EntryFormValues, Patient } from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const [addEntryFormVisibility, setAddEntryFormVisibility] = useState<'' | 'HealthCheckEntry' | 'HospitalEntry' | 'OccupationalHealthcareEntry'>('');
  const [error, setError] = useState<string | undefined>();
  const [patient, setPatient] = useState<Patient>();

  const fetchPatient = async () => {
    if (!id) return;

    const patient = await patientService.get(id);
    setPatient(patient);
  };

  useEffect(() => {
    void fetchPatient();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAddEntryForm = (mode: string) => {
    if (mode === addEntryFormVisibility)
      setAddEntryFormVisibility('');
    else if (mode === 'HealthCheckEntry' || mode === 'HospitalEntry' || mode === 'OccupationalHealthcareEntry')
      setAddEntryFormVisibility(mode);
  };

  const addEntry = async (newEntry: EntryFormValues) => {
    if (!id || !(newEntry.type === 'HealthCheck' || newEntry.type === 'Hospital' || newEntry.type === 'OccupationalHealthcare')) return;

    try {
      await patientService.addEntry(id, newEntry);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          console.error("Unrecognized axios error");
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error");
        setError("Unknown error");
      }

      setTimeout(() => setError(undefined), 5000);
    }
  };

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
      <Box my={2} display="flex">
        <Button variant="contained" color="primary" onClick={() => toggleAddEntryForm('HealthCheckEntry')} sx={{ mr: 2 }}>
          Add Health Check Entry
        </Button>
        <Button variant="contained" color="primary" onClick={() => toggleAddEntryForm('HospitalEntry')} sx={{ mr: 2 }}>
          Add Hospital Entry
        </Button>
        <Button variant="contained" color="primary" onClick={() => toggleAddEntryForm('OccupationalHealthcareEntry')}>
          Add Occupational Healthcare Entry
        </Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm visibility={addEntryFormVisibility} addEntry={addEntry} />
      <Box>
        <Typography variant="h5">entries</Typography>
        {patient.entries && patient.entries.map((e, i) => (
          <EntryDetails key={i} entry={e} />
        ))}
      </Box>
    </Box>
  );
};

export default PatientPage;
