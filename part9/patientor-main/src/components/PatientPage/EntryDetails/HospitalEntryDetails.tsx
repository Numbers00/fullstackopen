import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { Box, Divider, Typography } from '@mui/material';

import { Diagnosis, HospitalEntry } from "../../../types";


const HospitalEntryDetails: React.FC<{ diagnoses: Diagnosis[], entry: HospitalEntry }> = ({ diagnoses, entry }) => {
  return (
    <Box mb={1}>
      <Box display="flex">
        <LocalHospitalIcon />
        <Typography variant="body1"><b>{ entry.date }</b> { entry.description }</Typography>
      </Box>
      {diagnoses && (
        <ul>
          {diagnoses.map((d, j) => (
            <li key={j}>{ d.code } { d.name }</li>
          ))}
        </ul>
      )}
      <Typography variant="body1"><b>Discharge:</b> { entry.discharge.date } - { entry.discharge.criteria }</Typography>
      <Typography variant="body1">Diagnosis by { entry.specialist }</Typography>
      <Divider />
    </Box>
  );
};

export default HospitalEntryDetails;
