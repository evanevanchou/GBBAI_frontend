import { Helmet } from 'react-helmet-async';

import { AppCardView } from 'src/sections/app-gallery/view';

// ----------------------------------------------------------------------

export default function AppGalleryPage() {
  return (
    <>
      <Helmet>
        <title> GBB/AI: App Gallery</title>
      </Helmet>

      <AppCardView />
    </>
  );
}
