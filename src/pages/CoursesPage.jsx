import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { listCourses, deleteCourse } from '../api/courses'; 
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
import { Add, Edit, Delete, Refresh, Search, ArrowForward } from '@mui/icons-material';

// Local Components
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const CoursesPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { setTitle } = useTitle();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Pagination and Filter State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // Dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    setTitle(t('coursesPage.manageTitle'));
  }, [setTitle, t]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses', page, rowsPerPage, debouncedSearchTerm],
    queryFn: () => listCourses({ 
      page: page + 1, 
      limit: rowsPerPage,
      title: debouncedSearchTerm
    }),
    keepPreviousData: true,
  });

  // Reset page to 0 when filter changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries(['courses', page, rowsPerPage, debouncedSearchTerm]);
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

  const handleOpenDeleteDialog = (id) => {
    setCourseToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete);
    }
  };
  
  const handleNavigateToDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleNavigateToEdit = (courseId) => {
    navigate(`/courses/edit/${courseId}`);
  };

  const handleNavigateToCreate = () => {
    navigate('/courses/new');
  };

  const courses = data?.content || [];
  const totalCourses = data?.totalElements || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('coursesPage.manageTitle')}
      </Typography>

      {/* Toolbar: Search and Actions */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={t('coursesPage.searchPlaceholder')}
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
            <Button variant="contained" startIcon={<Add />} onClick={handleNavigateToCreate}>
              {t('coursesPage.createNew')}
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
                <TableCell sx={{ fontWeight: 'bold' }}>{t('coursesPage.table.title')}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{t('coursesPage.table.description')}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>{t('coursesPage.table.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
              ) : isError ? (
                <TableRow><TableCell colSpan={3}><Alert severity="error">{t('coursesPage.error')}</Alert></TableCell></TableRow>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                      {course.title}
                    </TableCell>
                    <TableCell>{course.description || '-'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.view')}>
                        <IconButton onClick={() => handleNavigateToDetails(course.id)}><ArrowForward /></IconButton>
                      </Tooltip>
                      {isAdmin && (
                        <>
                          <Tooltip title={t('common.edit')}>
                            <IconButton onClick={() => handleNavigateToEdit(course.id)}><Edit /></IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete')}>
                            <IconButton onClick={() => handleOpenDeleteDialog(course.id)} disabled={deleteMutation.isLoading}>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} align="center">{t('coursesPage.noCourses')}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCourses}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

      {isAdmin && (
        <ConfirmationDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title={t('deleteDialog.title')}
          description={t('deleteDialog.description')}
          isLoading={deleteMutation.isLoading}
        />
      )}
    </Box>
  );
};

export default CoursesPage;
