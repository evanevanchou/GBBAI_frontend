import { Icon } from '@iconify/react';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';

import { _allFunctions } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import FunctionDetailsTabs from '../function-details-tabs';
import FunctionDetailsTable from '../function-details-top-table';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function FunctionDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const currentFunc = _allFunctions.filter((func) => func.id === id)[0];

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">{currentFunc.name}</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton
            size="small"
            onClick={() => {}}
            sx={{ width: 30, height: 30, color: 'inherit' }}
          >
            <Iconify icon={refreshFill} />
          </IconButton>
          <Button
            size="small"
            variant="contained"
            startIcon={<Icon icon={cloudUploadFill} />}
            onClick={() => {}}
          >
            Update
          </Button>
        </Stack>
      </Stack>
      <CustomBreadcrumbs
        links={[
          {
            name: 'Functions',
            href: paths.gbbai.function.root,
          },
          { name: currentFunc.name },
        ]}
        sx={{ mb: { xs: 2, md: 3 }, mt: { xs: -1.5, md: -2 } }}
      />

      <FunctionDetailsTable func={currentFunc} />

      <FunctionDetailsTabs func={currentFunc} />
    </Container>
  );
}
