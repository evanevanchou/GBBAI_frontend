import { useCallback } from 'react';
import searchFill from '@iconify/icons-eva/search-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import CustomDateRangePicker, { shortDateLabel } from 'src/components/custom-date-range-picker';

import { IBenchmarkFilters, IBenchmarkFilterValue } from 'src/types/benchmark';

// ----------------------------------------------------------------------

type Props = {
  openDateRange: boolean;
  onCloseDateRange: VoidFunction;
  onOpenDateRange: VoidFunction;
  //
  filters: IBenchmarkFilters;
  onFilters: (name: string, value: IBenchmarkFilterValue) => void;
  //
  dateError: boolean;
  statusOptions: string[];
  tagOptions: string[];
};

export default function BenchmarkManagerFilters({
  openDateRange,
  onCloseDateRange,
  onOpenDateRange,
  //
  filters,
  onFilters,
  //
  dateError,
  statusOptions,
  tagOptions,
}: Props) {
  const tagPopover = usePopover();
  const statusPopover = usePopover();

  const renderLabel = filters.tags.length ? filters.tags.slice(0, 2).join(', ') : 'All tags';
  const renderStatus = filters.statuses.length
    ? filters.statuses.slice(0, 2).join(', ')
    : 'All statuses';

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('startDate', newValue);
    },
    [onFilters]
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleFilterTags = useCallback(
    (newValue: string) => {
      const checked = filters.tags.includes(newValue)
        ? filters.tags.filter((value) => value !== newValue)
        : [...filters.tags, newValue];
      onFilters('tags', checked);
    },
    [filters.tags, onFilters]
  );

  const handleResetTags = useCallback(() => {
    tagPopover.onClose();
    onFilters('tags', []);
  }, [onFilters, tagPopover]);

  const handleFilterStatuses = useCallback(
    (newValue: string) => {
      const checked = filters.statuses.includes(newValue)
        ? filters.statuses.filter((value) => value !== newValue)
        : [...filters.statuses, newValue];
      onFilters('statuses', checked);
    },
    [filters.statuses, onFilters]
  );

  const handleResetStatuses = useCallback(() => {
    statusPopover.onClose();
    onFilters('statuses', []);
  }, [onFilters, statusPopover]);

  const renderFilterName = (
    <TextField
      size="small"
      value={filters.name}
      onChange={handleFilterName}
      placeholder="Search..."
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon={searchFill} sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ width: { xs: 1, md: 220 } }}
    />
  );

  const renderFilterTags = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={tagPopover.onOpen}
        endIcon={
          <Iconify
            icon={tagPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2.15, borderRadius: 8 }}
      >
        {renderLabel}
        {filters.tags.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.tags.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover open={tagPopover.open} onClose={tagPopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {tagOptions.map((type) => {
              const selected = filters.tags.includes(type);

              return (
                <CardActionArea
                  key={type}
                  onClick={() => handleFilterTags(type)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{type}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="contained" color="inherit" onClick={handleResetTags}>
              Clear
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterStatus = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={statusPopover.onOpen}
        endIcon={
          <Iconify
            icon={statusPopover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2.15, borderRadius: 8 }}
      >
        {renderStatus}
        {filters.statuses.length > 2 && (
          <Label color="info" sx={{ ml: 1 }}>
            +{filters.statuses.length - 2}
          </Label>
        )}
      </Button>

      <CustomPopover open={statusPopover.open} onClose={statusPopover.onClose} sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Box
            gap={1}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            {statusOptions.map((status) => {
              const selected = filters.statuses.includes(status);

              return (
                <CardActionArea
                  key={status}
                  onClick={() => handleFilterStatuses(status)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && {
                      bgcolor: 'action.selected',
                    }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography variant={selected ? 'subtitle2' : 'body2'}>{status}</Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="contained" color="inherit" onClick={handleResetStatuses}>
              Clear
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  const renderFilterDate = (
    <>
      <Button
        size="small"
        variant="soft"
        color="inherit"
        onClick={onOpenDateRange}
        endIcon={
          <Iconify
            icon={openDateRange ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ px: 1.5, py: 2.15, borderRadius: 8 }}
      >
        {!!filters.startDate && !!filters.endDate
          ? shortDateLabel(filters.startDate, filters.endDate)
          : 'Select date'}
      </Button>

      <CustomDateRangePicker
        variant="calendar"
        startDate={filters.startDate}
        endDate={filters.endDate}
        onChangeStartDate={handleFilterStartDate}
        onChangeEndDate={handleFilterEndDate}
        open={openDateRange}
        onClose={onCloseDateRange}
        selected={!!filters.startDate && !!filters.endDate}
        error={dateError}
      />
    </>
  );

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}

      <Stack
        sx={{ mr: 0 }}
        spacing={1}
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        flexGrow={1}
      >
        {renderFilterDate}

        {renderFilterTags}

        {renderFilterStatus}
      </Stack>
    </Stack>
  );
}
