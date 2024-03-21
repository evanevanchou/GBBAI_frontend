import { Stack, Skeleton } from '@mui/material';

// ----------------------------------------------------------------------

export default function SkeletonSettingHistory() {
  return (
    <Stack spacing={3} sx={{ py: 2 }}>
      {[...Array(6)].map((_, index) => (
        <Stack key={index} direction="row" alignItems="center">
          <Stack direction="row">
            <Skeleton variant="circular" sx={{ width: 32, height: 32 }} />
          </Stack>
          <Skeleton variant="text" sx={{ width: '90%', ml: 2 }} />
        </Stack>
      ))}
    </Stack>
  );
}
