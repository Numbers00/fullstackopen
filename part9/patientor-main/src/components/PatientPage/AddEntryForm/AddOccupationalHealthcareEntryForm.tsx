import dayjs from "dayjs";
import { Box, Button, Divider, TextField } from "@mui/material";
import { DateField } from "@mui/x-date-pickers/DateField";

import { useState } from "react";

import { OccupationalHealthcareEntryFormValues } from "../../../types";


interface Props {
  addEntry: (newEntry: OccupationalHealthcareEntryFormValues) => void;
}

const AddOccupationalHealthcareEntryForm = ({ addEntry }: Props) => {
  const initialEntryFormValues: OccupationalHealthcareEntryFormValues = {
    type: "OccupationalHealthcare",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    employerName: "",
    sickLeave: undefined
  };
  const [newEntry, setNewEntry] = useState<OccupationalHealthcareEntryFormValues>({ ...initialEntryFormValues });

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
        <Box display="flex" justifyContent="space-between">
          {/* <TextField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Sick Leave Start Date"
            value={newEntry?.sickLeave?.startDate || ""}
            onChange={e => setNewEntry({ ...newEntry, sickLeave: { startDate: e.target.value, endDate: newEntry.sickLeave?.endDate || "" } })}
          />
          <TextField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Sick Leave End Date"
            value={newEntry?.sickLeave?.endDate || ""}
            onChange={e => setNewEntry({ ...newEntry, sickLeave: { startDate: newEntry.sickLeave?.startDate || "", endDate: e.target.value } })}
          /> */}
          <DateField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Sick Leave Start Date"
            value={dayjs(newEntry?.sickLeave?.startDate) || dayjs("")}
            onChange={(newValue) => setNewEntry({ ...newEntry, sickLeave: { startDate: newValue?.format("YYYY-MM-DD") || "", endDate: newEntry.sickLeave?.endDate || "" } })}
          />
          <DateField
            required
            sx={{ marginBottom: 1, width: "calc(50% - 8px)" }}
            label="Sick Leave End Date"
            value={dayjs(newEntry?.sickLeave?.endDate) || dayjs("")}
            onChange={(newValue) => setNewEntry({ ...newEntry, sickLeave: { startDate: newEntry.sickLeave?.startDate || "", endDate: newValue?.format("YYYY-MM-DD") || "" } })}
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

export default AddOccupationalHealthcareEntryForm;
