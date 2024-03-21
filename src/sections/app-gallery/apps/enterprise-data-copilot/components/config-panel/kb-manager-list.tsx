import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTimestamp } from 'src/utils/format-time';

import { useGetKmmList } from 'src/api/kmm';
import { FILE_TYPE_OPTIONS } from 'src/_mock';

import EmptyContent from 'src/components/empty-content';
import { SkeletonBoxTable } from 'src/components/skeleton';
import { fileFormat } from 'src/components/file-thumbnail';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useTable, getComparator } from 'src/components/table';

import { IDataset, IDatasetFilters, IDatasetFilterValue } from 'src/types/dataset';

import KbManagerTable from './kb-manager-table';
import FileManagerFilters from './kb-manager-filters';
import FileManagerFiltersResult from './kb-manager-filters-result';

// ----------------------------------------------------------------------

const SkeletonLoad = <SkeletonBoxTable rowNumber={5} sx={{ mb: 3 }} />;

const defaultFilters: IDatasetFilters = {
  name: '',
  tags: [],
  status: '',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

type Props = {
  selectedIndex: string;
  onSelectIndex: (index: string) => void;
};

// ----------------------------------------------------------------------

export default function KbManagerList({ selectedIndex, onSelectIndex }: Props) {
  const theme = useTheme();

  const [refreshKey, setRefreshKey] = useState(0);

  const openDateRange = useBoolean();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState<IDataset[]>([]);

  const { kmmList, isLoading, isEmpty } = useGetKmmList(refreshKey);

  const table = useTable({
    defaultRowsPerPage: 5,
    defaultDense: true,
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  useEffect(() => {
    if (!isLoading && !isEmpty) {
      setTableData(kmmList);
      const selected = kmmList
        ? kmmList.filter((row) => row.index === selectedIndex).map((row) => row.id)
        : [];
      table.setSelected(selected);
    }
    // eslint-disable-next-line
  }, [isEmpty, kmmList, isLoading]);

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
    !!filters.name || !!filters.tags.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleRefresh = () => {
    setRefreshKey(Math.floor(Math.random() * 1000));
  };

  const handleFilters = useCallback(
    (name: string, value: IDatasetFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
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
      <FileManagerFilters
        openDateRange={openDateRange.value}
        onCloseDateRange={openDateRange.onFalse}
        onOpenDateRange={openDateRange.onTrue}
        //
        filters={filters}
        onFilters={handleFilters}
        //
        dateError={dateError}
        typeOptions={FILE_TYPE_OPTIONS}
      />
    </Stack>
  );

  const renderResults = (
    <FileManagerFiltersResult
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
    <Card
      sx={{
        p: 0,
        mx: 4.5,
        mb: 3,
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: `${theme.palette.background.neutral}`,
      }}
    >
      <Stack spacing={2.5} sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 1, md: 2.5 }, mx: 2 }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>
      {isLoading && SkeletonLoad}
      {!isLoading && (
        <>
          {notFound ? (
            <EmptyContent filled title="No Data" sx={{ py: 10, m: 3, borderRadius: 1 }} />
          ) : (
            <KbManagerTable
              table={table}
              tableData={tableData}
              dataFiltered={dataFiltered}
              notFound={notFound}
              onRefresh={handleRefresh}
              onSelectIndex={onSelectIndex}
            />
          )}
        </>
      )}

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
  inputData: IDataset[];
  comparator: (a: any, b: any) => number;
  filters: IDatasetFilters;
  dateError: boolean;
}) {
  const { name, tags, startDate, endDate } = filters;

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
    inputData = inputData.filter((file) => tags.includes(fileFormat(file.type)));
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
