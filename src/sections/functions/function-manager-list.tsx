import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { _allFunctions, FUNCTION_STATUS_OPTIONS } from 'src/_mock';

import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import { IFunction, IFunctionFilters, IFunctionFilterValue } from 'src/types/function';

import FunctionManagerTable from './function-manager-table';
import FunctionManagerFilters from './function-manager-filters';
import FunctionManagerFiltersResult from './function-manager-filters-result';
import FunctionManagerNewFunctionDialog from './function-manager-new-function-dialog';

// ----------------------------------------------------------------------

const defaultFilters: IFunctionFilters = {
  name: '',
  tags: [],
  statuses: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function FunctionManagerList() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [tableData, setTableData] = useState(_allFunctions);

  const [filters, setFilters] = useState(defaultFilters);

  const allTags = Array.from(new Set(_allFunctions.map((func) => func.tags).flat()));

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset =
    !!filters.name ||
    !!filters.tags.length ||
    !!filters.statuses.length ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IFunctionFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const renderFilters = (
    <Stack
      spacing={2}
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-end', md: 'center' }}
    >
      <FunctionManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        statusOptions={FUNCTION_STATUS_OPTIONS}
        tagOptions={allTags}
      />
    </Stack>
  );

  const renderResults = (
    <FunctionManagerFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Card sx={{ p: 0 }}>
      <CardHeader
        title="List"
        action={
          <Button
            size="small"
            sx={{ mr: 1 }}
            variant="contained"
            startIcon={<Icon icon={plusFill} />}
            onClick={upload.onTrue}
          >
            Function
          </Button>
        }
      />

      <Stack
        spacing={2.5}
        sx={{
          mt: { xs: 2, md: 3 },
          mb: { xs: 4.5, md: 4.5 },
          mx: 3,
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound ? (
        <EmptyContent filled title="No Data" sx={{ py: 8, m: 3 }} />
      ) : (
        <FunctionManagerTable
          table={table}
          tableData={tableData}
          dataFiltered={dataFiltered}
          onDeleteRow={handleDeleteItem}
          notFound={notFound}
          onOpenConfirm={confirm.onTrue}
        />
      )}

      <FunctionManagerNewFunctionDialog open={upload.value} onClose={upload.onFalse} />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
  dateError,
}: {
  inputData: IFunction[];
  comparator: (a: any, b: any) => number;
  filters: IFunctionFilters;
  dateError: boolean;
}) {
  const { name, tags, statuses, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (func) => func.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (tags.length) {
    inputData = inputData.filter((func) => func.tags?.some((tag) => tags.includes(tag)));
  }

  if (statuses.length) {
    inputData = inputData.filter((func) => statuses.includes(func.status.toLowerCase()));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (func) =>
          fTimestamp(func.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(func.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
