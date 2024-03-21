import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';

import { Box, Stack, Button, Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import {
  getStorage,
  setStorage,
  AOAI_CREDENTIAL_KEY,
  AOAI_STORAGE_CONFIG,
} from 'src/hooks/use-local-storage';

import { getConfiguration } from 'src/api/gpt';

import SvgColor from 'src/components/svg-color';
import { useSettingsContext } from 'src/components/settings';

import { MlAppStruct } from 'src/types/app';
import { Message, IConfiguration } from 'src/types/chat';
import { IAoaiResourceItem } from 'src/types/azure-resource';

import ChatWindow from './components/ChatWindow';
import DataCopilotConfigDialog from './components/config-panel/data-copilot-config-dialog';

// ----------------------------------------------------------------------

export const modeColorSets = {
  'open-chat': 'linear-gradient(135deg, #3DA770 0%, #1F80B3 74%)',
  rag: 'linear-gradient(135deg, #B37F40 0%, #AA2E9B 74%)',
  'function-calling': 'linear-gradient(135deg, #3E88C6 0%, #8636C3 74%)',
} as any;

export const sendBtnColorSets = {
  'open-chat': '#1F80B3',
  rag: '#B37F40',
  'function-calling': '#8636C3',
} as any;

// ----------------------------------------------------------------------

type Props = {
  mlApp: MlAppStruct;
};

export default function TvCopilot({ mlApp }: Props) {
  const settings = useSettingsContext();
  const [messages, setMessages] = useState([] as Message[]);
  const [selectedIndex, setSelectedIndex] = useState('index-servicesau');

  const aoaiCredentials: IAoaiResourceItem[] = getStorage(AOAI_CREDENTIAL_KEY);

  const aoaiResourceNames = aoaiCredentials ? aoaiCredentials.map((item) => item.resourceName) : [];
  const primaryResources = aoaiCredentials ? aoaiCredentials.filter((item) => item.primary) : [];
  const primaryResourceName =
    primaryResources && primaryResources.length > 0 ? primaryResources[0].resourceName : '';
  let intialResourceName = '';
  if (primaryResourceName.length > 0) {
    intialResourceName = primaryResourceName;
  } else if (aoaiResourceNames && aoaiResourceNames.length > 0) {
    intialResourceName = aoaiResourceNames[0];
  }

  const localConfgutrations: IConfiguration = getStorage(AOAI_STORAGE_CONFIG);

  const initialConfigurations: IConfiguration = getConfiguration(intialResourceName);
  const [configurations, setConfigurations] = useState<IConfiguration>({
    ...initialConfigurations,
    ...localConfgutrations,
  });

  const handleUpdateConfigs = (config: IConfiguration) => {
    setConfigurations(config);
    setStorage(AOAI_STORAGE_CONFIG, config);
  };

  const hanldeClearHistory = () => {
    setMessages([]);
  };

  const handleSelectIndex = (index: string) => {
    setSelectedIndex(index);
  };

  const config = useBoolean();

  const isNavHorizontal = settings.themeLayout === 'horizontal';

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Button
          to={paths.gbbai.appGallery.root}
          component={RouterLink}
          size="small"
          color="inherit"
          startIcon={<Icon icon={arrowIosBackFill} style={{ marginRight: '-5px' }} />}
          sx={{ display: 'flex' }}
        >
          Gallery
        </Button>

        <Stack direction="row" alignItems="center">
          <Tooltip title="Clear histroy">
            <IconButton
              size="small"
              color="default"
              onClick={hanldeClearHistory}
              sx={{ width: 36, height: 36 }}
            >
              <SvgColor src="/assets/icons/modules/ic-sweep.svg" sx={{ width: 22, height: 22 }} />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            color="default"
            onClick={config.onTrue}
            sx={{ width: 36, height: 36 }}
          >
            <SvgColor src="/static/icons/apps/ic_settings.svg" sx={{ width: 20, height: 20 }} />
          </IconButton>
        </Stack>
      </Stack>

      <Box
        sx={{
          height: isNavHorizontal ? 'calc(100vh - 328px)' : 'calc(100vh - 204px)',
          display: 'flex',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        <ChatWindow
          configuration={configurations}
          messages={messages}
          onUpdateMessages={setMessages}
          configurations={configurations}
        />
      </Box>

      <DataCopilotConfigDialog
        open={config.value}
        onClose={config.onFalse}
        configurations={configurations}
        onUpdate={handleUpdateConfigs}
        selectedIndex={selectedIndex}
        onSelectIndex={handleSelectIndex}
      />
    </>
  );
}
