import { useState, useCallback } from 'react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IFunctionManager } from 'src/types/function';

import FileManagerShareDialog from './file-manager-share-dialog';
import FunctionManagerFunctionDetails from './function-manager-function-details';

// ----------------------------------------------------------------------

type Props = {
  row: IFunctionManager;
  dense: boolean;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function FunctionManagerTableRow({
  row,
  dense,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, description, params, createdAt, modifiedAt, shared, tags, isFavorited } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: onEditRow,
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  return (
    <>
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
        <TableCell padding="checkbox" sx={{ pl: 2 }}>
          <Checkbox
            checked={selected}
            onDoubleClick={() => console.info('ON DOUBLE CLICK')}
            onClick={onSelectRow}
          />
        </TableCell>

        <TableCell onClick={handleClick}>
          <Typography
            noWrap
            variant="subtitle2"
            sx={{
              maxWidth: 140,
              cursor: 'pointer',
              ...(details.value && { fontWeight: 'fontWeightBold' }),
            }}
          >
            {name}
          </Typography>
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', width: 260, minWidth: 180, maxWidth: 280 }}
        >
          <Typography
            variant="inherit"
            sx={{
              cursor: 'pointer',
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: dense ? 1 : 2,
            }}
          >
            {description || 'N/A'}
          </Typography>
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap', maxWidth: 180 }}
        >
          {!!params && (
            <Stack direction="row" spacing={0.5}>
              <Chip
                size="small"
                color="default"
                variant="soft"
                label={params[0]}
                sx={{ height: 23 }}
              />
              {params.length > 1 && (
                <Chip
                  size="small"
                  color="info"
                  variant="soft"
                  label={`+${params.length - 1}`}
                  sx={{ height: 23 }}
                />
              )}
            </Stack>
          )}
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
        >
          <Label variant="soft" color={(row.status === 'published' && 'success') || 'warning'}>
            {row.status}
          </Label>
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(createdAt), 'dd MMM yyyy')}
            secondary={format(new Date(createdAt), 'p')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ mt: 0.5, component: 'span', typography: 'caption' }}
          />
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
        >
          {formatDistanceToNowStrict(new Date(modifiedAt), { addSuffix: true })}
        </TableCell>

        <TableCell
          align="center"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
        >
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

        <TableCell
          align="right"
          sx={{
            px: 1,
            pr: 2,
            whiteSpace: 'nowrap',
          }}
        >
          <IconButton onClick={onEditRow}>
            <Iconify icon={arrowIosForwardFill} />
          </IconButton>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon={moreVerticalFill} />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            handleCopy();
          }}
        >
          <Iconify icon="eva:link-2-fill" />
          Copy Link
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            share.onTrue();
          }}
        >
          <Iconify icon="solar:share-bold" />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <FunctionManagerFunctionDetails
        item={row}
        favorited={favorite.value}
        onFavorite={favorite.onToggle}
        onCopyLink={handleCopy}
        open={details.value}
        onClose={details.onFalse}
        onDelete={onDeleteRow}
      />

      <FileManagerShareDialog
        open={share.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onCopyLink={handleCopy}
        onClose={() => {
          share.onFalse();
          setInviteEmail('');
        }}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
