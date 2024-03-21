import refreshFill from '@iconify/icons-eva/refresh-fill';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

import Iconify from 'src/components/iconify';
import {
  emptyRows,
  TableProps,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { IDataset } from 'src/types/dataset';

import KbManagerTableRow from './kb-manager-table-row';
import { CheckedRowHeader } from './function-manager-table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Title', align: 'left', width: 220 },
  { id: 'type', label: 'Type', align: 'left', width: 120 },
  { id: 'createdAt', label: 'Created', align: 'left', width: 140 },
  { id: 'tags', label: 'Tags', align: 'left', width: 120 },
  // { id: "size", label: "Files", align: "left", width: 120 },
  { id: 'modifiedAt', label: 'Modified', align: 'left', width: 140 },
  { id: 'size', label: 'Count', align: 'center', width: 80 },
];

// ----------------------------------------------------------------------

type Props = {
  table: TableProps;
  tableData: IDataset[];
  notFound: boolean;
  dataFiltered: IDataset[];
  //
  onRefresh: () => void;
  onSelectIndex: (index: string) => void;
};

export default function KbManagerTable({
  table,
  tableData,
  notFound,
  dataFiltered,
  onSelectIndex,
  onRefresh,
}: Props) {
  const theme = useTheme();

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
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const handleRefresh = () => {
    onRefresh();
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    onSelectAllRows(
      false,
      tableData.map((row) => row.id)
    );
    onSelectRow(id);

    const row = tableData.find((_row) => _row.id === id);
    if (checked) {
      onSelectIndex('');
    } else {
      onSelectIndex(row?.index || '');
    }
  };

  const denseHeight = dense ? 48 : 72;

  return (
    <>
      <Box sx={{ position: 'relative', mx: 0, mt: -1.5 }}>
        <CheckedRowHeader
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row.id)
            )
          }
        />

        <TableContainer>
          <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              sx={{ borderBottom: `solid 1px ${theme.palette.divider}`, mb: 4 }}
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <KbManagerTableRow
                    key={row.id}
                    row={row}
                    selected={selected.includes(row.id)}
                    onSelectRow={() => handleSelectRow(row.id, selected.includes(row.id))}
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

      <IconButton
        size="small"
        onClick={handleRefresh}
        sx={{
          zIndex: 1999,
          width: 32,
          height: 32,
          color: 'inherit',
          position: 'absolute',
          bottom: 12,
          left: 12,
        }}
      >
        <Iconify icon={refreshFill} />
      </IconButton>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        sx={{ borderTop: `solid 1px ${theme.palette.divider}`, mt: -0.25 }}
      />
    </>
  );
}
