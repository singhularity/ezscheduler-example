import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { Schedule } from 'ezscheduler';
import { format, parseISO } from 'date-fns';

interface ScheduleInfoProps {
  schedule: Schedule | null;
}

const ScheduleInfo: React.FC<ScheduleInfoProps> = ({ schedule }) => {
  if (!schedule) return null;

  const formatDate = (date: string) => {
    return format(parseISO(date), 'MMM d, yyyy');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Paper elevation={0} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          {schedule.scheduleName || 'Untitled Schedule'}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {schedule.scheduleDetails.map((detail, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {detail.title || `Slot ${index + 1}`}
                </Typography>

              </Box>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#f6f8fa', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {formatDate(detail.startDate)} {formatTime(detail.startTime)} - {formatTime(detail.endTime)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ScheduleInfo;
