import HealthCheckEntryDetails from "./HealthCheckEntryDetails";
import HospitalEntryDetails from "./HospitalEntryDetails";
import OccupationalHealthcareEntryDetails from "./OccupationalHealthcareEntryDetails";

import { Diagnosis, Entry } from "../../../types";
import { assertNever } from "../../../utils";


const EntryDetails: React.FC<{ diagnoses: Diagnosis[], entry: Entry }> = ({ diagnoses, entry }) => {
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
