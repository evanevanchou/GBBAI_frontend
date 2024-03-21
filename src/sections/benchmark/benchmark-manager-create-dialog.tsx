import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogActions from '@mui/material/DialogActions';
import { Stack, Portal, Dialog, CardHeader, ClickAwayListener } from '@mui/material';

import { Upload } from 'src/components/upload';
import Scrollbar from 'src/components/scrollbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 1999,
  minHeight: 440,
  outline: 'none',
  display: 'flex',
  position: 'fixed',
  flexDirection: 'row',
  margin: theme.spacing(3),
  boxShadow: theme.customShadows.z20,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const modes = [
  {
    label: 'Simulation data',
    description: `The benchmark assignment will utilize simulation data to produce metrics.`,
  },
  {
    label: 'Custom data',
    description: 'Users will upload their own data to run benchmarks and generate metrics.',
  },
];

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  onRefresh: () => void;
};

export default function CreateBenchmarkDialog({ open, onClose, onRefresh }: Props) {
  // const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedMode, setSelectedMode] = useState(modes[0].label);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  const schema = Yup.object().shape({
    name: Yup.string().required('Benchmakr job name is required'),
    param: Yup.string().required('Param name is required'),
    tags: Yup.array(),
  });

  const defaultValues: { name: string; param: string; tags: string[] } = {
    name: `benchmark-${currentTimestamp}`,
    param: `param-${currentTimestamp}`,
    tags: [],
  };

  const [files, setFiles] = useState<(File | string)[]>([]);

  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (open) {
      setCurrentTimestamp(Date.now());
      reset(defaultValues);
    }
    // eslint-disable-next-line
  }, [open, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
      // const payload = { ...data, tags: data.tags || [] };
      // const res = await createKnowledge(payload);
      // if (res && res.success) {
      //   enqueueSnackbar('Created successfully');
      //   onRefresh();
      //   onClose();
      // } else {
      //   if (res && !res.success) enqueueSnackbar(res.message, { variant: 'error' });
      // }
    } catch (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  });

  const handleSelectMode = useCallback(
    (newValue: string) => {
      if (selectedMode !== newValue) setSelectedMode(newValue);
    },
    [selectedMode]
  );

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles([...files, ...newFiles]);
    },
    [files]
  );

  // const handleUpload = () => {
  //   onClose();
  //   console.info('ON UPLOAD');
  // };

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  const renderModes = modes.map((mode) => (
    <Stack
      key={mode.label}
      spacing={2.5}
      component={Paper}
      variant="outlined"
      direction="row"
      alignItems="center"
      onClick={() => handleSelectMode(mode.label)}
      sx={{
        p: 2.5,
        py: 2,
        position: 'relative',
        cursor: 'pointer',
        ...(mode.label === selectedMode && {
          boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
        }),
      }}
    >
      <Box sx={{ width: 28, height: 28 }}>
        {mode.label.startsWith('Simulation') && (
          <Icon icon="material-symbols-light:data-table-rounded" width={28} height={28} />
        )}
        {mode.label.startsWith('Custom') && (
          <Icon
            icon="iconoir:upload-square-solid"
            width={23}
            height={23}
            style={{ marginTop: 2.5, marginLeft: 1 }}
          />
        )}
      </Box>
      <Stack spacing={0.5}>
        <Typography variant="subtitle1" component="div">
          {mode.label}
        </Typography>
        <Typography variant="body2" component="div" color="text.secondary">
          {mode.description}
        </Typography>
      </Stack>
    </Stack>
  ));

  return (
    <Portal>
      <ClickAwayListener onClickAway={() => {}}>
        <Dialog open={open} onClose={onClose}>
          <RootStyle
            sx={{
              top: 0,
              left: 0,
              display: 'flex',
              margin: 'auto',
              width: { xs: '90%', md: '85%', lg: '75%' },
              height: { xs: '90vh', md: '80vh' },
              maxWidth: 1100,
            }}
          >
            <Stack sx={{ width: '100%' }}>
              <CardHeader title="Create benchmark" sx={{ mb: 1.5 }} />

              <Scrollbar sx={{ flexDirection: 'row' }}>
                <FormProvider methods={methods} onSubmit={onSubmit}>
                  <Box sx={{ mx: 3.5, mt: 2, mb: 2 }}>
                    <Box
                      sx={{
                        gap: 3,
                        display: 'grid',
                        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
                      }}
                    >
                      {renderModes}
                    </Box>

                    <Divider sx={{ my: 4 }} style={{ borderStyle: 'dashed' }} />

                    <Stack sx={{ mt: 1, mb: 3 }} spacing={3}>
                      <Box
                        sx={{
                          display: 'grid',
                          gap: 3,
                          gridTemplateColumns: {
                            xs: 'repeat(1, 1fr)',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                          },
                        }}
                      >
                        <RHFTextField name="name" label="Name" fullWidth size="medium" />
                        <RHFTextField fullWidth name="param" label="Param" size="medium" />

                        <RHFAutocomplete
                          size="medium"
                          name="tags"
                          label="Tags"
                          placeholder="+ Tags"
                          multiple
                          freeSolo
                          autoSelect
                          options={[]}
                          getOptionLabel={(option) => option}
                          renderOption={(props, option) => (
                            <li {...props} key={option}>
                              {option}
                            </li>
                          )}
                          renderTags={(selected, getTagProps) =>
                            selected.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                key={option}
                                label={option}
                                size="small"
                                color="info"
                                variant="soft"
                              />
                            ))
                          }
                        />
                      </Box>
                      {selectedMode === 'Custom data' && (
                        <Stack sx={{ alignItems: 'center' }}>
                          <Upload
                            multiple
                            files={files}
                            onDrop={handleDrop}
                            onRemove={handleRemoveFile}
                          />
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </FormProvider>
              </Scrollbar>

              <Divider />

              <DialogActions>
                <LoadingButton
                  loading={isSubmitting}
                  disabled={selectedMode === 'Question answer'}
                  type="submit"
                  variant="contained"
                  onClick={onSubmit}
                >
                  Confirm
                </LoadingButton>
                <Button variant="outlined" color="inherit" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Stack>
          </RootStyle>
        </Dialog>
      </ClickAwayListener>
    </Portal>
  );
}
