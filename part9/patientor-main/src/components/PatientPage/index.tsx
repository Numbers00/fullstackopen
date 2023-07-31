import { Typography } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
    <div style={{ marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="h4">{ patient.name }</Typography>
        <MaleIcon fontSize="large" />
      </div>
      <Typography variant="body1">ssn: { patient.ssn }</Typography>
      <Typography variant="body1">occupation: { patient.occupation }</Typography>
      <div>
        <Typography variant="h5">entries</Typography>
        {patient.entries && patient.entries.map((e, i) => (
          <div key={i}>
            <Typography variant="body1">{ e.date } { e.description }</Typography>
            {diagnoses && (
              <ul>
                {diagnoses.map((d, j) => (
                  <li key={j}>{ d.code } { d.name }</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
