import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseById } from '../api/courses';
import { deleteMaterial } from '../api/materials';
import { getApiBaseUrl } from '../utils/axiosInstance';
import useTitle from '../hooks/useTitle';

// MUI Components
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';

// MUI Icons
import { Upload, Delete, Download, Edit, Article, School, ArrowBack } from '@mui/icons-material';

// Local Components
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import MaterialUploadDialog from '../components/MaterialUploadDialog';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTitle } = useTitle();

  const [isUploadOpen, setUploadOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const { 
    data: course, 
    isLoading: isLoadingCourse, 
    isError: isCourseError, 
    error: courseError, 
    refetch: refetchCourse 
  } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (course?.title) {
      setTitle(course.title);
    } else if (isLoadingCourse) {
      setTitle(t('loading'));
    } else {
      setTitle(t('courseDetailPage.title'));
    }
  }, [course, isLoadingCourse, setTitle, t]);

  const { mutate: doDeleteMaterial, isLoading: isDeletingMaterial } = useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      setConfirmDeleteOpen(false);
      queryClient.invalidateQueries(['course', id]); 
    },
    onError: (error) => {
      console.error("Failed to delete material:", error);
    }
  });

  const handleDeleteClick = (materialId) => {
    setMaterialToDelete(materialId);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      doDeleteMaterial(materialToDelete);
    }
  };

  const handleUploadSuccess = () => {
    refetchCourse();
  };

  if (isLoadingCourse) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
  }

  if (isCourseError) {
    return <Alert severity="error" sx={{ m: 2 }}>{`Error loading course: ${courseError.message}`}</Alert>;
  }

  if (!course) {
    return <Typography sx={{ textAlign: 'center', p: 4 }}>{t('courseDetailPage.notFound')}</Typography>;
  }

  const materials = course.materials || [];
  const apiBaseUrl = getApiBaseUrl();

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
       <Button 
        startIcon={<ArrowBack />} 
        onClick={() => navigate('/courses')} 
        sx={{ mb: 2 }}
      >
        {t('common.goBack')}
      </Button>

      {/* Course Header */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 2, boxShadow: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box flexGrow={1}>
                {course.subject && (
                    <Chip 
                        icon={<School />} 
                        label={course.subject.name} 
                        color="primary" 
                        sx={{ mb: 1.5, fontWeight: 'bold' }} 
                    />
                )}
                <Typography variant="h4" component="h1" gutterBottom>{course.title}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    {course.description}
                </Typography>
            </Box>
            <Button variant="outlined" startIcon={<Edit />} onClick={() => navigate(`/courses/edit/${id}`)}>
              {t('common.edit')}
            </Button>
        </Stack>
        {course.tags && course.tags.length > 0 && (
            <>
              <Divider sx={{ my: 2 }}/>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {course.tags.map((tag) => <Chip key={tag} label={tag} variant="outlined" size="small" />)}
              </Stack>
            </>
        )}
      </Paper>

      {/* Materials Section */}
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, boxShadow: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">{t('courseDetailPage.materialsTitle')}</Typography>
          <Button variant="contained" startIcon={<Upload />} onClick={() => setUploadOpen(true)}>
            {t('materialUpload.addNew')}
          </Button>
        </Stack>

        <Divider sx={{mb: 2}}/>

        {materials.length > 0 ? (
          <List>
            {materials.map((material) => {
              const downloadUrl = `${apiBaseUrl}/materials/download/${material.filePath}`;
              return (
                <ListItem 
                  key={material.id} 
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title={t('common.download')}>
                          <IconButton component="a" href={downloadUrl} target="_blank" rel="noopener noreferrer">
                              <Download />
                          </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                          <IconButton edge="end" onClick={() => handleDeleteClick(material.id)} disabled={isDeletingMaterial}>
                              <Delete />
                          </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemIcon><Article /></ListItemIcon>
                  <ListItemText 
                      primary={material.name}
                      secondary={material.description || t('courseDetailPage.noDescription')}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography sx={{ textAlign: 'center', p: 3, color: 'text.secondary' }}>
            {t('courseDetailPage.noMaterials')}
          </Typography>
        )}
      </Paper>

      {/* Dialogs */}
      <MaterialUploadDialog
        open={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        courseId={id}
        onSuccess={handleUploadSuccess}
      />
      <ConfirmationDialog
        open={isConfirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.materialDescription')}
        isLoading={isDeletingMaterial}
      />
    </Box>
  );
};

export default CourseDetailPage;
