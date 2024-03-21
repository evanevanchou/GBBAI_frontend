import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import { _allFunctions } from 'src/_mock';

import EmptyContent from 'src/components/empty-content';
import { useTable, getComparator } from 'src/components/table';

import { IFunction, IFunctionFilters, IFunctionFilterValue } from 'src/types/function';

import FileManagerFilters from './function-manager-filters';
import FunctionManagerTable from './function-manager-table';
import FileManagerFiltersResult from './function-manager-filters-result';

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
  const theme = useTheme();

  const table = useTable({
    defaultRowsPerPage: 5,
    defaultDense: true,
    defaultSelected: ['func_1', 'func_2', 'func_3', 'func_4', 'func_5', 'func_6', 'func_7'],
  });

  // const [tableData, setTableData] = useState(_allFunctions);
  const tableData = _allFunctions;

  const [filters, setFilters] = useState(defaultFilters);

  const allTags = Array.from(new Set(_allFunctions.map((func) => func.tags).flat()));

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const canReset =
    !!filters.name || !!filters.statuses.length || (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IFunctionFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({ ...prevState, [name]: value }));
    },
    [table]
  );

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
        filters={filters}
        onFilters={handleFilters}
        //
        tagOptions={allTags}
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
      <Stack spacing={2} sx={{ mt: { xs: 1, md: 2 }, mb: { xs: 1, md: 2.5 }, mx: 2 }}>
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound ? (
        <EmptyContent filled title="No Data" sx={{ py: 10 }} />
      ) : (
        <FunctionManagerTable
          table={table}
          tableData={tableData}
          dataFiltered={dataFiltered}
          notFound={notFound}
        />
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IFunction[];
  comparator: (a: any, b: any) => number;
  filters: IFunctionFilters;
}) {
  const { name, tags } = filters;

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
    inputData = inputData.filter((func) => func.tags?.some((tag) => tags.includes(tag)));
  }

  return inputData;
}
