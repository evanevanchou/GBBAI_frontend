import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';

import { IBenchmark } from 'src/types/benchmark';

import BenchmarkDetailsPlot1 from './benchmark-details-plot1';

// ----------------------------------------------------------------------

type Props = {
  benchmark: IBenchmark;
};

export default function BenchmarkDetailsTabs({ benchmark }: Props) {
  const [currentTab, setCurrentTab] = useState('Plot 1');

  const FUNCTION_TABS = [
    {
      value: 'Plot 1',
      component: <BenchmarkDetailsPlot1 benchmark={benchmark} />,
    },
    {
      value: 'Plot 2',
      component: null,
    },
    {
      value: 'Plot 3',
      component: null,
    },
    {
      value: 'Plot 4',
      component: null,
    },
    {
      value: 'Plot 5',
      component: null,
    },
    {
      value: 'Plot 6',
      component: null,
    },
  ];

  return (
    <Stack>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
        sx={{
          mt: 1,
          mb: 4,
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {FUNCTION_TABS.map((tab, index) => (
          <Tab
            disableRipple
            key={tab.value}
            value={tab.value}
            label={tab.value}
            style={{ marginRight: 34, minWidth: 36 }}
            sx={{ ml: 0.25 }}
          />
        ))}
      </Tabs>

      {FUNCTION_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Stack>
  );
}
