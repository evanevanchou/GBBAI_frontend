import { useRef } from 'react';

import { styled } from '@mui/material/styles';
import {
  Stack,
  Portal,
  Dialog,
  Button,
  Divider,
  CardHeader,
  DialogActions,
  ClickAwayListener,
} from '@mui/material';

import Scrollbar from 'src/components/scrollbar';

import { IConfiguration } from 'src/types/chat';

import DataCopilotConfigKb from './data-copilot-config-kb';
import DataCopilotConfigAOAI from './data-copilot-config-aoai';
import DataCopilotConfigFunction from './data-copilot-config-function';
// import { useMockedUser } from 'src/hooks/use-mocked-user';

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

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  configurations: IConfiguration;
  onUpdate: (config: IConfiguration) => void;
  selectedIndex: string;
  onSelectIndex: (index: string) => void;
};

export default function DataCopilotConfigDialog({
  open,
  onClose,
  configurations,
  onUpdate,
  selectedIndex,
  onSelectIndex,
}: Props) {
  // const { user } = useAuth();

  // const

  const formRef = useRef<HTMLFormElement>(null);

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
    onClose();
  };

  return (
    <Portal>
      <ClickAwayListener onClickAway={() => {}}>
        <Dialog open={open} onClose={onClose}>
          <RootStyle
            sx={{
              ...{
                top: 0,
                left: 0,
                display: 'flex',
                margin: 'auto',
                width: { xs: '90%', md: '85%', lg: '75%' },
                height: { xs: '90vh', md: '80vh' },
                maxWidth: 1100,
              },
            }}
          >
            <Stack sx={{ width: '100%' }}>
              <CardHeader title="Configuration" sx={{ mb: 1.5 }} />

              <Scrollbar sx={{ flexDirection: 'row' }}>
                <DataCopilotConfigAOAI
                  onClose={() => {}}
                  configs={configurations}
                  ref={formRef}
                  onUpdate={onUpdate}
                />

                <DataCopilotConfigFunction onClose={() => {}} />

                <DataCopilotConfigKb onSelectIndex={onSelectIndex} selectedIndex={selectedIndex} />
              </Scrollbar>

              <Divider />

              <DialogActions>
                <Button type="submit" variant="contained" onClick={handleButtonClick}>
                  Confirm
                </Button>
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
