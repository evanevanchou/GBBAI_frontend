import { Helmet } from 'react-helmet-async';

import { KbManagerView } from 'src/sections/kb/view';

// ----------------------------------------------------------------------

export default function KbPage() {
  return (
    <>
      <Helmet>
        <title> GBB/AI: KMM</title>
      </Helmet>

      <KbManagerView />
    </>
  );
}
