import dayjs from 'dayjs';
import { Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DateField } from '@mui/x-date-pickers/DateField';

import { useState } from "react";

import { HealthCheckRating, HealthCheckEntryFormValues } from "../../../types";


interface Props {
  addEntry: (newEntry: HealthCheckEntryFormValues) => void;
}

const AddHealthCheckEntryForm = ({ addEntry }: Props) => {
  const initialEntryFormValues: HealthCheckEntryFormValues = {
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    healthCheckRating: HealthCheckRating.Healthy
  };
  const [newEntry, setNewEntry] = useState<HealthCheckEntryFormValues>({ ...initialEntryFormValues });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    addEntry(newEntry);
    setNewEntry({ ...initialEntryFormValues });
  };

  return (
    <Box>
      <Divider />
      <form
        style={{ display: "flex", flexDirection: "column", paddingTop: 16, paddingBottom: 16 }}
        onSubmit={handleSubmit}
      >  
        <TextField
          required
          sx={{ marginBottom: 1 }}
          label="Description"
          value={newEntry?.description || ""}
          onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
        />
        {/* <TextField
          required
          sx={{ marginBottom: 1 }}
          label="Date"
          value={newEntry?.date || ""}
          onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
        /> */}
        <DateField
          required
          sx={{ marginBottom: 1 }}
          label="Date"
          value={dayjs(newEntry?.date) || dayjs("")}
          onChange={(newValue) => setNewEntry({ ...newEntry, date: newValue?.format("YYYY-MM-DD") || "" })}
        />
        <TextField
          required
          sx={{ marginBottom: 1 }}
          label="Specialist"
          value={newEntry?.specialist || ""}
          onChange={e => setNewEntry({ ...newEntry, specialist: e.target.value })}
        />
        <TextField
          sx={{ marginBottom: 1 }}
          label="Diagnosis Codes"
          value={newEntry?.diagnosisCodes?.join(", ") || ""}
          onChange={e => setNewEntry({ ...newEntry, diagnosisCodes: e.target.value.split(",").map(c => c.trim()) })}
          helperText="Separate codes with a comma"
        />
        <FormControl required>
          <InputLabel id="healthCheckRatingLabel">Health Check Rating</InputLabel>
          <Select
            labelId="healthCheckRatingLabel"
            label="Health Check Rating"
            value={newEntry?.healthCheckRating}
            onChange={e => !isNaN(Number(e.target.value)) && setNewEntry({ ...newEntry, healthCheckRating: e.target.value as HealthCheckRating })}
          >
            <MenuItem value={4} selected>Select a Health Check Rating</MenuItem>
            {["Healthy", "Low Risk", "High Risk", "Critical Risk"].map((rating, i) => (
              <MenuItem key={i} value={i}>{rating}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: "fit-content" }}>
          Confirm Entry
        </Button>
      </form>
      <Divider />
    </Box>
  );
};

export default AddHealthCheckEntryForm;
