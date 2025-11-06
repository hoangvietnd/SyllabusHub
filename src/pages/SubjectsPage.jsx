import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listSubjects, deleteSubject } from '../api/subjects';

// MUI Components
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Tooltip
} from '@mui/material';

// Icons
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';

// Local Components
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import SubjectFormDialog from '../components/subjects/SubjectFormDialog';

const SubjectsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // State for dialogs
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const { data: subjects, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['subjects'],
    queryFn: () => listSubjects({ page: 1, limit: 1000 }).then(data => data.content),
    placeholderData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects']);
      setConfirmOpen(false);
    },
  });

  // Handlers for dialogs
  const handleOpenForm = (subject = null) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSubject(null);
  };

  const handleOpenDeleteDialog = (id) => {
    setSubjectToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subjectToDelete) {
      deleteMutation.mutate(subjectToDelete);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          {t('subjectsPage.manageTitle')}
        </Typography>
        <Stack direction="row" spacing={1}>
            <Tooltip title={t('common.refresh')}>
              <IconButton onClick={() => refetch()} aria-label="refresh">
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
              {t('subjectsPage.createNew')}
            </Button>
        </Stack>
      </Stack>

      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteMutation.error.message}
        </Alert>
      )}

      <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('common.name')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('common.description')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
              ) : isError ? (
                <TableRow><TableCell colSpan={3}><Alert severity="error">{error.message}</Alert></TableCell></TableRow>
              ) : subjects.length > 0 ? (
                subjects.map((subject) => (
                  <TableRow key={subject.id} hover>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.description || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton onClick={() => handleOpenForm(subject)}><Edit /></IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton onClick={() => handleOpenDeleteDialog(subject.id)} disabled={deleteMutation.isLoading}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} align="center">{t('subjectsPage.noSubjects')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <SubjectFormDialog
        open={isFormOpen}
        onClose={handleCloseForm}
        subject={editingSubject}
      />

      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title={t('deleteDialog.title')}
        description={t('deleteDialog.description')}
        isLoading={deleteMutation.isLoading}
      />
    </Box>
  );
};

export default SubjectsPage;
