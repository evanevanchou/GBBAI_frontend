import { format, formatDistanceToNowStrict } from 'date-fns';
import sidebarClose from '@iconify/icons-lucide/sidebar-close';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { IFunction } from 'src/types/function';
// ----------------------------------------------------------------------

const TABLE_HEADS = [
  { id: 'description', label: 'Description', width: 260, minWidth: 200, maxWidth: 380 },
  { id: 'params', label: 'Parameters', width: 180, minWidth: 180, maxWidth: 300 },
  { id: 'status', label: 'Status', width: 140, minWidth: 100, maxWidth: 160 },
  { id: 'createdAt', label: 'Created', width: 160, minWidth: 160, maxWidth: 220 },
  { id: 'modifiedAt', label: 'Modified', width: 160, minWidth: 120, maxWidth: 220 },
  { id: 'tags', label: 'Tags', width: 140, minWidth: 100, maxWidth: 'auto' },
  { id: '', width: 40, minWidth: 30, maxWidth: 60 },
];

const TableHeaderStyle = styled(TableCell)(({ theme }) => ({
  fontSize: '13px',
  fontWeight: '600',
  color: theme.palette.text.secondary,
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
  backgroundColor: 'transparent',
}));

const TableRowStyle = styled(TableCell)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

// ----------------------------------------------------------------------

type Props = {
  func: IFunction;
};

export default function FunctionDetailsTable({ func }: Props) {
  const { description, params, createdAt, modifiedAt, tags } = func;

  const handleClick = () => {};

  return (
    <Card sx={{ px: 0, py: 0.75, mb: 1 }}>
      <TableContainer sx={{ overflowY: 'hidden', py: 0.5 }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_HEADS.map((head, index) => (
                <TableHeaderStyle
                  key={head.id}
                  sx={{
                    width: head.width,
                    minWidth: head.minWidth,
                    maxWidth: head.maxWidth,
                    pl: index === 0 ? 2.5 : 1,
                  }}
                >
                  {head.label}
                </TableHeaderStyle>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{
                  px: 2.5,
                  p4: 4,
                  color: 'text.primary',
                  maxWidth: 380,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: '-webkit-box',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                  }}
                >
                  {description || 'N/A'}
                </Typography>
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap', maxWidth: 300 }}
              >
                {!!params && (
                  <Stack direction="row" spacing={0.5}>
                    {params.map((param, index) => (
                      <Chip
                        key={index}
                        size="small"
                        color="default"
                        variant="soft"
                        label={param}
                        sx={{ height: 23 }}
                      />
                    ))}
                  </Stack>
                )}
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
              >
                <Label
                  variant="soft"
                  color={(func.status === 'published' && 'success') || 'warning'}
                >
                  {func.status}
                </Label>
              </TableRowStyle>

              <TableRowStyle onClick={handleClick} sx={{ whiteSpace: 'nowrap' }}>
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
              </TableRowStyle>

              <TableRowStyle
                align="left"
                onClick={handleClick}
                sx={{ color: 'text.primary', whiteSpace: 'nowrap' }}
              >
                {formatDistanceToNowStrict(new Date(modifiedAt), {
                  addSuffix: true,
                })}
              </TableRowStyle>

              <TableRowStyle
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
              </TableRowStyle>
              <TableRowStyle align="right">
                <IconButton onClick={() => {}}>
                  <Iconify icon={sidebarClose} width={18} height={18} />
                </IconButton>
              </TableRowStyle>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
