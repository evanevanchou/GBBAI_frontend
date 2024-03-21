import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { FunctionDetailsView } from 'src/sections/functions/view';

// ----------------------------------------------------------------------

export default function FunctionDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> GBB/AI: Function Details</title>
      </Helmet>

      <FunctionDetailsView id={`${id}`} />
    </>
  );
}
