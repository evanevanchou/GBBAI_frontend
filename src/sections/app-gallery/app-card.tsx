import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';

import { useTheme } from '@mui/material/styles';
import { Box, Card, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import Image from 'src/components/image';
import AppTag from 'src/components/custom-tags/AppTag';

import { MlAppStruct } from 'src/types/app';

import MlAppDetailsDrawer from './meta-info/details-drawer';

// ----------------------------------------------------------------------

type Props = {
  mlApp: MlAppStruct;
};

export default function MlAppCard({ mlApp }: Props) {
  const theme = useTheme();
  const { id, title, cover, scenarios } = mlApp;
  const [mouseEnter, setMouseEnter] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  // const [openConfirm, setOpenConfirm] = useState(false);

  const handleOpenDetails = () => {
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setMouseEnter(false);
  };

  const handleMouseEnter = () => {
    setMouseEnter(true);
  };

  const handleMouseLeave = () => {
    setMouseEnter(false);
  };

  const handleOpenConfirm = () => {
    // setOpenConfirm(true);
  };

  return (
    // <Card sx={{ boxShadow: theme.customShadows.card }}>
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        // boxShadow: theme.customShadows.z2,
        ...(mouseEnter && {
          boxShadow: theme.customShadows.z24,
        }),
      }}
    >
      <Box onClick={handleOpenDetails} sx={{ position: 'relative', p: 1 }}>
        <Image alt={title} src={cover} ratio="4/3" sx={{ borderRadius: 0.85, height: 220 }} />
      </Box>

      <Stack spacing={1.5} sx={{ p: 1.5, pb: 1.5 }}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {scenarios !== undefined && scenarios.length > 0 && (
            <AppTag
              title={scenarios[0].title as string}
              color={scenarios[0].color}
              sx={{ height: 24, textTransform: 'none', borderRadius: 0.75 }}
            />
          )}
          {(scenarios === undefined || scenarios.length === 0) && <span />}

          <Button
            to={paths.gbbai.appGallery.details(id)}
            component={RouterLink}
            size="small"
            color="inherit"
            sx={{ height: 24 }}
            endIcon={<Icon icon={arrowIosForwardFill} style={{ marginLeft: '-5px' }} />}
          >
            Enter
          </Button>
        </Stack>
      </Stack>

      <MlAppDetailsDrawer
        item={mlApp}
        favorited={false}
        onFavorite={() => {}}
        onCopyLink={() => {}}
        open={openDetails}
        onClose={handleCloseDetails}
        onDeleteRow={handleOpenConfirm}
        // onDelete={() => {
        //   handleCloseDetails();
        //   onDelete();
        // }}
      />
    </Card>
  );
}
