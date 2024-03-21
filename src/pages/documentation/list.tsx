import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { DocumentationChapterView } from 'src/sections/documentation/view';

// ----------------------------------------------------------------------

export default function DocumentationPage() {
  const params = useParams();

  const { section } = params;
  return (
    <>
      <Helmet>
        <title> GBB/AI: Documentation</title>
      </Helmet>

      <DocumentationChapterView section={`${section}`} />
    </>
  );
}
