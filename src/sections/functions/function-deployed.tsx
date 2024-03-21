import sumBy from 'lodash/sumBy';
import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Card, { CardProps } from '@mui/material/Card';
import { alpha, useTheme } from '@mui/material/styles';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

type ItemProps = {
  label: string;
  value: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: ItemProps[];
    options?: ApexOptions;
  };
}

export default function FunctionDeployed({ title, subheader, chart, sx, ...other }: Props) {
  const theme = useTheme();

  const {
    colors = [theme.palette.primary.light, theme.palette.primary.main],
    series,
    options,
  } = chart;

  const total = sumBy(series, 'value');

  const chartSeries = (series.filter((i) => i.label === 'Deployed')[0].value / total) * 100;

  const chartOptions = useChart({
    legend: {
      show: false,
    },
    grid: {
      padding: { top: -20, bottom: -20 },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 80, color: colors[1], opacity: 1 },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '60%' },
        dataLabels: {
          name: { offsetY: -12 },
          value: { offsetY: 6 },
          total: {
            label: 'Total',
            formatter: () => fNumber(total),
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        px: 3,
        mt: 0.5,
        ...sx,
      }}
      {...other}
    >
      <Stack spacing={2} sx={{ p: 1 }}>
        {series.map((item) => (
          <Stack
            key={item.label}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              typography: 'subtitle2',
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: alpha(theme.palette.grey[500], 0.16),
                borderRadius: 0.5,
                ...(item.label === 'Deployed' && {
                  bgcolor: colors[1],
                }),
              }}
            />
            <Box sx={{ color: 'text.secondary', flexGrow: 1, mr: 1.5 }}>{item.label}</Box>
            {item.value}
          </Stack>
        ))}
      </Stack>

      <Box
        sx={{
          width: 110,
          height: 110,
          lineHeight: 0,
          borderRadius: '50%',
        }}
      >
        <Chart
          dir="ltr"
          type="radialBar"
          series={[chartSeries]}
          options={chartOptions}
          width="100%"
          height={174}
        />
      </Box>
    </Card>
  );
}
