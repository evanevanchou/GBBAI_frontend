import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { KbDetailsView } from 'src/sections/kb/view';

// ----------------------------------------------------------------------

export default function KbDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> GBB/AI: KMM Detail</title>
      </Helmet>

      <KbDetailsView id={`${id}`} />
    </>
  );
}
