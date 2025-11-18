import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listSubjects, deleteSubject } from '../api/subjects';
import useTitle from '../hooks/useTitle';
import useAuth from '../hooks/useAuth';
import useDebounce from '../hooks/useDebounce';

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
  TablePagination, 
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Tooltip,
  TextField // Import TextField
} from '@mui/material';

// Icons
import { Add, Edit, Delete, Refresh, Search } from '@mui/icons-material';

// Local Components
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import SubjectFormDialog from '../components/subjects/SubjectFormDialog';

const SubjectsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setTitle } = useTitle();
  const { user } = useAuth();

  // Pagination and Filter State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // Dialogs state
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    setTitle(t('sidebar.subjects'));
  }, [setTitle, t]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['subjects', page, rowsPerPage, debouncedSearchTerm], // Add debouncedSearchTerm to queryKey
    queryFn: () => listSubjects({ 
      page: page + 1, 
      limit: rowsPerPage, 
      name: debouncedSearchTerm 
    }),
    keepPreviousData: true,
  });

  // Reset page to 0 when filter changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries(['subjects', page, rowsPerPage, debouncedSearchTerm]);
      setConfirmOpen(false);
    },
  });

  // Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); 
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenForm = (subject = null) => {
    setEditingSubject(subject);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingSubject(null);
    queryClient.invalidateQueries(['subjects']);
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

  const subjects = data?.content || [];
  const totalSubjects = data?.totalElements || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('subjectsPage.manageTitle')}
      </Typography>

      {/* Toolbar: Search and Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('subjectsPage.searchPlaceholder')}
            InputProps={{
              startAdornment: (
                <Search color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
        </Box>
        <Stack direction="row" spacing={1}>
            <Tooltip title={t('common.refresh')}>
              <IconButton onClick={() => refetch()} aria-label="refresh">
                <Refresh />
              </IconButton>
            </Tooltip>
            {isAdmin && (
              <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenForm()}>
                {t('subjectsPage.createNew')}
              </Button>
            )}
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
                {isAdmin && <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('common.actions')}</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={isAdmin ? 3 : 2} align="center"><CircularProgress /></TableCell></TableRow>
              ) : isError ? (
                <TableRow><TableCell colSpan={isAdmin ? 3 : 2}><Alert severity="error">{error.message}</Alert></TableCell></TableRow>
              ) : subjects.length > 0 ? (
                subjects.map((subject) => (
                  <TableRow key={subject.id} hover>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.description || '-'}</TableCell>
                    {isAdmin && (
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
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={isAdmin ? 3 : 2} align="center">{t('subjectsPage.noSubjects')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalSubjects}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />

      </Paper>

      {isAdmin && (
        <SubjectFormDialog
          open={isFormOpen}
          onClose={handleCloseForm}
          subject={editingSubject}
        />
      )}

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
