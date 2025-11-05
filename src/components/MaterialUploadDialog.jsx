import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadMaterial } from '../api/materials';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  LinearProgress,
  Alert,
  Typography
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTranslation } from 'react-i18next';

function MaterialUploadDialog({ open, onClose, courseId }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [localError, setLocalError] = useState('');

  const { mutate, isLoading, isError, error, isSuccess } = useMutation({
    mutationFn: uploadMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      setUploadProgress(100);
      setTimeout(() => {
        handleClose();
      }, 1500);
    },
    onError: () => {
      setUploadProgress(0);
    }
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setLocalError(''); // Clear previous errors
    }
  };

  const handleClose = () => {
    if (isLoading) return; // Prevent closing while uploading
    setFile(null);
    setFileName('');
    setDescription('');
    setUploadProgress(0);
    setLocalError('');
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setLocalError(t('materialUpload.fileRequired'));
      return;
    }
    setLocalError('');
    mutate({ courseId, file, description, onProgress: setUploadProgress });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('materialUpload.title')}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {(localError || isError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {localError || error.response?.data?.message || error.message}
            </Alert>
          )}
          <TextField
            label={t('materialUpload.descriptionLabel')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            disabled={isLoading}
          />
          <Box sx={{ mt: 2, mb: 1 }}>
            <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                disabled={isLoading}
            >
                {t('materialUpload.selectFile')}
                <input type="file" hidden onChange={handleFileChange} />
            </Button>
            {fileName && (
                <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>
                    {t('createCoursePage.fileName')}: {fileName}
                </Typography>
            )}
          </Box>
          
          {(isLoading || isSuccess) && (
            <Box sx={{ width: '100%', my: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
            </Box>
          )}
           {isSuccess && uploadProgress === 100 && <Alert severity="success">{t('materialUpload.success')}</Alert>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} color="inherit" disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !file}>
            {isLoading ? t('materialUpload.uploading') : t('materialUpload.submit')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default MaterialUploadDialog;
