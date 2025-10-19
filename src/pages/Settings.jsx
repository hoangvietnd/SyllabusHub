import { Box, Typography, TextField, Button } from '@mui/material';

export default function Settings() {
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Typography variant="h5" gutterBottom>
        Account Settings
      </Typography>
      <TextField fullWidth label="Full Name" margin="normal" />
      <TextField fullWidth label="Email" margin="normal" />
      <Button variant="contained" sx={{ mt: 2 }}>
        Save Changes
      </Button>
    </Box>
  );
}
