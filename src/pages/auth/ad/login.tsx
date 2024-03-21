import { Helmet } from 'react-helmet-async';

import { ADLoginView } from 'src/sections/auth/ad';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> AD: Login</title>
      </Helmet>

      <ADLoginView />
    </>
  );
}
