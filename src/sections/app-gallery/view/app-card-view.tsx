import { isEqual, orderBy } from 'lodash';
import { useState, useCallback } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';

import { Stack, Button, Tooltip, Container, IconButton, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetApps } from 'src/api/app-gallery';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { MlAppStruct, AppFilterStruct, AppFilterValueStruct } from 'src/types/app';

import AppList from '../app-list';
import AppFiltersResult from '../app-filter-result';
import AppFilterSidebar from '../app-filter-sidebar';

// ----------------------------------------------------------------------

const defaultFilters: AppFilterStruct = {
  scenario: [],
  category: 'All',
  colors: [],
  priceRange: '',
  rating: '',
};

// ----------------------------------------------------------------------

export default function AppCardView() {
  const settings = useSettingsContext();

  const openFilters = useBoolean();

  // const [sortBy, setSortBy] = useState('latest');
  const sortBy = 'latest';

  const [filters, setFilters] = useState(defaultFilters);

  // const [refreshPage, setRefreshPage] = useState(false);

  const { apps, appsLoading, appsEmpty } = useGetApps();

  const filteredApps = applyFilter({ apps, sortBy, filters });

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = !filteredApps.length && canReset;

  const handleFilters = useCallback((name: string, value: AppFilterValueStruct) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleRefresh = () => {
    // setRefreshPage(true);
  };

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  return (
    <Container maxWidth={settings.themeStretch ? 'xl' : 'lg'}>
      <Stack sx={{ mb: 3 }} direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Applications</Typography>
        <Tooltip title="Refresh">
          <IconButton
            size="small"
            onClick={handleRefresh}
            sx={{ width: 32, height: 32, color: 'inherit' }}
          >
            <Iconify icon={refreshFill} />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack
        sx={{ mb: 4, mt: 4 }}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <AppFilterSidebar
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />
        <Button
          // component={RouterLink}
          size="small"
          href={paths.gbbai.post.new}
          variant="contained"
          startIcon={<Iconify icon={plusFill} />}
          sx={{ width: 80, borderRadius: 0.75 }}
        >
          GPT
        </Button>

        {/* <MlAppSort /> */}
      </Stack>

      {canReset && (
        <AppFiltersResult
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          results={filteredApps.length}
        />
      )}

      {!appsLoading && (notFound || appsEmpty) && renderNotFound}

      <AppList mlApps={filteredApps} isLoad={appsLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({
  apps,
  sortBy,
  filters,
}: {
  apps: MlAppStruct[];
  sortBy: string;
  filters: AppFilterStruct;
}) => {
  const { scenario, category, rating } = filters;

  if (sortBy === 'featured') {
    apps = orderBy(apps, ['sold'], ['desc']);
  }
  if (sortBy === 'newest') {
    apps = orderBy(apps, ['createdAt'], ['desc']);
  }

  // FILTER apps
  if (scenario.length > 0) {
    apps = apps.filter((app) => scenario.includes(app.scenario));
  }

  if (category !== 'All') {
    apps = apps.filter((app) => app.category === category);
  }

  if (filters.rating) {
    apps = apps.filter((app) => {
      const convertRating = (value: string) => {
        if (value === 'up4Star') return 4;
        if (value === 'up3Star') return 3;
        if (value === 'up2Star') return 2;
        return 1;
      };
      return app.totalRating > convertRating(rating);
    });
  }

  return apps;
};
