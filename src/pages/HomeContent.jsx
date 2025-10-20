import React from 'react';
import { Typography, Box, Grid, Paper, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function HomeContent() {
  const { t } = useTranslation();

  return (
    <Box>
      {/* Thanh tìm kiếm */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField fullWidth label={t('home.searchPlaceholder')} variant="outlined" />
        <Button variant="contained">{t('home.searchButton')}</Button>
      </Box>

      {/* Banner */}
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          {t('home.bannerTitle')}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {t('home.bannerSubtitle')}
        </Typography>
        <Button variant="contained" sx={{ mr: 2 }}>{t('home.exploreButton')}</Button>
        <Button variant="outlined">{t('home.findButton')}</Button>
      </Paper>

      {/* Tài liệu nổi bật */}
      <Typography variant="h6" gutterBottom>{t('home.featuredDocs')}</Typography>
      <Grid container spacing={2} mb={3}>
        {[1, 2, 3, 4].map(i => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1">Tài liệu {i}</Typography>
              <Button size="small" component={Link} to={`/documents/${i}`}>{t('home.docDetailButton')}</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tài liệu mới nhất */}
      <Typography variant="h6" gutterBottom>{t('home.latestDocs')}</Typography>
      <Box mb={3}>
        {[1, 2, 3].map(i => (
          <Paper key={i} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2">Bài giảng {i}</Typography>
            <Button size="small" component={Link} to={`/documents/${i}`}>{t('home.viewButton')}</Button>
          </Paper>
        ))}
      </Box>

      {/* Danh mục môn học */}
      <Typography variant="h6" gutterBottom>{t('home.subjectCategories')}</Typography>
      <Grid container spacing={2}>
        {['Toán', 'Lý', 'Hóa', 'Văn', 'Sử', 'Địa'].map(subj => (
          <Grid item xs={6} sm={4} md={2} key={subj}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>{subj}</Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default HomeContent;
