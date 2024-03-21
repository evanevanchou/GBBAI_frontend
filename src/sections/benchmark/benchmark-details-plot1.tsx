import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

import { IBenchmark } from 'src/types/benchmark';

import AnalyticsTPM from './analytics-tpm';
import AnalyticsSummary from './analytics-summary';
import AnalyticsLatency from './analytics-latency';

// ----------------------------------------------------------------------

type Props = {
  benchmark: IBenchmark;
};

export default function BenchmarkDetailsPlot1({ benchmark }: Props) {
  return (
    <Stack>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
              <AnalyticsTPM
                title="TPM over time"
                subheader=""
                chart={{
                  labels: [
                    '01/01/2023',
                    '02/01/2023',
                    '03/01/2023',
                    '04/01/2023',
                    '05/01/2023',
                    '06/01/2023',
                    '07/01/2023',
                    '08/01/2023',
                    '09/01/2023',
                    '10/01/2023',
                    '11/01/2023',
                  ],
                  series: [
                    {
                      name: 'PAYGO',
                      type: 'area',
                      fill: 'gradient',
                      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    },
                    {
                      name: 'PTU-M',
                      type: 'area',
                      fill: 'gradient',
                      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                    },
                    {
                      name: 'PTU-Classic',
                      type: 'area',
                      fill: 'gradient',
                      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                    },
                  ],
                }}
              />

              <AnalyticsLatency
                title="Average E2E request latency"
                subheader=""
                chart={{
                  series: [
                    { label: '8', value: 40 },
                    { label: '10', value: 43 },
                    { label: '12', value: 44 },
                    { label: '14', value: 47 },
                    { label: '16', value: 54 },
                    { label: '13', value: 58 },
                    { label: '19', value: 69 },
                    { label: '22', value: 110 },
                    { label: '25', value: 120 },
                    { label: '40', value: 138 },
                  ],
                }}
              />
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <AnalyticsSummary
            title="Summary"
            chart={{
              categories: ['Latency', 'TPut', 'TTFT', 'AGTR', 'ACTR', 'TPM'],
              series: [
                { name: 'PTU-M', data: [80, 50, 30, 40, 100, 20] },
                { name: 'PTU-Classic', data: [20, 30, 40, 80, 20, 80] },
                { name: 'PayGo', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
