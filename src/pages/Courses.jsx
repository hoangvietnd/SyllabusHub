import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Button, useTheme } from '@mui/material';

export default function Courses() {
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Course Name', width: 200 },
    { field: 'teacher', headerName: 'Teacher', width: 180 },
    { field: 'students', headerName: 'Students', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color={params.value === 'Active' ? 'success' : 'warning'}
          size="small"
        >
          {params.value}
        </Button>
      ),
    },
  ];

  const rows = [
    { id: 1, name: 'Intro to Programming', teacher: 'John Doe', students: 45, status: 'Active' },
    { id: 2, name: 'Data Structures', teacher: 'Jane Smith', students: 30, status: 'Active' },
    { id: 3, name: 'Web Development', teacher: 'Chris Evans', students: 50, status: 'Inactive' },
    { id: 4, name: 'Database Design', teacher: 'Emma Watson', students: 28, status: 'Active' },
  ];

  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Courses Management
      </Typography>
      <Box sx={{ width: '100%', maxWidth: 1200 }}>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            sx={{ border: `1px solid ${theme.palette.divider}` }}
            autoHeight={false}
          />
        </Box>
      </Box>
    </Box>
  );
}
