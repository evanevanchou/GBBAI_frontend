import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { MaintenanceIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export default function MaintenanceView() {
  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Typography variant="h3" sx={{ mb: 2 }}>
        Page under maintenance
      </Typography>

      <Typography sx={{ color: 'text.secondary' }}>
        We are currently working on this page
      </Typography>

      <MaintenanceIllustration sx={{ my: 10, height: 240 }} />

      <Button component={RouterLink} href="/" size="medium" variant="contained">
        Go to Home
      </Button>
    </Stack>
  );
}
