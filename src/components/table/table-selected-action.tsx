import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  dense?: boolean;
  action?: React.ReactNode;
  rowCount: number;
  numSelected: number;
  checkboxMl?: number;
  denseCheckboxMl?: number;
  onSelectAllRows: (checked: boolean) => void;
}

export default function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  checkboxMl = 2,
  denseCheckboxMl = 4.5,
  onSelectAllRows,
  sx,
  ...other
}: Props) {
  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 46,
        // position: 'absolute',
        bgcolor: 'primary.lighter',
        ...(dense && {
          // height: 38,
          height: 46,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllRows(event.target.checked)
        }
        sx={{ ml: dense ? denseCheckboxMl : checkboxMl }}
      />

      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} selected
      </Typography>

      {action && action}
    </Stack>
  );
}
