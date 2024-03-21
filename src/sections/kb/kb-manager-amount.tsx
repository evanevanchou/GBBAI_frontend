import { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  data: {
    name: string;
    filesCount: number;
    icon: React.ReactNode;
  }[];
  chart: {
    colors?: string[];
    series: number;
    options?: ApexOptions;
  };
}

export default function KbManagerAmount({ title, subheader, data, chart, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={3.5} sx={{ px: 3, pb: 5, mt: 4 }}>
        {data.map((category) => (
          <Stack key={category.name} spacing={2} direction="row" alignItems="center">
            <Box sx={{ width: 36, height: 36 }}>{category.icon}</Box>

            <ListItemText primary={category.name} />

            <Box sx={{ typography: 'subtitle2' }}> {fNumber(category.filesCount)} </Box>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
