import React, { useState } from 'react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Stack,
  Card, 
  CardContent
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { getCourseById } from '../api/courses'; // Assuming getCourseById fetches course with materials
import { deleteMaterial } from '../api/materials';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import MaterialUploadDialog from '../components/MaterialUploadDialog';

function CourseDetailPage() {
  const { t } = useTranslation();
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const { data: course, isLoading, isError, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  const deleteMaterialMutation = useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      queryClient.invalidateQueries(['course', courseId]);
      handleCloseConfirmDelete();
    },
  });

  const handleOpenConfirmDelete = (materialId) => {
    setMaterialToDelete(materialId);
    setConfirmDeleteDialogOpen(true);
  };

  const handleCloseConfirmDelete = () => {
    setMaterialToDelete(null);
    setConfirmDeleteDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      deleteMaterialMutation.mutate(materialToDelete);
    }
  };
  
  const handleDownload = async (material) => {
    const token = localStorage.getItem('accessToken');
    const downloadUrl = `${import.meta.env.VITE_API_BASE_URL}/materials/download/${material.filePath}`;
    try {
      const response = await fetch(downloadUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = material.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert(t('courseDetailPage.downloadError'));
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (isError) return <Alert severity="error" sx={{ mt: 4 }}>{t('courseDetailPage.error')}: {error.message}</Alert>;
  if (!course) return <Alert severity="info" sx={{ mt: 4 }}>{t('courseDetailPage.notFound')}</Alert>;

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Button component={RouterLink} to="/courses" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        {t('courseDetailPage.backButton')}
      </Button>

      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>{course.title}</Typography>
                {course.tags && course.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {course.tags.map((tag) => <Chip key={tag} label={tag} color="primary" />)}
                    </Box>
                )}
            </Box>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => navigate(`/courses/edit/${courseId}`)}>{t('common.edit')}</Button>
        </Stack>
        <Typography variant="body1" color="text.secondary" paragraph>{course.description}</Typography>
      </Paper>

      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" component="h2">{t('courseDetailPage.materialsTitle')}</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setUploadDialogOpen(true)}>{t('materialUpload.addNew')}</Button>
            </Stack>
            <Divider sx={{ mb: 2 }}/>
            {deleteMaterialMutation.isError && <Alert severity="error" sx={{mb: 2}}>{deleteMaterialMutation.error.message}</Alert>}
            <List>
            {course.materials && course.materials.length > 0 ? (
                course.materials.map((material) => (
                <ListItem key={material.id} disablePadding>
                     <ListItemIcon sx={{minWidth: '40px'}}><DescriptionIcon /></ListItemIcon>
                     <ListItemText primary={material.name} secondary={material.description} />
                     <Stack direction="row" spacing={1}>
                        <Tooltip title={t('courseDetailPage.downloadMaterial')}><IconButton onClick={() => handleDownload(material)}><DownloadIcon /></IconButton></Tooltip>
                        <Tooltip title={t('common.delete')}><IconButton onClick={() => handleOpenConfirmDelete(material.id)}><DeleteIcon /></IconButton></Tooltip>
                     </Stack>
                </ListItem>
                ))
            ) : (
                <ListItem><ListItemText primary={t('courseDetailPage.noMaterials')} /></ListItem>
            )}
            </List>
        </CardContent>
      </Card>

      <MaterialUploadDialog 
        open={isUploadDialogOpen} 
        onClose={() => setUploadDialogOpen(false)} 
        courseId={courseId} 
      />

      <ConfirmationDialog
        open={isConfirmDeleteDialogOpen}
        onClose={handleCloseConfirmDelete}
        onConfirm={handleConfirmDelete}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.description')}
        isLoading={deleteMaterialMutation.isLoading}
      />
    </Box>
  );
}

export default CourseDetailPage;
