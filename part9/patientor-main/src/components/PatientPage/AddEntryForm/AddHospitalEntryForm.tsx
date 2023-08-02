import dayjs from "dayjs";
import { Box, Button, Divider, TextField } from "@mui/material";
import { DateField } from "@mui/x-date-pickers/DateField";

import { useState } from "react";

import { HospitalEntryFormValues } from "../../../types";


interface Props {
  addEntry: (newEntry: HospitalEntryFormValues) => void;
}

const AddHospitalEntryForm = ({ addEntry }: Props) => {
  const initialEntryFormValues: HospitalEntryFormValues = {
    type: "Hospital",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    discharge: {
      date: "",
      criteria: ""
    }
  };
  const [newEntry, setNewEntry] = useState<HospitalEntryFormValues>({ ...initialEntryFormValues });

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
        <Box display="flex" justifyContent="space-between">
          {/* <TextField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Discharge Date"
            value={newEntry?.discharge.date || ""}
            onChange={e => setNewEntry({ ...newEntry, discharge: { ...newEntry.discharge, date: e.target.value } })}
          /> */}
          <DateField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Discharge Date"
            value={dayjs(newEntry?.discharge.date) || dayjs("")}
            onChange={(newValue) => setNewEntry({ ...newEntry, discharge: { ...newEntry.discharge, date: newValue?.format("YYYY-MM-DD") || "" } })}
          />
          <TextField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Discharge Criteria"
            value={newEntry?.discharge.criteria || ""}
            onChange={e => setNewEntry({ ...newEntry, discharge: { ...newEntry.discharge, criteria: e.target.value } })}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: "fit-content" }}>
          Confirm Entry
        </Button>
      </form>
      <Divider />
    </Box>
  );
};

export default AddHospitalEntryForm;
