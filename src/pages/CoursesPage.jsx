import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listCourses, deleteCourse } from '../api/courses';

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
  Link as MuiLink
} from '@mui/material';
import { Add, Edit, Delete, Refresh, Visibility as VisibilityIcon } from '@mui/icons-material';
import ConfirmationDialog from '../components/common/ConfirmationDialog'; // Import confirmation dialog

const CoursesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['courses', page, rowsPerPage],
    queryFn: () => listCourses({ page: page + 1, limit: rowsPerPage }),
    keepPreviousData: true,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      setConfirmOpen(false);
      queryClient.invalidateQueries(['courses']);
    },
  });

  const handlePageChange = (event, newPage) => setPage(newPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDeleteDialog = (id) => {
    setCourseToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (courseToDelete) {
      deleteMutation.mutate(courseToDelete);
    }
  };

  const getTrimmedDescription = (description) => {
    if (!description) return '-';
    const maxLength = 80;
    return description.length > maxLength ? `${description.substring(0, maxLength)}...` : description;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">{t('coursesPage.manageTitle')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/courses/new')}>
          {t('coursesPage.createNew')}
        </Button>
      </Stack>

      {deleteMutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
              {deleteMutation.error.response?.data?.message || deleteMutation.error.message}
          </Alert>
      )}

      <Paper sx={{ borderRadius: 2, boxShadow: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="courses table">
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
                <TableRow><TableCell colSpan={3}><Alert severity="error">{t('coursesPage.error')}: {error.message}</Alert></TableCell></TableRow>
              ) : data?.content?.length > 0 ? (
                data.content.map((course) => (
                  <TableRow key={course.id} hover>
                    <TableCell component="th" scope="row">
                       <MuiLink component="button" variant="body2" onClick={() => navigate(`/courses/${course.id}`)}>
                          {course.title}
                       </MuiLink>
                    </TableCell>
                    <TableCell>{getTrimmedDescription(course.description)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('coursesPage.viewDetails')}>
                        <IconButton onClick={() => navigate(`/courses/${course.id}`)}><VisibilityIcon /></IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.edit')}>
                         <IconButton onClick={() => navigate(`/courses/edit/${course.id}`)}><Edit /></IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton onClick={() => openDeleteDialog(course.id)} disabled={deleteMutation.isLoading}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
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
          count={data?.totalElements || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Paper>

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

export default CoursesPage;
