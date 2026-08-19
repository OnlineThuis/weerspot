import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function CopyrightPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;
  const lang = params.lang as Locale;
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">{dictionary.footer.copyrightPolicy}</h1>
      <div className="prose max-w-none text-gray-700">
        <p className="mb-4">
          All content, design, graphics, compilation, and other matters related to WeetSpot are protected under applicable copyrights, trademarks, and other proprietary rights.
        </p>
        <p className="mb-4">
          Copyright © {new Date().getFullYear()} WeetSpot B.V. All rights reserved.
        </p>
        <h2 className="text-xl font-semibold mt-8 mb-4">DMCA Notice</h2>
        <p className="mb-4">
          If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please contact our legal team at legal@weetspot.com with a detailed description of the alleged infringement.
        </p>
      </div>
    </div>
  );
}
