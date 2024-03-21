import { format } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import { fData } from 'src/utils/format-number';

import { getKbItem } from 'src/api/kmm';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import Label, { LabelColor } from 'src/components/label';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { KbItemManager } from 'src/types/dataset';

import FileManagerShareDialog from './file-manager-share-dialog';
import FileManagerFileDetails from './file-manager-file-details';

// ----------------------------------------------------------------------

type Props = {
  kbId: string;
  row: KbItemManager;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  onUpdateRow: (newRow: KbItemManager) => void;
};

export default function FileManagerTableRow({
  kbId,
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onUpdateRow,
}: Props) {
  const { id, name, size, type, chunks, modifiedAt, shared, status, isFavorited, error } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

  const favorite = useBoolean(isFavorited);

  const details = useBoolean();

  const share = useBoolean();

  const confirm = useBoolean();

  const popover = usePopover();

  useEffect(() => {
    let intervalId: any = null;
    if (!!status && !status.includes('loading') && status.includes('ing')) {
      intervalId = setInterval(() => {
        if (!status.includes('ing')) {
          clearInterval(intervalId);
        } else {
          getKbItem(kbId, id)
            .then((item: KbItemManager) => {
              if (item.status !== status) onUpdateRow({ ...item });
              if (!item.status.includes('ing')) clearInterval(intervalId);
            })
            .catch((e) => enqueueSnackbar(e, { variant: 'error' }));
        }
      }, 3000);

      return () => clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [status]);

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleClick = useDoubleClick({
    click: () => {
      details.onTrue();
    },
    doubleClick: () => console.info('DOUBLE CLICK'),
  });

  const handleCopy = useCallback(() => {
    enqueueSnackbar('Copied!');
    copy(row.url);
  }, [copy, enqueueSnackbar, row.url]);

  let color = 'default';
  if (status.toLowerCase().startsWith('uploaded')) {
    color = 'default';
  } else if (status.toLowerCase().startsWith('indexing')) {
    color = 'secondary';
  } else if (status.toLowerCase().startsWith('indexed')) {
    color = 'primary';
  } else if (status.toLowerCase().startsWith('uploading')) {
    color = 'warning';
  } else if (status.toLowerCase().startsWith('prep')) {
    color = 'warning';
  } else if (status.toLowerCase().startsWith('failed')) {
    color = 'error';
  }

  return (
    <>
      <TableRow selected={selected}>
        <TableCell padding="checkbox" sx={{ maxWidth: 80 }}>
          <Stack direction="row" alignItems="center" spacing={0} sx={{ ml: 1 }}>
            <Checkbox checked={selected} onClick={onSelectRow} />
          </Stack>
        </TableCell>

        <TableCell onClick={handleClick}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <FileThumbnail file={type} sx={{ width: 28, height: 28 }} />

            <Typography
              noWrap
              variant="inherit"
              sx={{
                maxWidth: 320,
                cursor: 'pointer',
                typography: 'subtitle2',
                ...(details.value && { fontWeight: 'fontWeightBold' }),
              }}
            >
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center" onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {chunks}
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
        >
          {status.toLowerCase().startsWith('fail') && error && (
            <Tooltip title={error}>
              <Label variant="soft" color={color as LabelColor}>
                {status}
              </Label>
            </Tooltip>
          )}
          {(!status.toLowerCase().startsWith('fail') || !error) && (
            <Label variant="soft" color={color as LabelColor}>
              {status}
            </Label>
          )}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {fData(size)}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          {type}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(modifiedAt), 'dd MMM yyyy')}
            secondary={format(new Date(modifiedAt), 'p')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell align="right" onClick={handleClick}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': {
                  fontSize: 12,
                },
              },
            }}
          >
            {shared &&
              shared.map((person) => (
                <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
              ))}
          </AvatarGroup>
        </TableCell>

        <TableCell
          align="right"
          sx={{
            px: 1,
            pr: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          <Checkbox
            color="warning"
            icon={<Iconify icon="eva:star-outline" />}
            checkedIcon={<Iconify icon="eva:star-fill" />}
            checked={favorite.value}
            onChange={favorite.onToggle}
            sx={{ p: 0.75 }}
          />

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
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

      <FileManagerFileDetails
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
