import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface NewScheduleModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onCreateSchedule: (scheduleName: string, timeZone: string) => void;
}

const timeZones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
];

const NewScheduleModal: React.FC<NewScheduleModalProps> = ({ isOpen, onCancel, onCreateSchedule }) => {
  const [scheduleName, setScheduleName] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!scheduleName.trim()) {
      setError('Schedule name is required');
      return;
    }

    onCreateSchedule(scheduleName, timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone);
    onCancel();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Create New Schedule
          <Button
            onClick={onCancel}
            size="small"
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Schedule Name"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              error={!!error}
              helperText={error}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Time Zone</InputLabel>
              <Select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value as string)}
                label="Time Zone"
              >
                {timeZones.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Create Schedule
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewScheduleModal;
