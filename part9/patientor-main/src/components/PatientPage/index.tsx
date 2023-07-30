import { Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import patientService from "../../services/patients";

import { Patient } from "../../types";

const PatientPage = () => {
  const { id } = useParams<{ id: string | undefined }>();

  const [patient, setPatient] = useState<Patient>();

  const fetchPatient = async () => {
    if (!id) return;

    const patient = await patientService.get(id);
    setPatient(patient);
  };

  useEffect(() => {
    void fetchPatient();
  }, []);

  if (!patient) return null;

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h4">{ patient.name }</Typography>
        <MaleIcon fontSize="large" />
      </div>
      <Typography variant="body1">ssn: { patient.ssn }</Typography>
      <Typography variant="body1">occupation: { patient.occupation }</Typography>
    </div>
  );
};

export default PatientPage;
