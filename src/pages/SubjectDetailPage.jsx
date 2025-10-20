import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Paper, Box, Button } from '@mui/material';

function SubjectDetailPage() {
  const { subjectId } = useParams();

  const docs = [
    { id: 1, title: 'Lesson 1', desc: 'Introduction' },
    { id: 2, title: 'Lesson 2', desc: 'Advanced topic' },
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Documents for {subjectId}
      </Typography>
      {docs.map((doc) => (
        <Paper key={doc.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1">{doc.title}</Typography>
          <Typography variant="body2">{doc.desc}</Typography>
          <Box mt={1}>
            <Button component={Link} to={`/documents/${doc.id}`} variant="outlined" size="small">
              View Detail
            </Button>
          </Box>
        </Paper>
      ))}
    </div>
  );
}

export default SubjectDetailPage;