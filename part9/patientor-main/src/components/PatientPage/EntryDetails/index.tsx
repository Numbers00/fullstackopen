import HealthCheckEntryDetails from "./HealthCheckEntryDetails";
import HospitalEntryDetails from "./HospitalEntryDetails";
import OccupationalHealthcareEntryDetails from "./OccupationalHealthcareEntryDetails";

import { useEffect, useState } from "react";

import diagnosisService from "../../../services/diagnoses";

import { Diagnosis, Entry } from "../../../types";
import { assertNever } from "../../../utils";


const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const fetchRelevantDiagnoses = async () => {
    const diagnosisCodes = entry.diagnosisCodes;
    if (!diagnosisCodes?.length) return;
    
    const diagnoses = await diagnosisService.getByCode(diagnosisCodes);
    setDiagnoses(diagnoses);
  };

  useEffect(() => {
    void fetchRelevantDiagnoses();
  }, []);

  switch (entry.type) {
  case "HealthCheck":
    return <HealthCheckEntryDetails diagnoses={diagnoses} entry={entry} />;
  case "Hospital":
    return <HospitalEntryDetails diagnoses={diagnoses} entry={entry} />;
  case "OccupationalHealthcare":
    return <OccupationalHealthcareEntryDetails diagnoses={diagnoses} entry={entry} />;
  default: return assertNever(entry);
  }
};

export default EntryDetails;
