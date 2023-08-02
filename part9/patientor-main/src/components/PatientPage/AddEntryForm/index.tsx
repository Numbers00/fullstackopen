import AddHealthCheckEntryForm from './AddHealthCheckEntryForm';
import AddHospitalEntryForm from './AddHospitalEntryForm';
import OccupationalHealthcareEntryForm from './AddOccupationalHealthcareEntryForm';

import { EntryFormValues } from '../../../types';


interface Props {
  visibility: string;
  addEntry: (newEntry: EntryFormValues) => void;
};

const AddEntryForm = ({ visibility, addEntry }: Props) => {
  switch (visibility) {
  case 'HealthCheckEntry':
    return <AddHealthCheckEntryForm addEntry={addEntry} />;
  case 'HospitalEntry':
    return <AddHospitalEntryForm addEntry={addEntry} />;
  case 'OccupationalHealthcareEntry':
    return <OccupationalHealthcareEntryForm addEntry={addEntry} />;
  case '':
    return null;
  default:
    throw new Error(`Unhandled AddEntryForm mode: ${visibility}`);
  }
};

export default AddEntryForm;
