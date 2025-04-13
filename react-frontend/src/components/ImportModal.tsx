import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Schedule } from 'ezscheduler';

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (schedule: any) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ show, onClose, onSubmit }) => {
  const [scheduleJson, setScheduleJson] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const importedSchedule = JSON.parse(scheduleJson);

      // Validate the imported schedule
      if (!importedSchedule.scheduleName || !importedSchedule.timeZone) {
        throw new Error('Invalid schedule format: missing required fields');
      }

      // Ensure all schedule details have IDs
      if (importedSchedule.scheduleDetails) {
        importedSchedule.scheduleDetails = importedSchedule.scheduleDetails.map((detail: any) => {
          if (!detail.id) {
            detail.id = 'id_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
          }
          return detail;
        });
      } else {
        importedSchedule.scheduleDetails = [];
      }

      onSubmit(importedSchedule);
      setScheduleJson('');
      setError('');
    } catch (err) {
      console.error('Error importing schedule:', err);
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  if (!show) {
    return null;
  }

  return (
    <Dialog open={show} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Import Schedule from JSON
          <Button
            onClick={onClose}
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
            <Typography variant="body1" color="textSecondary">
              Paste your schedule JSON here:
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={scheduleJson}
            onChange={(e) => setScheduleJson(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Import
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ImportModal;
