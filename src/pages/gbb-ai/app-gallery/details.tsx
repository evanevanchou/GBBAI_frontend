import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { AppDetailsView } from 'src/sections/app-gallery/view';

// ----------------------------------------------------------------------

export default function AppGalleryPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> GBB/AI: App Gallery</title>
      </Helmet>

      <AppDetailsView id={`${id}`} />
    </>
  );
}
