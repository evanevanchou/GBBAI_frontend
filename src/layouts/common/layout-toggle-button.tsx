import { m } from 'framer-motion';

// import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import SvgColor from 'src/components/svg-color';
import { varHover } from 'src/components/animate';
import { useSettingsContext } from 'src/components/settings/context';

// ----------------------------------------------------------------------

export default function LayoutToggleButton() {
  // const { themeMode, onToggleMode } = useSettings();

  const settings = useSettingsContext();

  return (
    <IconButton
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      onClick={() =>
        settings.themeLayout === 'vertical'
          ? settings.onUpdate('themeLayout', 'horizontal')
          : settings.onUpdate('themeLayout', 'vertical')
      }
      sx={{
        padding: 0,
        width: 40,
        height: 40,
        // color: "primary.main",
        color: 'default',
        '& .svg-color': {
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.grey[600]} 0%, ${theme.palette.grey[700]} 80%)`,
          // ...(settings.themeLayout === 'vertical' && {
          //   background: (theme) =>
          //     `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          // }),
        },
      }}
    >
      {/* <Box
        // color="red"
        component="img"
        src={
          settings.themeLayout === 'vertical'
            ? iconUrl('ic-layout-horizontal')
            : iconUrl('ic-layout-vertical')
        }
        sx={{
          width: 26,
          height: 26,
          color: 'red',
          // flexShrink: 0,
        }}
      /> */}
      <SvgColor
        src={`/assets/icons/setting/${
          settings.themeLayout === 'vertical' ? 'ic-layout-horizontal' : 'ic-layout-vertical'
        }.svg`}
        sx={{ width: 24, height: 24, mr: 0 }}
      />
      {/* <Icon
        icon={settings.themeLayout === 'vertical' ? sunFill : moonFill}
        width={22}
        height={22}
      /> */}
    </IconButton>
  );
}
