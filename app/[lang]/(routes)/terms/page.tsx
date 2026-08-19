import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function TermsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dictionary.footer.termsOfService}</h1>
      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          Welcome to WeetSpot. By accessing our weather application and services, you agree to be bound by these Terms of Service.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">1. Use of Service</h2>
        <p className="mb-4">
          WeetSpot provides weather forecasting, radar maps, and related meteorological data for personal and commercial use according to your subscription tier.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">2. Accuracy of Information</h2>
        <p className="mb-4">
          While we strive for the highest accuracy, weather prediction is inherently uncertain. WeetSpot B.V. is not liable for damages resulting from decisions made based on our forecasts.
        </p>
      </div>
    </div>
  );
}
