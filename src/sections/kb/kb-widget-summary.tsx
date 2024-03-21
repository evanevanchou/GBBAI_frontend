import Box from '@mui/material/Box';
import Card, { CardProps } from '@mui/material/Card';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title: string;
  total: number;
  icon: React.ReactElement;
}

export default function KbWidgetSummary({ title, total, icon, sx, ...other }: Props) {
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
      <Box>
        <Box sx={{ mb: 1, typography: 'h3' }}>{fShortenNumber(total)}</Box>
        <Box sx={{ color: 'text.secondary', typography: 'subtitle2' }}>{title}</Box>
      </Box>

      <Box
        sx={{
          width: 110,
          height: 110,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        {icon}
      </Box>
    </Card>
  );
}
