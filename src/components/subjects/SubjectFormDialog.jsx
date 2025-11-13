import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSubject, updateSubject } from '../../api/subjects';

// MUI Components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';

const SubjectFormDialog = ({ open, onClose, subject }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const isEditing = !!subject;

  // Validation Schema with translated messages
  const subjectSchema = z.object({
    name: z.string().min(3, { message: t('validation.nameMin') }),
    description: z.string().optional(),
  });

  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  useEffect(() => {
    if (subject) {
      reset({ name: subject.name, description: subject.description || '' });
    } else {
      reset({ name: '', description: '' });
    }
  }, [subject, open, reset]);

  const mutation = useMutation({
    mutationFn: isEditing ? (data) => updateSubject({ id: subject.id, subjectData: data }) : createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      onClose(); // Close the dialog on success
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditing ? t('subjectForm.editTitle') : t('subjectForm.createTitle')}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error.message}
            </Alert>
          )}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                margin="dense"
                id="name"
                label={t('subjectForm.nameLabel')}
                type="text"
                fullWidth
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name?.message}
                required
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                margin="dense"
                id="description"
                label={t('common.description')}
                type="text"
                fullWidth
                variant="outlined"
                multiline
                rows={4}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ p: '16px 24px' }}>
          <Button onClick={onClose} color="secondary">
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={isSubmitting || mutation.isLoading}
          >
            {isSubmitting || mutation.isLoading ? <CircularProgress size={24} /> : (isEditing ? t('common.save') : t('common.create'))}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SubjectFormDialog;
