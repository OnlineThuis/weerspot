import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function DataSourcesPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dictionary.footer.dataSources}</h1>
      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">
          WeetSpot is powered by some of the most reliable meteorological organizations in the world. We aggregate data from multiple models to provide accurate, up-to-the-minute forecasts.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Our Partners & Providers</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>KNMI:</strong> Royal Netherlands Meteorological Institute</li>
          <li><strong>ECMWF:</strong> European Centre for Medium-Range Weather Forecasts</li>
          <li><strong>NOAA/NWS:</strong> National Oceanic and Atmospheric Administration</li>
          <li><strong>DWD:</strong> Deutscher Wetterdienst</li>
        </ul>
        <p className="mt-8">
          All proprietary radar data and satellite imagery are licensed by WeetSpot B.V.
        </p>
      </div>
    </div>
  );
}
