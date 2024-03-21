import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { IBenchmark } from 'src/types/benchmark';

import BenchmarkManagerTableRow from './benchmark-manager-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', width: 160 },
  { id: 'description', label: 'Description', width: 220 },
  { id: 'status', label: 'Status', width: 120 },
  { id: 'createdAt', label: 'Created', width: 140 },
  { id: 'modifiedAt', label: 'Modified', width: 140 },
  { id: 'tags', label: 'Tags', align: 'left', width: 140 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: IBenchmark[];
  notFound: boolean;
  dataFiltered: IBenchmark[];
  onOpenConfirm: VoidFunction;
  onDeleteRow: (id: string) => void;
};

export default function BenchmarkManagerTable({
  table,
  tableData,
  notFound,
  onDeleteRow,
  dataFiltered,
  onOpenConfirm,
}: Props) {
  const theme = useTheme();

  const router = useRouter();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const denseHeight = dense ? 52 : 72;

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.gbbai.benchmark.details(id));
    },
    [router]
  );

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          mx: 0,
          mt: -2,
        }}
      >
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={dataFiltered.length}
          checkboxMl={0}
          denseCheckboxMl={-1}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
          action={
            <>
              <Tooltip title="Share">
                <IconButton color="primary">
                  <Iconify icon="solar:share-bold" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Delete">
                <IconButton color="primary" onClick={onOpenConfirm}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            </>
          }
          sx={{
            pl: 2,
            pr: 2,
            top: 0,
            left: 0,
            right: 0,
            width: 'auto',
          }}
        />

        <TableContainer>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              visible={selected.length === 0}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <BenchmarkManagerTableRow
                    key={row.id}
                    row={row}
                    dense={dense}
                    selected={selected.includes(row.id)}
                    onEditRow={() => handleEditRow(row.id)}
                    onSelectRow={() => onSelectRow(row.id)}
                    onDeleteRow={() => onDeleteRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}
