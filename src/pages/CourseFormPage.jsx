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
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// API Calls
import { getCourseById, createCourse, updateCourse } from '../api/courses';
import { listSubjects } from '../api/subjects';

const CourseFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);

  // Schema for validation, now including subjectId
  const courseSchema = z.object({
    title: z.string().min(3, t('validation.titleMin')),
    description: z.string().optional(),
    subjectId: z.string().nullable().optional(), // subjectId can be a string or null
  });

  const [apiError, setApiError] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: '', description: '', subjectId: '' }, // Initialize subjectId
  });

  // Query for the course to edit
  const { data: courseData, isLoading: isLoadingCourse, isError: isCourseError } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: isEditMode,
    onSuccess: (data) => {
      reset({ 
        title: data.title, 
        description: data.description, 
        subjectId: data.subject?.id || '' // Set subjectId from nested object
      });
      setTags(data.tags || []);
    },
  });

  // Query for the list of subjects to populate the dropdown
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => listSubjects({ page: 1, limit: 1000 }).then(data => data || []),
    placeholderData: [],
  });

  const mutationOptions = {
    onSuccess: (data) => {
      queryClient.invalidateQueries(['courses']);
      // Navigate to the detail page after creation/update
      navigate(`/courses/${data.id}`);
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || error.message;
      setApiError(errorMsg);
    },
  };

  const mutation = useMutation({
    mutationFn: (courseData) => 
      isEditMode ? updateCourse({ id, courseData }) : createCourse(courseData),
    ...mutationOptions
  });

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
    const submissionData = { 
      ...formData, 
      tags, 
      // Ensure subjectId is null if it's an empty string
      subjectId: formData.subjectId || null 
    };
    mutation.mutate(submissionData);
  };

  if (isLoadingCourse) return <CircularProgress />;
  if (isCourseError) return <Alert severity="error">{t('courseForm.loadError')}</Alert>;

  const isMutating = mutation.isLoading;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: { xs: 2, sm: 4 }, mt: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? t('courseForm.editTitle') : t('courseForm.createTitle')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={3} sx={{ mt: 3 }}>
            {apiError && <Alert severity="error">{apiError}</Alert>}
            
            {/* Subject Dropdown */}
            <FormControl fullWidth disabled={isLoadingSubjects || isMutating}>
              <InputLabel id="subject-select-label">{t('courseForm.subjectLabel')}</InputLabel>
              <Controller
                name="subjectId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="subject-select-label"
                    label={t('courseForm.subjectLabel')}
                  >
                    <MenuItem value=""><em>{t('common.none')}</em></MenuItem>
                    {subjects?.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

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
                  helperText={errors.title?.message}
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
