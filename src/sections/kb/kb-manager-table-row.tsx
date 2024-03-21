import { useState, useCallback } from 'react';
import chatIcon from '@iconify/icons-entypo/chat';
import { format, formatDistanceToNowStrict } from 'date-fns';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import crowdsourceIcon from '@iconify/icons-simple-icons/crowdsource';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDoubleClick } from 'src/hooks/use-double-click';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FileThumbnail from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IDatasetManager } from 'src/types/dataset';

import KbManagerKbDetails from './kb-manager-kb-details';
import FileManagerShareDialog from './kb-manager-share-dialog';

// ----------------------------------------------------------------------

type Props = {
  row: IDatasetManager;
  dense: boolean;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function KbManagerTableRow({
  row,
  dense,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { name, createdAt, modifiedAt, type, shared, tags, size } = row;

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const [inviteEmail, setInviteEmail] = useState('');

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
    copy(row.id);
  }, [copy, enqueueSnackbar, row.id]);

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

        <TableCell onClick={handleClick} sx={{ maxWidth: 180 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <FileThumbnail file="folder" sx={{ width: 23, height: 23 }} />

            <Typography noWrap variant="subtitle2" sx={{ cursor: 'pointer' }}>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="left" onClick={handleClick}>
          {type && (
            <Chip
              size="small"
              color={type.toLowerCase() === 'qa' ? 'primary' : 'warning'}
              variant="soft"
              icon={
                <Iconify
                  icon={type.toLowerCase() === 'qa' ? chatIcon : crowdsourceIcon}
                  sx={{ width: 13, height: 13 }}
                />
              }
              label={type === '' ? 'QA' : type}
              sx={{ height: 23, pl: 0.4, textTransform: 'uppercase' }}
            />
          )}
        </TableCell>

        <TableCell onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={format(new Date(createdAt), 'dd MMM yyyy')}
            secondary={format(new Date(createdAt), 'p')}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>

        <TableCell
          align="left"
          onClick={handleClick}
          sx={{ color: 'text.primary', whiteSpace: 'nowrap', maxWidth: 180 }}
        >
          {tags && tags.length > 0 && (
            <Stack direction="row" spacing={0.5}>
              <Chip
                size="small"
                color="default"
                variant="soft"
                label={tags[0]}
                sx={{ height: 23 }}
              />
              {tags.length > 1 && (
                <Chip
                  size="small"
                  color="default"
                  variant="soft"
                  label={tags[1]}
                  sx={{ height: 23 }}
                />
              )}
              {tags.length > 2 && (
                <Chip
                  size="small"
                  color="info"
                  variant="soft"
                  label={`+${tags.length - 1}`}
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
          {formatDistanceToNowStrict(new Date(modifiedAt), {
            addSuffix: true,
          })}
        </TableCell>

        <TableCell align="center" onClick={handleClick}>
          {size}
        </TableCell>

        <TableCell align="right" onClick={handleClick}>
          <AvatarGroup
            max={4}
            sx={{
              display: 'inline-flex',
              [`& .${avatarGroupClasses.avatar}`]: {
                width: 24,
                height: 24,
                '&:first-of-type': { fontSize: 12 },
              },
            }}
          >
            {shared &&
              shared.map((person) => (
                <Avatar key={person.id} alt={person.name} src={person.avatarUrl} />
              ))}
          </AvatarGroup>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, pr: 2, whiteSpace: 'nowrap' }}>
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

      <KbManagerKbDetails
        item={row}
        favorited={false}
        onFavorite={() => {}}
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
