import refreshFill from '@iconify/icons-eva/refresh-fill';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { TotalFunctionIllustration, FunctionInvokeIllustration } from 'src/assets/illustrations';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import FunctionDeployed from '../function-deployed';
import FunctionManagerList from '../function-manager-list';
import FunctionWidgetSummary from '../function-widget-summary';

// ----------------------------------------------------------------------

const SPACING = 3;

export default function OverviewFunctionView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Functions</Typography>
        <IconButton
          size="small"
          onClick={() => {}}
          sx={{ width: 32, height: 32, color: 'inherit' }}
        >
          <Iconify icon={refreshFill} />
        </IconButton>
      </Stack>
      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <FunctionWidgetSummary
            title="Total Functions"
            total={26}
            icon={<TotalFunctionIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <FunctionWidgetSummary
            title="Invocations"
            total={168}
            icon={<FunctionInvokeIllustration />}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <FunctionDeployed
            title=""
            chart={{
              series: [
                { label: 'Deployed', value: 20 },
                { label: 'In draft', value: 6 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12}>
          <FunctionManagerList />
        </Grid>
      </Grid>
    </Container>
  );
}
