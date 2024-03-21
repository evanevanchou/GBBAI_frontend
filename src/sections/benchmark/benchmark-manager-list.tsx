import { Icon } from '@iconify/react';
import { useState, useCallback } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { _allBenchmarks } from 'src/_mock';

import EmptyContent from 'src/components/empty-content';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import { IBenchmark, IBenchmarkFilters, IBenchmarkFilterValue } from 'src/types/benchmark';

import BenchmarkManagerTable from './benchmark-manager-table';
import BenchmarkManagerFilters from './benchmark-manager-filters';
import CreateBenchmarkDialog from './benchmark-manager-create-dialog';
import BenchmarkManagerFiltersResult from './benchmark-manager-filters-result';

// ----------------------------------------------------------------------

const defaultFilters: IBenchmarkFilters = {
  name: '',
  tags: [],
  statuses: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function BenchmarkManagerList() {
  const table = useTable({ defaultRowsPerPage: 10 });

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const upload = useBoolean();

  const [tableData, setTableData] = useState(_allBenchmarks);

  const [filters, setFilters] = useState(defaultFilters);

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

  const allTags = Array.from(new Set(_allBenchmarks.map((item) => item.tags).flat()));
  const allStatuses = Array.from(new Set(_allBenchmarks.map((item) => item.status).flat()));

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
    (name: string, value: IBenchmarkFilterValue) => {
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
      <BenchmarkManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        statusOptions={allStatuses}
        tagOptions={allTags}
      />
    </Stack>
  );

  const renderResults = (
    <BenchmarkManagerFiltersResult
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
            Benchmark
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
        <EmptyContent filled title="No Data" sx={{ py: 10, m: 3 }} />
      ) : (
        <BenchmarkManagerTable
          table={table}
          tableData={tableData}
          dataFiltered={dataFiltered}
          onDeleteRow={handleDeleteItem}
          notFound={notFound}
          onOpenConfirm={confirm.onTrue}
        />
      )}

      <CreateBenchmarkDialog open={upload.value} onClose={upload.onFalse} onRefresh={() => {}} />

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
  inputData: IBenchmark[];
  comparator: (a: any, b: any) => number;
  filters: IBenchmarkFilters;
  dateError: boolean;
}) {
  const { name, statuses, tags, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (tags.length) {
    inputData = inputData.filter((item) => item.tags?.some((tag) => tags.includes(tag)));
  }

  if (statuses.length) {
    inputData = inputData.filter((item) => statuses.includes(item.status));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (file) =>
          fTimestamp(file.createdAt) >= fTimestamp(startDate) &&
          fTimestamp(file.createdAt) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
