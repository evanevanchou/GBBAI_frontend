import { Box, Grid, Skeleton } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import { MlAppStruct } from 'src/types/app';

import AppCard from './app-card';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(12)].map((_, index) => (
      <Grid item xs={12} sm={6} md={3} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);

const filterredApps = [
  'AI Chatbot Assistants',
  'Enterprise Data Copilot',
  'TV Copilot',
  'AI Content Generator',
];

type ShopProductListProps = {
  mlApps: MlAppStruct[];
  isLoad: boolean;
};

export default function AppList({ mlApps, isLoad, ...other }: ShopProductListProps) {
  const settings = useSettingsContext();
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3.5,
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: `repeat(${settings.themeStretch ? 5 : 4}, 1fr)`,
        },
      }}
      {...other}
    >
      {!isLoad &&
        mlApps.map(
          (mlApp) => filterredApps.includes(mlApp.title) && <AppCard key={mlApp.id} mlApp={mlApp} />
        )}

      {isLoad && SkeletonLoad}
    </Box>
  );
}
