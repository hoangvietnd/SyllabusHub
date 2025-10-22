import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, LinearProgress, Alert } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import api from '../../utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// The mutation function that handles the file upload
const uploadMaterial = async (formData) => {
  const { data } = await api.post('/api/materials/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      // This is to calculate the percentage of upload completed
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      // We can use a state to store this percentage and display it
      // For simplicity, we are passing a callback from the component
      if (formData.onProgress) {
        formData.onProgress(percentCompleted);
      }
    },
  });
  return data;
};

function UploadPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const mutation = useMutation({ 
    mutationFn: uploadMaterial, 
    onSuccess: () => {
      // Reset form after successful upload
      setTitle('');
      setDescription('');
      setFile(null);
      setUploadProgress(0);
      // You can also add a success message/alert here
    },
    onError: (error) => {
      // Handle error, maybe show an alert to the user
      console.error("Upload failed", error);
      setUploadProgress(0);
    }
  });

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file || !title) {
      alert(t('uploadPage.validation'));
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    // Add the progress callback to the form data object
    formData.onProgress = setUploadProgress;

    mutation.mutate(formData);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('uploadPage.title')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label={t('uploadPage.documentTitle')}
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            disabled={mutation.isLoading}
          />
          <TextField
            label={t('uploadPage.description')}
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            disabled={mutation.isLoading}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            startIcon={<UploadFileIcon />}
            sx={{ my: 2 }}
            disabled={mutation.isLoading}
          >
            {t('uploadPage.selectFile')}
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="body1">{t('uploadPage.selected')}: {file.name}</Typography>}
          
          {mutation.isLoading && (
            <Box sx={{ width: '100%', my: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography variant="body2" align="center">{`${uploadProgress}%`}</Typography>
            </Box>
          )}

          {mutation.isSuccess && (
            <Alert severity="success" sx={{ my: 2 }}>{t('uploadPage.success')}</Alert>
          )}

          {mutation.isError && (
             <Alert severity="error" sx={{ my: 2 }}>{t('uploadPage.error')}: {mutation.error.message}</Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!file || !title || mutation.isLoading}
            sx={{ mt: 3 }}
          >
            {t('uploadPage.submit')}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default UploadPage;
