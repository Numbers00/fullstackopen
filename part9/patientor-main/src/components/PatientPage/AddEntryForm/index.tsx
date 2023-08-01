import AddHealthCheckEntryForm from './AddHealthCheckEntryForm';

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
    return null;
  case 'OccupationalHealthcareEntry':
    return null;
  case '':
    return null;
  default:
    throw new Error(`Unhandled AddEntryForm mode: ${visibility}`);
  }
};

export default AddEntryForm;
