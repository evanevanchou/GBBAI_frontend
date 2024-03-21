import { Helmet } from 'react-helmet-async';

import { FunctionManagerView } from 'src/sections/functions/view';

// ----------------------------------------------------------------------

export default function FunctionPage() {
  return (
    <>
      <Helmet>
        <title> GBB/AI: FMM</title>
      </Helmet>

      <FunctionManagerView />
    </>
  );
}
