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

import { IFunctionFilters, IFunctionFilterValue } from 'src/types/function';

// ----------------------------------------------------------------------

type Props = {
  filters: IFunctionFilters;
  onFilters: (name: string, value: IFunctionFilterValue) => void;
  //
  tagOptions: string[];
};

export default function FileManagerFilters({
  filters,
  onFilters,
  //
  tagOptions,
}: Props) {
  const tagPopover = usePopover();

  const renderLabel = filters.tags.length ? filters.tags.slice(0, 2).join(',') : 'All tags';

  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
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
            sx={{ ml: -0.5 }}
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
            {tagOptions.map((tag) => {
              const selected = filters.tags.includes(tag);

              return (
                <CardActionArea
                  key={tag}
                  onClick={() => handleFilterTags(tag)}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.08)}`,
                    ...(selected && { bgcolor: 'action.selected' }),
                  }}
                >
                  <Stack spacing={1} direction="row" alignItems="center">
                    <Typography
                      textTransform="capitalize"
                      variant={selected ? 'subtitle2' : 'body2'}
                    >
                      {tag}
                    </Typography>
                  </Stack>
                </CardActionArea>
              );
            })}
          </Box>

          <Stack spacing={1.5} direction="row" alignItems="center" justifyContent="flex-end">
            <Button size="small" variant="outlined" color="inherit" onClick={handleResetTags}>
              Clear
            </Button>

            <Button size="small" variant="contained" onClick={tagPopover.onClose}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </CustomPopover>
    </>
  );

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      sx={{ width: 1 }}
    >
      {renderFilterName}

      <Stack spacing={1} direction="row" alignItems="center" justifyContent="flex-end" flexGrow={1}>
        {renderFilterTags}
      </Stack>
    </Stack>
  );
}
