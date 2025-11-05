import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, LinearProgress, Alert, Chip, Stack } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../../utils/axiosInstance';

const createCourse = async ({ title, description, tags, file, onProgress }) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  if (tags && tags.length > 0) {
    tags.forEach(tag => formData.append('tags', tag));
  }
  if (file) {
    formData.append('material', file);
  }

  const { data } = await api.post('/courses/create-with-material', formData, {
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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { mutate, isLoading, isError, isSuccess, error } = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      setUploadProgress(100);
      setTitle('');
      setDescription('');
      setTags([]);
      setTagInput('');
      setFile(null);
      setFileName('');
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
      setUploadProgress(0);
    }
  };

  const handleTagInputChange = (event) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && tagInput.trim() !== '') {
      event.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => () => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title) {
      alert(t('createCoursePage.validation'));
      return;
    }
    setUploadProgress(0);
    mutate({ 
        title, 
        description, 
        tags,
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <Box sx={{ my: 2 }}>
            <TextField
                fullWidth
                label={t('createCoursePage.courseTags')}
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleAddTag}
                margin="normal"
                helperText={t('createCoursePage.tagsHelperText')}
                disabled={isLoading}
            />
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={handleDeleteTag(tag)}
                        disabled={isLoading}
                        sx={{ mb: 1 }}
                    />
                ))}
            </Stack>
        </Box>
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
