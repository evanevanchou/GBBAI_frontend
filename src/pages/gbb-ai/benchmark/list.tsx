import { Helmet } from 'react-helmet-async';

import { BenchmarkManagerView } from 'src/sections/benchmark/view';

// ----------------------------------------------------------------------

export default function BenchmarkPage() {
  return (
    <>
      <Helmet>
        <title> GBB/AI: Benchmark</title>
      </Helmet>

      <BenchmarkManagerView />
    </>
  );
}
