import { Stack, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/theme/css';
import { ColorType } from 'src/theme/palette';

import Image from 'src/components/image';
import AppTag from 'src/components/custom-tags/AppTag';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({ blur: 5 }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    top: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

type Props = {
  appName: string;
  scenario: { title: string; color: ColorType } | undefined;
  coverUrl: string;
  opacity?: number;
};

export default function AppCover({ appName, scenario, coverUrl, opacity = 0.1 }: Props) {
  const theme = useTheme();
  return (
    <RootStyle
      sx={{
        '&:before': {
          backgroundColor: alpha(theme.palette.primary.darker, opacity),
        },
      }}
    >
      <InfoStyle>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          alignItems="center"
          sx={{
            ml: { md: 0 },
            mt: { xs: 1, md: 0.5 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{appName}</Typography>
          {scenario && (
            <AppTag
              variant="filled"
              title={scenario.title}
              color={scenario.color}
              sx={{ height: 22 }}
            />
          )}
        </Stack>
      </InfoStyle>
      <Image
        alt="profile cover"
        src={coverUrl}
        sx={{ position: 'absolute', top: -400, left: 0, right: 0, bottom: 16 }}
      />
    </RootStyle>
  );
}

export const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  justifyContent: 'flex-end',
  paddingRight: theme.spacing(2.5),
  // [theme.breakpoints.up('sm')]: {
  //   justifyContent: 'center',
  // },
  // [theme.breakpoints.up('md')]: {
  //   justifyContent: 'flex-end',
  //   paddingRight: theme.spacing(3),
  // },
}));
