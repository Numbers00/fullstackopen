import MasksIcon from '@mui/icons-material/Masks';
import { Box, Divider, Typography } from '@mui/material';

import { Diagnosis, OccupationalHealthcareEntry } from "../../../types";


const OccupationalHealthcareEntryDetails: React.FC<{ diagnoses: Diagnosis[], entry: OccupationalHealthcareEntry }> = ({ diagnoses, entry }) => {
  return (
    <Box mb={1}>
      <Box display="flex">
        <MasksIcon />
        <Typography variant="body1"><b>{ entry.date }</b> { entry.description }</Typography>
      </Box>
      {diagnoses && (
        <ul>
          {diagnoses.map((d, j) => (
            <li key={j}>{ d.code } { d.name }</li>
          ))}
        </ul>
      )}
      {entry.sickLeave
        && <Typography variant="body1"><b>Sick Leave:</b> { entry.sickLeave.startDate } to { entry.sickLeave.endDate }</Typography>
      }
      <Typography variant="body1">Diagnosis by { entry.specialist }</Typography>
      <Divider />
    </Box>
  );
};

export default OccupationalHealthcareEntryDetails;
