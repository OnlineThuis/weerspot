import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function CookiesPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dictionary.footer.cookiePolicy}</h1>
      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">
          WeetSpot uses cookies to enhance your experience, remember your preferred weather locations, and understand how our service is used.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">Types of Cookies We Use</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., remembering your language preference: EN/NL/FR).</li>
          <li><strong>Functional Cookies:</strong> Used to save your recently searched cities and favorite radar views.</li>
          <li><strong>Analytics Cookies:</strong> Help us understand traffic patterns so we can scale our weather servers during major storm events.</li>
        </ul>
      </div>
    </div>
  );
}
