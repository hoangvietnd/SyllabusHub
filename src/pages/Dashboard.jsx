import * as React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

export default function Dashboard() {
  const stats = [
    { label: 'Courses', value: 24, icon: <SchoolIcon fontSize="large" /> },
    { label: 'Students', value: 132, icon: <PeopleIcon fontSize="large" /> },
    { label: 'Assignments', value: 48, icon: <AssignmentIcon fontSize="large" /> },
  ];

  const pieData = [
    { id: 0, value: 60, label: 'Completed' },
    { id: 1, value: 25, label: 'In Progress' },
    { id: 2, value: 15, label: 'Pending' },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} sm={4} key={item.label}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box sx={{ color: '#2563eb' }}>{item.icon}</Box>
                <Typography variant="h6">{item.label}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Course Completion Rate
        </Typography>
        <PieChart
          series={[
            {
              data: pieData,
              innerRadius: 40,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
            },
          ]}
          width={400}
          height={250}
        />
      </Box>
    </Box>
  );
}
