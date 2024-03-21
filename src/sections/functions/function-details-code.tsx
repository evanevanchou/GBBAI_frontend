import { useState } from 'react';
import flashFill from '@iconify/icons-mingcute/flash-fill';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import { IFunction } from 'src/types/function';

import FunctionDetailsCopilot from './function-details-copilot';
import FunctionDetailsCodeMeta from './function-details-code-meta';
import FunctionDetailsCodeEditor from './function-details-code-editor';
import FunctionDetailsCodeDependencies from './function-details-code-dependencies';

// ----------------------------------------------------------------------

type Props = {
  func: IFunction;
};

export default function FunctionDetailsCode({ func }: Props) {
  const [copilotTrigger, setCopilotTrigger] = useState('');
  const [funcCode, setFuncCode] = useState(func.code);
  const [funcMeta, setFuncMeta] = useState(func.meta);

  const handleClick = (trigger: string) => {
    setCopilotTrigger(trigger);
  };

  const handleUpdateCode = (data: string) => {
    setFuncCode(data);
  };

  const handleUpdateMeta = (data: string) => {
    setFuncMeta(data);
  };

  const handleCopilotCallback = (data: string) => {
    if (copilotTrigger === 'code') {
      if (data.includes('```python')) {
        const code = data.split('```python\n')[1].split('```\n')[0];
        setFuncCode(code);
      } else setFuncCode(data);
    } else if (copilotTrigger === 'meta') setFuncMeta(data);
  };

  return (
    <Stack>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Stack spacing={3}>
            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
              <Card sx={{ height: 'auto', p: -1.5 }}>
                <CardHeader
                  title="Editor"
                  sx={{ mt: -1, mb: -0.5 }}
                  action={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: -1.5 }}>
                      <Button
                        size="small"
                        color="inherit"
                        variant="soft"
                        onClick={() => {}}
                        sx={{ textTransform: 'capitalize' }}
                      >
                        Import
                      </Button>

                      <Button
                        size="small"
                        color="inherit"
                        variant="soft"
                        endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                      >
                        Python
                      </Button>

                      <Button
                        size="small"
                        color="primary"
                        variant="contained"
                        startIcon={<Iconify icon={flashFill} />}
                      >
                        Deploy
                      </Button>
                      <IconButton size="small" onClick={() => handleClick('code')}>
                        <Box
                          component="img"
                          src="/assets/icons/modules/ic_copilot.svg"
                          sx={{ width: 26, height: 26, cursor: 'pointer' }}
                        />
                      </IconButton>
                    </Stack>
                  }
                />

                <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

                <Stack sx={{ px: 3 }} spacing={2}>
                  <FunctionDetailsCodeEditor code={funcCode} updateCode={handleUpdateCode} />
                </Stack>
              </Card>
            </Stack>

            <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
              <Card sx={{ height: 'auto', p: -1.5 }}>
                <CardHeader
                  title="Function definition"
                  sx={{ mt: -1, mb: -0.5 }}
                  action={
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ py: -1.5 }}>
                      <IconButton size="small" onClick={() => handleClick('meta')}>
                        <Box
                          component="img"
                          src="/assets/icons/modules/ic_copilot.svg"
                          sx={{ width: 26, height: 26, cursor: 'pointer' }}
                        />
                      </IconButton>
                    </Stack>
                  }
                />

                <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />

                <Stack sx={{ px: 3 }} spacing={2}>
                  <FunctionDetailsCodeMeta meta={funcMeta} updateMeta={handleUpdateMeta} />
                </Stack>
              </Card>
            </Stack>
          </Stack>
        </Grid>

        <Grid xs={12} md={4}>
          <FunctionDetailsCodeDependencies dependencies={func.dependencies} />
        </Grid>
      </Grid>

      <FunctionDetailsCopilot
        open={!!copilotTrigger}
        trigger={copilotTrigger}
        context={funcCode}
        onClose={() => handleClick('')}
        callBack={handleCopilotCallback}
      />
    </Stack>
  );
}
