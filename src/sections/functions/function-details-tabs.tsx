import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';

import { IFunction } from 'src/types/function';

import FunctionDetailsCode from './function-details-code';

// ----------------------------------------------------------------------

type Props = {
  func: IFunction;
};

export default function FunctionDetailsTabs({ func }: Props) {
  const [currentTab, setCurrentTab] = useState('Code');

  const FUNCTION_TABS = [
    {
      value: 'Code',
      component: <FunctionDetailsCode func={func} />,
    },
    {
      value: 'Logs',
      component: null,
    },
    {
      value: 'Configuration',
      component: null,
    },
    {
      value: 'Test',
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
        {FUNCTION_TABS.map((tab) => (
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
