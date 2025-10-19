import * as React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar() {
  const events = [
    { id: '1', title: 'Lecture: Intro', date: '2025-10-20' },
    { id: '2', title: 'Assignment 1 Due', date: '2025-11-01' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Calendar
      </Typography>
      <Paper sx={{ p: 2, maxWidth: 1000 }}>
        <FullCalendar plugins={[dayGridPlugin, interactionPlugin]} initialView="dayGridMonth" events={events} height="auto" />
      </Paper>
    </Box>
  );
}
