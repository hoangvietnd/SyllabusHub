import * as React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button, LinearProgress, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { api } from '../api/client';

export default function Assignments() {
  const assignments = [
    { id: 1, title: 'Assignment 1: Intro', due: '2025-11-01' },
    { id: 2, title: 'Assignment 2: Data Structures', due: '2025-11-15' },
    { id: 3, title: 'Assignment 3: Web Project', due: '2025-12-01' },
  ];
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleFile = (e) => setFile(e.target.files?.[0] || null);

  const upload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      await api.post('/assignments/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (ev) => setProgress(Math.round((ev.loaded / ev.total) * 100)),
      });
      setMessage('Upload successful');
      setOpen(true);
    } catch (err) {
      // mock fallback for dev without backend
      console.warn('Upload failed, performing mock upload', err);
      await new Promise((r) => {
        let p = 0;
        const t = setInterval(() => {
          p += 10;
          setProgress(p);
          if (p >= 100) {
            clearInterval(t);
            r(null);
          }
        }, 80);
      });
      setMessage('Upload simulated (mock)');
      setOpen(true);
    } finally {
      setFile(null);
      setProgress(0);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Assignments
      </Typography>
      <List>
        {assignments.map(a => (
          <ListItem key={a.id} secondaryAction={<Button size="small">View</Button>}>
            <ListItemText primary={a.title} secondary={`Due: ${a.due}`} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 2 }}>
        <input id="file" type="file" onChange={handleFile} />
        {progress > 0 && <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, width: 300 }} />}
        <Box sx={{ mt: 1 }}>
          <Button variant="contained" onClick={upload} disabled={!file}>Upload</Button>
        </Box>
      </Box>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={message.includes('successful') ? 'success' : 'error'} sx={{ width: '100%' }}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}
