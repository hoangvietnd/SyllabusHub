import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getCourseById, createCourse, updateCourse } from '../api/courses';

// Schema for basic course data validation
const courseSchema = z.object({
  title: z.string().min(3, 'validation.titleMin'),
  description: z.string().optional(),
});

function CourseFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  const [apiError, setApiError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: '', description: '' },
  });

  const { data: courseData, isLoading: isLoadingCourse, isError: isCourseError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      reset({ title: data.title, description: data.description });
      setTags(data.tags || []);
    },
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      if (isEditMode) {
        queryClient.invalidateQueries(['course', id]);
      }
      navigate('/courses');
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || error.message;
      setApiError(errorMsg);
    },
  };

  const createMutation = useMutation({ ...mutationOptions, mutationFn: createCourse });
  const updateMutation = useMutation({ ...mutationOptions, mutationFn: (vars) => updateCourse(id, vars) });

  const handleAddTag = (event) => {
    if ((event.key === 'Enter' || event.type === 'blur') && tagInput.trim() !== '') {
      event.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => () => {
    setTags((currentTags) => currentTags.filter((tag) => tag !== tagToDelete));
  };

  const onSubmit = (formData) => {
    setApiError(null);
    const submissionData = { ...formData, tags };
    if (isEditMode) {
      updateMutation.mutate(submissionData);
    } else {
      createMutation.mutate(submissionData);
    }
  };

  if (isLoadingCourse) return <CircularProgress />;
  if (isCourseError) return <Alert severity="error">{t('courseForm.loadError')}</Alert>;

  const isMutating = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, sm: 4 }, mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? t('courseForm.editTitle') : t('courseForm.createTitle')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3} sx={{ mt: 3 }}>
            {apiError && <Alert severity="error">{apiError}</Alert>}
            
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('courseForm.titleLabel')}
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title ? t(errors.title.message) : ''}
                  disabled={isMutating}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={t('courseForm.descriptionLabel')}
                  fullWidth
                  multiline
                  rows={5}
                  disabled={isMutating}
                />
              )}
            />

            <Box>
              <TextField
                fullWidth
                label={t('createCoursePage.courseTags')}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                onBlur={handleAddTag}
                helperText={t('createCoursePage.tagsHelperText')}
                disabled={isMutating}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} onDelete={handleDeleteTag(tag)} disabled={isMutating} />
                ))}
              </Stack>
            </Box>

            <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4 }}>
              <Button onClick={() => navigate('/courses')} color="inherit" variant='outlined' disabled={isMutating}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" variant="contained" disabled={isMutating}>
                {isMutating ? <CircularProgress size={24} /> : (isEditMode ? t('common.save') : t('common.create'))}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default CourseFormPage;
