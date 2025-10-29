import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, LinearProgress, Alert } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../../utils/axiosInstance';

const createCourse = async ({ name, description, file, onProgress }) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('description', description);
  if (file) {
    formData.append('material', file);
  }

  const { data } = await api.post('/api/courses/create-with-material', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    },
  });
  return data;
};

function CreateCoursePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: createCourse, // SỬA LỖI: Đặt hàm vào trong mutationFn
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setUploadProgress(100);
      setName('');
      setDescription('');
      setFile(null);
      setFileName('');
      // Giữ thông báo thành công một lúc rồi reset progress
      setTimeout(() => {
          setUploadProgress(0);
      }, 5000);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Reset progress và trạng thái khi chọn file mới
      setUploadProgress(0);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      alert(t('createCoursePage.validation'));
      return;
    }
    setUploadProgress(0); // Bắt đầu upload progress từ 0
    mutate({ 
        name, 
        description, 
        file, 
        onProgress: setUploadProgress 
    });
  };

  return (
    <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('createCoursePage.title')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t('createCoursePage.courseName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
          disabled={isLoading}
        />
        <TextField
          fullWidth
          label={t('createCoursePage.courseDescription')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          disabled={isLoading}
        />
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            {t('createCoursePage.courseMaterial')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            disabled={isLoading}
          >
            {t('createCoursePage.selectFile')}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {fileName && <Typography variant="body2">{t('createCoursePage.fileName')}: {fileName}</Typography>}
        </Box>

        {(isLoading || (isSuccess && uploadProgress > 0)) && (
          <Box sx={{ width: '100%', my: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        {isSuccess && uploadProgress === 100 && <Alert severity="success" sx={{ mt: 2 }}>{t('createCoursePage.success')}</Alert>}
        
        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {t('createCoursePage.error')}: {error?.response?.data?.message || error.message}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          sx={{ mt: 3 }}
          size="large"
        >
          {t('createCoursePage.submit')}
        </Button>
      </form>
    </Paper>
  );
}

export default CreateCoursePage;
