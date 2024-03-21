import { useState } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { colorPresets } from 'src/utils/color-presets';

import {
  KbDocumentIllustration,
  KbDatasettIllustration,
  KbDataTypeIllustration,
} from 'src/assets/illustrations';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import KbManagerList from '../kb-manager-list';
import KbWidgetSummary from '../kb-widget-summary';
import KbManagerAmount from '../kb-manager-amount';
import KbManagerActivity from '../kb-manager-activity';

// ----------------------------------------------------------------------

const SPACING = 3;

const TIME_LABELS = {
  week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  year: ['2018', '2019', '2020', '2021', '2022'],
};

export default function OverviewKbView() {
  const theme = useTheme();

  const [refreshKey, setRefreshKey] = useState(0);

  const settings = useSettingsContext();

  const handleRefresh = () => {
    setRefreshKey(Math.floor(Math.random() * 1000));
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Knowledge Base</Typography>
        <IconButton
          size="small"
          onClick={handleRefresh}
          sx={{ width: 32, height: 32, color: 'inherit' }}
        >
          <Iconify icon={refreshFill} />
        </IconButton>
      </Stack>
      <Grid container spacing={SPACING} disableEqualOverflow>
        <Grid xs={12} md={4}>
          <KbWidgetSummary title="Total Documents" total={826} icon={<KbDocumentIllustration />} />
        </Grid>

        <Grid xs={12} md={4}>
          <KbWidgetSummary title="Total Datasets" total={28} icon={<KbDatasettIllustration />} />
        </Grid>

        <Grid xs={12} md={4}>
          <KbWidgetSummary title="Total Data Types" total={6} icon={<KbDataTypeIllustration />} />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <KbManagerActivity
            title="Activity"
            chart={{
              labels: TIME_LABELS,
              colors: [
                theme.palette.primary.main,
                colorPresets[3].main,
                theme.palette.warning.main,
                theme.palette.text.disabled,
              ],
              series: [
                {
                  type: 'Week',
                  data: [
                    { name: 'PDF', data: [20, 34, 48, 65, 37, 48, 9] },
                    { name: 'Word', data: [10, 34, 13, 26, 27, 28, 18] },
                    { name: 'Images', data: [10, 14, 13, 16, 17, 18, 28] },
                    { name: 'Other', data: [5, 12, 6, 7, 8, 9, 48] },
                  ],
                },
                {
                  type: 'Month',
                  data: [
                    {
                      name: 'PDF',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                    {
                      name: 'Word',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                    {
                      name: 'Images',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                    {
                      name: 'Other',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                  ],
                },
                {
                  type: 'Year',
                  data: [
                    { name: 'PDF', data: [10, 34, 13, 56, 77] },
                    { name: 'Word', data: [10, 34, 13, 56, 77] },
                    { name: 'Images', data: [10, 34, 13, 56, 77] },
                    { name: 'Other', data: [10, 34, 13, 56, 77] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <KbManagerAmount
            title="Data Amount"
            chart={{
              series: 76,
            }}
            data={[
              {
                name: 'PDF',
                filesCount: 268,
                icon: <Box component="img" src="/assets/icons/files/ic_pdf.svg" />,
              },
              {
                name: 'Word',
                filesCount: 182,
                icon: <Box component="img" src="/assets/icons/files/ic_word.svg" />,
              },
              {
                name: 'Images',
                filesCount: 103,
                icon: <Box component="img" src="/assets/icons/files/ic_img.svg" />,
              },
              {
                name: 'Text',
                filesCount: 223,
                icon: <Box component="img" src="/assets/icons/files/ic_txt.svg" />,
              },
              {
                name: 'Other',
                filesCount: 223,
                icon: <Box component="img" src="/assets/icons/files/ic_file.svg" />,
              },
            ]}
            sx={{ height: { xs: 'auto', md: 423 } }}
          />
        </Grid>
        <Grid xs={12}>
          <KbManagerList refreshKey={refreshKey} onRefresh={handleRefresh} />
        </Grid>
      </Grid>
    </Container>
  );
}
