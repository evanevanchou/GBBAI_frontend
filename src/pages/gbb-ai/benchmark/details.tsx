import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { BenchmarkDetailsView } from 'src/sections/benchmark/view';

// ----------------------------------------------------------------------

export default function BenchmarkDetailsPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> GBB/AI: Benchmark Details</title>
      </Helmet>

      <BenchmarkDetailsView id={`${id}`} />
    </>
  );
}
