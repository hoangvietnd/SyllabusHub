import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

function DocumentDetailPage() {
  const { docId } = useParams();
  const { t } = useTranslation();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5">{t('documentDetail.title')}</Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        {t('documentDetail.docId')}: {docId}
      </Typography>
      <Typography variant="body1" sx={{ my: 2 }}>
        This is the detail of the document. You can show preview here (PDF, video...).
      </Typography>
      <Button variant="contained">Download</Button>
    </Paper>
  );
}

export default DocumentDetailPage;
