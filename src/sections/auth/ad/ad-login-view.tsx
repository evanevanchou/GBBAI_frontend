import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// import { useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function ADLoginView() {
  const { loginWithPopup } = useAuthContext();

  // const searchParams = useSearchParams();

  // const returnTo = searchParams.get('returnTo');

  const handleLoginWithPopup = useCallback(async () => {
    try {
      await loginWithPopup?.();
    } catch (error) {
      console.error(error);
    }
  }, [loginWithPopup]);

  // const handleRegisterWithPopup = useCallback(async () => {
  //   try {
  //     await loginWithPopup?.({
  //       authorizationParams: {
  //         screen_hint: 'signup',
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [loginWithPopup]);

  // const handleLoginWithRedirect = useCallback(async () => {
  //   try {
  //     await loginWithRedirect?.({
  //       appState: {
  //         returnTo: returnTo || PATH_AFTER_LOGIN,
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [loginWithRedirect, returnTo]);

  // const handleRegisterWithRedirect = useCallback(async () => {
  //   try {
  //     await loginWithRedirect?.({
  //       appState: {
  //         returnTo: returnTo || PATH_AFTER_LOGIN,
  //       },
  //       authorizationParams: {
  //         screen_hint: 'signup',
  //       },
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [loginWithRedirect, returnTo]);

  return (
    <>
      <Stack spacing={1} sx={{ flexGrow: 1, mb: 5 }}>
        <Typography variant="h4">Sign in to GBB / AI</Typography>
        <Typography sx={{ color: 'text.secondary' }}>Knowledge Management Platform</Typography>
      </Stack>

      <Stack spacing={2}>
        {/* <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          onClick={handleLoginWithRedirect}
        >
          Login with Redirect
        </Button>

        <Button
          fullWidth
          color="primary"
          size="large"
          variant="soft"
          onClick={handleRegisterWithRedirect}
        >
          Register with Redirect
        </Button>

        <Divider /> */}

        <Button
          fullWidth
          color="inherit"
          size="large"
          variant="contained"
          startIcon={<Iconify icon="logos:microsoft-icon" width={22} height={22} sx={{ mr: 1 }} />}
          onClick={handleLoginWithPopup}
        >
          Sign in
        </Button>

        {/* <Button
          fullWidth
          color="inherit"
          size="large"
          variant="contained"
          startIcon={<Iconify icon="logos:microsoft-icon" width={22} height={22} sx={{ mr: 1 }} />}
          onClick={handleLoginWithPopup}
        >
          Login With Popup
        </Button> */}

        {/* <Button
          fullWidth
          color="inherit"
          size="large"
          variant="soft"
          onClick={handleRegisterWithPopup}
        >
          Register With Popup
        </Button> */}
      </Stack>
    </>
  );
}
