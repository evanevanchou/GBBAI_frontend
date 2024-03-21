import { formatDistanceToNowStrict } from 'date-fns';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTimeYMdHms } from 'src/utils/format-time';

import { IFunctionManager } from 'src/types/function';

// ----------------------------------------------------------------------

type Props = {
  row: IFunctionManager;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export default function FunctionManagerTableRow({ row, selected, onSelectRow }: Props) {
  const { name, description, createdAt, modifiedAt, tags } = row;

  const details = useBoolean();

  return (
    <TableRow
      selected={selected}
      sx={{
        ...(details.value && {
          [`& .${tableCellClasses.root}`]: {
            // ...defaultStyles,
            color: 'text.primary',
            typography: 'subtitle2',
            bgcolor: 'background.default',
          },
        }),
      }}
    >
      <TableCell padding="checkbox" sx={{ pl: 2, ml: 3, height: 48 }}>
        <Checkbox
          checked={selected}
          onDoubleClick={() => console.info('ON DOUBLE CLICK')}
          onClick={onSelectRow}
        />
      </TableCell>

      <TableCell>
        <Typography
          noWrap
          variant="subtitle2"
          sx={{
            maxWidth: 180,
            cursor: 'pointer',
            ...(details.value && { fontWeight: 'fontWeightBold' }),
          }}
        >
          {name}
        </Typography>
      </TableCell>

      <TableCell
        align="left"
        sx={{
          color: 'text.primary',
          width: 260,
          minWidth: 180,
          maxWidth: 280,
        }}
      >
        <Typography
          variant="inherit"
          sx={{
            cursor: 'pointer',
            display: '-webkit-box',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 1,
          }}
        >
          {(!!description && description) || 'N/A'}
        </Typography>
      </TableCell>

      <TableCell sx={{ whiteSpace: 'nowrap' }}>{fDateTimeYMdHms(createdAt)}</TableCell>

      <TableCell align="left" sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}>
        {formatDistanceToNowStrict(new Date(modifiedAt), {
          addSuffix: true,
        })}
      </TableCell>

      <TableCell align="center" sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}>
        {tags && tags.length > 0 && (
          <Stack direction="row" spacing={0.5}>
            {!!tags && (
              <Stack direction="row" spacing={0.5}>
                <Chip
                  size="small"
                  color="primary"
                  variant="soft"
                  label={tags[0]}
                  sx={{ height: 23 }}
                />
                {tags.length > 1 && (
                  <Chip
                    size="small"
                    color="primary"
                    variant="soft"
                    label={`+${tags.length - 1}`}
                    sx={{ height: 23 }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        )}
      </TableCell>
    </TableRow>
  );
}
