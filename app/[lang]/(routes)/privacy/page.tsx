import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function PrivacyPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dictionary.footer.privacyPolicy}</h1>
      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          At WeetSpot, your privacy is a top priority. This policy outlines how we collect, use, and protect your personal data when you use our weather services.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Data Collection</h2>
        <p className="mb-4">
          We may collect your location data to provide hyper-local weather forecasts. Location data is only collected with your explicit consent and is never sold to third-party advertisers.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
        <p className="mb-4">
          All data transmitted between your device and our servers is encrypted using industry-standard protocols.
        </p>
      </div>
    </div>
  );
}
