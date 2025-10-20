import React from 'react';
import { Typography, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const subjects = ['Math', 'Physics', 'Chemistry', 'Literature', 'History', 'Geography'];

function SubjectsPage() {
  return (
    <div>
      <Typography variant="h5" gutterBottom>Subjects</Typography>
      <Grid container spacing={2}>
        {subjects.map((subj) => (
          <Grid item xs={6} sm={4} md={3} key={subj}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Link to={`/subjects/${subj.toLowerCase()}`}>{subj}</Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default SubjectsPage;