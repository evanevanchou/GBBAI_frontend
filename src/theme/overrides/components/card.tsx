import { alpha, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function card(theme: Theme) {
  const isLight = theme.palette.mode === 'light';
  const shadowColor = isLight ? theme.palette.grey[400] : theme.palette.common.black;
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          position: 'relative',
          // boxShadow: theme.customShadows.z1,
          boxShadow: `0 0 3px 0 ${alpha(shadowColor, 0.32)}, 0 2px 6px -3px ${alpha(
            shadowColor,
            0.14
          )}`,
          borderRadius: theme.shape.borderRadius * 1.25,
          zIndex: 0, // Fix Safari overflow: hidden with border radius
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3),
        },
      },
    },
  };
}
