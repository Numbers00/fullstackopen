import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { Box, Divider, Typography } from '@mui/material';

import { Diagnosis, HealthCheckRating, HealthCheckEntry } from "../../../types";


const HealthCheckEntryDetails: React.FC<{ diagnoses: Diagnosis[], entry: HealthCheckEntry }> = ({ diagnoses, entry }) => {
  return (
    <Box mb={1}>
      <Box display="flex">
        <HealthAndSafetyIcon />
        <Typography variant="body1"><b>{ entry.date }</b> { entry.description }</Typography>
      </Box>
      {diagnoses && (
        <ul>
          {diagnoses.map((d, j) => (
            <li key={j}>{ d.code } { d.name }</li>
          ))}
        </ul>
      )}
      <Typography variant="body1"><b>Health Check Rating:</b> { HealthCheckRating[entry.healthCheckRating] }</Typography>
      <Typography variant="body1">Diagnosis by { entry.specialist }</Typography>
      <Divider />
    </Box>
  );
};

export default HealthCheckEntryDetails;
