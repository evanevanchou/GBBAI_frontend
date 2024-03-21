import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  dependencies: string[];
};

export default function FunctionDetailsCodeDependencies({ dependencies }: Props) {
  return (
    <Card>
      <CardHeader
        title={`Dependencies (${dependencies.length})`}
        sx={{ mt: -1, mb: -0.5 }}
        action={
          <IconButton
            size="small"
            onClick={() => {}}
            sx={{ width: 30, height: 30, mt: 0.5, color: 'inherit' }}
          >
            <Iconify icon={plusFill} />
          </IconButton>
        }
      />

      <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

      <Stack spacing={0.5}>
        {dependencies.map((dependency, index) => (
          <Stack
            key={index}
            direction="row"
            alignItems="center"
            sx={{ pl: 1, mx: 2 }}
            justifyContent="space-between"
          >
            <Typography variant="body2">{dependency}</Typography>

            <IconButton size="small" sx={{ p: 0.9 }}>
              <Iconify icon={closeFill} width={16} />
            </IconButton>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />

      <Stack spacing={3} direction="row" alignItems="center" sx={{ p: 2.5, px: 3 }}>
        <Button fullWidth size="small" color="error" variant="soft" onClick={() => {}}>
          Clear
        </Button>

        <Button fullWidth size="small" color="inherit" variant="soft" onClick={() => {}}>
          Import
        </Button>
      </Stack>
    </Card>
  );
}
