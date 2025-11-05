import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * A reusable confirmation dialog.
 * @param {object} props
 * @param {boolean} props.open - Controls if the dialog is open.
 * @param {function} props.onClose - Function to call when the dialog should close.
 * @param {function} props.onConfirm - Function to call when the confirm button is clicked.
 * @param {string} props.title - The title of the dialog.
 * @param {string} props.description - The main content/question of the dialog.
 * @param {React.ReactNode} [props.children] - Optional children to render inside the content.
 */
function ConfirmationDialog({ open, onClose, onConfirm, title, description, children }) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id="confirmation-dialog-description">
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          {t('common.cancel')}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
