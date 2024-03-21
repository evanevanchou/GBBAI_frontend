import refreshFill from '@iconify/icons-eva/refresh-fill';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import BenchmarkManagerList from '../benchmark-manager-list';

// ----------------------------------------------------------------------

export default function BenchmarkDashboard() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Benchmark</Typography>
        <IconButton
          size="small"
          onClick={() => {}}
          sx={{ width: 32, height: 32, color: 'inherit' }}
        >
          <Iconify icon={refreshFill} />
        </IconButton>
      </Stack>
      <BenchmarkManagerList />
    </Container>
  );
}
